/// <reference types="vue/jsx" />
import type { ComputedRef, InjectionKey } from 'vue';
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue';
import { initDefaultProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { CloseOutlined } from '@xiaoye-ui/icons';
import type { CustomSlotsType } from '../_util/type';
import { inplaceProps } from './inplaceTypes';
import type { DisplayToggleCallback } from './inplaceTypes';
import useStyle from './style';

// SSR 安全判断
const isClient = typeof window !== 'undefined' && !!window.document;

// 子组件上下文：供 XYInplaceDisplay / XYInplaceContent 与父组件通信
export interface InplaceContextValue {
  prefixCls: ComputedRef<string>;
  active: ComputedRef<boolean>;
  disabled: ComputedRef<boolean>;
  closable: ComputedRef<boolean>;
  open: (event?: Event) => void;
  close: (event?: Event) => void;
}

export const InplaceContextKey: InjectionKey<InplaceContextValue> = Symbol('InplaceContext');

export default defineComponent({
  name: 'XYInplace',
  inheritAttrs: false,
  __XY_INPLACE: true,
  props: initDefaultProps(inplaceProps(), {
    active: false,
    disabled: false,
    closable: true,
  }),
  emits: ['open', 'close', 'update:active'],
  slots: Object as CustomSlotsType<{
    display?: any;
    content?: (scope: { closeCallback: (event?: Event) => void }) => any;
  }>,
  setup(props, { slots, emit, expose, attrs }) {
    const { prefixCls, direction } = useConfigInject('inplace', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // 内部激活状态：与 props.active 双向同步
    const d_active = ref(props.active);
    const rootRef = ref<HTMLElement | null>(null);
    const displayRef = ref<HTMLElement | null>(null);

    watch(
      () => props.active,
      val => {
        d_active.value = val;
      },
    );

    // 进入编辑模式
    function open(event?: Event) {
      if (props.disabled || d_active.value) return;
      const cb = props.displayToggleCallback as DisplayToggleCallback | undefined;
      if (cb && cb(event) === false) return;
      d_active.value = true;
      emit('open', event);
      emit('update:active', true);
    }

    // 退出编辑模式
    function close(event?: Event) {
      if (!d_active.value) return;
      d_active.value = false;
      emit('close', event);
      emit('update:active', false);
      // 关闭后将焦点还原到展示区，便于键盘连续操作
      if (isClient) {
        setTimeout(() => {
          displayRef.value?.focus();
        }, 0);
      }
    }

    // 外部点击关闭：点击发生在组件根节点之外时退出编辑模式
    function handleDocumentMouseDown(event: MouseEvent) {
      if (!d_active.value) return;
      const target = event.target as Node | null;
      if (rootRef.value && target && !rootRef.value.contains(target)) {
        close(event);
      }
    }

    // Esc 键关闭
    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && d_active.value) {
        close(event);
      }
    }

    onMounted(() => {
      if (!isClient) return;
      document.addEventListener('mousedown', handleDocumentMouseDown);
      document.addEventListener('keydown', handleDocumentKeyDown);
    });

    onBeforeUnmount(() => {
      if (!isClient) return;
      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleDocumentKeyDown);
    });

    expose({ open, close });

    // 为子组件提供上下文
    const contextValue: InplaceContextValue = {
      prefixCls,
      active: computed(() => d_active.value),
      disabled: computed(() => props.disabled),
      closable: computed(() => props.closable),
      open,
      close,
    };
    provide(InplaceContextKey, contextValue);

    const rootClasses = computed(() =>
      classNames(prefixCls.value, hashId.value, attrs.class as string, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-disabled`]: props.disabled,
      }),
    );

    const displayClasses = computed(() =>
      classNames(`${prefixCls.value}-display`, {
        [`${prefixCls.value}-display-disabled`]: props.disabled,
      }),
    );

    return () =>
      wrapSSR(
        <div
          ref={rootRef}
          class={rootClasses.value}
          {...attrs}
          aria-live="polite"
          aria-atomic="true"
        >
          {!d_active.value ? (
            <div
              ref={displayRef}
              class={displayClasses.value}
              tabindex={props.disabled ? -1 : 0}
              role="button"
              aria-disabled={props.disabled}
              onClick={open}
              onKeydown={(e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  open(e);
                }
              }}
            >
              {slots.display?.()}
            </div>
          ) : (
            <div class={`${prefixCls.value}-content`}>
              <div class={`${prefixCls.value}-content-inner`}>
                {slots.content?.({ closeCallback: close })}
              </div>
              {props.closable ? (
                <button
                  type="button"
                  class={`${prefixCls.value}-close`}
                  aria-label="关闭"
                  onClick={close}
                >
                  <CloseOutlined />
                </button>
              ) : null}
            </div>
          )}
        </div>,
      );
  },
});

// 供子组件使用的 inject 辅助函数
export function useInplaceContext(): InplaceContextValue | null {
  return inject(InplaceContextKey, null);
}
