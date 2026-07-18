import type { App, Plugin } from 'vue';
import PanelMenu from './PanelMenu';
import { registerComponent } from '../_util/registerComponent';

export { default as PanelMenuSub } from './PanelMenuSub';
export { panelMenuProps, panelMenuSubProps } from './panelMenuTypes';
export type {
  PanelMenuProps,
  PanelMenuSubProps,
  PanelMenuItem,
  PanelMenuExpandedKeys,
} from './panelMenuTypes';

/* istanbul ignore next */
PanelMenu.install = function (app: App) {
  registerComponent(app, PanelMenu);
  return app;
};

export default PanelMenu as typeof PanelMenu & Plugin;
