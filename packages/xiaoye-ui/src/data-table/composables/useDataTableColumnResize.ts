import {
  addStyle,
  find,
  getIndex,
  getOffset,
  getOuterWidth,
  isRTL,
  setAttribute,
} from '@xiaoye-ui/utils/dom';
import type { DataTableContext } from './types';

export function useDataTableColumnResize(ctx: DataTableContext) {
  const {
    props,
    emit,
    instance,
    proxy,
    table,
    bodyRef,
    frozenBodyRef,
    resizeHelper,
    columnResizing,
    virtualScrollerDisabled,
  } = ctx;

  // Non-reactive instance properties
  let documentColumnResizeListener: ((event: MouseEvent) => void) | null = null;
  let documentColumnResizeEndListener: (() => void) | null = null;
  let lastResizeHelperX: number | null = null;
  let resizeColumnElement: HTMLElement | null = null;
  let styleElement: HTMLStyleElement | null = null;

  function onColumnResizeStart(event: any) {
    const containerLeft = getOffset(proxy.$el).left;
    const target = event.target;

    if (!target) return;

    resizeColumnElement = target.parentElement;
    columnResizing.value = true;
    lastResizeHelperX = event.pageX - containerLeft + proxy.$el.scrollLeft;

    bindColumnResizeEvents();
  }

  function onColumnResize(event: MouseEvent) {
    const helper = resizeHelper.value as HTMLDivElement | null;

    if (!helper) {
      return;
    }

    helper.style.height = proxy.$el.offsetHeight + 'px';
    helper.style.top = 0 + 'px';

    if (!columnResizing.value || !resizeColumnElement || typeof event.pageX !== 'number') {
      return;
    }

    const containerLeft = getOffset(proxy.$el).left;

    proxy.$el.setAttribute('data-xy-unselectable-text', 'true');
    addStyle(proxy.$el, { 'user-select': 'none' });
    helper.style.left = event.pageX - containerLeft + proxy.$el.scrollLeft + 'px';

    helper.style.display = 'block';
  }

  function onColumnResizeEnd() {
    if (!resizeHelper.value || !resizeColumnElement || lastResizeHelperX == null) return;

    const delta = isRTL(proxy.$el)
      ? lastResizeHelperX - resizeHelper.value.offsetLeft
      : resizeHelper.value.offsetLeft - lastResizeHelperX;
    const columnWidth = resizeColumnElement.offsetWidth;
    const newColumnWidth = columnWidth + delta;
    const minWidth = resizeColumnElement.style.minWidth || 15;

    if (columnWidth + delta > parseInt(String(minWidth), 10)) {
      if (props.columnResizeMode === 'fit') {
        const nextColumn = resizeColumnElement.nextElementSibling as HTMLElement;
        const nextColumnWidth = nextColumn.offsetWidth - delta;

        if (newColumnWidth > 15 && nextColumnWidth > 15) {
          resizeTableCells(newColumnWidth, nextColumnWidth);
        }
      } else if (props.columnResizeMode === 'expand') {
        const tableWidth = (table.value as HTMLTableElement).offsetWidth + delta + 'px';

        const updateTableWidth = (el: HTMLElement | null) => {
          !!el && (el.style.width = el.style.minWidth = tableWidth);
        };

        // Reasoning: resize table cells before updating the table width so that it can use existing computed cell widths and adjust only the one column.
        resizeTableCells(newColumnWidth);
        updateTableWidth(table.value);

        if (!virtualScrollerDisabled.value) {
          const body = bodyRef.value && bodyRef.value.$el;
          const frozenBody = frozenBodyRef.value && frozenBodyRef.value.$el;

          updateTableWidth(body);
          updateTableWidth(frozenBody);
        }
      }

      emit('column-resize-end', {
        element: resizeColumnElement,
        delta,
      });
    }

    resizeHelper.value.style.display = 'none';
    resizeColumnElement = null;
    proxy.$el.removeAttribute('data-xy-unselectable-text');
    proxy.$el.style['user-select'] = '';

    unbindColumnResizeEvents();

    if (ctx.isStateful()) {
      ctx.saveState();
    }
  }

  function resizeTableCells(newColumnWidth: number, nextColumnWidth?: number) {
    const colIndex = getIndex(resizeColumnElement as HTMLElement);
    const widths: number[] = [];
    const headers = find(table.value, 'thead.xy-data-table-head > tr > th');

    headers.forEach((header: HTMLElement) => widths.push(getOuterWidth(header)));

    destroyStyleElement();
    createStyleElement();

    let innerHTML = '';
    const selector = `.xy-data-table > .xy-data-table-table-container ${virtualScrollerDisabled.value ? '' : '> .xy-virtualscroller'} > table.xy-data-table-table`;

    widths.forEach((width, index) => {
      const colWidth =
        index === colIndex
          ? newColumnWidth
          : nextColumnWidth && index === colIndex + 1
            ? nextColumnWidth
            : width;
      const style = `width: ${colWidth}px !important; max-width: ${colWidth}px !important`;

      innerHTML += `
                    ${selector} > thead.xy-data-table-head > tr > th:nth-child(${index + 1}),
                    ${selector} > tbody.xy-data-table-body > tr > td:nth-child(${index + 1}),
                    ${selector} > tfoot.xy-data-table-foot > tr > td:nth-child(${index + 1}) {
                        ${style}
                    }
                `;
    });

    (styleElement as HTMLStyleElement).innerHTML = innerHTML;
  }

  function bindColumnResizeEvents() {
    if (!documentColumnResizeListener) {
      documentColumnResizeListener = (event: MouseEvent) => {
        if (columnResizing.value) {
          onColumnResize(event);
        }
      };

      document.addEventListener('mousemove', documentColumnResizeListener);
    }

    if (!documentColumnResizeEndListener) {
      documentColumnResizeEndListener = () => {
        if (columnResizing.value) {
          columnResizing.value = false;
          onColumnResizeEnd();
        }
      };

      document.addEventListener('mouseup', documentColumnResizeEndListener);
    }
  }

  function unbindColumnResizeEvents() {
    if (documentColumnResizeListener) {
      document.removeEventListener('mousemove', documentColumnResizeListener);
      documentColumnResizeListener = null;
    }

    if (documentColumnResizeEndListener) {
      document.removeEventListener('mouseup', documentColumnResizeEndListener);
      documentColumnResizeEndListener = null;
    }
  }

  function createStyleElement(): HTMLStyleElement {
    if (styleElement) return styleElement;
    styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    setAttribute(
      styleElement,
      'nonce',
      instance.appContext.config.globalProperties.$xiaoyeUI?.config?.csp?.nonce,
    );
    document.head.appendChild(styleElement);
    return styleElement;
  }

  function destroyStyleElement() {
    if (styleElement) {
      document.head.removeChild(styleElement);
      styleElement = null;
    }
  }

  return {
    onColumnResizeStart,
    onColumnResize,
    onColumnResizeEnd,
    resizeTableCells,
    bindColumnResizeEvents,
    unbindColumnResizeEvents,
    createStyleElement,
    destroyStyleElement,
  };
}
