import type { App, Plugin } from 'vue';
import OrganizationChart from './OrganizationChart';
import { registerComponent } from '../_util/registerComponent';

export { default as organizationChartProps } from './organizationChartTypes';
export type {
  OrganizationChartProps,
  OrganizationChartNode,
  OrganizationChartSelectionKeys,
  OrganizationChartCollapsedKeys,
} from './organizationChartTypes';

/* istanbul ignore next */
OrganizationChart.install = function (app: App) {
  registerComponent(app, OrganizationChart);
  return app;
};

export default OrganizationChart as typeof OrganizationChart & Plugin;
