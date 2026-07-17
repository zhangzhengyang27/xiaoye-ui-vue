/// <reference types="vue/jsx" />
import type { PropType, VNode } from 'vue';
import { computed, defineComponent } from 'vue';
import { ChevronDownIcon, ChevronUpIcon } from '@xiaoye-ui/icons';
import useConfigInject from '../config-provider/hooks/useConfigInject';

const TreeChartNode = defineComponent({
  name: 'XYTreeChartNode',
  inheritAttrs: false,
  __XY_TREE_CHART_NODE: true,
  props: {
    node: { type: Object as PropType<any>, default: null },
    templates: { type: Object as PropType<any>, default: null },
    collapsible: { type: Boolean, default: false },
    collapsedKeys: { type: Object as PropType<any>, default: null },
    selectionKeys: { type: Object as PropType<any>, default: null },
    selectionMode: { type: String as PropType<string | null>, default: null },
    onNodeClick: Function,
    onNodeToggle: Function,
  },
  emits: ['node-click', 'node-toggle'],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('treechart', props);

    const leaf = computed(() => {
      return props.node.leaf === false
        ? false
        : !(props.node.children && props.node.children.length);
    });

    const colspan = computed(() => {
      return props.node.children && props.node.children.length
        ? props.node.children.length * 2
        : null;
    });

    const expanded = computed(() => {
      return props.collapsedKeys[props.node.key] === undefined;
    });

    const childStyle = computed(() => {
      return {
        visibility: !leaf.value && expanded.value ? 'inherit' : 'hidden',
      } as const;
    });

    const selectable = computed(() => {
      return props.selectionMode && props.node.selectable !== false;
    });

    const selected = computed(() => {
      return (
        selectable.value && props.selectionKeys && props.selectionKeys[props.node.key] === true
      );
    });

    const toggleable = computed(() => {
      return props.collapsible && props.node.collapsible !== false && !leaf.value;
    });

    const nodeClasses = computed(() => {
      return [
        `${prefixCls.value}-node`,
        {
          [`${prefixCls.value}-node-selectable`]: selectable.value,
          [`${prefixCls.value}-node-selected`]: selected.value,
        },
      ];
    });

    function connectorLeftClasses(index: number) {
      return [
        `${prefixCls.value}-connector-left`,
        {
          [`${prefixCls.value}-connector-top`]: index !== 0,
        },
      ];
    }

    function connectorRightClasses(index: number) {
      return [
        `${prefixCls.value}-connector-right`,
        {
          [`${prefixCls.value}-connector-top`]: index !== props.node.children.length - 1,
        },
      ];
    }

    function onNodeClick(event: Event) {
      const target = event.target as Element;
      const toggleButtonSel = `.${prefixCls.value}-node-toggle-button`;
      const toggleButtonIconSel = `.${prefixCls.value}-node-toggle-button-icon`;

      if (
        target.closest &&
        (target.closest(toggleButtonSel) || target.closest(toggleButtonIconSel))
      ) {
        return;
      }

      if (props.selectionMode) {
        emit('node-click', props.node);
      }
    }

    function onChildNodeClick(node: any) {
      emit('node-click', node);
    }

    function toggleNode() {
      emit('node-toggle', props.node);
    }

    function onChildNodeToggle(node: any) {
      emit('node-toggle', node);
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') {
        toggleNode();
        event.preventDefault();
      }
    }

    expose({ toggleNode, onNodeClick, onChildNodeClick, onChildNodeToggle, onKeydown });

    return () => {
      if (!props.node) {
        return null;
      }

      const ToggleIconComp = props.templates?.toggleicon || props.templates?.togglericon;
      const toggleButtonVNode = toggleable.value ? (
        <a
          tabindex="0"
          class={`${prefixCls.value}-node-toggle-button`}
          onClick={toggleNode}
          onKeydown={onKeydown}
        >
          {ToggleIconComp ? (
            <ToggleIconComp
              expanded={expanded.value}
              class={`${prefixCls.value}-node-toggle-button-icon`}
            />
          ) : expanded.value ? (
            <ChevronDownIcon class={`${prefixCls.value}-node-toggle-button-icon`} />
          ) : (
            <ChevronUpIcon class={`${prefixCls.value}-node-toggle-button-icon`} />
          )}
        </a>
      ) : null;

      const NodeContentComp = props.templates?.[props.node.type] || props.templates?.default;
      const nodeContentVNode = (
        <div class={[nodeClasses.value, props.node.styleClass]} onClick={onNodeClick}>
          {NodeContentComp ? <NodeContentComp node={props.node} /> : null}
          {toggleButtonVNode}
        </div>
      );

      // Connectors row (top)
      const connectorsTopVNode = (
        <tr style={childStyle.value} class={`${prefixCls.value}-connectors`}>
          <td colspan={colspan.value} class={`${prefixCls.value}-line-cell`}>
            <div class={`${prefixCls.value}-connector-down`} />
          </td>
        </tr>
      );

      // Connectors row (middle with left/right)
      const connectorsMiddleVNode = (
        <tr style={childStyle.value} class={`${prefixCls.value}-connectors`}>
          {props.node.children && props.node.children.length === 1 ? (
            <td colspan={colspan.value} class={`${prefixCls.value}-line-cell`}>
              <div class={`${prefixCls.value}-connector-down`} />
            </td>
          ) : null}
          {props.node.children && props.node.children.length > 1
            ? props.node.children.map((child: any, i: number) => [
                <td key={`${child.key}_l`} class={connectorLeftClasses(i)}>
                  &nbsp;
                </td>,
                <td key={`${child.key}_r`} class={connectorRightClasses(i)}>
                  &nbsp;
                </td>,
              ])
            : null}
        </tr>
      );

      // Children row
      const childrenVNode =
        props.node.children && props.node.children.length ? (
          <tr style={childStyle.value} class={`${prefixCls.value}-node-children`}>
            {props.node.children.map((child: any) => (
              <td key={child.key} colspan={2} class={`${prefixCls.value}-node-cell`}>
                <TreeChartNode
                  node={child}
                  templates={props.templates}
                  collapsedKeys={props.collapsedKeys}
                  collapsible={props.collapsible}
                  selectionMode={props.selectionMode}
                  selectionKeys={props.selectionKeys}
                  onNodeToggle={onChildNodeToggle}
                  onNodeClick={onChildNodeClick}
                />
              </td>
            ))}
          </tr>
        ) : null;

      return (
        <table class={`${prefixCls.value}-table`}>
          <tbody>
            <tr class={`${prefixCls.value}-row`}>
              <td colspan={colspan.value} class={`${prefixCls.value}-cell`}>
                {nodeContentVNode}
              </td>
            </tr>
            {!leaf.value ? connectorsTopVNode : null}
            {!leaf.value ? connectorsMiddleVNode : null}
            {!leaf.value ? childrenVNode : null}
          </tbody>
        </table>
      ) as VNode;
    };
  },
});

export default TreeChartNode;
