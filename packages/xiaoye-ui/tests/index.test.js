import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OLD_NODE_ENV = process.env.NODE_ENV;
const SRC_DIR = resolve(__dirname, '../src');

describe('xiaoye-ui', () => {
  let xiaoyeUI;

  beforeAll(async () => {
    process.env.NODE_ENV = 'development';
    xiaoyeUI = await import('..');
  }, 60000);

  afterAll(() => {
    process.env.NODE_ENV = OLD_NODE_ENV;
  });

  it('exports modules correctly', () => {
    const keys = Object.keys(xiaoyeUI);
    expect(keys.length).toBeGreaterThan(0);
    expect(keys).toContain('default');
    expect(keys).toContain('version');
    expect(keys).toContain('install');
  });

  it('包根导出面与提交内容一致（增删公开名必须显式评审）', () => {
    expect(Object.keys(xiaoyeUI).sort()).toMatchSnapshot();
  });

  it('每个有默认导出的组件目录都从包根可达，不会被其他组件的同名导出覆盖', () => {
    const excluded = ['style', 'theme', 'locale', 'version', 'components', 'config'];
    const expected = readdirSync(SRC_DIR, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name)
      .filter(name => !name.startsWith('_') && !name.startsWith('vc-') && !excluded.includes(name))
      .map(name => {
        const entry = ['index.ts', 'index.tsx'].find(ext => existsSync(join(SRC_DIR, name, ext)));
        if (!entry) return null;
        const text = readFileSync(join(SRC_DIR, name, entry), 'utf-8');
        if (!/(^|\n)export default\b/.test(text)) return null;
        const pascal =
          name === 'block-ui'
            ? 'BlockUI'
            : name
                .split('-')
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join('');
        return { name, pascal };
      })
      .filter(Boolean);
    expect(expected.length).toBe(111);
    const missing = expected.filter(({ pascal }) => !(pascal in xiaoyeUI));
    expect(missing.map(item => item.name)).toEqual([]);
  });

  it('过去被 export * 黑名单屏蔽的 API 现在从包根可用', () => {
    for (const name of [
      'RadioGroup',
      'RadioButton',
      'RangePicker',
      'WeekPicker',
      'MonthPicker',
      'QuarterPicker',
      'SubMenu',
      'MenuItemGroup',
      'MenuDivider',
      'ListItemMeta',
      'SelectOption',
    ]) {
      expect(`${name}:${xiaoyeUI[name] === undefined ? 'missing' : 'ok'}`).toBe(`${name}:ok`);
    }
  });
});
