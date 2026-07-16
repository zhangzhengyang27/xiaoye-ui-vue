export default function getUserAgent(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent : '';
}
