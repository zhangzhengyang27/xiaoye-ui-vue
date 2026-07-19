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
  getAttribute,
  getIndex,
  getNextElementSibling,
  getOuterWidth,
  getPreviousElementSibling,
} from '@xiaoye-ui/utils/dom';
import { SortAltIcon, SortAmountDownIcon, SortAmountUpAltIcon } from '@xiaoye-ui/icons';
import Badge from 'xiaoye-ui/badge';
import ColumnFilter from './ColumnFilter';
import HeaderCheckbox from './HeaderCheckbox';
import { getColumnProp as getDataTableColumnProp } from './utils';

const HeaderCell = defineComponent({
  name: 'XYHeaderCell',
  inheritAttrs: false,
  props: {
    column: { type: null as any, required: true },
    index: { type: [Number, null] as any, default: null },
    resizableColumns: { type: Boolean, default: false },
    groupRowsBy: { type: [Array, String, Function] as any, default: null },
    sortMode: { type: String, default: 'single' },
    groupRowSortField: { type: [String, Function] as any, default: null },
    sortField: { type: [String, Function] as any, default: null },
    sortOrder: { type: Number as PropType<number | null>, default: null },
    multiSortMeta: {
      type: Array as PropType<Array<{ field: string; order: number }> | null>,
      default: null,
    },
    allRowsSelected: { type: Boolean, default: false },
    empty: { type: Boolean, default: false },
    filterDisplay: { type: String as PropType<string | null>, default: null },
    filters: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    filtersStore: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    filterColumn: { type: Boolean, default: false },
    reorderableColumns: { type: Boolean, default: false },
    filterInputProps: { type: null as any, default: null },
    filterButtonProps: { type: null as any, default: null },
  },
  emits: [
    'columnClick',
    'columnMousedown',
    'columnDragstart',
    'columnDragover',
    'columnDragleave',
    'columnDrop',
    'columnResizestart',
    'checkboxChange',
    'filterChange',
    'filterApply',
    'operatorChange',
    'matchmodeChange',
    'constraintAdd',
    'constraintRemove',
    'filterClear',
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

    function onClick(event: MouseEvent): void {
      emit('columnClick', { originalEvent: event, column: props.column });
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (
        (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') &&
        (event.currentTarget as HTMLElement).nodeName === 'TH' &&
        getAttribute(event.currentTarget as HTMLElement, 'data-xy-sortable-column')
      ) {
        emit('columnClick', { originalEvent: event, column: props.column });
        event.preventDefault();
      }
    }

    function onMouseDown(event: MouseEvent): void {
      emit('columnMousedown', { originalEvent: event, column: props.column });
    }

    function onDragStart(event: DragEvent): void {
      emit('columnDragstart', { originalEvent: event, column: props.column });
    }

    function onDragOver(event: DragEvent): void {
      emit('columnDragover', { originalEvent: event, column: props.column });
    }

    function onDragLeave(event: DragEvent): void {
      emit('columnDragleave', { originalEvent: event, column: props.column });
    }

    function onDrop(event: DragEvent): void {
      emit('columnDrop', { originalEvent: event, column: props.column });
    }

    function onResizeStart(event: MouseEvent): void {
      emit('columnResizestart', event);
    }

    function getMultiSortMetaIndex(): number {
      return (
        props.multiSortMeta?.findIndex(
          meta => meta.field === columnProp('field') || meta.field === columnProp('sortField'),
        ) ?? -1
      );
    }

    function getBadgeValue(): number {
      const index = getMultiSortMetaIndex();

      return props.groupRowsBy && props.groupRowsBy === props.groupRowSortField && index > -1
        ? index
        : index + 1;
    }

    function isMultiSorted(): boolean {
      return (
        props.sortMode === 'multiple' && columnProp('sortable') && getMultiSortMetaIndex() > -1
      );
    }

    function isColumnSorted(): boolean {
      return props.sortMode === 'single'
        ? props.sortField &&
            (props.sortField === columnProp('field') || props.sortField === columnProp('sortField'))
        : isMultiSorted();
    }

    function updateStickyPosition(): void {
      if (columnProp('frozen')) {
        const align = columnProp('alignFrozen');
        const el = instance.vnode.el as HTMLElement;

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

        const filterRow = el?.parentElement?.nextElementSibling;

        if (filterRow) {
          const index = getIndex(el);

          if ((filterRow as HTMLElement).children[index]) {
            ((filterRow as HTMLElement).children[index] as HTMLElement).style[
              'inset-inline-start'
            ] = styleObject.value['inset-inline-start'];
            ((filterRow as HTMLElement).children[index] as HTMLElement).style['inset-inline-end'] =
              styleObject.value['inset-inline-end'];
          }
        }
      }
    }

    function onHeaderCheckboxChange(event: any): void {
      emit('checkboxChange', event);
    }

    const containerClass = computed(() => {
      const frozen = columnProp('frozen');
      const alignFrozen = columnProp('alignFrozen');

      return [
        'xy-data-table-cell',
        'xy-data-table-cell--header',
        {
          'xy-data-table-cell--sortable': columnProp('sortable'),
          'xy-data-table-cell--resizable': props.resizableColumns,
          'xy-data-table-cell--sorted': isColumnSorted(),
          'xy-data-table-cell--frozen': frozen,
          'xy-data-table-cell--frozen-left': frozen && alignFrozen !== 'right',
          'xy-data-table-cell--frozen-right': frozen && alignFrozen === 'right',
          'xy-data-table-cell--reorderable': props.reorderableColumns,
        },
        props.filterColumn ? columnProp('filterHeaderClass') : columnProp('headerClass'),
        columnProp('class'),
      ];
    });

    const containerStyle = computed(() => {
      const headerStyle = props.filterColumn
        ? columnProp('filterHeaderStyle')
        : columnProp('headerStyle');
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
      const column = props.column;
      const children = column?.children || {};
      const HeaderSlot = children.header as any;
      const SortIconSlot = (children.sorticon || sortableColumnIcon.value) as any;
      const headerCheckboxIconTemplate = children.headercheckboxicon as any;

      return (
        <th
          style={containerStyle.value}
          class={containerClass.value}
          tabindex={columnProp('sortable') ? '0' : null}
          role="columnheader"
          colspan={columnProp('colspan')}
          rowspan={columnProp('rowspan')}
          aria-sort={ariaSort.value}
          onClick={onClick}
          onKeydown={onKeyDown}
          onMousedown={onMouseDown}
          onDragstart={onDragStart}
          onDragover={onDragOver}
          onDragleave={onDragLeave}
          onDrop={onDrop}
          data-xy-sortable-column={columnProp('sortable')}
          data-xy-resizable-column={props.resizableColumns}
          data-xy-sorted={isColumnSorted()}
          data-xy-filter-column={props.filterColumn}
          data-xy-frozen-column={columnProp('frozen')}
          data-xy-reorderable-column={props.reorderableColumns}
        >
          {props.resizableColumns && !columnProp('frozen') ? (
            <span class="xy-data-table-column-resizer" onMousedown={onResizeStart} />
          ) : null}
          <div class="xy-data-table-column-header-content">
            {HeaderSlot ? <HeaderSlot column={column} /> : null}
            {columnProp('header') ? (
              <span class="xy-data-table-column-title">{columnProp('header')}</span>
            ) : null}
            {columnProp('sortable') ? (
              <span>
                <SortIconSlot
                  sorted={sortState.value.sorted}
                  sortOrder={sortState.value.sortOrder}
                  class="xy-data-table-sort-icon"
                />
              </span>
            ) : null}
            {isMultiSorted() ? (
              <Badge class="xy-data-table-sort-badge" count={getBadgeValue()} size="small" />
            ) : null}
            {columnProp('selectionMode') === 'multiple' &&
            !columnProp('hideSelectAll') &&
            props.filterDisplay !== 'row' ? (
              <HeaderCheckbox
                checked={props.allRowsSelected}
                onChange={onHeaderCheckboxChange}
                disabled={props.empty}
                headerCheckboxIconTemplate={headerCheckboxIconTemplate}
                column={column}
              />
            ) : null}
            {props.filterDisplay === 'menu' && children.filter ? (
              <ColumnFilter
                field={columnProp('filterField') || columnProp('field')}
                type={columnProp('dataType')}
                display="menu"
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
                column={column}
              />
            ) : null}
          </div>
        </th>
      );
    };
  },
});

export default HeaderCell;
