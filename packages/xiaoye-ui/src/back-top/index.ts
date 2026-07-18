import type { App, Plugin } from 'vue';
import BackTop from './BackTop';
import { registerComponent } from '../_util/registerComponent';

export type { BackTopProps } from './backTopTypes';

/* istanbul ignore next */
BackTop.install = function (app: App) {
  registerComponent(app, BackTop);
  return app;
};

export default BackTop as typeof BackTop & Plugin;
