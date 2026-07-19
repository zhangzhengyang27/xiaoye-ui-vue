import { clearSelection, getAttribute, isClickable } from '@xiaoye-ui/utils/dom';
import { nextTick } from 'vue';
import type { DataTableContext } from './types';

export function useDataTableSorting(ctx: DataTableContext) {
  const {
    props,
    emit,
    d_sortField,
    d_sortOrder,
    d_nullSortOrder,
    d_multiSortMeta,
    d_groupRowsSortMeta,
    engine,
    columnProp,
    createLazyLoadEvent,
    clearEditingMetaData,
  } = ctx;

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

        // 在事件处理中清空编辑元数据，避免在 computed 中突变状态
        clearEditingMetaData();

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
          ctx.resetPage();
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
          emit('change', ctx.processedData.value);
        });
      }
    }
  }

  function sortSingle(value: any[]): any[] {
    // 不在此处调用 clearEditingMetaData()，已在 onColumnHeaderClick 中处理
    if (props.groupRowsBy && props.groupRowsBy === props.sortField) {
      d_multiSortMeta.value = [
        { field: props.sortField, order: props.sortOrder || props.defaultSortOrder },
        { field: d_sortField.value, order: d_sortOrder.value },
      ];

      return sortMultiple(value);
    }

    return engine.sortSingle(value, {
      sortField: d_sortField.value,
      sortOrder: d_sortOrder.value,
      nullSortOrder: d_nullSortOrder.value,
    });
  }

  function sortMultiple(value: any[]): any[] {
    // 不在此处调用 clearEditingMetaData()，已在 onColumnHeaderClick 中处理
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

    return engine.sortMultiple(value, {
      multiSortMeta: d_multiSortMeta.value,
      nullSortOrder: d_nullSortOrder.value,
    });
  }

  function addMultiSortField(field: string) {
    const index = d_multiSortMeta.value.findIndex(meta => meta.field === field);

    if (index >= 0) {
      if (props.removableSort && d_multiSortMeta.value[index].order * -1 === props.defaultSortOrder)
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

  return { onColumnHeaderClick, sortSingle, sortMultiple, addMultiSortField };
}
