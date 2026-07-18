import type { App, Plugin } from 'vue';
import DarkModeToggle from './DarkModeToggle';
import { registerComponent } from '../_util/registerComponent';
import { darkModeToggleProps } from './darkModeToggleTypes';
import { useDarkMode } from './useDarkMode';
import type {
  DarkModeToggleProps,
  DarkModeToggleVariant,
  DarkModeToggleSize,
} from './darkModeToggleTypes';
import type { UseDarkModeOptions, UseDarkModeReturn } from './useDarkMode';

export { darkModeToggleProps, useDarkMode };
export type {
  DarkModeToggleProps,
  DarkModeToggleVariant,
  DarkModeToggleSize,
  UseDarkModeOptions,
  UseDarkModeReturn,
};

/* istanbul ignore next */
DarkModeToggle.install = function (app: App) {
  registerComponent(app, DarkModeToggle);
  return app;
};

export default DarkModeToggle as typeof DarkModeToggle & Plugin;
