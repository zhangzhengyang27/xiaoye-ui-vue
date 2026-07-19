/// <reference types="vue/jsx" />
import { defineComponent, inject, onBeforeUnmount, type PropType } from 'vue';
import { HelperSet } from '@xiaoye-ui/core/utils';
import { useProvide } from '@xiaoye-ui/core/composables';
import FilterHeaderCell from './FilterHeaderCell';
import HeaderCell from './HeaderCell';
import { getColumnProp as getDataTableColumnProp } from './utils';

const TableHeader = defineComponent({
  name: 'XYTableHeader',
  inheritAttrs: false,
  props: {
    columnGroup: { type: null as any, default: null },
    columns: { type: null as any, default: null },
    rowGroupMode: { type: String as PropType<string | null>, default: null },
    groupRowsBy: { type: null as any, default: null },
    resizableColumns: { type: Boolean, default: false },
    allRowsSelected: { type: Boolean, default: false },
    empty: { type: Boolean, default: false },
    sortMode: { type: String, default: 'single' },
    groupRowSortField: { type: null as any, default: null },
    sortField: { type: null as any, default: null },
    sortOrder: { type: [Number, null] as any, default: null },
    multiSortMeta: { type: Array as PropType<any[] | null>, default: null },
    filterDisplay: { type: String as PropType<string | null>, default: null },
    filters: { type: Object as PropType<Record<string, any> | null>, default: null },
    filtersStore: { type: Object as PropType<Record<string, any> | null>, default: null },
    reorderableColumns: { type: Boolean, default: false },
    first: { type: Number, default: 0 },
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
    const $parentInstance = inject<any>('$parentInstance', null);

    const d_headerRows = new HelperSet({ type: 'XYRow' });
    const d_headerColumns = new HelperSet({ type: 'XYColumn' });

    useProvide('$rows', d_headerRows);
    useProvide('$columns', d_headerColumns);

    onBeforeUnmount(() => {
      d_headerRows.clear();
      d_headerColumns.clear();
    });

    function columnProp(col: any, prop: string) {
      return getDataTableColumnProp(col, prop);
    }

    function getHeaderRows() {
      return d_headerRows?.get(props.columnGroup, props.columnGroup?.children);
    }

    function getHeaderColumns(row: any) {
      return d_headerColumns?.get(row, row?.children);
    }

    // Shared props for HeaderCell
    const headerCellSharedProps = () => ({
      groupRowsBy: props.groupRowsBy,
      groupRowSortField: props.groupRowSortField,
      sortMode: props.sortMode,
      sortField: props.sortField,
      sortOrder: props.sortOrder,
      multiSortMeta: props.multiSortMeta,
      allRowsSelected: props.allRowsSelected,
      empty: props.empty,
      filters: props.filters,
      filterDisplay: props.filterDisplay,
      filtersStore: props.filtersStore,
      filterInputProps: props.filterInputProps,
      filterButtonProps: props.filterButtonProps,
    });

    // Shared event handlers for HeaderCell
    const headerCellSharedHandlers = () => ({
      onColumnClick: (e: any) => emit('columnClick', e),
      onColumnMousedown: (e: any) => emit('columnMousedown', e),
      onCheckboxChange: (e: any) => emit('checkboxChange', e),
      onFilterChange: (e: any) => emit('filterChange', e),
      onFilterApply: () => emit('filterApply'),
      onOperatorChange: (e: any) => emit('operatorChange', e),
      onMatchmodeChange: (e: any) => emit('matchmodeChange', e),
      onConstraintAdd: (e: any) => emit('constraintAdd', e),
      onConstraintRemove: (e: any) => emit('constraintRemove', e),
      onApplyClick: (e: any) => emit('applyClick', e),
    });

    const filterHeaderCellHandlers = () => ({
      onFilterChange: (e: any) => emit('filterChange', e),
      onFilterApply: () => emit('filterApply'),
      onOperatorChange: (e: any) => emit('operatorChange', e),
      onMatchmodeChange: (e: any) => emit('matchmodeChange', e),
      onConstraintAdd: (e: any) => emit('constraintAdd', e),
      onConstraintRemove: (e: any) => emit('constraintRemove', e),
      onApplyClick: (e: any) => emit('applyClick', e),
      onCheckboxChange: (e: any) => emit('checkboxChange', e),
    });

    return () => {
      return (
        <thead
          class="xy-data-table-head"
          role="rowgroup"
          data-xy-scrollable={$parentInstance?.$parentInstance?.scrollable}
        >
          {!props.columnGroup ? (
            <tr role="row">
              {props.columns?.map((col: any, i: number) => {
                if (
                  columnProp(col, 'hidden') ||
                  (props.rowGroupMode === 'subheader' &&
                    props.groupRowsBy === columnProp(col, 'field'))
                ) {
                  return null;
                }
                const key = columnProp(col, 'columnKey') || columnProp(col, 'field') || i;
                return (
                  <HeaderCell
                    key={key}
                    column={col}
                    index={i}
                    {...headerCellSharedProps()}
                    reorderableColumns={props.reorderableColumns}
                    resizableColumns={props.resizableColumns}
                    onColumnDragstart={(e: any) => emit('columnDragstart', e)}
                    onColumnDragover={(e: any) => emit('columnDragover', e)}
                    onColumnDragleave={(e: any) => emit('columnDragleave', e)}
                    onColumnDrop={(e: any) => emit('columnDrop', e)}
                    onColumnResizestart={(e: any) => emit('columnResizestart', e)}
                    {...headerCellSharedHandlers()}
                  />
                );
              })}
            </tr>
          ) : (
            getHeaderRows()?.map((row: any, i: number) => (
              <tr key={i} role="row">
                {getHeaderColumns(row)?.map((col: any, j: number) => {
                  if (
                    columnProp(col, 'hidden') ||
                    (props.rowGroupMode === 'subheader' &&
                      props.groupRowsBy === columnProp(col, 'field')) ||
                    typeof col.children === 'string'
                  ) {
                    return null;
                  }
                  const key = columnProp(col, 'columnKey') || columnProp(col, 'field') || j;
                  return (
                    <HeaderCell
                      key={key}
                      column={col}
                      {...headerCellSharedProps()}
                      onColumnClick={(e: any) => emit('columnClick', e)}
                      onColumnMousedown={(e: any) => emit('columnMousedown', e)}
                      {...headerCellSharedHandlers()}
                    />
                  );
                })}
              </tr>
            ))
          )}
          {props.filterDisplay === 'row' ? (
            <tr role="row">
              {props.columns?.map((col: any, i: number) => {
                if (
                  columnProp(col, 'hidden') ||
                  (props.rowGroupMode === 'subheader' &&
                    props.groupRowsBy === columnProp(col, 'field'))
                ) {
                  return null;
                }
                const key = columnProp(col, 'columnKey') || columnProp(col, 'field') || i;
                return (
                  <FilterHeaderCell
                    key={key}
                    column={col}
                    index={i}
                    allRowsSelected={props.allRowsSelected}
                    empty={props.empty}
                    display="row"
                    filters={props.filters}
                    filtersStore={props.filtersStore}
                    filterInputProps={props.filterInputProps}
                    filterButtonProps={props.filterButtonProps}
                    {...filterHeaderCellHandlers()}
                  />
                );
              })}
            </tr>
          ) : null}
        </thead>
      );
    };
  },
});

export default TableHeader;
