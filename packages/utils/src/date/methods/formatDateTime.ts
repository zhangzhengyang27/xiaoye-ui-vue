import formatDate from './formatDate';
import formatTime, { type FormatTimeOptions } from './formatTime';

export interface FormatDateTimeOptions extends FormatTimeOptions {
    timeOnly?: boolean;
    showTime?: boolean;
    dateFormat?: string;
}

export default function formatDateTime(date: any, options: FormatDateTimeOptions = {}, isDateFn?: (v: any) => boolean, isNotEmptyFn?: (v: any) => boolean): string | null {
    let formattedValue = null;

    const { timeOnly = false, showTime = false, dateFormat = 'mm/dd/yy' } = options;

    if (isDateFn && isNotEmptyFn && isDateFn(date) && isNotEmptyFn(date)) {
        if (timeOnly) {
            formattedValue = formatTime(date, options);
        } else {
            formattedValue = formatDate(date, dateFormat);
            if (showTime) {
                formattedValue += ' ' + formatTime(date, options);
            }
        }
    } else {
        formattedValue = date;
    }

    return formattedValue;
}
