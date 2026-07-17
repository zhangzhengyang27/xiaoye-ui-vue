import type { App, Plugin } from 'vue';
import FocusTrap from './FocusTrap';
import { registerComponent } from '../_util/registerComponent';

export { default as focusTrapProps } from './focusTrapTypes';
export type { FocusTrapProps } from './focusTrapTypes';
export { useFocusTrap } from './useFocusTrap';
export type { FocusTrapOptions } from './useFocusTrap';

/* istanbul ignore next */
FocusTrap.install = function (app: App) {
  registerComponent(app, FocusTrap);
  return app;
};

export default FocusTrap as typeof FocusTrap & Plugin;
