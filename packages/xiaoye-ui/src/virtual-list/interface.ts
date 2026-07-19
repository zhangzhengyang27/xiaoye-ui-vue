import type { ExtractPropTypes, PropType } from 'vue';
import { arrayType, booleanType, stringType, anyType } from '../_util/type';

// 组件专属 Token（占位，可按需扩展）
export interface ComponentToken {}

export type VirtualListOrientation = 'vertical' | 'horizontal' | 'both';

export const virtualListProps = () => ({
  prefixCls: String,
  id: String,
  style: anyType(),
  class: anyType(),
  items: arrayType<any[]>(),
  itemSize: { type: [Number, Array] as PropType<number | number[]>, default: 0 },
  scrollHeight: String,
  scrollWidth: String,
  orientation: stringType<VirtualListOrientation>('vertical'),
  numToleratedItems: { type: Number, default: null },
  delay: { type: Number, default: 0 },
  resizeDelay: { type: Number, default: 10 },
  lazy: booleanType(false),
  disabled: booleanType(false),
  loaderDisabled: booleanType(false),
  columns: arrayType<any[]>(),
  loading: booleanType(false),
  showSpacer: booleanType(true),
  showLoader: booleanType(false),
  tabindex: { type: [Number, String] as PropType<number | string>, default: 0 },
  inline: booleanType(false),
  step: { type: Number, default: 0 },
  appendOnly: booleanType(false),
  autoSize: booleanType(false),
});

export type VirtualListProps = Partial<ExtractPropTypes<ReturnType<typeof virtualListProps>>>;

export interface VirtualListScrollIndexChangeEvent {
  first: number | { rows: number; cols: number };
  last: number | { rows: number; cols: number };
}

export interface VirtualListItemOptions {
  index: number;
  count: number;
  first: boolean;
  last: boolean;
  even: boolean;
  odd: boolean;
}

export default virtualListProps;
