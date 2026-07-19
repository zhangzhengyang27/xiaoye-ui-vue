/// <reference types="vue/jsx" />
import { ChevronDownIcon, ChevronRightIcon } from '@xiaoye-ui/icons';
import { equals, resolveFieldData } from '@xiaoye-ui/utils/object';
import { computed, defineComponent, inject, ref, watch, type PropType } from 'vue';
import BodyCell from './BodyCell';
import { getColumnProp as getDataTableColumnProp } from './utils';

const BodyRow = defineComponent({
  name: 'XYBodyRow',
  inheritAttrs: false,
  props: {
    rowData: { type: Object as PropType<Record<string, any> | null>, default: null },
    index: { type: Number, default: 0 },
    value: { type: Array as PropType<Array<any> | null>, default: null },
    columns: { type: null as any, default: null },
    frozenRow: { type: Boolean, default: false },
    empty: { type: Boolean, default: false },
    rowGroupMode: { type: String as PropType<string | null>, default: null },
    groupRowsBy: { type: [Array, String, Function] as any, default: null },
    expandableRowGroups: { type: Boolean, default: false },
    expandedRowGroups: { type: Array as PropType<Array<any> | null>, default: null },
    first: { type: Number, default: 0 },
    dataKey: { type: [String, Function] as any, default: null },
    expandedRowIcon: { type: String as PropType<string | null>, default: null },
    collapsedRowIcon: { type: String as PropType<string | null>, default: null },
    expandedRows: { type: [Array, Object] as any, default: null },
    selection: { type: [Array, Object] as any, default: null },
    selectionKeys: { type: null as any, default: null },
    selectionMode: { type: String as PropType<string | null>, default: null },
    contextMenu: { type: Boolean, default: false },
    contextMenuSelection: { type: Object as PropType<Record<string, any> | null>, default: null },
    rowClass: { type: Function as PropType<Function | null>, default: null },
    rowStyle: { type: Function as PropType<Function | null>, default: null },
    rowGroupHeaderStyle: { type: Object as PropType<Record<string, any> | null>, default: null },
    editMode: { type: String as PropType<string | null>, default: null },
    compareSelectionBy: { type: String, default: 'deepEquals' },
    editingRows: { type: Array as PropType<Array<any> | null>, default: null },
    editingRowKeys: { type: null as any, default: null },
    editingMeta: {
      type: Object as PropType<Record<number, { data: Record<string, any> }> | null>,
      default: null,
    },
    templates: { type: Object as PropType<Record<string, any> | null>, default: null },
    scrollable: { type: Boolean, default: false },
    editButtonProps: { type: Object as PropType<Record<string, any> | null>, default: null },
    virtualScrollerContentProps: {
      type: Object as PropType<Record<string, any> | null>,
      default: null,
    },
    isVirtualScrollerDisabled: { type: Boolean, default: false },
    expandedRowId: { type: String as PropType<string | null>, default: null },
    nameAttributeSelector: { type: String as PropType<string | null>, default: null },
    selectionDisabled: {
      type: Function as PropType<((data: any) => boolean) | null>,
      default: null,
    },
    rowExpandable: { type: Function as PropType<((data: any) => boolean) | null>, default: null },
  },
  emits: [
    'rowgroupToggle',
    'rowClick',
    'rowDblclick',
    'rowRightclick',
    'rowTouchend',
    'rowKeydown',
    'rowMousedown',
    'rowDragstart',
    'rowDragover',
    'rowDragleave',
    'rowDragend',
    'rowDrop',
    'rowToggle',
    'radioChange',
    'checkboxChange',
    'cellEditInit',
    'cellEditComplete',
    'cellEditCancel',
    'rowEditInit',
    'rowEditSave',
    'rowEditCancel',
    'editingMetaChange',
  ],
  setup(props, { emit }) {
    const $parentInstance = inject<any>('$parentInstance', null);
    const dataTableInstance = computed(() => $parentInstance?.$parentInstance ?? $parentInstance);

    const d_rowExpanded = ref(false);

    watch(
      () => props.expandedRows,
      newValue => {
        d_rowExpanded.value = props.dataKey
          ? newValue?.[resolveFieldData(props.rowData, props.dataKey)] !== undefined
          : newValue?.some((d: any) => equalsData(props.rowData, d));
      },
      { immediate: true },
    );

    watch(
      () => props.rowData,
      newValue => {
        d_rowExpanded.value = props.dataKey
          ? props.expandedRows?.[resolveFieldData(newValue, props.dataKey)] !== undefined
          : props.expandedRows?.some((d: any) => equalsData(newValue, d));
      },
    );

    function columnProp(col: any, prop: string): any {
      return getDataTableColumnProp(col, prop);
    }

    function shouldRenderBodyCell(column: any): boolean {
      const isHidden = columnProp(column, 'hidden');

      if (props.rowGroupMode && !isHidden) {
        const field = columnProp(column, 'field');

        if (props.rowGroupMode === 'subheader') {
          return props.groupRowsBy !== field;
        } else if (props.rowGroupMode === 'rowspan') {
          if (isGrouped(column)) {
            const prevRowData = props.value?.[rowIndex.value - 1];

            if (prevRowData) {
              const currentRowFieldData = resolveFieldData(props.value![rowIndex.value], field);
              const previousRowFieldData = resolveFieldData(prevRowData, field);

              return currentRowFieldData !== previousRowFieldData;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      } else {
        return !isHidden;
      }
      return false;
    }

    function calculateRowGroupSize(column: any): number | null {
      if (isGrouped(column)) {
        let index = rowIndex.value;
        const field = columnProp(column, 'field');
        const currentRowFieldData = resolveFieldData(props.value![index], field);
        let nextRowFieldData = currentRowFieldData;
        let groupRowSpan = 0;

        if (d_rowExpanded.value) groupRowSpan++;

        while (currentRowFieldData === nextRowFieldData) {
          groupRowSpan++;
          const nextRowData = props.value![++index];

          if (nextRowData) {
            nextRowFieldData = resolveFieldData(nextRowData, field);
          } else {
            break;
          }
        }

        return groupRowSpan === 1 ? null : groupRowSpan;
      } else {
        return null;
      }
    }

    function isGrouped(column: any): boolean {
      const field = columnProp(column, 'field');

      if (props.groupRowsBy && field) {
        if (Array.isArray(props.groupRowsBy)) return props.groupRowsBy.indexOf(field) > -1;
        else return props.groupRowsBy === field;
      } else {
        return false;
      }
    }

    function findIndexInSelection(data: any): number {
      return findIndex(data, props.selection);
    }

    function findIndex(data: any, collection: any[] | null): number {
      let index = -1;

      if (collection && collection.length) {
        for (let i = 0; i < collection.length; i++) {
          if (equalsData(data, collection[i])) {
            index = i;
            break;
          }
        }
      }

      return index;
    }

    function equalsData(data1: any, data2: any): boolean {
      return props.compareSelectionBy === 'equals'
        ? data1 === data2
        : equals(data1, data2, props.dataKey);
    }

    function onRowGroupToggle(event: Event): void {
      emit('rowgroupToggle', { originalEvent: event, data: props.rowData });
    }

    function onRowClick(event: MouseEvent): void {
      emit('rowClick', { originalEvent: event, data: props.rowData, index: rowIndex.value });
    }

    function onRowDblClick(event: MouseEvent): void {
      emit('rowDblclick', { originalEvent: event, data: props.rowData, index: rowIndex.value });
    }

    function onRowRightClick(event: MouseEvent): void {
      emit('rowRightclick', { originalEvent: event, data: props.rowData, index: rowIndex.value });
    }

    function onRowTouchEnd(event: Event): void {
      emit('rowTouchend', event);
    }

    function onRowKeyDown(event: KeyboardEvent): void {
      if (event.target !== event.currentTarget) return;
      emit('rowKeydown', { originalEvent: event, data: props.rowData, index: rowIndex.value });
    }

    function onRowMouseDown(event: MouseEvent): void {
      emit('rowMousedown', event);
    }

    function onRowDragStart(event: DragEvent): void {
      emit('rowDragstart', { originalEvent: event, index: rowIndex.value });
    }

    function onRowDragOver(event: DragEvent): void {
      emit('rowDragover', { originalEvent: event, index: rowIndex.value });
    }

    function onRowDragLeave(event: DragEvent): void {
      emit('rowDragleave', event);
    }

    function onRowDragEnd(event: DragEvent): void {
      emit('rowDragend', event);
    }

    function onRowDrop(event: DragEvent): void {
      emit('rowDrop', event);
    }

    function onRowToggle(event: any): void {
      d_rowExpanded.value = !d_rowExpanded.value;

      emit('rowToggle', { ...event, expanded: d_rowExpanded.value });
    }

    function onRadioChange(event: any): void {
      emit('radioChange', event);
    }

    function onCheckboxChange(event: any): void {
      emit('checkboxChange', event);
    }

    function onCellEditInit(event: any): void {
      emit('cellEditInit', event);
    }

    function onCellEditComplete(event: any): void {
      emit('cellEditComplete', event);
    }

    function onCellEditCancel(event: any): void {
      emit('cellEditCancel', event);
    }

    function onRowEditInit(event: any): void {
      emit('rowEditInit', event);
    }

    function onRowEditSave(event: any): void {
      emit('rowEditSave', event);
    }

    function onRowEditCancel(event: any): void {
      emit('rowEditCancel', event);
    }

    function onEditingMetaChange(event: any): void {
      emit('editingMetaChange', event);
    }

    function getVirtualScrollerProp(option: string, options?: Record<string, any> | null): any {
      options = options || props.virtualScrollerContentProps;

      return options ? options[option] : null;
    }

    const rowIndex = computed(() => {
      const getItemOptions = getVirtualScrollerProp('getItemOptions');

      return getItemOptions ? getItemOptions(props.index).index : props.index;
    });

    const rowStyles = computed(() => {
      return props.rowStyle?.(props.rowData, rowIndex.value);
    });

    const rowClasses = computed(() => {
      const rowStyleClass: any[] = [];

      if (props.rowClass) {
        const rowClassValue = props.rowClass(props.rowData, rowIndex.value);

        if (rowClassValue) {
          rowStyleClass.push(rowClassValue);
        }
      }

      return [
        'xy-data-table-row',
        {
          'xy-data-table-row--selected': isSelected.value,
          'xy-data-table-row--selectable':
            dataTableInstance.value?.rowHover || dataTableInstance.value?.selectionMode,
          'xy-data-table-row--odd': rowIndex.value % 2 !== 0,
          'xy-data-table-row--selected-contextmenu':
            props.contextMenuSelection && isSelectedWithContextMenu.value,
        },
        rowStyleClass,
      ];
    });

    const rowTabindex = computed(() => {
      if (
        (props.selection === null ||
          (Array.isArray(props.selection) && props.selection.length === 0)) &&
        (props.selectionMode === 'single' || props.selectionMode === 'multiple')
      ) {
        return rowIndex.value === 0 ? 0 : -1;
      }

      return -1;
    });

    const isRowEditing = computed(() => {
      if (props.rowData && props.editingRows) {
        if (props.dataKey)
          return props.editingRowKeys
            ? props.editingRowKeys[resolveFieldData(props.rowData, props.dataKey)] !== undefined
            : false;
        else return findIndex(props.rowData, props.editingRows) > -1;
      }

      return false;
    });

    const isRowGroupExpanded = computed(() => {
      if (props.expandableRowGroups && props.expandedRowGroups) {
        const groupFieldValue = resolveFieldData(props.rowData, props.groupRowsBy);

        return props.expandedRowGroups.indexOf(groupFieldValue) > -1;
      }

      return false;
    });

    const isSelected = computed(() => {
      if (props.rowData && props.selection) {
        if (props.dataKey) {
          return props.selectionKeys
            ? props.selectionKeys[resolveFieldData(props.rowData, props.dataKey)] !== undefined
            : false;
        } else {
          if (props.selection instanceof Array) return findIndexInSelection(props.rowData) > -1;
          else return equalsData(props.rowData, props.selection);
        }
      }

      return false;
    });

    const isSelectedWithContextMenu = computed(() => {
      if (props.rowData && props.contextMenuSelection) {
        return equalsData(props.rowData, props.contextMenuSelection);
      }

      return false;
    });

    const shouldRenderRowGroupHeader = computed(() => {
      const currentRowFieldData = resolveFieldData(props.rowData, props.groupRowsBy);
      const prevRowData = props.value?.[rowIndex.value - 1];

      if (prevRowData) {
        const previousRowFieldData = resolveFieldData(prevRowData, props.groupRowsBy);

        return currentRowFieldData !== previousRowFieldData;
      } else {
        return true;
      }
    });

    const shouldRenderRowGroupFooter = computed(() => {
      if (props.expandableRowGroups && !isRowGroupExpanded.value) {
        return false;
      } else {
        const currentRowFieldData = resolveFieldData(props.rowData, props.groupRowsBy);
        const nextRowData = props.value?.[rowIndex.value + 1];

        if (nextRowData) {
          const nextRowFieldData = resolveFieldData(nextRowData, props.groupRowsBy);

          return currentRowFieldData !== nextRowFieldData;
        } else {
          return true;
        }
      }
    });

    const columnsLength = computed(() => {
      if (props.columns) {
        let hiddenColLength = 0;

        props.columns.forEach((column: any) => {
          if (columnProp(column, 'hidden')) hiddenColLength++;
        });

        return props.columns.length - hiddenColLength;
      }

      return 0;
    });

    const isRowExpandable = computed(() => {
      return props.rowExpandable ? props.rowExpandable(props.rowData) !== false : true;
    });

    const renderBodyCell = (col: any, i: number) => {
      if (!shouldRenderBodyCell(col)) return null;

      const cellProps = {
        rowData: props.rowData,
        column: col,
        rowIndex: rowIndex.value,
        index: i,
        selected: isSelected.value,
        frozenRow: props.frozenRow,
        rowspan: props.rowGroupMode === 'rowspan' ? calculateRowGroupSize(col) : null,
        editMode: props.editMode,
        editing: props.editMode === 'row' && isRowEditing.value,
        editingMeta: props.editingMeta,
        virtualScrollerContentProps: props.virtualScrollerContentProps,
        ariaControls: `${props.expandedRowId}_${rowIndex.value}_expansion`,
        name: props.nameAttributeSelector,
        isRowExpanded: d_rowExpanded.value,
        expandedRowIcon: props.expandedRowIcon,
        collapsedRowIcon: props.collapsedRowIcon,
        editButtonProps: props.editButtonProps,
        selectionDisabled: props.selectionDisabled,
        rowExpandable: props.rowExpandable,
        onRadioChange,
        onCheckboxChange,
        onRowToggle,
        onCellEditInit,
        onCellEditComplete,
        onCellEditCancel,
        onRowEditInit,
        onRowEditSave,
        onRowEditCancel,
        onEditingMetaChange,
      };

      return (
        <BodyCell
          key={columnProp(col, 'columnKey') || columnProp(col, 'field') || i}
          {...cellProps}
        />
      );
    };

    return () => {
      const templates = props.templates || ({} as Record<string, any>);

      // empty 渲染
      if (props.empty) {
        const EmptySlot = templates.empty as any;
        return (
          <tr class="xy-data-table-empty-message" role="row">
            <td colspan={columnsLength.value}>{EmptySlot ? <EmptySlot /> : null}</td>
          </tr>
        );
      }

      const groupHeaderSlot = templates['groupheader'] as any;
      const expansionSlot = templates['expansion'] as any;
      const groupFooterSlot = templates['groupfooter'] as any;
      const rowToggleIconSlot = (templates['rowtoggleicon'] ||
        templates['rowgrouptogglericon']) as any;

      return (
        <>
          {groupHeaderSlot &&
          props.rowGroupMode === 'subheader' &&
          shouldRenderRowGroupHeader.value ? (
            <tr class="xy-data-table-row-group-header" style={props.rowGroupHeaderStyle} role="row">
              <td colspan={columnsLength.value - 1}>
                {props.expandableRowGroups ? (
                  <button
                    class="xy-data-table-row-toggle-button"
                    onClick={onRowGroupToggle}
                    type="button"
                  >
                    {rowToggleIconSlot ? (
                      <rowToggleIconSlot expanded={isRowGroupExpanded.value} />
                    ) : isRowGroupExpanded.value && props.expandedRowIcon ? (
                      <span class={['xy-data-table-row-toggle-icon', props.expandedRowIcon]} />
                    ) : isRowGroupExpanded.value && !props.expandedRowIcon ? (
                      <ChevronDownIcon class="xy-data-table-row-toggle-icon" />
                    ) : !isRowGroupExpanded.value && props.collapsedRowIcon ? (
                      <span class={['xy-data-table-row-toggle-icon', props.collapsedRowIcon]} />
                    ) : !isRowGroupExpanded.value && !props.collapsedRowIcon ? (
                      <ChevronRightIcon class="xy-data-table-row-toggle-icon" />
                    ) : null}
                  </button>
                ) : null}
                <groupHeaderSlot data={props.rowData} index={rowIndex.value} />
              </td>
            </tr>
          ) : null}

          {props.expandableRowGroups ? (
            isRowGroupExpanded.value
          ) : true ? (
            <tr
              class={rowClasses.value}
              style={rowStyles.value}
              tabindex={rowTabindex.value}
              role="row"
              aria-selected={props.selectionMode ? isSelected.value : null}
              onClick={onRowClick}
              onDblclick={onRowDblClick}
              onContextmenu={onRowRightClick}
              onTouchend={onRowTouchEnd}
              onKeydown={onRowKeyDown}
              onMousedown={onRowMouseDown}
              onDragstart={onRowDragStart}
              onDragover={onRowDragOver}
              onDragleave={onRowDragLeave}
              onDragend={onRowDragEnd}
              onDrop={onRowDrop}
              data-xy-index={rowIndex.value}
              data-xy-selectable-row={props.selectionMode ? true : false}
              data-xy-selected={props.selection && isSelected.value}
              data-xy-selected-contextmenu={
                props.contextMenuSelection && isSelectedWithContextMenu.value
              }
            >
              {(props.columns || []).map((col: any, i: number) => renderBodyCell(col, i))}
            </tr>
          ) : null}

          {expansionSlot && props.expandedRows && d_rowExpanded.value && isRowExpandable.value ? (
            <tr
              id={`${props.expandedRowId}_${rowIndex.value}_expansion`}
              class="xy-data-table-row-expansion"
              role="row"
            >
              <td colspan={columnsLength.value}>
                <expansionSlot data={props.rowData} index={rowIndex.value} />
              </td>
            </tr>
          ) : null}

          {groupFooterSlot &&
          props.rowGroupMode === 'subheader' &&
          shouldRenderRowGroupFooter.value ? (
            <tr class="xy-data-table-row-group-footer" role="row">
              <td colspan={columnsLength.value - 1}>
                <groupFooterSlot data={props.rowData} index={rowIndex.value} />
              </td>
            </tr>
          ) : null}
        </>
      );
    };
  },
});

export default BodyRow;
