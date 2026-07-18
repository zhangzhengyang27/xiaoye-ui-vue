import type { ExtractPropTypes, PropType } from 'vue';
import { arrayType, booleanType, eventType, objectType, stringType } from '../_util/type';

/**
 * PanelMenu 菜单项数据结构
 */
export interface PanelMenuItem {
  /** 唯一标识 */
  key: string;
  /** 菜单项文本 */
  label?: string;
  /** 图标类名或节点 */
  icon?: any;
  /** 子菜单项 */
  items?: PanelMenuItem[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可见 */
  visible?: boolean;
  /** 链接地址 */
  url?: string;
  /** 链接 target */
  target?: string;
  /** 自定义样式 */
  style?: Record<string, any>;
  /** 自定义类名 */
  class?: any;
  /** 头部自定义类名 */
  headerClass?: any;
  /** 点击命令回调 */
  command?: (event: { originalEvent: Event; item: PanelMenuItem }) => void;
  /** 是否作为分隔符 */
  separator?: boolean;
}

/**
 * 内部处理后的菜单项（包含层级、父级引用等元信息）
 *
 * 用于 PanelMenu 内部的 processedItems / activeItemPath / focusedItem 等状态。
 */
export interface ProcessedPanelMenuItem {
  /** 原始菜单项数据 */
  item: PanelMenuItem;
  /** 在同级中的索引 */
  index: number;
  /** 层级，根为 0 */
  level: number;
  /** 处理后的唯一 key（拼接父级 key） */
  key: string;
  /** 父级 processed item（根级为空对象） */
  parent: ProcessedPanelMenuItem | Record<string, any>;
  /** 父级 key（根级为空字符串） */
  parentKey: string;
  /** 子级 processed items */
  items: ProcessedPanelMenuItem[];
}

/**
 * 展开状态映射表，key 为菜单项 key
 */
export type PanelMenuExpandedKeys = Record<string, boolean>;

export const panelMenuProps = () => ({
  prefixCls: String,
  // 菜单项数组
  model: arrayType<PanelMenuItem[]>(),
  // 受控展开的子菜单 key 映射
  expandedKeys: objectType<PanelMenuExpandedKeys>(),
  // 当前选中项 key
  activeItem: stringType<string>(),
  // 是否允许同时展开多个面板
  multiple: booleanType(false),
  // tab 顺序
  tabindex: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  // 事件回调（与 emit 配合，支持以 prop 形式传入）
  onExpand: eventType<(event: { originalEvent: Event; item: PanelMenuItem }) => void>(),
  onCollapse: eventType<(event: { originalEvent: Event; item: PanelMenuItem }) => void>(),
  onItemClick: eventType<(event: { originalEvent: Event; item: PanelMenuItem }) => void>(),
});

export type PanelMenuProps = Partial<ExtractPropTypes<ReturnType<typeof panelMenuProps>>>;

export const panelMenuSubProps = () => ({
  panelId: stringType<string>(),
  focusedItemId: stringType<string>(),
  items: arrayType<any[]>(),
  level: {
    type: Number as PropType<number>,
    default: 0,
  },
  templates: objectType<Record<string, any>>(),
  activeItemPath: arrayType<any[]>(),
  expandedKeys: objectType<PanelMenuExpandedKeys>(),
  tabindex: {
    type: [Number, String] as PropType<number | string>,
    default: -1,
  },
  // 事件回调（与 emit 配合，支持以 onXxx 形式传入）
  onItemToggle: eventType<(event: any) => void>(),
  onItemClick: eventType<(event: any) => void>(),
  onItemMousemove: eventType<(event: any) => void>(),
  onFocus: eventType<(event: FocusEvent) => void>(),
  onBlur: eventType<(event: FocusEvent) => void>(),
  onKeydown: eventType<(event: KeyboardEvent) => void>(),
});

export type PanelMenuSubProps = Partial<ExtractPropTypes<ReturnType<typeof panelMenuSubProps>>>;
