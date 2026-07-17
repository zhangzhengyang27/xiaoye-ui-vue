/**
 * table-core 共享辅助函数
 *
 * 过滤器的克隆、激活过滤项提取、过滤器存在性判断等纯函数。
 * 从 DataTable.tsx 和 TreeTable.tsx 中收敛的公共逻辑。
 */

import { FilterMatchMode, FilterService } from './filterService';
import { resolveFieldData } from '@xiaoye-ui/utils/object';

/**
 * 深拷贝过滤器对象（支持 operator + constraints 结构）
 * 来源：DataTable.tsx 第 346-363 行
 */
export function cloneFilters(filters: Record<string, any> | undefined): Record<string, any> {
  const cloned: Record<string, any> = {};

  if (filters) {
    Object.entries(filters).forEach(([prop, value]) => {
      cloned[prop] = (value as any).operator
        ? {
            operator: (value as any).operator,
            constraints: (value as any).constraints.map((constraint: any) => {
              return { ...constraint };
            }),
          }
        : { ...value };
    });
  }

  return cloned;
}

/**
 * 提取有效过滤项（过滤掉 value 为 null 的约束）
 * 来源：DataTable.tsx 第 524-543 行
 */
export function getActiveFilters(filters: Record<string, any>): Record<string, any> {
  const removeEmptyFilters = ([key, value]: [string, any]) => {
    if (value.constraints) {
      const filteredConstraints = value.constraints.filter(
        (constraint: any) => constraint.value !== null,
      );

      if (filteredConstraints.length > 0) {
        return [key, { ...value, constraints: filteredConstraints }];
      }
    } else if (value.value !== null) {
      return [key, value];
    }

    return undefined;
  };

  const filterValidEntries = (entry: any) => entry !== undefined;
  const entries = Object.entries(filters).map(removeEmptyFilters).filter(filterValidEntries);

  return Object.fromEntries(entries);
}

/**
 * 判断是否有过滤条件
 * 来源：TreeTable.tsx 第 669-671 行（hasFilters）
 */
export function hasFilters(filters: Record<string, any> | undefined): boolean {
  return !!filters && Object.keys(filters).length > 0 && filters.constructor === Object;
}

/**
 * 判断是否有全局过滤器
 * 来源：DataTable.tsx 第 1922-1924 行 / TreeTable.tsx 第 673-675 行
 */
export function hasGlobalFilter(filters: Record<string, any> | undefined): boolean {
  return !!filters && Object.prototype.hasOwnProperty.call(filters, 'global');
}

/**
 * 单行单字段本地过滤匹配
 * 来源：DataTable.tsx 第 628-635 行（executeLocalFilter）
 */
export function executeLocalFilter(
  field: string,
  rowData: any,
  filterMeta: any,
  filterLocale?: string,
): boolean {
  const filterValue = filterMeta.value;
  const filterMatchMode = filterMeta.matchMode || FilterMatchMode.STARTS_WITH;
  const dataFieldValue = resolveFieldData(rowData, field);
  const filterConstraint =
    FilterService.filters[filterMatchMode as keyof typeof FilterService.filters];

  return filterConstraint(dataFieldValue, filterValue, filterLocale);
}

/**
 * 判断节点是否为叶子节点
 * 来源：TreeTable.tsx 第 665-667 行（isNodeLeaf）
 */
export function isNodeLeaf(node: any): boolean {
  return node.leaf === false ? false : !(node.children && node.children.length);
}
