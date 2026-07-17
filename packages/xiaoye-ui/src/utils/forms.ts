export const toValues = <T>(values: T, name?: string): T | Record<string, T> => {
  return name ? { [name]: values } : values;
};
