/// <reference types="vue/jsx" />
import { getHeight, getOuterHeight, getOuterWidth, getWidth, isRTL } from '@xiaoye-ui/utils/dom';
import { isArray, isNotEmpty } from '@xiaoye-ui/utils/object';
import {
  onMounted,
  onBeforeUnmount,
  onUpdated,
  ref,
  computed,
  defineComponent,
  cloneVNode,
} from 'vue';
import { splitterProps } from './splitterTypes';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import type { CustomSlotsType } from '../_util/type';
import useStyle from './style';

// SSR 安全判断
const isClient = typeof window !== 'undefined' && !!window.document;

export default defineComponent({
  name: 'XYSplitter',
  inheritAttrs: false,
  __XY_SPLITTER: true,
  props: initDefaultProps(splitterProps(), {}),
  slots: Object as CustomSlotsType<{
    default?: any;
  }>,
  emits: ['resizestart', 'resizeend', 'resize'],
  setup(props, { slots, emit, expose }) {
    const { prefixCls } = useConfigInject('splitter', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    let panelVNodes: any[] = [];

    const resizing = ref(false);

    let mouseMoveListener: ((event: MouseEvent) => void) | null = null;
    let mouseUpListener: ((event: MouseEvent) => void) | null = null;
    let touchMoveListener: ((event: TouchEvent) => void) | null = null;
    let touchEndListener: ((event: TouchEvent) => void) | null = null;
    let size: number | null = null;
    let gutterElement: HTMLElement | null = null;
    let startPos: number | null = null;
    let prevPanelElement: HTMLElement | null = null;
    let nextPanelElement: HTMLElement | null = null;
    let nextPanelSize: number | null = null;
    let prevPanelSize: number | null = null;
    let panelSizes: number[] | null = null;
    let prevPanelIndex: number | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    const prevSize = ref<number | null>(null);
    const gutter = ref<HTMLElement[]>([]);

    // 修复源项目 bug：硬编码 'SplitterPanel' → 'XYSplitterPanel'
    const isSplitterPanel = (child: any) => child.type?.name === 'XYSplitterPanel';

    const getPanelSize = (panel: any) => {
      const panelSize = panel.props && isNotEmpty(panel.props.size) ? panel.props.size : null;
      return panelSize !== null ? panelSize : 100 / panelVNodes.length;
    };

    const getPanel = (vnodes: any[]) => {
      const result: any[] = [];

      vnodes.forEach(child => {
        if (isSplitterPanel(child)) {
          result.push(child);
        } else if (child.children instanceof Array) {
          child.children.forEach((nestedChild: any) => {
            if (isSplitterPanel(nestedChild)) {
              result.push(nestedChild);
            }
          });
        }
      });

      return result;
    };

    const panels = () => {
      panelVNodes = getPanel(slots.default?.() || []);
      return panelVNodes;
    };

    const horizontal = computed(() => props.layout === 'horizontal');

    const splitterClasses = computed(() => [
      prefixCls.value,
      `${prefixCls.value}-${props.layout}`,
      { [`${prefixCls.value}-resizing`]: resizing.value },
      hashId.value,
    ]);

    const gutterClasses = computed(() => [
      `${prefixCls.value}-gutter`,
      { [`${prefixCls.value}-gutter-resizing`]: resizing.value },
    ]);

    const gutterStyle = computed(() => {
      if (horizontal.value) return { width: props.gutterSize + 'px' };
      return { height: props.gutterSize + 'px' };
    });

    // 修复源项目 bug：去除 getVNodeProp 依赖，直接读 props
    const prevPanelMinSize = computed(() => {
      const pMinSize = panelVNodes[prevPanelIndex!]?.props?.minSize;
      return typeof pMinSize === 'number' ? pMinSize : 0;
    });

    const nextPanelMinSize = computed(() => {
      const nMinSize = panelVNodes[prevPanelIndex! + 1]?.props?.minSize;
      return typeof nMinSize === 'number' ? nMinSize : 0;
    });

    const initializePanels = () => {
      if (panelVNodes && panelVNodes.length) {
        let initialized = false;

        if (isStateful()) {
          initialized = restoreState();
        }

        if (!initialized) {
          const container = gutter.value[0]?.parentElement;
          if (!container) return;

          const children = Array.from(container.children).filter(child =>
            (child as HTMLElement).classList.contains(`${prefixCls.value}-panel`),
          );
          const _panelSizes: number[] = [];

          panelVNodes.forEach((panel, i) => {
            const panelSize = getPanelSize(panel);
            _panelSizes[i] = panelSize;
            (children[i] as HTMLElement).style.flexBasis =
              'calc(' + panelSize + '% - ' + (panelVNodes.length - 1) * props.gutterSize + 'px)';
          });

          panelSizes = _panelSizes;
          prevSize.value = parseFloat(_panelSizes[0].toString()).toFixed(4) as unknown as number;
        }
      }
    };

    const onResizeStart = (event: any, index: number, isKeyDown?: boolean) => {
      const target = event.target;

      gutterElement = (event.currentTarget || target?.parentElement) as HTMLElement;
      const el = gutter.value[0]?.parentElement as HTMLElement;
      size = horizontal.value ? getWidth(el) : getHeight(el);

      if (!isKeyDown) {
        startPos =
          props.layout === 'horizontal'
            ? event.pageX || event.changedTouches?.[0]?.pageX
            : event.pageY || event.changedTouches?.[0]?.pageY;
      }

      prevPanelElement = gutterElement.previousElementSibling as HTMLElement;
      nextPanelElement = gutterElement.nextElementSibling as HTMLElement;

      if (isKeyDown) {
        prevPanelSize = horizontal.value
          ? getOuterWidth(prevPanelElement, true)
          : getOuterHeight(prevPanelElement, true);
        nextPanelSize = horizontal.value
          ? getOuterWidth(nextPanelElement, true)
          : getOuterHeight(nextPanelElement, true);
      } else {
        prevPanelSize =
          (100 *
            (horizontal.value
              ? getOuterWidth(prevPanelElement, true)
              : getOuterHeight(prevPanelElement, true))) /
          size!;
        nextPanelSize =
          (100 *
            (horizontal.value
              ? getOuterWidth(nextPanelElement, true)
              : getOuterHeight(nextPanelElement, true))) /
          size!;
      }

      prevPanelIndex = index;
      emit('resizestart', { originalEvent: event, sizes: panelSizes! });
      resizing.value = true;
    };

    const onResize = (event: any, step?: number, isKeyDown?: boolean) => {
      let newPos: number;
      let newPrevPanelSize: number;
      let newNextPanelSize: number;

      if (isKeyDown) {
        if (horizontal.value) {
          newPrevPanelSize = (100 * (prevPanelSize! + step!)) / size!;
          newNextPanelSize = (100 * (nextPanelSize! - step!)) / size!;
        } else {
          newPrevPanelSize = (100 * (prevPanelSize! - step!)) / size!;
          newNextPanelSize = (100 * (nextPanelSize! + step!)) / size!;
        }
      } else {
        if (horizontal.value) {
          const el = gutter.value[0]?.parentElement as HTMLElement;
          if (isRTL(el)) {
            newPos = ((startPos! - event.pageX) * 100) / size!;
          } else {
            newPos = ((event.pageX - startPos!) * 100) / size!;
          }
        } else {
          newPos = ((event.pageY - startPos!) * 100) / size!;
        }

        newPrevPanelSize = prevPanelSize! + newPos;
        newNextPanelSize = nextPanelSize! - newPos;
      }

      if (!validateResize(newPrevPanelSize, newNextPanelSize)) {
        newPrevPanelSize = Math.min(
          Math.max(prevPanelMinSize.value, newPrevPanelSize),
          100 - nextPanelMinSize.value,
        );
        newNextPanelSize = Math.min(
          Math.max(nextPanelMinSize.value, newNextPanelSize),
          100 - prevPanelMinSize.value,
        );
      }

      prevPanelElement!.style.flexBasis =
        'calc(' + newPrevPanelSize + '% - ' + (panelVNodes.length - 1) * props.gutterSize + 'px)';
      nextPanelElement!.style.flexBasis =
        'calc(' + newNextPanelSize + '% - ' + (panelVNodes.length - 1) * props.gutterSize + 'px)';
      panelSizes![prevPanelIndex!] = newPrevPanelSize;
      panelSizes![prevPanelIndex! + 1] = newNextPanelSize;
      prevSize.value = parseFloat(newPrevPanelSize.toString()).toFixed(4) as unknown as number;

      emit('resize', { originalEvent: event, sizes: panelSizes! });
    };

    const onResizeEnd = (event: any) => {
      if (isStateful()) {
        saveState();
      }

      emit('resizeend', { originalEvent: event, sizes: panelSizes! });
      resizing.value = false;
      clear();
    };

    const repeat = (event: any, index: number, step: number) => {
      onResizeStart(event, index, true);
      onResize(event, step, true);
    };

    const setTimer = (event: any, index: number, step: number) => {
      if (!timer) {
        timer = setInterval(() => {
          repeat(event, index, step);
        }, 40);
      }
    };

    const clearTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const onGutterKeyUp = () => {
      clearTimer();
      onResizeEnd({});
    };

    const onGutterKeyDown = (event: KeyboardEvent, index: number) => {
      switch (event.code) {
        case 'ArrowLeft': {
          if (props.layout === 'horizontal') {
            setTimer(event, index, props.step * -1);
          }
          event.preventDefault();
          break;
        }
        case 'ArrowRight': {
          if (props.layout === 'horizontal') {
            setTimer(event, index, props.step);
          }
          event.preventDefault();
          break;
        }
        case 'ArrowDown': {
          if (props.layout === 'vertical') {
            setTimer(event, index, props.step * -1);
          }
          event.preventDefault();
          break;
        }
        case 'ArrowUp': {
          if (props.layout === 'vertical') {
            setTimer(event, index, props.step);
          }
          event.preventDefault();
          break;
        }
        default:
          break;
      }
    };

    const onGutterMouseDown = (event: MouseEvent, index: number) => {
      onResizeStart(event, index);
      bindMouseListeners();
    };

    const onGutterTouchStart = (event: TouchEvent, index: number) => {
      onResizeStart(event, index);
      bindTouchListeners();
      event.preventDefault();
    };

    const onGutterTouchMove = (event: TouchEvent) => {
      onResize(event);
      event.preventDefault();
    };

    const onGutterTouchEnd = (event: TouchEvent) => {
      resizeEnd(event);
      unbindTouchListeners();
      event.preventDefault();
    };

    const resizeEnd = (event: TouchEvent) => {
      onResizeEnd(event);
    };

    // SSR 安全：document.addEventListener 加守卫
    const bindMouseListeners = () => {
      if (!isClient) return;

      if (!mouseMoveListener) {
        mouseMoveListener = (event: MouseEvent) => onResize(event);
        document.addEventListener('mousemove', mouseMoveListener);
      }

      if (!mouseUpListener) {
        mouseUpListener = (event: MouseEvent) => {
          onResizeEnd(event);
          unbindMouseListeners();
        };
        document.addEventListener('mouseup', mouseUpListener);
      }
    };

    const bindTouchListeners = () => {
      if (!isClient) return;

      if (!touchMoveListener) {
        touchMoveListener = (event: TouchEvent) => onResize(event.changedTouches[0]);
        document.addEventListener('touchmove', touchMoveListener);
      }

      if (!touchEndListener) {
        touchEndListener = (event: TouchEvent) => {
          resizeEnd(event);
          unbindTouchListeners();
        };
        document.addEventListener('touchend', touchEndListener);
      }
    };

    const validateResize = (newPrevPanelSize: number, newNextPanelSize: number) => {
      if (newPrevPanelSize > 100 || newPrevPanelSize < 0) return false;
      if (newNextPanelSize > 100 || newNextPanelSize < 0) return false;

      if (prevPanelMinSize.value > newPrevPanelSize) {
        return false;
      }

      if (nextPanelMinSize.value > newNextPanelSize) {
        return false;
      }

      return true;
    };

    const unbindMouseListeners = () => {
      if (!isClient) return;

      if (mouseMoveListener) {
        document.removeEventListener('mousemove', mouseMoveListener);
        mouseMoveListener = null;
      }

      if (mouseUpListener) {
        document.removeEventListener('mouseup', mouseUpListener);
        mouseUpListener = null;
      }
    };

    const unbindTouchListeners = () => {
      if (!isClient) return;

      if (touchMoveListener) {
        document.removeEventListener('touchmove', touchMoveListener);
        touchMoveListener = null;
      }

      if (touchEndListener) {
        document.removeEventListener('touchend', touchEndListener);
        touchEndListener = null;
      }
    };

    const clear = () => {
      size = null;
      startPos = null;
      prevPanelElement = null;
      nextPanelElement = null;
      prevPanelSize = null;
      nextPanelSize = null;
      gutterElement = null;
      prevPanelIndex = null;
    };

    const isStateful = () => props.stateKey != null;

    // SSR 安全：window.localStorage/sessionStorage 加守卫
    const getStorage = (): Storage | null => {
      if (!isClient) return null;
      switch (props.stateStorage) {
        case 'local':
          return window.localStorage;
        case 'session':
          return window.sessionStorage;
        default:
          throw new Error(
            props.stateStorage +
              ' is not a valid value for the state storage, supported values are "local" and "session".',
          );
      }
    };

    const saveState = () => {
      if (isArray(panelSizes)) {
        const storage = getStorage();
        storage?.setItem(props.stateKey!, JSON.stringify(panelSizes));
      }
    };

    const restoreState = () => {
      const storage = getStorage();
      if (!storage) return false;

      const stateString = storage.getItem(props.stateKey!);

      if (stateString) {
        panelSizes = JSON.parse(stateString);
        const container = gutter.value[0]?.parentElement;
        if (!container) return false;

        const children = Array.from(container.children).filter(child =>
          (child as HTMLElement).classList.contains(`${prefixCls.value}-panel`),
        );

        children.forEach((child, i) => {
          (child as HTMLElement).style.flexBasis =
            'calc(' + panelSizes![i] + '% - ' + (panelVNodes.length - 1) * props.gutterSize + 'px)';
        });

        return true;
      }

      return false;
    };

    onMounted(() => {
      initializePanels();
    });

    let lastPanelSizeConfig = '';

    onUpdated(() => {
      const currentConfig = panelVNodes.map(panel => getPanelSize(panel)).join(',');

      if (currentConfig !== lastPanelSizeConfig) {
        lastPanelSizeConfig = currentConfig;
        initializePanels();
      }
    });

    onBeforeUnmount(() => {
      clear();
      clearTimer();
      unbindMouseListeners();
      unbindTouchListeners();
    });

    expose({
      onGutterMouseDown,
    });

    return () =>
      wrapSSR(
        <div class={splitterClasses.value} data-resizing={resizing.value}>
          {panels().map((panel, i) => [
            cloneVNode(panel, { tabindex: '-1' }),
            i !== panelVNodes.length - 1 && (
              <div
                key={`gutter-${i}`}
                ref={(el: any) => {
                  if (el) gutter.value[i] = el;
                }}
                class={gutterClasses.value}
                tabindex="-1"
                onMousedown={(e: MouseEvent) => onGutterMouseDown(e, i)}
                onTouchstart={(e: TouchEvent) => onGutterTouchStart(e, i)}
                onTouchmove={(e: TouchEvent) => onGutterTouchMove(e)}
                onTouchend={(e: TouchEvent) => onGutterTouchEnd(e)}
                data-gutter-resizing={resizing.value}
              >
                <div
                  class={`${prefixCls.value}-gutter-handle`}
                  role="separator"
                  tabindex="0"
                  style={gutterStyle.value}
                  aria-orientation={props.layout}
                  aria-valuenow={prevSize.value}
                  onKeyup={onGutterKeyUp}
                  onKeydown={(e: KeyboardEvent) => onGutterKeyDown(e, i)}
                />
              </div>
            ),
          ])}
        </div>,
      );
  },
});
