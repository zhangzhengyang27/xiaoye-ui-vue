import type { App, Plugin } from 'vue';
import ToggleButton from './ToggleButton';
import { registerComponent } from '../_util/registerComponent';

export type { ToggleButtonProps, ToggleButtonOption } from './interface';

const XYToggleButton = ToggleButton as any;

XYToggleButton.install = (app: App) => {
  registerComponent(app, ToggleButton);
  return app;
};

export default XYToggleButton as typeof ToggleButton & Plugin;
