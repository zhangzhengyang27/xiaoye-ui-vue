/// <reference types="vue/jsx" />
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  onUpdated,
  ref,
  useAttrs,
  watch,
} from 'vue';
import { TimesIcon } from '@xiaoye-ui/icons';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useRipple } from '../ripple/useRipple';
import { useFocusTrap } from '../focus-trap/useFocusTrap';
import GalleriaItem from './GalleriaItem';
import GalleriaThumbnails from './GalleriaThumbnails';
import useStyle from './style';

export default defineComponent({
  name: 'XYGalleriaContent',
  inheritAttrs: false,
  __XY_GALLERIA_CONTENT: true,
  emits: ['activeitemChange'],
  setup(_, { emit, expose }) {
    const attrs = useAttrs() as any;
    const xiaoyeUI = inject('$xiaoyeUI', {} as any);
    const { prefixCls } = useConfigInject('galleria', { prefixCls: undefined } as any);
    const [wrapSSR] = useStyle(prefixCls);

    const activeIndex = ref(attrs.activeIndex);
    const numVisible = ref(attrs.numVisible);
    const slideShowActive = ref(false);
    const interval = ref<ReturnType<typeof setInterval> | null>(null);

    const containerRef = ref<HTMLElement>();
    const closeBtnRef = ref<HTMLElement>();
    useRipple(closeBtnRef);

    // focus trap 仅在 fullScreen 模式下启用
    const focusTrapOptions = computed(() => ({ disabled: !attrs.fullScreen }));
    useFocusTrap(containerRef, focusTrapOptions);

    watch(
      () => attrs.value,
      (newVal: any) => {
        if (newVal && newVal.length < numVisible.value) {
          numVisible.value = newVal.length;
        }
      },
    );

    watch(
      () => attrs.activeIndex,
      (newVal: any) => {
        activeIndex.value = newVal;
      },
    );

    watch(
      () => attrs.numVisible,
      (newVal: any) => {
        numVisible.value = newVal;
      },
    );

    watch(
      () => attrs.autoPlay,
      (newVal: any) => {
        newVal ? startSlideShow() : stopSlideShow();
      },
    );

    onUpdated(() => {
      emit('activeitemChange', activeIndex.value);
    });

    onBeforeUnmount(() => {
      if (slideShowActive.value) {
        stopSlideShow();
      }
    });

    function getPositionClass(preClassName: string, position: string) {
      const positions = ['top', 'left', 'bottom', 'right'];
      const pos = positions.find(item => item === position);
      return pos ? `${preClassName}-${pos}` : '';
    }

    function isVertical() {
      return attrs.thumbnailsPosition === 'left' || attrs.thumbnailsPosition === 'right';
    }

    const rootClass = computed(() => {
      const thumbnailsPosClass =
        attrs.showThumbnails &&
        getPositionClass('xy-galleria-thumbnails', attrs.thumbnailsPosition);
      const indicatorPosClass =
        attrs.showIndicators &&
        getPositionClass('xy-galleria-indicators', attrs.indicatorsPosition);

      return [
        'xy-galleria',
        {
          'xy-galleria-fullscreen': attrs.fullScreen,
          'xy-galleria-inset-indicators': attrs.showIndicatorsOnItem,
          'xy-galleria-hover-navigators': attrs.showItemNavigatorsOnHover && !attrs.fullScreen,
        },
        thumbnailsPosClass,
        indicatorPosClass,
        attrs.containerClass,
      ];
    });

    const closeButtonClass = 'xy-galleria-close-button';
    const closeIconClass = 'xy-galleria-close-icon';
    const headerClass = 'xy-galleria-header';
    const contentClass = 'xy-galleria-content';
    const footerClass = 'xy-galleria-footer';

    const closeAriaLabel = computed(() => xiaoyeUI?.config?.locale?.aria?.close || undefined);

    function isAutoPlayActive() {
      return slideShowActive.value;
    }

    function startSlideShow() {
      stopSlideShow();

      interval.value = setInterval(() => {
        const newActiveIndex =
          attrs.circular && attrs.value.length - 1 === activeIndex.value
            ? 0
            : activeIndex.value + 1;
        activeIndex.value = newActiveIndex;
      }, attrs.transitionInterval);

      slideShowActive.value = true;
    }

    function stopSlideShow() {
      if (interval.value) {
        clearInterval(interval.value);
        interval.value = null;
      }
      slideShowActive.value = false;
    }

    function emitMaskHide() {
      (attrs.onMaskHide as (() => void) | undefined)?.();
    }

    expose({ isAutoPlayActive, isVertical, getPositionClass });

    return () => {
      const templates = attrs.templates || {};
      const CloseIcon = templates['closeicon'] || TimesIcon;

      if (!(attrs.value && attrs.value.length > 0)) {
        return null;
      }

      return wrapSSR(
        <div
          ref={containerRef}
          id={attrs.id}
          role="region"
          class={rootClass.value}
          style={attrs.containerStyle}
          aria-label={attrs.ariaLabel}
          aria-roledescription={attrs.ariaRoledescription}
          {...(attrs.containerProps || {})}
        >
          {attrs.fullScreen && (
            <button
              ref={closeBtnRef}
              autofocus
              type="button"
              class={closeButtonClass}
              aria-label={closeAriaLabel.value}
              onClick={emitMaskHide}
            >
              <CloseIcon class={closeIconClass} />
            </button>
          )}
          {templates && templates['header'] && (
            <div class={headerClass}>
              <templates.header />
            </div>
          )}
          <div class={contentClass} aria-live={attrs.autoPlay ? 'polite' : 'off'}>
            <GalleriaItem
              id={attrs.id}
              activeIndex={activeIndex.value}
              onUpdate:activeIndex={(v: number) => (activeIndex.value = v)}
              slideShowActive={slideShowActive.value}
              value={attrs.value}
              circular={attrs.circular}
              templates={attrs.templates}
              showIndicators={attrs.showIndicators}
              changeItemOnIndicatorHover={attrs.changeItemOnIndicatorHover}
              showItemNavigators={attrs.showItemNavigators}
              autoPlay={attrs.autoPlay}
              onStartSlideshow={startSlideShow}
              onStopSlideshow={stopSlideShow}
            />

            {attrs.showThumbnails && (
              <GalleriaThumbnails
                activeIndex={activeIndex.value}
                onUpdate:activeIndex={(v: number) => (activeIndex.value = v)}
                slideShowActive={slideShowActive.value}
                containerId={attrs.id}
                value={attrs.value}
                templates={attrs.templates}
                numVisible={numVisible.value}
                responsiveOptions={attrs.responsiveOptions}
                circular={attrs.circular}
                isVertical={isVertical()}
                contentHeight={attrs.verticalThumbnailViewPortHeight}
                showThumbnailNavigators={attrs.showThumbnailNavigators}
                prevButtonProps={attrs.prevButtonProps}
                nextButtonProps={attrs.nextButtonProps}
                onStopSlideshow={stopSlideShow}
              />
            )}
          </div>
          {templates && templates['footer'] && (
            <div class={footerClass}>
              <templates.footer />
            </div>
          )}
        </div>,
      );
    };
  },
});
