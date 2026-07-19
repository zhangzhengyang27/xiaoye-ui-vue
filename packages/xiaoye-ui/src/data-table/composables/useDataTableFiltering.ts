import type { DataTableContext } from './types';

export function useDataTableFiltering(ctx: DataTableContext) {
  const {
    props,
    emit,
    d_first,
    d_rows,
    d_sortField,
    d_sortOrder,
    d_multiSortMeta,
    d_filters,
    engine,
    columnProp,
    clearEditingMetaData,
  } = ctx;

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

  function filter(data: any[]): any[] | undefined {
    if (!data) {
      return;
    }

    // 不在此处调用 clearEditingMetaData()，已在 onFilterApply 中处理
    return engine.filter(data, {
      filters: props.filters || {},
      filterLocale: props.filterLocale,
      globalFilterFields: props.globalFilterFields,
      columns: ctx.columns.value,
      columnProp,
      originalDataLength: props.value?.length,
      createLazyLoadEvent,
      onFilter: event => emit('filter', event),
      onChange: value => emit('change', value),
    });
  }

  function onFilterChange(filters: Record<string, any>) {
    d_filters.value = filters;
  }

  function onFilterApply() {
    // 在事件处理中清空编辑元数据，避免在 computed 中突变状态
    clearEditingMetaData();

    d_first.value = 0;
    emit('update:first', d_first.value);
    emit('update:filters', d_filters.value);

    // lazy 模式下需要 emit('filter') 触发数据加载
    if (props.lazy) {
      emit('filter', createLazyLoadEvent());
    }
  }

  return { filter, createLazyLoadEvent, onFilterChange, onFilterApply };
}
