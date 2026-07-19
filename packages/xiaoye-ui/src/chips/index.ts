import type { App, Plugin } from 'vue';
import Chips from './Chips';
import { registerComponent } from '../_util/registerComponent';

export { chipsProps } from './interface';
export type { ChipsProps } from './interface';

const XYChips = Chips as any;

XYChips.install = (app: App) => {
  registerComponent(app, Chips);
  return app;
};

export default XYChips as typeof Chips & Plugin;
