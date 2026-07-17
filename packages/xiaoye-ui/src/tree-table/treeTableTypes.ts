import type { ExtractPropTypes, PropType } from 'vue';
import { stringType, booleanType, anyType, arrayType } from '../_util/type';

// TreeTable 类型
export type TreeTableSelectionMode = 'single' | 'multiple' | 'checkbox';
export type TreeTablePaginationPosition = 'top' | 'bottom' | 'both';
export type TreeTableLoadingMode = 'mask' | 'icon';
export type TreeTableSortMode = 'single' | 'multiple';
export type TreeTableFilterMode = 'lenient' | 'strict';
export type TreeTableColumnResizeMode = 'fit' | 'expand';
export type TreeTableSize = 'small' | 'large';

/**
 * Custom treetable filter metadata.
 */
export interface TreeTableFilterMetaData {
  value: any;
  matchMode?: string;
}

/**
 * Custom operator filter metadata.
 */
export interface TreeTableOperatorFilterMetaData {
  operator: string;
  constraints: TreeTableFilterMetaData[];
}

/**
 * Custom filter metadata.
 */
export interface TreeTableFilterMeta {
  [key: string]: string | TreeTableFilterMetaData | TreeTableOperatorFilterMetaData;
}

/**
 * Custom sort metadata.
 */
export interface TreeTableSortMeta {
  field: string;
  order: 1 | 0 | -1 | null | undefined;
}

/**
 * Custom expanded keys metadata.
 */
export interface TreeTableExpandedKeys {
  [key: string]: any;
}

/**
 * Custom selection keys metadata.
 */
export interface TreeTableSelectionKeys {
  [key: string]: any;
}

/**
 * Custom sort event.
 */
export interface TreeTableSortEvent {
  originalEvent: Event;
  first: number;
  rows: number;
  sortField: string | ((item: any) => string) | undefined;
  sortOrder: 1 | 0 | -1 | undefined | null;
  multiSortMeta: TreeTableSortMeta[] | undefined | null;
  filters: TreeTableFilterMeta;
  filterMatchModes?: any;
}

/**
 * Custom page event.
 */
export interface TreeTablePageEvent extends TreeTableSortEvent {
  page: number;
  pageCount: number;
}

/**
 * Custom filter event.
 */
export interface TreeTableFilterEvent extends TreeTableSortEvent {
  filteredValue: any;
}

/**
 * Custom row context menu event.
 */
export interface TreeTableRowContextMenuEvent {
  originalEvent: Event;
  node: any;
}

export const treeTableProps = () => ({
  prefixCls: String,
  value: { type: Array as PropType<any[]>, default: null },
  dataKey: {
    type: [String, Function] as PropType<string | ((item: any) => string)>,
    default: 'key',
  },
  expandedKeys: { type: Object as PropType<TreeTableExpandedKeys>, default: null },
  selectionKeys: { type: Object as PropType<TreeTableSelectionKeys>, default: null },
  selectionMode: stringType<TreeTableSelectionMode>(),
  metaKeySelection: booleanType(false),
  contextMenu: booleanType(false),
  contextMenuSelection: anyType(null),
  rows: { type: Number, default: 0 },
  first: { type: Number, default: 0 },
  totalRecords: { type: Number, default: 0 },
  pagination: booleanType(false),
  paginationPosition: stringType<TreeTablePaginationPosition>('bottom'),
  alwaysShowPagination: booleanType(true),
  paginationTemplate: {
    type: String,
    default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
  },
  pageLinkSize: { type: Number, default: 5 },
  rowsPerPageOptions: arrayType<number[]>(),
  currentPageReportTemplate: { type: String, default: '({currentPage} of {totalPages})' },
  lazy: booleanType(false),
  loading: booleanType(false),
  loadingIcon: { type: String, default: undefined },
  loadingMode: stringType<TreeTableLoadingMode>('mask'),
  rowHover: booleanType(false),
  autoLayout: booleanType(false),
  sortField: {
    type: [String, Function] as PropType<string | ((item: any) => string)>,
    default: null,
  },
  sortOrder: { type: Number, default: null },
  defaultSortOrder: { type: Number, default: 1 },
  multiSortMeta: arrayType<TreeTableSortMeta[]>(),
  sortMode: stringType<TreeTableSortMode>('single'),
  removableSort: booleanType(false),
  filters: { type: Object as PropType<TreeTableFilterMeta>, default: null },
  filterMode: stringType<TreeTableFilterMode>('lenient'),
  filterLocale: { type: String, default: undefined },
  resizableColumns: booleanType(false),
  columnResizeMode: stringType<TreeTableColumnResizeMode>('fit'),
  indentation: { type: Number, default: 1 },
  showGridlines: booleanType(false),
  scrollable: booleanType(false),
  scrollHeight: { type: String, default: null },
  size: stringType<TreeTableSize>(),
  tableStyle: anyType(null),
  tableClass: anyType(null),
  tableProps: anyType(null),
});

export type TreeTableProps = Partial<ExtractPropTypes<ReturnType<typeof treeTableProps>>>;

// TreeTableRow 类型
export const treeTableRowProps = () => ({
  prefixCls: String,
  node: anyType(null),
  dataKey: {
    type: [String, Function] as PropType<string | ((item: any) => string)>,
    default: 'key',
  },
  parentNode: anyType(null),
  columns: arrayType<any[]>(),
  expandedKeys: { type: Object as PropType<TreeTableExpandedKeys>, default: null },
  selectionKeys: { type: Object as PropType<TreeTableSelectionKeys>, default: null },
  selectionMode: stringType<TreeTableSelectionMode>(),
  level: { type: Number, default: 0 },
  indentation: { type: Number, default: 1 },
  tabindex: { type: Number, default: -1 },
  ariaSetSize: { type: Number, default: null },
  ariaPosInset: { type: Number, default: null },
  loadingMode: stringType<TreeTableLoadingMode>('mask'),
  templates: anyType(null),
  contextMenu: booleanType(false),
  contextMenuSelection: anyType(null),
});

export type TreeTableRowProps = Partial<ExtractPropTypes<ReturnType<typeof treeTableRowProps>>>;

// BodyCell 类型
export const bodyCellProps = () => ({
  prefixCls: String,
  node: anyType(null),
  column: anyType(null),
  level: { type: Number, default: 0 },
  indentation: { type: Number, default: 1 },
  leaf: booleanType(false),
  expanded: booleanType(false),
  selectionMode: stringType<TreeTableSelectionMode>(),
  checked: booleanType(false),
  partialChecked: booleanType(false),
  templates: anyType(null),
  index: { type: Number, default: null },
  loadingMode: stringType<TreeTableLoadingMode>('mask'),
});

export type BodyCellProps = Partial<ExtractPropTypes<ReturnType<typeof bodyCellProps>>>;

// HeaderCell 类型
export const headerCellProps = () => ({
  prefixCls: String,
  column: anyType(null),
  resizableColumns: booleanType(false),
  sortField: {
    type: [String, Function] as PropType<string | ((item: any) => string)>,
    default: null,
  },
  sortOrder: { type: Number, default: null },
  multiSortMeta: arrayType<TreeTableSortMeta[]>(),
  sortMode: stringType<TreeTableSortMode>('single'),
  index: { type: Number, default: null },
});

export type HeaderCellProps = Partial<ExtractPropTypes<ReturnType<typeof headerCellProps>>>;

// FooterCell 类型
export const footerCellProps = () => ({
  prefixCls: String,
  column: anyType(null),
  index: { type: Number, default: null },
});

export type FooterCellProps = Partial<ExtractPropTypes<ReturnType<typeof footerCellProps>>>;

export default treeTableProps;
