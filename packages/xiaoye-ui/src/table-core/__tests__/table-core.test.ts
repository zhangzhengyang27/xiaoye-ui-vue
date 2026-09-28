import { describe, it, expect } from 'vitest';
import { createTableEngine } from '../engine';
import { paginate } from '../pagination';
import { sortMultipleFlat, sortSingleFlat, sortSingleTree } from '../sorting';
import { filterFlat } from '../filtering';
import { FilterMatchMode, FilterOperator } from '../filterService';
import { getActiveFilters, hasFilters, hasGlobalFilter, isNodeLeaf } from '../utils';

const numbers = [{ n: 3 }, { n: 1 }, { n: 2 }];
const withNull = [{ n: 2 }, { n: null }, { n: 1 }];
const nested = [
  { user: { name: 'carol' } },
  { user: { name: 'alice' } },
  { user: { name: 'bob' } },
];

describe('table-core/paginate', () => {
  const data = [1, 2, 3, 4, 5];

  it('按 first/rows 切片', () => {
    expect(paginate(data, 0, 2)).toEqual([1, 2]);
    expect(paginate(data, 2, 2)).toEqual([3, 4]);
  });

  it('越界时返回剩余部分，而不是报错', () => {
    expect(paginate(data, 4, 10)).toEqual([5]);
    expect(paginate(data, 99, 10)).toEqual([]);
  });

  it('空数据与非数组输入返回空数组', () => {
    expect(paginate([], 0, 10)).toEqual([]);
    expect(paginate(undefined as any, 0, 10)).toEqual([]);
  });
});

describe('table-core/sortSingleFlat', () => {
  it('升序与降序', () => {
    expect(sortSingleFlat(numbers, { sortField: 'n', sortOrder: 1 }).map(r => r.n)).toEqual([
      1, 2, 3,
    ]);
    expect(sortSingleFlat(numbers, { sortField: 'n', sortOrder: -1 }).map(r => r.n)).toEqual([
      3, 2, 1,
    ]);
  });

  it('不修改入参数组', () => {
    const input = [...numbers];
    const result = sortSingleFlat(input, { sortField: 'n', sortOrder: 1 });
    expect(result).not.toBe(input);
    expect(input.map(r => r.n)).toEqual([3, 1, 2]);
  });

  it('sortOrder 为 null 时保持原顺序（removableSort 归零）', () => {
    expect(
      sortSingleFlat(numbers, { sortField: 'n', sortOrder: null as any }).map(r => r.n),
    ).toEqual([3, 1, 2]);
    expect(sortSingleFlat(numbers, { sortField: 'n' } as any).map(r => r.n)).toEqual([3, 1, 2]);
  });

  it('字符串按 locale 比较', () => {
    expect(
      sortSingleFlat(nested, { sortField: 'user.name', sortOrder: 1 }).map(r => r.user.name),
    ).toEqual(['alice', 'bob', 'carol']);
  });

  it('空值默认沉底，nullSortOrder=-1 时置顶', () => {
    expect(sortSingleFlat(withNull, { sortField: 'n', sortOrder: 1 }).map(r => r.n)).toEqual([
      1,
      2,
      null,
    ]);
    expect(
      sortSingleFlat(withNull, { sortField: 'n', sortOrder: 1, nullSortOrder: -1 }).map(r => r.n),
    ).toEqual([null, 1, 2]);
  });
});

describe('table-core/sortMultipleFlat', () => {
  const rows = [
    { group: 'a', order: 2 },
    { group: 'b', order: 1 },
    { group: 'a', order: 1 },
  ];

  it('无 multiSortMeta 时原样返回', () => {
    expect(sortMultipleFlat(rows, { multiSortMeta: [] } as any).map(r => r.order)).toEqual([
      2, 1, 1,
    ]);
  });

  it('前一个字段相等时用后一个字段决定次序', () => {
    const result = sortMultipleFlat(rows, {
      multiSortMeta: [
        { field: 'group', order: 1 },
        { field: 'order', order: -1 },
      ],
    } as any);
    expect(result.map(r => [r.group, r.order])).toEqual([
      ['a', 2],
      ['a', 1],
      ['b', 1],
    ]);
  });
});

describe('table-core/sortSingleTree', () => {
  const nodes = [
    { data: { n: 2 }, children: [{ data: { n: 3 } }, { data: { n: 1 } }] },
    { data: { n: 1 }, children: [{ data: { n: 5 } }, { data: { n: 4 } }] },
  ];

  it('按 node.data 排序并递归处理 children', () => {
    const result = sortSingleTree(nodes, { sortField: 'n', sortOrder: 1 });
    expect(result.map(node => node.data.n)).toEqual([1, 2]);
    expect(result[0].children.map((c: any) => c.data.n)).toEqual([4, 5]);
    expect(result[1].children.map((c: any) => c.data.n)).toEqual([1, 3]);
  });

  it('不修改入参节点对象', () => {
    const result = sortSingleTree(nodes, { sortField: 'n', sortOrder: 1 });
    expect(result[1]).not.toBe(nodes[0]);
    expect(nodes[0].data.n).toBe(2);
  });
});

describe('table-core/filterFlat', () => {
  const rows = [
    { name: 'apple', count: 3 },
    { name: 'banana', count: 7 },
    { name: 'cherry', count: 3 },
  ];
  const columns = [{ field: 'name' }, { field: 'count' }];
  const columnProp = (col: any, key: string) => col[key];

  it('单字段 startsWith 过滤', () => {
    const result = filterFlat(rows, {
      filters: { name: { value: 'a', matchMode: FilterMatchMode.STARTS_WITH } },
      columns,
      columnProp,
    } as any);
    expect(result.map(r => r.name)).toEqual(['apple']);
  });

  it('同字段多约束按 operator 取并集或交集', () => {
    const orResult = filterFlat(rows, {
      filters: {
        name: {
          operator: FilterOperator.OR,
          constraints: [
            { value: 'apple', matchMode: FilterMatchMode.EQUALS },
            { value: 'banana', matchMode: FilterMatchMode.EQUALS },
          ],
        },
      },
    } as any);
    expect(orResult.map(r => r.name)).toEqual(['apple', 'banana']);

    const andResult = filterFlat(rows, {
      filters: {
        name: {
          operator: FilterOperator.AND,
          constraints: [
            { value: 'apple', matchMode: FilterMatchMode.EQUALS },
            { value: 'banana', matchMode: FilterMatchMode.EQUALS },
          ],
        },
      },
    } as any);
    expect(andResult).toEqual([]);
  });

  it('空串约束是所有匹配器的“无过滤”语义，全部放行', () => {
    const result = filterFlat(rows, {
      filters: { name: { value: '', matchMode: FilterMatchMode.EQUALS } },
    } as any);
    expect(result.map(r => r.name)).toEqual(['apple', 'banana', 'cherry']);
  });

  it('global 过滤覆盖 globalFilterFields 里的所有字段', () => {
    const result = filterFlat(rows, {
      filters: { global: { value: '7', matchMode: FilterMatchMode.CONTAINS } },
      globalFilterFields: ['count'],
    } as any);
    expect(result.map(r => r.name)).toEqual(['banana']);
  });

  it('data 为 null 时返回 undefined（区别于空结果）', () => {
    expect(filterFlat(null as any, { filters: {} } as any)).toBeUndefined();
  });
});

describe('table-core/utils', () => {
  it('hasFilters 只判断是否存在过滤条件对象', () => {
    expect(hasFilters(undefined)).toBe(false);
    expect(hasFilters({})).toBe(false);
    expect(hasFilters({ name: { value: '', matchMode: 'equals' } })).toBe(true);
  });

  it('hasGlobalFilter 只看 global 键是否存在（值可以为空串）', () => {
    expect(hasGlobalFilter({ name: { value: 'x' } })).toBe(false);
    expect(hasGlobalFilter({ global: { value: '', matchMode: 'contains' } })).toBe(true);
  });

  it('getActiveFilters 丢弃 value 为 null 的约束，保留空串', () => {
    expect(
      Object.keys(getActiveFilters({ a: { value: null }, b: { value: '' }, c: { value: 'v' } })),
    ).toEqual(['b', 'c']);
    const nested = getActiveFilters({
      a: { constraints: [{ value: null }, { value: 'x' }] },
      b: { constraints: [{ value: null }] },
    });
    expect(Object.keys(nested)).toEqual(['a']);
    expect(nested.a.constraints).toEqual([{ value: 'x' }]);
  });

  it('isNodeLeaf 依据 children 判定叶子', () => {
    expect(isNodeLeaf({ data: {} })).toBe(true);
    expect(isNodeLeaf({ data: {}, children: [] })).toBe(true);
    expect(isNodeLeaf({ data: {}, children: [{ data: {} }] })).toBe(false);
    expect(isNodeLeaf({ data: {}, children: [{ data: {} }], leaf: false })).toBe(false);
  });
});

describe('table-core/createTableEngine 分派', () => {
  it('flat 引擎直接读记录字段', () => {
    const engine = createTableEngine({ dataShape: 'flat', processOrder: 'filter-first' });
    expect(engine.sortSingle(numbers, { sortField: 'n', sortOrder: 1 }).map(r => r.n)).toEqual([
      1, 2, 3,
    ]);
    expect(engine.paginate([1, 2, 3, 4], 2, 5)).toEqual([3, 4]);
  });

  it('tree 引擎读 node.data 并递归 children', () => {
    const engine = createTableEngine({ dataShape: 'tree', processOrder: 'sort-first' });
    const nodes = [
      { data: { n: 2 }, children: [{ data: { n: 9 } }, { data: { n: 8 } }] },
      { data: { n: 1 } },
    ];
    const result = engine.sortSingle(nodes, { sortField: 'n', sortOrder: 1 });
    expect(result.map(node => node.data.n)).toEqual([1, 2]);
    expect(result[1].children.map((c: any) => c.data.n)).toEqual([8, 9]);
  });

  it('flat 与 tree 引擎对同一份数据给出不同结果，说明分派真实生效', () => {
    const nodes = [{ data: { n: 2 } }, { data: { n: 1 } }];
    const flat = createTableEngine({ dataShape: 'flat', processOrder: 'filter-first' }).sortSingle(
      nodes,
      { sortField: 'n', sortOrder: 1 },
    );
    const tree = createTableEngine({ dataShape: 'tree', processOrder: 'sort-first' }).sortSingle(
      nodes,
      { sortField: 'n', sortOrder: 1 },
    );
    // flat 读 nodes[i].n（不存在）→ 顺序不变；tree 读 nodes[i].data.n → 生效
    expect(flat.map(n => n.data.n)).toEqual([2, 1]);
    expect(tree.map(n => n.data.n)).toEqual([1, 2]);
  });

  it('processOrder 影响 filter 与排序的先后（引擎只负责纯函数，顺序由调用方组合）', () => {
    const engine = createTableEngine({ dataShape: 'flat', processOrder: 'filter-first' });
    const rows = [{ n: 3 }, { n: 1 }, { n: 2 }];
    const filtered = engine.filter(rows, {
      filters: { n: { value: 2, matchMode: FilterMatchMode.EQUALS } },
    } as any);
    expect(engine.sortSingle(filtered!, { sortField: 'n', sortOrder: -1 }).map(r => r.n)).toEqual([
      2,
    ]);
  });
});
