import type { App, Plugin } from 'vue';
import Dropdown from './dropdown';
import DropdownButton from './dropdown-button';
import { dropdownProps, dropdownButtonProps } from './props';
import { registerComponent } from '../_util/registerComponent';
export type { DropdownProps } from './dropdown';
export type { DropdownButtonProps } from './dropdown-button';

Dropdown.Button = DropdownButton;

/* istanbul ignore next */
Dropdown.install = function (app: App) {
  registerComponent(app, Dropdown);
  registerComponent(app, DropdownButton);
  return app;
};

export { DropdownButton, dropdownProps, dropdownButtonProps };

export default Dropdown as typeof Dropdown &
  Plugin & {
    readonly Button: typeof DropdownButton;
  };
