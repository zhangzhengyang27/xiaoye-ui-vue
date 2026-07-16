export default function getWeekNumber(date: Date): number {
    let checkDate = new Date(date.getTime());
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    let time = checkDate.getTime();
    checkDate.setMonth(0);
    checkDate.setDate(1);
    return Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1;
}
