import type { ExtractPropTypes, PropType } from 'vue';
import { stringType, booleanType, arrayType } from '../_util/type';

export const dataViewProps = () => ({
  prefixCls: String,
  value: arrayType<any[]>(),
  layout: stringType<'list' | 'grid'>('list'),
  rows: { type: Number, default: 0 },
  first: { type: Number, default: 0 },
  totalRecords: { type: Number, default: 0 },
  pagination: booleanType(false),
  paginationPosition: stringType<'top' | 'bottom' | 'both'>('bottom'),
  alwaysShowPagination: booleanType(true),
  paginationTemplate: {
    type: String,
    default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
  },
  pageLinkSize: { type: Number, default: 5 },
  rowsPerPageOptions: arrayType<any[]>(),
  currentPageReportTemplate: { type: String, default: '({currentPage} of {totalPages})' },
  sortField: { type: [String, Function] as PropType<string | ((data: any) => any)>, default: null },
  sortOrder: { type: Number, default: null },
  lazy: booleanType(false),
  dataKey: String,
});

export type DataViewProps = Partial<ExtractPropTypes<ReturnType<typeof dataViewProps>>>;

export default dataViewProps;
