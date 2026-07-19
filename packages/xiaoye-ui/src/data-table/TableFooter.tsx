/// <reference types="vue/jsx" />
import { computed, defineComponent, inject, onBeforeUnmount } from 'vue';
import { HelperSet } from '@xiaoye-ui/core/utils';
import { useProvide } from '@xiaoye-ui/core/composables';
import FooterCell from './FooterCell';
import { getColumnProp as getDataTableColumnProp } from './utils';

const TableFooter = defineComponent({
  name: 'XYTableFooter',
  inheritAttrs: false,
  props: {
    columnGroup: { type: null as any, default: null },
    columns: { type: null as any, default: null },
  },
  setup(props) {
    const $parentInstance = inject<any>('$parentInstance', null);

    const d_footerRows = new HelperSet({ type: 'XYRow' });
    const d_footerColumns = new HelperSet({ type: 'XYColumn' });

    useProvide('$rows', d_footerRows);
    useProvide('$columns', d_footerColumns);

    onBeforeUnmount(() => {
      d_footerRows.clear();
      d_footerColumns.clear();
    });

    function columnProp(col: any, prop: string) {
      return getDataTableColumnProp(col, prop);
    }

    function getFooterRows() {
      return d_footerRows?.get(props.columnGroup, props.columnGroup?.children);
    }

    function getFooterColumns(row: any) {
      return d_footerColumns?.get(row, row?.children);
    }

    const hasFooter = computed(() => {
      let hasFooter = false;

      if (props.columnGroup) {
        hasFooter = true;
      } else if (props.columns) {
        for (const col of props.columns) {
          if (columnProp(col, 'footer') || (col.children && col.children.footer)) {
            hasFooter = true;
            break;
          }
        }
      }

      return hasFooter;
    });

    return () => {
      if (!hasFooter.value) return null;

      return (
        <tfoot
          class="xy-data-table-foot"
          role="rowgroup"
          data-xy-scrollable={$parentInstance?.$parentInstance?.scrollable}
        >
          {!props.columnGroup ? (
            <tr role="row">
              {props.columns?.map((col: any, i: number) => {
                if (columnProp(col, 'hidden')) return null;
                const key = columnProp(col, 'columnKey') || columnProp(col, 'field') || i;
                return <FooterCell key={key} column={col} />;
              })}
            </tr>
          ) : (
            getFooterRows()?.map((row: any, i: number) => (
              <tr key={i} role="row">
                {getFooterColumns(row)?.map((col: any, j: number) => {
                  if (columnProp(col, 'hidden') || typeof col.children === 'string') return null;
                  const key = columnProp(col, 'columnKey') || columnProp(col, 'field') || j;
                  return <FooterCell key={key} column={col} index={i} />;
                })}
              </tr>
            ))
          )}
        </tfoot>
      );
    };
  },
});

export default TableFooter;
