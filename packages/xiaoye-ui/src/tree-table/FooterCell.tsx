/// <reference types="vue/jsx" />
import { computed, defineComponent, onMounted, onUpdated, ref } from 'vue';
import { getOuterWidth } from '@xiaoye-ui/utils/dom';
import { getVNodeProp } from '@xiaoye-ui/core/utils';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import { footerCellProps } from './treeTableTypes';

// SSR 安全：仅在有 document 的环境下执行 DOM 查询
const isClient = typeof window !== 'undefined' && !!window.document;

export default defineComponent({
  name: 'XYFooterCell',
  inheritAttrs: false,
  props: initDefaultProps(footerCellProps(), {}),
  setup(props, { expose }) {
    const { prefixCls } = useConfigInject('tree-table', props);

    const styleObject = ref<Record<string, string>>({});

    function columnProp(prop: string) {
      // 修复：使用 getVNodeProp 正确处理 boolean 类型属性（如 frozen）
      return getVNodeProp(props.column, prop);
    }

    expose({ columnProp });

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

          const allTds = document.querySelectorAll('td[data-xy-frozen-column="true"]');
          for (let i = 0; i < allTds.length; i++) {
            const td = allTds[i] as HTMLElement;
            if (td.style.insetInlineEnd) {
              next = td;
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

          const allTds = document.querySelectorAll('td[data-xy-frozen-column="true"]');
          for (let i = 0; i < allTds.length; i++) {
            const td = allTds[i] as HTMLElement;
            if (td.style.insetInlineStart) {
              prev = td;
            }
          }

          if (prev) {
            pos = getOuterWidth(prev) + parseFloat(prev.style['inset-inline-start'] || '0');
          }

          styleObject.value = { ...styleObject.value, insetInlineStart: pos + 'px' };
        }
      }
    }

    const containerClass = computed(() => {
      return [
        columnProp('footerClass'),
        columnProp('class'),
        `${prefixCls.value}-cell`,
        {
          [`${prefixCls.value}-cell-frozen`]: columnProp('frozen'),
        },
      ];
    });

    const containerStyle = computed(() => {
      const bodyStyle = columnProp('footerStyle');
      const columnStyle = columnProp('style');

      return columnProp('frozen')
        ? [columnStyle, bodyStyle, styleObject.value]
        : [columnStyle, bodyStyle];
    });

    return () => {
      const col = props.column;
      const footerTpl = col?.children?.footer;

      return (
        <td
          style={containerStyle.value}
          class={containerClass.value}
          role="cell"
          data-xy-frozen-column={columnProp('frozen')}
        >
          {footerTpl ? <footerTpl column={col} /> : null}
          {columnProp('footer') ? (
            <span class={`${prefixCls.value}-column-footer`}>{columnProp('footer')}</span>
          ) : null}
        </td>
      );
    };
  },
});
