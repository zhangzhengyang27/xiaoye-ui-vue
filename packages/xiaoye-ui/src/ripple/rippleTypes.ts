import type { ExtractPropTypes } from 'vue';
import { booleanType } from '../_util/type';

export const rippleProps = () => ({
  prefixCls: String,
  disabled: booleanType(undefined),
});

export type RippleProps = Partial<ExtractPropTypes<ReturnType<typeof rippleProps>>>;

export default rippleProps;
