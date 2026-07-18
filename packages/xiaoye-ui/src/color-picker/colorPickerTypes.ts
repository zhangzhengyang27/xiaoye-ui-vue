import type { ExtractPropTypes, PropType } from 'vue';
import { anyType, booleanType, stringType } from '../_util/type';

/**
 * 颜色格式
 */
export type ColorPickerFormat = 'hex' | 'rgb' | 'hsb';

/**
 * Portal 挂载目标：'body' / 'self' / CSS 选择器 / HTMLElement
 */
export type ColorPickerAppendToType = 'body' | 'self' | (string & {}) | HTMLElement;

/**
 * HSB 颜色值
 */
export interface ColorPickerHSBValue {
  h: number;
  s: number;
  b: number;
}

/**
 * RGB 颜色值
 */
export interface ColorPickerRGBValue {
  r: number;
  g: number;
  b: number;
}

/**
 * ColorPicker change 事件
 */
export interface ColorPickerChangeEvent {
  /** 浏览器事件 */
  event: Event;
  /** 当前颜色值 */
  value: any;
}

export const colorPickerProps = () => ({
  prefixCls: String,
  /** 当前颜色值（v-model） */
  modelValue: anyType<any>(null),
  /** 非受控模式下的默认值 */
  defaultValue: anyType<any>(null),
  /** 是否禁用 */
  disabled: booleanType(false),
  /** 是否为无效状态 */
  invalid: { type: Boolean, default: undefined },
  /** 表单 name 属性 */
  name: { type: String as PropType<string | undefined>, default: undefined },
  /** 初始颜色（无值时显示），默认 'ff0000' */
  defaultColor: anyType<any>('ff0000'),
  /** 是否内联显示（不弹出 overlay） */
  inline: booleanType(false),
  /** 颜色格式：'hex' / 'rgb' / 'hsb' */
  format: stringType<ColorPickerFormat>('hex'),
  /** tabindex */
  tabindex: { type: String as PropType<string | null>, default: null },
  /** 是否自动管理 z-index */
  autoZIndex: booleanType(true),
  /** z-index 基准值 */
  baseZIndex: { type: Number, default: 0 },
  /** 挂载位置，默认挂到 body */
  appendTo: {
    type: [String, Object] as PropType<ColorPickerAppendToType>,
    default: 'body' as const,
  },
  /** 输入框 id（用于 label 关联） */
  inputId: { type: String as PropType<string | null>, default: null },
  /** 触发器的无障碍标签，默认 "选择颜色" */
  ariaLabel: stringType<string>('选择颜色'),
  /** 面板样式类（已废弃，请使用 overlayClass） */
  panelClass: anyType<any>(null),
  /** overlay 样式类 */
  overlayClass: anyType<any>(null),
});

export type ColorPickerProps = Partial<ExtractPropTypes<ReturnType<typeof colorPickerProps>>>;

export default colorPickerProps;
