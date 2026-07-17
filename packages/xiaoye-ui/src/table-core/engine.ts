/**
 * table-core 引擎主接口
 *
 * createTableEngine 根据 dataShape 创建对应的引擎实例，
 * 内部分派到 sorting.ts / filtering.ts / pagination.ts 的 flat 或 tree 实现。
 *
 * 组件用法：
 * ```ts
 * const engine = createTableEngine({ dataShape: 'flat', processOrder: 'filter-first' });
 * engine.sortSingle(data, { sortField, sortOrder, nullSortOrder });
 * ```
 */

import { filterFlat, filterTree } from './filtering';
import { paginate } from './pagination';
import { sortMultipleFlat, sortMultipleTree, sortSingleFlat, sortSingleTree } from './sorting';
import type {
  FilterFlatParams,
  FilterTreeParams,
  SortMultipleParams,
  SortSingleParams,
  TableEngine,
  TableEngineOptions,
} from './types';

export function createTableEngine(options: TableEngineOptions): TableEngine {
  const { dataShape } = options;

  const isTree = dataShape === 'tree';

  return {
    sortSingle(data: any[], params: SortSingleParams): any[] {
      return isTree ? sortSingleTree(data, params) : sortSingleFlat(data, params);
    },

    sortMultiple(data: any[], params: SortMultipleParams): any[] {
      return isTree ? sortMultipleTree(data, params) : sortMultipleFlat(data, params);
    },

    filter(data: any[], params: FilterFlatParams | FilterTreeParams): any[] | undefined {
      return isTree
        ? filterTree(data, params as FilterTreeParams)
        : filterFlat(data, params as FilterFlatParams);
    },

    paginate(data: any[], first: number, rows: number): any[] {
      return paginate(data, first, rows);
    },
  };
}
