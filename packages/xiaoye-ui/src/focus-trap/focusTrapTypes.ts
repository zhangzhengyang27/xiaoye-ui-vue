import type { ExtractPropTypes } from 'vue';
import { booleanType, eventType, stringType } from '../_util/type';

export const focusTrapProps = () => ({
  prefixCls: String,
  disabled: booleanType(undefined),
  autoFocus: booleanType(true),
  autoFocusSelector: stringType(''),
  firstFocusableSelector: stringType(''),
  lastFocusableSelector: stringType(''),
  tabIndex: { type: Number, default: 0 },
  onFocusIn: eventType<(event: FocusEvent) => void>(),
  onFocusOut: eventType<(event: FocusEvent) => void>(),
});

export type FocusTrapProps = Partial<ExtractPropTypes<ReturnType<typeof focusTrapProps>>>;

export default focusTrapProps;
