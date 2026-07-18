import type { ExtractPropTypes, PropType } from 'vue';
import { arrayType, booleanType, eventType, stringType } from '../_util/type';

// 拖拽方向
export type SortableAxis = 'x' | 'y';

// 列表项数据结构
export interface SortableListItem {
  // 唯一标识
  [key: string]: any;
  // 显示文本
  label?: any;
  // 是否禁用该项的拖拽
  disabled?: boolean;
}

// 顺序更新事件回调参数
export interface SortableListUpdateEvent {
  // 拖拽源项的唯一标识
  sourceId: string | number;
  // 目标位置项的唯一标识
  targetId: string | number;
  // 重新排序后的数组
  value: SortableListItem[];
  // 原始事件对象
  originalEvent?: any;
}

// 拖拽开始/结束/移动事件回调参数
export interface SortableListDragEvent {
  // 拖拽源项的唯一标识
  sourceId: string | number;
  // 目标位置项的唯一标识
  targetId?: string | number;
  // 原始事件对象
  originalEvent?: any;
}

// 键盘拖拽方向：上/下/左/右/首/尾
export type SortableKeyboardDirection = 'up' | 'down' | 'left' | 'right' | 'home' | 'end';

// 键盘拖拽事件回调参数
export interface SortableListKeyboardEvent {
  // 触发源项的唯一标识
  sourceId: string | number;
  // 源项在列表中的索引
  sourceIndex: number;
  // 拖拽方向
  direction: SortableKeyboardDirection;
  // 原始事件对象
  originalEvent?: any;
}

export const sortableListProps = () => ({
  prefixCls: String,
  // 列表项数组，每项含 { key, label, disabled }
  model: arrayType<SortableListItem[]>(),
  // 唯一标识字段名
  itemKey: stringType<string>('key'),
  // 是否禁用拖拽（整体）
  disabled: booleanType(false),
  // 拖拽方向
  axis: stringType<SortableAxis>('y'),
  // 是否使用拖拽手柄
  handle: booleanType(false),
  // 列表根的 aria-label，默认"可排序列表"
  ariaLabel: stringType<string>(),
  // 顺序更新事件，返回新数组
  onUpdate: eventType<(e: SortableListUpdateEvent) => void>(),
  // 拖拽开始事件
  onDragStart: eventType<(e: SortableListDragEvent) => void>(),
  // 拖拽结束事件
  onDragEnd: eventType<(e: SortableListDragEvent) => void>(),
  // 拖拽经过事件
  onDragOver: eventType<(e: SortableListDragEvent) => void>(),
});

export type SortableListProps = Partial<ExtractPropTypes<ReturnType<typeof sortableListProps>>>;

// SortableItem 的 Props
export const sortableItemProps = () => ({
  prefixCls: String,
  // 列表项数据
  item: { type: Object as PropType<SortableListItem>, required: true },
  // 列表项在数组中的索引
  index: { type: Number, required: true },
  // 唯一标识字段名
  itemKey: stringType<string>('key'),
  // 是否禁用该项的拖拽
  disabled: booleanType(false),
  // 是否使用拖拽手柄
  handle: booleanType(false),
  // 拖拽方向
  axis: stringType<SortableAxis>('y'),
  // 是否处于键盘拖拽中（用于设置 aria-grabbed）
  keyboardActive: booleanType(false),
});

export type SortableItemProps = Partial<ExtractPropTypes<ReturnType<typeof sortableItemProps>>>;

export default sortableListProps;
