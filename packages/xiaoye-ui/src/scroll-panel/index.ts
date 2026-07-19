import type { App, Plugin } from 'vue';
import ScrollPanel from './ScrollPanel';
import { registerComponent } from '../_util/registerComponent';

export type { ScrollPanelProps } from './interface';

const XYScrollPanel = ScrollPanel as any;

XYScrollPanel.install = (app: App) => {
  registerComponent(app, ScrollPanel);
  return app;
};

export default XYScrollPanel as typeof ScrollPanel & Plugin;
