import type { App, Plugin } from 'vue';
import Ripple from './Ripple';
import { registerComponent } from '../_util/registerComponent';

export { default as rippleProps } from './rippleTypes';
export type { RippleProps } from './rippleTypes';
export { useRipple, RIPPLE_HOST_CLASS, RIPPLE_INK_CLASS } from './useRipple';

/* istanbul ignore next */
Ripple.install = function (app: App) {
  registerComponent(app, Ripple);
  return app;
};

export default Ripple as typeof Ripple & Plugin;
