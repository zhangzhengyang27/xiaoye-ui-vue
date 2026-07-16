export default function getFirstDayOfMonthIndex(month: number, year: number, sundayIndex: number): number {
    let day = new Date();
    day.setDate(1);
    day.setMonth(month);
    day.setFullYear(year);
    let dayIndex = day.getDay() + sundayIndex;
    return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
}
