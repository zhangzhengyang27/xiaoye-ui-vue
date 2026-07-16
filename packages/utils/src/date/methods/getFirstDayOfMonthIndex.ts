export default function getFirstDayOfMonthIndex(
  month: number,
  year: number,
  sundayIndex: number,
): number {
  const day = new Date();
  day.setDate(1);
  day.setMonth(month);
  day.setFullYear(year);
  const dayIndex = day.getDay() + sundayIndex;
  return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
}
