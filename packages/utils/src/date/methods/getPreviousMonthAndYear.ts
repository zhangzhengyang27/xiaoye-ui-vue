export default function getPreviousMonthAndYear(month: number, year: number): { month: number; year: number } {
    let m, y;
    if (month === 0) {
        m = 11;
        y = year - 1;
    } else {
        m = month - 1;
        y = year;
    }
    return { month: m, year: y };
}
