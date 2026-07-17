/**
 * table-core 聚合导出
 *
 * DataTable 和 TreeTable 的共享排序/过滤/分页内核。
 * 通过 createTableEngine 创建引擎实例，根据 dataShape 自动分派到 flat/tree 实现。
 */

export { createTableEngine } from './engine';
export {
  sortSingleFlat,
  sortMultipleFlat,
  multisortFieldFlat,
  sortSingleTree,
  sortMultipleTree,
  multisortFieldTree,
} from './sorting';
export { filterFlat, filterTree } from './filtering';
export { paginate } from './pagination';
export {
  cloneFilters,
  getActiveFilters,
  hasFilters,
  hasGlobalFilter,
  executeLocalFilter,
  isNodeLeaf,
} from './utils';
export { FilterService, FilterMatchMode, FilterOperator } from './filterService';
export type { FilterMatchModeValue, FilterOperatorValue } from './filterService';
export type {
  DataShape,
  ProcessOrder,
  TableEngineOptions,
  TableEngine,
  SortSingleParams,
  SortMultipleParams,
  FilterFlatParams,
  FilterTreeParams,
} from './types';
