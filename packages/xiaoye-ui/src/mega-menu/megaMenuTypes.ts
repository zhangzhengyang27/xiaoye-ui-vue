import type { ExtractPropTypes, VNode } from 'vue';
import PropTypes from '../_util/vue-types';
import { eventType, stringType, arrayType, booleanType, anyType } from '../_util/type';
import type { VueNode } from '../_util/type';

// 菜单方向
export type MegaMenuOrientation = 'horizontal' | 'vertical';

// 子菜单项（叶子节点）
export interface MegaMenuSubItem {
  key?: string;
  label?: string | VNode;
  icon?: any;
  disabled?: boolean;
  url?: string;
  target?: string;
  command?: (event: { item: MegaMenuSubItem; originalEvent: Event }) => void;
}

// 一列内的分组（带标题）
export interface MegaMenuColumnGroup {
  key?: string;
  label?: string | VNode;
  items?: MegaMenuSubItem[];
}

// 顶级菜单项
export interface MegaMenuItem {
  key?: string;
  label?: string | VNode;
  icon?: any;
  disabled?: boolean;
  url?: string;
  target?: string;
  // 多列子菜单：每个元素是一列，列内为分组或子项
  items?: MegaMenuColumnGroup[][] | MegaMenuSubItem[][];
}

// 点击事件回调参数
export interface MegaMenuItemClickEvent {
  key: string;
  item: MegaMenuItem | MegaMenuSubItem;
  originalEvent: Event;
}

export const megaMenuProps = () => ({
  prefixCls: String,
  // 菜单项数据
  model: arrayType<MegaMenuItem[]>(),
  // 方向
  orientation: stringType<MegaMenuOrientation>('horizontal'),
  // 当前激活的顶级项 key
  activeItem: String,
  // 是否禁用整个菜单
  disabled: booleanType(),
  // 自定义 item 渲染
  item: PropTypes.any,
  // 点击菜单项回调
  onItemClick: eventType<(e: MegaMenuItemClickEvent) => void>(),
  // icon 渲染透传
  icon: anyType<VueNode>(),
});

export type MegaMenuProps = Partial<ExtractPropTypes<ReturnType<typeof megaMenuProps>>>;
