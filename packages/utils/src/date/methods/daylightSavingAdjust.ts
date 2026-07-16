export default function daylightSavingAdjust(date: Date): Date {
    if (!date) return null as any;
    date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
    return date;
}
