#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * 组件入口聚合生成器（CLI）
 *
 *   pnpm gen:entries    →  node scripts/gen-entries.mjs --write   重新生成三个产物
 *   pnpm check:entries  →  node scripts/gen-entries.mjs --check   只校验是否新鲜，漂移则退出码 1
 *
 * 不带参数等价于 --write。
 *
 * 产物：
 *   1. src/components.ts    组件聚合入口（`export *` + 歧义名显式定主）
 *   2. typings/global.d.ts  Vue GlobalComponents 声明
 *   3. package.json exports 每个组件的 ./<name> 与 ./<name>/style 双入口（开发期指向 src）
 *
 * 约定：产物纳入版本控制，构建（prebuild）只做校验不做改写，避免 tracked 文件被静默修改。
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildComponentsTs,
  buildExportsField,
  buildGlobalDts,
  scanComponentExports,
} from './entry-generator.mjs';
import { OWNERSHIP_PINS } from './ownership-pins.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, '..');
const srcDir = resolve(pkgRoot, 'src');

// 语义上不是组件、由人判断的例外（静态分析无法区分「默认导出是组件」还是「默认导出是工具对象」）
const EXCLUDE_DIRS = ['_shared', 'style', 'theme', 'locale', 'version', 'components', 'config'];
const NON_COMPONENT_DIRS = ['grid', 'message', 'notification'];
const PASCAL_NAME_OVERRIDES = { 'block-ui': 'BlockUI' };

const wantWrite = process.argv.includes('--write');
const wantCheck = process.argv.includes('--check');
if (wantWrite && wantCheck) {
  console.error('[gen-entries] --write 与 --check 互斥；校验请运行 `pnpm check:entries`');
  process.exit(2);
}
const mode = wantCheck ? 'check' : 'write';
const files = {
  components: resolve(srcDir, 'components.ts'),
  globalDts: resolve(pkgRoot, 'typings', 'global.d.ts'),
  pkg: resolve(pkgRoot, 'package.json'),
};

const modules = scanComponentExports(srcDir, EXCLUDE_DIRS, PASCAL_NAME_OVERRIDES);
if (!modules.length) {
  console.error('[gen-entries] 未扫描到任何组件目录，请检查 src/ 路径');
  process.exit(1);
}

const { code: componentsTs, owners, droppedDefaults } = buildComponentsTs(modules, OWNERSHIP_PINS);
const stalePins = owners.stalePins ?? [];
const globalDts = buildGlobalDts(modules, NON_COMPONENT_DIRS);
const exportsField = buildExportsField(modules, srcDir);

const unparsed = modules.flatMap(mod => mod.unparsed);
if (unparsed.length) {
  console.warn(`[gen-entries] ${unparsed.length} 条导出语句未被识别（可能漏掉导出名）：`);
  for (const text of unparsed.slice(0, 10)) console.warn(`  - ${text}`);
}
if (droppedDefaults.length) {
  console.warn(`[gen-entries] 默认导出名冲突，已跳过：\n  - ${droppedDefaults.join('\n  - ')}`);
}
if (stalePins.length) {
  const message = `[gen-entries] scripts/ownership-pins.mjs 中的 pin 已失效，请删除：\n  - ${stalePins.join('\n  - ')}`;
  if (mode === 'check') {
    console.error(message);
    process.exit(1);
  }
  console.warn(message);
}

function readIf(path) {
  return existsSync(path) ? readFileSync(path, 'utf-8') : null;
}

function serializePkg(raw, nextExports) {
  const pkg = JSON.parse(raw);
  pkg.exports = nextExports;
  return `${JSON.stringify(pkg, null, 2)}\n`;
}

const current = {
  components: readIf(files.components),
  globalDts: readIf(files.globalDts),
  pkgRaw: readIf(files.pkg),
};
const pkgTs = current.pkgRaw ? serializePkg(current.pkgRaw, exportsField) : null;
const drift = [
  ['src/components.ts', current.components, componentsTs],
  ['typings/global.d.ts', current.globalDts, globalDts],
  ['package.json exports', current.pkgRaw, pkgTs],
].filter(([, before, after]) => after !== null && before !== after);

if (mode === 'write') {
  writeFileSync(files.components, componentsTs, 'utf-8');
  writeFileSync(files.globalDts, globalDts, 'utf-8');
  writeFileSync(files.pkg, pkgTs, 'utf-8');
  console.log(
    `[gen-entries] 已生成：${modules.length} 个组件、${Object.keys(exportsField).length} 个 exports 入口、` +
      `${owners.size} 个歧义导出名已自动定主`,
  );
  process.exit(0);
}

if (drift.length) {
  console.error('[gen-entries] 检测到生成物与源码不一致（drift）：');
  for (const [name] of drift) console.error(`  - ${name}`);
  console.error('\n新增/改名/删除组件后请运行：pnpm --filter xiaoye-ui gen:entries');
  console.error('然后把生成的 src/components.ts、typings/global.d.ts、package.json 一起提交。');
  process.exit(1);
}

console.log(
  `[gen-entries] 生成物新鲜：${modules.length} 个组件、${Object.keys(exportsField).length} 个 exports 入口、` +
    `${owners.size} 个歧义导出名`,
);
