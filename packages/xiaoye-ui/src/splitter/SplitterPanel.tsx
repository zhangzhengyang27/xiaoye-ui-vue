/// <reference types="vue/jsx" />
import { computed, defineComponent } from 'vue';
import { splitterPanelProps } from './splitterTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';
import { useSplitterPanelStyle as useStyle } from './style';

export default defineComponent({
  name: 'XYSplitterPanel',
  inheritAttrs: false,
  __XY_SPLITTER_PANEL: true,
  props: initDefaultProps(splitterPanelProps(), {}),
  slots: Object as CustomSlotsType<{
    default?: any;
  }>,
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('splitter-panel', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // 修复源项目 bug：硬编码 'Splitter' → 'XYSplitter'
    const isNested = computed(() => {
      const defaultSlot = slots.default?.();
      if (defaultSlot) {
        return defaultSlot.some((child: any) => child.type?.name === 'XYSplitter');
      }
      return false;
    });

    return () =>
      wrapSSR(
        <div
          {...attrs}
          class={[prefixCls.value, { [`${prefixCls.value}-nested`]: isNested.value }, hashId.value]}
        >
          {slots.default?.()}
        </div>,
      );
  },
});
