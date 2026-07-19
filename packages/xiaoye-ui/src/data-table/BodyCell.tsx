/// <reference types="vue/jsx" />
import {
  computed,
  defineComponent,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
  type PropType,
} from 'vue';
import {
  getAttribute,
  getFirstFocusableElement,
  getNextElementSibling,
  getOuterWidth,
  getPreviousElementSibling,
  invokeElementMethod,
} from '@xiaoye-ui/utils/dom';
import { resolveFieldData as resolveFieldDataUtil } from '@xiaoye-ui/utils/object';
import {
  BarsIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  TimesIcon,
} from '@xiaoye-ui/icons';
import Button from 'xiaoye-ui/button';
import OverlayEventBus from '../_util/overlayEventBus';
import RowCheckbox from './RowCheckbox';
import RowRadioButton from './RowRadioButton';
import { getColumnProp as getDataTableColumnProp } from './utils';

const BodyCell = defineComponent({
  name: 'XYBodyCell',
  inheritAttrs: false,
  props: {
    rowData: { type: Object as PropType<Record<string, any> | null>, default: null },
    column: { type: null as any, default: null },
    frozenRow: { type: Boolean, default: false },
    rowIndex: { type: [Number, null] as any, default: null },
    index: { type: [Number, null] as any, default: null },
    rowspan: { type: [Number, null] as any, default: null },
    isRowExpanded: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    editing: { type: Boolean, default: false },
    editingMeta: {
      type: Object as PropType<Record<number, { data: Record<string, any> }> | null>,
      default: null,
    },
    editMode: { type: String as PropType<string | null>, default: null },
    virtualScrollerContentProps: {
      type: Object as PropType<Record<string, any> | null>,
      default: null,
    },
    ariaControls: { type: String as PropType<string | null>, default: null },
    name: { type: String as PropType<string | null>, default: null },
    expandedRowIcon: { type: String as PropType<string | null>, default: null },
    collapsedRowIcon: { type: String as PropType<string | null>, default: null },
    editButtonProps: { type: Object as PropType<Record<string, any> | null>, default: null },
    selectionDisabled: {
      type: Function as PropType<((data: any) => boolean) | null>,
      default: null,
    },
    rowExpandable: { type: Function as PropType<((data: any) => boolean) | null>, default: null },
  },
  emits: [
    'cellEditInit',
    'cellEditComplete',
    'cellEditCancel',
    'rowEditInit',
    'rowEditSave',
    'rowEditCancel',
    'rowToggle',
    'radioChange',
    'checkboxChange',
    'editingMetaChange',
  ],
  setup(props, { emit }) {
    const instance = getCurrentInstance()!;
    const $pcDataTable = inject<any>('$pcDataTable', undefined);
    const $xiaoyeUI = inject<any>('$xiaoyeUI', {});

    const d_editing = ref(props.editing);
    const styleObject = ref<Record<string, string>>({});

    let documentEditListener: ((event: MouseEvent) => void) | null = null;
    let selfClick = false;
    let overlayEventListener: ((e: any) => void) | null = null;
    let editCompleteTimeout: ReturnType<typeof setTimeout> | null = null;

    watch(
      () => props.editing,
      newValue => {
        d_editing.value = newValue;
      },
    );

    watch(d_editing, newValue => {
      emit('editingMetaChange', {
        data: props.rowData,
        field: field.value || `field_${props.index}`,
        index: props.rowIndex!,
        editing: newValue,
      });
    });

    function columnProp(propOrCol: any, prop?: string): any {
      if (prop === undefined) {
        return getDataTableColumnProp(props.column, propOrCol);
      } else {
        return getDataTableColumnProp(propOrCol, prop);
      }
    }

    function resolveFieldData(): any {
      return resolveFieldDataUtil(props.rowData, field.value);
    }

    function toggleRow(event: Event): void {
      emit('rowToggle', {
        originalEvent: event,
        data: props.rowData,
      });
    }

    function toggleRowWithRadio(event: any, index: number): void {
      emit('radioChange', { originalEvent: event.originalEvent, index, data: event.data });
    }

    function toggleRowWithCheckbox(event: any, index: number): void {
      emit('checkboxChange', {
        originalEvent: event.originalEvent,
        index,
        data: event.data,
      });
    }

    function isEditable(): boolean {
      return props.column?.children && props.column.children.editor != null;
    }

    function bindDocumentEditListener(): void {
      if (!documentEditListener) {
        documentEditListener = (event: MouseEvent) => {
          const el = instance.vnode.el as HTMLElement;
          const target = event.target as HTMLElement | null;

          selfClick = !!(
            el &&
            target &&
            (el.contains(target as Node) ||
              target.closest('[data-xy-section="overlay"]') ||
              target.closest('[data-xy-section="panel"]'))
          );

          if (editCompleteTimeout) {
            clearTimeout(editCompleteTimeout);
          }

          if (!selfClick) {
            editCompleteTimeout = setTimeout(() => {
              completeEdit(event, 'outside');
            }, 1);
          }
        };

        document.addEventListener('mousedown', documentEditListener);
      }
    }

    function unbindDocumentEditListener(): void {
      if (documentEditListener) {
        document.removeEventListener('mousedown', documentEditListener);
        documentEditListener = null;
        selfClick = false;

        if (editCompleteTimeout) {
          clearTimeout(editCompleteTimeout);
          editCompleteTimeout = null;
        }
      }
    }

    function switchCellToViewMode(): void {
      d_editing.value = false;
      unbindDocumentEditListener();
      OverlayEventBus.off('overlay-click', overlayEventListener);
      overlayEventListener = null;
    }

    function onClick(event: MouseEvent): void {
      if (props.editMode === 'cell' && isEditable()) {
        if (!d_editing.value) {
          d_editing.value = true;
          bindDocumentEditListener();
          emit('cellEditInit', {
            originalEvent: event,
            data: props.rowData,
            field: field.value,
            index: props.rowIndex!,
          });

          overlayEventListener = (e: any) => {
            const el = instance.vnode.el as HTMLElement;
            selfClick = !!(el && el.contains(e.target));
          };

          OverlayEventBus.on('overlay-click', overlayEventListener);
        }
      }
    }

    function completeEdit(event: Event, type: string): void {
      const completeEvent = {
        originalEvent: event,
        data: props.rowData,
        newData: editingRowData.value,
        value: props.rowData![field.value],
        newValue: editingRowData.value[field.value],
        field: field.value,
        index: props.rowIndex!,
        type,
        defaultPrevented: false,
        preventDefault() {
          this.defaultPrevented = true;
        },
      };

      emit('cellEditComplete', completeEvent);

      if (!completeEvent.defaultPrevented) {
        switchCellToViewMode();
      }
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (props.editMode === 'cell') {
        switch (event.code) {
          case 'Enter':
          case 'NumpadEnter':
            completeEdit(event, 'enter');
            break;

          case 'Escape':
            switchCellToViewMode();
            emit('cellEditCancel', {
              originalEvent: event,
              data: props.rowData,
              field: field.value,
              index: props.rowIndex!,
            });
            break;

          case 'Tab':
            completeEdit(event, 'tab');

            if (event.shiftKey) moveToPreviousCell(event);
            else moveToNextCell(event);
            break;

          default:
            break;
        }
      }
    }

    async function moveToPreviousCell(event: KeyboardEvent): Promise<void> {
      const currentCell = findCell(event.target as HTMLElement);
      const targetCell = findPreviousEditableColumn(currentCell);

      if (targetCell) {
        await nextTick();
        invokeElementMethod(targetCell, 'click' as keyof Element);
        event.preventDefault();
      }
    }

    async function moveToNextCell(event: KeyboardEvent): Promise<void> {
      const currentCell = findCell(event.target as HTMLElement);
      const targetCell = findNextEditableColumn(currentCell);

      if (targetCell) {
        await nextTick();
        invokeElementMethod(targetCell, 'click' as keyof Element);
        event.preventDefault();
      }
    }

    function findCell(element: HTMLElement | null): HTMLElement | null {
      if (element) {
        let cell: HTMLElement | null = element;

        while (cell && !getAttribute(cell, 'data-xy-cell-editing')) {
          cell = cell.parentElement;
        }

        return cell;
      } else {
        return null;
      }
    }

    function findPreviousEditableColumn(cell: HTMLElement): HTMLElement | null {
      let prevCell: HTMLElement | null = cell.previousElementSibling as HTMLElement;

      if (!prevCell) {
        const previousRow = cell.parentElement?.previousElementSibling as HTMLElement;

        if (previousRow) {
          prevCell = previousRow.lastElementChild as HTMLElement;
        }
      }

      if (prevCell) {
        if (getAttribute(prevCell, 'data-xy-editable-column')) return prevCell;
        else return findPreviousEditableColumn(prevCell);
      } else {
        return null;
      }
    }

    function findNextEditableColumn(cell: HTMLElement): HTMLElement | null {
      let nextCell: HTMLElement | null = cell.nextElementSibling as HTMLElement;

      if (!nextCell) {
        const nextRow = cell.parentElement?.nextElementSibling as HTMLElement;

        if (nextRow) {
          nextCell = nextRow.firstElementChild as HTMLElement;
        }
      }

      if (nextCell) {
        if (getAttribute(nextCell, 'data-xy-editable-column')) return nextCell;
        else return findNextEditableColumn(nextCell);
      } else {
        return null;
      }
    }

    function onRowEditInit(event: Event): void {
      emit('rowEditInit', {
        originalEvent: event,
        data: props.rowData,
        newData: editingRowData.value,
        field: field.value,
        index: props.rowIndex!,
      });
    }

    function onRowEditSave(event: Event): void {
      emit('rowEditSave', {
        originalEvent: event,
        data: props.rowData,
        newData: editingRowData.value,
        field: field.value,
        index: props.rowIndex!,
      });
    }

    function onRowEditCancel(event: Event): void {
      emit('rowEditCancel', {
        originalEvent: event,
        data: props.rowData,
        newData: editingRowData.value,
        field: field.value,
        index: props.rowIndex!,
      });
    }

    function editorInitCallback(event: Event): void {
      emit('rowEditInit', {
        originalEvent: event,
        data: props.rowData,
        newData: editingRowData.value,
        field: field.value,
        index: props.rowIndex!,
      });
    }

    function editorSaveCallback(event: Event): void {
      if (props.editMode === 'row') {
        emit('rowEditSave', {
          originalEvent: event,
          data: props.rowData,
          newData: editingRowData.value,
          field: field.value,
          index: props.rowIndex!,
        });
      } else {
        completeEdit(event, 'enter');
      }
    }

    function editorCancelCallback(event: Event): void {
      if (props.editMode === 'row') {
        emit('rowEditCancel', {
          originalEvent: event,
          data: props.rowData,
          newData: editingRowData.value,
          field: field.value,
          index: props.rowIndex!,
        });
      } else {
        switchCellToViewMode();
        emit('cellEditCancel', {
          originalEvent: event,
          data: props.rowData,
          field: field.value,
          index: props.rowIndex!,
        });
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

    function getVirtualScrollerProp(option: string): any {
      return props.virtualScrollerContentProps ? props.virtualScrollerContentProps[option] : null;
    }

    const editingRowData = computed(() => {
      return props.editingMeta?.[props.rowIndex!]
        ? props.editingMeta[props.rowIndex!].data
        : props.rowData;
    });

    const field = computed(() => {
      return columnProp('field');
    });

    const cellProps = computed(() => {
      const getCellProps = columnProp('getCellProps');

      if (typeof getCellProps === 'function') {
        return getCellProps(props.rowData, props.rowIndex) || {};
      }

      return {};
    });

    const cellColspan = computed(() => {
      return (
        cellProps.value.colSpan ?? cellProps.value.colspan ?? columnProp('colspan') ?? undefined
      );
    });

    const cellRowspan = computed(() => {
      return cellProps.value.rowSpan ?? cellProps.value.rowspan ?? props.rowspan ?? undefined;
    });

    const containerClass = computed(() => {
      const frozen = columnProp('frozen');
      const alignFrozen = columnProp('alignFrozen');

      return [
        'xy-data-table-cell',
        columnProp('bodyClass'),
        columnProp('class'),
        cellProps.value.class ?? cellProps.value.className,
        {
          'xy-data-table-cell--frozen': frozen,
          'xy-data-table-cell--frozen-left': frozen && alignFrozen !== 'right',
          'xy-data-table-cell--frozen-right': frozen && alignFrozen === 'right',
        },
      ];
    });

    const containerStyle = computed(() => {
      const bodyStyle = columnProp('bodyStyle');
      const columnStyle = columnProp('style');
      const cellStyle = cellProps.value.style;

      return columnProp('frozen')
        ? [columnStyle, bodyStyle, cellStyle, styleObject.value]
        : [columnStyle, bodyStyle, cellStyle];
    });

    const loading = computed(() => {
      return (
        props.column?.children?.loading &&
        (getVirtualScrollerProp('loading') || $pcDataTable?.loading)
      );
    });

    const loadingOptions = computed(() => {
      const getLoaderOptions = getVirtualScrollerProp('getLoaderOptions');

      return (
        getLoaderOptions &&
        getLoaderOptions(props.rowIndex, {
          cellIndex: props.index,
          cellFirst: props.index === 0,
          cellLast: props.index === getVirtualScrollerProp('columns')?.length - 1,
          cellEven: props.index! % 2 === 0,
          cellOdd: props.index! % 2 !== 0,
          column: props.column,
          field: field.value,
        })
      );
    });

    const expandButtonAriaLabel = computed(() => {
      return $xiaoyeUI?.config?.locale?.aria
        ? props.isRowExpanded
          ? $xiaoyeUI.config.locale.aria.expandRow
          : $xiaoyeUI.config.locale.aria.collapseRow
        : undefined;
    });

    const initButtonAriaLabel = computed(() => {
      return $xiaoyeUI?.config?.locale?.aria ? $xiaoyeUI.config.locale.aria.editRow : undefined;
    });

    const saveButtonAriaLabel = computed(() => {
      return $xiaoyeUI?.config?.locale?.aria ? $xiaoyeUI.config.locale.aria.saveEdit : undefined;
    });

    const cancelButtonAriaLabel = computed(() => {
      return $xiaoyeUI?.config?.locale?.aria ? $xiaoyeUI.config.locale.aria.cancelEdit : undefined;
    });

    const isSelectionDisabled = computed(() => {
      return props.selectionDisabled ? props.selectionDisabled(props.rowData) : false;
    });

    const isRowExpandable = computed(() => {
      return props.rowExpandable ? props.rowExpandable(props.rowData) !== false : true;
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

      if (
        d_editing.value &&
        (props.editMode === 'cell' || (props.editMode === 'row' && columnProp('rowEditor')))
      ) {
        setTimeout(() => {
          const el = instance.vnode.el as HTMLElement;
          const focusableEl = getFirstFocusableElement(el);

          focusableEl && (focusableEl as HTMLElement).focus();
        }, 1);
      }
    });

    onBeforeUnmount(() => {
      unbindDocumentEditListener();

      if (overlayEventListener) {
        OverlayEventBus.off('overlay-click', overlayEventListener);
        overlayEventListener = null;
      }
    });

    const renderContent = () => {
      const column = props.column;
      const children = column?.children || {};

      // loading 状态
      if (loading.value) {
        const LoadingSlot = children.loading as any;
        return (
          <LoadingSlot
            data={props.rowData}
            column={column}
            field={field.value}
            index={props.rowIndex}
            frozenRow={props.frozenRow}
            loadingOptions={loadingOptions.value}
          />
        );
      }

      // body slot 且非编辑态
      if (children.body && !d_editing.value) {
        const BodySlot = children.body as any;
        return (
          <BodySlot
            data={props.rowData}
            column={column}
            field={field.value}
            index={props.rowIndex}
            frozenRow={props.frozenRow}
            editorInitCallback={editorInitCallback}
            rowTogglerCallback={toggleRow}
          />
        );
      }

      // editor slot 且编辑态
      if (children.editor && d_editing.value) {
        const EditorSlot = children.editor as any;
        return (
          <EditorSlot
            data={editingRowData.value}
            column={column}
            field={field.value}
            index={props.rowIndex}
            frozenRow={props.frozenRow}
            editorSaveCallback={editorSaveCallback}
            editorCancelCallback={editorCancelCallback}
          />
        );
      }

      // body slot 无 editor 但在编辑态
      if (children.body && !children.editor && d_editing.value) {
        const BodySlot = children.body as any;
        return (
          <BodySlot
            data={editingRowData.value}
            column={column}
            field={field.value}
            index={props.rowIndex}
            frozenRow={props.frozenRow}
          />
        );
      }

      // selectionMode
      if (columnProp('selectionMode')) {
        if (columnProp('selectionMode') === 'single') {
          return (
            <RowRadioButton
              value={props.rowData}
              name={props.name}
              checked={props.selected}
              disabled={isSelectionDisabled.value}
              onChange={(e: any) => toggleRowWithRadio(e, props.rowIndex)}
              column={column}
              index={props.index}
            />
          );
        }
        if (columnProp('selectionMode') === 'multiple') {
          return (
            <RowCheckbox
              value={props.rowData}
              checked={props.selected}
              disabled={isSelectionDisabled.value}
              rowCheckboxIconTemplate={children.rowcheckboxicon}
              aria-selected={props.selected ? true : undefined}
              onChange={(e: any) => toggleRowWithCheckbox(e, props.rowIndex)}
              column={column}
              index={props.index}
            />
          );
        }
        return null;
      }

      // rowReorder
      if (columnProp('rowReorder')) {
        if (children.rowreordericon) {
          const ReorderIconSlot = children.rowreordericon as any;
          return <ReorderIconSlot class="xy-data-table-reorderable-row-handle" />;
        }
        if (columnProp('rowReorderIcon')) {
          return (
            <i class={['xy-data-table-reorderable-row-handle', columnProp('rowReorderIcon')]} />
          );
        }
        return <BarsIcon class="xy-data-table-reorderable-row-handle" />;
      }

      // expander
      if (columnProp('expander') && isRowExpandable.value) {
        let toggleIcon = null;
        if (children.rowtoggleicon) {
          const ToggleIconSlot = children.rowtoggleicon as any;
          toggleIcon = (
            <ToggleIconSlot
              class="xy-data-table-row-toggle-icon"
              rowExpanded={props.isRowExpanded}
            />
          );
        } else if (children.rowtogglericon) {
          const TogglerIconSlot = children.rowtogglericon as any;
          toggleIcon = (
            <TogglerIconSlot
              class="xy-data-table-row-toggle-icon"
              rowExpanded={props.isRowExpanded}
            />
          );
        } else if (props.isRowExpanded && props.expandedRowIcon) {
          toggleIcon = <span class={['xy-data-table-row-toggle-icon', props.expandedRowIcon]} />;
        } else if (props.isRowExpanded && !props.expandedRowIcon) {
          toggleIcon = <ChevronDownIcon class="xy-data-table-row-toggle-icon" />;
        } else if (!props.isRowExpanded && props.collapsedRowIcon) {
          toggleIcon = <span class={['xy-data-table-row-toggle-icon', props.collapsedRowIcon]} />;
        } else if (!props.isRowExpanded && !props.collapsedRowIcon) {
          toggleIcon = <ChevronRightIcon class="xy-data-table-row-toggle-icon" />;
        }

        return (
          <button
            {...{ directives: [{ name: 'ripple', value: {} }] }}
            class="xy-data-table-row-toggle-button"
            type="button"
            aria-expanded={props.isRowExpanded}
            aria-controls={props.ariaControls}
            aria-label={expandButtonAriaLabel.value}
            onClick={(e: Event) => {
              e.stopPropagation();
              toggleRow(e);
            }}
            data-xy-selected={props.selected}
            data-xy-group-section="rowactionbutton"
          >
            {toggleIcon}
          </button>
        );
      }

      // rowEditor
      if (props.editMode === 'row' && columnProp('rowEditor')) {
        const editBtnProps = props.editButtonProps || {};
        const initBtnProps = editBtnProps.init || {};
        const saveBtnProps = editBtnProps.save || {};
        const cancelBtnProps = editBtnProps.cancel || {};

        const EditorInitIconComp = (children.roweditoriniticon || PencilIcon) as any;
        const EditorSaveIconComp = (children.roweditorsaveicon || CheckIcon) as any;
        const EditorCancelIconComp = (children.roweditorcancelicon || TimesIcon) as any;

        return (
          <>
            {!d_editing.value ? (
              <Button
                class="xy-data-table-row-editor-init"
                aria-label={initButtonAriaLabel.value}
                onClick={onRowEditInit}
                {...initBtnProps}
                data-xy-group-section="rowactionbutton"
              >
                {{ icon: () => <EditorInitIconComp /> }}
              </Button>
            ) : null}
            {d_editing.value ? (
              <Button
                class="xy-data-table-row-editor-save"
                aria-label={saveButtonAriaLabel.value}
                onClick={onRowEditSave}
                {...saveBtnProps}
                data-xy-group-section="rowactionbutton"
              >
                {{ icon: () => <EditorSaveIconComp /> }}
              </Button>
            ) : null}
            {d_editing.value ? (
              <Button
                class="xy-data-table-row-editor-cancel"
                aria-label={cancelButtonAriaLabel.value}
                onClick={onRowEditCancel}
                {...cancelBtnProps}
                data-xy-group-section="rowactionbutton"
              >
                {{ icon: () => <EditorCancelIconComp /> }}
              </Button>
            ) : null}
          </>
        );
      }

      // 默认渲染字段值
      return <>{resolveFieldData()}</>;
    };

    return () => {
      return (
        <td
          style={containerStyle.value}
          class={containerClass.value}
          colspan={loading.value ? undefined : cellColspan.value}
          rowspan={loading.value ? undefined : cellRowspan.value}
          onClick={loading.value ? undefined : onClick}
          onKeydown={loading.value ? undefined : onKeyDown}
          role="cell"
          data-xy-selection-column={columnProp('selectionMode') != null}
          data-xy-editable-column={isEditable()}
          data-xy-cell-editing={d_editing.value}
          data-xy-frozen-column={columnProp('frozen')}
        >
          {renderContent()}
        </td>
      );
    };
  },
});

export default BodyCell;
