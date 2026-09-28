import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  buildComponentsTs,
  parseModuleExports,
  parseSpecifierList,
  resolveOwners,
  scanComponentExports,
  stripComments,
} from '../scripts/entry-generator.mjs';
import { OWNERSHIP_PINS } from '../scripts/ownership-pins.mjs';

const SRC = resolve(__dirname, '../src');
const EXCLUDE_DIRS = ['_shared', 'style', 'theme', 'locale', 'version', 'components', 'config'];
const PASCAL_OVERRIDES = { 'block-ui': 'BlockUI' };

function mod(
  name,
  { values = [], types = [], own = null, hasDefault = true, hasStyle = false } = {},
) {
  return {
    name,
    entry: join(SRC, name, 'index.ts'),
    hasStyle,
    values: [...values].sort(),
    types: [...types].sort(),
    own: new Set(own ?? [...values, ...types]),
    hasDefault,
    unparsed: [],
    pascalName: name
      .split('-')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(''),
  };
}

describe('stripComments', () => {
  it('去掉行注释与块注释，但保留字符串内容', () => {
    const out = stripComments(`
      // export const fake = 1;
      /* export const alsoFake = 2; */
      const url = 'https://example.com/export real';
      export const truthy = 3;
    `);
    expect(out).not.toMatch(/export const fake/);
    expect(out).not.toMatch(/export const alsoFake/);
    expect(out).toMatch(/export const truthy/);
    // 字符串仍在，但不会成为语句（行首没有 export）
    expect(parseModuleExports(out).values.has('fake')).toBe(false);
  });

  it('不把正则字面量里的斜杠当注释', () => {
    const code = `const re = /a\\/b/; // trailing\nexport const kept = 1;`;
    const parsed = parseModuleExports(code);
    expect(parsed.values.has('kept')).toBe(true);
    expect(parsed.unparsed).toEqual([]);
  });
});

describe('parseModuleExports', () => {
  it('识别就地声明的值与类型，并区分 type/interface', () => {
    const parsed = parseModuleExports(`
      export const a = 1;
      export function b() {}
      export class C {}
      export interface I {}
      export type T = string;
      export default C;
    `);
    expect([...parsed.values].sort()).toEqual(['C', 'a', 'b']);
    expect([...parsed.types].sort()).toEqual(['I', 'T']);
    expect(parsed.hasDefault).toBe(true);
    expect([...parsed.declared].sort()).toEqual(['C', 'I', 'T', 'a', 'b']);
  });

  it('识别别名与内联 type 修饰符的具名 re-export', () => {
    const parsed = parseModuleExports(`
      export { default as Widget, type WidgetProps, Inner as Outer } from './Widget';
    `);
    expect(parsed.values.has('Widget')).toBe(true);
    expect(parsed.values.has('Outer')).toBe(true);
    expect(parsed.types.has('WidgetProps')).toBe(true);
    // 跨文件 re-export 不算就地声明，冲突归属时应让给真正声明方
    expect(parsed.declared.size).toBe(0);
    expect(parsed.starFrom).toEqual([
      { spec: './Widget', only: ['Widget', 'WidgetProps', 'Outer'] },
    ]);
  });

  it('识别整表 re-export 与跨行写法', () => {
    const parsed = parseModuleExports(`
      export * from './dayjs';
      export {
        one,
        two,
      } from './x';
    `);
    expect(parsed.starFrom).toContainEqual({ spec: './dayjs', only: null });
    expect(parsed.values.has('one')).toBe(true);
    expect(parsed.values.has('two')).toBe(true);
  });

  it('不会把注释掉的导出语句计入', () => {
    const parsed = parseModuleExports(`// export const ghost = 1;\nexport const real = 2;`);
    expect(parsed.values.has('ghost')).toBe(false);
    expect(parsed.values.has('real')).toBe(true);
  });

  it('parseSpecifierList 处理 type 前缀与 as 别名', () => {
    expect(parseSpecifierList('type A, B as C, default as D')).toEqual([
      { name: 'A', typeOnly: true },
      { name: 'C', typeOnly: false },
      { name: 'D', typeOnly: false },
    ]);
  });
});

describe('resolveOwners / buildComponentsTs 歧义消解', () => {
  it('两个目录同名导出时，只生成一条显式定主语句', () => {
    const mods = [
      mod('alpha', { types: ['SharedProps'] }),
      mod('beta', { types: ['SharedProps'] }),
    ];
    const { code, owners } = buildComponentsTs(mods);
    expect(owners.get('SharedProps').owner).toBe('alpha');
    expect(code).toContain("export type { SharedProps } from './alpha';");
    expect(code).not.toContain("export type { SharedProps } from './beta';");
    expect(code).toContain("export * from './beta';");
  });

  it('目录名正是该名字的规范拥有者时优先归给它（不靠字典序）', () => {
    const mods = [mod('aardvark', { values: ['Radio'] }), mod('radio', { values: ['Radio'] })];
    // 两个目录都就地声明，字典序会给 aardvark；canonical 规则应给 radio
    expect(resolveOwners(mods).get('Radio').owner).toBe('radio');
  });

  it('只有一个目录就地声明时归给它，另一个只是转发', () => {
    const mods = [
      mod('aaa', { types: ['Helper'], own: [] }),
      mod('zzz', { types: ['Helper'], own: ['Helper'] }),
    ];
    expect(resolveOwners(mods).get('Helper').owner).toBe('zzz');
  });

  it('值冲突用 export 语句、类型冲突用 export type 语句', () => {
    const mods = [
      mod('m1', { values: ['Shared'], types: ['SharedShape'] }),
      mod('m2', { values: ['Shared'], types: ['SharedShape'] }),
    ];
    const { code } = buildComponentsTs(mods);
    expect(code).toMatch(/^export \{ Shared \} from '\.\/m1';$/m);
    expect(code).toMatch(/^export type \{ SharedShape \} from '\.\/m1';$/m);
  });

  it('pin 覆盖自动规则，且失效 pin 会被报告', () => {
    const mods = [mod('aaa', { types: ['Shared'] }), mod('zzz', { types: ['Shared'] })];
    expect(resolveOwners(mods, { Shared: 'zzz' }).get('Shared').owner).toBe('zzz');

    const single = [mod('aaa', { types: ['Shared'] })];
    expect(resolveOwners(single, { Shared: 'aaa' }).stalePins).toHaveLength(1);

    const wrongPin = resolveOwners(mods, { Shared: 'nonexistent' });
    expect(wrongPin.stalePins).toHaveLength(1);
    // pin 指向不存在的目录时不能抛错，仍要能定主
    expect(wrongPin.get('Shared').owner).toBe('aaa');
  });

  it('默认导出转成同名 Pascal 时不会重复导出', () => {
    const mods = [mod('foo-bar'), mod('fooBar')];
    const { code, droppedDefaults } = buildComponentsTs(mods);
    const occurrences = (code.match(/export \{ default as /g) ?? []).length;
    expect(occurrences).toBe(1);
    expect(droppedDefaults).toHaveLength(1);
  });
});

describe('真实 src/ 扫描结果', () => {
  const mods = scanComponentExports(SRC, EXCLUDE_DIRS, PASCAL_OVERRIDES);

  it('112 个组件目录全部解析成功，没有无法识别的导出语句', () => {
    expect(mods).toHaveLength(112);
    expect(mods.flatMap(m => m.unparsed)).toEqual([]);
    // icon 目录是有意只有默认导出的薄封装，其余目录都必须至少有一个命名导出
    expect(mods.filter(m => !m.values.length && !m.types.length).map(m => m.name)).toEqual([
      'icon',
    ]);
  });

  it('每个组件都有默认导出（黑名单时代的 NO_DEFAULT_EXPORT_DIRS 例外不再需要）', () => {
    const noDefault = mods.filter(m => !m.hasDefault).map(m => m.name);
    expect(noDefault).toEqual(['table-core']);
  });

  it('歧义名全部落在预期的拥有者上', () => {
    const owners = resolveOwners(mods, OWNERSHIP_PINS);
    expect([...owners].map(([n, v]) => [n, v.owner])).toEqual(
      expect.arrayContaining([
        ['ColumnType', 'table'],
        ['LabeledValue', 'tree-select'],
        ['SelectValue', 'tree-select'],
        ['BackTopProps', 'back-top'],
        ['ColProps', 'grid'],
        ['RowProps', 'grid'],
        ['MenuItem', 'context-menu'],
      ]),
    );
    expect(owners.stalePins).toEqual([]);
  });

  it('原先被拉黑的目录现在都走 export *', () => {
    const { code } = buildComponentsTs(mods, OWNERSHIP_PINS);
    for (const dir of [
      'radio',
      'menu',
      'date-picker',
      'select',
      'cascader',
      'list',
      'message',
      'back-top',
      'col',
      'row',
      'icon',
    ]) {
      expect(code).toContain(`export * from './${dir}';`);
    }
  });

  it('生成的聚合入口不存在重复的显式导出名', () => {
    const { code } = buildComponentsTs(mods, OWNERSHIP_PINS);
    const explicit = [];
    for (const m of code.matchAll(/^export (?:type )?\{([^}]+)\} from '[^']+';$/gm)) {
      for (const token of m[1].split(',')) {
        const t = token.trim();
        if (!t) continue;
        explicit.push(
          /\s+as\s+/.test(t)
            ? t
                .split(/\s+as\s+/)
                .pop()
                .trim()
            : t.replace(/^type\s+/, ''),
        );
      }
    }
    const dupes = explicit.filter((n, i) => explicit.indexOf(n) !== i);
    expect(dupes).toEqual([]);
    expect(code).toMatch(/^export \* from '\.\/radio';$/m);
  });

  it('src/components.ts 与生成器输出一致（构建期由 prebuild 强校验）', () => {
    const committed = readFileSync(join(SRC, 'components.ts'), 'utf-8');
    expect(committed).toBe(buildComponentsTs(mods, OWNERSHIP_PINS).code);
  });
});
