import parseTime, { type ParseTimeOptions } from './parseTime';

export interface PopulateTimeOptions extends ParseTimeOptions {
  locale?: any;
}

export default function populateTime(
  value: Date,
  timeString: string,
  ampm: string,
  options: PopulateTimeOptions = {},
) {
  const { hourFormat = '24', locale } = options;

  if (hourFormat === '12' && !ampm) {
    throw 'Invalid Time';
  }

  const pm =
    ampm?.toLowerCase() === (locale?.pm || 'pm').toLowerCase() || ampm?.toLowerCase() === 'pm';
  const time = parseTime(timeString, { ...options, pm });

  value.setHours(time.hour);
  value.setMinutes(time.minute);
  value.setSeconds(time.second ?? 0);
}
