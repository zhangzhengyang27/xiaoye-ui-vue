import type { App } from 'vue';
import DataTable from './DataTable';
import { registerComponent } from '../_util/registerComponent';

export { dataTableProps } from './dataTableTypes';
export type { DataTableProps } from './dataTableTypes';
export type {
  DataTableFilterMeta,
  DataTableFilterMetaData,
  DataTableOperatorFilterMetaData,
  DataTableSortMeta,
  DataTableExpandedRows,
  DataTableEditingRows,
  DataTableExportCSVOptions,
  DataTableExportFunctionOptions,
  DataTableFilterButtonPropsOptions,
  DataTableEditButtonPropsOptions,
  DataTableVirtualScrollerProps,
} from './interface';

const XYDataTable = DataTable as any;

XYDataTable.install = (app: App) => {
  registerComponent(app, DataTable);
  return app;
};

export default XYDataTable;
