/// <reference types="vue/jsx" />
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  Teleport,
  Transition,
  watch,
} from 'vue';
import { addStyle, blockBodyScroll, unblockBodyScroll } from '@xiaoye-ui/utils/dom';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import Spin from '../spin';
import blockUIProps from './blockUITypes';
import useStyle from './style';
import { ZIndexManager } from '../_util/zIndexManager';

// SSR 安全判断
const isClient = typeof window !== 'undefined' && !!window.document;

export default defineComponent({
  name: 'XYBlockUI',
  inheritAttrs: false,
  __XY_BLOCK_UI: true,
  props: initDefaultProps(blockUIProps(), {}),
  emits: ['block', 'unblock'],
  setup(props, { slots, emit, expose }) {
    const { prefixCls } = useConfigInject('block-ui', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    // 容器元素（用于非全屏、未指定 container 时挂载遮罩）
    const containerRef = ref<HTMLElement | null>(null);
    // 实际挂载遮罩的目标容器
    const targetContainer = ref<HTMLElement | null>(null);
    // 当前是否处于阻塞状态
    const isBlocked = ref<boolean>(false);
    // 遮罩 DOM 引用（用于设置 z-index）
    const maskRef = ref<HTMLElement | null>(null);

    // 是否使用全屏（fullScreen 或 container 为 'body'）
    const isFullScreen = computed<boolean>(() => {
      return props.fullScreen || props.container === 'body';
    });

    // 解析目标容器
    function resolveTarget(): HTMLElement | null {
      if (!isClient) return null;

      // 显式 container
      if (props.container) {
        if (props.container === 'body') {
          return document.body;
        }
        if (typeof props.container === 'string') {
          return document.querySelector<HTMLElement>(props.container);
        }
        // HTMLElement
        if ((props.container as HTMLElement).nodeType) {
          return props.container as HTMLElement;
        }
      }

      // fullScreen 强制使用 body
      if (props.fullScreen) {
        return document.body;
      }

      // 默认使用组件根元素
      return containerRef.value;
    }

    // 计算遮罩 class
    const maskClasses = computed(() => {
      return [
        `${prefixCls.value}-mask`,
        {
          [`${prefixCls.value}-mask-fullscreen`]: isFullScreen.value,
          [props.maskClassName as string]: !!props.maskClassName,
        },
        hashId.value,
      ];
    });

    // 计算遮罩内联样式
    const maskInlineStyle = computed<Record<string, any>>(() => {
      const base: Record<string, any> = {};
      if (props.maskColor) {
        base.background = props.maskColor;
      }
      if (props.zIndex !== undefined) {
        base.zIndex = props.zIndex;
      }
      if (props.maskStyle) {
        Object.assign(base, props.maskStyle);
      }
      return base;
    });

    // 阻塞
    function block() {
      if (isBlocked.value) return;

      const target = resolveTarget();
      if (!target) return;

      targetContainer.value = target;
      isBlocked.value = true;

      // 全屏时锁定 body 滚动
      if (isFullScreen.value) {
        blockBodyScroll('xy-block-ui-overflow-hidden');
        // 移走焦点，避免键盘交互穿透
        if (isClient && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }

      // 确保 target 有定位上下文（仅非全屏时）
      if (!isFullScreen.value && target !== document.body) {
        const pos = target.style.position;
        if (!pos || pos === 'static') {
          (target as HTMLElement).style.position = 'relative';
        }
      }

      emit('block');
    }

    // 解除阻塞
    function unblock() {
      if (!isBlocked.value) return;
      isBlocked.value = false;
      emit('unblock');
    }

    // 强制移除遮罩（跳过动画，立即清理）
    function removeMask() {
      if (!isBlocked.value) return;
      isBlocked.value = false;

      if (isFullScreen.value) {
        unblockBodyScroll('xy-block-ui-overflow-hidden');
      }

      if (maskRef.value && props.autoZIndex) {
        ZIndexManager.clear(maskRef.value);
      }

      maskRef.value = null;
      targetContainer.value = null;
      emit('unblock');
    }

    // Transition 进入钩子：设置 z-index
    function onMaskEnter(el: Element) {
      const node = el as HTMLElement;
      maskRef.value = node;

      // 应用内联样式
      addStyle(node, maskInlineStyle.value);

      if (props.autoZIndex && props.zIndex === undefined) {
        ZIndexManager.set('modal', node, props.baseZIndex);
      }
    }

    // Transition 离开后钩子：清理 z-index、解除滚动锁
    function onMaskAfterLeave(el: Element) {
      const node = el as HTMLElement;
      if (props.autoZIndex) {
        ZIndexManager.clear(node);
      }

      if (isFullScreen.value) {
        unblockBodyScroll('xy-block-ui-overflow-hidden');
      }

      maskRef.value = null;
      targetContainer.value = null;
    }

    // 监听 blocked prop 变化
    watch(
      () => props.blocked,
      val => {
        if (val) {
          block();
        } else {
          unblock();
        }
      },
    );

    // 监听 fullScreen / container 变化时，如果当前阻塞中，需要切换容器
    watch(
      () => [props.fullScreen, props.container],
      () => {
        if (isBlocked.value) {
          // 先解除再重新阻塞，重新挂载到新容器
          removeMask();
          // 下一帧重新阻塞
          if (isClient) {
            requestAnimationFrame(() => block());
          }
        }
      },
    );

    onMounted(() => {
      if (props.blocked) {
        block();
      }
    });

    onBeforeUnmount(() => {
      // 强制清理
      if (isBlocked.value) {
        if (maskRef.value && props.autoZIndex) {
          ZIndexManager.clear(maskRef.value);
        }
        if (isFullScreen.value) {
          unblockBodyScroll('xy-block-ui-overflow-hidden');
        }
        isBlocked.value = false;
        maskRef.value = null;
        targetContainer.value = null;
      }
    });

    expose({
      block,
      unblock,
      removeMask,
      isBlocked,
      onMaskEnter,
    });

    // 渲染遮罩内容
    const renderMaskContent = () => {
      const maskSlot = slots.mask?.();
      if (maskSlot) {
        return <div class={`${prefixCls.value}-content`}>{maskSlot}</div>;
      }
      const tipSlot = slots.tip?.();
      const tip = props.tip ?? tipSlot;
      return (
        <div class={`${prefixCls.value}-content`}>
          <Spin size="large" />
          {tip ? <div class={`${prefixCls.value}-tip`}>{tip}</div> : null}
        </div>
      );
    };

    // 渲染遮罩
    const renderMask = () => {
      return (
        <Transition
          name={`${prefixCls.value}-mask`}
          appear
          onEnter={onMaskEnter}
          onAfterLeave={onMaskAfterLeave}
        >
          {isBlocked.value ? (
            <div class={maskClasses.value} role="presentation" aria-hidden="true">
              {renderMaskContent()}
            </div>
          ) : null}
        </Transition>
      );
    };

    return () => {
      const children = slots.default?.();
      const target = targetContainer.value;

      // 全屏或指定 container 时，使用 Teleport 挂载到目标节点
      const shouldTeleport = !!target && target !== containerRef.value;

      return wrapSSR(
        <div ref={containerRef} class={[prefixCls.value, hashId.value]} aria-busy={isBlocked.value}>
          {children}
          {shouldTeleport ? (
            <Teleport to={target as HTMLElement} disabled={!isClient}>
              {renderMask()}
            </Teleport>
          ) : (
            renderMask()
          )}
        </div>,
      );
    };
  },
});
