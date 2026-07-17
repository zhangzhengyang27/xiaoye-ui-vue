import type { ExtractPropTypes, PropType } from 'vue';
import { stringType, booleanType, anyType, arrayType } from '../_util/type';

export type VirtualScrollerOrientation = 'vertical' | 'horizontal' | 'both';

export const virtualScrollerProps = () => ({
  prefixCls: String,
  id: String,
  style: anyType(),
  class: anyType(),
  items: arrayType<any[]>(),
  itemSize: { type: [Number, Array] as PropType<number | number[]>, default: 0 },
  scrollHeight: String,
  scrollWidth: String,
  orientation: stringType<VirtualScrollerOrientation>('vertical'),
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

export type VirtualScrollerProps = Partial<
  ExtractPropTypes<ReturnType<typeof virtualScrollerProps>>
>;

export default virtualScrollerProps;
