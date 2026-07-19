import type { ExtractPropTypes, PropType } from 'vue';

export const imageCompareProps = () => ({
  value: { type: Number, default: undefined },
  defaultValue: { type: Number, default: 50 },
  disabled: { type: Boolean, default: undefined },
  onChange: { type: Function as PropType<(value: number) => void> },
  'onUpdate:value': { type: Function as PropType<(value: number) => void> },
});

export type ImageCompareProps = Partial<ExtractPropTypes<ReturnType<typeof imageCompareProps>>>;
