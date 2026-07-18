/// <reference types="vue/jsx" />
import { computed, defineComponent } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';
import { inplaceDisplayProps } from './inplaceTypes';
import { useInplaceContext } from './Inplace';

export default defineComponent({
  name: 'XYInplaceDisplay',
  inheritAttrs: false,
  __XY_INPLACE_DISPLAY: true,
  props: initDefaultProps(inplaceDisplayProps(), {}),
  slots: Object as CustomSlotsType<{ default?: any }>,
  emits: ['click'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls } = useConfigInject('inplace', props);
    const ctx = useInplaceContext();

    // 在 XYInplace 内使用时，禁用状态跟随父组件
    const disabled = computed(() => ctx?.disabled.value ?? false);

    const trigger = (event: Event) => {
      if (ctx) {
        ctx.open(event);
      } else {
        emit('click', event);
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger(event);
      }
    };

    return () => (
      <div
        class={classNames(`${prefixCls.value}-display`, attrs.class as string, {
          [`${prefixCls.value}-display-disabled`]: disabled.value,
        })}
        tabindex={disabled.value ? -1 : 0}
        role="button"
        aria-disabled={disabled.value}
        {...attrs}
        onClick={trigger}
        onKeydown={handleKeydown}
      >
        {slots.default?.()}
      </div>
    );
  },
});
