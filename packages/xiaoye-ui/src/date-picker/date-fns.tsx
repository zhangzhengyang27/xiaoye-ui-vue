import type { App } from 'vue';
import dataFnsGenerateConfig from '../vc-picker/generate/dateFns';
import { registerComponent } from '../_util/registerComponent';
import type {
  PickerProps,
  PickerDateProps,
  RangePickerProps as BaseRangePickerProps,
} from './generatePicker';
import generatePicker from './generatePicker';
import type { ExtraDatePickerProps, ExtraRangePickerProps } from './generatePicker/props';

export type DatePickerProps = PickerProps<Date> & ExtraDatePickerProps<Date>;
export type MonthPickerProps = Omit<PickerDateProps<Date>, 'picker'> & ExtraDatePickerProps<Date>;
export type WeekPickerProps = Omit<PickerDateProps<Date>, 'picker'> & ExtraDatePickerProps<Date>;
export type RangePickerProps = BaseRangePickerProps<Date> & ExtraRangePickerProps<Date>;

const { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker, QuarterPicker, RangePicker } =
  generatePicker<Date>(dataFnsGenerateConfig);

/* istanbul ignore next */
export { RangePicker, WeekPicker, MonthPicker, QuarterPicker };

export default Object.assign(DatePicker, {
  WeekPicker,
  MonthPicker,
  YearPicker,
  RangePicker,
  TimePicker,
  QuarterPicker,
  install: (app: App) => {
    registerComponent(app, DatePicker);
    registerComponent(app, RangePicker);
    registerComponent(app, MonthPicker);
    registerComponent(app, WeekPicker);
    registerComponent(app, QuarterPicker);
    return app;
  },
});
