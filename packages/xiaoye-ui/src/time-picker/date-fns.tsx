import createTimePicker from './time-picker';
import dateFnsGenerateConfig from '../vc-picker/generate/dateFns';
import type { App } from 'vue';
import type { PickerTimeProps, RangePickerTimeProps } from '../date-picker/generatePicker';
import { registerComponent } from '../_util/registerComponent';

const { TimePicker, TimeRangePicker } = createTimePicker<Date>(dateFnsGenerateConfig);

export interface TimeRangePickerProps extends Omit<RangePickerTimeProps<Date>, 'picker'> {
  popupClassName?: string;
  valueFormat?: string;
}
export interface TimePickerProps extends Omit<PickerTimeProps<Date>, 'picker'> {
  popupClassName?: string;
  valueFormat?: string;
}
/* istanbul ignore next */
export { TimePicker, TimeRangePicker };
export default Object.assign(TimePicker, {
  TimePicker,
  TimeRangePicker,
  install: (app: App) => {
    registerComponent(app, TimePicker);
    registerComponent(app, TimeRangePicker);
    return app;
  },
});
