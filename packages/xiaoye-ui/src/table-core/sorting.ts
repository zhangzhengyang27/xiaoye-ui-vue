/**
 * table-core 排序逻辑
 *
 * 合并 DataTable.tsx（扁平数组排序）和 TreeTable.tsx（递归树排序）的平行实现。
 * - flat 版本：直接对数组排序，支持 nullSortOrder 和 resolvedFieldData 缓存优化
 * - tree 版本：排序后通过 .map 递归处理 children
 *
 * 注意：groupRowsBy 联动逻辑（修改 d_multiSortMeta 状态）不属于纯排序逻辑，
 * 留在组件中处理。组件包装函数先处理 groupRowsBy，再调用本模块。
 */

import { localeComparator, resolveFieldData, sort } from '@xiaoye-ui/utils/object';
import type { SortSingleParams, SortMultipleParams } from './types';

// ===== Flat 排序（DataTable）=====

/**
 * 扁平数组单字段排序
 * 来源：DataTable.tsx 第 458-475 行（去除 groupRowsBy 联动和 clearEditingMetaData）
 */
export function sortSingleFlat(data: any[], params: SortSingleParams): any[] {
  const { sortField, sortOrder, nullSortOrder } = params;

  // sortOrder 为 null/undefined 时不排序（removableSort 模式下会设为 null）
  if (sortOrder == null) return [...data];

  const comparer = localeComparator();

  const result = [...data];
  const resolvedFieldData = new Map();

  for (const item of result) {
    resolvedFieldData.set(item, resolveFieldData(item, sortField));
  }

  result.sort((data1, data2) => {
    const value1 = resolvedFieldData.get(data1);
    const value2 = resolvedFieldData.get(data2);

    return sort(value1, value2, sortOrder!, comparer, nullSortOrder);
  });

  return result;
}

/**
 * 扁平数组多字段排序
 * 来源：DataTable.tsx 第 490-497 行（去除 groupRowsBy 联动和 clearEditingMetaData）
 */
export function sortMultipleFlat(data: any[], params: SortMultipleParams): any[] {
  const { multiSortMeta, nullSortOrder } = params;

  if (!multiSortMeta || !multiSortMeta.length) return [...data];

  const comparer = localeComparator();

  const result = [...data];

  result.sort((data1, data2) => {
    return multisortFieldFlat(data1, data2, 0, multiSortMeta, nullSortOrder, comparer);
  });

  return result;
}

/**
 * 扁平数据多字段比较器
 * 来源：DataTable.tsx 第 499-509 行
 */
export function multisortFieldFlat(
  data1: any,
  data2: any,
  index: number,
  multiSortMeta: any[],
  nullSortOrder: number | undefined,
  comparer: any,
): number {
  const value1 = resolveFieldData(data1, multiSortMeta[index].field);
  const value2 = resolveFieldData(data2, multiSortMeta[index].field);

  if (value1 === value2) {
    return multiSortMeta.length - 1 > index
      ? multisortFieldFlat(data1, data2, index + 1, multiSortMeta, nullSortOrder, comparer)
      : 0;
  }

  return sort(value1, value2, multiSortMeta[index].order, comparer, nullSortOrder);
}

// ===== Tree 排序（TreeTable）=====

/**
 * 树形单字段排序（递归）
 * 来源：TreeTable.tsx 第 523-534 行（sortNodesSingle）
 */
export function sortSingleTree(nodes: any[], params: SortSingleParams): any[] {
  const { sortField, sortOrder } = params;

  // sortOrder 为 null/undefined 时不排序
  if (sortOrder == null) return [...nodes];

  const comparer = localeComparator();

  return [...nodes]
    .sort((node1, node2) => {
      const value1 = resolveFieldData(node1.data, sortField);
      const value2 = resolveFieldData(node2.data, sortField);

      return sort(value1, value2, sortOrder, comparer);
    })
    .map(node =>
      node.children && node.children.length
        ? { ...node, children: sortSingleTree(node.children, params) }
        : node,
    );
}

/**
 * 树形多字段排序（递归）
 * 来源：TreeTable.tsx 第 540-546 行（sortNodesMultiple）
 */
export function sortMultipleTree(nodes: any[], params: SortMultipleParams): any[] {
  const { multiSortMeta } = params;

  if (!multiSortMeta || !multiSortMeta.length) return [...nodes];

  const comparer = localeComparator();

  return [...nodes]
    .sort((node1, node2) => {
      return multisortFieldTree(node1, node2, 0, multiSortMeta, comparer);
    })
    .map(node =>
      node.children && node.children.length
        ? { ...node, children: sortMultipleTree(node.children, params) }
        : node,
    );
}

/**
 * 树形多字段比较器
 * 来源：TreeTable.tsx 第 548-558 行
 */
export function multisortFieldTree(
  node1: any,
  node2: any,
  index: number,
  multiSortMeta: any[],
  comparer: any,
): number {
  const value1 = resolveFieldData(node1.data, multiSortMeta[index].field);
  const value2 = resolveFieldData(node2.data, multiSortMeta[index].field);

  if (value1 === value2) {
    return multiSortMeta.length - 1 > index
      ? multisortFieldTree(node1, node2, index + 1, multiSortMeta, comparer)
      : 0;
  }

  return sort(value1, value2, multiSortMeta[index].order, comparer);
}
