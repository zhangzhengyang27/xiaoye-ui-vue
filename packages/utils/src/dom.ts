// Placeholder for DOM utilities
export const isClient = typeof window !== 'undefined';
export const isServer = typeof window === 'undefined';
export const createStyleAsString = (css: string, _options?: { name?: string }) => css;
