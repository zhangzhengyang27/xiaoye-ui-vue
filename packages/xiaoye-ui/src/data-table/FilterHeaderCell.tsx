/// <reference types="vue/jsx" />
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUpdated,
  ref,
  type PropType,
} from 'vue';
import {
  getNextElementSibling,
  getOuterWidth,
  getPreviousElementSibling,
} from '@xiaoye-ui/utils/dom';
import ColumnFilter from './ColumnFilter';
import HeaderCheckbox from './HeaderCheckbox';
import { getColumnProp as getDataTableColumnProp } from './utils';

const FilterHeaderCell = defineComponent({
  name: 'XYFilterHeaderCell',
  inheritAttrs: false,
  props: {
    column: { type: null as any, default: undefined },
    index: { type: [Number, null] as any, default: null },
    allRowsSelected: { type: Boolean, default: false },
    empty: { type: Boolean, default: false },
    display: { type: String as PropType<string>, default: 'row' },
    filters: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    filtersStore: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    rowGroupMode: { type: [String, null] as any, default: null },
    groupRowsBy: { type: [Array, String, Function, null] as any, default: null },
    filterInputProps: { type: null as any, default: null },
    filterButtonProps: { type: null as any, default: null },
  },
  emits: [
    'checkboxChange',
    'filterChange',
    'filterApply',
    'operatorChange',
    'matchmodeChange',
    'constraintAdd',
    'constraintRemove',
    'applyClick',
  ],
  setup(props, { emit }) {
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

    const getFilterColumnHeaderClass = computed(() => {
      return [
        'xy-data-table-cell',
        'xy-data-table-cell--header',
        columnProp('filterHeaderClass'),
        columnProp('class'),
        { 'xy-data-table-cell--frozen': columnProp('frozen') },
      ];
    });

    const getFilterColumnHeaderStyle = computed(() => {
      return columnProp('frozen')
        ? [columnProp('filterHeaderStyle'), columnProp('style'), styleObject.value]
        : [columnProp('filterHeaderStyle'), columnProp('style')];
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
      if (
        columnProp('hidden') ||
        (props.rowGroupMode === 'subheader' && props.groupRowsBy === columnProp('field'))
      ) {
        return null;
      }

      const col = props.column;
      const children = col?.children;
      const hasFilter = children && children.filter;

      return (
        <th
          style={getFilterColumnHeaderStyle.value}
          class={getFilterColumnHeaderClass.value}
          data-xy-frozen-column={columnProp('frozen')}
        >
          {columnProp('selectionMode') === 'multiple' ? (
            <HeaderCheckbox
              checked={props.allRowsSelected}
              disabled={props.empty}
              onChange={(e: any) => emit('checkboxChange', e)}
              column={props.column}
            />
          ) : null}
          {hasFilter ? (
            <ColumnFilter
              field={columnProp('filterField') || columnProp('field')}
              type={columnProp('dataType')}
              display="row"
              showMenu={columnProp('showFilterMenu')}
              filterElement={children.filter}
              filterHeaderTemplate={children.filterheader}
              filterFooterTemplate={children.filterfooter}
              filterClearTemplate={children.filterclear}
              filterApplyTemplate={children.filterapply}
              filterIconTemplate={children.filtericon}
              filterAddIconTemplate={children.filteraddicon}
              filterRemoveIconTemplate={children.filterremoveicon}
              filterClearIconTemplate={children.filterclearicon}
              filters={props.filters}
              filtersStore={props.filtersStore}
              filterInputProps={props.filterInputProps}
              filterButtonProps={props.filterButtonProps}
              onFilterChange={(e: any) => emit('filterChange', e)}
              onFilterApply={() => emit('filterApply')}
              filterMenuStyle={columnProp('filterMenuStyle')}
              filterMenuClass={columnProp('filterMenuClass')}
              showOperator={columnProp('showFilterOperator')}
              showClearButton={columnProp('showClearButton')}
              showApplyButton={columnProp('showApplyButton')}
              showMatchModes={columnProp('showFilterMatchModes')}
              showAddButton={columnProp('showAddButton')}
              matchModeOptions={columnProp('filterMatchModeOptions')}
              maxConstraints={columnProp('maxConstraints')}
              onOperatorChange={(e: any) => emit('operatorChange', e)}
              onMatchmodeChange={(e: any) => emit('matchmodeChange', e)}
              onConstraintAdd={(e: any) => emit('constraintAdd', e)}
              onConstraintRemove={(e: any) => emit('constraintRemove', e)}
              onApplyClick={(e: any) => emit('applyClick', e)}
              column={props.column}
            />
          ) : null}
        </th>
      );
    };
  },
});

export default FilterHeaderCell;
