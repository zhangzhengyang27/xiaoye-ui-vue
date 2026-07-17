import getDaysCountInMonth from './getDaysCountInMonth';
import daylightSavingAdjust from './daylightSavingAdjust';

export interface ParseDateOptions {
  shortYearCutoff?: string | number;
  currentView?: string;
  locale?: any;
  ticksTo1970?: number;
}

export default function parseDate(
  value: string,
  format: string,
  options: ParseDateOptions = {},
): Date {
  const {
    shortYearCutoff = '+10',
    currentView = 'date',
    locale = {},
    ticksTo1970 = ((1970 - 1) * 365 +
      Math.floor(1970 / 4) -
      Math.floor(1970 / 100) +
      Math.floor(1970 / 400)) *
      24 *
      60 *
      60 *
      10000000,
  } = options;

  if (format == null || value == null) {
    throw 'Invalid arguments';
  }

  value = typeof value === 'object' ? (value as any).toString() : value + '';

  if (value === '') {
    return null as any;
  }

  let iFormat: number,
    dim: number,
    extra: string,
    iValue = 0,
    year = -1,
    month = -1,
    day = -1,
    doy = -1,
    literal = false,
    date: Date;

  const cutoff =
    typeof shortYearCutoff !== 'string'
      ? shortYearCutoff
      : (new Date().getFullYear() % 100) + parseInt(shortYearCutoff, 10);

  const lookAhead = (match: string) => {
    const matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
    if (matches) {
      iFormat++;
    }
    return matches;
  };

  const getNumber = (match: string) => {
    const isDoubled = lookAhead(match),
      size =
        match === '@'
          ? 14
          : match === '!'
            ? 20
            : match === 'y' && isDoubled
              ? 4
              : match === 'o'
                ? 3
                : 2,
      minSize = match === 'y' ? size : 1,
      digits = new RegExp('^\\d{' + minSize + ',' + size + '}'),
      num = value.substring(iValue).match(digits);
    if (!num) {
      throw 'Missing number at position ' + iValue;
    }
    iValue += num[0].length;
    return parseInt(num[0], 10);
  };

  const getName = (match: string, shortNames: string[], longNames: string[]) => {
    let index = -1;
    const arr = lookAhead(match) ? longNames : shortNames;
    const names: [number, string][] = [];
    for (let i = 0; i < arr.length; i++) {
      names.push([i, arr[i]]);
    }
    names.sort((a, b) => {
      return -(a[1].length - b[1].length);
    });
    for (let i = 0; i < names.length; i++) {
      const name = names[i][1];
      if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
        index = names[i][0];
        iValue += name.length;
        break;
      }
    }
    if (index !== -1) {
      return index + 1;
    } else {
      throw 'Unknown name at position ' + iValue;
    }
  };

  const checkLiteral = () => {
    if (value.charAt(iValue) !== format.charAt(iFormat)) {
      throw 'Unexpected literal at position ' + iValue;
    }
    iValue++;
  };

  if (currentView === 'month') {
    day = 1;
  }

  if (currentView === 'year') {
    day = 1;
    month = 1;
  }

  for (iFormat = 0; iFormat < format.length; iFormat++) {
    if (literal) {
      if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
        literal = false;
      } else {
        checkLiteral();
      }
    } else {
      switch (format.charAt(iFormat)) {
        case 'd':
          day = getNumber('d');
          break;
        case 'D':
          getName('D', locale.dayNamesShort || [], locale.dayNames || []);
          break;
        case 'o':
          doy = getNumber('o');
          break;
        case 'm':
          month = getNumber('m');
          break;
        case 'M':
          month = getName('M', locale.monthNamesShort || [], locale.monthNames || []);
          break;
        case 'y':
          year = getNumber('y');
          break;
        case '@':
          date = new Date(getNumber('@'));
          year = date.getFullYear();
          month = date.getMonth() + 1;
          day = date.getDate();
          break;
        case '!':
          date = new Date((getNumber('!') - ticksTo1970) / 10000);
          year = date.getFullYear();
          month = date.getMonth() + 1;
          day = date.getDate();
          break;
        case "'":
          if (lookAhead("'")) {
            checkLiteral();
          } else {
            literal = true;
          }
          break;
        default:
          checkLiteral();
      }
    }
  }

  if (iValue < value.length) {
    extra = value.substr(iValue);
    if (!/^\s+/.test(extra)) {
      throw 'Extra/unparsed characters found in date: ' + extra;
    }
  }

  if (year === -1) {
    year = new Date().getFullYear();
  } else if (year < 100) {
    year +=
      new Date().getFullYear() - (new Date().getFullYear() % 100) + (year <= cutoff ? 0 : -100);
  }

  if (doy > -1) {
    month = 1;
    day = doy;
    do {
      dim = getDaysCountInMonth(month - 1, year);
      if (day <= dim) {
        break;
      }
      month++;
      day -= dim;
    } while (true);
  }

  date = daylightSavingAdjust(new Date(year, month - 1, day));

  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    throw 'Invalid date';
  }

  return date;
}
