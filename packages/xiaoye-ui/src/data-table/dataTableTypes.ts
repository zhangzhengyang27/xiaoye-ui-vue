import type { ExtractPropTypes, PropType } from 'vue';
import type { VirtualScrollerProps } from 'xiaoye-ui/virtual-scroller';
import type { DataTableFilterMeta, DataTableSortMeta } from './interface';

export type DataTableType = 'default';
export type DataTableSelectionMode = 'single' | 'multiple' | undefined;
export type DataTableSortMode = 'single' | 'multiple';
export type DataTableRowGroupMode = 'subheader' | 'rowspan' | undefined;
export type DataTableEditMode = 'cell' | 'row' | undefined;
export type DataTableSize = 'small' | 'large' | undefined;
export type DataTableStateStorage = 'session' | 'local';
export type DataTableColumnResizeMode = 'fit' | 'expand';
export type DataTablePaginationPosition = 'top' | 'bottom' | 'both';
export type DataTableFilterDisplay = 'menu' | 'row' | undefined;

export const dataTableProps = () => ({
  prefixCls: String,
  value: { type: Array as PropType<any[] | undefined>, default: undefined },
  columns: { type: Array as PropType<any[] | undefined>, default: undefined },
  dataKey: { type: [String, Function] as any, default: undefined },
  rows: { type: Number, default: 0 },
  first: { type: Number, default: 0 },
  totalRecords: { type: Number, default: 0 },
  pagination: { type: Boolean, default: false },
  paginationPosition: { type: String as PropType<DataTablePaginationPosition>, default: 'bottom' },
  alwaysShowPagination: { type: Boolean, default: true },
  paginationTemplate: {
    type: [String, Object] as any,
    default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
  },
  pageLinkSize: { type: Number, default: 5 },
  rowsPerPageOptions: { type: Array as PropType<any[] | undefined>, default: undefined },
  currentPageReportTemplate: { type: String, default: '({currentPage} of {totalPages})' },
  lazy: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  loadingIcon: { type: String as PropType<string | undefined>, default: undefined },
  sortField: { type: [String, Function] as any, default: undefined },
  sortOrder: { type: Number as PropType<number | undefined>, default: undefined },
  defaultSortOrder: { type: Number, default: 1 },
  nullSortOrder: { type: Number, default: 1 },
  multiSortMeta: { type: Array as PropType<DataTableSortMeta[] | undefined>, default: undefined },
  sortMode: { type: String as PropType<DataTableSortMode>, default: 'single' },
  removableSort: { type: Boolean, default: false },
  filters: { type: Object as PropType<DataTableFilterMeta | undefined>, default: undefined },
  filterDisplay: { type: String as PropType<DataTableFilterDisplay>, default: undefined },
  globalFilterFields: { type: Array as PropType<string[] | undefined>, default: undefined },
  filterLocale: { type: String as PropType<string | undefined>, default: undefined },
  selection: { type: [Array, Object] as any, default: undefined },
  selectionMode: { type: String as PropType<DataTableSelectionMode>, default: undefined },
  compareSelectionBy: { type: String, default: 'deepEquals' },
  metaKeySelection: { type: Boolean, default: false },
  contextMenu: { type: Boolean, default: false },
  contextMenuSelection: { type: [Array, Object] as any, default: null },
  selectAll: { type: Boolean as PropType<boolean | null>, default: null },
  rowHover: { type: Boolean, default: false },
  csvSeparator: { type: String, default: ',' },
  exportFilename: { type: String, default: 'download' },
  exportFunction: {
    type: Function as PropType<((options: { data: any; field: string }) => string) | undefined>,
    default: undefined,
  },
  resizableColumns: { type: Boolean, default: false },
  columnResizeMode: { type: String as PropType<DataTableColumnResizeMode>, default: 'fit' },
  reorderableColumns: { type: Boolean, default: false },
  expandedRows: { type: [Array, Object] as any, default: undefined },
  expandedRowIcon: { type: String as PropType<string | undefined>, default: undefined },
  collapsedRowIcon: { type: String as PropType<string | undefined>, default: undefined },
  rowGroupMode: { type: String as PropType<DataTableRowGroupMode>, default: undefined },
  groupRowsBy: { type: [Array, String, Function] as any, default: undefined },
  expandableRowGroups: { type: Boolean, default: false },
  expandedRowGroups: { type: Array as PropType<any[] | undefined>, default: undefined },
  stateStorage: { type: String as PropType<DataTableStateStorage>, default: 'session' },
  stateKey: { type: String as PropType<string | undefined>, default: undefined },
  editMode: { type: String as PropType<DataTableEditMode>, default: undefined },
  editingRows: { type: Array as PropType<any[] | undefined>, default: undefined },
  rowClass: {
    type: Function as PropType<((data: any) => string | object) | undefined>,
    default: undefined,
  },
  rowStyle: { type: Function as PropType<((data: any) => object) | undefined>, default: undefined },
  scrollable: { type: Boolean, default: false },
  virtualScrollerOptions: {
    type: Object as PropType<VirtualScrollerProps | undefined>,
    default: undefined,
  },
  scrollHeight: { type: String as PropType<string | undefined>, default: undefined },
  frozenValue: { type: Array as PropType<any[] | undefined>, default: undefined },
  breakpoint: { type: String, default: '960px' },
  showHeaders: { type: Boolean, default: true },
  showGridlines: { type: Boolean, default: false },
  stripedRows: { type: Boolean, default: false },
  highlightOnSelect: { type: Boolean, default: false },
  size: { type: String as PropType<DataTableSize>, default: undefined },
  tableStyle: { type: null as any, default: undefined },
  tableClass: { type: [String, Object] as any, default: undefined },
  tableProps: { type: Object as PropType<Record<string, any> | undefined>, default: undefined },
  filterInputProps: { type: null as any, default: undefined },
  filterButtonProps: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({
      filter: { severity: 'secondary', text: true, rounded: true },
      inline: {
        clear: { severity: 'secondary', text: true, rounded: true },
      },
      popover: {
        addRule: { severity: 'info', text: true, size: 'small' },
        removeRule: { severity: 'danger', text: true, size: 'small' },
        apply: { size: 'small' },
        clear: { outlined: true, size: 'small' },
      },
    }),
  },
  editButtonProps: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({
      init: { severity: 'secondary', text: true, rounded: true },
      save: { severity: 'secondary', text: true, rounded: true },
      cancel: { severity: 'secondary', text: true, rounded: true },
    }),
  },
  selectionDisabled: {
    type: Function as PropType<((data: any) => boolean) | undefined>,
    default: undefined,
  },
  rowExpandable: {
    type: Function as PropType<((data: any) => boolean) | undefined>,
    default: undefined,
  },
});

export type DataTableProps = Partial<ExtractPropTypes<ReturnType<typeof dataTableProps>>>;

export default dataTableProps;
