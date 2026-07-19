/**
 *
 * Column component defines various options to specify corresponding features.
 * It is a helper component for DataTable and TreeTable.
 *
 * [Live Demo](https://www.xiaoye-ui/datatable/)
 *
 * @module column
 *
 */
import type { DefineComponent, EmitFn, HintedString } from '@xiaoye-ui/core';
import type { VNode } from 'vue';
import type { VirtualScrollerLoaderOptions } from 'xiaoye-ui/virtual-scroller';

/**
 * Filter model metadata.
 */
export interface ColumnFilterModelType {
  /**
   * Value of filterModel.
   */
  value: any;
  /**
   * Match mode of filterModel.
   */
  matchMode: string;
}

/**
 * Filter match modes for specific columns.
 */
export interface ColumnFilterMatchModeOptions {
  [key: string]: string;
}

/**
 * Custom column loading metadata.
 */
export interface ColumnLoadingOptions extends VirtualScrollerLoaderOptions {
  /**
   * Cell index
   */
  cellIndex: number;
  /**
   * Whether the cell is first.
   */
  cellFirst: boolean;
  /**
   * Whether the cell is last.
   */
  cellLast: boolean;
  /**
   * Whether the cell is even.
   */
  cellEven: boolean;
  /**
   * Whether the item is odd.
   */
  cellOdd: boolean;
  /**
   * Column instance
   */
  column: ColumnNode;
  /**
   * Column field
   */
  field: string;
}

/**
 * Defines current inline state in Column component.
 */
export interface ColumnState {
  d_editing: boolean;
  /**
   * Current style of the body cell.
   */
  styleObject: object;
  /**
   * Current filter overlay visible as a boolean.
   */
  overlayVisible: boolean;
  /**
   * Current filter match mode.
   */
  defaultMatchMode: string;
  /**
   * Current filter operator.
   */
  defaultOperator: string;
  /**
   * Current focused state as a boolean.
   * @defaultValue false
   */
  focused: boolean;
  /**
   * Current style of the rowgroup header.
   */
  rowGroupHeaderStyleObject: object;
}

/**
 * Defines valid properties in Column component.
 */
export interface ColumnProps {
  /**
   * Identifier of a column if field property is not defined.
   */
  columnKey?: string | undefined;
  /**
   * Property represented by the column.
   */
  field?: string | ((item: any) => string) | undefined;
  /**
   * Property name to use in sorting, defaults to field.
   */
  sortField?: string | ((item: any) => string) | undefined;
  /**
   * Property name to use in filtering, defaults to field.
   */
  filterField?: string | ((item: any) => string) | undefined;
  /**
   * Type of data. It's value is related to XiaoyeUI.filterMatchModeOptions config.
   */
  dataType?: string | undefined;
  /**
   * Defines if a column is sortable.
   * @defaultValue false
   */
  sortable?: boolean | undefined;
  /**
   * Header content of the column.
   */
  header?: string | undefined;
  /**
   * Footer content of the column.
   */
  footer?: string | undefined;
  /**
   * Inline style of header, body and footer cells.
   */
  style?: any;
  /**
   * Style class of header, body and footer cells.
   */
  class?: any;
  /**
   * Inline style of the column header.
   */
  headerStyle?: any;
  /**
   * Style class of the column header.
   */
  headerClass?: any;
  /**
   * Inline style of the column body.
   */
  bodyStyle?: any;
  /**
   * Style class of the column body.
   */
  bodyClass?: any;
  /**
   * Inline style of the column footer.
   */
  footerStyle?: any;
  /**
   * Style class of the column footer.
   */
  footerClass?: any;
  /**
   * Whether to display the filter overlay.
   * @defaultValue true
   */
  showFilterMenu?: boolean | undefined;
  /**
   * When enabled, match all and match any operator selector is displayed.
   * @defaultValue true
   */
  showFilterOperator?: boolean | undefined;
  /**
   * Displays a button to clear the column filtering.
   * @defaultValue false
   */
  showClearButton?: boolean | undefined;
  /**
   * Displays a button to apply the column filtering.
   * @defaultValue true
   */
  showApplyButton?: boolean | undefined;
  /**
   * Whether to show the match modes selector.
   * @defaultValue true
   */
  showFilterMatchModes?: boolean | undefined;
  /**
   * When enabled, a button is displayed to add more rules.
   * @defaultValue true
   */
  showAddButton?: boolean | undefined;
  /**
   * An array of label-value pairs to override the global match mode options.
   */
  filterMatchModeOptions?: ColumnFilterMatchModeOptions[];
  /**
   * Maximum number of constraints for a column filter.
   * @defaultValue 2
   */
  maxConstraints?: number | undefined;
  /**
   * Whether to exclude from global filtering or not.
   * @defaultValue false
   */
  excludeGlobalFilter?: boolean | undefined;
  /**
   * Inline style of the column filter header in row filter display.
   */
  filterHeaderStyle?: any;
  /**
   * Style class of the column filter header in row filter display.
   */
  filterHeaderClass?: any;
  /**
   * Inline style of the column filter overlay.
   */
  filterMenuStyle?: any;
  /**
   * Style class of the column filter overlay.
   */
  filterMenuClass?: any;
  /**
   * Defines column based selection mode.
   */
  selectionMode?: HintedString<'single' | 'multiple'> | undefined;
  /**
   * Displays an icon to toggle row expansion.
   * @defaultValue false
   */
  expander?: boolean | undefined;
  /**
   * Number of columns to span for grouping.
   */
  colspan?: number | undefined;
  /**
   * Number of rows to span for grouping.
   */
  rowspan?: number | undefined;
  /**
   * Whether this column displays an icon to reorder the rows.
   * @defaultValue false
   */
  rowReorder?: boolean | undefined;
  /**
   * Icon of the drag handle to reorder rows.
   */
  rowReorderIcon?: string | undefined;
  /**
   * Defines if the column itself can be reordered with dragging.
   * @defaultValue false
   */
  reorderableColumn?: boolean | undefined;
  /**
   * When enabled, column displays row editor controls.
   * @defaultValue false
   */
  rowEditor?: boolean | undefined;
  /**
   * Whether the column is fixed in horizontal scrolling.
   * @defaultValue false
   */
  frozen?: boolean | undefined;
  /**
   * Position of a frozen column, valid values are left and right.
   * @defaultValue left
   */
  alignFrozen?: HintedString<'left' | 'right'> | undefined;
  /**
   * Whether the column is included in data export.
   * @defaultValue false
   */
  exportable?: boolean | undefined;
  /**
   * Custom export header of the column to be exported as CSV.
   */
  exportHeader?: string | undefined;
  /**
   * Custom export footer of the column to be exported as CSV.
   */
  exportFooter?: string | undefined;
  /**
   * Defines the filtering algorithm to use when searching the options.
   */
  filterMatchMode?: string | undefined;
  /**
   * Whether the column is rendered.
   * @defaultValue false
   */
  hidden?: boolean | undefined;
}

/**
 * Defines valid slots in Column component.
 */
export interface ColumnSlots {
  /**
   * Custom body template for DataTable.
   * @param {Object} scope - body slot's params.
   */
  body(scope: {
    /**
     * Row data.
     */
    data: any;
    /**
     * Row node data.
     */
    node: any;
    /**
     * Column node.
     */
    column: ColumnNode;
    /**
     * Column field.
     */
    field: string | ((item: any) => string) | undefined;
    /**
     * Row index.
     */
    index: number;
    /**
     * Whether the row is frozen.
     */
    frozenRow: boolean;
    /**
     * Editor init callback function
     * @param {Event} event - Browser event
     */
    editorInitCallback: (event: Event) => void;
    /**
     * Row toggler callback unction
     * @param {Event} event - Browser event
     */
    rowTogglerCallback: (event: Event) => void;
  }): VNode[];
  /**
   * Custom body template for TreeTable.
   * @param {Object} scope - body slot's params.
   */
  node(scope: {
    /**
     * Row data.
     */
    data: any;
    /**
     * Row node data.
     */
    node: any;
    /**
     * Column node.
     */
    column: ColumnNode;
    /**
     * Column field.
     */
    field: string;
    /**
     * Row index.
     */
    index: number;
    /**
     * Whether the row is frozen.
     */
    frozenRow: boolean;
    /**
     * Editor init callback function
     * @param {Event} event - Browser event
     */
    editorInitCallback: (event: Event) => void;
    /**
     * Row toggler callback unction
     * @param {Event} event - Browser event
     */
    rowTogglerCallback: (event: Event) => void;
  }): VNode[];
  /**
   * Custom header template.
   * @param {Object} scope - header slot's params.
   */
  header(scope: {
    /**
     * Column node.
     */
    column: ColumnNode;
  }): VNode[];
  /**
   * Custom footer template.
   * @param {Object} scope - footer slot's params.
   */
  footer(scope: {
    /**
     * Column node.
     */
    column: ColumnNode;
  }): VNode[];
  /**
   * Custom editor template.
   * @param {Object} scope - editor slot's params.
   */
  editor(scope: {
    /**
     * Row data.
     */
    data: any;
    /**
     * Column node.
     */
    column: ColumnNode;
    /**
     * Column field.
     */
    field: string;
    /**
     * Row index.
     */
    index: number;
    /**
     * Whether the row is frozen.
     */
    frozenRow: boolean;
    /**
     * Callback function
     * @param {Event} event - Browser event
     */
    editorSaveCallback: (event: Event) => void;
    /**
     * Callback function
     * @param {Event} event - Browser event
     */
    editorCancelCallback: (event: Event) => void;
  }): VNode[];
  /**
   * Custom filter template.
   * @param {Object} scope - filter slot's params.
   */
  filter(scope: {
    /**
     * Column field.
     */
    field: string;
    /**
     * Filter metadata
     * @see ColumnFilterModelType
     */
    filterModel: ColumnFilterModelType;
    /**
     * Callback function
     */
    filterCallback: () => void;
    /**
     * Callback function (closes the overlay)
     */
    applyFilter: () => void;
  }): VNode[];
  /**
   * Custom filter header template.
   * @param {Object} scope - filter header slot's params.
   */
  filterheader(scope: {
    /**
     * Column field.
     */
    field: string;
    /**
     * Filter metadata
     * @see ColumnFilterModelType
     */
    filterModel: ColumnFilterModelType;
    /**
     * Callback function
     */
    filterCallback: () => void;
  }): VNode[];
  /**
   * Custom filter footer template.
   * @param {Object} scope - filter footer slot's params.
   */
  filterfooter(scope: {
    /**
     * Column field.
     */
    field: string;
    /**
     * Filter metadata
     * @see ColumnFilterModelType
     */
    filterModel: ColumnFilterModelType;
    /**
     * Callback function
     */
    filterCallback: () => void;
  }): VNode[];
  /**
   * Custom filter clear template.
   * @param {Object} scope - filter clear slot's params.
   */
  filterclear(scope: {
    /**
     * Column field.
     */
    field: string;
    /**
     * Filter metadata
     * @see ColumnFilterModelType
     */
    filterModel: ColumnFilterModelType;
    /**
     * Callback function
     */
    filterCallback: () => void;
  }): VNode[];
  /**
   * Custom filter apply template.
   * @param {Object} scope - filter apply slot's params.
   */
  filterapply(scope: {
    /**
     * Column field.
     */
    field: string;
    /**
     * Filter metadata
     * @see ColumnFilterModelType
     */
    filterModel: ColumnFilterModelType;
    /**
     * Callback function
     */
    filterCallback: () => void;
  }): VNode[];
  /**
   * Custom loading template.
   * @param {Object} scope - loading slot's params.
   */
  loading(scope: {
    /**
     * Row data.
     */
    data: any;
    /**
     * Column node.
     */
    column: ColumnNode;
    /**
     * Column field.
     */
    field: string;
    /**
     * Row index.
     */
    index: number;
    /**
     * Whether the row is frozen.
     */
    frozenRow: boolean;
    /**
     * Loading options.
     * @see ColumnLoadingOptions
     */
    loadingOptions: ColumnLoadingOptions;
  }): VNode[];
  /**
   * @deprecated since v4.0. Use 'rowtoggleicon' slot instead.
   * Custom row toggler icon template.
   * @param {Object} scope - row toggler icon slot's params.
   */
  rowtogglericon(scope: {
    /**
     * Style class of the row toggler icon.
     */
    class: string;
    /**
     * Current row expanded state.
     */
    rowExpanded: boolean;
  }): VNode[];
  /**
   * Custom row toggler icon template.
   * @param {Object} scope - row toggler icon slot's params.
   */
  rowtoggleicon(scope: {
    /**
     * Style class of the row toggler icon.
     */
    class: string;
    /**
     * Current row expanded state.
     */
    rowExpanded: boolean;
  }): VNode[];
  /**
   * Custom row checkbox icon template.
   * @param {Object} scope - header row icon slot's params.
   */
  rowcheckboxicon(scope: {
    /**
     * Current check state.
     */
    checked: boolean;
  }): VNode[];
  /**
   * Custom row editor init icon template.
   */
  roweditoriniticon(): VNode[];
  /**
   * Custom row editor save icon template.
   */
  roweditorsaveicon(): VNode[];
  /**
   * Custom row editor cancel icon template.
   */
  roweditorcancelicon(): VNode[];
  /**
   * Custom filter icon template.
   */
  filtericon(): VNode[];
  /**
   * Custom filter clear icon template.
   */
  filterclearicon(): VNode[];
  /**
   * Custom filter remove icon template.
   */
  filterremoveicon(): VNode[];
  /**
   * Custom filter add icon template.
   */
  filteraddicon(): VNode[];
  /**
   * Custom sort icon template.
   * @param {Object} scope - sort icon slot's params.
   */
  sorticon(scope: {
    /**
     * Style class of the sort icon.
     */
    class: string;
    /**
     * Current sort state.
     */
    sorted: boolean;
    /**
     * Current sort order state.
     */
    sortOrder: number;
  }): VNode[];
  /**
   * Custom header checkbox icon template.
   * @param {Object} scope - header checkbox icon slot's params.
   */
  headercheckboxicon(scope: {
    /**
     * Current check state.
     */
    checked: boolean;
  }): VNode[];
  /**
   * Custom row reorder icon template.
   */
  rowreordericon(): VNode[];
  /**
   * @deprecated since v4.0. Use 'nodetoggleicon' slot instead.
   * Custom node toggler icon template.
   */
  nodetogglericon(): VNode[];
  /**
   * Custom node toggler icon template.
   */
  nodetoggleicon(): VNode[];
}

export interface ColumnEmitsOptions {}

export declare type ColumnEmits = EmitFn<ColumnEmitsOptions>;

/**
 * **XiaoyeUI - Column**
 *
 * _Column is a helper component for DataTable and TreeTable._
 *
 * [Live Demo](https://www.xiaoye-ui/datatable/)
 * --- ---
 * ![XiaoyeUI](https://primefaces.org/cdn/primevue/images/logo-100.png)
 *
 * @group Component
 *
 */
declare const Column: DefineComponent<ColumnProps, ColumnSlots, ColumnEmits>;

export type ColumnNode = { props: ColumnProps };

declare module 'vue' {
  export interface GlobalComponents {
    Column: DefineComponent<ColumnProps, ColumnSlots, ColumnEmits>;
  }
}

export default Column;
