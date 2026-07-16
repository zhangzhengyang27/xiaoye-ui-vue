export interface FormatTimeOptions {
    hourFormat?: string;
    showSeconds?: boolean;
}

export default function formatTime(date: Date, options: FormatTimeOptions = {}): string {
    if (!date) return '';

    const { hourFormat = '24', showSeconds = false } = options;
    let output = '';
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (hourFormat === '12' && hours > 11 && hours !== 12) hours -= 12;
    output += hourFormat === '12' ? (hours === 0 ? 12 : hours < 10 ? '0' + hours : hours) : hours < 10 ? '0' + hours : hours;
    output += ':';
    output += minutes < 10 ? '0' + minutes : minutes;
    if (showSeconds) {
        output += ':';
        output += seconds < 10 ? '0' + seconds : seconds;
    }
    return output;
}
