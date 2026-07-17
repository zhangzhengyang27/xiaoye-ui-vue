import type { App, Plugin } from 'vue';
import TreeChart from './TreeChart';
import { registerComponent } from '../_util/registerComponent';

export { default as treeChartProps } from './treeChartTypes';
export type {
  TreeChartProps,
  TreeChartNode,
  TreeChartSelectionKeys,
  TreeChartCollapsedKeys,
} from './treeChartTypes';

/* istanbul ignore next */
TreeChart.install = function (app: App) {
  registerComponent(app, TreeChart);
  return app;
};

export default TreeChart as typeof TreeChart & Plugin;
