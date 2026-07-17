/// <reference types="vue/jsx" />
import {
  addStyle,
  clearSelection,
  find,
  getAttribute,
  getIndex,
  getOffset,
  getOuterWidth,
  isRTL,
  setAttribute,
} from '@xiaoye-ui/utils/dom';
import { resolveFieldData } from '@xiaoye-ui/utils/object';
import { getVNodeProp, HelperSet } from '@xiaoye-ui/core/utils';
import { useProvide } from '@xiaoye-ui/core/composables';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  reactive,
  ref,
  watch,
  Transition,
} from 'vue';
import { SpinnerIcon } from '@xiaoye-ui/icons';
import Pagination from 'xiaoye-ui/pagination';
import { sortSingleTree, sortMultipleTree, filterTree, hasFilters } from '../table-core';
import TreeTableRow from './TreeTableRow';
import HeaderCell from './HeaderCell';
import FooterCell from './FooterCell';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import { treeTableProps } from './treeTableTypes';

// SSR 安全：仅在有 document 的环境下执行 DOM 操作
const isClient = typeof window !== 'undefined' && !!window.document;

const TreeTable = defineComponent({
  name: 'XYTreeTable',
  inheritAttrs: false,
  __XY_TREE_TABLE: true,
  props: initDefaultProps(treeTableProps(), {}),
  emits: [
    'nodeExpand',
    'nodeCollapse',
    'update:expandedKeys',
    'update:selectionKeys',
    'nodeSelect',
    'nodeUnselect',
    'update:first',
    'update:rows',
    'page',
    'update:sortField',
    'update:sortOrder',
    'update:multiSortMeta',
    'sort',
    'filter',
    'columnResizeEnd',
    'update:contextMenuSelection',
    'rowContextmenu',
  ],
  setup(props, { emit, expose, slots, attrs }) {
    const { prefixCls } = useConfigInject('tree-table', props);
    const [, hashId] = useStyle(prefixCls);

    const d_columns = new HelperSet({ type: 'Column' });

    const state = reactive({
      d_expandedKeys: props.expandedKeys || {},
      d_first: props.first,
      d_rows: props.rows,
      d_sortField: props.sortField,
      d_sortOrder: props.sortOrder,
      d_multiSortMeta: props.multiSortMeta ? [...props.multiSortMeta] : [],
      hasASelectedNode: false,
      columnResizing: false,
      resizeColumn: null as HTMLElement | null,
      styleElement: null as HTMLStyleElement | null,
    });

    const { d_expandedKeys, d_first, d_rows, d_sortField, d_sortOrder, d_multiSortMeta } = state;

    const tableRef = ref<HTMLElement | null>(null);
    const resizeHelperRef = ref<HTMLElement | null>(null);
    const documentColumnResizeListener = ref<(() => void) | null>(null);
    const documentColumnResizeEndListener = ref<(() => void) | null>(null);
    const lastResizeHelperX = ref<number | null>(null);
    const resizeColumnElement = ref<HTMLElement | null>(null);

    const instance = getCurrentInstance()!;
    const proxy = instance.proxy!;

    useProvide('$columns', d_columns);

    const columns = computed(() => {
      const _slots = slots.default?.() || [];
      return d_columns.get(proxy, { default: () => _slots }) || [];
    });

    const processedData = computed(() => {
      if (props.lazy) {
        return props.value;
      } else {
        if (props.value && props.value.length) {
          let data = props.value;

          if (sorted.value) {
            if (props.sortMode === 'single')
              data = sortSingleTree(data, {
                sortField: state.d_sortField,
                sortOrder: state.d_sortOrder,
              });
            else if (props.sortMode === 'multiple')
              data = sortMultipleTree(data, { multiSortMeta: state.d_multiSortMeta });
          }

          if (hasFilters(props.filters)) {
            data = filterTree(data, {
              filters: props.filters || {},
              filterLocale: props.filterLocale,
              filterMode: props.filterMode,
              columns: columns.value,
              columnProp,
              createLazyLoadEvent: () => createLazyLoadEvent({ originalEvent: null }),
              onFilter: (event: any) => emit('filter', event),
            });
          }

          return data;
        } else {
          return [];
        }
      }
    });

    const dataToRender = computed(() => {
      const data = processedData.value;

      if (props.pagination) {
        const first = props.lazy ? 0 : d_first;
        return data.slice(first, first + d_rows);
      } else {
        return data;
      }
    });

    const empty = computed(() => {
      const data = processedData.value;
      return !data || data.length === 0;
    });

    const sorted = computed(() => {
      return d_sortField || (d_multiSortMeta && d_multiSortMeta.length > 0);
    });

    const hasFooter = computed(() => {
      let footer = false;

      for (const col of columns.value) {
        if (columnProp(col, 'footer') || (col.children && col.children.footer)) {
          footer = true;
          break;
        }
      }

      return footer;
    });

    const paginationTop = computed(() => {
      return (
        props.pagination &&
        (props.paginationPosition === 'top' || props.paginationPosition === 'both')
      );
    });

    const paginationBottom = computed(() => {
      return (
        props.pagination &&
        (props.paginationPosition === 'bottom' || props.paginationPosition === 'both')
      );
    });

    const singleSelectionMode = computed(() => {
      return props.selectionMode && props.selectionMode === 'single';
    });

    const multipleSelectionMode = computed(() => {
      return props.selectionMode && props.selectionMode === 'multiple';
    });

    const rowSelectionMode = computed(() => {
      return singleSelectionMode.value || multipleSelectionMode.value;
    });

    useProvide('$pcTreeTable', {
      get $el() {
        return instance.proxy?.$el;
      },
      get $attrs() {
        return instance.attrs;
      },
      get rowSelectionMode() {
        return rowSelectionMode.value;
      },
      get scrollable() {
        return props.scrollable;
      },
      get showGridlines() {
        return props.showGridlines;
      },
      get size() {
        return props.size;
      },
      get rowHover() {
        return props.rowHover;
      },
    });

    const rootClasses = computed(() => [
      prefixCls.value,
      hashId.value,
      {
        [`${prefixCls.value}-hoverable`]: props.rowHover || rowSelectionMode.value,
        [`${prefixCls.value}-resizable`]: props.resizableColumns,
        [`${prefixCls.value}-resizable-fit`]:
          props.resizableColumns && props.columnResizeMode === 'fit',
        [`${prefixCls.value}-scrollable`]: props.scrollable,
        [`${prefixCls.value}-flex-scrollable`]: props.scrollable && props.scrollHeight === 'flex',
        [`${prefixCls.value}-gridlines`]: props.showGridlines,
        [`${prefixCls.value}-sm`]: props.size === 'small',
        [`${prefixCls.value}-lg`]: props.size === 'large',
      },
    ]);

    const tableClasses = computed(() => [
      `${prefixCls.value}-table`,
      {
        [`${prefixCls.value}-table-scrollable`]: props.scrollable,
        [`${prefixCls.value}-table-resizable`]: props.resizableColumns,
        [`${prefixCls.value}-table-resizable-fit`]:
          props.resizableColumns && props.columnResizeMode === 'fit',
      },
    ]);

    const totalRecordsLength = computed(() => {
      if (props.lazy) {
        return props.totalRecords;
      } else {
        const data = processedData.value;
        return data ? data.length : 0;
      }
    });

    watch(
      () => props.expandedKeys,
      newValue => {
        state.d_expandedKeys = newValue || {};
      },
    );

    watch(
      () => props.first,
      newValue => {
        state.d_first = newValue;
      },
    );

    watch(
      () => props.rows,
      newValue => {
        state.d_rows = newValue;
      },
    );

    watch(
      () => props.sortField,
      newValue => {
        state.d_sortField = newValue;
      },
    );

    watch(
      () => props.sortOrder,
      newValue => {
        state.d_sortOrder = newValue;
      },
    );

    watch(
      () => props.multiSortMeta,
      newValue => {
        state.d_multiSortMeta = newValue;
      },
    );

    function columnProp(col: any, prop: string) {
      return getVNodeProp(col, prop);
    }

    function onNodeToggle(node: any) {
      const key = nodeKey(node);

      if (state.d_expandedKeys[key]) {
        delete state.d_expandedKeys[key];
        emit('nodeCollapse', node);
      } else {
        state.d_expandedKeys[key] = true;
        emit('nodeExpand', node);
      }

      state.d_expandedKeys = { ...state.d_expandedKeys };
      emit('update:expandedKeys', state.d_expandedKeys);
    }

    function onNodeClick(event: any) {
      if (rowSelectionMode.value && event.node.selectable !== false) {
        const metaSelection = event.nodeTouched ? false : props.metaKeySelection;
        const _selectionKeys = metaSelection
          ? handleSelectionWithMetaKey(event)
          : handleSelectionWithoutMetaKey(event);

        emit('update:selectionKeys', _selectionKeys);
      }
    }

    function nodeKey(node: any) {
      return resolveFieldData(node, props.dataKey);
    }

    function handleSelectionWithMetaKey(event: any) {
      const originalEvent = event.originalEvent;
      const node = event.node;
      const nodeKeyVal = nodeKey(node);
      const metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
      const selected = isNodeSelected(node);
      let _selectionKeys: Record<string, any>;

      if (selected && metaKey) {
        if (isSingleSelectionMode()) {
          _selectionKeys = {};
        } else {
          _selectionKeys = { ...props.selectionKeys };
          delete _selectionKeys[nodeKeyVal];
        }

        emit('nodeUnselect', node);
      } else {
        if (isSingleSelectionMode()) {
          _selectionKeys = {};
        } else if (isMultipleSelectionMode()) {
          _selectionKeys = !metaKey ? {} : props.selectionKeys ? { ...props.selectionKeys } : {};
        }

        _selectionKeys[nodeKeyVal] = true;
        emit('nodeSelect', node);
      }

      return _selectionKeys;
    }

    function handleSelectionWithoutMetaKey(event: any) {
      const node = event.node;
      const nodeKeyVal = nodeKey(node);
      const selected = isNodeSelected(node);
      let _selectionKeys: Record<string, any>;

      if (isSingleSelectionMode()) {
        if (selected) {
          _selectionKeys = {};
          emit('nodeUnselect', node);
        } else {
          _selectionKeys = {};
          _selectionKeys[nodeKeyVal] = true;
          emit('nodeSelect', node);
        }
      } else {
        if (selected) {
          _selectionKeys = { ...props.selectionKeys };
          delete _selectionKeys[nodeKeyVal];

          emit('nodeUnselect', node);
        } else {
          _selectionKeys = props.selectionKeys ? { ...props.selectionKeys } : {};
          _selectionKeys[nodeKeyVal] = true;

          emit('nodeSelect', node);
        }
      }

      return _selectionKeys;
    }

    function onCheckboxChange(event: any) {
      emit('update:selectionKeys', event.selectionKeys);

      if (event.check) emit('nodeSelect', event.node);
      else emit('nodeUnselect', event.node);
    }

    function onRowRightClick(event: any) {
      if (props.contextMenu) {
        clearSelection();
        event.originalEvent?.target?.focus();
      }

      emit('update:contextMenuSelection', event.node);
      emit('rowContextmenu', event);
    }

    function isSingleSelectionMode() {
      return props.selectionMode === 'single';
    }

    function isMultipleSelectionMode() {
      return props.selectionMode === 'multiple';
    }

    function isNodeSelected(node: any) {
      return props.selectionMode && props.selectionKeys
        ? props.selectionKeys[nodeKey(node)] === true
        : false;
    }

    function handlePageChange(page: number, pageSize: number) {
      state.d_first = (page - 1) * pageSize;
      state.d_rows = pageSize;

      const pageEvent = createLazyLoadEvent({ originalEvent: null });

      pageEvent.pageCount = Math.ceil(totalRecordsLength.value / pageSize);
      pageEvent.page = page;

      state.d_expandedKeys = {};
      emit('update:expandedKeys', state.d_expandedKeys);
      emit('update:first', state.d_first);
      emit('update:rows', state.d_rows);
      emit('page', pageEvent);
    }

    function resetPage() {
      state.d_first = 0;
      emit('update:first', state.d_first);
    }

    function getFilterColumnHeaderClass(column: any) {
      return [
        `${prefixCls.value}-cell`,
        `${prefixCls.value}-cell-header`,
        {
          [`${prefixCls.value}-cell-frozen`]: columnProp(column, 'frozen'),
          [`${prefixCls.value}-cell-resizable`]: props.resizableColumns,
          [`${prefixCls.value}-cell-sortable`]: columnProp(column, 'sortable'),
          [`${prefixCls.value}-cell-sorted`]: columnProp(column, 'sortable')
            ? isColumnSorted(column)
            : false,
        },
        columnProp(column, 'filterHeaderClass'),
      ];
    }

    function isColumnSorted(column: any) {
      const field = columnProp(column, 'sortField') || columnProp(column, 'field');

      return props.sortField && field && props.sortField === field;
    }

    function onColumnHeaderClick(e: any) {
      const event = e.originalEvent;
      const column = e.column;

      if (columnProp(column, 'sortable')) {
        const targetNode = event.target as HTMLElement | null;

        if (!targetNode) return;

        const columnField = columnProp(column, 'sortField') || columnProp(column, 'field');

        if (
          getAttribute(targetNode, 'data-xy-sortable-column') === true ||
          targetNode.closest('[data-xy-sortable-column="true"]')
        ) {
          clearSelection();

          if (props.sortMode === 'single') {
            if (state.d_sortField === columnField) {
              if (props.removableSort && state.d_sortOrder * -1 === props.defaultSortOrder) {
                state.d_sortOrder = null;
                state.d_sortField = null;
              } else {
                state.d_sortOrder = state.d_sortOrder * -1;
              }
            } else {
              state.d_sortOrder = props.defaultSortOrder;
              state.d_sortField = columnField;
            }

            emit('update:sortField', state.d_sortField);
            emit('update:sortOrder', state.d_sortOrder);
            resetPage();
          } else if (props.sortMode === 'multiple') {
            const metaKey = event.metaKey || event.ctrlKey;

            if (!metaKey) {
              state.d_multiSortMeta = state.d_multiSortMeta.filter(
                meta => meta.field === columnField,
              );
            }

            addMultiSortField(columnField);
            emit('update:multiSortMeta', state.d_multiSortMeta);
          }

          emit('sort', createLazyLoadEvent(event));
        }
      }
    }

    function addMultiSortField(field: string) {
      const index = state.d_multiSortMeta.findIndex(meta => meta.field === field);

      if (index >= 0) {
        if (
          props.removableSort &&
          state.d_multiSortMeta[index].order * -1 === props.defaultSortOrder
        )
          state.d_multiSortMeta.splice(index, 1);
        else
          state.d_multiSortMeta[index] = {
            field,
            // 类型断言：order * -1 是 number，但运行时只可能是 0/1/-1
            order: (state.d_multiSortMeta[index].order * -1) as 0 | 1 | -1,
          };
      } else {
        state.d_multiSortMeta.push({
          field,
          order: props.defaultSortOrder as 0 | 1 | -1,
        });
      }

      state.d_multiSortMeta = [...state.d_multiSortMeta];
    }

    function createLazyLoadEvent(event: any) {
      let filterMatchModes: Record<string, any> | undefined;

      if (hasFilters(props.filters)) {
        filterMatchModes = {};
        columns.value.forEach(col => {
          if (columnProp(col, 'field')) {
            filterMatchModes![col.props.field] = columnProp(col, 'filterMatchMode');
          }
        });
      }

      return {
        originalEvent: event,
        first: state.d_first,
        rows: state.d_rows,
        sortField: state.d_sortField,
        sortOrder: state.d_sortOrder,
        multiSortMeta: state.d_multiSortMeta,
        filters: props.filters,
        filterMatchModes,
        // 修复类型：handlePageChange 需要赋值 pageCount/page，预先声明可选字段
        page: undefined as number | undefined,
        pageCount: undefined as number | undefined,
      };
    }

    function onColumnResizeStart(event: any) {
      if (!isClient) return;
      // 修复类型：getOffset 返回 { left: number | string }，断言为 number
      const containerLeft = getOffset((tableRef.value as any)?.$el || tableRef.value)
        .left as number;
      const target = event.target;

      if (!target) return;

      resizeColumnElement.value = target.parentElement;
      state.columnResizing = true;
      state.resizeColumn = target.parentElement;
      lastResizeHelperX.value =
        event.pageX - containerLeft + (tableRef.value as any)?.$el.scrollLeft;

      bindColumnResizeEvents();
    }

    function onColumnResize(event: MouseEvent) {
      if (!isClient) return;
      // 修复类型：getOffset 返回 { left: number | string }，断言为 number
      const containerLeft = getOffset((tableRef.value as any)?.$el || tableRef.value)
        .left as number;
      const el = (tableRef.value as any)?.$el || tableRef.value;

      el.setAttribute('data-xy-unselectable-text', 'true');
      addStyle(el, { 'user-select': 'none' });
      if (resizeHelperRef.value) {
        resizeHelperRef.value.style.height = el.offsetHeight + 'px';
        resizeHelperRef.value.style.top = '0px';
        resizeHelperRef.value.style.left = event.pageX - containerLeft + el.scrollLeft + 'px';
        resizeHelperRef.value.style.display = 'block';
      }
    }

    function onColumnResizeEnd() {
      if (!isClient) return;
      if (!resizeColumnElement.value || !resizeHelperRef.value || !tableRef.value) return;

      const delta = isRTL((tableRef.value as any)?.$el || tableRef.value)
        ? lastResizeHelperX.value! - resizeHelperRef.value.offsetLeft
        : resizeHelperRef.value.offsetLeft - lastResizeHelperX.value!;
      const columnWidth = resizeColumnElement.value.offsetWidth;
      const newColumnWidth = columnWidth + delta;
      // 修复类型：style.minWidth 是 string | number，统一为 string 供 parseInt 使用
      const minWidth: string = resizeColumnElement.value.style.minWidth || '15';
      const tableEl = (tableRef.value as any)?.$el || tableRef.value;

      if (columnWidth + delta > parseInt(minWidth, 10)) {
        if (props.columnResizeMode === 'fit') {
          const nextColumn = resizeColumnElement.value.nextElementSibling;
          const nextColumnWidth = (nextColumn as HTMLElement).offsetWidth - delta;

          if (newColumnWidth > 15 && nextColumnWidth > 15) {
            resizeTableCells(newColumnWidth, nextColumnWidth);
          }
        } else if (props.columnResizeMode === 'expand') {
          const tableWidth = (tableRef.value as any)?.offsetWidth + delta + 'px';

          const updateTableWidth = (el: HTMLElement) => {
            !!el && (el.style.width = el.style.minWidth = tableWidth);
          };

          resizeTableCells(newColumnWidth);
          updateTableWidth(tableRef.value as any);
        }

        emit('columnResizeEnd', {
          element: resizeColumnElement.value,
          delta,
        });
      }

      resizeHelperRef.value.style.display = 'none';
      state.resizeColumn = null;
      tableEl.removeAttribute('data-xy-unselectable-text');
      (tableEl as HTMLElement).style['user-select'] = '';

      unbindColumnResizeEvents();
    }

    function resizeTableCells(newColumnWidth: number, nextColumnWidth?: number) {
      if (!isClient) return;
      const colIndex = getIndex(resizeColumnElement.value!);
      const widths: number[] = [];
      const headers = find(tableRef.value, `.${prefixCls.value}-head > tr > th`);

      headers.forEach(header => widths.push(getOuterWidth(header)));

      destroyStyleElement();
      createStyleElement();

      let innerHTML = '';
      const selector = `.${prefixCls.value} > .${prefixCls.value}-table-container > .${prefixCls.value}-table`;

      widths.forEach((width, index) => {
        const colWidth =
          index === colIndex
            ? newColumnWidth
            : nextColumnWidth && index === colIndex + 1
              ? nextColumnWidth
              : width;
        const style = `width: ${colWidth}px !important; max-width: ${colWidth}px !important`;

        innerHTML += `
                    ${selector} > .${prefixCls.value}-head > tr > th:nth-child(${index + 1}),
                    ${selector} > .${prefixCls.value}-body > tr > td:nth-child(${index + 1}),
                    ${selector} > .${prefixCls.value}-foot > tr > td:nth-child(${index + 1}) {
                        ${style}
                    }
                `;
      });

      state.styleElement!.innerHTML = innerHTML;
    }

    function bindColumnResizeEvents() {
      if (!isClient) return;
      if (!documentColumnResizeListener.value) {
        const mouseMoveHandler = (event: MouseEvent) => {
          if (state.columnResizing) {
            onColumnResize(event);
          }
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        documentColumnResizeListener.value = () => {
          document.removeEventListener('mousemove', mouseMoveHandler);
        };
      }

      if (!documentColumnResizeEndListener.value) {
        const mouseUpHandler = () => {
          if (state.columnResizing) {
            state.columnResizing = false;
            onColumnResizeEnd();
          }
        };

        document.addEventListener('mouseup', mouseUpHandler);
        documentColumnResizeEndListener.value = () => {
          document.removeEventListener('mouseup', mouseUpHandler);
        };
      }
    }

    function unbindColumnResizeEvents() {
      if (documentColumnResizeListener.value) {
        documentColumnResizeListener.value();
        documentColumnResizeListener.value = null;
      }

      if (documentColumnResizeEndListener.value) {
        documentColumnResizeEndListener.value();
        documentColumnResizeEndListener.value = null;
      }
    }

    function hasColumnFilter() {
      if (columns.value) {
        for (const col of columns.value) {
          if (col.children && col.children.filter) {
            return true;
          }
        }
      }

      return false;
    }

    function createStyleElement() {
      if (!isClient) return;
      state.styleElement = document.createElement('style');
      state.styleElement.type = 'text/css';
      const nonce = (window as any)?.$xiaoyeUI?.config?.csp?.nonce;
      if (nonce) setAttribute(state.styleElement, 'nonce', nonce);
      document.head.appendChild(state.styleElement);
    }

    function destroyStyleElement() {
      if (!isClient) return;
      if (state.styleElement) {
        document.head.removeChild(state.styleElement);
        state.styleElement = null;
      }
    }

    function setTabindex(node: any, index: number) {
      if (isNodeSelected(node)) {
        state.hasASelectedNode = true;

        return 0;
      }

      if (props.selectionMode) {
        if (!isNodeSelected(node) && index === 0 && !state.hasASelectedNode) return 0;
      } else if (!props.selectionMode && index === 0) {
        return 0;
      }

      return -1;
    }

    onBeforeUnmount(() => {
      destroyStyleElement();
      d_columns.clear();
      unbindColumnResizeEvents();
    });

    expose({
      columns: computed(() => {
        const _slots = slots.default?.() || [];
        return d_columns.get(proxy, { default: () => _slots });
      }),
      d_columns,
    });

    const renderPagination = (position: 'top' | 'bottom') => {
      const current = d_rows > 0 ? Math.floor(d_first / d_rows) + 1 : 1;

      return (
        <Pagination
          total={totalRecordsLength.value}
          current={current}
          pageSize={d_rows}
          pageSizeOptions={props.rowsPerPageOptions}
          showSizeChanger={!!props.rowsPerPageOptions}
          hideOnSinglePage={!props.alwaysShowPagination}
          class={`${prefixCls.value}-pagination-${position}`}
          onChange={handlePageChange}
          onShowSizeChange={handlePageChange}
        />
      );
    };

    const renderHeaderCells = () => {
      return columns.value.map((col: any, i: number) => {
        if (columnProp(col, 'hidden')) return null;
        return (
          <HeaderCell
            key={columnProp(col, 'columnKey') || columnProp(col, 'field') || i}
            column={col}
            resizableColumns={props.resizableColumns}
            sortField={d_sortField}
            sortOrder={d_sortOrder}
            multiSortMeta={d_multiSortMeta}
            sortMode={props.sortMode}
            onColumnClick={onColumnHeaderClick}
            onColumnResizestart={onColumnResizeStart}
            index={i}
          />
        );
      });
    };

    const renderFilterRow = () => {
      if (!hasColumnFilter()) return null;
      return (
        <tr>
          {columns.value.map((col: any, i: number) => {
            if (columnProp(col, 'hidden')) return null;
            const filterTpl = col?.children?.filter;
            return (
              <th
                key={columnProp(col, 'columnKey') || columnProp(col, 'field') || i}
                class={getFilterColumnHeaderClass(col)}
                style={[columnProp(col, 'style'), columnProp(col, 'filterHeaderStyle')]}
                role="cell"
              >
                {filterTpl ? <filterTpl column={col} index={i} /> : null}
              </th>
            );
          })}
        </tr>
      );
    };

    const renderRows = () => {
      if (empty.value) {
        return (
          <tr class={`${prefixCls.value}-empty-message`}>
            <td colspan={columns.value.length}>{slots.empty?.()}</td>
          </tr>
        );
      }
      return dataToRender.value.map((node: any, index: number) => (
        <TreeTableRow
          key={nodeKey(node)}
          dataKey={props.dataKey}
          columns={columns.value}
          node={node}
          level={0}
          expandedKeys={d_expandedKeys}
          indentation={props.indentation}
          selectionMode={props.selectionMode}
          selectionKeys={props.selectionKeys}
          ariaSetSize={dataToRender.value.length}
          ariaPosInset={index + 1}
          tabindex={setTabindex(node, index)}
          loadingMode={props.loadingMode}
          contextMenu={props.contextMenu}
          contextMenuSelection={props.contextMenuSelection}
          templates={slots}
          onNodeToggle={onNodeToggle}
          onNodeClick={onNodeClick}
          onCheckboxChange={onCheckboxChange}
          onRowRightclick={onRowRightClick}
        />
      ));
    };

    const renderFooterRow = () => {
      if (!hasFooter.value) return null;
      return (
        <tr role="row">
          {columns.value.map((col: any, i: number) => {
            if (columnProp(col, 'hidden')) return null;
            return (
              <FooterCell
                key={columnProp(col, 'columnKey') || columnProp(col, 'field') || i}
                column={col}
                index={i}
              />
            );
          })}
        </tr>
      );
    };

    return () => {
      state.hasASelectedNode = false;

      const loadingMask =
        props.loading && props.loadingMode === 'mask' ? (
          <Transition name="xy-overlay-mask">
            <div class={`${prefixCls.value}-loading`}>
              <div class={`${prefixCls.value}-mask`}>
                {slots.loadingicon ? (
                  slots.loadingicon({ class: `${prefixCls.value}-loading-icon` })
                ) : props.loadingIcon ? (
                  <span class={[`${prefixCls.value}-loading-icon`, props.loadingIcon]} />
                ) : (
                  <SpinnerIcon spin class={`${prefixCls.value}-loading-icon`} />
                )}
              </div>
            </div>
          </Transition>
        ) : null;

      return (
        <div
          class={rootClasses.value}
          data-scrollselectors={`.${prefixCls.value}-table-container`}
          {...attrs}
        >
          {slots.default?.()}
          {loadingMask}
          {slots.header ? <div class={`${prefixCls.value}-header`}>{slots.header()}</div> : null}
          {paginationTop.value ? renderPagination('top') : null}
          <div
            class={`${prefixCls.value}-table-container`}
            style={{ maxHeight: props.scrollHeight }}
            {...props.tableProps}
          >
            <table
              ref={tableRef}
              role="treegrid"
              class={[tableClasses.value, props.tableClass]}
              style={props.tableStyle}
            >
              <thead class={`${prefixCls.value}-head`} role="rowgroup">
                <tr role="row">{renderHeaderCells()}</tr>
                {renderFilterRow()}
              </thead>
              <tbody class={`${prefixCls.value}-body`} role="rowgroup">
                {renderRows()}
              </tbody>
              {hasFooter.value ? (
                <tfoot class={`${prefixCls.value}-foot`} role="rowgroup">
                  {renderFooterRow()}
                </tfoot>
              ) : null}
            </table>
          </div>
          {paginationBottom.value ? renderPagination('bottom') : null}
          {slots.footer ? <div class={`${prefixCls.value}-footer`}>{slots.footer()}</div> : null}
          <div
            ref={resizeHelperRef}
            class={`${prefixCls.value}-column-resize-indicator`}
            style={{ display: 'none' }}
          />
        </div>
      );
    };
  },
});

export default TreeTable;
