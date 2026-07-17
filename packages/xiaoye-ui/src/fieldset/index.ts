import type { App, Plugin } from 'vue';
import Fieldset from './Fieldset';
import { registerComponent } from '../_util/registerComponent';

export { default as fieldsetProps } from './fieldsetTypes';
export type { FieldsetProps } from './fieldsetTypes';

/* istanbul ignore next */
Fieldset.install = function (app: App) {
  registerComponent(app, Fieldset);
  return app;
};

export default Fieldset as typeof Fieldset & Plugin;
