/// <reference types="vue/jsx" />
import { useProvide } from '@xiaoye-ui/core/composables';
import { HelperSet } from '@xiaoye-ui/core/utils';
import { ArrowDownIcon, ArrowUpIcon, SpinnerIcon } from '@xiaoye-ui/icons';
import { cn } from '@xiaoye-ui/utils';
import {
  addStyle,
  clearSelection,
  exportCSV,
  find,
  findSingle,
  focus,
  getAttribute,
  getHiddenElementOuterHeight,
  getHiddenElementOuterWidth,
  getIndex,
  getOffset,
  getOuterHeight,
  getOuterWidth,
  isClickable,
  isRTL,
  setAttribute,
} from '@xiaoye-ui/utils/dom';
import {
  equals,
  findIndexInList,
  isEmpty,
  isNotEmpty,
  localeComparator,
  reorderArray,
  resolveFieldData,
  sort,
} from '@xiaoye-ui/utils/object';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  Transition,
  watch,
} from 'vue';
import Pagination from 'xiaoye-ui/pagination';
import VirtualScroller from 'xiaoye-ui/virtual-scroller';
import { FilterMatchMode, FilterOperator, FilterService } from 'xiaoye-ui/table-core';
import Column from './column/Column';
import useStyle from './style';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import dataTableProps from './dataTableTypes';
import { getColumnProp as getDataTableColumnProp } from './utils';

// Rename components to match template usage
const DTPagination = Pagination;
const DTVirtualScroller = VirtualScroller;
const DTTableHeader = TableHeader;
const DTTableBody = TableBody;
const DTTableFooter = TableFooter;

const DataTable = defineComponent({
  name: 'XYDataTable',
  inheritAttrs: false,
  __XY_DATA_TABLE: true,
  props: initDefaultProps(dataTableProps(), {}),
  emits: [
    'value-change',
    'update:first',
    'update:rows',
    'page',
    'update:sortField',
    'update:sortOrder',
    'update:multiSortMeta',
    'sort',
    'filter',
    'row-click',
    'row-dblclick',
    'update:selection',
    'row-select',
    'row-unselect',
    'update:contextMenuSelection',
    'row-contextmenu',
    'row-unselect-all',
    'row-select-all',
    'select-all-change',
    'column-resize-end',
    'column-reorder',
    'row-reorder',
    'update:expandedRows',
    'row-collapse',
    'row-expand',
    'update:expandedRowGroups',
    'rowgroup-collapse',
    'rowgroup-expand',
    'update:filters',
    'state-restore',
    'state-save',
    'cell-edit-init',
    'cell-edit-complete',
    'cell-edit-cancel',
    'update:editingRows',
    'row-edit-init',
    'row-edit-save',
    'row-edit-cancel',
    'update:totalRecords',
  ],
  setup(props, { emit, expose, slots }) {
    // Get instance and proxy
    const instance = getCurrentInstance()!;
    const proxy = instance.proxy!;

    // Data refs
    const d_first = ref(props.first);
    const d_rows = ref(props.rows);
    const d_sortField = ref(props.sortField);
    const d_sortOrder = ref(props.sortOrder);
    const d_nullSortOrder = ref(props.nullSortOrder);
    const d_multiSortMeta = ref<any[]>(props.multiSortMeta ? [...props.multiSortMeta] : []);
    const d_groupRowsSortMeta = ref<any>(null);
    const d_selectionKeys = ref<Record<string, number> | null>(null);
    const d_columnOrder = ref<string[] | null>(null);
    const d_editingRowKeys = ref<Record<string, number> | null>(null);
    const d_editingMeta = ref<Record<string, any>>({});
    const d_filters = ref<Record<string, any>>(cloneFilters(props.filters));

    // HelperSet instances (not refs - they need to be provided directly for inject to work)
    const d_columns = new HelperSet({ type: 'XYColumn' });
    const d_columnGroups = new HelperSet({ type: 'XYColumnGroup' });

    // Version counter to force re-evaluation of columns computed
    const columnsVersion = ref(0);

    function updateColumnsVersion() {
      columnsVersion.value++;
    }

    // Wrap HelperSet methods to trigger reactivity
    const originalAdd = d_columns.add.bind(d_columns);
    const originalDelete = d_columns.delete.bind(d_columns);
    d_columns.add = (instance: any) => {
      const size = (d_columns as any).helpers?.size;

      originalAdd(instance);

      if (size !== (d_columns as any).helpers?.size) {
        updateColumnsVersion();
      }
    };
    d_columns.delete = (instance: any) => {
      const size = (d_columns as any).helpers?.size;

      originalDelete(instance);

      if (size !== (d_columns as any).helpers?.size) {
        updateColumnsVersion();
      }
    };

    const originalAddGroups = d_columnGroups.add.bind(d_columnGroups);
    const originalDeleteGroups = d_columnGroups.delete.bind(d_columnGroups);
    d_columnGroups.add = (instance: any) => {
      const size = (d_columnGroups as any).helpers?.size;

      originalAddGroups(instance);

      if (size !== (d_columnGroups as any).helpers?.size) {
        updateColumnsVersion();
      }
    };
    d_columnGroups.delete = (instance: any) => {
      const size = (d_columnGroups as any).helpers?.size;

      originalDeleteGroups(instance);

      if (size !== (d_columnGroups as any).helpers?.size) {
        updateColumnsVersion();
      }
    };

    // Non-reactive instance properties
    let rowTouched = false;
    let anchorRowIndex: number | null = null;
    let rangeRowIndex: number | null = null;
    let documentColumnResizeListener: ((event: MouseEvent) => void) | null = null;
    let documentColumnResizeEndListener: (() => void) | null = null;
    let lastResizeHelperX: number | null = null;
    let resizeColumnElement: HTMLElement | null = null;
    const columnResizing = ref(false);
    let colReorderIconWidth: number | null = null;
    let colReorderIconHeight: number | null = null;
    let draggedColumn: any = null;
    let draggedColumnElement: HTMLElement | null = null;
    let draggedRowIndex: number | null = null;
    let droppedRowIndex: number | null = null;
    let rowDragging: boolean | null = null;
    let columnWidthsState: string | null = null;
    let tableWidthState: string | null = null;
    let dropPosition: number | null = null;
    let styleElement: HTMLStyleElement | null = null;
    let _lastSavedState: string | null = null;

    // Template refs
    const table = ref<HTMLTableElement | null>(null);
    const virtualScroller = ref<any>(null);
    const bodyRef = ref<any>(null);
    const frozenBodyRef = ref<any>(null);
    const resizeHelper = ref<HTMLDivElement | null>(null);
    const reorderIndicatorUp = ref<HTMLSpanElement | null>(null);
    const reorderIndicatorDown = ref<HTMLSpanElement | null>(null);

    // Provide for child components
    useProvide('$parentInstance', {
      get $el() {
        return instance.proxy?.$el;
      },
      get $attrs() {
        return instance.attrs;
      },
      get $parentInstance() {
        return null;
      },
      columnProp,
      get d_sortField() {
        return d_sortField.value;
      },
      get d_sortOrder() {
        return d_sortOrder.value;
      },
      get d_multiSortMeta() {
        return d_multiSortMeta.value;
      },
      get d_filters() {
        return d_filters.value;
      },
      get resizableColumns() {
        return props.resizableColumns;
      },
      get reorderableColumns() {
        return props.reorderableColumns;
      },
      get loading() {
        return props.loading;
      },
      get size() {
        return props.size;
      },
      get showGridlines() {
        return props.showGridlines;
      },
      get rowHover() {
        return props.rowHover;
      },
      get selectionMode() {
        return props.selectionMode;
      },
      get stripedRows() {
        return props.stripedRows;
      },
      get scrollable() {
        return props.scrollable;
      },
    });
    useProvide('$columns', d_columns);
    useProvide('$columnGroups', d_columnGroups);

    // Helper functions
    function columnProp(col: any, prop: string): any {
      return getDataTableColumnProp(col, prop);
    }

    function cloneFilters(filters: Record<string, any> | undefined): Record<string, any> {
      const cloned: Record<string, any> = {};

      if (filters) {
        Object.entries(filters).forEach(([prop, value]) => {
          cloned[prop] = (value as any).operator
            ? {
                operator: (value as any).operator,
                constraints: (value as any).constraints.map((constraint: any) => {
                  return { ...constraint };
                }),
              }
            : { ...value };
        });
      }

      return cloned;
    }

    function isSameFilters(
      value: Record<string, any> | undefined,
      other: Record<string, any> | undefined,
    ): boolean {
      return equals(value || {}, other || {});
    }

    // Methods
    function onPage(event: any) {
      clearEditingMetaData();

      d_first.value = event.first;
      d_rows.value = event.rows;

      const pageEvent = createLazyLoadEvent(event);

      pageEvent.pageCount = event.pageCount;
      pageEvent.page = event.page;

      emit('update:first', d_first.value);
      emit('update:rows', d_rows.value);
      emit('page', pageEvent);
      nextTick(() => {
        emit('value-change', processedData.value);
      });
    }

    const currentPage = computed(() => {
      return d_rows.value ? Math.floor(d_first.value / d_rows.value) + 1 : 1;
    });

    function onPaginationChange(page: number, pageSize: number) {
      const pageCount = pageSize ? Math.ceil(totalRecordsLength.value / pageSize) : 0;

      onPage({
        first: (page - 1) * pageSize,
        rows: pageSize,
        page,
        pageCount,
      });
    }

    function onColumnHeaderClick(e: any) {
      const event = e.originalEvent;
      const column = e.column;

      if (columnProp(column, 'sortable')) {
        const targetNode = event.target as HTMLElement | null;

        if (!targetNode) return;

        const columnField = columnProp(column, 'sortField') || columnProp(column, 'field');

        if (
          getAttribute(targetNode, 'data-xy-sortable-column') === true ||
          targetNode.classList.contains('xy-data-table-column-title') ||
          targetNode.classList.contains('xy-data-table-column-header-content') ||
          targetNode.classList.contains('xy-data-table-sort-icon') ||
          targetNode.parentElement?.classList.contains('xy-data-table-sort-icon') ||
          targetNode.parentElement?.parentElement?.classList.contains('xy-data-table-sort-icon') ||
          (targetNode.closest('[data-xy-sortable-column="true"]') &&
            !targetNode.closest('.xy-data-table-filter--popover') &&
            !isClickable(event.target))
        ) {
          clearSelection();

          if (props.sortMode === 'single') {
            if (d_sortField.value === columnField) {
              if (props.removableSort && d_sortOrder.value! * -1 === props.defaultSortOrder) {
                d_sortOrder.value = null;
                d_sortField.value = null;
              } else {
                d_sortOrder.value = d_sortOrder.value! * -1;
              }
            } else {
              d_sortOrder.value = props.defaultSortOrder;
              d_sortField.value = columnField;
            }

            emit('update:sortField', d_sortField.value);
            emit('update:sortOrder', d_sortOrder.value);
            resetPage();
          } else if (props.sortMode === 'multiple') {
            const metaKey = event.metaKey || event.ctrlKey;

            if (!metaKey) {
              d_multiSortMeta.value = d_multiSortMeta.value.filter(
                meta => meta.field === columnField,
              );
            }

            addMultiSortField(columnField);
            emit('update:multiSortMeta', d_multiSortMeta.value);
          }

          emit('sort', createLazyLoadEvent(event));
          nextTick(() => {
            emit('value-change', processedData.value);
          });
        }
      }
    }

    function sortSingle(value: any[]): any[] {
      clearEditingMetaData();

      if (props.groupRowsBy && props.groupRowsBy === props.sortField) {
        d_multiSortMeta.value = [
          { field: props.sortField, order: props.sortOrder || props.defaultSortOrder },
          { field: d_sortField.value, order: d_sortOrder.value },
        ];

        return sortMultiple(value);
      }

      const data = [...value];
      const resolvedFieldData = new Map();

      for (const item of data) {
        resolvedFieldData.set(item, resolveFieldData(item, d_sortField.value));
      }

      const comparer = localeComparator();

      data.sort((data1, data2) => {
        const value1 = resolvedFieldData.get(data1);
        const value2 = resolvedFieldData.get(data2);

        return sort(value1, value2, d_sortOrder.value!, comparer, d_nullSortOrder.value);
      });

      return data;
    }

    function sortMultiple(value: any[]): any[] {
      clearEditingMetaData();

      if (
        props.groupRowsBy &&
        (d_groupRowsSortMeta.value ||
          (d_multiSortMeta.value.length && props.groupRowsBy === d_multiSortMeta.value[0].field))
      ) {
        const firstSortMeta = d_multiSortMeta.value[0];

        !d_groupRowsSortMeta.value && (d_groupRowsSortMeta.value = firstSortMeta);

        if (firstSortMeta.field !== d_groupRowsSortMeta.value.field) {
          d_multiSortMeta.value = [d_groupRowsSortMeta.value, ...d_multiSortMeta.value];
        }
      }

      const data = [...value];

      data.sort((data1, data2) => {
        return multisortField(data1, data2, 0);
      });

      return data;
    }

    function multisortField(data1: any, data2: any, index: number): number {
      const value1 = resolveFieldData(data1, d_multiSortMeta.value[index].field);
      const value2 = resolveFieldData(data2, d_multiSortMeta.value[index].field);
      const comparer = localeComparator();

      if (value1 === value2) {
        return d_multiSortMeta.value.length - 1 > index
          ? multisortField(data1, data2, index + 1)
          : 0;
      }

      return sort(
        value1,
        value2,
        d_multiSortMeta.value[index].order,
        comparer,
        d_nullSortOrder.value,
      );
    }

    function addMultiSortField(field: string) {
      const index = d_multiSortMeta.value.findIndex(meta => meta.field === field);

      if (index >= 0) {
        if (
          props.removableSort &&
          d_multiSortMeta.value[index].order * -1 === props.defaultSortOrder
        )
          d_multiSortMeta.value.splice(index, 1);
        else
          d_multiSortMeta.value[index] = {
            field,
            order: d_multiSortMeta.value[index].order * -1,
          };
      } else {
        d_multiSortMeta.value.push({ field, order: props.defaultSortOrder });
      }

      d_multiSortMeta.value = [...d_multiSortMeta.value];
    }

    function getActiveFilters(filters: Record<string, any>): Record<string, any> {
      const removeEmptyFilters = ([key, value]: [string, any]) => {
        if (value.constraints) {
          const filteredConstraints = value.constraints.filter(
            (constraint: any) => constraint.value !== null,
          );

          if (filteredConstraints.length > 0) {
            return [key, { ...value, constraints: filteredConstraints }];
          }
        } else if (value.value !== null) {
          return [key, value];
        }

        return undefined;
      };

      const filterValidEntries = (entry: any) => entry !== undefined;
      const entries = Object.entries(filters).map(removeEmptyFilters).filter(filterValidEntries);

      return Object.fromEntries(entries);
    }

    function filter(data: any[]): any[] | undefined {
      if (!data) {
        return;
      }

      clearEditingMetaData();

      const activeFilters = getActiveFilters(props.filters || {});
      let globalFilterFieldsArray: string[] | undefined;

      if (activeFilters['global']) {
        globalFilterFieldsArray =
          props.globalFilterFields ||
          columns.value.map(
            (col: any) => columnProp(col, 'filterField') || columnProp(col, 'field'),
          );
      }

      let filteredValue: any[] = [];

      for (let i = 0; i < data.length; i++) {
        let localMatch = true;
        let globalMatch = false;
        let localFiltered = false;

        for (const prop in activeFilters) {
          if (Object.prototype.hasOwnProperty.call(activeFilters, prop) && prop !== 'global') {
            localFiltered = true;
            const filterField = prop;
            const filterMeta = activeFilters[filterField];

            if (filterMeta.operator) {
              for (const filterConstraint of filterMeta.constraints) {
                localMatch = executeLocalFilter(filterField, data[i], filterConstraint);

                if (
                  (filterMeta.operator === FilterOperator.OR && localMatch) ||
                  (filterMeta.operator === FilterOperator.AND && !localMatch)
                ) {
                  break;
                }
              }
            } else {
              localMatch = executeLocalFilter(filterField, data[i], filterMeta);
            }

            if (!localMatch) {
              break;
            }
          }
        }

        if (localMatch && activeFilters['global'] && !globalMatch && globalFilterFieldsArray) {
          for (let j = 0; j < globalFilterFieldsArray.length; j++) {
            const globalFilterField = globalFilterFieldsArray[j];

            globalMatch = FilterService.filters[
              activeFilters['global'].matchMode || FilterMatchMode.CONTAINS
            ](
              resolveFieldData(data[i], globalFilterField),
              activeFilters['global'].value,
              props.filterLocale,
            );

            if (globalMatch) {
              break;
            }
          }
        }

        let matches;

        if (activeFilters['global']) {
          matches = localFiltered ? localFiltered && localMatch && globalMatch : globalMatch;
        } else {
          matches = localFiltered && localMatch;
        }

        if (matches) {
          filteredValue.push(data[i]);
        }
      }

      if (filteredValue.length === props.value?.length || Object.keys(activeFilters).length == 0) {
        filteredValue = data;
      }

      const filterEvent = createLazyLoadEvent();

      filterEvent.filteredValue = filteredValue;
      emit('filter', filterEvent);
      emit('value-change', filteredValue);

      return filteredValue;
    }

    function executeLocalFilter(field: string, rowData: any, filterMeta: any): boolean {
      const filterValue = filterMeta.value;
      const filterMatchMode = filterMeta.matchMode || FilterMatchMode.STARTS_WITH;
      const dataFieldValue = resolveFieldData(rowData, field);
      const filterConstraint = FilterService.filters[filterMatchMode];

      return filterConstraint(dataFieldValue, filterValue, props.filterLocale);
    }

    function onRowClick(e: any) {
      const event = e.originalEvent;
      const body = bodyRef.value && bodyRef.value.$el;
      const focusedItem = findSingle(body, 'tr[data-xy-selectable-row="true"][tabindex="0"]');

      if (isClickable(event.target)) {
        return;
      }

      emit('row-click', e);

      if (props.selectionMode) {
        const rowData = e.data;
        const rowIndex = d_first.value + e.index;

        if (isMultipleSelectionMode() && event.shiftKey && anchorRowIndex != null) {
          clearSelection();
          rangeRowIndex = rowIndex;
          selectRange(event);
        } else {
          const selected = isSelected(rowData);
          const metaSelection = rowTouched ? false : props.metaKeySelection;

          anchorRowIndex = rowIndex;
          rangeRowIndex = rowIndex;

          if (metaSelection) {
            const metaKey = event.metaKey || event.ctrlKey;

            if (selected && metaKey) {
              if (isSingleSelectionMode()) {
                emit('update:selection', null);
              } else {
                const selectionIndex = findIndexInSelection(rowData);
                const _selection = (props.selection as any[]).filter((_, i) => i != selectionIndex);

                emit('update:selection', _selection);
              }

              emit('row-unselect', {
                originalEvent: event,
                data: rowData,
                index: rowIndex,
                type: 'row',
              });
            } else {
              if (isSingleSelectionMode()) {
                emit('update:selection', rowData);
              } else if (isMultipleSelectionMode()) {
                let _selection = metaKey ? props.selection || [] : [];

                _selection = [..._selection, rowData];
                emit('update:selection', _selection);
              }

              emit('row-select', {
                originalEvent: event,
                data: rowData,
                index: rowIndex,
                type: 'row',
              });
            }
          } else {
            if (props.selectionMode === 'single') {
              if (selected) {
                emit('update:selection', null);
                emit('row-unselect', {
                  originalEvent: event,
                  data: rowData,
                  index: rowIndex,
                  type: 'row',
                });
              } else {
                emit('update:selection', rowData);
                emit('row-select', {
                  originalEvent: event,
                  data: rowData,
                  index: rowIndex,
                  type: 'row',
                });
              }
            } else if (props.selectionMode === 'multiple') {
              if (selected) {
                const selectionIndex = findIndexInSelection(rowData);
                const _selection = (props.selection as any[]).filter((_, i) => i != selectionIndex);

                emit('update:selection', _selection);
                emit('row-unselect', {
                  originalEvent: event,
                  data: rowData,
                  index: rowIndex,
                  type: 'row',
                });
              } else {
                const _selection = props.selection ? [...props.selection, rowData] : [rowData];

                emit('update:selection', _selection);
                emit('row-select', {
                  originalEvent: event,
                  data: rowData,
                  index: rowIndex,
                  type: 'row',
                });
              }
            }
          }
        }
      }

      rowTouched = false;

      if (focusedItem) {
        if (event.target?.closest('.xy-data-table-row-toggle-icon')) return;

        const targetRow = event.currentTarget?.closest('tr[data-xy-selectable-row="true"]') as
          HTMLElement | undefined;

        (focusedItem as HTMLElement).tabIndex = -1;
        if (targetRow) targetRow.tabIndex = 0;
      }
    }

    function onRowDblClick(e: any) {
      const event = e.originalEvent;

      if (isClickable(event.target)) {
        return;
      }

      emit('row-dblclick', e);
    }

    function onRowRightClick(event: any) {
      if (props.contextMenu) {
        clearSelection();
        event.originalEvent?.target?.focus();
      }

      emit('update:contextMenuSelection', event.data);
      emit('row-contextmenu', event);
    }

    function onRowTouchEnd() {
      rowTouched = true;
    }

    function onRowKeyDown(e: any, slotProps?: any) {
      const event = e.originalEvent;
      const rowData = e.data;
      const rowIndex = e.index;
      const metaKey = event.metaKey || event.ctrlKey;

      if (props.selectionMode) {
        const row = event.target as HTMLElement | null;

        if (!row) return;

        switch (event.code) {
          case 'ArrowDown':
            onArrowDownKey(event, row, rowIndex, slotProps);
            break;

          case 'ArrowUp':
            onArrowUpKey(event, row, rowIndex, slotProps);
            break;

          case 'Home':
            onHomeKey(event, row, rowIndex, slotProps);
            break;

          case 'End':
            onEndKey(event, row, rowIndex, slotProps);
            break;

          case 'Enter':
          case 'NumpadEnter':
            onEnterKey(event, rowData, rowIndex);
            break;

          case 'Space':
            onSpaceKey(event, rowData, rowIndex, slotProps);
            break;

          case 'Tab':
            onTabKey(event, rowIndex);
            break;

          default:
            if (event.code === 'KeyA' && metaKey && isMultipleSelectionMode()) {
              const data = dataToRender(slotProps.rows);

              emit('update:selection', data);
            }

            const isCopyShortcut = event.code === 'KeyC' && metaKey;

            if (!isCopyShortcut) event.preventDefault();

            break;
        }
      }
    }

    function onArrowDownKey(
      event: KeyboardEvent,
      row: HTMLElement,
      rowIndex: number,
      slotProps?: any,
    ) {
      const nextRow = findNextSelectableRow(row);

      nextRow && focusRowChange(row, nextRow);

      if (event.shiftKey) {
        const data = dataToRender(slotProps?.rows);
        const nextRowIndex = rowIndex + 1 >= data.length ? data.length - 1 : rowIndex + 1;

        onRowClick({ originalEvent: event, data: data[nextRowIndex], index: nextRowIndex });
      }

      event.preventDefault();
    }

    function onArrowUpKey(
      event: KeyboardEvent,
      row: HTMLElement,
      rowIndex: number,
      slotProps?: any,
    ) {
      const prevRow = findPrevSelectableRow(row);

      prevRow && focusRowChange(row, prevRow);

      if (event.shiftKey) {
        const data = dataToRender(slotProps?.rows);
        const prevRowIndex = rowIndex - 1 <= 0 ? 0 : rowIndex - 1;

        onRowClick({ originalEvent: event, data: data[prevRowIndex], index: prevRowIndex });
      }

      event.preventDefault();
    }

    function onHomeKey(event: KeyboardEvent, row: HTMLElement, rowIndex: number, slotProps?: any) {
      const firstRow = findFirstSelectableRow();

      firstRow && focusRowChange(row, firstRow);

      if (event.ctrlKey && event.shiftKey) {
        const data = dataToRender(slotProps?.rows);

        emit('update:selection', data.slice(0, rowIndex + 1));
      }

      event.preventDefault();
    }

    function onEndKey(event: KeyboardEvent, row: HTMLElement, rowIndex: number, slotProps?: any) {
      const lastRow = findLastSelectableRow();

      lastRow && focusRowChange(row, lastRow);

      if (event.ctrlKey && event.shiftKey) {
        const data = dataToRender(slotProps?.rows);

        emit('update:selection', data.slice(rowIndex, data.length));
      }

      event.preventDefault();
    }

    function onEnterKey(event: KeyboardEvent, rowData: any, rowIndex: number) {
      onRowClick({ originalEvent: event, data: rowData, index: rowIndex });
      event.preventDefault();
    }

    function onSpaceKey(event: KeyboardEvent, rowData: any, rowIndex: number, slotProps?: any) {
      onEnterKey(event, rowData, rowIndex);

      if (event.shiftKey && props.selection !== null) {
        const data = dataToRender(slotProps?.rows);
        let index;

        if ((props.selection as any[]).length > 0) {
          const firstSelectedRowIndex = findIndexInList((props.selection as any[])[0], data);
          const lastSelectedRowIndex = findIndexInList(
            (props.selection as any[])[(props.selection as any[]).length - 1],
            data,
          );

          index = rowIndex <= firstSelectedRowIndex ? lastSelectedRowIndex : firstSelectedRowIndex;
        } else {
          index = findIndexInList(props.selection, data);
        }

        const _selection =
          index !== rowIndex
            ? data.slice(Math.min(index, rowIndex), Math.max(index, rowIndex) + 1)
            : rowData;

        emit('update:selection', _selection);
      }
    }

    function onTabKey(event: KeyboardEvent, rowIndex: number) {
      const body = bodyRef.value && bodyRef.value.$el;
      const rows = find(body, 'tr[data-xy-selectable-row="true"]');

      if (event.code === 'Tab' && rows && rows.length > 0) {
        const firstSelectedRow = findSingle(body, 'tr[data-xy-selected="true"]');
        const focusedItem = findSingle(body, 'tr[data-xy-selectable-row="true"][tabindex="0"]');

        if (firstSelectedRow) {
          (firstSelectedRow as HTMLElement).tabIndex = 0;
          focusedItem &&
            focusedItem !== firstSelectedRow &&
            ((focusedItem as HTMLElement).tabIndex = -1);
        } else {
          (rows[0] as HTMLElement).tabIndex = 0;
          focusedItem !== rows[0] &&
            rows[rowIndex] &&
            ((rows[rowIndex] as HTMLElement).tabIndex = -1);
        }
      }
    }

    function findNextSelectableRow(row: HTMLElement): HTMLElement | null {
      const nextRow = row.nextElementSibling as HTMLElement;

      if (nextRow) {
        if (getAttribute(nextRow, 'data-xy-selectable-row') === true) return nextRow;
        else return findNextSelectableRow(nextRow);
      } else {
        return null;
      }
    }

    function findPrevSelectableRow(row: HTMLElement): HTMLElement | null {
      const prevRow = row.previousElementSibling as HTMLElement;

      if (prevRow) {
        if (getAttribute(prevRow, 'data-xy-selectable-row') === true) return prevRow;
        else return findPrevSelectableRow(prevRow);
      } else {
        return null;
      }
    }

    function findFirstSelectableRow(): HTMLElement | null {
      return findSingle(table.value, 'tr[data-xy-selectable-row="true"]') as HTMLElement | null;
    }

    function findLastSelectableRow(): HTMLElement | null {
      const rows = find(table.value, 'tr[data-xy-selectable-row="true"]');

      return rows ? (rows[rows.length - 1] as HTMLElement) : null;
    }

    function focusRowChange(firstFocusableRow: HTMLElement, currentFocusedRow: HTMLElement) {
      firstFocusableRow.tabIndex = -1;
      currentFocusedRow.tabIndex = 0;
      focus(currentFocusedRow);
    }

    function toggleRowWithRadio(event: any) {
      const rowData = event.data;

      if (isSelected(rowData)) {
        emit('update:selection', null);
        emit('row-unselect', {
          originalEvent: event.originalEvent,
          data: rowData,
          index: event.index,
          type: 'radiobutton',
        });
      } else {
        emit('update:selection', rowData);
        emit('row-select', {
          originalEvent: event.originalEvent,
          data: rowData,
          index: event.index,
          type: 'radiobutton',
        });
      }
    }

    function toggleRowWithCheckbox(event: any) {
      const rowData = event.data;

      if (isSelected(rowData)) {
        const selectionIndex = findIndexInSelection(rowData);
        const _selection = (props.selection as any[]).filter((_, i) => i != selectionIndex);

        emit('update:selection', _selection);
        emit('row-unselect', {
          originalEvent: event.originalEvent,
          data: rowData,
          index: event.index,
          type: 'checkbox',
        });
      } else {
        let _selection = props.selection ? [...(props.selection as any[])] : [];

        _selection = [..._selection, rowData];
        emit('update:selection', _selection);
        emit('row-select', {
          originalEvent: event.originalEvent,
          data: rowData,
          index: event.index,
          type: 'checkbox',
        });
      }
    }

    function toggleRowsWithCheckbox(event: any) {
      if (props.selectAll !== null) {
        emit('select-all-change', event);
      } else {
        const { originalEvent, checked } = event;
        let _selection: any[] = [];

        if (checked) {
          _selection = props.frozenValue
            ? [...props.frozenValue, ...processedData.value]
            : processedData.value;
          emit('row-select-all', { originalEvent, data: _selection });
        } else {
          emit('row-unselect-all', { originalEvent });
        }

        emit('update:selection', _selection);
      }
    }

    function isSingleSelectionMode(): boolean {
      return props.selectionMode === 'single';
    }

    function isMultipleSelectionMode(): boolean {
      return props.selectionMode === 'multiple';
    }

    function isSelected(rowData: any): boolean {
      if (rowData && props.selection) {
        if (props.dataKey) {
          return d_selectionKeys.value
            ? d_selectionKeys.value[resolveFieldData(rowData, props.dataKey)] !== undefined
            : false;
        } else {
          if (props.selection instanceof Array) return findIndexInSelection(rowData) > -1;
          else return equalsData(rowData, props.selection);
        }
      }

      return false;
    }

    function findIndexInSelection(rowData: any): number {
      return findIndex(rowData, props.selection);
    }

    function findIndex(rowData: any, collection: any): number {
      let index = -1;

      if (collection && (collection as any[]).length) {
        for (let i = 0; i < (collection as any[]).length; i++) {
          if (equalsData(rowData, (collection as any[])[i])) {
            index = i;
            break;
          }
        }
      }

      return index;
    }

    function updateSelectionKeys(selection: any) {
      d_selectionKeys.value = {};

      if (Array.isArray(selection)) {
        for (const data of selection) {
          d_selectionKeys.value[String(resolveFieldData(data, props.dataKey))] = 1;
        }
      } else {
        d_selectionKeys.value[String(resolveFieldData(selection, props.dataKey))] = 1;
      }
    }

    function updateEditingRowKeys(editingRows: any[] | undefined) {
      if (editingRows && editingRows.length) {
        d_editingRowKeys.value = {};

        for (const data of editingRows) {
          d_editingRowKeys.value[String(resolveFieldData(data, props.dataKey))] = 1;
        }
      } else {
        d_editingRowKeys.value = null;
      }
    }

    function equalsData(data1: any, data2: any): boolean {
      return props.compareSelectionBy === 'equals'
        ? data1 === data2
        : equals(data1, data2, props.dataKey);
    }

    function selectRange(event: MouseEvent) {
      let rangeStart, rangeEnd;

      if (rangeRowIndex! > anchorRowIndex!) {
        rangeStart = anchorRowIndex;
        rangeEnd = rangeRowIndex;
      } else if (rangeRowIndex < anchorRowIndex!) {
        rangeStart = rangeRowIndex;
        rangeEnd = anchorRowIndex;
      } else {
        rangeStart = rangeRowIndex;
        rangeEnd = rangeRowIndex;
      }

      if (props.lazy && props.pagination) {
        rangeStart -= d_first.value;
        rangeEnd -= d_first.value;
      }

      const value = processedData.value;
      const _selection: any[] = [];

      for (let i = rangeStart!; i <= rangeEnd!; i++) {
        const rangeRowData = value[i];

        _selection.push(rangeRowData);
        emit('row-select', { originalEvent: event, data: rangeRowData, type: 'row' });
      }

      emit('update:selection', _selection);
    }

    function generateCSV(options: any, data?: any[]): string {
      let csv = '﻿';

      if (!data) {
        data = processedData.value;

        if (options && options.selectionOnly) data = (props.selection as any[]) || [];
        else if (props.frozenValue)
          data = data ? [...props.frozenValue, ...data] : props.frozenValue;
      }

      //headers
      let headerInitiated = false;

      for (let i = 0; i < columns.value.length; i++) {
        const column = columns.value[i];

        if (columnProp(column, 'exportable') !== false && columnProp(column, 'field')) {
          if (headerInitiated) csv += props.csvSeparator;
          else headerInitiated = true;

          csv +=
            '"' +
            (columnProp(column, 'exportHeader') ||
              columnProp(column, 'header') ||
              columnProp(column, 'field')) +
            '"';
        }
      }

      //body
      if (data) {
        data.forEach(record => {
          csv += '\n';
          let rowInitiated = false;

          for (let i = 0; i < columns.value.length; i++) {
            const column = columns.value[i];

            if (columnProp(column, 'exportable') !== false && columnProp(column, 'field')) {
              if (rowInitiated) csv += props.csvSeparator;
              else rowInitiated = true;

              let cellData = resolveFieldData(record, columnProp(column, 'field'));

              if (cellData != null) {
                if (props.exportFunction) {
                  cellData = props.exportFunction({
                    data: cellData,
                    field: columnProp(column, 'field'),
                  });
                } else cellData = String(cellData).replace(/"/g, '""');
              } else cellData = '';

              csv += '"' + cellData + '"';
            }
          }
        });
      }

      //footers
      let footerInitiated = false;

      for (let i = 0; i < columns.value.length; i++) {
        const column = columns.value[i];

        if (i === 0) csv += '\n';

        if (columnProp(column, 'exportable') !== false && columnProp(column, 'exportFooter')) {
          if (footerInitiated) csv += props.csvSeparator;
          else footerInitiated = true;

          csv +=
            '"' +
            (columnProp(column, 'exportFooter') ||
              columnProp(column, 'footer') ||
              columnProp(column, 'field')) +
            '"';
        }
      }

      return csv;
    }

    function exportCSVFunc(options?: any, data?: any[]) {
      const csv = generateCSV(options, data);
      exportCSV(csv, props.exportFilename);
    }

    function resetPage() {
      d_first.value = 0;
      emit('update:first', d_first.value);
    }

    function onColumnResizeStart(event: any) {
      const containerLeft = getOffset(proxy.$el).left;
      const target = event.target;

      if (!target) return;

      resizeColumnElement = target.parentElement;
      columnResizing.value = true;
      lastResizeHelperX = event.pageX - containerLeft + proxy.$el.scrollLeft;

      bindColumnResizeEvents();
    }

    function onColumnResize(event: MouseEvent) {
      const helper = resizeHelper.value as HTMLDivElement | null;

      if (!helper) {
        return;
      }

      helper.style.height = proxy.$el.offsetHeight + 'px';
      helper.style.top = 0 + 'px';

      if (!columnResizing.value || !resizeColumnElement || typeof event.pageX !== 'number') {
        return;
      }

      const containerLeft = getOffset(proxy.$el).left;

      proxy.$el.setAttribute('data-xy-unselectable-text', 'true');
      addStyle(proxy.$el, { 'user-select': 'none' });
      helper.style.left = event.pageX - containerLeft + proxy.$el.scrollLeft + 'px';

      helper.style.display = 'block';
    }

    function onColumnResizeEnd() {
      const delta = isRTL(proxy.$el)
        ? lastResizeHelperX! - (resizeHelper.value as HTMLDivElement).offsetLeft
        : (resizeHelper.value as HTMLDivElement).offsetLeft - lastResizeHelperX!;
      const columnWidth = (resizeColumnElement as HTMLElement).offsetWidth;
      const newColumnWidth = columnWidth + delta;
      const minWidth = (resizeColumnElement as HTMLElement).style.minWidth || 15;

      if (columnWidth + delta > parseInt(String(minWidth), 10)) {
        if (props.columnResizeMode === 'fit') {
          const nextColumn = (resizeColumnElement as HTMLElement).nextElementSibling as HTMLElement;
          const nextColumnWidth = nextColumn.offsetWidth - delta;

          if (newColumnWidth > 15 && nextColumnWidth > 15) {
            resizeTableCells(newColumnWidth, nextColumnWidth);
          }
        } else if (props.columnResizeMode === 'expand') {
          const tableWidth = (table.value as HTMLTableElement).offsetWidth + delta + 'px';

          const updateTableWidth = (el: HTMLElement | null) => {
            !!el && (el.style.width = el.style.minWidth = tableWidth);
          };

          // Reasoning: resize table cells before updating the table width so that it can use existing computed cell widths and adjust only the one column.
          resizeTableCells(newColumnWidth);
          updateTableWidth(table.value);

          if (!virtualScrollerDisabled.value) {
            const body = bodyRef.value && bodyRef.value.$el;
            const frozenBody = frozenBodyRef.value && frozenBodyRef.value.$el;

            updateTableWidth(body);
            updateTableWidth(frozenBody);
          }
        }

        emit('column-resize-end', {
          element: resizeColumnElement,
          delta,
        });
      }

      (resizeHelper.value as HTMLDivElement).style.display = 'none';
      resizeColumnElement = null;
      proxy.$el.removeAttribute('data-xy-unselectable-text');
      proxy.$el.style['user-select'] = '';

      unbindColumnResizeEvents();

      if (isStateful()) {
        saveState();
      }
    }

    function resizeTableCells(newColumnWidth: number, nextColumnWidth?: number) {
      const colIndex = getIndex(resizeColumnElement as HTMLElement);
      const widths: number[] = [];
      const headers = find(table.value, 'thead.xy-data-table-head > tr > th');

      headers.forEach((header: HTMLElement) => widths.push(getOuterWidth(header)));

      destroyStyleElement();
      createStyleElement();

      let innerHTML = '';
      const selector = `.xy-data-table > .xy-data-table-table-container ${virtualScrollerDisabled.value ? '' : '> .xy-virtualscroller'} > table.xy-data-table-table`;

      widths.forEach((width, index) => {
        const colWidth =
          index === colIndex
            ? newColumnWidth
            : nextColumnWidth && index === colIndex + 1
              ? nextColumnWidth
              : width;
        const style = `width: ${colWidth}px !important; max-width: ${colWidth}px !important`;

        innerHTML += `
                    ${selector} > thead.xy-data-table-head > tr > th:nth-child(${index + 1}),
                    ${selector} > tbody.xy-data-table-body > tr > td:nth-child(${index + 1}),
                    ${selector} > tfoot.xy-data-table-foot > tr > td:nth-child(${index + 1}) {
                        ${style}
                    }
                `;
      });

      (styleElement as HTMLStyleElement).innerHTML = innerHTML;
    }

    function bindColumnResizeEvents() {
      if (!documentColumnResizeListener) {
        documentColumnResizeListener = (event: MouseEvent) => {
          if (columnResizing.value) {
            onColumnResize(event);
          }
        };

        document.addEventListener('mousemove', documentColumnResizeListener);
      }

      if (!documentColumnResizeEndListener) {
        documentColumnResizeEndListener = () => {
          if (columnResizing.value) {
            columnResizing.value = false;
            onColumnResizeEnd();
          }
        };

        document.addEventListener('mouseup', documentColumnResizeEndListener);
      }
    }

    function unbindColumnResizeEvents() {
      if (documentColumnResizeListener) {
        document.removeEventListener('mousemove', documentColumnResizeListener);
        documentColumnResizeListener = null;
      }

      if (documentColumnResizeEndListener) {
        document.removeEventListener('mouseup', documentColumnResizeEndListener);
        documentColumnResizeEndListener = null;
      }
    }

    function onColumnHeaderMouseDown(e: any) {
      const event = e.originalEvent;
      const column = e.column;

      if (props.reorderableColumns && columnProp(column, 'reorderableColumn') !== false) {
        const target = event.target;

        if (
          target &&
          (target.nodeName === 'INPUT' ||
            target.nodeName === 'TEXTAREA' ||
            target.classList.contains('xy-data-table-column-resizer'))
        )
          event.currentTarget.draggable = false;
        else event.currentTarget.draggable = true;
      }
    }

    function onColumnHeaderDragStart(e: any) {
      const { originalEvent: event, column } = e;

      if (columnResizing.value) {
        event.preventDefault();

        return;
      }

      colReorderIconWidth = getHiddenElementOuterWidth(reorderIndicatorUp.value as HTMLElement);
      colReorderIconHeight = getHiddenElementOuterHeight(reorderIndicatorUp.value as HTMLElement);

      draggedColumn = column;
      draggedColumnElement = findParentHeader(event.target);
      event.dataTransfer.setData('text', 'b'); // Firefox requires this to make dragging possible
    }

    function onColumnHeaderDragOver(e: any) {
      const { originalEvent: event, column } = e;
      const dropHeader = findParentHeader(event.target);

      if (
        props.reorderableColumns &&
        draggedColumnElement &&
        dropHeader &&
        !columnProp(column, 'frozen')
      ) {
        event.preventDefault();
        const containerOffset = getOffset(proxy.$el);
        const dropHeaderOffset = getOffset(dropHeader);

        if (draggedColumnElement !== dropHeader) {
          const targetLeft = dropHeaderOffset.left - containerOffset.left;
          const columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;

          (reorderIndicatorUp.value as HTMLElement).style.top =
            dropHeaderOffset.top - containerOffset.top - (colReorderIconHeight! - 1) + 'px';
          (reorderIndicatorDown.value as HTMLElement).style.top =
            dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';

          if (event.pageX > columnCenter) {
            (reorderIndicatorUp.value as HTMLElement).style.left =
              targetLeft + dropHeader.offsetWidth - Math.ceil(colReorderIconWidth! / 2) + 'px';
            (reorderIndicatorDown.value as HTMLElement).style.left =
              targetLeft + dropHeader.offsetWidth - Math.ceil(colReorderIconWidth! / 2) + 'px';
            dropPosition = 1;
          } else {
            (reorderIndicatorUp.value as HTMLElement).style.left =
              targetLeft - Math.ceil(colReorderIconWidth! / 2) + 'px';
            (reorderIndicatorDown.value as HTMLElement).style.left =
              targetLeft - Math.ceil(colReorderIconWidth! / 2) + 'px';
            dropPosition = -1;
          }

          (reorderIndicatorUp.value as HTMLElement).style.display = 'block';
          (reorderIndicatorDown.value as HTMLElement).style.display = 'block';
        }
      }
    }

    function onColumnHeaderDragLeave(e: any) {
      const { originalEvent: event } = e;

      if (props.reorderableColumns && draggedColumnElement) {
        event.preventDefault();
        (reorderIndicatorUp.value as HTMLElement).style.display = 'none';
        (reorderIndicatorDown.value as HTMLElement).style.display = 'none';
      }
    }

    function onColumnHeaderDrop(e: any) {
      const { originalEvent: event, column } = e;

      event.preventDefault();

      if (draggedColumnElement) {
        const dragIndex = getIndex(draggedColumnElement);
        const dropIndex = getIndex(findParentHeader(event.target));
        let allowDrop = dragIndex !== dropIndex;

        if (
          allowDrop &&
          ((dropIndex - dragIndex === 1 && dropPosition === -1) ||
            (dropIndex - dragIndex === -1 && dropPosition === 1))
        ) {
          allowDrop = false;
        }

        if (allowDrop) {
          const isSameColumn = (col1: any, col2: any) =>
            columnProp(col1, 'columnKey') || columnProp(col2, 'columnKey')
              ? columnProp(col1, 'columnKey') === columnProp(col2, 'columnKey')
              : columnProp(col1, 'field') === columnProp(col2, 'field');
          const dragColIndex = columns.value.findIndex((child: any) =>
            isSameColumn(child, draggedColumn),
          );
          let dropColIndex = columns.value.findIndex((child: any) => isSameColumn(child, column));
          const widths: number[] = [];
          const headers = find(proxy.$el, 'thead.xy-data-table-head > tr > th');

          headers.forEach((header: HTMLElement) => widths.push(getOuterWidth(header)));
          const movedItem = widths.find((_, index) => index === dragColIndex);
          const remainingItems = widths.filter((_, index) => index !== dragColIndex);
          const reorderedWidths = [
            ...remainingItems.slice(0, dropColIndex),
            movedItem,
            ...remainingItems.slice(dropColIndex),
          ];

          addColumnWidthStyles(reorderedWidths as number[]);

          if (dropColIndex < dragColIndex && dropPosition === 1) {
            dropColIndex++;
          }

          if (dropColIndex > dragColIndex && dropPosition === -1) {
            dropColIndex--;
          }

          reorderArray(columns.value, dragColIndex, dropColIndex);
          updateReorderableColumns();

          emit('column-reorder', {
            originalEvent: event,
            dragIndex: dragColIndex,
            dropIndex: dropColIndex,
          });
        }

        (reorderIndicatorUp.value as HTMLElement).style.display = 'none';
        (reorderIndicatorDown.value as HTMLElement).style.display = 'none';
        (draggedColumnElement as HTMLElement).draggable = false;
        draggedColumnElement = null;
        draggedColumn = null;
        dropPosition = null;
      }
    }

    function findParentHeader(element: HTMLElement): HTMLElement | null {
      if (!element) return null;

      if (element.nodeName === 'TH') {
        return element;
      }

      let parent = element.parentElement as HTMLElement | null;

      while (parent && parent.nodeName !== 'TH') {
        parent = parent.parentElement as HTMLElement | null;
      }

      return parent;
    }

    function findColumnByKey(columns: any[], key: string): any {
      if (columns && columns.length) {
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];

          if (columnProp(column, 'columnKey') === key || columnProp(column, 'field') === key) {
            return column;
          }
        }
      }

      return null;
    }

    function onRowMouseDown(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const parent = target?.parentElement;

      if (
        target?.classList.contains('xy-data-table-reorderable-row-handle') ||
        parent?.classList.contains('xy-data-table-reorderable-row-handle')
      )
        (event.currentTarget as HTMLElement).draggable = true;
      else (event.currentTarget as HTMLElement).draggable = false;
    }

    function onRowDragStart(e: any) {
      const event = e.originalEvent;
      const index = e.index;

      rowDragging = true;
      draggedRowIndex = index;
      event.dataTransfer.setData('text', 'b'); // For firefox
    }

    function onRowDragOver(e: any) {
      const event = e.originalEvent;
      const index = e.index;

      if (rowDragging && draggedRowIndex !== index) {
        const rowElement = event.currentTarget as HTMLElement;
        const rowY = getOffset(rowElement).top;
        const pageY = event.pageY;
        const rowMidY = rowY + getOuterHeight(rowElement) / 2;
        const prevRowElement = rowElement.previousElementSibling as HTMLElement;

        if (pageY < rowMidY) {
          rowElement.classList.remove('xy-data-table-row--dragpoint-bottom');

          droppedRowIndex = index;

          if (prevRowElement) {
            prevRowElement.classList.add('xy-data-table-row--dragpoint-bottom');
          } else {
            rowElement.classList.add('xy-data-table-row--dragpoint-top');
          }
        } else {
          if (prevRowElement) {
            prevRowElement.classList.remove('xy-data-table-row--dragpoint-bottom');
          } else {
            rowElement.classList.add('xy-data-table-row--dragpoint-top');
          }

          droppedRowIndex = index + 1;
          rowElement.classList.add('xy-data-table-row--dragpoint-bottom');
        }

        event.preventDefault();
      }
    }

    function onRowDragLeave(event: DragEvent) {
      const rowElement = event.currentTarget as HTMLElement;
      const prevRowElement = rowElement.previousElementSibling as HTMLElement;

      if (prevRowElement) {
        prevRowElement.classList.remove('xy-data-table-row--dragpoint-bottom');
      }

      rowElement.classList.remove('xy-data-table-row--dragpoint-bottom');
      rowElement.classList.remove('xy-data-table-row--dragpoint-top');
    }

    function onRowDragEnd(event: DragEvent) {
      rowDragging = false;
      draggedRowIndex = null;
      droppedRowIndex = null;
      (event.currentTarget as HTMLElement).draggable = false;
    }

    function onRowDrop(event: DragEvent) {
      if (droppedRowIndex != null) {
        const dropIndex =
          draggedRowIndex! > droppedRowIndex
            ? droppedRowIndex
            : droppedRowIndex === 0
              ? 0
              : droppedRowIndex - 1;
        const processedDataValue = [...processedData.value];

        reorderArray(
          processedDataValue,
          draggedRowIndex! + d_first.value,
          dropIndex + d_first.value,
        );

        emit('row-reorder', {
          originalEvent: event,
          dragIndex: draggedRowIndex,
          dropIndex,
          value: processedDataValue,
        });
      }

      //cleanup
      onRowDragLeave(event);
      onRowDragEnd(event);
      event.preventDefault();
    }

    function toggleRow(event: any) {
      const { expanded, ...rest } = event;
      const rowData = event.data;
      let expandedRows;

      if (props.dataKey) {
        const value = resolveFieldData(rowData, props.dataKey);

        expandedRows = props.expandedRows ? { ...props.expandedRows } : {};
        expanded ? (expandedRows[value] = true) : delete expandedRows[value];
      } else {
        expandedRows = props.expandedRows ? [...(props.expandedRows as any[])] : [];
        expanded
          ? expandedRows.push(rowData)
          : (expandedRows = expandedRows.filter((d: any) => !equalsData(rowData, d)));
      }

      emit('update:expandedRows', expandedRows);
      expanded ? emit('row-expand', rest) : emit('row-collapse', rest);
    }

    function toggleRowGroup(e: any) {
      const event = e.originalEvent;
      const data = e.data;
      const groupFieldValue = resolveFieldData(data, props.groupRowsBy);
      let _expandedRowGroups = props.expandedRowGroups ? [...props.expandedRowGroups] : [];

      if (isRowGroupExpanded(data)) {
        _expandedRowGroups = _expandedRowGroups.filter(group => group !== groupFieldValue);
        emit('update:expandedRowGroups', _expandedRowGroups);
        emit('rowgroup-collapse', { originalEvent: event, data: groupFieldValue });
      } else {
        _expandedRowGroups.push(groupFieldValue);
        emit('update:expandedRowGroups', _expandedRowGroups);
        emit('rowgroup-expand', { originalEvent: event, data: groupFieldValue });
      }
    }

    function isRowGroupExpanded(rowData: any): boolean {
      if (props.expandableRowGroups && props.expandedRowGroups) {
        const groupFieldValue = resolveFieldData(rowData, props.groupRowsBy);

        return props.expandedRowGroups.indexOf(groupFieldValue) > -1;
      }

      return false;
    }

    function isStateful(): boolean {
      return props.stateKey != null;
    }

    let stateDirty = false;

    function getStorage(): Storage {
      switch (props.stateStorage) {
        case 'local':
          return window.localStorage;

        case 'session':
          return window.sessionStorage;

        default:
          throw new Error(
            props.stateStorage +
              ' is not a valid value for the state storage, supported values are "local" and "session".',
          );
      }
    }

    function saveState() {
      const storage = getStorage();
      const state: any = {};

      if (props.pagination) {
        state.first = d_first.value;
        state.rows = d_rows.value;
      }

      if (d_sortField.value) {
        // Functions can't be serialized, so don't attempt to save them
        if (typeof d_sortField.value !== 'function') state.sortField = d_sortField.value;
        state.sortOrder = d_sortOrder.value;
      }

      if (d_multiSortMeta.value) {
        state.multiSortMeta = d_multiSortMeta.value;
      }

      if (hasFilters.value) {
        state.filters = props.filters;
      }

      if (props.resizableColumns) {
        saveColumnWidths(state);
      }

      if (props.reorderableColumns) {
        state.columnOrder = d_columnOrder.value;
      }

      if (props.expandedRows) {
        state.expandedRows = props.expandedRows;
      }

      if (props.expandedRowGroups) {
        state.expandedRowGroups = props.expandedRowGroups;
      }

      if (props.selection) {
        state.selection = props.selection;
        state.selectionKeys = d_selectionKeys.value;
      }

      if (Object.keys(state).length) {
        const serializedState = JSON.stringify(state);

        if (serializedState !== _lastSavedState) {
          storage.setItem(props.stateKey as string, serializedState);
          _lastSavedState = serializedState;
          emit('state-save', state);
        }
      }
    }

    function restoreState() {
      const storage = getStorage();
      const stateString = storage.getItem(props.stateKey as string);
      const dateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

      const reviver = function (_key: string, value: any) {
        if (typeof value === 'string' && dateFormat.test(value)) {
          return new Date(value);
        }

        return value;
      };

      let parsedState: any;
      try {
        parsedState = JSON.parse(stateString as string, reviver);
      } catch (error) {}
      if (!parsedState || typeof parsedState !== 'object') {
        storage.removeItem(props.stateKey as string);
        return;
      }

      const restoredState: any = {};

      if (props.pagination) {
        if (typeof parsedState.first === 'number') {
          d_first.value = parsedState.first;
          emit('update:first', d_first.value);
          restoredState.first = d_first.value;
        }
        if (typeof parsedState.rows === 'number') {
          d_rows.value = parsedState.rows;
          emit('update:rows', d_rows.value);
          restoredState.rows = d_rows.value;
        }
      }

      if (typeof parsedState.sortField === 'string') {
        d_sortField.value = parsedState.sortField;
        emit('update:sortField', d_sortField.value);
        restoredState.sortField = d_sortField.value;
      }

      if (typeof parsedState.sortOrder === 'number') {
        d_sortOrder.value = parsedState.sortOrder;
        emit('update:sortOrder', d_sortOrder.value);
        restoredState.sortOrder = d_sortOrder.value;
      }

      if (Array.isArray(parsedState.multiSortMeta)) {
        d_multiSortMeta.value = parsedState.multiSortMeta;
        emit('update:multiSortMeta', d_multiSortMeta.value);
        restoredState.multiSortMeta = d_multiSortMeta.value;
      }

      if (
        hasFilters.value &&
        typeof parsedState.filters === 'object' &&
        parsedState.filters !== null
      ) {
        d_filters.value = cloneFilters(parsedState.filters);
        emit('update:filters', d_filters.value);
        restoredState.filters = d_filters.value;
      }

      if (props.resizableColumns) {
        if (typeof parsedState.columnWidths === 'string') {
          columnWidthsState = parsedState.columnWidths;
          restoredState.columnWidths = columnWidthsState;
        }
        if (typeof parsedState.tableWidth === 'string') {
          tableWidthState = parsedState.tableWidth;
          restoredState.tableWidth = tableWidthState;
        }
      }

      if (props.reorderableColumns && Array.isArray(parsedState.columnOrder)) {
        d_columnOrder.value = parsedState.columnOrder;
        restoredState.columnOrder = d_columnOrder.value;
      }

      if (typeof parsedState.expandedRows === 'object' && parsedState.expandedRows !== null) {
        emit('update:expandedRows', parsedState.expandedRows);
        restoredState.expandedRows = parsedState.expandedRows;
      }

      if (Array.isArray(parsedState.expandedRowGroups)) {
        emit('update:expandedRowGroups', parsedState.expandedRowGroups);
        restoredState.expandedRowGroups = parsedState.expandedRowGroups;
      }

      if (typeof parsedState.selection === 'object' && parsedState.selection !== null) {
        if (typeof parsedState.selectionKeys === 'object' && parsedState.selectionKeys !== null) {
          d_selectionKeys.value = parsedState.selectionKeys;
          restoredState.selectionKeys = d_selectionKeys.value;
        }
        emit('update:selection', parsedState.selection);
        restoredState.selection = parsedState.selection;
      }

      emit('state-restore', restoredState);
    }

    function saveColumnWidths(state: any) {
      const widths: number[] = [];
      const headers = find(proxy.$el, 'thead.xy-data-table-head > tr > th');

      headers.forEach((header: HTMLElement) => widths.push(getOuterWidth(header)));
      state.columnWidths = widths.join(',');

      if (props.columnResizeMode === 'expand') {
        state.tableWidth = getOuterWidth(table.value as HTMLTableElement) + 'px';
      }
    }

    function addColumnWidthStyles(widths: number[]) {
      createStyleElement();

      let innerHTML = '';
      const selector = `.xy-data-table > .xy-data-table-table-container ${virtualScrollerDisabled.value ? '' : '> .xy-virtualscroller'} > table.xy-data-table-table`;

      widths.forEach((width, index) => {
        const style = `width: ${width}px !important; max-width: ${width}px !important`;

        innerHTML += `
        ${selector} > thead.xy-data-table-head > tr > th:nth-child(${index + 1}),
        ${selector} > tbody.xy-data-table-body > tr > td:nth-child(${index + 1}),
        ${selector} > tfoot.xy-data-table-foot > tr > td:nth-child(${index + 1}) {
            ${style}
        }
    `;
      });

      (styleElement as HTMLStyleElement).innerHTML = innerHTML;
    }

    function restoreColumnWidths() {
      if (columnWidthsState) {
        const widths = columnWidthsState.split(',');

        if (props.columnResizeMode === 'expand' && tableWidthState) {
          (table.value as HTMLTableElement).style.width = tableWidthState;
          (table.value as HTMLTableElement).style.minWidth = tableWidthState;
        }

        if (isNotEmpty(widths)) {
          addColumnWidthStyles(widths.map(w => parseInt(w)));
        }
      }
    }

    function onCellEditInit(event: any) {
      emit('cell-edit-init', event);
    }

    function onCellEditComplete(event: any) {
      emit('cell-edit-complete', event);
    }

    function onCellEditCancel(event: any) {
      emit('cell-edit-cancel', event);
    }

    function onRowEditInit(event: any) {
      const _editingRows = props.editingRows ? [...props.editingRows] : [];

      _editingRows.push(event.data);
      emit('update:editingRows', _editingRows);
      emit('row-edit-init', event);
    }

    function onRowEditSave(event: any) {
      const _editingRows = [...(props.editingRows as any[])];

      _editingRows.splice(findIndex(event.data, _editingRows), 1);
      emit('update:editingRows', _editingRows);
      emit('row-edit-save', event);
    }

    function onRowEditCancel(event: any) {
      const _editingRows = [...(props.editingRows as any[])];

      _editingRows.splice(findIndex(event.data, _editingRows), 1);
      emit('update:editingRows', _editingRows);
      emit('row-edit-cancel', event);
    }

    function onEditingMetaChange(event: any) {
      const { data, field, index, editing } = event;
      const editingMeta = { ...d_editingMeta.value };
      let meta = editingMeta[index];

      if (editing) {
        !meta && (meta = editingMeta[index] = { data: { ...data }, fields: [] });
        meta['fields'].push(field);
      } else if (meta) {
        const fields = meta['fields'].filter((f: string) => f !== field);

        !fields.length ? delete editingMeta[index] : (meta['fields'] = fields);
      }

      d_editingMeta.value = editingMeta;
    }

    function clearEditingMetaData() {
      if (props.editMode) {
        d_editingMeta.value = {};
      }
    }

    function createLazyLoadEvent(event?: any): any {
      return {
        originalEvent: event,
        first: d_first.value,
        rows: d_rows.value,
        sortField: d_sortField.value,
        sortOrder: d_sortOrder.value,
        multiSortMeta: d_multiSortMeta.value,
        filters: d_filters.value,
      };
    }

    function onFilterChange(filters: Record<string, any>) {
      d_filters.value = filters;
    }

    function onFilterApply() {
      d_first.value = 0;
      emit('update:first', d_first.value);
      emit('update:filters', d_filters.value);

      if (props.lazy) {
        emit('filter', createLazyLoadEvent());
      }
    }

    function updateReorderableColumns() {
      const columnOrder: string[] = [];

      columns.value.forEach((col: any) =>
        columnOrder.push(columnProp(col, 'columnKey') || columnProp(col, 'field')),
      );
      d_columnOrder.value = columnOrder;
    }

    function createStyleElement() {
      if (styleElement) return styleElement;
      styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      setAttribute(
        styleElement,
        'nonce',
        instance.appContext.config.globalProperties.$xiaoyeUI?.config?.csp?.nonce,
      );
      document.head.appendChild(styleElement);
    }

    function destroyStyleElement() {
      if (styleElement) {
        document.head.removeChild(styleElement);
        styleElement = null;
      }
    }

    function dataToRender(data?: any[]): any[] {
      const _data = data || processedData.value;

      if (_data && props.pagination) {
        const first = props.lazy ? 0 : d_first.value;

        return _data.slice(first, first + d_rows.value);
      }

      return _data;
    }

    function getVirtualScrollerRef() {
      return virtualScroller.value;
    }

    function hasSpacerStyle(style: any): boolean {
      return isNotEmpty(style);
    }

    // Computed properties
    const columns = computed(() => {
      // Access version to trigger reactivity when columns change
      columnsVersion.value;
      // Access slots to trigger reactivity when slots change
      const _slots = slots.default?.() || [];
      const cols = d_columns.get(proxy, { default: () => _slots });

      if (cols && props.reorderableColumns && d_columnOrder.value) {
        const orderedColumns: any[] = [];

        for (const columnKey of d_columnOrder.value) {
          const column = findColumnByKey(cols, columnKey);

          if (column && !columnProp(column, 'hidden')) {
            orderedColumns.push(column);
          }
        }

        return [...orderedColumns, ...cols.filter((item: any) => orderedColumns.indexOf(item) < 0)];
      }

      return cols;
    });

    const columnGroups = computed(() => {
      // Access version to trigger reactivity when columns change
      columnsVersion.value;
      // Access slots to trigger reactivity when slots change
      const _slots = slots.default?.() || [];
      return d_columnGroups.get(proxy, { default: () => _slots });
    });

    const headerColumnGroup = computed(() => {
      return columnGroups.value?.find((group: any) => columnProp(group, 'type') === 'header');
    });

    const footerColumnGroup = computed(() => {
      return columnGroups.value?.find((group: any) => columnProp(group, 'type') === 'footer');
    });

    const hasFilters = computed(() => {
      return (
        props.filters &&
        Object.keys(props.filters).length > 0 &&
        props.filters.constructor === Object
      );
    });

    const filteredData = computed(() => {
      let data = props.value || [];

      if (!props.lazy && !props.virtualScrollerOptions?.lazy) {
        if (data && data.length && hasFilters.value) {
          data = filter(data) || [];
        }
      }

      return data;
    });

    const processedData = computed(() => {
      let data = filteredData.value;

      if (!props.lazy && !props.virtualScrollerOptions?.lazy) {
        if (data && data.length && sorted.value) {
          if (props.sortMode === 'single') data = sortSingle(data);
          else if (props.sortMode === 'multiple') data = sortMultiple(data);
        }
      }

      return data;
    });

    const totalRecordsLength = computed(() => {
      if (props.lazy) {
        return props.totalRecords;
      } else {
        const data = processedData.value;

        return data ? data.length : 0;
      }
    });

    const empty = computed(() => {
      const data = processedData.value;

      return !data || data.length === 0;
    });

    const paginationTop = computed(() => {
      return (
        props.pagination &&
        (props.paginationPosition === 'top' || props.paginationPosition === 'both')
      );
    });

    const paginationBottom = computed(() => {
      return (
        props.pagination &&
        (props.paginationPosition === 'bottom' || props.paginationPosition === 'both')
      );
    });

    const sorted = computed(() => {
      return d_sortField.value || (d_multiSortMeta.value && d_multiSortMeta.value.length > 0);
    });

    const allRowsSelected = computed(() => {
      if (props.selectAll !== null) {
        return props.selectAll;
      } else {
        const val = props.frozenValue
          ? [...props.frozenValue, ...processedData.value]
          : processedData.value;

        if (
          !isNotEmpty(val) ||
          !props.selection ||
          !Array.isArray(props.selection) ||
          !props.selection.length
        ) {
          return false;
        }

        if (props.dataKey) {
          const selectionSet = new Set(
            (props.selection as any[]).map(s => resolveFieldData(s, props.dataKey)),
          );
          return val.every(v => selectionSet.has(resolveFieldData(v, props.dataKey)));
        }

        return val.every(v => (props.selection as any[]).some(s => equalsData(s, v)));
      }
    });

    const groupRowSortField = computed(() => {
      return props.sortMode === 'single'
        ? props.sortField
        : d_groupRowsSortMeta.value
          ? d_groupRowsSortMeta.value.field
          : null;
    });

    const headerFilterButtonProps = computed(() => {
      return {
        filter: { severity: 'secondary', text: true, rounded: true },
        ...props.filterButtonProps,
        inline: {
          clear: { severity: 'secondary', text: true, rounded: true },
          ...props.filterButtonProps?.inline,
        },
        popover: {
          addRule: { severity: 'info', text: true, size: 'small' },
          removeRule: { severity: 'danger', text: true, size: 'small' },
          apply: { size: 'small' },
          clear: { outlined: true, size: 'small' },
          ...props.filterButtonProps?.popover,
        },
      };
    });

    const rowEditButtonProps = computed(() => {
      return {
        ...{
          init: { severity: 'secondary', text: true, rounded: true },
          save: { severity: 'secondary', text: true, rounded: true },
          cancel: { severity: 'secondary', text: true, rounded: true },
        },
        ...props.editButtonProps,
      };
    });

    const virtualScrollerDisabled = computed(() => {
      return isEmpty(props.virtualScrollerOptions) || !props.scrollable;
    });

    const { prefixCls } = useConfigInject('data-table', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const dataP = computed(() => {
      return cn({
        [`${prefixCls.value}-scrollable`]: props.scrollable,
        [`${prefixCls.value}-flex-scrollable`]: props.scrollable && props.scrollHeight === 'flex',
        [`${prefixCls.value}-${props.size}`]: props.size,
        [`${prefixCls.value}-loading`]: props.loading,
        [`${prefixCls.value}-empty`]: empty.value,
        [`${prefixCls.value}-resizable`]: props.resizableColumns,
        [`${prefixCls.value}-resizable-fit`]:
          props.resizableColumns && props.columnResizeMode === 'fit',
        [`${prefixCls.value}-reorderable`]: props.reorderableColumns,
      });
    });

    // Watchers
    watch(
      [d_first, d_rows, d_sortField, d_sortOrder, d_multiSortMeta, d_filters, d_columnOrder],
      () => {
        stateDirty = true;
      },
    );

    watch(
      () => props.first,
      newValue => {
        d_first.value = newValue;
      },
    );

    watch(
      () => props.rows,
      newValue => {
        d_rows.value = newValue;
      },
    );

    watch(
      () => props.sortField,
      newValue => {
        d_sortField.value = newValue;
      },
    );

    watch(
      () => props.sortOrder,
      newValue => {
        d_sortOrder.value = newValue;
      },
    );

    watch(
      () => props.nullSortOrder,
      newValue => {
        d_nullSortOrder.value = newValue;
      },
    );

    watch(
      () => props.multiSortMeta,
      newValue => {
        d_multiSortMeta.value = newValue ? [...newValue] : [];
      },
    );

    watch(
      () => props.selection,
      newValue => {
        if (props.dataKey) {
          updateSelectionKeys(newValue);
        }
      },
      { immediate: true },
    );

    watch(
      () => props.editingRows,
      newValue => {
        if (props.dataKey) {
          updateEditingRowKeys(newValue);
        }
      },
      { immediate: true },
    );

    watch(
      () => props.filters,
      newValue => {
        if (!isSameFilters(newValue, d_filters.value)) {
          d_filters.value = cloneFilters(newValue);
        }
      },
      { deep: true },
    );

    watch(totalRecordsLength, newValue => {
      emit('update:totalRecords', newValue);
    });

    // Lifecycle hooks
    onMounted(() => {
      if (isStateful()) {
        restoreState();

        props.resizableColumns && restoreColumnWidths();
      }

      if (props.editMode === 'row' && props.dataKey && !d_editingRowKeys.value) {
        updateEditingRowKeys(props.editingRows);
      }
    });

    onUpdated(() => {
      if (isStateful() && stateDirty) {
        stateDirty = false;
        saveState();
      }

      if (props.editMode === 'row' && props.dataKey && !d_editingRowKeys.value) {
        updateEditingRowKeys(props.editingRows);
      }
    });

    onBeforeUnmount(() => {
      unbindColumnResizeEvents();
      destroyStyleElement();

      d_columns.clear();
      d_columnGroups.clear();
    });

    // Expose public API
    expose({
      exportCSV: exportCSVFunc,
      resetPage,
      getVirtualScrollerRef,
      columnProp,
      columns,
      processedData,
      totalRecordsLength,
      empty,
      paginationTop,
      paginationBottom,
      sorted,
      allRowsSelected,
      groupRowSortField,
      headerFilterButtonProps,
      rowEditButtonProps,
      virtualScrollerDisabled,
      dataP,
      toggleRowsWithCheckbox,
      toggleRowWithCheckbox,
      toggleRowWithRadio,
      toggleRow,
      onRowClick,
      onColumnHeaderClick,
      filter,
      onColumnResizeStart,
      onColumnResize,
      onColumnResizeEnd,
      getStorage,
      saveState,
      onRowEditInit,
      onRowEditSave,
      onRowEditCancel,
      columnResizing,
    });

    // Pagination slots (reused for top and bottom paginations)
    const renderPaginationSlots = () => ({
      container: slots.paginationcontainer
        ? (slotProps: any) =>
            slots.paginationcontainer({
              first: slotProps.first,
              last: slotProps.last,
              rows: slotProps.rows,
              page: slotProps.page,
              pageCount: slotProps.pageCount,
              pageLinks: slotProps.pageLinks,
              totalRecords: slotProps.totalRecords,
              firstPageCallback: slotProps.firstPageCallback,
              lastPageCallback: slotProps.lastPageCallback,
              prevPageCallback: slotProps.prevPageCallback,
              nextPageCallback: slotProps.nextPageCallback,
              rowChangeCallback: slotProps.rowChangeCallback,
              changePageCallback: slotProps.changePageCallback,
            })
        : undefined,
      start: slots.paginationstart ? () => slots.paginationstart() : undefined,
      end: slots.paginationend ? () => slots.paginationend() : undefined,
      firstpagelinkicon: slots.paginationfirstpagelinkicon
        ? (slotProps: any) => slots.paginationfirstpagelinkicon({ class: slotProps.class })
        : undefined,
      prevpagelinkicon: slots.paginationprevpagelinkicon
        ? (slotProps: any) => slots.paginationprevpagelinkicon({ class: slotProps.class })
        : undefined,
      nextpagelinkicon: slots.paginationnextpagelinkicon
        ? (slotProps: any) => slots.paginationnextpagelinkicon({ class: slotProps.class })
        : undefined,
      lastpagelinkicon: slots.paginationlastpagelinkicon
        ? (slotProps: any) => slots.paginationlastpagelinkicon({ class: slotProps.class })
        : undefined,
      jumptopagedropdownicon: slots.paginationjumptopagedropdownicon
        ? (slotProps: any) => slots.paginationjumptopagedropdownicon({ class: slotProps.class })
        : undefined,
      rowsperpagedropdownicon: slots.paginationrowsperpagedropdownicon
        ? (slotProps: any) => slots.paginationrowsperpagedropdownicon({ class: slotProps.class })
        : undefined,
    });

    return () =>
      wrapSSR(
        <div
          class={[prefixCls.value, dataP.value, hashId.value]}
          data-scrollselectors=".xy-data-table-table-container"
        >
          {Array.isArray(props.columns) && props.columns.length > 0
            ? props.columns.map((col, i) => (
                <Column
                  key={
                    col.key != null
                      ? col.key
                      : col.dataIndex != null
                        ? col.dataIndex
                        : col.field != null
                          ? col.field
                          : i
                  }
                  columnKey={
                    col.key != null
                      ? col.key
                      : col.columnKey != null
                        ? col.columnKey
                        : col.dataIndex != null
                          ? col.dataIndex
                          : col.field
                  }
                  field={col.field != null ? col.field : col.dataIndex}
                  sortField={col.sortField}
                  filterField={col.filterField}
                  dataType={col.dataType}
                  sortable={Boolean(col.sortable != null ? col.sortable : col.sorter)}
                  header={col.header != null ? col.header : col.title}
                  footer={col.footer}
                  style={
                    col.width != null
                      ? Object.assign(
                          { width: typeof col.width === 'number' ? `${col.width}px` : col.width },
                          col.style || {},
                        )
                      : col.style
                  }
                  class={col.class}
                  headerStyle={col.headerStyle}
                  headerClass={col.headerClass}
                  bodyStyle={col.bodyStyle}
                  bodyClass={col.bodyClass}
                  footerStyle={col.footerStyle}
                  footerClass={col.footerClass}
                  frozen={
                    col.frozen != null ? col.frozen : col.fixed === 'left' || col.fixed === 'right'
                  }
                  alignFrozen={
                    col.alignFrozen != null
                      ? col.alignFrozen
                      : col.fixed === 'right'
                        ? 'right'
                        : 'left'
                  }
                  hidden={col.hidden != null ? col.hidden : col.responsive != null}
                  reorderableColumn={col.reorderableColumn}
                  rowReorder={col.rowReorder}
                  rowEditor={col.rowEditor}
                  expander={col.expander}
                  selectionMode={col.selectionMode}
                  colspan={col.colspan}
                  rowspan={col.rowspan}
                  excludeGlobalFilter={col.excludeGlobalFilter}
                  filterMatchMode={col.filterMatchMode}
                  filterHeaderStyle={col.filterHeaderStyle}
                  filterHeaderClass={col.filterHeaderClass}
                  filterMenuStyle={col.filterMenuStyle}
                  filterMenuClass={col.filterMenuClass}
                  showFilterMenu={col.showFilterMenu}
                  showFilterOperator={col.showFilterOperator}
                  showClearButton={col.showClearButton}
                  showApplyButton={col.showApplyButton}
                  showFilterMatchModes={col.showFilterMatchModes}
                  showAddButton={col.showAddButton}
                  filterMatchModeOptions={col.filterMatchModeOptions}
                  maxConstraints={col.maxConstraints}
                  exportable={col.exportable}
                  exportHeader={col.exportHeader}
                  exportFooter={col.exportFooter}
                />
              ))
            : slots.default?.()}
          <Transition name="xy-data-table-overlay-mask">
            {props.loading ? (
              <div class={['xy-data-table-mask']}>
                {slots.loading ? (
                  slots.loading()
                ) : slots.loadingicon ? (
                  (() => {
                    const LoadingIconComp = slots.loadingicon as any;
                    return <LoadingIconComp class={['xy-data-table-loading-icon']} />;
                  })()
                ) : props.loadingIcon ? (
                  <i class={['xy-data-table-loading-icon', props.loadingIcon]} />
                ) : (
                  <SpinnerIcon spin class={['xy-data-table-loading-icon']} />
                )}
              </div>
            ) : null}
          </Transition>
          {slots.header ? <div class={['xy-data-table-header']}>{slots.header()}</div> : null}
          {paginationTop.value ? (
            <DTPagination
              pageSize={d_rows.value}
              current={currentPage.value}
              total={totalRecordsLength.value}
              pageSizeOptions={props.rowsPerPageOptions}
              showSizeChanger={
                Array.isArray(props.rowsPerPageOptions) && props.rowsPerPageOptions.length > 0
              }
              class={['xy-data-table-pagination', 'xy-data-table-pagination--top']}
              onChange={onPaginationChange}
              hideOnSinglePage={!props.alwaysShowPagination}
              data-xy-pagination-position="top"
              v-slots={renderPaginationSlots()}
            />
          ) : null}
          <div
            class={['xy-data-table-table-container']}
            style={{
              overflow: props.scrollable ? 'auto' : '',
              maxHeight: virtualScrollerDisabled.value ? props.scrollHeight : '',
            }}
          >
            <DTVirtualScroller
              ref={virtualScroller}
              {...props.virtualScrollerOptions}
              items={processedData.value}
              columns={columns.value}
              style={props.scrollHeight !== 'flex' ? { height: props.scrollHeight } : undefined}
              scrollHeight={props.scrollHeight !== 'flex' ? undefined : '100%'}
              disabled={virtualScrollerDisabled.value}
              loaderDisabled
              inline
              autoSize
              showSpacer={false}
              v-slots={{
                content: (slotProps: any) => (
                  <table
                    ref={table}
                    role="table"
                    class={['xy-data-table-table', props.tableClass]}
                    style={[props.tableStyle, slotProps.spacerStyle]}
                    {...props.tableProps}
                  >
                    {props.showHeaders ? (
                      <DTTableHeader
                        columnGroup={headerColumnGroup.value}
                        columns={slotProps.columns}
                        rowGroupMode={props.rowGroupMode}
                        groupRowsBy={props.groupRowsBy}
                        groupRowSortField={groupRowSortField.value}
                        reorderableColumns={props.reorderableColumns}
                        resizableColumns={props.resizableColumns}
                        allRowsSelected={allRowsSelected.value}
                        empty={empty.value}
                        sortMode={props.sortMode}
                        sortField={d_sortField.value}
                        sortOrder={d_sortOrder.value}
                        multiSortMeta={d_multiSortMeta.value}
                        filters={d_filters.value}
                        filtersStore={props.filters}
                        filterDisplay={props.filterDisplay}
                        filterButtonProps={headerFilterButtonProps.value}
                        filterInputProps={props.filterInputProps}
                        first={d_first.value}
                        onColumnClick={(e: any) => onColumnHeaderClick(e)}
                        onColumnMousedown={(e: any) => onColumnHeaderMouseDown(e)}
                        onFilterChange={onFilterChange}
                        onFilterApply={onFilterApply}
                        onColumnDragstart={(e: any) => onColumnHeaderDragStart(e)}
                        onColumnDragover={(e: any) => onColumnHeaderDragOver(e)}
                        onColumnDragleave={(e: any) => onColumnHeaderDragLeave(e)}
                        onColumnDrop={(e: any) => onColumnHeaderDrop(e)}
                        onColumnResizestart={(e: any) => onColumnResizeStart(e)}
                        onCheckboxChange={(e: any) => toggleRowsWithCheckbox(e)}
                      />
                    ) : null}
                    {props.frozenValue ? (
                      <DTTableBody
                        ref={frozenBodyRef}
                        value={props.frozenValue}
                        frozenRow={true}
                        columns={slotProps.columns}
                        first={d_first.value}
                        dataKey={props.dataKey}
                        selection={props.selection}
                        selectionKeys={d_selectionKeys.value}
                        selectionMode={props.selectionMode}
                        rowHover={props.rowHover}
                        contextMenu={props.contextMenu}
                        contextMenuSelection={props.contextMenuSelection}
                        rowGroupMode={props.rowGroupMode}
                        groupRowsBy={props.groupRowsBy}
                        expandableRowGroups={props.expandableRowGroups}
                        rowClass={props.rowClass}
                        rowStyle={props.rowStyle}
                        editMode={props.editMode}
                        compareSelectionBy={props.compareSelectionBy}
                        scrollable={props.scrollable}
                        expandedRowIcon={props.expandedRowIcon}
                        collapsedRowIcon={props.collapsedRowIcon}
                        expandedRows={props.expandedRows}
                        expandedRowGroups={props.expandedRowGroups}
                        editingRows={props.editingRows}
                        editingRowKeys={d_editingRowKeys.value}
                        templates={slots}
                        editButtonProps={rowEditButtonProps.value}
                        isVirtualScrollerDisabled={true}
                        selectionDisabled={props.selectionDisabled}
                        rowExpandable={props.rowExpandable}
                        onRowgroupToggle={toggleRowGroup}
                        onRowClick={(e: any) => onRowClick(e)}
                        onRowDblclick={(e: any) => onRowDblClick(e)}
                        onRowRightclick={(e: any) => onRowRightClick(e)}
                        onRowTouchend={onRowTouchEnd}
                        onRowKeydown={onRowKeyDown}
                        onRowMousedown={onRowMouseDown}
                        onRowDragstart={(e: any) => onRowDragStart(e)}
                        onRowDragover={(e: any) => onRowDragOver(e)}
                        onRowDragleave={(e: any) => onRowDragLeave(e)}
                        onRowDragend={(e: any) => onRowDragEnd(e)}
                        onRowDrop={(e: any) => onRowDrop(e)}
                        onRowToggle={(e: any) => toggleRow(e)}
                        onRadioChange={(e: any) => toggleRowWithRadio(e)}
                        onCheckboxChange={(e: any) => toggleRowWithCheckbox(e)}
                        onCellEditInit={(e: any) => onCellEditInit(e)}
                        onCellEditComplete={(e: any) => onCellEditComplete(e)}
                        onCellEditCancel={(e: any) => onCellEditCancel(e)}
                        onRowEditInit={(e: any) => onRowEditInit(e)}
                        onRowEditSave={(e: any) => onRowEditSave(e)}
                        onRowEditCancel={(e: any) => onRowEditCancel(e)}
                        editingMeta={d_editingMeta.value}
                        onEditingMetaChange={onEditingMetaChange}
                      />
                    ) : null}
                    <DTTableBody
                      ref={bodyRef}
                      value={dataToRender(slotProps.rows)}
                      class={slotProps.styleClass}
                      columns={slotProps.columns}
                      empty={empty.value}
                      first={d_first.value}
                      dataKey={props.dataKey}
                      selection={props.selection}
                      selectionKeys={d_selectionKeys.value}
                      selectionMode={props.selectionMode}
                      rowHover={props.rowHover}
                      contextMenu={props.contextMenu}
                      contextMenuSelection={props.contextMenuSelection}
                      rowGroupMode={props.rowGroupMode}
                      groupRowsBy={props.groupRowsBy}
                      expandableRowGroups={props.expandableRowGroups}
                      rowClass={props.rowClass}
                      rowStyle={props.rowStyle}
                      editMode={props.editMode}
                      compareSelectionBy={props.compareSelectionBy}
                      scrollable={props.scrollable}
                      expandedRowIcon={props.expandedRowIcon}
                      collapsedRowIcon={props.collapsedRowIcon}
                      expandedRows={props.expandedRows}
                      expandedRowGroups={props.expandedRowGroups}
                      editingRows={props.editingRows}
                      editingRowKeys={d_editingRowKeys.value}
                      templates={slots}
                      editButtonProps={rowEditButtonProps.value}
                      virtualScrollerContentProps={slotProps}
                      isVirtualScrollerDisabled={virtualScrollerDisabled.value}
                      selectionDisabled={props.selectionDisabled}
                      rowExpandable={props.rowExpandable}
                      onRowgroupToggle={toggleRowGroup}
                      onRowClick={(e: any) => onRowClick(e)}
                      onRowDblclick={(e: any) => onRowDblClick(e)}
                      onRowRightclick={(e: any) => onRowRightClick(e)}
                      onRowTouchend={onRowTouchEnd}
                      onRowKeydown={(e: any) => onRowKeyDown(e, slotProps)}
                      onRowMousedown={onRowMouseDown}
                      onRowDragstart={(e: any) => onRowDragStart(e)}
                      onRowDragover={(e: any) => onRowDragOver(e)}
                      onRowDragleave={(e: any) => onRowDragLeave(e)}
                      onRowDragend={(e: any) => onRowDragEnd(e)}
                      onRowDrop={(e: any) => onRowDrop(e)}
                      onRowToggle={(e: any) => toggleRow(e)}
                      onRadioChange={(e: any) => toggleRowWithRadio(e)}
                      onCheckboxChange={(e: any) => toggleRowWithCheckbox(e)}
                      onCellEditInit={(e: any) => onCellEditInit(e)}
                      onCellEditComplete={(e: any) => onCellEditComplete(e)}
                      onCellEditCancel={(e: any) => onCellEditCancel(e)}
                      onRowEditInit={(e: any) => onRowEditInit(e)}
                      onRowEditSave={(e: any) => onRowEditSave(e)}
                      onRowEditCancel={(e: any) => onRowEditCancel(e)}
                      editingMeta={d_editingMeta.value}
                      onEditingMetaChange={onEditingMetaChange}
                    />
                    {hasSpacerStyle(slotProps.spacerStyle) ? (
                      <tbody
                        class={['xy-data-table-virtual-scroller-spacer']}
                        style={{
                          height: `calc(${slotProps.spacerStyle.height} - ${slotProps.rows.length * slotProps.itemSize}px)`,
                        }}
                      />
                    ) : null}
                    <DTTableFooter
                      columnGroup={footerColumnGroup.value}
                      columns={slotProps.columns}
                    />
                  </table>
                ),
              }}
            />
          </div>
          {paginationBottom.value ? (
            <DTPagination
              pageSize={d_rows.value}
              current={currentPage.value}
              total={totalRecordsLength.value}
              pageSizeOptions={props.rowsPerPageOptions}
              showSizeChanger={
                Array.isArray(props.rowsPerPageOptions) && props.rowsPerPageOptions.length > 0
              }
              class={['xy-data-table-pagination', 'xy-data-table-pagination--bottom']}
              onChange={onPaginationChange}
              hideOnSinglePage={!props.alwaysShowPagination}
              data-xy-pagination-position="bottom"
              v-slots={renderPaginationSlots()}
            />
          ) : null}
          {slots.footer ? <div class={['xy-data-table-footer']}>{slots.footer()}</div> : null}
          <div
            ref={resizeHelper}
            class={['xy-data-table-column-resize-indicator']}
            style={{ display: 'none' }}
          />
          {props.reorderableColumns ? (
            <span
              ref={reorderIndicatorUp}
              class={['xy-data-table-row-reorder-indicator-up']}
              style={{ position: 'absolute', display: 'none' }}
            >
              {(() => {
                const UpIconComp = (slots.rowreorderindicatorupicon ||
                  slots.reorderindicatorupicon ||
                  ArrowDownIcon) as any;
                return <UpIconComp />;
              })()}
            </span>
          ) : null}
          {props.reorderableColumns ? (
            <span
              ref={reorderIndicatorDown}
              class={['xy-data-table-row-reorder-indicator-down']}
              style={{ position: 'absolute', display: 'none' }}
            >
              {(() => {
                const DownIconComp = (slots.rowreorderindicatordownicon ||
                  slots.reorderindicatordownicon ||
                  ArrowUpIcon) as any;
                return <DownIconComp />;
              })()}
            </span>
          ) : null}
        </div>,
      );
  },
});

export default DataTable;
