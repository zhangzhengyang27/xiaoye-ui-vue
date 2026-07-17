import type { App, Plugin } from 'vue';
import Collapse, { collapseProps } from './Collapse';
import CollapsePanel, { collapsePanelProps } from './CollapsePanel';
import { registerComponent } from '../_util/registerComponent';
export type { CollapseProps } from './Collapse';
export type { CollapsePanelProps } from './CollapsePanel';

Collapse.Panel = CollapsePanel;

/* istanbul ignore next */
Collapse.install = function (app: App) {
  registerComponent(app, Collapse);
  registerComponent(app, CollapsePanel);
  return app;
};

export { CollapsePanel, collapseProps, collapsePanelProps };
export default Collapse as typeof Collapse &
  Plugin & {
    readonly Panel: typeof CollapsePanel;
  };
