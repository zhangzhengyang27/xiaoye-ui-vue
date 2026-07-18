/// <reference types="vue/jsx" />
import { getHeight, getWidth, isVisible } from '@xiaoye-ui/utils/dom';
import { SpinnerIcon } from '@xiaoye-ui/icons';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
} from 'vue';
import virtualScrollerProps from './virtualScrollerTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';
import useStyle from './style';

// SSR 安全判断
const isClient = typeof window !== 'undefined' && !!window.document;

export default defineComponent({
  name: 'XYVirtualScroller',
  inheritAttrs: false,
  __XY_VIRTUAL_SCROLLER: true,
  props: initDefaultProps(virtualScrollerProps(), {}),
  slots: Object as CustomSlotsType<{
    default?: any;
    content?: any;
    item?: any;
    loader?: any;
    loadingicon?: any;
  }>,
  emits: ['update:numToleratedItems', 'scroll', 'scroll-index-change', 'lazy-load'],
  setup(props, { slots, emit, expose }) {
    const instance = getCurrentInstance()!;

    const isBoth = () => props.orientation === 'both';
    const isHorizontal = () => props.orientation === 'horizontal';
    const isVertical = () => props.orientation === 'vertical';

    const element = ref<HTMLElement | null>(null);
    const content = ref<HTMLElement | null>(null);
    let lastScrollPos: any = isBoth() ? { top: 0, left: 0 } : 0;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let defaultWidth = 0;
    let defaultHeight = 0;
    let isRangeChanged = false;
    let lazyLoadState: any = {};
    let resizeListener: (() => void) | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let initialized = false;

    const d_numToleratedItems = ref<any>(props.numToleratedItems);
    const d_loading = ref(props.loading);
    const loaderArr = ref<any[]>([]);
    const spacerStyle = ref<Record<string, string>>({});
    const contentStyle = ref<Record<string, string>>({});

    const first = ref<any>(isBoth() ? { rows: 0, cols: 0 } : 0);
    const last = ref<any>(isBoth() ? { rows: 0, cols: 0 } : 0);
    const page = ref<any>(isBoth() ? { rows: 0, cols: 0 } : 0);
    const numItemsInViewport = ref<any>(isBoth() ? { rows: 0, cols: 0 } : 0);

    function elementRef(el: HTMLElement | null) {
      element.value = el;
    }

    function contentRef(el: HTMLElement | null) {
      content.value = el;
    }

    const { prefixCls } = useConfigInject('virtualscroller', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const containerClass = computed(() => [
      `${prefixCls.value}`,
      props.class,
      hashId.value,
      {
        [`${prefixCls.value}-inline`]: props.inline,
        [`${prefixCls.value}-both`]: isBoth(),
        [`${prefixCls.value}-horizontal`]: isHorizontal(),
      },
    ]);

    const contentClass = computed(() => [
      `${prefixCls.value}-content`,
      {
        [`${prefixCls.value}-content-loading`]: d_loading.value,
      },
    ]);

    const loaderClass = computed(() => [
      `${prefixCls.value}-loader`,
      {
        [`${prefixCls.value}-loader-mask`]: !instance.slots?.loader,
      },
    ]);

    const loadedItems = computed(() => {
      if (props.items && !d_loading.value) {
        if (isBoth()) {
          return props.items
            .slice(first.value.rows, last.value.rows)
            .map(item => (props.columns ? item : item.slice(first.value.cols, last.value.cols)));
        } else if (isHorizontal() && props.columns) {
          return props.items;
        } else {
          return props.items.slice(first.value, last.value);
        }
      }
      return [];
    });

    const loadedRows = computed(() => {
      return d_loading.value ? (props.loaderDisabled ? loaderArr.value : []) : loadedItems.value;
    });

    const loadedColumns = computed(() => {
      if (props.columns) {
        const both = isBoth();
        const horizontal = isHorizontal();

        if (both || horizontal) {
          return d_loading.value && props.loaderDisabled
            ? both
              ? loaderArr.value[0]
              : loaderArr.value
            : props.columns.slice(
                both ? first.value.cols : first.value,
                both ? last.value.cols : last.value,
              );
        }
      }
      return props.columns;
    });

    watch(
      () => props.numToleratedItems,
      newValue => {
        d_numToleratedItems.value = newValue;
      },
    );
    watch(
      () => props.loading,
      (newValue, oldValue) => {
        if (props.lazy && newValue !== oldValue && newValue !== d_loading.value) {
          d_loading.value = newValue;
        }
      },
    );
    watch(
      () => props.items,
      (newValue, oldValue) => {
        if (!oldValue || oldValue.length !== (newValue || []).length) {
          init();
          calculateAutoSize();
        }
      },
      { deep: true },
    );
    watch(
      () => props.itemSize,
      () => {
        init();
        calculateAutoSize();
      },
    );
    watch(
      () => props.orientation,
      () => {
        lastScrollPos = isBoth() ? { top: 0, left: 0 } : 0;
      },
    );
    watch(
      () => props.scrollHeight,
      () => {
        init();
        calculateAutoSize();
      },
    );
    watch(
      () => props.scrollWidth,
      () => {
        init();
        calculateAutoSize();
      },
    );

    function viewInit() {
      if (isClient && isVisible(element.value)) {
        setContentEl(content.value);
        init();
        calculateAutoSize();

        defaultWidth = getWidth(element.value!);
        defaultHeight = getHeight(element.value!);
        initialized = true;
      }

      if (element.value) {
        bindResizeListener();
      }
    }

    function init() {
      if (!props.disabled) {
        setSize();
        calculateOptions();
        setSpacerSize();
      }
    }

    function scrollTo(options: ScrollToOptions) {
      element.value && element.value.scrollTo(options);
    }

    function scrollToIndex(index: number | number[], behavior: ScrollBehavior = 'auto') {
      const both = isBoth();
      const horizontal = isHorizontal();
      const valid = both ? (index as number[]).every(i => i > -1) : (index as number) > -1;

      if (valid) {
        const firstVal = first.value;
        const scrollTop = element.value?.scrollTop || 0;
        const scrollLeft = element.value?.scrollLeft || 0;
        const numToleratedItems = calculateNumItems().numToleratedItems;
        const contentPos = getContentPosition();
        const itemSize = props.itemSize as any;
        const calculateFirst = (_index = 0, _numT: number) => (_index <= _numT ? 0 : _index);
        const calculateCoord = (_first: number, _size: number, _cpos: number) =>
          _first * _size + _cpos;
        const scrollToFn = (left = 0, top = 0) => scrollTo({ left, top, behavior });
        let newFirst: any = both ? { rows: 0, cols: 0 } : 0;
        let rangeChanged = false;
        let scrollChanged = false;

        if (both) {
          const idx = index as number[];
          newFirst = {
            rows: calculateFirst(idx[0], numToleratedItems[0]),
            cols: calculateFirst(idx[1], numToleratedItems[1]),
          };
          scrollToFn(
            calculateCoord(newFirst.cols, itemSize[1], contentPos.left),
            calculateCoord(newFirst.rows, itemSize[0], contentPos.top),
          );
          scrollChanged = lastScrollPos.top !== scrollTop || lastScrollPos.left !== scrollLeft;
          rangeChanged = newFirst.rows !== firstVal.rows || newFirst.cols !== firstVal.cols;
        } else {
          newFirst = calculateFirst(index as number, numToleratedItems);
          horizontal
            ? scrollToFn(calculateCoord(newFirst, itemSize, contentPos.left), scrollTop)
            : scrollToFn(scrollLeft, calculateCoord(newFirst, itemSize, contentPos.top));
          scrollChanged = lastScrollPos !== (horizontal ? scrollLeft : scrollTop);
          rangeChanged = newFirst !== firstVal;
        }

        isRangeChanged = rangeChanged;
        if (scrollChanged) first.value = newFirst;
      }
    }

    function getRenderedRange() {
      const calculateFirstInViewport = (_pos: number, _size: number) =>
        Math.floor(_pos / (_size || _pos));

      let firstInViewport: any = first.value;
      let lastInViewport: any = 0;

      if (element.value) {
        const both = isBoth();
        const horizontal = isHorizontal();
        const scrollTop = element.value.scrollTop;
        const scrollLeft = element.value.scrollLeft;
        const itemSize = props.itemSize as any;

        if (both) {
          firstInViewport = {
            rows: calculateFirstInViewport(scrollTop, itemSize[0]),
            cols: calculateFirstInViewport(scrollLeft, itemSize[1]),
          };
          lastInViewport = {
            rows: firstInViewport.rows + numItemsInViewport.value.rows,
            cols: firstInViewport.cols + numItemsInViewport.value.cols,
          };
        } else {
          const scrollPos = horizontal ? scrollLeft : scrollTop;
          firstInViewport = calculateFirstInViewport(scrollPos, itemSize);
          lastInViewport = firstInViewport + numItemsInViewport.value;
        }
      }

      return {
        first: first.value,
        last: last.value,
        viewport: {
          first: firstInViewport,
          last: lastInViewport,
        },
      };
    }

    function calculateNumItems() {
      const both = isBoth();
      const horizontal = isHorizontal();
      const itemSize = props.itemSize as any;
      const contentPos = getContentPosition();
      const contentWidth = element.value ? element.value.offsetWidth - contentPos.left : 0;
      const contentHeight = element.value ? element.value.offsetHeight - contentPos.top : 0;
      const calculateNumItemsInViewport = (_contentSize: number, _itemSize: number) =>
        Math.ceil(_contentSize / (_itemSize || _contentSize));
      const calculateNumToleratedItems = (_numItems: number) => Math.ceil(_numItems / 2);
      const numItemsInVP: any = both
        ? {
            rows: calculateNumItemsInViewport(contentHeight, itemSize[0]),
            cols: calculateNumItemsInViewport(contentWidth, itemSize[1]),
          }
        : calculateNumItemsInViewport(horizontal ? contentWidth : contentHeight, itemSize);

      const numToleratedItems: any =
        d_numToleratedItems.value ||
        (both
          ? [
              calculateNumToleratedItems(numItemsInVP.rows),
              calculateNumToleratedItems(numItemsInVP.cols),
            ]
          : calculateNumToleratedItems(numItemsInVP));

      return { numItemsInViewport: numItemsInVP, numToleratedItems };
    }

    function getLast(lastVal: number = 0, isCols?: boolean) {
      return props.items
        ? Math.min(
            isCols ? (props.columns || props.items[0])?.length || 0 : props.items?.length || 0,
            lastVal,
          )
        : 0;
    }

    function getContentPosition() {
      if (!isClient) {
        return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
      }

      if (content.value) {
        const style = getComputedStyle(content.value);
        const left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
        const right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
        const top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
        const bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);

        return { left, right, top, bottom, x: left + right, y: top + bottom };
      }
      return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
    }

    function setSize() {
      if (element.value) {
        const both = isBoth();
        const horizontal = isHorizontal();
        const parentElement = element.value.parentElement;
        const width =
          props.scrollWidth || `${element.value.offsetWidth || parentElement?.offsetWidth || 0}px`;
        const height =
          props.scrollHeight ||
          `${element.value.offsetHeight || parentElement?.offsetHeight || 0}px`;

        element.value.style.height = height;
        if (both || horizontal) {
          element.value.style.width = width;
        }
      }
    }

    function setSpacerSize() {
      const items = props.items;

      if (items) {
        const both = isBoth();
        const horizontal = isHorizontal();
        const contentPos = getContentPosition();
        const itemSize = props.itemSize as any;

        if (both) {
          spacerStyle.value = {
            ...spacerStyle.value,
            height: `${items.length * itemSize[0] + contentPos.y}px`,
            width: `${((props.columns || items[1])?.length || 0) * itemSize[1] + contentPos.x}px`,
          };
        } else {
          const size = horizontal
            ? (props.columns || items).length * itemSize + contentPos.x
            : items.length * itemSize + contentPos.y;
          horizontal
            ? (spacerStyle.value = { ...spacerStyle.value, width: `${size}px` })
            : (spacerStyle.value = { ...spacerStyle.value, height: `${size}px` });
        }
      }
    }

    function calculateOptions() {
      const both = isBoth();
      const firstVal = first.value;
      const { numItemsInViewport: numItemsInVP, numToleratedItems } = calculateNumItems();
      const calculateLast = (_first: number, _num: number, _numT: number, _isCols = false) =>
        getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
      const lastVal: any = both
        ? {
            rows: calculateLast(firstVal.rows, numItemsInVP.rows, numToleratedItems[0]),
            cols: calculateLast(firstVal.cols, numItemsInVP.cols, numToleratedItems[1], true),
          }
        : calculateLast(firstVal, numItemsInVP, numToleratedItems);

      last.value = lastVal;
      numItemsInViewport.value = numItemsInVP;
      d_numToleratedItems.value = numToleratedItems;
      emit('update:numToleratedItems', d_numToleratedItems.value);

      if (props.showLoader) {
        loaderArr.value = both
          ? Array.from({ length: numItemsInVP.rows }).map(() =>
              Array.from({ length: numItemsInVP.cols }),
            )
          : Array.from({ length: numItemsInVP });
      }

      if (props.lazy) {
        Promise.resolve().then(() => {
          lazyLoadState = {
            first: props.step ? (both ? { rows: 0, cols: firstVal.cols } : 0) : firstVal,
            last: Math.min(props.step || lastVal, props.items?.length || 0),
          };
          emit('lazy-load', lazyLoadState);
        });
      }
    }

    function calculateAutoSize() {
      if (props.autoSize && !d_loading.value) {
        Promise.resolve().then(() => {
          if (content.value && element.value) {
            const both = isBoth();
            const horizontal = isHorizontal();
            const vertical = isVertical();

            content.value.style.minHeight = content.value.style.minWidth = 'auto';
            content.value.style.position = 'relative';
            element.value.style.contain = 'none';

            const [width, height] = [getWidth(element.value), getHeight(element.value)];

            if (both || horizontal)
              element.value.style.width =
                width < defaultWidth ? width + 'px' : props.scrollWidth || defaultWidth + 'px';
            if (both || vertical)
              element.value.style.height =
                height < defaultHeight ? height + 'px' : props.scrollHeight || defaultHeight + 'px';

            content.value.style.minHeight = content.value.style.minWidth = '';
            content.value.style.position = '';
            element.value.style.contain = '';
          }
        });
      }
    }

    function setContentEl(el: any) {
      content.value = el || content.value;
    }

    function onScroll(event: Event) {
      emit('scroll', event);

      if (props.delay) {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        if (isPageChanged()) {
          if (!d_loading.value && props.showLoader) {
            const { isRangeChanged } = onScrollPositionChange(event);
            const changed = isRangeChanged || isPageChanged();

            if (changed) d_loading.value = true;
          }

          scrollTimeout = setTimeout(() => {
            onScrollChange(event);

            if (
              d_loading.value &&
              props.showLoader &&
              (!props.lazy || props.loading === undefined)
            ) {
              d_loading.value = false;
              page.value = getPageByFirst();
            }
          }, props.delay);
        }
      } else {
        onScrollChange(event);
      }
    }

    function onScrollPositionChange(event: any) {
      const target = event.target;

      if (!target) return;

      const both = isBoth();
      const horizontal = isHorizontal();
      const contentPos = getContentPosition();
      const itemSize = props.itemSize as any;
      const calculateScrollPos = (_pos: number, _cpos: number) =>
        _pos ? (_pos > _cpos ? _pos - _cpos : _pos) : 0;
      const calculateCurrentIndex = (_pos: number, _size: number) =>
        Math.floor(_pos / (_size || _pos));
      const calculateTriggerIndex = (
        _currentIndex: number,
        _first: number,
        _last: number,
        _num: number,
        _numT: number,
        _isScrollDownOrRight: boolean,
      ) => {
        return _currentIndex <= _numT
          ? _numT
          : _isScrollDownOrRight
            ? _last - _num - _numT
            : _first + _numT - 1;
      };
      const calculateFirst = (
        _currentIndex: number,
        _triggerIndex: number,
        _first: number,
        _last: number,
        _num: number,
        _numT: number,
        _isScrollDownOrRight: boolean,
        _isCols: boolean = false,
      ) => {
        if (_currentIndex <= _numT) return 0;
        const firstValue = Math.max(
          0,
          _isScrollDownOrRight
            ? _currentIndex < _triggerIndex
              ? _first
              : _currentIndex - _numT
            : _currentIndex > _triggerIndex
              ? _first
              : _currentIndex - 2 * _numT,
        );
        const maxFirst = getLast(firstValue, _isCols);
        if (firstValue > maxFirst) return maxFirst - _num;
        else return firstValue;
      };
      const calculateLast = (
        _currentIndex: number,
        _first: number,
        _last: number,
        _num: number,
        _numT: number,
        _isCols: boolean = false,
      ) => {
        let lastValue = _first + _num + 2 * _numT;
        if (_currentIndex >= _numT) lastValue += _numT + 1;
        return getLast(lastValue, _isCols);
      };

      const scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
      const scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);
      let newFirst: any = both ? { rows: 0, cols: 0 } : 0;
      let newLast = last.value;
      let rangeChanged = false;
      let newScrollPos = lastScrollPos;

      if (both) {
        const isScrollDown = lastScrollPos.top <= scrollTop;
        const isScrollRight = lastScrollPos.left <= scrollLeft;

        if (!props.appendOnly || (props.appendOnly && (isScrollDown || isScrollRight))) {
          const currentIndex = {
            rows: calculateCurrentIndex(scrollTop, itemSize[0]),
            cols: calculateCurrentIndex(scrollLeft, itemSize[1]),
          };
          const triggerIndex = {
            rows: calculateTriggerIndex(
              currentIndex.rows,
              first.value.rows,
              last.value.rows,
              numItemsInViewport.value.rows,
              d_numToleratedItems.value[0],
              isScrollDown,
            ),
            cols: calculateTriggerIndex(
              currentIndex.cols,
              first.value.cols,
              last.value.cols,
              numItemsInViewport.value.cols,
              d_numToleratedItems.value[1],
              isScrollRight,
            ),
          };

          newFirst = {
            rows: calculateFirst(
              currentIndex.rows,
              triggerIndex.rows,
              first.value.rows,
              last.value.rows,
              numItemsInViewport.value.rows,
              d_numToleratedItems.value[0],
              isScrollDown,
            ),
            cols: calculateFirst(
              currentIndex.cols,
              triggerIndex.cols,
              first.value.cols,
              last.value.cols,
              numItemsInViewport.value.cols,
              d_numToleratedItems.value[1],
              isScrollRight,
              true,
            ),
          };
          newLast = {
            rows: calculateLast(
              currentIndex.rows,
              newFirst.rows,
              last.value.rows,
              numItemsInViewport.value.rows,
              d_numToleratedItems.value[0],
            ),
            cols: calculateLast(
              currentIndex.cols,
              newFirst.cols,
              last.value.cols,
              numItemsInViewport.value.cols,
              d_numToleratedItems.value[1],
              true,
            ),
          };

          rangeChanged =
            newFirst.rows !== first.value.rows ||
            newLast.rows !== last.value.rows ||
            newFirst.cols !== first.value.cols ||
            newLast.cols !== last.value.cols ||
            isRangeChanged;
          newScrollPos = { top: scrollTop, left: scrollLeft };
        }
      } else {
        const scrollPos = horizontal ? scrollLeft : scrollTop;
        const isScrollDownOrRight = lastScrollPos <= scrollPos;

        if (!props.appendOnly || (props.appendOnly && isScrollDownOrRight)) {
          const currentIndex = calculateCurrentIndex(scrollPos, itemSize);
          const triggerIndex = calculateTriggerIndex(
            currentIndex,
            first.value,
            last.value,
            numItemsInViewport.value,
            d_numToleratedItems.value,
            isScrollDownOrRight,
          );

          newFirst = calculateFirst(
            currentIndex,
            triggerIndex,
            first.value,
            last.value,
            numItemsInViewport.value,
            d_numToleratedItems.value,
            isScrollDownOrRight,
          );
          newLast = calculateLast(
            currentIndex,
            newFirst,
            last.value,
            numItemsInViewport.value,
            d_numToleratedItems.value,
          );
          rangeChanged = newFirst !== first.value || newLast !== last.value || isRangeChanged;
          newScrollPos = scrollPos;
        }
      }

      return {
        first: newFirst,
        last: newLast,
        isRangeChanged: rangeChanged,
        scrollPos: newScrollPos,
      };
    }

    function onScrollChange(event: Event) {
      const {
        first: newFirst,
        last: newLast,
        isRangeChanged: rangeChanged,
        scrollPos,
      } = onScrollPositionChange(event as any);

      if (rangeChanged) {
        const newState = { first: newFirst, last: newLast };
        setContentPosition(newState);
        first.value = newFirst;
        last.value = newLast;
        lastScrollPos = scrollPos;
        emit('scroll-index-change', newState);

        if (props.lazy && isPageChanged(newFirst)) {
          const lazyLoadSt: any = {
            first: props.step
              ? Math.min(
                  getPageByFirst(newFirst) * props.step,
                  (props.items?.length || 0) - props.step,
                )
              : newFirst,
            last: Math.min(
              props.step ? (getPageByFirst(newFirst) + 1) * props.step : newLast,
              props.items?.length || 0,
            ),
          };
          const isLazyStateChanged =
            lazyLoadState.first !== lazyLoadSt.first || lazyLoadState.last !== lazyLoadSt.last;
          if (isLazyStateChanged) emit('lazy-load', lazyLoadSt);
          lazyLoadState = lazyLoadSt;
        }
      }
    }

    function setContentPosition(pos?: any) {
      if (content.value && !props.appendOnly) {
        const both = isBoth();
        const horizontal = isHorizontal();
        const firstVal = pos ? pos.first : first.value;
        const itemSize = props.itemSize as any;
        const calculateTranslateVal = (_first: number, _size: number) => _first * _size;
        const setTransform = (_x = 0, _y = 0) => {
          contentStyle.value = {
            ...contentStyle.value,
            transform: `translate3d(${_x}px, ${_y}px, 0)`,
          };
        };

        if (both) {
          setTransform(
            calculateTranslateVal(firstVal.cols, itemSize[1]),
            calculateTranslateVal(firstVal.rows, itemSize[0]),
          );
        } else {
          const translateVal = calculateTranslateVal(firstVal, itemSize);
          horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
        }
      }
    }

    function getPageByFirst(firstVal?: number) {
      return Math.floor(
        ((firstVal ?? first.value) + d_numToleratedItems.value * 4) / (props.step || 1),
      );
    }

    function isPageChanged(firstVal?: number) {
      return props.step && !props.lazy
        ? page.value !== getPageByFirst(firstVal ?? first.value)
        : true;
    }

    function onResize() {
      if (!isClient) return;

      if (resizeTimeout) clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        if (isVisible(element.value)) {
          const both = isBoth();
          const vertical = isVertical();
          const horizontal = isHorizontal();
          const [width, height] = [getWidth(element.value!), getHeight(element.value!)];
          const [isDiffWidth, isDiffHeight] = [width !== defaultWidth, height !== defaultHeight];
          const reinit = both
            ? isDiffWidth || isDiffHeight
            : horizontal
              ? isDiffWidth
              : vertical
                ? isDiffHeight
                : false;

          if (reinit) {
            d_numToleratedItems.value = props.numToleratedItems;
            defaultWidth = width;
            defaultHeight = height;
            init();
          }
        }
      }, props.resizeDelay);
    }

    function bindResizeListener() {
      if (!isClient) return;

      if (!resizeListener) {
        resizeListener = onResize;

        window.addEventListener('resize', resizeListener);
        window.addEventListener('orientationchange', resizeListener);

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => {
            onResize();
          });
          resizeObserver.observe(element.value!);
        }
      }
    }

    function unbindResizeListener() {
      if (!isClient) return;

      if (resizeListener) {
        window.removeEventListener('resize', resizeListener);
        window.removeEventListener('orientationchange', resizeListener);
        resizeListener = null;
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    }

    function getOptions(renderedIndex: number) {
      const count = (props.items || []).length;
      const index = isBoth() ? first.value.rows + renderedIndex : first.value + renderedIndex;

      return {
        index,
        count,
        first: index === 0,
        last: index === count - 1,
        even: index % 2 === 0,
        odd: index % 2 !== 0,
      };
    }

    function getLoaderOptions(index: number, extOptions?: any) {
      const count = loaderArr.value.length;
      return {
        index,
        count,
        first: index === 0,
        last: index === count - 1,
        even: index % 2 === 0,
        odd: index % 2 !== 0,
        ...extOptions,
      };
    }

    // 修复源项目 bug：d_numItemsInViewport_cols 在 return 之后定义，TS 严格模式下会报错
    // 必须移到 return 之前
    function d_numItemsInViewport_cols() {
      return (numItemsInViewport.value as any).cols;
    }

    onMounted(() => {
      viewInit();
      lastScrollPos = isBoth() ? { top: 0, left: 0 } : 0;
      lazyLoadState = lazyLoadState || {};
    });

    onUpdated(() => {
      if (!initialized) viewInit();
    });

    onBeforeUnmount(() => {
      unbindResizeListener();
      initialized = false;
    });

    expose({
      scrollTo,
      scrollToIndex,
      getRenderedRange,
      getOptions,
      getLoaderOptions,
      element,
      content,
    });

    return () =>
      wrapSSR(
        props.disabled ? (
          <>
            {slots.default?.()}
            {slots.content?.({
              items: props.items,
              rows: props.items,
              columns: loadedColumns.value,
            })}
          </>
        ) : (
          <div
            ref={elementRef}
            class={containerClass.value}
            tabindex={props.tabindex}
            style={props.style}
            onScroll={onScroll}
          >
            {slots.content ? (
              slots.content({
                styleClass: contentClass.value,
                items: loadedItems.value,
                getItemOptions: getOptions,
                loading: d_loading.value,
                getLoaderOptions,
                itemSize: props.itemSize,
                rows: loadedRows.value,
                columns: loadedColumns.value,
                contentRef,
                spacerStyle: spacerStyle.value,
                contentStyle: contentStyle.value,
                vertical: isVertical(),
                horizontal: isHorizontal(),
                both: isBoth(),
              })
            ) : (
              <div ref={contentRef} class={contentClass.value} style={contentStyle.value}>
                {loadedItems.value.map((item, index) =>
                  slots.item?.({ item, options: getOptions(index), index }),
                )}
              </div>
            )}
            {props.showSpacer ? (
              <div class={`${prefixCls.value}-spacer`} style={spacerStyle.value} />
            ) : null}
            {!props.loaderDisabled && props.showLoader && d_loading.value ? (
              <div class={loaderClass.value}>
                {slots.loader ? (
                  loaderArr.value.map((_, index) =>
                    slots.loader?.({
                      options: getLoaderOptions(
                        index,
                        isBoth() && { numCols: d_numItemsInViewport_cols() },
                      ),
                    }),
                  )
                ) : slots.loadingicon ? (
                  slots.loadingicon()
                ) : (
                  <SpinnerIcon spin class={`${prefixCls.value}-loading-icon`} />
                )}
              </div>
            ) : null}
          </div>
        ),
      );
  },
});
