/// <reference types="vue/jsx" />
import { computed, defineComponent, ref } from 'vue';
import focusTrapProps from './focusTrapTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useFocusTrap, type FocusTrapOptions } from './useFocusTrap';
import useStyle from './style';

/**
 * FocusTrap 包裹组件
 *
 * 将焦点限制在子树内，Tab 键循环不会跳出边界。
 * - `disabled` 关闭陷阱
 * - `autoFocus` 自动聚焦首个可聚焦元素
 *
 * 注意：内部组件推荐直接使用 `useFocusTrap(ref, options)` composable。
 */
export default defineComponent({
  name: 'XYFocusTrap',
  inheritAttrs: false,
  __XY_FOCUS_TRAP: true,
  props: initDefaultProps(focusTrapProps(), {
    disabled: false,
    autoFocus: true,
    autoFocusSelector: '',
    firstFocusableSelector: '',
    lastFocusableSelector: '',
    tabIndex: 0,
  }),
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('focus-trap', props);
    const [wrapSSR] = useStyle(prefixCls);

    const containerRef = ref<HTMLElement | null>(null);
    const opts = computed<FocusTrapOptions>(
      () =>
        ({
          disabled: props.disabled,
          autoFocus: props.autoFocus,
          autoFocusSelector: props.autoFocusSelector,
          firstFocusableSelector: props.firstFocusableSelector,
          lastFocusableSelector: props.lastFocusableSelector,
          tabIndex: props.tabIndex,
          onFocusIn: props.onFocusIn as ((event: FocusEvent) => void) | undefined,
          onFocusOut: props.onFocusOut as ((event: FocusEvent) => void) | undefined,
        }) as FocusTrapOptions,
    );
    useFocusTrap(containerRef, opts);

    return () =>
      wrapSSR(
        <div ref={containerRef} class={prefixCls.value}>
          {slots.default?.()}
        </div>,
      );
  },
});
