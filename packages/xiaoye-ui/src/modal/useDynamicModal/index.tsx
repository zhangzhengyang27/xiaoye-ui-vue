import type { Component } from 'vue';
import { defineComponent, shallowRef, watch } from 'vue';
import type { VueNode } from '../../_util/type';
import type { ModalProps } from '../Modal';
import DynamicHookModal from './DynamicHookModal';
import type { DynamicHookModalRef } from './DynamicHookModal';

export interface DynamicModalOptions {
  componentProps?: Record<string, any>;
  modalProps?: ModalProps;
}

export interface DynamicModalRef {
  destroy: () => void;
  update: (options: DynamicModalOptions) => void;
}

export interface DynamicModalInstance {
  open: (component: Component, options?: DynamicModalOptions) => DynamicModalRef;
}

interface ElementsHolderRef {
  addModal: (modal: () => VueNode) => () => void;
}

const ElementsHolder = defineComponent({
  name: 'ElementsHolder',
  inheritAttrs: false,
  setup(_, { expose }) {
    const modals = shallowRef<(() => VueNode)[]>([]);
    const addModal = (modal: () => VueNode) => {
      modals.value.push(modal);
      modals.value = modals.value.slice();
      return () => {
        modals.value = modals.value.filter(currentModal => currentModal !== modal);
      };
    };

    expose({ addModal });
    return () => {
      return modals.value.map(modal => modal());
    };
  },
});

let uuid = 0;

function useDynamicModal(): readonly [DynamicModalInstance, () => VueNode] {
  const holderRef = shallowRef<ElementsHolderRef>(null);
  // ========================== Effect ==========================
  const actionQueue = shallowRef<(() => void)[]>([]);
  watch(
    actionQueue,
    () => {
      if (actionQueue.value.length) {
        const cloneQueue = [...actionQueue.value];
        cloneQueue.forEach(action => {
          action();
        });
        actionQueue.value = [];
      }
    },
    {
      immediate: true,
    },
  );

  // =========================== Hook ===========================
  const open = (component: Component, options: DynamicModalOptions = {}): DynamicModalRef => {
    uuid += 1;
    const openRef = shallowRef(true);
    const modalRef = shallowRef<DynamicHookModalRef>(null);
    const optionsRef = shallowRef<DynamicModalOptions>({
      componentProps: {},
      modalProps: {},
      ...options,
    });

    const destroyAction = (..._args: any[]) => {
      openRef.value = false;
    };

    // eslint-disable-next-line prefer-const
    let closeFunc: (() => void) | undefined;
    const modal = () => (
      <DynamicHookModal
        key={`dynamic-modal-${uuid}`}
        ref={modalRef}
        component={component}
        componentProps={optionsRef.value.componentProps}
        modalProps={optionsRef.value.modalProps}
        open={openRef.value}
        destroyAction={destroyAction}
        afterClose={() => {
          closeFunc?.();
        }}
      />
    );

    closeFunc = holderRef.value?.addModal(modal);

    const updateAction = (newOptions: DynamicModalOptions) => {
      optionsRef.value = {
        ...optionsRef.value,
        ...newOptions,
      };
    };

    const destroy = () => {
      if (modalRef.value) {
        destroyAction();
      } else {
        actionQueue.value = [...actionQueue.value, destroyAction];
      }
    };

    const update = (newOptions: DynamicModalOptions) => {
      if (modalRef.value) {
        updateAction(newOptions);
      } else {
        actionQueue.value = [...actionQueue.value, () => updateAction(newOptions)];
      }
    };

    return {
      destroy,
      update,
    };
  };

  const instance: DynamicModalInstance = { open };
  const holderKey = Symbol('dynamicModalHolderKey');
  return [instance, () => <ElementsHolder key={holderKey} ref={holderRef} />] as const;
}

export default useDynamicModal;
