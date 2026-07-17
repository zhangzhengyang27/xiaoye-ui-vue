import type { App, Plugin } from 'vue';
import ContextMenu from './ContextMenu';
import { registerComponent } from '../_util/registerComponent';

export { default as contextMenuProps } from './contextMenuTypes';
export type { ContextMenuProps, ContextMenuAppendToType, MenuItem } from './contextMenuTypes';
export { default as ContextMenuSub } from './ContextMenuSub';

/* istanbul ignore next */
ContextMenu.install = function (app: App) {
  registerComponent(app, ContextMenu);
  return app;
};

export default ContextMenu as typeof ContextMenu & Plugin;
