import type { ExtractPropTypes, PropType } from 'vue';
import type { VueNode } from '../_util/type';

export const ratingProps = () => ({
  value: { type: Number, default: undefined },
  defaultValue: { type: Number, default: 0 },
  count: { type: Number, default: 5 },
  disabled: { type: Boolean, default: undefined },
  readonly: { type: Boolean, default: undefined },
  allowClear: { type: Boolean, default: true },
  character: { type: Function as PropType<(props: { index: number; value: number }) => VueNode> },
  onChange: { type: Function as PropType<(value: number) => void> },
  onFocus: { type: Function as PropType<(e: FocusEvent) => void> },
  onBlur: { type: Function as PropType<(e: FocusEvent) => void> },
  'onUpdate:value': { type: Function as PropType<(value: number) => void> },
});

export type RatingProps = Partial<ExtractPropTypes<ReturnType<typeof ratingProps>>>;
