import type { App, Plugin } from 'vue';
import Panel from './Panel';
import { registerComponent } from '../_util/registerComponent';

export { default as panelProps } from './panelTypes';
export type { PanelProps } from './panelTypes';

/* istanbul ignore next */
Panel.install = function (app: App) {
  registerComponent(app, Panel);
  return app;
};

export default Panel as typeof Panel & Plugin;
