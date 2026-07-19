import type { ExtractPropTypes, PropType } from 'vue';
import type { SizeType } from '../config-provider';
import { eventType } from '../_util/type';

export interface ToggleButtonOption {
  label?: string;
  value: string | number | boolean;
  disabled?: boolean;
}

export const toggleButtonProps = () => ({
  value: { type: [Boolean, String, Number, Array] as PropType<any>, default: undefined },
  defaultValue: { type: [Boolean, String, Number, Array] as PropType<any>, default: undefined },
  options: { type: Array as PropType<ToggleButtonOption[]>, default: undefined },
  optionLabel: {
    type: [String, Function] as PropType<string | ((option: any) => string)>,
    default: 'label',
  },
  optionValue: {
    type: [String, Function] as PropType<string | ((option: any) => any)>,
    default: 'value',
  },
  optionDisabled: {
    type: [String, Function] as PropType<string | ((option: any) => boolean)>,
    default: 'disabled',
  },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: undefined },
  size: { type: String as PropType<SizeType> },
  onChange: eventType<(value: any) => void>(),
  'onUpdate:value': eventType<(value: any) => void>(),
});

export type ToggleButtonProps = Partial<ExtractPropTypes<ReturnType<typeof toggleButtonProps>>>;
