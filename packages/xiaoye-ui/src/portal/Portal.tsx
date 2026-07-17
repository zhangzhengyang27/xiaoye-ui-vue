/// <reference types="vue/jsx" />
import { computed, defineComponent, onMounted, ref, Teleport } from 'vue';
import portalProps from './portalTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';

// SSR 安全的 isClient 判断，避免依赖 utils 包函数版（占位符是常量，methods 版本是函数）
const isClient = typeof window !== 'undefined' && !!window.document;

export default defineComponent({
  name: 'XYPortal',
  inheritAttrs: false,
  __XY_PORTAL: true,
  props: initDefaultProps(portalProps(), {
    appendTo: 'body',
    disabled: false,
  }),
  setup(props, { slots }) {
    const mounted = ref(false);

    const { prefixCls } = useConfigInject('portal', props);
    const [wrapSSR] = useStyle(prefixCls);

    const isInline = computed(() => props.disabled || props.appendTo === 'self');

    onMounted(() => {
      mounted.value = isClient;
    });

    return () => {
      if (isInline.value) {
        return wrapSSR(slots.default?.());
      }

      if (!mounted.value) {
        return null;
      }

      return wrapSSR(<Teleport to={props.appendTo as string}>{slots.default?.()}</Teleport>);
    };
  },
});
