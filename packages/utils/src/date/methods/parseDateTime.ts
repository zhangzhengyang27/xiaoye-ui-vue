import parseDate, { type ParseDateOptions } from './parseDate';
import populateTime, { type PopulateTimeOptions } from './populateTime';

export interface ParseDateTimeOptions extends PopulateTimeOptions, ParseDateOptions {
    timeOnly?: boolean;
    showTime?: boolean;
    dateFormat?: string;
}

export default function parseDateTime(text: string, options: ParseDateTimeOptions = {}): Date {
    const { timeOnly = false, showTime = false, dateFormat = 'mm/dd/yy', locale = {} } = options;

    let date: Date;
    const amLabel = locale?.am || 'AM';
    const pmLabel = locale?.pm || 'PM';
    const ampmPattern = `${amLabel}|${pmLabel}|am|pm`;
    let parts = text.match(new RegExp(`(?:(.+?) )?(\\d{2}:\\d{2}(?::\\d{2})?)(?:\\s+(${ampmPattern}))?`, 'i'));

    if (timeOnly) {
        date = new Date();
        populateTime(date, parts![2], parts![3], options);
    } else {
        if (showTime) {
            date = parseDate(parts![1], dateFormat, options);
            populateTime(date, parts![2], parts![3], options);
        } else {
            date = parseDate(text, dateFormat, options);
        }
    }

    return date;
}
