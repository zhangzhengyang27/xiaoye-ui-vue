/// <reference types="vue/jsx" />
import { computed, defineComponent, ref, watch } from 'vue';
import { localeComparator, resolveFieldData, sort } from '@xiaoye-ui/utils/object';
import Pagination from '../pagination';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import dataViewProps from './dataViewTypes';
import { initDefaultProps } from '../_util/props-util';
import type { CustomSlotsType } from '../_util/type';

export default defineComponent({
  name: 'XYDataView',
  inheritAttrs: false,
  __XY_DATA_VIEW: true,
  props: initDefaultProps(dataViewProps(), {}),
  slots: Object as CustomSlotsType<{
    header?: any;
    footer?: any;
    empty?: (scope: { layout?: string }) => any;
    list?: (scope: { items: any }) => any;
    grid?: (scope: { items: any }) => any;
  }>,
  emits: ['update:first', 'update:rows', 'page'],
  setup(props, { slots, emit, expose }) {
    const { prefixCls } = useConfigInject('dataview', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const d_first = ref(props.first);
    const d_rows = ref(props.rows);

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
      () => {
        resetPage();
      },
    );
    watch(
      () => props.sortOrder,
      () => {
        resetPage();
      },
    );

    function getKey(item: any, index: number) {
      return props.dataKey ? resolveFieldData(item, props.dataKey) : index;
    }

    function onPage(page: number, pageSize: number) {
      d_first.value = (page - 1) * pageSize;
      d_rows.value = pageSize;
      emit('update:first', d_first.value);
      emit('update:rows', d_rows.value);
      emit('page', {
        page,
        first: d_first.value,
        rows: pageSize,
        pageCount: Math.ceil(getTotalRecords.value / pageSize),
      });
    }

    function sortData() {
      if (props.value) {
        const value = [...props.value];
        const comparer = localeComparator();
        value.sort((data1, data2) => {
          const value1 = resolveFieldData(data1, props.sortField);
          const value2 = resolveFieldData(data2, props.sortField);
          return sort(value1, value2, props.sortOrder as number, comparer);
        });
        return value;
      }
      return null;
    }

    function resetPage() {
      d_first.value = 0;
      emit('update:first', d_first.value);
    }

    const getTotalRecords = computed(() => {
      if (props.totalRecords) return props.totalRecords;
      return props.value ? props.value.length : 0;
    });

    const empty = computed(() => {
      return !props.value || props.value.length === 0;
    });

    const paginationTop = computed(() => {
      return props.pagination && props.paginationPosition !== 'bottom';
    });

    const paginationBottom = computed(() => {
      return props.pagination && props.paginationPosition !== 'top';
    });

    const currentPage = computed(() => {
      return d_rows.value > 0 ? Math.floor(d_first.value / d_rows.value) + 1 : 1;
    });

    const items = computed(() => {
      if (props.value && props.value.length) {
        let data = props.value;
        if (data && data.length && props.sortField) {
          data = sortData()!;
        }
        if (props.pagination) {
          const first = props.lazy ? 0 : d_first.value;
          return data.slice(first, first + d_rows.value);
        }
        return data;
      }
      return null;
    });

    const rootClasses = computed(() => [
      `${prefixCls.value}`,
      hashId.value,
      {
        [`${prefixCls.value}-list`]: props.layout === 'list',
        [`${prefixCls.value}-grid`]: props.layout === 'grid',
      },
    ]);

    expose({
      d_first,
      d_rows,
      items,
      empty,
      getTotalRecords,
      paginationTop,
      paginationBottom,
      getKey,
      onPage,
      sortData,
      resetPage,
    });

    const renderPagination = (position: 'top' | 'bottom') => (
      <Pagination
        total={getTotalRecords.value}
        current={currentPage.value}
        pageSize={d_rows.value}
        pageSizeOptions={props.rowsPerPageOptions}
        showSizeChanger={!!(props.rowsPerPageOptions && props.rowsPerPageOptions.length > 0)}
        hideOnSinglePage={!props.alwaysShowPagination}
        class={`${prefixCls.value}-pagination ${prefixCls.value}-pagination-${position}`}
        onChange={onPage}
        onShowSizeChange={onPage}
      />
    );

    return () =>
      wrapSSR(
        <div class={rootClasses.value}>
          {slots.header ? <div class={`${prefixCls.value}-header`}>{slots.header()}</div> : null}
          {paginationTop.value ? renderPagination('top') : null}
          <div class={`${prefixCls.value}-content`}>
            {!empty.value ? (
              <>
                {slots.list && props.layout === 'list' ? slots.list({ items: items.value }) : null}
                {slots.grid && props.layout === 'grid' ? slots.grid({ items: items.value }) : null}
              </>
            ) : (
              <div class={`${prefixCls.value}-empty-message`}>
                {slots.empty ? slots.empty({ layout: props.layout }) : ''}
              </div>
            )}
          </div>
          {paginationBottom.value ? renderPagination('bottom') : null}
          {slots.footer ? <div class={`${prefixCls.value}-footer`}>{slots.footer()}</div> : null}
        </div>,
      );
  },
});
