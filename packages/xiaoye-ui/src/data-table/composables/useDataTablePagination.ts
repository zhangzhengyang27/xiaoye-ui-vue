import { isNotEmpty } from '@xiaoye-ui/utils/object';
import { nextTick } from 'vue';
import type { DataTableContext } from './types';

export function useDataTablePagination(ctx: DataTableContext) {
  const { props, emit, d_first, d_rows, processedData, createLazyLoadEvent, clearEditingMetaData } =
    ctx;

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
      emit('change', processedData.value);
    });
  }

  function resetPage() {
    d_first.value = 0;
    emit('update:first', d_first.value);
  }

  function dataToRender(data?: any[]): any[] {
    const _data = data || processedData.value;

    if (_data && props.pagination) {
      const first = props.lazy ? 0 : d_first.value;

      return _data.slice(first, first + d_rows.value);
    }

    return _data;
  }

  function hasSpacerStyle(style: any): boolean {
    return isNotEmpty(style);
  }

  return { onPage, resetPage, dataToRender, hasSpacerStyle };
}
