/// <reference types="vue/jsx" />
import { computed, defineComponent, ref } from 'vue';
import rippleProps from './rippleTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useRipple } from './useRipple';
import useStyle from './style';

/**
 * Ripple 包裹组件
 *
 * 业务侧使用：通过 `<xy-ripple>` 包裹任意元素，会渲染一个 span 作为涟漪宿主。
 * - `disabled` prop 或 ConfigProvider 的 `ripple: false` 可关闭效果
 *
 * 注意：内部组件推荐直接使用 `useRipple(ref)` composable，可避免额外的 DOM 层级。
 */
export default defineComponent({
  name: 'XYRipple',
  inheritAttrs: false,
  __XY_RIPPLE: true,
  props: initDefaultProps(rippleProps(), {
    disabled: false,
  }),
  setup(props, { slots }) {
    const { prefixCls, ripple } = useConfigInject('ripple', props);
    const [wrapSSR] = useStyle(prefixCls);

    const containerRef = ref<HTMLElement | null>(null);
    const enabled = computed(() => !props.disabled && ripple.value);
    useRipple(containerRef, enabled);

    return () =>
      wrapSSR(
        <span ref={containerRef} class={prefixCls.value}>
          {slots.default?.()}
        </span>,
      );
  },
});
