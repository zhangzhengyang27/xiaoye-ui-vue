/// <reference types="vue/jsx" />
import { defineComponent, nextTick, ref, watch, useSlots } from 'vue';
import TreeChartNode from './TreeChartNode';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import treeChartProps from './treeChartTypes';

interface VisibleNodeEntry {
  node: any;
  parent: any;
}

export default defineComponent({
  name: 'XYTreeChart',
  inheritAttrs: false,
  __XY_TREE_CHART: true,
  props: initDefaultProps(treeChartProps(), {}),
  emits: [
    'node-unselect',
    'node-select',
    'update:selectionKeys',
    'node-expand',
    'node-collapse',
    'update:collapsedKeys',
  ],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('treechart', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const slots = useSlots();

    const rootRef = ref<HTMLDivElement | null>(null);
    const d_collapsedKeys = ref(props.collapsedKeys || {});
    const focusedKey = ref<any>(null);

    watch(
      () => props.collapsedKeys,
      newValue => {
        d_collapsedKeys.value = newValue;
      },
    );

    // Initialize focused key to root node so the first treeitem is tabbable.
    watch(
      () => props.value,
      val => {
        if (val && focusedKey.value === null) {
          focusedKey.value = val.key;
        }
      },
      { immediate: true },
    );

    function onNodeClick(node: any) {
      const key = node.key;

      if (props.selectionMode) {
        let _selectionKeys = props.selectionKeys ? { ...props.selectionKeys } : {};

        if (_selectionKeys[key]) {
          delete _selectionKeys[key];
          emit('node-unselect', node);
        } else {
          if (props.selectionMode === 'single') {
            _selectionKeys = {};
          }

          _selectionKeys[key] = true;
          emit('node-select', node);
        }

        emit('update:selectionKeys', _selectionKeys);
      }
    }

    function onNodeToggle(node: any) {
      const key = node.key;

      if (d_collapsedKeys.value[key]) {
        delete d_collapsedKeys.value[key];
        emit('node-expand', node);
      } else {
        d_collapsedKeys.value[key] = true;
        emit('node-collapse', node);
      }

      d_collapsedKeys.value = { ...d_collapsedKeys.value };
      emit('update:collapsedKeys', d_collapsedKeys.value);
    }

    function setFocusedKey(key: any) {
      focusedKey.value = key;
    }

    // Depth-first traversal of all visible (non-collapsed) nodes.
    function getVisibleNodes(
      node: any,
      collapsedKeys: any,
      result: VisibleNodeEntry[] = [],
      parent: any = null,
    ): VisibleNodeEntry[] {
      if (!node) return result;
      result.push({ node, parent });
      const isCollapsed = collapsedKeys && collapsedKeys[node.key] !== undefined;
      if (!isCollapsed && node.children && node.children.length) {
        for (const child of node.children) {
          getVisibleNodes(child, collapsedKeys, result, node);
        }
      }
      return result;
    }

    function focusNodeByKey(key: any) {
      nextTick(() => {
        const selector = `[data-node-key="${String(key)}"]`;
        const el = rootRef.value?.querySelector(selector);
        if (el instanceof HTMLElement) {
          el.focus();
        }
      });
    }

    function isToggleButtonTarget(target: EventTarget | null): boolean {
      if (!target || !(target instanceof Element)) return false;
      const toggleButtonSel = `.${prefixCls.value}-node-toggle-button`;
      const toggleButtonIconSel = `.${prefixCls.value}-node-toggle-button-icon`;
      return !!(
        target.closest &&
        (target.closest(toggleButtonSel) || target.closest(toggleButtonIconSel))
      );
    }

    function onKeydown(event: KeyboardEvent) {
      if (!props.value) return;

      const visibleNodes = getVisibleNodes(props.value, d_collapsedKeys.value);
      const currentIndex = visibleNodes.findIndex(
        item => String(item.node.key) === String(focusedKey.value),
      );
      if (currentIndex === -1) return;

      const current = visibleNodes[currentIndex];
      const node = current.node;
      const isLeaf = !(node.children && node.children.length);
      const isExpanded = d_collapsedKeys.value[node.key] === undefined;
      const canToggle = props.collapsible && node.collapsible !== false;

      let handled = false;

      switch (event.key) {
        case 'ArrowDown': {
          const next = visibleNodes[currentIndex + 1];
          if (next) {
            focusedKey.value = next.node.key;
            focusNodeByKey(next.node.key);
            handled = true;
          }
          break;
        }
        case 'ArrowUp': {
          const prev = visibleNodes[currentIndex - 1];
          if (prev) {
            focusedKey.value = prev.node.key;
            focusNodeByKey(prev.node.key);
            handled = true;
          }
          break;
        }
        case 'ArrowLeft': {
          if (!isLeaf && isExpanded && canToggle) {
            d_collapsedKeys.value[node.key] = true;
            d_collapsedKeys.value = { ...d_collapsedKeys.value };
            emit('update:collapsedKeys', d_collapsedKeys.value);
            emit('node-collapse', node);
            handled = true;
          } else if (current.parent) {
            focusedKey.value = current.parent.key;
            focusNodeByKey(current.parent.key);
            handled = true;
          }
          break;
        }
        case 'ArrowRight': {
          if (!isLeaf && canToggle) {
            if (!isExpanded) {
              delete d_collapsedKeys.value[node.key];
              d_collapsedKeys.value = { ...d_collapsedKeys.value };
              emit('update:collapsedKeys', d_collapsedKeys.value);
              emit('node-expand', node);
              handled = true;
            } else {
              const firstChild = node.children[0];
              focusedKey.value = firstChild.key;
              focusNodeByKey(firstChild.key);
              handled = true;
            }
          }
          break;
        }
        case 'Enter':
        case ' ': {
          // Let the toggle button keep its own Enter/Space -> toggle behavior.
          if (isToggleButtonTarget(event.target)) return;
          if (props.selectionMode) {
            onNodeClick(node);
            handled = true;
          }
          break;
        }
        case 'Home': {
          const first = visibleNodes[0];
          if (first) {
            focusedKey.value = first.node.key;
            focusNodeByKey(first.node.key);
            handled = true;
          }
          break;
        }
        case 'End': {
          const last = visibleNodes[visibleNodes.length - 1];
          if (last) {
            focusedKey.value = last.node.key;
            focusNodeByKey(last.node.key);
            handled = true;
          }
          break;
        }
        default:
          break;
      }

      if (handled) {
        event.preventDefault();
      }
    }

    expose({ onNodeClick, onNodeToggle, d_collapsedKeys, value: props.value });

    return () =>
      wrapSSR(
        <div
          ref={rootRef}
          class={[prefixCls.value, hashId.value]}
          role="tree"
          aria-label={props.ariaLabel || '树形图'}
          onKeydown={onKeydown}
        >
          <TreeChartNode
            node={props.value}
            templates={slots}
            collapsedKeys={d_collapsedKeys.value}
            collapsible={props.collapsible}
            selectionMode={props.selectionMode}
            selectionKeys={props.selectionKeys}
            focusedKey={focusedKey.value}
            onFocusedKeyChange={setFocusedKey}
            onNodeToggle={onNodeToggle}
            onNodeClick={onNodeClick}
          />
        </div>,
      );
  },
});
