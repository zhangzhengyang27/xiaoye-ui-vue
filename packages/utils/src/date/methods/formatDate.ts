export default function formatDate(date: Date | null | string, format: string = 'mm/dd/yy'): string {
    if (date == null || date === '') return '';
    if (typeof date === 'string') return date;

    let output = '';
    let literal = false;
    let iFormat = 0;

    const lookAhead = (match: string) => {
        const matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
        if (matches) iFormat++;
        return matches;
    };

    const pad = (value: number) => String(value).padStart(2, '0');

    for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
            if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
                literal = false;
            } else {
                output += format.charAt(iFormat);
            }
            continue;
        }

        const ch = format.charAt(iFormat);
        switch (ch) {
            case 'd':
                output += lookAhead('d') ? pad(date.getDate()) : date.getDate();
                break;
            case 'm':
                output += lookAhead('m') ? pad(date.getMonth() + 1) : date.getMonth() + 1;
                break;
            case 'y':
                output += lookAhead('y') ? String(date.getFullYear()) : pad(date.getFullYear() % 100);
                break;
            case 'H':
                output += lookAhead('H') ? pad(date.getHours()) : date.getHours();
                break;
            case 'M':
                output += lookAhead('M') ? pad(date.getMinutes()) : date.getMinutes();
                break;
            case 'S':
                output += lookAhead('S') ? pad(date.getSeconds()) : date.getSeconds();
                break;
            case "'":
                if (lookAhead("'")) output += "'";
                else literal = true;
                break;
            default:
                output += ch;
        }
    }

    return output;
}
