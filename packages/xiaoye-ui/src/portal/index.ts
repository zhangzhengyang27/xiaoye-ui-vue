import type { App, Plugin } from 'vue';
import Portal from './Portal';
import { registerComponent } from '../_util/registerComponent';

export { default as portalProps } from './portalTypes';
export type { PortalProps, PortalAppendToType } from './portalTypes';

/* istanbul ignore next */
Portal.install = function (app: App) {
  registerComponent(app, Portal);
  return app;
};

export default Portal as typeof Portal & Plugin;
