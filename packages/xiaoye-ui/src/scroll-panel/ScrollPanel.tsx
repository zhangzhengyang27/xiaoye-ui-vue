import { computed, onBeforeUnmount, onMounted, onUpdated, ref, defineComponent } from 'vue';
import { addClass, getHeight, removeClass } from '@xiaoye-ui/utils/dom';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import useStyle from './style';
import { scrollPanelProps } from './interface';

export default defineComponent({
  name: 'XYScrollPanel',
  inheritAttrs: false,
  props: initDefaultProps(scrollPanelProps(), { step: 5 }),
  setup(props, { expose, slots, attrs }) {
    const { prefixCls, direction } = useConfigInject('scroll-panel', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const root = ref<HTMLElement | null>(null);
    const content = ref<HTMLElement | null>(null);
    const xBar = ref<HTMLElement | null>(null);
    const yBar = ref<HTMLElement | null>(null);
    const orientation = ref<'vertical' | 'horizontal'>('vertical');
    const lastScrollTop = ref(0);
    const lastScrollLeft = ref(0);
    const contentId = computed(
      () => `xy_scroll_panel_${Math.random().toString(36).slice(2)}_content`,
    );

    let initialized = false;
    let documentResizeListener: (() => void) | null = null;
    let documentMouseMoveListener: ((event: MouseEvent) => void) | null = null;
    let documentMouseUpListener: (() => void) | null = null;
    let frame: number | null = null;
    let scrollXRatio: number | null = null;
    let scrollYRatio: number | null = null;
    let isXBarClicked = false;
    let isYBarClicked = false;
    let lastPageX: number | null = null;
    let lastPageY: number | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function requestFrame(callback: FrameRequestCallback) {
      return (window.requestAnimationFrame || timeoutFrame)(callback);
    }

    function timeoutFrame(fn: FrameRequestCallback) {
      return window.setTimeout(fn, 0);
    }

    function calculateContainerHeight() {
      if (!root.value || !xBar.value || !content.value) return;

      const containerStyles = getComputedStyle(root.value);
      const xBarStyles = getComputedStyle(xBar.value);
      const pureContainerHeight = getHeight(root.value) - parseInt(xBarStyles.height, 10);

      if (containerStyles.maxHeight !== 'none' && pureContainerHeight === 0) {
        const totalHeight = content.value.offsetHeight + parseInt(xBarStyles.height, 10);
        const maxHeight = parseInt(containerStyles.maxHeight, 10);

        if (totalHeight > maxHeight) {
          root.value.style.height = containerStyles.maxHeight;
        } else {
          const paddingTop = parseFloat(containerStyles.paddingTop) || 0;
          const paddingBottom = parseFloat(containerStyles.paddingBottom) || 0;
          const borderTopWidth = parseFloat(containerStyles.borderTopWidth) || 0;
          const borderBottomWidth = parseFloat(containerStyles.borderBottomWidth) || 0;
          root.value.style.height =
            content.value.offsetHeight +
            paddingTop +
            paddingBottom +
            borderTopWidth +
            borderBottomWidth +
            'px';
        }
      }
    }

    function moveBar() {
      if (!content.value || !xBar.value || !yBar.value || !root.value) return;

      const totalWidth = content.value.scrollWidth;
      const ownWidth = content.value.clientWidth;
      const bottom = (root.value.clientHeight - xBar.value.clientHeight) * -1;
      scrollXRatio = ownWidth / totalWidth;

      const totalHeight = content.value.scrollHeight;
      const ownHeight = content.value.clientHeight;
      const right = (root.value.clientWidth - yBar.value.clientWidth) * -1;
      scrollYRatio = ownHeight / totalHeight;

      const scrollBarWidth = Math.max(scrollXRatio * 100, 10);
      const scrollBarHeight = Math.max(scrollYRatio * 100, 10);

      frame = requestFrame(() => {
        if (!content.value || !xBar.value || !yBar.value) return;

        if (scrollXRatio! >= 1) {
          xBar.value.setAttribute('data-xy-scroll-panel-hidden', 'true');
          addClass(xBar.value, `${prefixCls.value}-hidden`);
        } else {
          xBar.value.setAttribute('data-xy-scroll-panel-hidden', 'false');
          removeClass(xBar.value, `${prefixCls.value}-hidden`);

          const leftRatio =
            (Math.abs(content.value.scrollLeft) / (totalWidth - ownWidth)) * (100 - scrollBarWidth);
          xBar.value.style.cssText = `width:${scrollBarWidth}%; inset-inline-start:${leftRatio}%; bottom:${bottom}px;`;
        }

        if (scrollYRatio! >= 1) {
          yBar.value.setAttribute('data-xy-scroll-panel-hidden', 'true');
          addClass(yBar.value, `${prefixCls.value}-hidden`);
        } else {
          yBar.value.setAttribute('data-xy-scroll-panel-hidden', 'false');
          removeClass(yBar.value, `${prefixCls.value}-hidden`);

          const topRatio =
            (content.value.scrollTop / (totalHeight - ownHeight)) * (100 - scrollBarHeight);
          yBar.value.style.cssText = `height:${scrollBarHeight}%; top: calc(${topRatio}% - ${xBar.value.clientHeight}px); inset-inline-end:${right}px;`;
        }
      });
    }

    function bindDocumentResizeListener() {
      if (!documentResizeListener) {
        documentResizeListener = () => moveBar();
        window.addEventListener('resize', documentResizeListener);
      }
    }

    function unbindDocumentResizeListener() {
      if (documentResizeListener) {
        window.removeEventListener('resize', documentResizeListener);
        documentResizeListener = null;
      }
    }

    function bindDocumentMouseListeners() {
      if (!documentMouseMoveListener) {
        documentMouseMoveListener = e => onDocumentMouseMove(e);
        document.addEventListener('mousemove', documentMouseMoveListener);
      }

      if (!documentMouseUpListener) {
        documentMouseUpListener = () => onDocumentMouseUp();
        document.addEventListener('mouseup', documentMouseUpListener);
      }
    }

    function unbindDocumentMouseListeners() {
      if (documentMouseMoveListener) {
        document.removeEventListener('mousemove', documentMouseMoveListener);
        documentMouseMoveListener = null;
      }

      if (documentMouseUpListener) {
        document.removeEventListener('mouseup', documentMouseUpListener);
        documentMouseUpListener = null;
      }
    }

    function initialize() {
      if (root.value?.offsetParent) {
        moveBar();
        bindDocumentResizeListener();
        calculateContainerHeight();
        initialized = true;
      }
    }

    function onScroll(event: Event) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (lastScrollLeft.value !== target.scrollLeft) {
        lastScrollLeft.value = target.scrollLeft;
        orientation.value = 'horizontal';
      } else if (lastScrollTop.value !== target.scrollTop) {
        lastScrollTop.value = target.scrollTop;
        orientation.value = 'vertical';
      }

      moveBar();
    }

    function onXBarMouseDown(e: MouseEvent) {
      isXBarClicked = true;
      xBar.value?.focus();
      lastPageX = e.pageX;
      yBar.value?.setAttribute('data-xy-scroll-panel-grabbed', 'false');
      if (xBar.value) addClass(xBar.value, `${prefixCls.value}-grabbed`);
      document.body.setAttribute('data-xy-scroll-panel-grabbed', 'false');
      addClass(document.body, `${prefixCls.value}-grabbed`);
      bindDocumentMouseListeners();
      e.preventDefault();
    }

    function onYBarMouseDown(e: MouseEvent) {
      isYBarClicked = true;
      yBar.value?.focus();
      lastPageY = e.pageY;
      yBar.value?.setAttribute('data-xy-scroll-panel-grabbed', 'true');
      if (yBar.value) addClass(yBar.value, `${prefixCls.value}-grabbed`);
      document.body.setAttribute('data-xy-scroll-panel-grabbed', 'true');
      addClass(document.body, `${prefixCls.value}-grabbed`);
      bindDocumentMouseListeners();
      e.preventDefault();
    }

    function onMouseMoveForXBar(e: MouseEvent) {
      if (lastPageX === null || scrollXRatio === null || !content.value) return;
      const deltaX = e.pageX - lastPageX;
      lastPageX = e.pageX;
      frame = requestFrame(() => {
        content.value!.scrollLeft += deltaX / scrollXRatio;
      });
    }

    function onMouseMoveForYBar(e: MouseEvent) {
      if (lastPageY === null || scrollYRatio === null || !content.value) return;
      const deltaY = e.pageY - lastPageY;
      lastPageY = e.pageY;
      frame = requestFrame(() => {
        content.value!.scrollTop += deltaY / scrollYRatio;
      });
    }

    function onDocumentMouseMove(e: MouseEvent) {
      if (isXBarClicked) {
        onMouseMoveForXBar(e);
      } else if (isYBarClicked) {
        onMouseMoveForYBar(e);
      } else {
        onMouseMoveForXBar(e);
        onMouseMoveForYBar(e);
      }
    }

    function onDocumentMouseUp() {
      if (yBar.value) {
        yBar.value.setAttribute('data-xy-scroll-panel-grabbed', 'false');
        removeClass(yBar.value, `${prefixCls.value}-grabbed`);
      }
      if (xBar.value) {
        xBar.value.setAttribute('data-xy-scroll-panel-grabbed', 'false');
        removeClass(xBar.value, `${prefixCls.value}-grabbed`);
      }
      document.body.setAttribute('data-xy-scroll-panel-grabbed', 'false');
      removeClass(document.body, `${prefixCls.value}-grabbed`);

      unbindDocumentMouseListeners();
      isXBarClicked = false;
      isYBarClicked = false;
    }

    function repeat(bar: 'scrollTop' | 'scrollLeft', step: number) {
      if (!content.value) return;
      content.value[bar] += step;
      moveBar();
    }

    function setTimer(bar: 'scrollTop' | 'scrollLeft', step: number) {
      clearTimer();
      timer = setTimeout(() => repeat(bar, step), 40);
    }

    function clearTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (orientation.value === 'vertical') {
        switch (event.code) {
          case 'ArrowDown':
            setTimer('scrollTop', props.step);
            event.preventDefault();
            break;
          case 'ArrowUp':
            setTimer('scrollTop', props.step * -1);
            event.preventDefault();
            break;
          case 'ArrowLeft':
          case 'ArrowRight':
            event.preventDefault();
            break;
          default:
            break;
        }
      } else {
        switch (event.code) {
          case 'ArrowRight':
            setTimer('scrollLeft', props.step);
            event.preventDefault();
            break;
          case 'ArrowLeft':
            setTimer('scrollLeft', props.step * -1);
            event.preventDefault();
            break;
          case 'ArrowDown':
          case 'ArrowUp':
            event.preventDefault();
            break;
          default:
            break;
        }
      }
    }

    function onKeyUp() {
      clearTimer();
    }

    function onFocus(event: FocusEvent) {
      if (xBar.value?.isSameNode(event.target as Node)) {
        orientation.value = 'horizontal';
      } else if (yBar.value?.isSameNode(event.target as Node)) {
        orientation.value = 'vertical';
      }
    }

    function onBlur() {
      if (orientation.value === 'horizontal') {
        orientation.value = 'vertical';
      }
    }

    function refresh() {
      moveBar();
    }

    function scrollTop(scrollTopValue: number) {
      if (!content.value) return;
      const scrollableHeight = content.value.scrollHeight - content.value.clientHeight;
      const value = Math.min(Math.max(scrollTopValue, 0), scrollableHeight);
      content.value.scrollTop = value;
    }

    onMounted(() => initialize());

    onUpdated(() => {
      if (!initialized && root.value?.offsetParent) {
        initialize();
      }
    });

    onBeforeUnmount(() => {
      unbindDocumentResizeListener();
      unbindDocumentMouseListeners();
      clearTimer();

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    });

    expose({
      initialize,
      calculateContainerHeight,
      moveBar,
      onYBarMouseDown,
      onXBarMouseDown,
      onScroll,
      onKeyDown,
      onKeyUp,
      repeat,
      setTimer,
      clearTimer,
      onDocumentMouseMove,
      onMouseMoveForXBar,
      onMouseMoveForYBar,
      onFocus,
      onBlur,
      onDocumentMouseUp,
      requestAnimationFrame: requestFrame,
      refresh,
      scrollTop,
      timeoutFrame,
      bindDocumentMouseListeners,
      unbindDocumentMouseListeners,
      bindDocumentResizeListener,
      unbindDocumentResizeListener,
    });

    return () => {
      const classes = [
        prefixCls.value,
        hashId.value,
        attrs.class,
        { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
      ];

      return wrapSSR(
        <div ref={root} class={classes} style={attrs.style}>
          <div class={`${prefixCls.value}-content-container`}>
            <div
              ref={content}
              id={contentId.value}
              class={`${prefixCls.value}-content`}
              onScroll={onScroll}
              onMouseenter={moveBar}
            >
              {slots.default?.()}
            </div>
          </div>
          <div
            ref={xBar}
            class={`${prefixCls.value}-bar ${prefixCls.value}-bar-x`}
            tabindex={0}
            role="scrollbar"
            aria-orientation="horizontal"
            aria-controls={contentId.value}
            aria-valuenow={lastScrollLeft.value}
            onMousedown={onXBarMouseDown}
            onKeydown={onKeyDown}
            onKeyup={onKeyUp}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          <div
            ref={yBar}
            class={`${prefixCls.value}-bar ${prefixCls.value}-bar-y`}
            tabindex={0}
            role="scrollbar"
            aria-orientation="vertical"
            aria-controls={contentId.value}
            aria-valuenow={lastScrollTop.value}
            onMousedown={onYBarMouseDown}
            onKeydown={onKeyDown}
            onKeyup={onKeyUp}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>,
      );
    };
  },
});
