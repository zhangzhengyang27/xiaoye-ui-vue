import {
  clearSelection,
  find,
  findSingle,
  focus,
  getAttribute,
  isClickable,
} from '@xiaoye-ui/utils/dom';
import { equals, findIndexInList, resolveFieldData } from '@xiaoye-ui/utils/object';
import type { DataTableContext } from './types';

export function useDataTableSelection(ctx: DataTableContext) {
  const { props, emit, d_first, d_selectionKeys, d_editingRowKeys, bodyRef, table, processedData } =
    ctx;

  // Non-reactive instance properties
  let rowTouched = false;
  let anchorRowIndex: number | null = null;
  let rangeRowIndex: number | null = null;

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
            const data = ctx.dataToRender(slotProps.rows);

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
      const data = ctx.dataToRender(slotProps?.rows);
      const nextRowIndex = rowIndex + 1 >= data.length ? data.length - 1 : rowIndex + 1;

      onRowClick({ originalEvent: event, data: data[nextRowIndex], index: nextRowIndex });
    }

    event.preventDefault();
  }

  function onArrowUpKey(event: KeyboardEvent, row: HTMLElement, rowIndex: number, slotProps?: any) {
    const prevRow = findPrevSelectableRow(row);

    prevRow && focusRowChange(row, prevRow);

    if (event.shiftKey) {
      const data = ctx.dataToRender(slotProps?.rows);
      const prevRowIndex = rowIndex - 1 <= 0 ? 0 : rowIndex - 1;

      onRowClick({ originalEvent: event, data: data[prevRowIndex], index: prevRowIndex });
    }

    event.preventDefault();
  }

  function onHomeKey(event: KeyboardEvent, row: HTMLElement, rowIndex: number, slotProps?: any) {
    const firstRow = findFirstSelectableRow();

    firstRow && focusRowChange(row, firstRow);

    if (event.ctrlKey && event.shiftKey) {
      const data = ctx.dataToRender(slotProps?.rows);

      emit('update:selection', data.slice(0, rowIndex + 1));
    }

    event.preventDefault();
  }

  function onEndKey(event: KeyboardEvent, row: HTMLElement, rowIndex: number, slotProps?: any) {
    const lastRow = findLastSelectableRow();

    lastRow && focusRowChange(row, lastRow);

    if (event.ctrlKey && event.shiftKey) {
      const data = ctx.dataToRender(slotProps?.rows);

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
      const data = ctx.dataToRender(slotProps?.rows);
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

  return {
    onRowClick,
    onRowDblClick,
    onRowRightClick,
    onRowTouchEnd,
    onRowKeyDown,
    toggleRowWithRadio,
    toggleRowWithCheckbox,
    toggleRowsWithCheckbox,
    isSingleSelectionMode,
    isMultipleSelectionMode,
    isSelected,
    findIndexInSelection,
    findIndex,
    updateSelectionKeys,
    updateEditingRowKeys,
    equalsData,
    selectRange,
  };
}
