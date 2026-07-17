import type { Moment } from 'moment';
import type { App } from 'vue';
import momentGenerateConfig from '../vc-picker/generate/moment';
import { registerComponent } from '../_util/registerComponent';
import type {
  PickerProps,
  PickerDateProps,
  RangePickerProps as BaseRangePickerProps,
} from './generatePicker';
import generatePicker from './generatePicker';
import type { ExtraDatePickerProps, ExtraRangePickerProps } from './generatePicker/props';

export type DatePickerProps = PickerProps<Moment> & ExtraDatePickerProps<Moment>;
export type MonthPickerProps = Omit<PickerDateProps<Moment>, 'picker'> &
  ExtraDatePickerProps<Moment>;
export type WeekPickerProps = Omit<PickerDateProps<Moment>, 'picker'> &
  ExtraDatePickerProps<Moment>;
export type RangePickerProps = BaseRangePickerProps<Moment> & ExtraRangePickerProps<Moment>;

const { DatePicker, WeekPicker, MonthPicker, YearPicker, TimePicker, QuarterPicker, RangePicker } =
  generatePicker<Moment>(momentGenerateConfig);

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
