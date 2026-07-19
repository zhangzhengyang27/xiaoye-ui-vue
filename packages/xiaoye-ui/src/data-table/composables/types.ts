import type { Ref, ComputedRef, Slots, ComponentInternalInstance } from 'vue';
import type { TableEngine } from '../../table-core/types';

export interface DataTableContext {
  props: any;
  emit: (event: string, ...args: any[]) => void;
  slots: Slots;
  instance: ComponentInternalInstance;
  proxy: any;
  // 共享响应式状态
  d_first: Ref<number>;
  d_rows: Ref<number>;
  d_sortField: Ref<any>;
  d_sortOrder: Ref<number | undefined>;
  d_nullSortOrder: Ref<number>;
  d_multiSortMeta: Ref<any[]>;
  d_groupRowsSortMeta: Ref<any>;
  d_selectionKeys: Ref<Record<string, number> | null>;
  d_columnOrder: Ref<string[] | null>;
  d_editingRowKeys: Ref<Record<string, number> | null>;
  d_editingMeta: Ref<Record<string, any>>;
  d_filters: Ref<Record<string, any>>;
  columnResizing: Ref<boolean>;
  // DOM refs
  table: Ref<HTMLTableElement | null>;
  virtualScroller: Ref<any>;
  bodyRef: Ref<any>;
  frozenBodyRef: Ref<any>;
  resizeHelper: Ref<HTMLDivElement | null>;
  reorderIndicatorUp: Ref<HTMLSpanElement | null>;
  reorderIndicatorDown: Ref<HTMLSpanElement | null>;
  // computed
  columns: ComputedRef<any[]>;
  processedData: ComputedRef<any[]>;
  virtualScrollerDisabled: ComputedRef<boolean>;
  hasFilters: ComputedRef<boolean>;
  // engine
  engine: TableEngine;
  // 通用辅助函数（主文件提供）
  columnProp: (col: any, prop: string) => any;
  createLazyLoadEvent: (event?: any) => any;
  // 跨组函数（反向依赖，运行时通过 ctx 访问）
  clearEditingMetaData: () => void;
  dataToRender: (data?: any[]) => any[];
  resetPage: () => void;
  // state
  isStateful: () => boolean;
  saveState: () => void;
  restoreState: () => void;
  restoreColumnWidths: () => void;
  addColumnWidthStyles: (widths: number[]) => void;
  // columnResize
  createStyleElement: () => HTMLStyleElement;
  destroyStyleElement: () => void;
  // selection
  equalsData: (data1: any, data2: any) => boolean;
  findIndex: (rowData: any, collection: any) => number;
  updateSelectionKeys: (selection: any) => void;
  updateEditingRowKeys: (editingRows: any[] | undefined) => void;
  // columnReorder
  findColumnByKey: (columns: any[], key: string) => any;
  updateReorderableColumns: (cols?: any[]) => void;
  // filtering
  filter: (data: any[]) => any[] | undefined;
  // sorting
  sortSingle: (value: any[]) => any[];
  sortMultiple: (value: any[]) => any[];
}
