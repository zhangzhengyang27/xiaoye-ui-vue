/// <reference types="vue/jsx" />
import { defineComponent } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { CloseOutlined } from '@xiaoye-ui/icons';
import type { CustomSlotsType } from '../_util/type';
import { inplaceContentProps } from './inplaceTypes';
import { useInplaceContext } from './Inplace';

export default defineComponent({
  name: 'XYInplaceContent',
  inheritAttrs: false,
  __XY_INPLACE_CONTENT: true,
  props: initDefaultProps(inplaceContentProps(), { closable: true }),
  slots: Object as CustomSlotsType<{ default?: any }>,
  emits: ['close'],
  setup(props, { slots, attrs, emit }) {
    const { prefixCls } = useConfigInject('inplace', props);
    const ctx = useInplaceContext();

    // 关闭按钮：在 XYInplace 内自动调用父组件 close，否则 emit close 事件
    const handleClose = (event: Event) => {
      if (ctx) {
        ctx.close(event);
      } else {
        emit('close', event);
      }
    };

    return () => (
      <div class={classNames(`${prefixCls.value}-content`, attrs.class as string)} {...attrs}>
        <div class={`${prefixCls.value}-content-inner`}>{slots.default?.()}</div>
        {props.closable ? (
          <button
            type="button"
            class={`${prefixCls.value}-close`}
            aria-label="关闭"
            onClick={handleClose}
          >
            <CloseOutlined />
          </button>
        ) : null}
      </div>
    );
  },
});
