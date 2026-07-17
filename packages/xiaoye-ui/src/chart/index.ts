import type { App, Plugin } from 'vue';
import Chart from './Chart';
import { registerComponent } from '../_util/registerComponent';

export { default as chartProps } from './chartTypes';
export type {
  ChartProps,
  ChartType,
  ChartData,
  ChartOptions,
  ChartPlugins,
  ChartSelectEvent,
} from './chartTypes';

/* istanbul ignore next */
Chart.install = function (app: App) {
  registerComponent(app, Chart);
  return app;
};

export default Chart as typeof Chart & Plugin;
