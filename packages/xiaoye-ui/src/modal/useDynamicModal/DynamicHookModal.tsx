import type { Component, PropType } from 'vue';
import { computed, defineComponent, h } from 'vue';
import Modal from '../Modal';
import type { ModalProps } from '../Modal';
import initDefaultProps from '../../_util/props-util/initDefaultProps';

export interface DynamicHookModalProps {
  component: Component;
  componentProps: Record<string, any>;
  modalProps: ModalProps;
  open: boolean;
  afterClose: () => void;
  destroyAction: (...args: any[]) => void;
}

export interface DynamicHookModalRef {
  destroy: () => void;
}

const dynamicHookModalProps = () => ({
  component: { type: Object as PropType<Component>, required: true },
  componentProps: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
  modalProps: { type: Object as PropType<ModalProps>, default: () => ({}) },
  open: { type: Boolean, default: false },
  afterClose: { type: Function as PropType<() => void> },
  destroyAction: { type: Function as PropType<(...args: any[]) => void> },
});

export default defineComponent({
  name: 'XYDynamicHookModal',
  inheritAttrs: false,
  props: initDefaultProps(dynamicHookModalProps(), {
    componentProps: {},
    modalProps: {},
    open: false,
  }),
  setup(props: DynamicHookModalProps, { expose }) {
    const open = computed(() => props.open);

    const handleCancel = (e: MouseEvent) => {
      props.modalProps?.onCancel?.(e);
      props.destroyAction({ triggerCancel: true }, e);
    };

    const handleAfterClose = () => {
      props?.afterClose?.();
    };

    expose({
      destroy: () => props.destroyAction({ triggerCancel: true }),
    });

    return () => {
      const { component, componentProps, modalProps } = props;
      return (
        <Modal
          {...modalProps}
          open={open.value}
          onCancel={handleCancel}
          afterClose={handleAfterClose}
        >
          {h(component, componentProps)}
        </Modal>
      );
    };
  },
});
