/// <reference types="vue/jsx" />
import { computed, defineComponent, onMounted, onUpdated, ref } from 'vue';
import { getAttribute, getOuterWidth } from '@xiaoye-ui/utils/dom';
import { getVNodeProp } from '@xiaoye-ui/core/utils';
import { SortAltIcon, SortAmountDownIcon, SortAmountUpAltIcon } from '@xiaoye-ui/icons';
import Badge from 'xiaoye-ui/badge';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import { headerCellProps } from './treeTableTypes';

// SSR 安全：仅在有 document 的环境下执行 DOM 查询
const isClient = typeof window !== 'undefined' && !!window.document;

export default defineComponent({
  name: 'XYHeaderCell',
  inheritAttrs: false,
  props: initDefaultProps(headerCellProps(), {}),
  emits: ['columnClick', 'columnResizestart'],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('tree-table', props);

    const styleObject = ref<Record<string, string>>({});

    function columnProp(prop: string) {
      // 修复：使用 getVNodeProp 正确处理 boolean 类型属性（如 sortable/frozen）
      return getVNodeProp(props.column, prop);
    }

    function isColumnSorted() {
      if (props.sortMode === 'single') {
        return (
          props.sortField &&
          (props.sortField === columnProp('field') || props.sortField === columnProp('sortField'))
        );
      }
      return isMultiSorted();
    }

    expose({ columnProp, isColumnSorted });

    onMounted(() => {
      if (columnProp('frozen')) {
        updateStickyPosition();
      }
    });

    onUpdated(() => {
      if (columnProp('frozen')) {
        updateStickyPosition();
      }
    });

    function updateStickyPosition() {
      if (!isClient) return;
      if (columnProp('frozen')) {
        const align = columnProp('alignFrozen');

        if (align === 'right') {
          let pos = 0;
          let next: HTMLElement | null = null;

          const allThs = document.querySelectorAll('th[data-xy-frozen-column="true"]');
          for (let i = 0; i < allThs.length; i++) {
            const th = allThs[i] as HTMLElement;
            if (th.style.insetInlineEnd) {
              next = th;
              break;
            }
          }

          if (next) {
            pos = getOuterWidth(next) + parseFloat(next.style['inset-inline-end'] || '0');
          }

          styleObject.value = { ...styleObject.value, insetInlineEnd: pos + 'px' };
        } else {
          let pos = 0;
          let prev: HTMLElement | null = null;

          const allThs = document.querySelectorAll('th[data-xy-frozen-column="true"]');
          for (let i = 0; i < allThs.length; i++) {
            const th = allThs[i] as HTMLElement;
            if (th.style.insetInlineStart) {
              prev = th;
            }
          }

          if (prev) {
            pos = getOuterWidth(prev) + parseFloat(prev.style['inset-inline-start'] || '0');
          }

          styleObject.value = { ...styleObject.value, insetInlineStart: pos + 'px' };
        }
      }
    }

    function onClick(event: MouseEvent) {
      emit('columnClick', { originalEvent: event, column: props.column });
    }

    function onKeyDown(event: KeyboardEvent) {
      if (
        (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') &&
        event.currentTarget instanceof HTMLElement &&
        getAttribute(event.currentTarget, 'data-xy-sortable-column')
      ) {
        emit('columnClick', { originalEvent: event, column: props.column });
        event.preventDefault();
      }
    }

    function onResizeStart(event: MouseEvent) {
      emit('columnResizestart', event);
    }

    function getMultiSortMetaIndex() {
      let index = -1;

      for (let i = 0; i < (props.multiSortMeta?.length || 0); i++) {
        const meta = props.multiSortMeta![i];

        if (meta.field === columnProp('field') || meta.field === columnProp('sortField')) {
          index = i;
          break;
        }
      }

      return index;
    }

    function isMultiSorted() {
      return columnProp('sortable') && getMultiSortMetaIndex() > -1;
    }

    const containerClass = computed(() => {
      return [
        columnProp('headerClass'),
        columnProp('class'),
        `${prefixCls.value}-cell`,
        `${prefixCls.value}-cell-header`,
        {
          [`${prefixCls.value}-cell-sortable`]: columnProp('sortable'),
          [`${prefixCls.value}-cell-resizable`]: props.resizableColumns,
          [`${prefixCls.value}-cell-sorted`]: isColumnSorted(),
          [`${prefixCls.value}-cell-frozen`]: columnProp('frozen'),
        },
      ];
    });

    const containerStyle = computed(() => {
      const headerStyle = columnProp('headerStyle');
      const columnStyle = columnProp('style');

      return columnProp('frozen')
        ? [columnStyle, headerStyle, styleObject.value]
        : [columnStyle, headerStyle];
    });

    const sortState = computed(() => {
      let sorted = false;
      let sortOrder: number | null = null;

      if (props.sortMode === 'single') {
        sorted = !!(
          props.sortField &&
          (props.sortField === columnProp('field') || props.sortField === columnProp('sortField'))
        );
        sortOrder = sorted ? props.sortOrder : 0;
      } else if (props.sortMode === 'multiple') {
        const metaIndex = getMultiSortMetaIndex();

        if (metaIndex > -1) {
          sorted = true;
          sortOrder = props.multiSortMeta![metaIndex].order;
        }
      }

      return {
        sorted,
        sortOrder,
      };
    });

    const sortableColumnIcon = computed(() => {
      const { sorted, sortOrder } = sortState.value;

      if (!sorted) return SortAltIcon;
      else if (sorted && sortOrder! > 0) return SortAmountUpAltIcon;
      else if (sorted && sortOrder! < 0) return SortAmountDownIcon;

      return null;
    });

    const ariaSort = computed(() => {
      if (columnProp('sortable')) {
        const { sorted, sortOrder } = sortState.value;

        if (sorted && sortOrder! < 0) return 'descending';
        else if (sorted && sortOrder! > 0) return 'ascending';
        else return 'none';
      } else {
        return null;
      }
    });

    return () => {
      const col = props.column;
      const headerTpl = col?.children?.header;
      const sortIconTpl = col?.children?.sorticon;
      const SortIconComp = sortIconTpl || sortableColumnIcon.value;

      return (
        <th
          class={containerClass.value}
          style={containerStyle.value}
          onClick={onClick}
          onKeydown={onKeyDown}
          tabindex={columnProp('sortable') ? '0' : null}
          aria-sort={ariaSort.value}
          role="columnheader"
          data-xy-sortable-column={columnProp('sortable')}
          data-xy-resizable-column={props.resizableColumns}
          data-xy-sorted={isColumnSorted()}
          data-xy-frozen-column={columnProp('frozen')}
        >
          {props.resizableColumns && !columnProp('frozen') ? (
            <span class={`${prefixCls.value}-column-resizer`} onMousedown={onResizeStart} />
          ) : null}
          <div class={`${prefixCls.value}-column-header-content`}>
            {headerTpl ? <headerTpl column={col} /> : null}
            {columnProp('header') ? (
              <span class={`${prefixCls.value}-column-title`}>{columnProp('header')}</span>
            ) : null}
            {columnProp('sortable') ? (
              <span>
                {SortIconComp ? (
                  <SortIconComp
                    sorted={sortState.value.sorted}
                    sortOrder={sortState.value.sortOrder}
                    class={`${prefixCls.value}-sort-icon`}
                  />
                ) : null}
              </span>
            ) : null}
            {isMultiSorted() ? (
              <Badge
                class={`${prefixCls.value}-sort-badge`}
                count={getMultiSortMetaIndex() + 1}
                size="small"
              />
            ) : null}
          </div>
        </th>
      );
    };
  },
});
