export default function isToday(today: Date, day: number, month: number, year: number): boolean {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
}
