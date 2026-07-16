export default function isDateEquals(value: any, dateMeta: any): boolean {
  if (value)
    return (
      value.getDate() === dateMeta.day &&
      value.getMonth() === dateMeta.month &&
      value.getFullYear() === dateMeta.year
    );
  else return false;
}
