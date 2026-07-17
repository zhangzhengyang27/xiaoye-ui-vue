/**
 * table-core 过滤逻辑
 *
 * 合并 DataTable.tsx（扁平数组过滤）和 TreeTable.tsx（递归树过滤）的平行实现。
 * - flat 版本：平铺过滤，支持 operator (AND/OR) 和 globalFilterFields 多字段匹配
 * - tree 版本：递归树过滤，支持 filterMode (lenient/strict)
 *
 * emit('filter') 和 emit('change') 通过回调参数传入，保持函数纯度。
 */

import { FilterService, FilterOperator } from './filterService';
import { resolveFieldData } from '@xiaoye-ui/utils/object';
import { executeLocalFilter, getActiveFilters, hasGlobalFilter, isNodeLeaf } from './utils';
import type { FilterFlatParams, FilterTreeParams } from './types';

// ===== Flat 过滤（DataTable）=====

/**
 * 扁平数组过滤
 * 来源：DataTable.tsx 第 545-626 行
 */
export function filterFlat(data: any[], params: FilterFlatParams): any[] | undefined {
  if (!data) {
    return undefined;
  }

  const { filters, filterLocale, originalDataLength, createLazyLoadEvent, onFilter, onChange } =
    params;

  const activeFilters = getActiveFilters(filters || {});
  let globalFilterFieldsArray: string[] | undefined;

  if (activeFilters['global']) {
    globalFilterFieldsArray =
      params.globalFilterFields ||
      (params.columns || []).map(
        (col: any) => params.columnProp!(col, 'filterField') || params.columnProp!(col, 'field'),
      );
  }

  let filteredValue: any[] = [];

  for (let i = 0; i < data.length; i++) {
    let localMatch = true;
    let globalMatch = false;
    let localFiltered = false;

    for (const prop in activeFilters) {
      if (Object.prototype.hasOwnProperty.call(activeFilters, prop) && prop !== 'global') {
        localFiltered = true;
        const filterField = prop;
        const filterMeta = activeFilters[filterField];

        if (filterMeta.operator) {
          for (const filterConstraint of filterMeta.constraints) {
            localMatch = executeLocalFilter(filterField, data[i], filterConstraint, filterLocale);

            if (
              (filterMeta.operator === FilterOperator.OR && localMatch) ||
              (filterMeta.operator === FilterOperator.AND && !localMatch)
            ) {
              break;
            }
          }
        } else {
          localMatch = executeLocalFilter(filterField, data[i], filterMeta, filterLocale);
        }

        if (!localMatch) {
          break;
        }
      }
    }

    if (localMatch && activeFilters['global'] && !globalMatch && globalFilterFieldsArray) {
      for (let j = 0; j < globalFilterFieldsArray.length; j++) {
        const globalFilterField = globalFilterFieldsArray[j];

        globalMatch = FilterService.filters[activeFilters['global'].matchMode || 'contains'](
          resolveFieldData(data[i], globalFilterField),
          activeFilters['global'].value,
          filterLocale,
        );

        if (globalMatch) {
          break;
        }
      }
    }

    let matches;

    if (activeFilters['global']) {
      matches = localFiltered ? localFiltered && localMatch && globalMatch : globalMatch;
    } else {
      matches = localFiltered && localMatch;
    }

    if (matches) {
      filteredValue.push(data[i]);
    }
  }

  if (filteredValue.length === originalDataLength || Object.keys(activeFilters).length == 0) {
    filteredValue = data;
  }

  const filterEvent = createLazyLoadEvent ? createLazyLoadEvent() : {};
  filterEvent.filteredValue = filteredValue;
  onFilter?.(filterEvent);
  onChange?.(filteredValue);

  return filteredValue;
}

// ===== Tree 过滤（TreeTable）=====

/**
 * 树形递归过滤
 * 来源：TreeTable.tsx 第 560-623 行
 */
export function filterTree(value: any[], params: FilterTreeParams): any[] {
  if (!value) return [];

  const filteredNodes: any[] = [];
  const strict = params.filterMode === 'strict';
  const { filters, filterLocale, columns, columnProp, createLazyLoadEvent, onFilter } = params;
  const hasGlobal = hasGlobalFilter(filters);

  for (const node of value) {
    const copyNode = { ...node };
    let localMatch = true;

    // 阶段1：本地列过滤（按列独立判断，不与全局过滤交叉）
    for (let j = 0; j < columns.length; j++) {
      const col = columns[j];
      const filterField = columnProp(col, 'filterField') || columnProp(col, 'field');

      if (Object.prototype.hasOwnProperty.call(filters, filterField)) {
        const filterMatchMode = columnProp(col, 'filterMatchMode') || 'startsWith';
        const filterValue = filters[filterField];
        const filterConstraint =
          FilterService.filters[filterMatchMode as keyof typeof FilterService.filters];
        const paramsWithoutNode = { filterField, filterValue, filterConstraint, strict };

        if (
          (strict &&
            !(
              findFilteredNodes(copyNode, paramsWithoutNode, filterLocale) ||
              isFilterMatched(copyNode, paramsWithoutNode, filterLocale)
            )) ||
          (!strict &&
            !(
              isFilterMatched(copyNode, paramsWithoutNode, filterLocale) ||
              findFilteredNodes(copyNode, paramsWithoutNode, filterLocale)
            ))
        ) {
          localMatch = false;
        }

        if (!localMatch) {
          break;
        }
      }
    }

    if (!localMatch) continue;

    // 阶段2：全局过滤（独立于列循环，避免跨列副作用）
    let globalMatch = true;
    if (hasGlobal) {
      const filterValue = filters['global'];
      const filterConstraint = FilterService.filters['contains'];
      const globalFilterParamsWithoutNode = {
        filterField: '',
        filterValue,
        filterConstraint,
        strict,
      };

      globalMatch =
        isFilterMatched(copyNode, globalFilterParamsWithoutNode, filterLocale) ||
        findFilteredNodes(copyNode, globalFilterParamsWithoutNode, filterLocale);
    }

    if (localMatch && globalMatch) {
      filteredNodes.push(copyNode);
    }
  }

  const filterEvent = createLazyLoadEvent ? createLazyLoadEvent() : {};
  filterEvent.filteredValue = filteredNodes;
  onFilter?.(filterEvent);

  return filteredNodes;
}

/**
 * 递归过滤子节点
 * 来源：TreeTable.tsx 第 625-648 行
 */
function findFilteredNodes(node: any, paramsWithoutNode: any, filterLocale?: string): boolean {
  if (node) {
    let matched = false;

    if (node.children) {
      const childNodes = [...node.children];
      const matchedChildren: any[] = [];

      for (const childNode of childNodes) {
        const copyChildNode = { ...childNode };

        if (isFilterMatched(copyChildNode, paramsWithoutNode, filterLocale)) {
          matched = true;
          matchedChildren.push(copyChildNode);
        }
      }

      // 仅在有匹配的子节点时才替换 children，避免无条件清空导致数据丢失
      if (matched) {
        node.children = matchedChildren;
      }
    }

    return matched;
  }

  return false;
}

/**
 * 单节点过滤匹配判断
 * 来源：TreeTable.tsx 第 650-663 行
 */
function isFilterMatched(
  node: any,
  { filterField, filterValue, filterConstraint, strict }: any,
  filterLocale?: string,
): boolean {
  let matched = false;
  const dataFieldValue = resolveFieldData(node.data, filterField);

  if (filterConstraint(dataFieldValue, filterValue, filterLocale)) {
    matched = true;
  }

  if (!matched || (strict && !isNodeLeaf(node))) {
    matched =
      findFilteredNodes(
        node,
        { filterField, filterValue, filterConstraint, strict },
        filterLocale,
      ) || matched;
  }

  return matched;
}
