import type { ExtractPropTypes, PropType } from 'vue';
import { stringType, booleanType } from '../_util/type';

/**
 * 菜单项接口（内联定义，避免对 menuitem 包的依赖）
 */
export interface MenuItem {
  /** 菜单项标签（支持函数式） */
  label?: string | ((...args: any) => string);
  /** 图标类名 */
  icon?: any;
  /** 子菜单项 */
  items?: MenuItem[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可见，默认 true */
  visible?: boolean;
  /** 是否为分隔符 */
  separator?: boolean;
  /** 跳转 URL */
  url?: string;
  /** 链接 target */
  target?: string;
  /** 路由跳转目标 */
  to?: string | object;
  /** 自定义样式 */
  style?: any;
  /** 自定义类名 */
  class?: any;
  /** 命令回调 */
  command?(options: { originalEvent: Event; item: MenuItem }): void;
  /** 其他扩展属性 */
  [key: string]: any;
}

/**
 * Portal 挂载目标：'body' / 'self' / CSS 选择器 / HTMLElement
 */
export type ContextMenuAppendToType = 'body' | 'self' | (string & {}) | HTMLElement;

export const contextMenuProps = () => ({
  prefixCls: String,
  /** 菜单项数组 */
  model: { type: Array as PropType<MenuItem[] | null>, default: null },
  /** 挂载位置，默认挂到 body */
  appendTo: {
    type: [String, Object] as PropType<ContextMenuAppendToType>,
    default: 'body' as const,
  },
  /** 是否自动管理 z-index */
  autoZIndex: booleanType(true),
  /** z-index 基准值 */
  baseZIndex: { type: Number, default: 0 },
  /** 是否全局监听右键事件 */
  global: booleanType(false),
  /** 响应式断点（小于该宽度进入 mobile 模式） */
  breakpoint: stringType('960px'),
  /** tabindex */
  tabindex: { type: [Number, String] as PropType<number | string>, default: 0 },
  /** aria-labelledby */
  ariaLabelledby: { type: String as PropType<string | null>, default: null },
  /** aria-label */
  ariaLabel: { type: String as PropType<string | null>, default: null },
});

export type ContextMenuProps = Partial<ExtractPropTypes<ReturnType<typeof contextMenuProps>>>;

export default contextMenuProps;
