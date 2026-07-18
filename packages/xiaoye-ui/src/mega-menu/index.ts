import type { App, Plugin } from 'vue';
import MegaMenu from './MegaMenu';
import { registerComponent } from '../_util/registerComponent';
export type {
  MegaMenuProps,
  MegaMenuItem,
  MegaMenuSubItem,
  MegaMenuColumnGroup,
  MegaMenuOrientation,
  MegaMenuItemClickEvent,
} from './megaMenuTypes';
export { megaMenuProps } from './megaMenuTypes';

/* istanbul ignore next */
MegaMenu.install = function (app: App) {
  registerComponent(app, MegaMenu);
  return app;
};

export default MegaMenu as typeof MegaMenu & Plugin;
