import type { ExtractPropTypes, PropType, CSSProperties } from 'vue';
import { anyType, stringType } from '../_util/type';

export type OverlayBadgeSeverity =
  'secondary' | 'info' | 'success' | 'warn' | 'danger' | 'contrast' | string;

export type OverlayBadgeSize = 'small' | 'large' | string;

export const overlayBadgeProps = () => ({
  prefixCls: String,
  value: anyType<string | number | null>(null),
  severity: stringType<OverlayBadgeSeverity | ''>(),
  size: stringType<OverlayBadgeSize | ''>(),
  icon: { type: String, default: undefined },
  // style 与 class 通过 attrs 透传更合适，这里保留以兼容源 API
  style: { type: [String, Object] as PropType<string | CSSProperties>, default: undefined },
  class: { type: [String, Array, Object] as PropType<string | any[] | object>, default: undefined },
});

export type OverlayBadgeProps = Partial<ExtractPropTypes<ReturnType<typeof overlayBadgeProps>>>;

export interface OverlayBadgeSlots {
  default?: () => any;
}
