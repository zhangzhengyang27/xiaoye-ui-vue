import type { App, Plugin } from 'vue';
import Badge from './Badge';
import Ribbon from './Ribbon';
import { registerComponent } from '../_util/registerComponent';
export type { BadgeProps } from './Badge';

Badge.install = function (app: App) {
  registerComponent(app, Badge);
  registerComponent(app, Ribbon);
  return app;
};

export { Ribbon as BadgeRibbon };

export default Badge as typeof Badge &
  Plugin & {
    readonly Ribbon: typeof Ribbon;
  };
