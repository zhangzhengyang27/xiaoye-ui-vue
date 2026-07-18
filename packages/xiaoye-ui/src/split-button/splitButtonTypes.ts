import PropTypes from '../_util/vue-types';
import type { ExtractPropTypes, PropType, VNodeChild } from 'vue';
import type { SizeType } from '../config-provider';
import { eventType, booleanType, stringType, arrayType } from '../_util/type';
import type { MouseEventHandler } from '../_util/EventInterface';

// 按钮类型，与 Button 保持一致
export type SplitButtonType = 'link' | 'default' | 'primary' | 'ghost' | 'dashed' | 'text';

// 下拉菜单触发方式
export type SplitButtonTrigger = 'click' | 'hover' | 'contextmenu';

// 菜单弹出位置
export type SplitButtonPlacement =
  | 'topLeft'
  | 'topCenter'
  | 'top'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottom'
  | 'bottomRight';

// 下拉菜单项数据结构
export interface SplitButtonItem {
  // 菜单项唯一标识
  key?: string | number;
  // 菜单项文本
  label?: string | (() => VNodeChild);
  // 菜单项图标
  icon?: any;
  // 是否禁用
  disabled?: boolean;
  // 是否为危险项
  danger?: boolean;
  // 是否在该项前显示分割线
  divided?: boolean;
  // 是否禁用菜单项
  title?: string;
  // 子菜单（多级菜单）
  children?: SplitButtonItem[];
  // 透传给底层 Menu.Item 的额外属性
  [key: string]: any;
}

export const splitButtonProps = () => ({
  prefixCls: String,
  // 按钮类型
  type: stringType<SplitButtonType>('default'),
  // 按钮尺寸
  size: String as PropType<SizeType>,
  // 是否禁用
  disabled: booleanType(false),
  // 是否加载中
  loading: booleanType(false),
  // 是否为危险按钮
  danger: booleanType(false),
  // 是否幽灵按钮
  ghost: booleanType(false),
  // 主按钮文字
  label: String,
  // 主按钮图标
  icon: PropTypes.any,
  // 下拉菜单项数据
  model: arrayType<SplitButtonItem[]>(),
  // 菜单自定义类名
  menuClass: String,
  // 下拉触发方式
  trigger: {
    type: [Array, String] as PropType<SplitButtonTrigger | SplitButtonTrigger[]>,
  },
  // 菜单弹出位置
  placement: String as PropType<SplitButtonPlacement>,
  // 下拉箭头是否显示
  arrow: booleanType(false),
  // 主按钮点击事件
  onClick: eventType<MouseEventHandler>(),
  // 菜单项点击事件
  onItemClick: eventType<(info: { key: any; item: any; domEvent: Event }) => void>(),
});

export type SplitButtonProps = Partial<ExtractPropTypes<ReturnType<typeof splitButtonProps>>>;

export default splitButtonProps;
