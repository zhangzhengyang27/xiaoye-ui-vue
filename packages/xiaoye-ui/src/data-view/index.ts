import type { App, Plugin } from 'vue';
import DataView from './DataView';
import { registerComponent } from '../_util/registerComponent';

export { default as dataViewProps } from './dataViewTypes';
export type { DataViewProps } from './dataViewTypes';

/* istanbul ignore next */
DataView.install = function (app: App) {
  registerComponent(app, DataView);
  return app;
};

export default DataView as typeof DataView & Plugin;
