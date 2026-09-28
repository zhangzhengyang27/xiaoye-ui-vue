/**
 * 导出聚合生成器
 *
 * 静态扫描 src/ 下每个组件目录的入口，解析其对外暴露的导出名（值 / 类型分开），
 * 据此生成 src/components.ts、typings/global.d.ts 与 package.json exports。
 *
 * 关键点是「歧义导出消解」：src/components.ts 用 `export *` 聚合所有组件，
 * 一旦两个组件目录暴露了同名导出（例如都导出 `XxxProps`），TS 会报 TS2308
 * 并让 typecheck 失败。这里改为扫描出冲突名、选出一个 owner 并显式 re-export
 * （显式导出优先级高于 star），因此不再需要手工维护黑名单。
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const RESOLVE_EXTENSIONS = ['.ts', '.tsx', '.js', '/index.ts', '/index.tsx', '/index.js'];
const IDENT_RE = /^[A-Za-z_$][\w$]*$/;

/** 去掉行注释、块注释，保留字符串/正则字面量原样，避免其中的 `export` 文本被误判 */
export function stripComments(code) {
  let out = '';
  let i = 0;
  const n = code.length;
  const isRegexStart = () => {
    const tail = out.replace(/\s+$/, '');
    if (!tail) return true;
    if ('(,=:[!&|?{};+-*%<>~^'.includes(tail[tail.length - 1])) return true;
    return /(return|typeof|case|in|of|do|else|void|delete|instanceof|yield|await)$/.test(tail);
  };

  while (i < n) {
    const c = code[i];
    const next = code[i + 1];

    if (c === '/' && next === '/') {
      i += 2;
      while (i < n && code[i] !== '\n') i += 1;
      continue;
    }
    if (c === '/' && next === '*') {
      i += 2;
      while (i < n && !(code[i] === '*' && code[i + 1] === '/')) i += 1;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      out += c;
      i += 1;
      while (i < n) {
        if (code[i] === '\\') {
          out += code[i] + (code[i + 1] ?? '');
          i += 2;
          continue;
        }
        if (code[i] === quote) {
          out += code[i];
          i += 1;
          break;
        }
        if (quote === '`' && code[i] === '$' && code[i + 1] === '{') {
          let depth = 1;
          i += 2;
          while (i < n && depth > 0) {
            if (code[i] === '{') depth += 1;
            else if (code[i] === '}') depth -= 1;
            i += 1;
          }
          continue;
        }
        if (code[i] === '\n' && quote !== '`') {
          break;
        }
        out += code[i];
        i += 1;
      }
      continue;
    }
    if (c === '/' && isRegexStart()) {
      let j = i + 1;
      let inClass = false;
      while (j < n) {
        const d = code[j];
        if (d === '\\') {
          j += 2;
          continue;
        }
        if (d === '[') inClass = true;
        else if (d === ']') inClass = false;
        else if (d === '\n') break;
        else if (d === '/' && !inClass) break;
        j += 1;
      }
      if (code[j] === '/') {
        out += code.slice(i, j + 1);
        i = j + 1;
        continue;
      }
    }
    out += c;
    i += 1;
  }
  return out;
}

/** 解析 `{ A, B as C, type D, default as E }` 里的导出名 */
export function parseSpecifierList(inner) {
  const result = [];
  for (const raw of inner.split(',')) {
    let token = raw.trim();
    if (!token) continue;
    let typeOnly = false;
    if (/^type\s+/.test(token)) {
      typeOnly = true;
      token = token.replace(/^type\s+/, '').trim();
    }
    const asMatch = /^(.+?)\s+as\s+(.+)$/.exec(token);
    const source = (asMatch ? asMatch[1] : token).trim();
    const exported = (asMatch ? asMatch[2] : token).trim();
    if (!IDENT_RE.test(exported)) continue;
    if (!asMatch && !IDENT_RE.test(source)) continue;
    result.push({ name: exported, typeOnly });
  }
  return result;
}

/** 返回与 start 处 `{` 配对的 `}` 下标 */
function matchBrace(code, start) {
  let depth = 0;
  for (let i = start; i < code.length; i += 1) {
    if (code[i] === '{') depth += 1;
    else if (code[i] === '}' && --depth === 0) return i;
  }
  return -1;
}

/**
 * 解析单个模块文件中的导出语句。
 * @returns {{ values: Set<string>, types: Set<string>, declared: Set<string>,
 *   starFrom: Array<{spec: string, only: string[]|null}>, hasDefault: boolean, unparsed: string[] }}
 * - values/types：本文件直接暴露的名字（不含 star 带来的）
 * - declared：本文件就地声明的名字，冲突时用于判定归属
 * - starFrom：需要继续跟踪的相对路径；only 非空表示具名 re-export
 */
export function parseModuleExports(code) {
  const src = stripComments(code);
  const values = new Set();
  const types = new Set();
  const declared = new Set();
  const starFrom = [];
  const unparsed = [];
  let hasDefault = false;

  const stmtRe = /^[ \t]*export\s/gm;
  let m;
  while ((m = stmtRe.exec(src))) {
    const after = m.index + m[0].length;
    const rest = src.slice(after);

    if (/^default\b/.test(rest)) {
      hasDefault = true;
      continue;
    }

    const starMatch = /^\*(?:\s+as\s+([A-Za-z_$][\w$]*))?\s*(?:from\s*)?['"]([^'"]+)['"]/.exec(
      rest,
    );
    if (starMatch) {
      if (starMatch[1]) values.add(starMatch[1]);
      else starFrom.push({ spec: starMatch[2], only: null });
      continue;
    }

    const braceMatch = /^(type\s*)?\{/.exec(rest);
    if (braceMatch) {
      const open = after + braceMatch[0].length - 1;
      const close = matchBrace(src, open);
      if (close < 0) {
        unparsed.push(rest.slice(0, 60).replace(/\s+/g, ' '));
        continue;
      }
      const specifiers = parseSpecifierList(src.slice(open + 1, close));
      const fromMatch = /^\s*from\s*['"]([^'"]+)['"]/.exec(src.slice(close + 1));
      const statementIsType = Boolean(braceMatch[1]);
      for (const spec of specifiers) {
        (statementIsType || spec.typeOnly ? types : values).add(spec.name);
        if (!fromMatch) declared.add(spec.name);
      }
      if (fromMatch && fromMatch[1].startsWith('.')) {
        starFrom.push({
          spec: fromMatch[1],
          only: specifiers.map(spec => spec.name),
        });
      }
      stmtRe.lastIndex = close + 1;
      continue;
    }

    const declMatch =
      /^(?:declare\s+)?(async\s+function|function|abstract\s+class|class|const|let|var|interface|enum|type)\s+([A-Za-z_$][\w$]*)/.exec(
        rest,
      );
    if (declMatch) {
      const keyword = declMatch[1].replace(/\s+/g, '');
      const name = declMatch[2];
      (keyword === 'type' || keyword === 'interface' ? types : values).add(name);
      declared.add(name);
      continue;
    }

    unparsed.push(rest.slice(0, 60).replace(/\s+/g, ' '));
  }

  return { values, types, declared, starFrom, hasDefault, unparsed };
}

function resolveRelative(fromFile, spec, srcRoot) {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), spec);
  if (!base.startsWith(srcRoot + sep)) return null;
  if (/\.(json|less|css|vue|md)$/.test(base)) return null;
  if (existsSync(base) && statSync(base).isFile()) return base;
  return (
    RESOLVE_EXTENSIONS.map(ext => base + ext).find(p => existsSync(p) && statSync(p).isFile()) ??
    null
  );
}

/**
 * 递归收集一个入口文件最终对外暴露的名字。
 * own 记录其中「在本组件目录内就地声明」的名字，冲突时用于判定归属。
 */
export function collectModuleNames(entryFile, srcRoot) {
  const root = resolve(srcRoot);
  const cache = new Map();
  const unparsed = [];

  const dirOwnerOf = file => {
    const rel = relative(root, file);
    return rel.startsWith('..') ? null : rel.split(sep)[0];
  };
  const moduleDir = dirOwnerOf(resolve(entryFile));
  const own = new Set();

  function visit(file, seen) {
    if (cache.has(file)) return cache.get(file);
    if (seen.has(file)) return { values: new Set(), types: new Set(), declared: new Set() };
    seen.add(file);

    const parsed = parseModuleExports(readFileSync(file, 'utf-8'));
    for (const text of parsed.unparsed) unparsed.push(`${relative(root, file)}: ${text}`);
    const acc = {
      values: new Set(parsed.values),
      types: new Set(parsed.types),
      declared: new Set(parsed.declared),
    };
    if (dirOwnerOf(file) === moduleDir) {
      for (const name of acc.declared) own.add(name);
    }

    for (const { spec, only } of parsed.starFrom) {
      const target = resolveRelative(file, spec, root);
      if (!target) continue;
      const inner = visit(target, seen);
      for (const name of inner.values) if (!only || only.includes(name)) acc.values.add(name);
      for (const name of inner.types) if (!only || only.includes(name)) acc.types.add(name);
    }

    cache.set(file, acc);
    return acc;
  }

  const result = visit(resolve(entryFile), new Set());
  return {
    values: [...result.values].sort(),
    types: [...result.types].sort(),
    own: [...own].sort(),
    hasDefault: parseModuleExports(readFileSync(entryFile, 'utf-8')).hasDefault,
    unparsed,
  };
}

export function toPascalCase(name, overrides = {}) {
  if (overrides[name]) return overrides[name];
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function findEntry(dirPath) {
  for (const entry of ['index.ts', 'index.tsx']) {
    if (existsSync(join(dirPath, entry))) return join(dirPath, entry);
  }
  return null;
}

export function makeDirFilter(srcRoot, excludeDirs) {
  return name => {
    if (name.startsWith('_') || name.startsWith('.') || name.startsWith('vc-')) return false;
    if (excludeDirs.includes(name)) return false;
    return statSync(join(srcRoot, name)).isDirectory();
  };
}

/** 扫描所有组件目录的导出面 */
export function scanComponentExports(srcRoot, excludeDirs, pascalOverrides = {}) {
  const root = resolve(srcRoot);
  const modules = [];
  for (const name of readdirSync(root).filter(makeDirFilter(root, excludeDirs))) {
    const dirPath = join(root, name);
    const entry = findEntry(dirPath);
    if (!entry) continue;
    const collected = collectModuleNames(entry, root);
    modules.push({
      name,
      entry,
      hasStyle: Boolean(findEntry(join(dirPath, 'style'))),
      values: collected.values,
      types: collected.types,
      own: new Set(collected.own),
      hasDefault: collected.hasDefault,
      unparsed: collected.unparsed,
      pascalName: toPascalCase(name, pascalOverrides),
    });
  }
  return modules.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 计算冲突导出的 owner。
 * 优先级：手工 pin → 目录名正是该名字的规范拥有者 → 只有一个候选目录就地声明了它 → 目录名字典序最小。
 * pin 仅用于锁定「已经发布出去的归属」，新增组件之间的冲突不需要配 pin。
 */
export function resolveOwners(modules, pins = {}) {
  const candidates = new Map();
  for (const mod of modules) {
    for (const name of new Set([...mod.values, ...mod.types])) {
      if (!candidates.has(name)) candidates.set(name, []);
      candidates.get(name).push(mod);
    }
  }

  const owners = new Map();
  const stalePins = [];
  for (const [name, mods] of candidates) {
    if (mods.length < 2) {
      if (pins[name]) stalePins.push(`${name}: pin 指向 ./${pins[name]}，但该名已不再冲突`);
      continue;
    }
    const dirs = mods.map(mod => mod.name).sort();
    const pinned = pins[name];
    let pool;
    if (pinned) {
      if (!dirs.includes(pinned)) {
        stalePins.push(
          `${name}: pin 指向 ./${pinned}，但它并未参与冲突（冲突方：${dirs.join(', ')}）`,
        );
        pool = null;
      } else {
        pool = [pinned];
      }
    }
    if (!pool) {
      const canonical = dirs.filter(dir => toPascalCase(dir) === name);
      const declaredHere = dirs.filter(dir => mods.find(mod => mod.name === dir).own.has(name));
      pool = canonical.length ? canonical : declaredHere.length === 1 ? declaredHere : dirs;
    }
    const [owner] = pool;
    owners.set(name, {
      owner,
      losers: dirs.filter(dir => dir !== owner),
      kind: mods.find(mod => mod.name === owner).values.includes(name) ? 'value' : 'type',
    });
  }
  owners.stalePins = stalePins;
  return owners;
}

/** 生成 src/components.ts */
export function buildComponentsTs(modules, pins = {}) {
  const owners = resolveOwners(modules, pins);

  // 两个目录的 PascalCase 名相同时默认导出无法共存，保留字典序第一个
  const pascalOwner = new Map();
  const droppedDefaults = [];
  for (const mod of modules) {
    if (!mod.hasDefault) continue;
    if (pascalOwner.has(mod.pascalName)) {
      droppedDefaults.push(`${mod.pascalName} (来自 ./${mod.name})`);
      continue;
    }
    pascalOwner.set(mod.pascalName, mod.name);
  }

  const lines = [
    '// Auto-Generated by scripts/gen-entries.mjs - DO NOT EDIT',
    '// prettier-ignore',
    '/* eslint-disable import/export */',
    '',
  ];
  for (const mod of modules) {
    lines.push(`export * from './${mod.name}';`);
    if (mod.hasDefault && pascalOwner.get(mod.pascalName) === mod.name) {
      lines.push(`export { default as ${mod.pascalName} } from './${mod.name}';`);
    }
    if (mod.hasStyle) lines.push(`import './${mod.name}/style';`);
    lines.push('');
  }

  if (owners.size) {
    const byDir = { type: new Map(), value: new Map() };
    for (const [name, { owner, kind }] of owners) {
      const bucket = byDir[kind];
      if (!bucket.has(owner)) bucket.set(owner, []);
      bucket.get(owner).push(name);
    }
    lines.push('// === 歧义导出消解：显式 re-export 优先于 `export *`，用于定名冲突归属 ===');
    for (const kind of ['type', 'value']) {
      for (const [dir, names] of [...byDir[kind]].sort((a, b) => a[0].localeCompare(b[0]))) {
        const list = [...names].sort().join(', ');
        lines.push(
          kind === 'type'
            ? `export type { ${list} } from './${dir}';`
            : `export { ${list} } from './${dir}';`,
        );
      }
    }
    lines.push('');
  }

  return {
    code: lines.join('\n'),
    owners,
    droppedDefaults,
  };
}

/** 生成 typings/global.d.ts */
export function buildGlobalDts(modules, nonComponentDirs) {
  const lines = [
    '/* eslint-disable @typescript-eslint/consistent-type-imports */',
    '// Auto-Generated by scripts/gen-entries.mjs - DO NOT EDIT',
    "declare module 'vue' {",
    '  export interface GlobalComponents {',
  ];
  for (const mod of modules) {
    if (!mod.hasDefault || nonComponentDirs.includes(mod.name)) continue;
    lines.push(`    XY${mod.pascalName}: (typeof import('xiaoye-ui'))['${mod.pascalName}'];`);
  }
  lines.push('  }', '}', 'export {};');
  return `${lines.join('\n')}\n`;
}

/** 生成 package.json 的 exports（开发期指向 src） */
export function buildExportsField(modules, srcRoot) {
  const root = resolve(srcRoot);
  const exports = {
    '.': { types: './src/index.ts', import: './src/index.ts' },
    './package.json': './package.json',
  };
  for (const mod of modules) {
    exports[`./${mod.name}`] = {
      types: `./src/${relative(root, mod.entry)}`,
      import: `./src/${relative(root, mod.entry)}`,
    };
    if (mod.hasStyle) {
      const styleEntry = findEntry(join(root, mod.name, 'style'));
      exports[`./${mod.name}/style`] = `./src/${relative(root, styleEntry)}`;
    }
  }
  const localeIndex = findEntry(join(root, 'locale'));
  if (localeIndex) {
    exports['./es/locale'] = {
      types: `./src/${relative(root, localeIndex)}`,
      import: `./src/${relative(root, localeIndex)}`,
    };
    exports['./es/locale/*'] = { types: './src/locale/*.ts', import: './src/locale/*.ts' };
  }
  return exports;
}
