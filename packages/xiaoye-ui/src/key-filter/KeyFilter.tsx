/// <reference types="vue/jsx" />
import { computed, defineComponent, ref } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { keyFilterProps } from './keyFilterTypes';
import { useKeyFilter } from './useKeyFilter';
import useStyle from './style';

export default defineComponent({
  name: 'XYKeyFilter',
  inheritAttrs: false,
  __XY_KEY_FILTER: true,
  props: initDefaultProps(keyFilterProps(), {}),
  setup(props, { slots, attrs }) {
    const { prefixCls } = useConfigInject('key-filter', props);
    const [, hashId] = useStyle(prefixCls);

    const containerRef = ref<HTMLElement>();

    // 查找内部 input/textarea 元素作为 keyfilter 目标
    const targetRef = computed<HTMLElement | null>(() => {
      const el = containerRef.value;
      if (!el) return null;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return el as HTMLElement;
      return (el.querySelector('input, textarea') as HTMLElement | null) || null;
    });

    useKeyFilter({
      target: targetRef,
      preset: computed(() => props.preset),
      pattern: computed(() => props.pattern),
      validateOnly: computed(() => props.validateOnly),
    });

    return () => (
      <div ref={containerRef} {...attrs} class={[prefixCls.value, hashId.value, attrs.class]}>
        {slots.default?.()}
      </div>
    );
  },
});
