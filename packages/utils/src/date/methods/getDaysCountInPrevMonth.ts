import getDaysCountInMonth from './getDaysCountInMonth';
import getPreviousMonthAndYear from './getPreviousMonthAndYear';

export default function getDaysCountInPrevMonth(month: number, year: number): number {
    let prev = getPreviousMonthAndYear(month, year);
    return getDaysCountInMonth(prev.month, prev.year);
}
