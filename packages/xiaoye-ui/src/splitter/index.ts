import type { App, Plugin } from 'vue';
import Splitter from './Splitter';
import SplitterPanel from './SplitterPanel';
import { registerComponent } from '../_util/registerComponent';

export { default as splitterProps } from './splitterTypes';
export { splitterPanelProps } from './splitterTypes';
export type {
  SplitterProps,
  SplitterPanelProps,
  SplitterLayoutType,
  SplitterStateStorageType,
} from './splitterTypes';

/* istanbul ignore next */
Splitter.install = function (app: App) {
  registerComponent(app, Splitter);
  registerComponent(app, SplitterPanel);
  return app;
};

export default Splitter as typeof Splitter & Plugin;
export { SplitterPanel };
