/// <reference types="vue/jsx" />
import { defineComponent, ref, watch, useSlots } from 'vue';
import TreeChartNode from './TreeChartNode';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import treeChartProps from './treeChartTypes';

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

    const d_collapsedKeys = ref(props.collapsedKeys || {});

    watch(
      () => props.collapsedKeys,
      newValue => {
        d_collapsedKeys.value = newValue;
      },
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

    expose({ onNodeClick, onNodeToggle, d_collapsedKeys, value: props.value });

    return () =>
      wrapSSR(
        <div class={[prefixCls.value, hashId.value]}>
          <TreeChartNode
            node={props.value}
            templates={slots}
            collapsedKeys={d_collapsedKeys.value}
            collapsible={props.collapsible}
            selectionMode={props.selectionMode}
            selectionKeys={props.selectionKeys}
            onNodeToggle={onNodeToggle}
            onNodeClick={onNodeClick}
          />
        </div>,
      );
  },
});
