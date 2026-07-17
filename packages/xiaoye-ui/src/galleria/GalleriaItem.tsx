/// <reference types="vue/jsx" />
import { computed, defineComponent, inject, onMounted, ref } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import { find, findSingle, getAttribute } from '@xiaoye-ui/utils/dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@xiaoye-ui/icons';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useRipple } from '../ripple/useRipple';
import useStyle from './style';

export const galleriaItemProps = () => ({
  circular: { type: Boolean, default: false },
  activeIndex: { type: Number, default: 0 },
  value: { type: Array as PropType<any[] | null>, default: null },
  showItemNavigators: { type: Boolean, default: true },
  showIndicators: { type: Boolean, default: true },
  slideShowActive: { type: Boolean, default: true },
  changeItemOnIndicatorHover: { type: Boolean, default: true },
  autoPlay: { type: Boolean, default: false },
  templates: { type: null as any, default: null },
  id: { type: String as PropType<string | null>, default: null },
});

export type GalleriaItemProps = Partial<ExtractPropTypes<ReturnType<typeof galleriaItemProps>>>;

export default defineComponent({
  name: 'XYGalleriaItem',
  inheritAttrs: false,
  __XY_GALLERIA_ITEM: true,
  props: galleriaItemProps(),
  emits: ['startSlideshow', 'stopSlideshow', 'update:activeIndex'],
  setup(props, { emit, expose }) {
    const xiaoyeUI = inject('$xiaoyeUI', {} as any);
    const { prefixCls } = useConfigInject('galleria', props);
    const [wrapSSR] = useStyle(prefixCls);

    const indicatorContentRef = ref<HTMLElement | null>(null);
    const prevBtnRef = ref<HTMLElement>();
    const nextBtnRef = ref<HTMLElement>();
    useRipple(prevBtnRef);
    useRipple(nextBtnRef);

    onMounted(() => {
      if (props.autoPlay) {
        emit('startSlideshow');
      }
    });

    const isNavBackwardDisabled = computed(() => !props.circular && props.activeIndex === 0);
    const isNavForwardDisabled = computed(
      () => !props.circular && props.activeIndex === (props.value?.length ?? 0) - 1,
    );

    const prevButtonClass = computed(() => [
      'xy-galleria-prev-button xy-galleria-nav-button',
      { 'xy-galleria-nav-button-disabled': isNavBackwardDisabled.value },
    ]);

    const nextButtonClass = computed(() => [
      'xy-galleria-next-button xy-galleria-nav-button',
      { 'xy-galleria-nav-button-disabled': isNavForwardDisabled.value },
    ]);

    function indicatorClass(index: number) {
      return [
        'xy-galleria-indicator',
        { 'xy-galleria-indicator-active': isIndicatorItemActive(index) },
      ];
    }

    function isIndicatorItemActive(index: number) {
      return props.activeIndex === index;
    }

    function next() {
      const nextItemIndex = props.activeIndex + 1;
      const newActiveIndex =
        props.circular && (props.value?.length ?? 0) - 1 === props.activeIndex ? 0 : nextItemIndex;
      emit('update:activeIndex', newActiveIndex);
    }

    function prev() {
      const prevItemIndex = props.activeIndex !== 0 ? props.activeIndex - 1 : 0;
      const newActiveIndex =
        props.circular && props.activeIndex === 0 ? (props.value?.length ?? 0) - 1 : prevItemIndex;
      emit('update:activeIndex', newActiveIndex);
    }

    function stopSlideShow() {
      if (props.slideShowActive) {
        emit('stopSlideshow');
      }
    }

    function navBackward(e: Event) {
      stopSlideShow();
      prev();
      if (e && (e as Event & { cancelable: boolean }).cancelable) {
        e.preventDefault();
      }
    }

    function navForward(e: Event) {
      stopSlideShow();
      next();
      if (e && (e as Event & { cancelable: boolean }).cancelable) {
        e.preventDefault();
      }
    }

    function onIndicatorClick(index: number) {
      stopSlideShow();
      emit('update:activeIndex', index);
    }

    function onIndicatorMouseEnter(index: number) {
      if (props.changeItemOnIndicatorHover) {
        stopSlideShow();
        emit('update:activeIndex', index);
      }
    }

    function onIndicatorKeyDown(event: KeyboardEvent, index: number) {
      switch (event.code) {
        case 'Enter':
        case 'NumpadEnter':
        case 'Space':
          stopSlideShow();
          emit('update:activeIndex', index);
          event.preventDefault();
          break;
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
        case 'Tab':
          onTabKey();
          break;
        case 'ArrowDown':
        case 'ArrowUp':
        case 'PageUp':
        case 'PageDown':
          event.preventDefault();
          break;
        default:
          break;
      }
    }

    function onRightKey() {
      const container = indicatorContentRef.value;
      if (!container) return;
      const indicators = getIndicators();
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
      const container = indicatorContentRef.value;
      if (!container) return;
      const indicators = getIndicators();
      const activeIndex = findFocusedIndicatorIndex();
      if (!indicators.length || activeIndex === -1) return;
      changedFocusedIndicator(activeIndex, indicators.length - 1);
    }

    function onTabKey() {
      const container = indicatorContentRef.value;
      if (!container) return;
      const indicators = getIndicators();
      const highlightedIndex = indicators.findIndex(isActiveElement);
      const activeIndicator = findSingle(container, '.xy-galleria-indicator > [tabindex="0"]');
      const activeIndex = activeIndicator
        ? indicators.findIndex(ind => ind === activeIndicator.parentElement)
        : -1;
      if (activeIndex === -1 || highlightedIndex === -1) return;
      changeTabIndex(indicators[activeIndex], '-1');
      changeTabIndex(indicators[highlightedIndex], '0');
    }

    function findFocusedIndicatorIndex() {
      const container = indicatorContentRef.value;
      if (!container) return -1;
      const indicators = getIndicators();
      const activeIndicator = findSingle(container, '.xy-galleria-indicator > [tabindex="0"]');
      return activeIndicator
        ? indicators.findIndex(ind => ind === activeIndicator.parentElement)
        : -1;
    }

    function changedFocusedIndicator(prevInd: number, nextInd: number) {
      const container = indicatorContentRef.value;
      if (!container) return;
      const indicators = getIndicators();
      if (!indicators[prevInd] || !indicators[nextInd]) return;
      changeTabIndex(indicators[prevInd], '-1');
      changeTabIndex(indicators[nextInd], '0');
      getFocusableElement(indicators[nextInd])?.focus();
    }

    function getIndicators() {
      const container = indicatorContentRef.value;
      return container ? [...find(container, '.xy-galleria-indicator')] : [];
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

    function ariaSlideNumber(value: number) {
      const aria = xiaoyeUI?.config?.locale?.aria;
      return aria?.slideNumber
        ? aria.slideNumber.replace(/{slideNumber}/g, String(value))
        : undefined;
    }

    function ariaPageLabel(value: number) {
      const aria = xiaoyeUI?.config?.locale?.aria;
      return aria?.pageLabel ? aria.pageLabel.replace(/{page}/g, String(value)) : undefined;
    }

    const activeItem = computed(() => props.value?.[props.activeIndex]);
    const ariaSlideLabel = computed(() => xiaoyeUI?.config?.locale?.aria?.slide || undefined);

    expose({ next, prev });

    return () => {
      const templates: any = props.templates || {};
      const PrevIcon = templates.previousitemicon || ChevronLeftIcon;
      const NextIcon = templates.nextitemicon || ChevronRightIcon;

      return wrapSSR(
        <div class="xy-galleria-items-container">
          <div class="xy-galleria-items">
            {props.showItemNavigators && (
              <button
                ref={prevBtnRef}
                type="button"
                class={prevButtonClass.value}
                onClick={(e: Event) => navBackward(e)}
                disabled={isNavBackwardDisabled.value}
                data-xy-group-section="itemnavigator"
              >
                <PrevIcon class="xy-galleria-prev-icon" />
              </button>
            )}
            <div
              id={props.id + '_item_' + props.activeIndex}
              class="xy-galleria-item"
              role="group"
              aria-label={ariaSlideNumber(props.activeIndex + 1)}
              aria-roledescription={ariaSlideLabel.value}
            >
              {templates.item ? <templates.item item={activeItem.value} /> : null}
            </div>
            {props.showItemNavigators && (
              <button
                ref={nextBtnRef}
                type="button"
                class={nextButtonClass.value}
                onClick={(e: Event) => navForward(e)}
                disabled={isNavForwardDisabled.value}
                data-xy-group-section="itemnavigator"
              >
                <NextIcon class="xy-galleria-next-icon" />
              </button>
            )}
            {templates['caption'] && (
              <div class="xy-galleria-caption">
                {templates.caption ? <templates.caption item={activeItem.value} /> : null}
              </div>
            )}
          </div>
          {props.showIndicators && (
            <ul ref={indicatorContentRef} class="xy-galleria-indicator-list">
              {props.value?.map((_item: any, index: number) => (
                <li
                  key={`xy-galleria-indicator-${index}`}
                  class={indicatorClass(index)}
                  aria-label={ariaPageLabel(index + 1)}
                  aria-selected={props.activeIndex === index}
                  aria-controls={props.id + '_item_' + index}
                  onClick={() => onIndicatorClick(index)}
                  onMouseenter={() => onIndicatorMouseEnter(index)}
                  onKeydown={(e: KeyboardEvent) => onIndicatorKeyDown(e, index)}
                  data-xy-section="indicator"
                  data-xy-active={isIndicatorItemActive(index)}
                >
                  {!templates['indicator'] && (
                    <button
                      type="button"
                      tabindex={props.activeIndex === index ? '0' : '-1'}
                      class="xy-galleria-indicator-button"
                    />
                  )}
                  {templates.indicator && (
                    <templates.indicator
                      index={index}
                      activeIndex={props.activeIndex}
                      tabindex={props.activeIndex === index ? '0' : '-1'}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>,
      );
    };
  },
});
