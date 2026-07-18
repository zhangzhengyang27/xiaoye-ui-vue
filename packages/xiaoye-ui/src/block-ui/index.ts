import type { App, Plugin } from 'vue';
import BlockUI from './BlockUI';
import { registerComponent } from '../_util/registerComponent';

export { blockUIProps } from './blockUITypes';
export type { BlockUIProps, BlockUIContainerType } from './blockUITypes';

/* istanbul ignore next */
BlockUI.install = function (app: App) {
  registerComponent(app, BlockUI);
  return app;
};

export default BlockUI as typeof BlockUI & Plugin;
