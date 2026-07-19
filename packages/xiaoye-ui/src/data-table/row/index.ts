import type { App, Plugin } from 'vue';
import Row from './Row';
import { registerComponent } from '../../_util/registerComponent';

const XYRow = Row as any;

XYRow.install = (app: App) => {
  registerComponent(app, Row);
  return app;
};

export default XYRow as typeof Row & Plugin;
