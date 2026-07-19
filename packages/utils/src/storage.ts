/**
 * SSR-safe, exception-safe browser storage accessors.
 *
 * These wrap `window.localStorage` / `window.sessionStorage` so that callers
 * never crash on:
 *  - SSR (no `window`)
 *  - privacy / incognito modes where storage access throws `SecurityError`
 *  - quota exceeded (`QuotaExceededError`)
 *
 * When storage is unavailable the accessors degrade gracefully (return
 * `null` / `false` / `undefined`) instead of throwing.
 */

function isDev(): boolean {
  return (
    typeof process !== 'undefined' &&
    !!(process as any).env &&
    (process as any).env.NODE_ENV !== 'production'
  );
}

/** Returns the requested Storage, or null when unavailable (SSR / blocked). */
export function safeGetStorage(storageType: string): Storage | null {
  if (typeof window === 'undefined') return null;

  try {
    if (storageType === 'session') return window.sessionStorage;
    if (storageType === 'local') return window.localStorage;
    return null;
  } catch {
    // SecurityError in privacy mode / storage disabled
    return null;
  }
}

/** Reads a key; returns null on missing key or any access error. */
export function safeGetItem(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

/** Writes a key; returns false when storage is unavailable or write fails. */
export function safeSetItem(storage: Storage, key: string, value: string): boolean {
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

/** Stringifies a value; returns undefined when serialization fails (e.g. circular). */
export function safeJsonStringify(value: any): string | undefined {
  try {
    return JSON.stringify(value);
  } catch {
    return undefined;
  }
}
