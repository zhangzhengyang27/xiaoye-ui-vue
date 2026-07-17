/// <reference types="vue/jsx" />
import { defineComponent } from 'vue';
import toolbarProps from './toolbarTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';
import useStyle from './style';

export default defineComponent({
  name: 'XYToolbar',
  inheritAttrs: false,
  __XY_TOOLBAR: true,
  props: initDefaultProps(toolbarProps(), {}),
  slots: Object as CustomSlotsType<{
    start?: any;
    center?: any;
    end?: any;
  }>,
  setup(props, { slots }) {
    const { prefixCls } = useConfigInject('toolbar', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    return () =>
      wrapSSR(
        <div
          class={[prefixCls.value, hashId.value]}
          role="toolbar"
          aria-labelledby={props.ariaLabelledby}
        >
          <div class={[`${prefixCls.value}-group`, `${prefixCls.value}-group-start`]}>
            {slots.start?.()}
          </div>
          <div class={[`${prefixCls.value}-group`, `${prefixCls.value}-group-center`]}>
            {slots.center?.()}
          </div>
          <div class={[`${prefixCls.value}-group`, `${prefixCls.value}-group-end`]}>
            {slots.end?.()}
          </div>
        </div>,
      );
  },
});
