import type { App, Plugin } from 'vue';
import VirtualScroller from './VirtualScroller';
import { registerComponent } from '../_util/registerComponent';

export { default as virtualScrollerProps } from './virtualScrollerTypes';
export type { VirtualScrollerProps, VirtualScrollerOrientation } from './virtualScrollerTypes';

/* istanbul ignore next */
VirtualScroller.install = function (app: App) {
  registerComponent(app, VirtualScroller);
  return app;
};

export default VirtualScroller as typeof VirtualScroller & Plugin;
