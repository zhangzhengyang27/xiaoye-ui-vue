import type { App, Plugin } from 'vue';
import VirtualList from './VirtualList';
import { registerComponent } from '../_util/registerComponent';

export { default as virtualListProps } from './interface';
export type {
  VirtualListProps,
  VirtualListOrientation,
  VirtualListScrollIndexChangeEvent,
  VirtualListItemOptions,
} from './interface';

/* istanbul ignore next */
VirtualList.install = function (app: App) {
  registerComponent(app, VirtualList);
  return app;
};

export default VirtualList as typeof VirtualList & Plugin;
