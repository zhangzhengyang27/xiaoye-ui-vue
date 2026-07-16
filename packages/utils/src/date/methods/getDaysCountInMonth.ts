import daylightSavingAdjust from './daylightSavingAdjust';

export default function getDaysCountInMonth(month: number, year: number): number {
  return 32 - daylightSavingAdjust(new Date(year, month, 32)).getDate();
}
