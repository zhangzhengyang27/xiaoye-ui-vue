/// <reference types="vue/jsx" />
import {
  computed,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  Transition,
  watch,
} from 'vue';
import { absolutePosition, isTouchDevice, relativePosition } from '@xiaoye-ui/utils/dom';
import { ConnectedOverlayScrollHandler } from '@xiaoye-ui/core/utils';
import OverlayEventBus from '../_util/overlayEventBus';
import Portal from '../portal';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../_util/props-util';
import colorPickerProps from './colorPickerTypes';
import type { ColorPickerHSBValue, ColorPickerRGBValue } from './colorPickerTypes';

// SSR 安全判断
const isClient = typeof window !== 'undefined' && !!window.document;

// 内联 ZIndex 管理器（避免 @xiaoye-ui/utils/zindex 子路径在 Vite 中的解析问题）
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
  name: 'XYColorPicker',
  inheritAttrs: false,
  __XY_COLOR_PICKER: true,
  props: initDefaultProps(colorPickerProps(), {}),
  emits: ['change', 'show', 'hide', 'update:modelValue', 'value-change'],
  setup(props, { expose, emit }) {
    const { prefixCls } = useConfigInject('colorpicker', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);

    const $xiaoyeUI = inject<any>('$xiaoyeUI', undefined);

    // Refs
    const containerEl = ref<HTMLElement>();
    const inputEl = ref<HTMLInputElement>();
    const pickerEl = ref<HTMLElement>();
    const colorSelectorEl = ref<HTMLElement>();
    const colorBackgroundEl = ref<HTMLElement>();
    const colorHandleEl = ref<HTMLElement>();
    const hueViewEl = ref<HTMLElement>();
    const hueHandleEl = ref<HTMLElement>();

    // State
    const overlayVisible = ref(false);
    const isDragging = ref(false);
    const hsbValue = ref<ColorPickerHSBValue | null>(null);
    const localHue = ref(0);
    const selfUpdate = ref(false);
    const d_value = ref(props.defaultValue !== undefined ? props.defaultValue : props.modelValue);

    // Dragging state
    let hueDragging = false;
    let colorDragging = false;

    // Listeners
    let outsideClickListener: ((event: MouseEvent) => void) | null = null;
    let documentMouseMoveListener: ((event: MouseEvent) => void) | null = null;
    let documentMouseUpListener: (() => void) | null = null;
    let scrollHandler: ConnectedOverlayScrollHandler | null = null;
    let resizeListener: (() => void) | null = null;

    const disabled = computed(() => props.disabled);

    const rootClasses = computed(() => ({
      [hashId.value]: true,
      'xy-colorpicker-inline': props.inline,
      'xy-colorpicker-disabled': disabled.value,
      'xy-colorpicker-dragging': isDragging.value,
    }));

    // ============ 颜色转换函数（纯函数，无 DOM 依赖） ============
    function validateHSB(hsb: ColorPickerHSBValue): ColorPickerHSBValue {
      return {
        h: Math.min(360, Math.max(0, hsb.h)),
        s: Math.min(100, Math.max(0, hsb.s)),
        b: Math.min(100, Math.max(0, hsb.b)),
      };
    }

    function HEXtoRGB(hex: string): ColorPickerRGBValue {
      const hexValue = parseInt(hex.indexOf('#') > -1 ? hex.substring(1) : hex, 16);
      return {
        r: hexValue >> 16,
        g: (hexValue & 0x00ff00) >> 8,
        b: hexValue & 0x0000ff,
      };
    }

    function RGBtoHSB(rgb: ColorPickerRGBValue): ColorPickerHSBValue {
      const hsb: ColorPickerHSBValue = { h: 0, s: 0, b: 0 };
      const min = Math.min(rgb.r, rgb.g, rgb.b);
      const max = Math.max(rgb.r, rgb.g, rgb.b);
      const delta = max - min;

      hsb.b = max;
      hsb.s = max !== 0 ? (255 * delta) / max : 0;

      if (hsb.s !== 0) {
        if (rgb.r === max) {
          hsb.h = (rgb.g - rgb.b) / delta;
        } else if (rgb.g === max) {
          hsb.h = 2 + (rgb.b - rgb.r) / delta;
        } else {
          hsb.h = 4 + (rgb.r - rgb.g) / delta;
        }
      } else {
        hsb.h = -1;
      }

      hsb.h *= 60;
      if (hsb.h < 0) {
        hsb.h += 360;
      }

      hsb.s *= 100 / 255;
      hsb.b *= 100 / 255;

      return hsb;
    }

    function HEXtoHSB(hex: string): ColorPickerHSBValue {
      return RGBtoHSB(HEXtoRGB(hex));
    }

    function HSBtoRGB(hsb: ColorPickerHSBValue): ColorPickerRGBValue {
      const rgb: ColorPickerRGBValue = { r: 0, g: 0, b: 0 };
      let h = Math.round(hsb.h);
      const s = Math.round((hsb.s * 255) / 100);
      const v = Math.round((hsb.b * 255) / 100);

      if (s === 0) {
        rgb.r = v;
        rgb.g = v;
        rgb.b = v;
      } else {
        const t1 = v;
        const t2 = ((255 - s) * v) / 255;
        const t3 = ((t1 - t2) * (h % 60)) / 60;

        if (h === 360) h = 0;

        if (h < 60) {
          rgb.r = t1;
          rgb.b = t2;
          rgb.g = t2 + t3;
        } else if (h < 120) {
          rgb.g = t1;
          rgb.b = t2;
          rgb.r = t1 - t3;
        } else if (h < 180) {
          rgb.g = t1;
          rgb.r = t2;
          rgb.b = t2 + t3;
        } else if (h < 240) {
          rgb.b = t1;
          rgb.r = t2;
          rgb.g = t1 - t3;
        } else if (h < 300) {
          rgb.b = t1;
          rgb.g = t2;
          rgb.r = t2 + t3;
        } else if (h < 360) {
          rgb.r = t1;
          rgb.g = t2;
          rgb.b = t1 - t3;
        } else {
          rgb.r = 0;
          rgb.g = 0;
          rgb.b = 0;
        }
      }

      return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
    }

    function RGBtoHEX(rgb: ColorPickerRGBValue): string {
      const hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
      for (const key in hex) {
        if (hex[key].length === 1) {
          hex[key] = '0' + hex[key];
        }
      }
      return hex.join('');
    }

    function HSBtoHEX(hsb: ColorPickerHSBValue): string {
      return RGBtoHEX(HSBtoRGB(hsb));
    }

    function toHSB(value: any): ColorPickerHSBValue {
      let hsb: ColorPickerHSBValue;
      if (value) {
        switch (props.format) {
          case 'hex':
            hsb = HEXtoHSB(value);
            break;
          case 'rgb':
            hsb = RGBtoHSB(value);
            break;
          case 'hsb':
            hsb = value;
            break;
          default:
            hsb = HEXtoHSB(props.defaultColor);
            break;
        }
      } else {
        hsb = HEXtoHSB(props.defaultColor);
      }

      if (hsb.s === 0 || hsb.b === 0) {
        hsb.h = localHue.value;
      } else {
        localHue.value = hsb.h;
      }

      return hsb;
    }

    // ============ DOM 操作函数 ============
    function pickColor(event: MouseEvent | TouchEvent) {
      if (!isClient || !colorSelectorEl.value) return;

      const rect = colorSelectorEl.value.getBoundingClientRect();
      const top =
        rect.top +
        (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
      const left = rect.left + document.body.scrollLeft;
      const pageX =
        'touches' in event
          ? (event as TouchEvent).changedTouches[0].pageX
          : (event as MouseEvent).pageX;
      const pageY =
        'touches' in event
          ? (event as TouchEvent).changedTouches[0].pageY
          : (event as MouseEvent).pageY;

      const saturation = Math.floor((100 * Math.max(0, Math.min(150, pageX - left))) / 150);
      const brightness = Math.floor((100 * (150 - Math.max(0, Math.min(150, pageY - top)))) / 150);

      hsbValue.value = validateHSB({
        h: localHue.value,
        s: saturation,
        b: brightness,
      });

      selfUpdate.value = true;
      updateColorHandle();
      updateInput();
      updateModel(event);
    }

    function pickHue(event: MouseEvent | TouchEvent) {
      if (!isClient || !hueViewEl.value) return;

      const top =
        hueViewEl.value.getBoundingClientRect().top +
        (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
      const pageY =
        'touches' in event
          ? (event as TouchEvent).changedTouches[0].pageY
          : (event as MouseEvent).pageY;

      localHue.value = Math.floor((360 * (150 - Math.max(0, Math.min(150, pageY - top)))) / 150);

      hsbValue.value = validateHSB({
        h: localHue.value,
        s: hsbValue.value?.s ?? 0,
        b: hsbValue.value?.b ?? 0,
      });

      selfUpdate.value = true;
      updateColorSelector();
      updateHue();
      updateModel(event);
      updateInput();
    }

    function updateModel(event: MouseEvent | TouchEvent) {
      let value: any;
      switch (props.format) {
        case 'hex':
          value = HSBtoHEX(hsbValue.value!);
          break;
        case 'rgb':
          value = HSBtoRGB(hsbValue.value!);
          break;
        case 'hsb':
          value = hsbValue.value;
          break;
        default:
          break;
      }

      writeValue(value, event);
      emit('change', { event: event as unknown as Event, value });
    }

    function writeValue(value: any, _event: MouseEvent | TouchEvent) {
      d_value.value = value;
      emit('update:modelValue', value);
      emit('value-change', value);
    }

    function updateColorSelector() {
      if (colorSelectorEl.value) {
        const hsbVal = validateHSB({
          h: hsbValue.value?.h ?? 0,
          s: 100,
          b: 100,
        });
        colorSelectorEl.value.style.backgroundColor = '#' + HSBtoHEX(hsbVal);
      }
    }

    function updateColorHandle() {
      if (colorHandleEl.value) {
        colorHandleEl.value.style.left = Math.floor((150 * (hsbValue.value?.s ?? 0)) / 100) + 'px';
        colorHandleEl.value.style.top =
          Math.floor((150 * (100 - (hsbValue.value?.b ?? 0))) / 100) + 'px';
      }
    }

    function updateHue() {
      if (hueHandleEl.value) {
        hueHandleEl.value.style.top =
          Math.floor(150 - (150 * (hsbValue.value?.h ?? 0)) / 360) + 'px';
      }
    }

    function updateInput() {
      if (inputEl.value && hsbValue.value) {
        inputEl.value.style.backgroundColor = '#' + HSBtoHEX(hsbValue.value);
      }
    }

    function updateUI() {
      updateHue();
      updateColorHandle();
      updateInput();
      updateColorSelector();
    }

    // ============ Overlay 管理 ============
    function onOverlayEnter(el: HTMLElement) {
      updateUI();
      alignOverlay();
      bindOutsideClickListener();
      bindScrollListener();
      bindResizeListener();

      if (props.autoZIndex) {
        const zIndex = ($xiaoyeUI as any)?.config?.zIndex?.overlay ?? 0;
        ZIndex.set('overlay', el, props.baseZIndex || zIndex);
      }

      emit('show');
    }

    function onOverlayLeave() {
      unbindOutsideClickListener();
      unbindScrollListener();
      unbindResizeListener();
      emit('hide');
    }

    function onOverlayAfterLeave(el: HTMLElement) {
      if (props.autoZIndex) {
        ZIndex.clear(el);
      }
    }

    function alignOverlay() {
      if (!isClient || !inputEl.value || !pickerEl.value) return;

      if (props.appendTo === 'self') {
        relativePosition(pickerEl.value, inputEl.value);
      } else {
        absolutePosition(pickerEl.value, inputEl.value);
      }
    }

    function onInputClick() {
      if (disabled.value) return;
      overlayVisible.value = !overlayVisible.value;
    }

    function onInputKeydown(event: KeyboardEvent) {
      switch (event.code) {
        case 'Space':
          overlayVisible.value = !overlayVisible.value;
          event.preventDefault();
          break;
        case 'Escape':
        case 'Tab':
          overlayVisible.value = false;
          break;
        default:
          break;
      }
    }

    function onInputBlur(_event: FocusEvent) {
      // no-op for compatibility
    }

    function onColorMousedown(event: MouseEvent | TouchEvent) {
      if (disabled.value) return;
      bindDragListeners();
      onColorDragStart(event);
    }

    function onColorDragStart(event: MouseEvent | TouchEvent) {
      if (disabled.value) return;
      colorDragging = true;
      pickColor(event);
      isDragging.value = true;
      event.preventDefault?.();
    }

    function onDrag(event: MouseEvent | TouchEvent) {
      if (colorDragging) {
        pickColor(event);
        event.preventDefault?.();
      }
      if (hueDragging) {
        pickHue(event);
        event.preventDefault?.();
      }
    }

    function onDragEnd() {
      colorDragging = false;
      hueDragging = false;
      isDragging.value = false;
      unbindDragListeners();
    }

    function onHueMousedown(event: MouseEvent | TouchEvent) {
      if (disabled.value) return;
      bindDragListeners();
      onHueDragStart(event);
    }

    function onHueDragStart(event: MouseEvent | TouchEvent) {
      if (disabled.value) return;
      hueDragging = true;
      pickHue(event);
      isDragging.value = true;
      event.preventDefault?.();
    }

    function isInputClicked(event: MouseEvent) {
      return inputEl.value && inputEl.value.isSameNode(event.target as Node);
    }

    // ============ 事件监听器绑定/解绑 ============
    function bindDragListeners() {
      bindDocumentMouseMoveListener();
      bindDocumentMouseUpListener();
    }

    function unbindDragListeners() {
      unbindDocumentMouseMoveListener();
      unbindDocumentMouseUpListener();
    }

    function bindOutsideClickListener() {
      if (!isClient) return;
      if (!outsideClickListener) {
        outsideClickListener = (event: MouseEvent) => {
          if (
            overlayVisible.value &&
            pickerEl.value &&
            !pickerEl.value.contains(event.target as Node) &&
            !isInputClicked(event)
          ) {
            overlayVisible.value = false;
          }
        };
        document.addEventListener('click', outsideClickListener, true);
      }
    }

    function unbindOutsideClickListener() {
      if (!isClient) return;
      if (outsideClickListener) {
        document.removeEventListener('click', outsideClickListener, true);
        outsideClickListener = null;
      }
    }

    function bindScrollListener() {
      if (!isClient) return;
      if (!scrollHandler && containerEl.value) {
        scrollHandler = new ConnectedOverlayScrollHandler(containerEl.value, () => {
          if (overlayVisible.value) {
            overlayVisible.value = false;
          }
        });
      }
      scrollHandler?.bindScrollListener();
    }

    function unbindScrollListener() {
      if (!isClient) return;
      scrollHandler?.unbindScrollListener();
    }

    function bindResizeListener() {
      if (!isClient) return;
      if (!resizeListener) {
        resizeListener = () => {
          if (overlayVisible.value && !isTouchDevice()) {
            overlayVisible.value = false;
          }
        };
        window.addEventListener('resize', resizeListener);
      }
    }

    function unbindResizeListener() {
      if (!isClient) return;
      if (resizeListener) {
        window.removeEventListener('resize', resizeListener);
        resizeListener = null;
      }
    }

    function bindDocumentMouseMoveListener() {
      if (!isClient) return;
      if (!documentMouseMoveListener) {
        documentMouseMoveListener = (event: MouseEvent) => onDrag(event);
        document.addEventListener('mousemove', documentMouseMoveListener);
      }
    }

    function unbindDocumentMouseMoveListener() {
      if (!isClient) return;
      if (documentMouseMoveListener) {
        document.removeEventListener('mousemove', documentMouseMoveListener);
        documentMouseMoveListener = null;
      }
    }

    function bindDocumentMouseUpListener() {
      if (!isClient) return;
      if (!documentMouseUpListener) {
        documentMouseUpListener = () => onDragEnd();
        document.addEventListener('mouseup', documentMouseUpListener);
      }
    }

    function unbindDocumentMouseUpListener() {
      if (!isClient) return;
      if (documentMouseUpListener) {
        document.removeEventListener('mouseup', documentMouseUpListener);
        documentMouseUpListener = null;
      }
    }

    function onOverlayClick(event: MouseEvent) {
      OverlayEventBus.emit('overlay-click', {
        originalEvent: event,
        target: containerEl.value,
      });
    }

    // ============ 生命周期 ============
    watch(
      () => props.modelValue,
      newValue => {
        d_value.value = newValue;
        hsbValue.value = toHSB(newValue);
        if (selfUpdate.value) selfUpdate.value = false;
        else updateUI();
      },
      { immediate: true },
    );

    watch(
      () => props.defaultValue,
      newValue => {
        d_value.value = newValue;
      },
    );

    onMounted(() => {
      updateUI();
    });

    onBeforeUnmount(() => {
      unbindOutsideClickListener();
      unbindDragListeners();
      unbindResizeListener();
      unbindScrollListener();
      scrollHandler = null;

      if (pickerEl.value && props.autoZIndex) {
        ZIndex.clear(pickerEl.value);
      }
    });

    // Expose for testing
    expose({
      onInputClick,
      onColorMousedown,
      onHueMousedown,
      overlayVisible,
      hsbValue,
      pickColor,
      pickHue,
      updateUI,
      writeValue,
      d_value,
    });

    return () =>
      wrapSSR(
        <div ref={containerEl} class={['xy-colorpicker', rootClasses.value]}>
          {!props.inline && (
            <input
              ref={inputEl}
              id={props.inputId ?? undefined}
              type="text"
              class="xy-colorpicker-preview"
              readonly
              tabindex={props.tabindex ?? undefined}
              disabled={props.disabled}
              onClick={onInputClick}
              onKeydown={onInputKeydown}
              onBlur={onInputBlur}
            />
          )}
          <Portal appendTo={props.appendTo} disabled={props.inline}>
            <Transition
              name="xy-anchored-overlay"
              onEnter={onOverlayEnter}
              onLeave={onOverlayLeave}
              onAfterLeave={onOverlayAfterLeave}
            >
              {(props.inline || overlayVisible.value) && (
                <div
                  ref={pickerEl}
                  class={['xy-colorpicker-panel', props.panelClass, props.overlayClass]}
                  onClick={onOverlayClick}
                >
                  <div class="xy-colorpicker-content">
                    <div
                      ref={colorSelectorEl}
                      class="xy-colorpicker-color-selector"
                      onMousedown={onColorMousedown}
                      onTouchstart={onColorDragStart}
                      onTouchmove={onDrag}
                      onTouchend={onDragEnd}
                    >
                      <div ref={colorBackgroundEl} class="xy-colorpicker-color-background">
                        <div ref={colorHandleEl} class="xy-colorpicker-color-handle"></div>
                      </div>
                    </div>
                    <div
                      ref={hueViewEl}
                      class="xy-colorpicker-hue"
                      onMousedown={onHueMousedown}
                      onTouchstart={onHueDragStart}
                      onTouchmove={onDrag}
                      onTouchend={onDragEnd}
                    >
                      <div ref={hueHandleEl} class="xy-colorpicker-hue-handle"></div>
                    </div>
                  </div>
                </div>
              )}
            </Transition>
          </Portal>
        </div>,
      );
  },
});
