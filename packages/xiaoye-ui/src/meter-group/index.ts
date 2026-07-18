import type { App, Plugin } from 'vue';
import MeterGroup from './MeterGroup';
import MeterGroupLabel from './MeterGroupLabel';
import { registerComponent } from '../_util/registerComponent';

export { meterGroupProps } from './meterGroupTypes';
export { default as MeterGroupLabel } from './MeterGroupLabel';
export type {
  MeterGroupProps,
  MeterItem,
  MeterGroupOrientation,
  MeterGroupLabelPosition,
  MeterGroupLabelOrientation,
} from './meterGroupTypes';

/* istanbul ignore next */
MeterGroup.install = function (app: App) {
  registerComponent(app, MeterGroup);
  registerComponent(app, MeterGroupLabel);
  return app;
};

export default MeterGroup as typeof MeterGroup & Plugin;
