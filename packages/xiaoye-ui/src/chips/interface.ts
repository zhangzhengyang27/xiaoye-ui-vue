import type { ExtractPropTypes } from 'vue';
import { arrayType, booleanType, stringType, someType } from '../_util/type';

export const chipsProps = () => ({
  prefixCls: String,
  value: arrayType<string[]>(),
  disabled: booleanType(),
  max: Number,
  allowDuplicate: booleanType(true),
  placeholder: stringType(),
  separator: someType<string | RegExp>([String, RegExp]),
  addOnBlur: booleanType(),
});

export type ChipsProps = Partial<ExtractPropTypes<ReturnType<typeof chipsProps>>>;
