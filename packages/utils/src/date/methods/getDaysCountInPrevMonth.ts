import getDaysCountInMonth from './getDaysCountInMonth';
import getPreviousMonthAndYear from './getPreviousMonthAndYear';

export default function getDaysCountInPrevMonth(month: number, year: number): number {
  const prev = getPreviousMonthAndYear(month, year);
  return getDaysCountInMonth(prev.month, prev.year);
}
