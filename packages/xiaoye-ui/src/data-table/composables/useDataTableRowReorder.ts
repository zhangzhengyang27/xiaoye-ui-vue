import { getOffset, getOuterHeight } from '@xiaoye-ui/utils/dom';
import { reorderArray } from '@xiaoye-ui/utils/object';
import type { DataTableContext } from './types';

export function useDataTableRowReorder(ctx: DataTableContext) {
  const { emit, d_first, processedData } = ctx;

  // Non-reactive instance properties
  let draggedRowIndex: number | null = null;
  let droppedRowIndex: number | null = null;
  let rowDragging: boolean | null = null;

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

      reorderArray(processedDataValue, draggedRowIndex! + d_first.value, dropIndex + d_first.value);

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

  return {
    onRowMouseDown,
    onRowDragStart,
    onRowDragOver,
    onRowDragLeave,
    onRowDragEnd,
    onRowDrop,
  };
}
