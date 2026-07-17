/// <reference types="vue/jsx" />
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
} from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import {
  addClass,
  find,
  findSingle,
  getAttribute,
  removeClass,
  setAttribute,
} from '@xiaoye-ui/utils/dom';
import { localeComparator, sort } from '@xiaoye-ui/utils/object';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from '@xiaoye-ui/icons';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useRipple } from '../ripple/useRipple';
import useStyle from './style';

// SSR 安全判断
const isClient = typeof window !== 'undefined' && !!window.document;

export const galleriaThumbnailsProps = () => ({
  containerId: { type: String as PropType<string | null>, default: null },
  value: { type: Array as PropType<any[] | null>, default: null },
  numVisible: { type: Number, default: 3 },
  activeIndex: { type: Number, default: 0 },
  isVertical: { type: Boolean, default: false },
  slideShowActive: { type: Boolean, default: false },
  circular: { type: Boolean, default: false },
  responsiveOptions: { type: Array as PropType<any[] | null>, default: null },
  contentHeight: { type: String, default: '300px' },
  showThumbnailNavigators: { type: Boolean, default: true },
  templates: { type: null as any, default: null },
  prevButtonProps: { type: null as any, default: null },
  nextButtonProps: { type: null as any, default: null },
});

export type GalleriaThumbnailsProps = Partial<
  ExtractPropTypes<ReturnType<typeof galleriaThumbnailsProps>>
>;

export default defineComponent({
  name: 'XYGalleriaThumbnails',
  inheritAttrs: false,
  __XY_GALLERIA_THUMBNAILS: true,
  props: galleriaThumbnailsProps(),
  emits: ['stopSlideshow', 'update:activeIndex'],
  setup(props, { emit, expose }) {
    const xiaoyeUI = inject('$xiaoyeUI', {} as any);
    const { prefixCls } = useConfigInject('galleria', props);
    const [wrapSSR] = useStyle(prefixCls);

    const d_numVisible = ref(props.numVisible);
    const d_oldNumVisible = ref(props.numVisible);
    const d_activeIndex = ref(props.activeIndex);
    const d_oldActiveItemIndex = ref(props.activeIndex);
    const totalShiftedItems = ref(0);

    const startPos = ref<{ x: number; y: number } | null>(null);
    let thumbnailsStyle: HTMLStyleElement | null = null;
    let sortedResponsiveOptions: any[] | null = null;
    let documentResizeListener: (() => void) | null = null;

    const itemsContainerRef = ref<HTMLElement | null>(null);
    const prevBtnRef = ref<HTMLElement>();
    const nextBtnRef = ref<HTMLElement>();
    useRipple(prevBtnRef);
    useRipple(nextBtnRef);

    function firstItemActiveIndex() {
      return totalShiftedItems.value * -1;
    }

    function lastItemActiveIndex() {
      return firstItemActiveIndex() + d_numVisible.value - 1;
    }

    function isItemActive(index: number) {
      return firstItemActiveIndex() <= index && lastItemActiveIndex() >= index;
    }

    function ariaPageLabel(value: number) {
      const aria = xiaoyeUI?.config?.locale?.aria;
      return aria?.pageLabel ? aria.pageLabel.replace(/{page}/g, String(value)) : undefined;
    }

    const ariaPrevButtonLabel = computed(
      () => xiaoyeUI?.config?.locale?.aria?.prevPageLabel || undefined,
    );
    const ariaNextButtonLabel = computed(
      () => xiaoyeUI?.config?.locale?.aria?.nextPageLabel || undefined,
    );

    const isNavBackwardDisabled = computed(
      () =>
        (!props.circular && d_activeIndex.value === 0) ||
        (props.value?.length ?? 0) <= d_numVisible.value,
    );
    const isNavForwardDisabled = computed(
      () =>
        (!props.circular && d_activeIndex.value === (props.value?.length ?? 0) - 1) ||
        (props.value?.length ?? 0) <= d_numVisible.value,
    );

    const thumbnailPrevButtonClass = computed(() => [
      'xy-galleria-thumbnail-prev-button xy-galleria-thumbnail-nav-button',
      { 'xy-galleria-thumbnail-nav-button-disabled': isNavBackwardDisabled.value },
    ]);

    const thumbnailNextButtonClass = computed(() => [
      'xy-galleria-thumbnail-next-button xy-galleria-thumbnail-nav-button',
      { 'xy-galleria-thumbnail-nav-button-disabled': isNavForwardDisabled.value },
    ]);

    function thumbnailItemClass(index: number) {
      return [
        'xy-galleria-thumbnail-item',
        {
          'xy-galleria-thumbnail-item-current': props.activeIndex === index,
          'xy-galleria-thumbnail-item-active': isItemActive(index),
          'xy-galleria-thumbnail-item-start': firstItemActiveIndex() === index,
          'xy-galleria-thumbnail-item-end': lastItemActiveIndex() === index,
        },
      ];
    }

    watch(
      () => props.numVisible,
      (newValue, oldValue) => {
        d_numVisible.value = newValue;
        d_oldNumVisible.value = oldValue;
      },
    );

    watch(
      () => props.activeIndex,
      (newValue, oldValue) => {
        d_activeIndex.value = newValue;
        d_oldActiveItemIndex.value = oldValue;
      },
    );

    onMounted(() => {
      if (isClient) {
        createStyle();
        calculatePosition();
        if (props.responsiveOptions) {
          bindDocumentListeners();
        }
      }
    });

    onUpdated(() => {
      let newTotalShiftedItems = totalShiftedItems.value;

      if (
        d_oldNumVisible.value !== d_numVisible.value ||
        d_oldActiveItemIndex.value !== d_activeIndex.value
      ) {
        if (d_activeIndex.value <= getMedianItemIndex()) {
          newTotalShiftedItems = 0;
        } else if (
          (props.value?.length ?? 0) - d_numVisible.value + getMedianItemIndex() <
          d_activeIndex.value
        ) {
          newTotalShiftedItems = d_numVisible.value - (props.value?.length ?? 0);
        } else if (
          (props.value?.length ?? 0) - d_numVisible.value < d_activeIndex.value &&
          d_numVisible.value % 2 === 0
        ) {
          newTotalShiftedItems = d_activeIndex.value * -1 + getMedianItemIndex() + 1;
        } else {
          newTotalShiftedItems = d_activeIndex.value * -1 + getMedianItemIndex();
        }

        if (newTotalShiftedItems !== totalShiftedItems.value) {
          totalShiftedItems.value = newTotalShiftedItems;
        }

        const container = itemsContainerRef.value;
        if (container) {
          container.style.transform = props.isVertical
            ? `translate3d(0, ${newTotalShiftedItems * (100 / d_numVisible.value)}%, 0)`
            : `translate3d(${newTotalShiftedItems * (100 / d_numVisible.value)}%, 0, 0)`;
        }

        if (d_oldActiveItemIndex.value !== d_activeIndex.value) {
          const container = itemsContainerRef.value;
          container && removeClass(container, 'xy-galleria-thumbnail-items-hidden');
          if (container) {
            container.style.transition = 'transform 500ms ease 0s';
          }
        }

        d_oldActiveItemIndex.value = d_activeIndex.value;
        d_oldNumVisible.value = d_numVisible.value;
      }
    });

    onBeforeUnmount(() => {
      if (props.responsiveOptions) {
        unbindDocumentListeners();
      }
      if (thumbnailsStyle && thumbnailsStyle.parentNode) {
        thumbnailsStyle.parentNode.removeChild(thumbnailsStyle);
        thumbnailsStyle = null;
      }
    });

    function step(dir: number) {
      let newTotalShiftedItems = totalShiftedItems.value + dir;

      if (
        dir < 0 &&
        -1 * newTotalShiftedItems + d_numVisible.value > (props.value?.length ?? 0) - 1
      ) {
        newTotalShiftedItems = d_numVisible.value - (props.value?.length ?? 0);
      } else if (dir > 0 && newTotalShiftedItems > 0) {
        newTotalShiftedItems = 0;
      }

      if (props.circular) {
        if (dir < 0 && (props.value?.length ?? 0) - 1 === d_activeIndex.value) {
          newTotalShiftedItems = 0;
        } else if (dir > 0 && d_activeIndex.value === 0) {
          newTotalShiftedItems = d_numVisible.value - (props.value?.length ?? 0);
        }
      }

      const container = itemsContainerRef.value;
      if (container) {
        removeClass(container, 'xy-galleria-thumbnail-items-hidden');
        container.style.transform = props.isVertical
          ? `translate3d(0, ${newTotalShiftedItems * (100 / d_numVisible.value)}%, 0)`
          : `translate3d(${newTotalShiftedItems * (100 / d_numVisible.value)}%, 0, 0)`;
        container.style.transition = 'transform 500ms ease 0s';
      }

      totalShiftedItems.value = newTotalShiftedItems;
    }

    function stopSlideShow() {
      if (props.slideShowActive) {
        emit('stopSlideshow');
      }
    }

    function getMedianItemIndex() {
      const index = Math.floor(d_numVisible.value / 2);
      return d_numVisible.value % 2 ? index : index - 1;
    }

    function navBackward(e: Event) {
      stopSlideShow();

      const prevItemIndex = d_activeIndex.value !== 0 ? d_activeIndex.value - 1 : 0;
      const diff = prevItemIndex + totalShiftedItems.value;

      if (
        d_numVisible.value - diff - 1 > getMedianItemIndex() &&
        (-1 * totalShiftedItems.value !== 0 || props.circular)
      ) {
        step(1);
      }

      const newActiveIndex =
        props.circular && d_activeIndex.value === 0
          ? (props.value?.length ?? 0) - 1
          : prevItemIndex;
      emit('update:activeIndex', newActiveIndex);

      if ((e as Event & { cancelable: boolean }).cancelable) {
        e.preventDefault();
      }
    }

    function navForward(e: Event) {
      stopSlideShow();

      const nextItemIndex =
        d_activeIndex.value === (props.value?.length ?? 0) - 1
          ? (props.value?.length ?? 0) - 1
          : d_activeIndex.value + 1;

      if (
        nextItemIndex + totalShiftedItems.value > getMedianItemIndex() &&
        (-1 * totalShiftedItems.value < getTotalPageNumber() - 1 || props.circular)
      ) {
        step(-1);
      }

      const newActiveIndex =
        props.circular && (props.value?.length ?? 0) - 1 === d_activeIndex.value
          ? 0
          : nextItemIndex;
      emit('update:activeIndex', newActiveIndex);

      if ((e as Event & { cancelable: boolean }).cancelable) {
        e.preventDefault();
      }
    }

    function onItemClick(index: number) {
      stopSlideShow();

      const selectedItemIndex = index;

      if (selectedItemIndex !== d_activeIndex.value) {
        const diff = selectedItemIndex + totalShiftedItems.value;
        let dir = 0;

        if (selectedItemIndex < d_activeIndex.value) {
          dir = d_numVisible.value - diff - 1 - getMedianItemIndex();
          if (dir > 0 && -1 * totalShiftedItems.value !== 0) {
            step(dir);
          }
        } else {
          dir = getMedianItemIndex() - diff;
          if (dir < 0 && -1 * totalShiftedItems.value < getTotalPageNumber() - 1) {
            step(dir);
          }
        }

        emit('update:activeIndex', selectedItemIndex);
      }
    }

    function onThumbnailKeydown(event: KeyboardEvent, index: number) {
      if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') {
        onItemClick(index);
        event.preventDefault();
      }

      switch (event.code) {
        case 'ArrowRight':
          onRightKey();
          break;
        case 'ArrowLeft':
          onLeftKey();
          break;
        case 'Home':
          onHomeKey();
          event.preventDefault();
          break;
        case 'End':
          onEndKey();
          event.preventDefault();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          event.preventDefault();
          break;
        case 'Tab':
          onTabKey();
          break;
        default:
          break;
      }
    }

    function onRightKey() {
      const container = itemsContainerRef.value;
      if (!container) return;
      const indicators = getThumbnailItems();
      const activeIndex = findFocusedIndicatorIndex();
      if (!indicators.length || activeIndex === -1) return;
      changedFocusedIndicator(
        activeIndex,
        activeIndex + 1 === indicators.length ? indicators.length - 1 : activeIndex + 1,
      );
    }

    function onLeftKey() {
      const activeIndex = findFocusedIndicatorIndex();
      changedFocusedIndicator(activeIndex, activeIndex - 1 <= 0 ? 0 : activeIndex - 1);
    }

    function onHomeKey() {
      const activeIndex = findFocusedIndicatorIndex();
      changedFocusedIndicator(activeIndex, 0);
    }

    function onEndKey() {
      const container = itemsContainerRef.value;
      if (!container) return;
      const indicators = getThumbnailItems();
      const activeIndex = findFocusedIndicatorIndex();
      if (!indicators.length || activeIndex === -1) return;
      changedFocusedIndicator(activeIndex, indicators.length - 1);
    }

    function onTabKey() {
      const container = itemsContainerRef.value;
      if (!container) return;
      const indicators = getThumbnailItems();
      const highlightedIndex = indicators.findIndex(isActiveElement);
      const activeIndicator = findSingle(container, '.xy-galleria-thumbnail-item > [tabindex="0"]');
      const activeIndex = activeIndicator
        ? indicators.findIndex(ind => ind === activeIndicator.parentElement)
        : -1;
      if (activeIndex === -1 || highlightedIndex === -1) return;
      changeTabIndex(indicators[activeIndex], '-1');
      changeTabIndex(indicators[highlightedIndex], '0');
    }

    function findFocusedIndicatorIndex() {
      const container = itemsContainerRef.value;
      if (!container) return -1;
      const indicators = getThumbnailItems();
      const activeIndicator = findSingle(container, '.xy-galleria-thumbnail-item > [tabindex="0"]');
      return activeIndicator
        ? indicators.findIndex(ind => ind === activeIndicator.parentElement)
        : -1;
    }

    function changedFocusedIndicator(prevInd: number, nextInd: number) {
      const container = itemsContainerRef.value;
      if (!container) return;
      const indicators = getThumbnailItems();
      if (!indicators[prevInd] || !indicators[nextInd]) return;
      changeTabIndex(indicators[prevInd], '-1');
      changeTabIndex(indicators[nextInd], '0');
      getFocusableElement(indicators[nextInd])?.focus();
    }

    function getThumbnailItems() {
      const container = itemsContainerRef.value;
      return container ? [...find(container, '.xy-galleria-thumbnail-item')] : [];
    }

    function isActiveElement(element: Element) {
      return getAttribute(element, 'data-xy-active') === 'true';
    }

    function getFocusableElement(element: Element) {
      return element.children[0] as HTMLElement | undefined;
    }

    function changeTabIndex(element: Element, value: string) {
      const focusableElement = getFocusableElement(element);
      if (focusableElement) {
        focusableElement.tabIndex = Number(value);
      }
    }

    function onTransitionEnd(e: TransitionEvent) {
      const container = itemsContainerRef.value;
      if (container && e.propertyName === 'transform') {
        addClass(container, 'xy-galleria-thumbnail-items-hidden');
        container.style.transition = '';
      }
    }

    function onTouchStart(e: TouchEvent) {
      const touchobj = e.changedTouches[0];
      startPos.value = { x: touchobj.pageX, y: touchobj.pageY };
    }

    function onTouchMove(e: TouchEvent) {
      if ((e as TouchEvent & { cancelable: boolean }).cancelable) {
        e.preventDefault();
      }
    }

    function onTouchEnd(e: TouchEvent) {
      const touchobj = e.changedTouches[0];
      if (startPos.value) {
        if (props.isVertical) {
          changePageOnTouch(e, touchobj.pageY - startPos.value.y);
        } else {
          changePageOnTouch(e, touchobj.pageX - startPos.value.x);
        }
      }
    }

    function changePageOnTouch(e: TouchEvent, diff: number) {
      const touchThreshold = 10;
      if (Math.abs(diff) < touchThreshold) {
        return;
      }
      if (diff < 0) {
        navForward(e as unknown as Event);
      } else {
        navBackward(e as unknown as Event);
      }
    }

    function getTotalPageNumber() {
      return (props.value?.length ?? 0) > d_numVisible.value
        ? (props.value?.length ?? 0) - d_numVisible.value + 1
        : 0;
    }

    function createStyle() {
      if (!isClient) return;
      if (!thumbnailsStyle) {
        thumbnailsStyle = document.createElement('style');
        thumbnailsStyle.type = 'text/css';
        setAttribute(thumbnailsStyle, 'nonce', xiaoyeUI?.config?.csp?.nonce as string);
        document.body.appendChild(thumbnailsStyle);
      }

      const selector = props.containerId ? `#${props.containerId}` : '.xy-galleria';
      let innerHTML = `
                ${selector} .xy-galleria-thumbnail-item {
                    flex: 1 0 ${100 / d_numVisible.value}%
                }
            `;

      if (props.responsiveOptions) {
        sortedResponsiveOptions = [...props.responsiveOptions];
        const comparer = localeComparator();

        sortedResponsiveOptions.sort((data1, data2) => {
          const value1 = data1.breakpoint;
          const value2 = data2.breakpoint;
          return sort(value1, value2, -1, comparer);
        });

        for (let i = 0; i < sortedResponsiveOptions.length; i++) {
          const res = sortedResponsiveOptions[i];
          innerHTML += `
                        @media screen and (max-width: ${res.breakpoint}) {
                            ${selector} .xy-galleria-thumbnail-item {
                                flex: 1 0 ${100 / res.numVisible}%
                            }
                        }
                    `;
        }
      }

      if (thumbnailsStyle) {
        thumbnailsStyle.innerHTML = innerHTML;
      }
    }

    function calculatePosition() {
      if (!isClient) return;
      const container = itemsContainerRef.value;
      if (container && sortedResponsiveOptions) {
        const windowWidth = window.innerWidth;
        let matchedResponsiveData: { numVisible: number } = { numVisible: props.numVisible };

        for (let i = 0; i < sortedResponsiveOptions.length; i++) {
          const res = sortedResponsiveOptions[i];
          if (parseInt(res.breakpoint, 10) >= windowWidth) {
            matchedResponsiveData = res;
          }
        }

        if (d_numVisible.value !== matchedResponsiveData.numVisible) {
          d_numVisible.value = matchedResponsiveData.numVisible;
        }
      }
    }

    function bindDocumentListeners() {
      if (!isClient) return;
      if (!documentResizeListener) {
        documentResizeListener = () => {
          calculatePosition();
        };
        window.addEventListener('resize', documentResizeListener);
      }
    }

    function unbindDocumentListeners() {
      if (documentResizeListener) {
        window.removeEventListener('resize', documentResizeListener);
        documentResizeListener = null;
      }
    }

    expose({ step });

    return () => {
      const templates: any = props.templates || {};
      const PrevIcon =
        templates.previousthumbnailicon || (props.isVertical ? ChevronUpIcon : ChevronLeftIcon);
      const NextIcon =
        templates.nextthumbnailicon || (props.isVertical ? ChevronDownIcon : ChevronRightIcon);

      return wrapSSR(
        <div class="xy-galleria-thumbnails">
          <div class="xy-galleria-thumbnail-content">
            {props.showThumbnailNavigators && (
              <button
                ref={prevBtnRef}
                class={thumbnailPrevButtonClass.value}
                disabled={isNavBackwardDisabled.value}
                type="button"
                aria-label={ariaPrevButtonLabel.value}
                onClick={(e: Event) => navBackward(e)}
                {...(props.prevButtonProps || {})}
                data-xy-group-section="thumbnailnavigator"
              >
                <PrevIcon class="xy-galleria-thumbnail-prev-icon" />
              </button>
            )}
            <div
              class="xy-galleria-thumbnails-viewport"
              style={{ height: props.isVertical ? props.contentHeight : '' }}
            >
              <div
                ref={itemsContainerRef}
                class="xy-galleria-thumbnail-items"
                role="tablist"
                onTransitionend={(e: TransitionEvent) => onTransitionEnd(e)}
                onTouchstart={(e: TouchEvent) => onTouchStart(e)}
                onTouchmove={(e: TouchEvent) => onTouchMove(e)}
                onTouchend={(e: TouchEvent) => onTouchEnd(e)}
              >
                {props.value?.map((item: any, index: number) => (
                  <div
                    key={`xy-galleria-thumbnail-item-${index}`}
                    class={thumbnailItemClass(index)}
                    role="tab"
                    data-xy-active={props.activeIndex === index}
                    aria-selected={props.activeIndex === index}
                    aria-controls={props.containerId + '_item_' + index}
                    onKeydown={(e: KeyboardEvent) => onThumbnailKeydown(e, index)}
                    data-xy-section="thumbnailitem"
                    data-xy-galleria-thumbnail-item-current={props.activeIndex === index}
                    data-xy-galleria-thumbnail-item-active={isItemActive(index)}
                    data-xy-galleria-thumbnail-item-start={firstItemActiveIndex() === index}
                    data-xy-galleria-thumbnail-item-end={lastItemActiveIndex() === index}
                  >
                    <div
                      class="xy-galleria-thumbnail"
                      tabindex={props.activeIndex === index ? '0' : '-1'}
                      aria-label={ariaPageLabel(index + 1)}
                      aria-current={props.activeIndex === index ? 'page' : undefined}
                      onClick={() => onItemClick(index)}
                    >
                      {templates.thumbnail ? <templates.thumbnail item={item} /> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {props.showThumbnailNavigators && (
              <button
                ref={nextBtnRef}
                class={thumbnailNextButtonClass.value}
                disabled={isNavForwardDisabled.value}
                type="button"
                aria-label={ariaNextButtonLabel.value}
                onClick={(e: Event) => navForward(e)}
                {...(props.nextButtonProps || {})}
                data-xy-group-section="thumbnailnavigator"
              >
                <NextIcon class="xy-galleria-thumbnail-next-icon" />
              </button>
            )}
          </div>
        </div>,
      );
    };
  },
});
