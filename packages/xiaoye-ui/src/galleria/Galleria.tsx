/// <reference types="vue/jsx" />
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  ref,
  useAttrs,
  useSlots,
  watch,
  Transition,
} from 'vue';
import { addClass, blockBodyScroll, focus, unblockBodyScroll } from '@xiaoye-ui/utils/dom';
import Portal from '../portal';
import galleriaProps from './galleriaTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import GalleriaContent from './GalleriaContent';
import useStyle from './style';

// SSR 安全判断
const isClient = typeof window !== 'undefined' && !!window.document;

// 内联 ID 生成器（避免跨包源码引用导致 rootDir 错误）
const lastIds: { [key: string]: number } = {};
function generateId(prefix: string = 'xy-galleria_'): string {
  if (!Object.prototype.hasOwnProperty.call(lastIds, prefix)) {
    lastIds[prefix] = 0;
  }
  lastIds[prefix]++;
  return `${prefix}${lastIds[prefix]}`;
}

// 内联 ZIndex 管理器（参考 context-menu/color-picker 实现）
const zIndexRecords: { key: string; value: number }[] = [];
const ZIndex = {
  get(element?: HTMLElement): number {
    return element ? parseInt(element.style.zIndex, 10) || 0 : 0;
  },
  set(key: string, element: HTMLElement, baseZIndex?: number): void {
    const base = baseZIndex ?? 0;
    const last = zIndexRecords.length > 0 ? zIndexRecords[zIndexRecords.length - 1] : null;
    const newValue = last ? last.value + 1 : base + 1;
    zIndexRecords.push({ key, value: newValue });
    element.style.zIndex = String(newValue);
  },
  clear(element: HTMLElement): void {
    const z = parseInt(element.style.zIndex, 10) || 0;
    const idx = zIndexRecords.findIndex(r => r.value === z);
    if (idx !== -1) zIndexRecords.splice(idx, 1);
    element.style.zIndex = '';
  },
  getCurrent(_key: string): number {
    return zIndexRecords.length > 0 ? zIndexRecords[zIndexRecords.length - 1].value : 0;
  },
};

export default defineComponent({
  name: 'XYGalleria',
  inheritAttrs: false,
  __XY_GALLERIA: true,
  props: initDefaultProps(galleriaProps(), {}),
  emits: ['update:activeIndex', 'update:visible'],
  setup(props, { emit, expose }) {
    const { prefixCls } = useConfigInject('galleria', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const attrs = useAttrs();
    const slots = useSlots();
    const containerVisible = ref(props.visible);
    const target = ref<HTMLElement | null>(null);
    const containerId = computed(() => (attrs as any).id || generateId('xy-galleria_'));
    const container = ref<any>(null);
    const mask = ref<HTMLElement | null>(null);
    const documentKeydownListener = ref<((event: KeyboardEvent) => void) | null>(null);

    const maskClass = computed(() => 'xy-galleria-mask');
    const maskClassProp = computed(() => props.maskClass);

    watch(
      () => props.visible,
      newValue => {
        if (props.fullScreen) {
          containerVisible.value = newValue;
          if (!newValue) {
            unblockBodyScroll('xy-galleria');
            unbindGlobalListeners();
          }
        }
      },
    );

    onBeforeUnmount(() => {
      if (props.fullScreen) {
        unblockBodyScroll('xy-galleria');
        unbindGlobalListeners();
      }
      mask.value = null;
      if (container.value) {
        const el = container.value?.$el || container.value;
        if (el instanceof HTMLElement) {
          ZIndex.clear(el);
        }
        container.value = null;
      }
    });

    function onBeforeEnter(el: Element) {
      if (el instanceof HTMLElement) {
        const zIndex = props.baseZIndex || 0;
        ZIndex.set('modal', el, zIndex);
      }
    }

    function onEnter() {
      if (!isClient) return;
      target.value = document.activeElement as HTMLElement;
      if (mask.value) {
        mask.value.style.zIndex = String(
          parseInt((mask.value as HTMLElement).style.zIndex || '0', 10) - 1,
        );
      }
      blockBodyScroll('xy-galleria');
      focusEl();
      bindGlobalListeners();
    }

    function onBeforeLeave() {
      if (mask.value) {
        addClass(mask.value, 'xy-galleria-mask-leave-active');
      }
    }

    function onLeave() {
      if (!isClient) return;
      focus(target.value);
      target.value = null;
    }

    function onAfterLeave(el: Element) {
      if (el instanceof HTMLElement) {
        ZIndex.clear(el);
      }
      containerVisible.value = false;
      unblockBodyScroll('xy-galleria');
      unbindGlobalListeners();
    }

    function onActiveItemChange(index: number) {
      if (props.activeIndex !== index) {
        emit('update:activeIndex', index);
      }
    }

    function maskHide() {
      emit('update:visible', false);
    }

    function containerRef(el: any) {
      container.value = el;
    }

    function maskRef(el: any) {
      mask.value = el as HTMLElement | null;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        maskHide();
      }
    }

    function bindDocumentKeyDownListener() {
      if (!isClient) return;
      if (!documentKeydownListener.value) {
        documentKeydownListener.value = onKeyDown;
        window.document.addEventListener('keydown', documentKeydownListener.value);
      }
    }

    function unbindDocumentKeyDownListener() {
      if (!isClient) return;
      if (documentKeydownListener.value) {
        window.document.removeEventListener('keydown', documentKeydownListener.value);
        documentKeydownListener.value = null;
      }
    }

    function bindGlobalListeners() {
      if (props.fullScreen) {
        bindDocumentKeyDownListener();
      }
    }

    function unbindGlobalListeners() {
      if (props.fullScreen) {
        unbindDocumentKeyDownListener();
      }
    }

    function focusEl() {
      const el = container.value?.$el;
      const focusTarget = el?.querySelector('[autofocus]');
      if (focusTarget) {
        (focusTarget as HTMLElement).focus();
      }
    }

    expose({
      container,
      mask,
      documentKeydownListener,
      onActiveItemChange,
      maskHide,
      containerRef,
      maskRef,
      onKeyDown,
      bindGlobalListeners,
      unbindGlobalListeners,
      focus: focusEl,
    });

    const contentProps = computed(() => ({
      id: containerId.value,
      templates: slots,
      value: props.value,
      activeIndex: props.activeIndex,
      numVisible: props.numVisible,
      fullScreen: props.fullScreen,
      visible: props.visible,
      circular: props.circular,
      showItemNavigators: props.showItemNavigators,
      showIndicators: props.showIndicators,
      showIndicatorsOnItem: props.showIndicatorsOnItem,
      indicatorsPosition: props.indicatorsPosition,
      changeItemOnIndicatorHover: props.changeItemOnIndicatorHover,
      showThumbnails: props.showThumbnails,
      thumbnailsPosition: props.thumbnailsPosition,
      autoPlay: props.autoPlay,
      transitionInterval: props.transitionInterval,
      containerStyle: props.containerStyle,
      containerClass: [hashId.value, props.containerClass],
      containerProps: props.containerProps,
      ariaLabel: props.ariaLabel,
      ariaRoledescription: props.ariaRoledescription,
      showThumbnailNavigators: props.showThumbnailNavigators,
      prevButtonProps: props.prevButtonProps,
      nextButtonProps: props.nextButtonProps,
      verticalThumbnailViewPortHeight: props.verticalThumbnailViewPortHeight,
      responsiveOptions: props.responsiveOptions,
      onMaskHide: maskHide,
    }));

    return () => {
      if (props.fullScreen) {
        return wrapSSR(
          <Portal>
            {containerVisible.value && (
              <div
                ref={maskRef}
                class={[maskClass.value, maskClassProp.value]}
                role="dialog"
                aria-modal={props.fullScreen ? 'true' : undefined}
              >
                <Transition
                  name="xy-galleria"
                  onBeforeEnter={onBeforeEnter}
                  onEnter={onEnter}
                  onBeforeLeave={onBeforeLeave}
                  onLeave={onLeave}
                  onAfterLeave={onAfterLeave}
                  appear
                >
                  {props.visible && (
                    <GalleriaContent
                      ref={containerRef}
                      onActiveitemChange={onActiveItemChange}
                      {...contentProps.value}
                    />
                  )}
                </Transition>
              </div>
            )}
          </Portal>,
        );
      }

      return wrapSSR(
        <GalleriaContent onActiveitemChange={onActiveItemChange} {...contentProps.value} />,
      );
    };
  },
});
