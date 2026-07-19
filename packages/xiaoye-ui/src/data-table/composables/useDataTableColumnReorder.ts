import {
  find,
  getHiddenElementOuterHeight,
  getHiddenElementOuterWidth,
  getIndex,
  getOffset,
  getOuterWidth,
} from '@xiaoye-ui/utils/dom';
import { reorderArray } from '@xiaoye-ui/utils/object';
import type { DataTableContext } from './types';

export function useDataTableColumnReorder(ctx: DataTableContext) {
  const {
    props,
    emit,
    proxy,
    reorderIndicatorUp,
    reorderIndicatorDown,
    columnResizing,
    columnProp,
    d_columnOrder,
  } = ctx;

  // Non-reactive instance properties
  let colReorderIconWidth: number | null = null;
  let colReorderIconHeight: number | null = null;
  let draggedColumn: any = null;
  let draggedColumnElement: HTMLElement | null = null;
  let dropPosition: number | null = null;

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
          `${dropHeaderOffset.top - containerOffset.top - (colReorderIconHeight! - 1)}px`;
        (reorderIndicatorDown.value as HTMLElement).style.top =
          `${dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight}px`;

        if (event.pageX > columnCenter) {
          (reorderIndicatorUp.value as HTMLElement).style.left =
            `${targetLeft + dropHeader.offsetWidth - Math.ceil(colReorderIconWidth! / 2)}px`;
          (reorderIndicatorDown.value as HTMLElement).style.left =
            `${targetLeft + dropHeader.offsetWidth - Math.ceil(colReorderIconWidth! / 2)}px`;
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
        const dragColIndex = ctx.columns.value.findIndex((child: any) =>
          isSameColumn(child, draggedColumn),
        );
        let dropColIndex = ctx.columns.value.findIndex((child: any) => isSameColumn(child, column));
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

        ctx.addColumnWidthStyles(reorderedWidths as number[]);

        if (dropColIndex < dragColIndex && dropPosition === 1) {
          dropColIndex++;
        }

        if (dropColIndex > dragColIndex && dropPosition === -1) {
          dropColIndex--;
        }

        // Copy before reorder to avoid mutating the computed's cached array in place.
        // updateReorderableColumns() reads the reordered result and persists it to d_columnOrder,
        // which then drives the columns computed on the next evaluation.
        const reordered = [...ctx.columns.value];
        reorderArray(reordered, dragColIndex, dropColIndex);
        updateReorderableColumns(reordered);

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

  function updateReorderableColumns(cols?: any[]) {
    const columnOrder: string[] = [];
    const source = cols || ctx.columns.value;

    source.forEach((col: any) =>
      columnOrder.push(columnProp(col, 'columnKey') || columnProp(col, 'field')),
    );
    d_columnOrder.value = columnOrder;
  }

  return {
    onColumnHeaderMouseDown,
    onColumnHeaderDragStart,
    onColumnHeaderDragOver,
    onColumnHeaderDragLeave,
    onColumnHeaderDrop,
    findParentHeader,
    findColumnByKey,
    updateReorderableColumns,
  };
}
