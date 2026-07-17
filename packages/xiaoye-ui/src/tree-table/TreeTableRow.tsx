/// <reference types="vue/jsx" />
import { computed, defineComponent, nextTick, ref } from 'vue';
import { find, findSingle, focus, getAttribute, isClickable } from '@xiaoye-ui/utils/dom';
import { equals, resolveFieldData } from '@xiaoye-ui/utils/object';
import { getVNodeProp } from '@xiaoye-ui/core/utils';
import BodyCell from './BodyCell';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import { treeTableRowProps } from './treeTableTypes';

// 修复递归引用：将组件赋值给变量，setup 内部渲染函数才能引用 TreeTableRow 自身
const TreeTableRow = defineComponent({
  name: 'XYTreeTableRow',
  inheritAttrs: false,
  props: initDefaultProps(treeTableRowProps(), {}),
  emits: ['nodeClick', 'nodeToggle', 'checkboxChange', 'rowRightclick'],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('tree-table', props);

    const nodeRef = ref<HTMLElement | null>(null);
    let nodeTouched = false;

    function nodeKey(node: any) {
      return resolveFieldData(node, props.dataKey);
    }

    const selected = computed(() => {
      return props.selectionMode && props.selectionKeys
        ? props.selectionKeys[nodeKey(props.node)] === true
        : false;
    });

    const isSelectedWithContextMenu = computed(() => {
      if (props.node && props.contextMenuSelection) {
        // 修复类型：equals 第三个参数要求 string，但 dataKey 可能是 function，运行时只用 string
        const dataKeyStr = typeof props.dataKey === 'string' ? props.dataKey : undefined;
        return equals(props.node, props.contextMenuSelection, dataKeyStr);
      }
      return false;
    });

    const containerClass = computed(() => {
      return [
        props.node?.styleClass,
        `${prefixCls.value}-row`,
        {
          [`${prefixCls.value}-row-selectable`]:
            props.selectionMode === 'single' || props.selectionMode === 'multiple',
          [`${prefixCls.value}-row-selected`]: selected.value,
          [`${prefixCls.value}-row-contextmenu-selected`]:
            props.contextMenuSelection && isSelectedWithContextMenu.value,
        },
      ];
    });

    const expanded = computed(() => {
      return props.expandedKeys && props.expandedKeys[nodeKey(props.node)] === true;
    });

    const leaf = computed(() => {
      return props.node?.leaf === false
        ? false
        : !(props.node?.children && props.node?.children.length);
    });

    const checked = computed(() => {
      return props.selectionKeys
        ? props.selectionKeys[nodeKey(props.node)] &&
            props.selectionKeys[nodeKey(props.node)].checked
        : false;
    });

    const partialChecked = computed(() => {
      return props.selectionKeys
        ? props.selectionKeys[nodeKey(props.node)] &&
            props.selectionKeys[nodeKey(props.node)].partialChecked
        : false;
    });

    const getAriaSelected = computed(() => {
      return props.selectionMode === 'single' || props.selectionMode === 'multiple'
        ? selected.value
        : null;
    });

    function columnProp(col: any, prop: string) {
      // 修复：使用 getVNodeProp 正确处理 boolean 类型属性（如 hidden）
      return getVNodeProp(col, prop);
    }

    function toggle() {
      emit('nodeToggle', props.node);
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;

      if (
        !target ||
        isClickable(target) ||
        target.classList?.contains?.(`${prefixCls.value}-node-toggle-button`) ||
        target.classList?.contains?.(`${prefixCls.value}-node-toggle-icon`) ||
        target.tagName === 'path'
      ) {
        return;
      }

      setTabIndexForSelectionMode(event, nodeTouched);

      emit('nodeClick', {
        originalEvent: event,
        nodeTouched,
        node: props.node,
      });
      nodeTouched = false;
    }

    function onRowRightClick(event: MouseEvent) {
      emit('rowRightclick', {
        originalEvent: event,
        node: props.node,
      });
    }

    function onTouchEnd() {
      nodeTouched = true;
    }

    function onKeyDown(event: KeyboardEvent) {
      switch (event.code) {
        case 'ArrowDown':
          onArrowDownKey(event);
          break;

        case 'ArrowUp':
          onArrowUpKey(event);
          break;

        case 'ArrowLeft':
          onArrowLeftKey(event);
          break;

        case 'ArrowRight':
          onArrowRightKey(event);
          break;

        case 'Home':
          onHomeKey(event);
          break;

        case 'End':
          onEndKey(event);
          break;

        case 'Enter':
        case 'NumpadEnter':
        case 'Space':
          if (!isClickable(event.target as HTMLElement)) {
            onEnterKey(event);
          }
          break;

        case 'Tab':
          onTabKey();
          break;

        default:
          break;
      }
    }

    function onArrowDownKey(event: KeyboardEvent) {
      const nextElementSibling = (event.currentTarget as HTMLElement).nextElementSibling;

      nextElementSibling &&
        focusRowChange(event.currentTarget as HTMLElement, nextElementSibling as HTMLElement);

      event.preventDefault();
    }

    function onArrowUpKey(event: KeyboardEvent) {
      const previousElementSibling = (event.currentTarget as HTMLElement).previousElementSibling;

      previousElementSibling &&
        focusRowChange(event.currentTarget as HTMLElement, previousElementSibling as HTMLElement);

      event.preventDefault();
    }

    function onArrowRightKey(event: KeyboardEvent) {
      if (!nodeRef.value) return;

      // 修复类型：findSingle 返回 Element | null，断言为 HTMLElement | null 以访问 style/click
      const button = findSingle(nodeRef.value, 'button') as HTMLElement | null;
      const ishiddenIcon = button?.style.visibility === 'hidden';
      const togglerElement = findSingle(
        nodeRef.value,
        `.${prefixCls.value}-node-toggle-button`,
      ) as HTMLElement | null;

      if (ishiddenIcon) return;

      if (!expanded.value && togglerElement) togglerElement.click();

      nextTick(() => {
        onArrowDownKey(event);
      });

      event.preventDefault();
    }

    function onArrowLeftKey(event: KeyboardEvent) {
      if (!nodeRef.value) return;

      if (props.level === 0 && !expanded.value) {
        return;
      }

      const currentTarget = event.currentTarget as HTMLElement;
      // 修复类型：findSingle 返回 Element | null，断言为 HTMLElement | null
      const button = findSingle(currentTarget, 'button') as HTMLElement | null;
      const ishiddenIcon = button?.style.visibility === 'hidden';
      const togglerElement = findSingle(
        currentTarget,
        `.${prefixCls.value}-node-toggle-button`,
      ) as HTMLElement | null;

      if (expanded.value && !ishiddenIcon) {
        togglerElement?.click();
        return;
      }

      const target = findBeforeClickableNode(currentTarget);

      target && focusRowChange(currentTarget, target);
    }

    function onHomeKey(event: KeyboardEvent) {
      const currentTarget = event.currentTarget as HTMLElement;
      const parentElement = currentTarget.parentElement as HTMLElement | null;

      if (!parentElement) return;

      // 修复类型：findSingle 返回 Element | null，断言为 HTMLElement | null
      const findFirstElement = findSingle(
        parentElement,
        `tr[aria-level="${props.level + 1}"]`,
      ) as HTMLElement | null;

      findFirstElement && focus(findFirstElement);

      event.preventDefault();
    }

    function onEndKey(event: KeyboardEvent) {
      const currentTarget = event.currentTarget as HTMLElement;
      const parentElement = currentTarget.parentElement as HTMLElement | null;

      if (!parentElement) return;

      // 修复类型：find 返回 Element[]，断言为 HTMLElement[] 以访问 tabIndex、传给 focus
      const nodes = find(parentElement, `tr[aria-level="${props.level + 1}"]`) as HTMLElement[];
      const findFirstElement = nodes[nodes.length - 1];

      findFirstElement && focus(findFirstElement);

      event.preventDefault();
    }

    function onEnterKey(event: KeyboardEvent) {
      event.preventDefault();
      setTabIndexForSelectionMode(event, nodeTouched);

      if (props.selectionMode === 'checkbox') {
        toggleCheckbox();
        return;
      }

      emit('nodeClick', {
        originalEvent: event,
        nodeTouched,
        node: props.node,
      });

      nodeTouched = false;
    }

    function onTabKey() {
      if (!nodeRef.value) return;

      const parentElement = nodeRef.value.parentElement as HTMLElement | null;

      if (!parentElement) return;

      // 修复类型：find 返回 Element[]，断言为 HTMLElement[] 以访问 tabIndex
      const rows = [...find(parentElement, 'tr')] as HTMLElement[];

      if (!rows.length) return;

      const hasSelectedRow = rows.some(
        row => getAttribute(row, 'data-xy-selected') || row.getAttribute('aria-checked') === 'true',
      );

      rows.forEach(row => {
        row.tabIndex = -1;
      });

      if (hasSelectedRow) {
        const selectedNodes = rows.filter(
          node =>
            getAttribute(node, 'data-xy-selected') || node.getAttribute('aria-checked') === 'true',
        );

        selectedNodes[0] && (selectedNodes[0].tabIndex = 0);
        return;
      }

      rows[0].tabIndex = 0;
    }

    function focusRowChange(firstFocusableRow: HTMLElement, currentFocusedRow: HTMLElement) {
      firstFocusableRow.tabIndex = -1;
      currentFocusedRow.tabIndex = 0;
      focus(currentFocusedRow);
    }

    function findBeforeClickableNode(node: HTMLElement): HTMLElement | null {
      const prevNode = node.previousElementSibling as HTMLElement;

      if (prevNode) {
        const prevNodeButton = prevNode.querySelector('button');

        if (prevNodeButton && prevNodeButton.style.visibility !== 'hidden') {
          return prevNode;
        }

        return findBeforeClickableNode(prevNode);
      }

      return null;
    }

    function toggleCheckbox() {
      const _selectionKeys = props.selectionKeys ? { ...props.selectionKeys } : {};
      const _check = !checked.value;

      propagateDown(props.node, _check, _selectionKeys);

      emit('checkboxChange', {
        node: props.node,
        check: _check,
        selectionKeys: _selectionKeys,
      });
    }

    function propagateDown(node: any, check: boolean, selectionKeys: Record<string, any>) {
      if (check) selectionKeys[nodeKey(node)] = { checked: true, partialChecked: false };
      else delete selectionKeys[nodeKey(node)];

      if (node.children && node.children.length) {
        for (const child of node.children) {
          propagateDown(child, check, selectionKeys);
        }
      }
    }

    // 修复源项目 bug：onCheckboxChange 与 propagateUp 实现完全重复，删除 onCheckboxChange，
    // 递归子组件直接复用 propagateUp。
    function propagateUp(event: { check: boolean; selectionKeys: Record<string, any>; node: any }) {
      const check = event.check;
      const _selectionKeys = { ...event.selectionKeys };
      let checkedChildCount = 0;
      let childPartialSelected = false;

      for (const child of props.node.children) {
        if (_selectionKeys[nodeKey(child)] && _selectionKeys[nodeKey(child)].checked)
          checkedChildCount++;
        else if (_selectionKeys[nodeKey(child)] && _selectionKeys[nodeKey(child)].partialChecked)
          childPartialSelected = true;
      }

      if (check && checkedChildCount === props.node.children.length) {
        _selectionKeys[nodeKey(props.node)] = { checked: true, partialChecked: false };
      } else {
        if (!check) {
          delete _selectionKeys[nodeKey(props.node)];
        }

        if (
          childPartialSelected ||
          (checkedChildCount > 0 && checkedChildCount !== props.node.children.length)
        )
          _selectionKeys[nodeKey(props.node)] = { checked: false, partialChecked: true };
        else _selectionKeys[nodeKey(props.node)] = { checked: false, partialChecked: false };
      }

      emit('checkboxChange', {
        node: event.node,
        check: event.check,
        selectionKeys: _selectionKeys,
      });
    }

    function setTabIndexForSelectionMode(event: MouseEvent | KeyboardEvent, nodeTouched: boolean) {
      if (props.selectionMode !== null && nodeRef.value) {
        const parentElement = nodeRef.value.parentElement as HTMLElement | null;

        if (!parentElement) return;

        // 修复类型：find 返回 Element[]，断言为 HTMLElement[] 以访问 tabIndex
        const elements = [...find(parentElement, 'tr')] as HTMLElement[];

        (event.currentTarget as HTMLElement).tabIndex = nodeTouched === false ? -1 : 0;

        if (elements.length && elements.every(element => element.tabIndex === -1)) {
          elements[0].tabIndex = 0;
        }
      }
    }

    expose({
      node: props.node,
      selected,
      checked,
      leaf,
      toggleCheckbox,
      propagateUp,
    });

    return () => {
      const cells = (props.columns || []).map((col: any, i: number) => {
        if (columnProp(col, 'hidden')) return null;
        return (
          <BodyCell
            key={columnProp(col, 'columnKey') || columnProp(col, 'field') || i}
            column={col}
            node={props.node}
            level={props.level}
            leaf={leaf.value}
            indentation={props.indentation}
            expanded={expanded.value}
            selectionMode={props.selectionMode}
            checked={checked.value}
            partialChecked={partialChecked.value}
            templates={props.templates}
            index={i}
            loadingMode={props.loadingMode}
            onNodeToggle={toggle}
            onCheckboxToggle={toggleCheckbox}
          />
        );
      });

      return (
        <>
          <tr
            ref={nodeRef}
            class={containerClass.value}
            style={props.node?.style}
            tabindex={props.tabindex}
            role="row"
            aria-expanded={
              props.node?.children && props.node?.children.length ? expanded.value : undefined
            }
            aria-level={props.level + 1}
            aria-setsize={props.ariaSetSize}
            aria-posinset={props.ariaPosInset}
            aria-selected={getAriaSelected.value}
            aria-checked={checked.value || undefined}
            onClick={onClick}
            onKeydown={onKeyDown}
            onTouchend={onTouchEnd}
            onContextmenu={onRowRightClick}
            data-xy-selected={selected.value}
            data-xy-selected-contextmenu={
              props.contextMenuSelection && isSelectedWithContextMenu.value
            }
          >
            {cells}
          </tr>
          {expanded.value && props.node?.children && props.node?.children.length
            ? props.node.children.map((childNode: any) => (
                <TreeTableRow
                  key={nodeKey(childNode)}
                  dataKey={props.dataKey}
                  columns={props.columns}
                  node={childNode}
                  parentNode={props.node}
                  level={props.level + 1}
                  expandedKeys={props.expandedKeys}
                  selectionMode={props.selectionMode}
                  selectionKeys={props.selectionKeys}
                  contextMenu={props.contextMenu}
                  contextMenuSelection={props.contextMenuSelection}
                  indentation={props.indentation}
                  ariaPosInset={props.node.children.indexOf(childNode) + 1}
                  ariaSetSize={props.node.children.length}
                  templates={props.templates}
                  onNodeToggle={(e: any) => emit('nodeToggle', e)}
                  onNodeClick={(e: any) => emit('nodeClick', e)}
                  onRowRightclick={(e: any) => emit('rowRightclick', e)}
                  onCheckboxChange={propagateUp}
                />
              ))
            : null}
        </>
      );
    };
  },
});

export default TreeTableRow;
