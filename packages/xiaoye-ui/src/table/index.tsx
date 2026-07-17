import Table, { tableProps } from './Table';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import type { TableProps, TablePaginationConfig } from './Table';
import type { App } from 'vue';
import { EXPAND_COLUMN, Summary, SummaryCell, SummaryRow } from '../vc-table';
import { registerComponent } from '../_util/registerComponent';
import {
  SELECTION_ALL,
  SELECTION_INVERT,
  SELECTION_NONE,
  SELECTION_COLUMN,
} from './hooks/useSelection';

export type { ColumnProps } from './Column';
export type { ColumnsType, ColumnType, ColumnGroupType } from './interface';
export type { TableProps, TablePaginationConfig };

const TableSummaryRow = SummaryRow;
const TableSummaryCell = SummaryCell;

const TableSummary = Object.assign(Summary, {
  Cell: TableSummaryCell,
  Row: TableSummaryRow,
  name: 'XYTableSummary',
});

/* istanbul ignore next */
export {
  tableProps,
  TableSummary,
  TableSummaryRow,
  TableSummaryCell,
  Column as TableColumn,
  ColumnGroup as TableColumnGroup,
};

export default Object.assign(Table, {
  SELECTION_ALL,
  SELECTION_INVERT,
  SELECTION_NONE,
  SELECTION_COLUMN,
  EXPAND_COLUMN,
  Column,
  ColumnGroup,
  Summary: TableSummary,
  install: (app: App) => {
    registerComponent(app, TableSummary);
    registerComponent(app, TableSummaryCell);
    registerComponent(app, TableSummaryRow);
    registerComponent(app, Table);
    registerComponent(app, Column);
    registerComponent(app, ColumnGroup);
    return app;
  },
});
