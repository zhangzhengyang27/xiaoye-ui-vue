import type { App, Plugin } from 'vue';
import OverlayBadge from './OverlayBadge';
import { registerComponent } from '../_util/registerComponent';

export { overlayBadgeProps } from './overlayBadgeTypes';
export type {
  OverlayBadgeProps,
  OverlayBadgeSeverity,
  OverlayBadgeSize,
  OverlayBadgeSlots,
} from './overlayBadgeTypes';

OverlayBadge.install = function (app: App) {
  registerComponent(app, OverlayBadge);
  return app;
};

export default OverlayBadge as typeof OverlayBadge & Plugin;
