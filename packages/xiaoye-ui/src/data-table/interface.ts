import type { ButtonProps } from 'xiaoye-ui/button';
import type { VirtualScrollerProps } from 'xiaoye-ui/virtual-scroller';

export interface DataTableFilterMetaData {
  value: any;
  matchMode: string | undefined;
}

export interface DataTableOperatorFilterMetaData {
  operator: string;
  constraints: DataTableFilterMetaData[];
}

export interface DataTableFilterMeta {
  [key: string]: string | DataTableFilterMetaData | DataTableOperatorFilterMetaData;
}

export interface DataTableSortMeta {
  field: string | ((item: any) => string) | undefined;
  order: 1 | 0 | -1 | undefined | null;
}

export interface DataTableExportFunctionOptions<T = any> {
  data: T;
  field: string;
}

export interface DataTableFilterButtonInlinePropsOptions {
  clear: ButtonProps | undefined;
}

export interface DataTableFilterButtonPopoverPropsOptions {
  addRule: ButtonProps | undefined;
  removeRule: ButtonProps | undefined;
  apply: ButtonProps | undefined;
  clear: ButtonProps | undefined;
}

export interface DataTableFilterButtonPropsOptions {
  filter: ButtonProps | undefined;
  inline: DataTableFilterButtonInlinePropsOptions | undefined;
  popover: DataTableFilterButtonPopoverPropsOptions | undefined;
}

export interface DataTableEditButtonPropsOptions {
  init: ButtonProps | undefined;
  save: ButtonProps | undefined;
  cancel: ButtonProps | undefined;
}

export interface DataTableExpandedRows {
  [key: string]: boolean;
}

export interface DataTableEditingRows {
  [key: string]: boolean;
}

export interface DataTableExportCSVOptions {
  selectionOnly: boolean;
}

export type DataTableVirtualScrollerProps = Partial<VirtualScrollerProps>;
