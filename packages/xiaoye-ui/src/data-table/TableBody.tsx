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
import { cn } from '@xiaoye-ui/utils';
import { getOuterHeight } from '@xiaoye-ui/utils/dom';
import { resolveFieldData } from '@xiaoye-ui/utils/object';
import BodyRow from './BodyRow';

const TableBody = defineComponent({
  name: 'XYTableBody',
  inheritAttrs: false,
  props: {
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
    rowHover: { type: Boolean, default: false },
    contextMenu: { type: Boolean, default: false },
    contextMenuSelection: { type: Object as PropType<Record<string, any> | null>, default: null },
    rowClass: { type: Function as PropType<Function | null>, default: null },
    rowStyle: { type: Function as PropType<Function | null>, default: null },
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
    rowGroupHeaderStyle: { type: Object as PropType<Record<string, any> | null>, default: null },
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
    const instance = getCurrentInstance()!;

    const rowGroupHeaderStyleObject = ref<Record<string, string>>({});

    let dataKeyWarned = false;

    function getRowKey(rowData: any, rowIndex: number): string | number {
      if (props.dataKey) {
        return resolveFieldData(rowData, props.dataKey);
      }

      if (process.env.NODE_ENV !== 'production' && !dataKeyWarned) {
        dataKeyWarned = true;
        console.warn(
          '[xiaoye-ui] DataTable: 建议设置 dataKey 属性以获得更好的渲染性能。未设置 dataKey 时将使用行索引作为 key，排序/过滤后会导致全量重渲染。',
        );
      }

      return rowIndex;
    }

    function updateFrozenRowStickyPosition(): void {
      const el = instance.vnode.el as HTMLElement;
      el.style.top = getOuterHeight(el.previousElementSibling as HTMLElement) + 'px';
    }

    function updateFrozenRowGroupHeaderStickyPosition(): void {
      const el = instance.vnode.el as HTMLElement;
      const tableHeaderHeight = getOuterHeight(el.previousElementSibling as HTMLElement);

      rowGroupHeaderStyleObject.value.top = tableHeaderHeight + 'px';
    }

    function getVirtualScrollerProp(option: string, options?: Record<string, any> | null): any {
      options = options || props.virtualScrollerContentProps;

      return options ? options[option] : null;
    }

    function bodyRef(el: any): void {
      const contentRef = getVirtualScrollerProp('contentRef');

      contentRef && contentRef(el);
    }

    const bodyContentStyle = computed(() => {
      return getVirtualScrollerProp('contentStyle');
    });

    const dataP = computed(() => {
      return cn({
        hoverable: props.rowHover || props.selectionMode,
        frozen: props.frozenRow,
      });
    });

    onMounted(() => {
      if (props.frozenRow) {
        updateFrozenRowStickyPosition();
      }

      if (props.scrollable && props.rowGroupMode === 'subheader') {
        updateFrozenRowGroupHeaderStickyPosition();
      }
    });

    onUpdated(() => {
      if (props.frozenRow) {
        updateFrozenRowStickyPosition();
      }

      if (props.scrollable && props.rowGroupMode === 'subheader') {
        updateFrozenRowGroupHeaderStickyPosition();
      }
    });

    const rowProps = (rowData: any, rowIndex: number) => ({
      rowData,
      index: rowIndex,
      value: props.value,
      columns: props.columns,
      frozenRow: props.frozenRow,
      empty: props.empty,
      first: props.first,
      dataKey: props.dataKey,
      selection: props.selection,
      selectionKeys: props.selectionKeys,
      selectionMode: props.selectionMode,
      contextMenu: props.contextMenu,
      contextMenuSelection: props.contextMenuSelection,
      rowGroupMode: props.rowGroupMode,
      groupRowsBy: props.groupRowsBy,
      expandableRowGroups: props.expandableRowGroups,
      rowClass: props.rowClass,
      rowStyle: props.rowStyle,
      editMode: props.editMode,
      compareSelectionBy: props.compareSelectionBy,
      scrollable: props.scrollable,
      expandedRowIcon: props.expandedRowIcon,
      collapsedRowIcon: props.collapsedRowIcon,
      expandedRows: props.expandedRows,
      expandedRowGroups: props.expandedRowGroups,
      editingRows: props.editingRows,
      editingRowKeys: props.editingRowKeys,
      templates: props.templates,
      editButtonProps: props.editButtonProps,
      virtualScrollerContentProps: props.virtualScrollerContentProps,
      isVirtualScrollerDisabled: props.isVirtualScrollerDisabled,
      editingMeta: props.editingMeta,
      rowGroupHeaderStyle: props.rowGroupHeaderStyle,
      expandedRowId: props.expandedRowId,
      nameAttributeSelector: props.nameAttributeSelector,
      selectionDisabled: props.selectionDisabled,
      rowExpandable: props.rowExpandable,
      onRowgroupToggle: (e: any) => emit('rowgroupToggle', e),
      onRowClick: (e: any) => emit('rowClick', e),
      onRowDblclick: (e: any) => emit('rowDblclick', e),
      onRowRightclick: (e: any) => emit('rowRightclick', e),
      onRowTouchend: (e: any) => emit('rowTouchend', e),
      onRowKeydown: (e: any) => emit('rowKeydown', e),
      onRowMousedown: (e: any) => emit('rowMousedown', e),
      onRowDragstart: (e: any) => emit('rowDragstart', e),
      onRowDragover: (e: any) => emit('rowDragover', e),
      onRowDragleave: (e: any) => emit('rowDragleave', e),
      onRowDragend: (e: any) => emit('rowDragend', e),
      onRowDrop: (e: any) => emit('rowDrop', e),
      onRowToggle: (e: any) => emit('rowToggle', e),
      onRadioChange: (e: any) => emit('radioChange', e),
      onCheckboxChange: (e: any) => emit('checkboxChange', e),
      onCellEditInit: (e: any) => emit('cellEditInit', e),
      onCellEditComplete: (e: any) => emit('cellEditComplete', e),
      onCellEditCancel: (e: any) => emit('cellEditCancel', e),
      onRowEditInit: (e: any) => emit('rowEditInit', e),
      onRowEditSave: (e: any) => emit('rowEditSave', e),
      onRowEditCancel: (e: any) => emit('rowEditCancel', e),
      onEditingMetaChange: (e: any) => emit('editingMetaChange', e),
    });

    return () => {
      const children = !props.empty ? (
        (props.value || []).map((rowData, rowIndex) => (
          <BodyRow key={getRowKey(rowData, rowIndex)} {...rowProps(rowData, rowIndex)} />
        ))
      ) : (
        <BodyRow empty={props.empty} columns={props.columns} templates={props.templates} />
      );

      return (
        <tbody
          ref={bodyRef}
          class="xy-data-table-body"
          role="rowgroup"
          style={bodyContentStyle.value}
          data-xy={dataP.value}
        >
          {children}
        </tbody>
      );
    };
  },
});

export default TableBody;
