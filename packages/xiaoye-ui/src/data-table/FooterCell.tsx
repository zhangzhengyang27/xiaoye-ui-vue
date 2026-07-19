/// <reference types="vue/jsx" />
import { computed, defineComponent, getCurrentInstance, onMounted, onUpdated, ref } from 'vue';
import {
  getNextElementSibling,
  getOuterWidth,
  getPreviousElementSibling,
} from '@xiaoye-ui/utils/dom';
import { getColumnProp as getDataTableColumnProp } from './utils';

const FooterCell = defineComponent({
  name: 'XYFooterCell',
  inheritAttrs: false,
  props: {
    column: { type: null as any, default: undefined },
    index: { type: [Number, null] as any, default: null },
  },
  setup(props) {
    const instance = getCurrentInstance()!;
    const styleObject = ref<Record<string, string>>({});

    function columnProp(propOrCol: any, prop?: string): any {
      if (prop === undefined) {
        return getDataTableColumnProp(props.column, propOrCol);
      } else {
        return getDataTableColumnProp(propOrCol, prop);
      }
    }

    function updateStickyPosition(): void {
      const el = instance.vnode.el as HTMLElement;
      if (columnProp('frozen')) {
        const align = columnProp('alignFrozen');

        if (align === 'right') {
          let pos = 0;
          const next = getNextElementSibling(el, '[data-xy-frozen-column="true"]');

          if (next) {
            pos =
              getOuterWidth(next) +
              parseFloat((next as HTMLElement).style['inset-inline-end'] || '0');
          }

          styleObject.value.insetInlineEnd = pos + 'px';
        } else {
          let pos = 0;
          const prev = getPreviousElementSibling(el, '[data-xy-frozen-column="true"]');

          if (prev) {
            pos =
              getOuterWidth(prev) +
              parseFloat((prev as HTMLElement).style['inset-inline-start'] || '0');
          }

          styleObject.value.insetInlineStart = pos + 'px';
        }
      }
    }

    const containerClass = computed(() => {
      return [
        'xy-data-table-cell',
        'xy-data-table-cell--footer',
        columnProp('footerClass'),
        columnProp('class'),
        { 'xy-data-table-cell--frozen': columnProp('frozen') },
      ];
    });

    const containerStyle = computed(() => {
      const bodyStyle = columnProp('footerStyle');
      const columnStyle = columnProp('style');

      return columnProp('frozen')
        ? [columnStyle, bodyStyle, styleObject.value]
        : [columnStyle, bodyStyle];
    });

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

    return () => {
      const footerSlot = props.column?.children?.footer;

      return (
        <td
          style={containerStyle.value}
          class={containerClass.value}
          role="cell"
          colspan={columnProp('colspan')}
          rowspan={columnProp('rowspan')}
          data-xy-frozen-column={columnProp('frozen')}
        >
          {footerSlot
            ? (() => {
                const Comp = footerSlot;
                return <Comp column={props.column} />;
              })()
            : null}
          {columnProp('footer') ? (
            <span class="xy-data-table-column-footer">{columnProp('footer')}</span>
          ) : null}
        </td>
      );
    };
  },
});

export default FooterCell;
