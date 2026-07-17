import type { App, Plugin } from 'vue';
import Checkbox from './Checkbox';
import CheckboxGroup from './Group';
import { registerComponent } from '../_util/registerComponent';
export type { CheckboxProps, CheckboxGroupProps, CheckboxOptionType } from './interface';
export { checkboxProps, checkboxGroupProps } from './interface';

Checkbox.Group = CheckboxGroup;

/* istanbul ignore next */
Checkbox.install = function (app: App) {
  registerComponent(app, Checkbox);
  registerComponent(app, CheckboxGroup);
  return app;
};
export { CheckboxGroup };
export default Checkbox as typeof Checkbox &
  Plugin & {
    readonly Group: typeof CheckboxGroup;
  };
