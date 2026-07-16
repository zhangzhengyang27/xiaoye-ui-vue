export interface ParseTimeOptions {
  showSeconds?: boolean;
  hourFormat?: string;
  pm?: boolean;
}

export default function parseTime(
  value: string,
  options: ParseTimeOptions = {},
): { hour: number; minute: number; second: number | null } {
  const { showSeconds = false, hourFormat = '24', pm = false } = options;
  const tokens = value.split(':');
  const validTokenLength = showSeconds ? 3 : 2;
  const regex = /^[0-9][0-9]$/;

  if (
    tokens.length !== validTokenLength ||
    !tokens[0].match(regex) ||
    !tokens[1].match(regex) ||
    (showSeconds && !tokens[2].match(regex))
  ) {
    throw 'Invalid time';
  }

  let h = parseInt(tokens[0]);
  const m = parseInt(tokens[1]);
  const s = showSeconds ? parseInt(tokens[2]) : null;

  if (
    isNaN(h) ||
    isNaN(m) ||
    h > 23 ||
    m > 59 ||
    (hourFormat === '12' && h > 12) ||
    (showSeconds && (isNaN(s!) || s! > 59))
  ) {
    throw 'Invalid time';
  } else {
    if (hourFormat === '12' && h !== 12 && pm) {
      h += 12;
    } else if (hourFormat === '12' && h == 12 && !pm) {
      h = 0;
    }

    return { hour: h, minute: m, second: s };
  }
}
