import { find, getOuterWidth } from '@xiaoye-ui/utils/dom';
import { isNotEmpty } from '@xiaoye-ui/utils/object';
import {
  safeGetStorage,
  safeGetItem,
  safeSetItem,
  safeJsonStringify,
} from '@xiaoye-ui/utils/storage';
import { cloneFilters } from '../../table-core';
import type { DataTableContext } from './types';

export function useDataTableState(ctx: DataTableContext) {
  const {
    props,
    emit,
    proxy,
    d_first,
    d_rows,
    d_sortField,
    d_sortOrder,
    d_multiSortMeta,
    d_filters,
    d_columnOrder,
    d_selectionKeys,
    table,
    hasFilters,
    virtualScrollerDisabled,
  } = ctx;

  // Non-reactive instance properties
  let stateDirty = false;
  let columnWidthsState: string | null = null;
  let tableWidthState: string | null = null;
  let _lastSavedState: string | null = null;

  function isStateful(): boolean {
    return props.stateKey != null;
  }

  function getStorage(): Storage | null {
    if (props.stateStorage !== 'local' && props.stateStorage !== 'session') {
      throw new Error(
        props.stateStorage +
          ' is not a valid value for the state storage, supported values are "local" and "session".',
      );
    }
    return safeGetStorage(props.stateStorage);
  }

  function saveState() {
    const storage = getStorage();
    if (!storage) return;
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
      const serializedState = safeJsonStringify(state);

      if (serializedState != null && serializedState !== _lastSavedState) {
        if (safeSetItem(storage, props.stateKey as string, serializedState)) {
          _lastSavedState = serializedState;
          emit('state-save', state);
        }
      }
    }
  }

  function restoreState() {
    const storage = getStorage();
    if (!storage) return;
    const stateString = safeGetItem(storage, props.stateKey as string);
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
      if (table.value) {
        state.tableWidth = getOuterWidth(table.value) + 'px';
      }
    }
  }

  function addColumnWidthStyles(widths: number[]) {
    const styleEl = ctx.createStyleElement();

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

    styleEl.innerHTML = innerHTML;
  }

  function restoreColumnWidths() {
    if (columnWidthsState) {
      const widths = columnWidthsState.split(',');

      if (props.columnResizeMode === 'expand' && tableWidthState && table.value) {
        table.value.style.width = tableWidthState;
        table.value.style.minWidth = tableWidthState;
      }

      if (isNotEmpty(widths)) {
        addColumnWidthStyles(widths.map(w => parseInt(w)));
      }
    }
  }

  function getStateDirty() {
    return stateDirty;
  }

  function setStateDirty(value: boolean) {
    stateDirty = value;
  }

  return {
    isStateful,
    getStorage,
    saveState,
    restoreState,
    saveColumnWidths,
    addColumnWidthStyles,
    restoreColumnWidths,
    getStateDirty,
    setStateDirty,
  };
}
