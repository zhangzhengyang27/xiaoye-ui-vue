import type { App, Plugin } from 'vue';
import Spin, { setDefaultIndicator } from './Spin';
import { registerComponent } from '../_util/registerComponent';

export type { SpinProps } from './Spin';
export { spinProps } from './Spin';

Spin.setDefaultIndicator = setDefaultIndicator;

/* istanbul ignore next */
Spin.install = function (app: App) {
  registerComponent(app, Spin);
  return app;
};

export default Spin as typeof Spin &
  Plugin & {
    readonly setDefaultIndicator: typeof setDefaultIndicator;
  };
