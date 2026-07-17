import type { App, Plugin } from 'vue';
import Tabs, { TabPane } from './src';
import { registerComponent } from '../_util/registerComponent';
export type { TabsProps, TabPaneProps } from './src';

Tabs.TabPane = TabPane;

/* istanbul ignore next */
Tabs.install = function (app: App) {
  registerComponent(app, Tabs);
  registerComponent(app, TabPane);
  return app;
};

export default Tabs as typeof Tabs &
  Plugin & {
    readonly TabPane: typeof TabPane;
  };

export { TabPane };
