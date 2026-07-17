import type { App, Plugin } from 'vue';
import Toolbar from './Toolbar';
import { registerComponent } from '../_util/registerComponent';

export { default as toolbarProps } from './toolbarTypes';
export type { ToolbarProps } from './toolbarTypes';

/* istanbul ignore next */
Toolbar.install = function (app: App) {
  registerComponent(app, Toolbar);
  return app;
};

export default Toolbar as typeof Toolbar & Plugin;
