export default function getNextMonthAndYear(
  month: number,
  year: number,
): { month: number; year: number } {
  let m, y;
  if (month === 11) {
    m = 0;
    y = year + 1;
  } else {
    m = month + 1;
    y = year;
  }
  return { month: m, year: y };
}
