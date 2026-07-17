/**
 * table-core 共享类型定义
 *
 * DataTable（扁平数据）和 TreeTable（树形数据）的排序/过滤/分页逻辑共享内核。
 * 通过 dataShape 区分扁平/树形，通过 processOrder 区分 filter→sort / sort→filter。
 */

export type DataShape = 'flat' | 'tree';
export type ProcessOrder = 'filter-first' | 'sort-first';

export interface TableEngineOptions {
  /** 数据形态：flat 扁平数组 / tree 树形结构 */
  dataShape: DataShape;
  /** 执行顺序：filter-first（DataTable）/ sort-first（TreeTable） */
  processOrder: ProcessOrder;
}

// ===== 排序参数 =====

export interface SortSingleParams {
  sortField: any;
  sortOrder: number | null;
  /** nullSortOrder：DataTable 支持，TreeTable 不传 */
  nullSortOrder?: number;
}

export interface SortMultipleParams {
  multiSortMeta: any[];
  nullSortOrder?: number;
}

// ===== 过滤参数 =====

export interface FilterFlatParams {
  filters: Record<string, any>;
  filterLocale?: string;
  globalFilterFields?: string[];
  columns?: any[];
  columnProp?: (col: any, prop: string) => any;
  /** 原始数据长度，用于 DataTable 的优化判断 */
  originalDataLength?: number;
  createLazyLoadEvent?: () => any;
  onFilter?: (event: any) => void;
  onChange?: (value: any) => void;
}

export interface FilterTreeParams {
  filters: Record<string, any>;
  filterLocale?: string;
  filterMode?: 'lenient' | 'strict';
  columns: any[];
  columnProp: (col: any, prop: string) => any;
  createLazyLoadEvent?: (event?: any) => any;
  onFilter?: (event: any) => void;
}

// ===== 引擎接口 =====

export interface TableEngine {
  sortSingle(data: any[], params: SortSingleParams): any[];
  sortMultiple(data: any[], params: SortMultipleParams): any[];
  filter(data: any[], params: FilterFlatParams | FilterTreeParams): any[] | undefined;
  paginate(data: any[], first: number, rows: number): any[];
}
