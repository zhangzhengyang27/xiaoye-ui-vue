/**
 * SSR-safe, exception-safe browser storage accessors.
 *
 * These wrap `window.localStorage` / `window.sessionStorage` and JSON
 * (de)serialization so that callers never crash on:
 *  - SSR (no `window`)
 *  - privacy / incognito modes where storage access throws `SecurityError`
 *  - quota exceeded (`QuotaExceededError`)
 *  - corrupted or non-JSON stored values
 *
 * When storage is unavailable the accessors degrade gracefully (return
 * `null` / `false`) instead of throwing, so the calling component simply
 * loses state persistence rather than white-screening.
 */

export type StateStorageMode = 'local' | 'session';

function isDev(): boolean {
    return typeof process !== 'undefined' && !!(process as any).env && (process as any).env.NODE_ENV !== 'production';
}

/** Returns the requested Storage, or null when unavailable (SSR / blocked). */
export function safeGetStorage(mode?: StateStorageMode): Storage | null {
    if (typeof window === 'undefined') return null;

    try {
        if (mode === 'session') return window.sessionStorage;
        return window.localStorage;
    } catch {
        // SecurityError in privacy mode / storage disabled
        return null;
    }
}

/** Reads a key; returns null on missing key or any access error. */
export function safeGetItem(storage: Storage | null, key: string): string | null {
    if (!storage || !key) return null;

    try {
        return storage.getItem(key);
    } catch {
        return null;
    }
}

/** Writes a key; returns false when storage is unavailable or write fails. */
export function safeSetItem(storage: Storage | null, key: string, value: string): boolean {
    if (!storage || !key) return false;

    try {
        storage.setItem(key, value);
        return true;
    } catch (error) {
        if (isDev()) {
            // QuotaExceededError / SecurityError — state persistence is best-effort
            console.warn('[xiaoye-ui] failed to persist state to storage:', error);
        }
        return false;
    }
}

/** Parses JSON; returns null when input is empty or invalid. */
export function safeJsonParse<T = any>(value: string | null): T | null {
    if (!value) return null;

    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

/** Stringifies a value; returns null when serialization fails (e.g. circular). */
export function safeJsonStringify(value: any): string | null {
    try {
        return JSON.stringify(value);
    } catch {
        return null;
    }
}
