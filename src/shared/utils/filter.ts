/**
 * Utility to generate unique options for dropdown filters from a data array.
 */
export function getUniqueOptions<T, K extends keyof T, V = T[K] extends Array<infer U> ? U : T[K]>(data: T[] | undefined, key: K, labelFormatter?: (val: V) => string) {
  if (!data || !Array.isArray(data)) return [];

  const allValues = data.flatMap((item) => {
    const val = item[key];
    return (Array.isArray(val) ? val : [val]) as V[];
  });

  const uniqueValues = Array.from(new Set(allValues)).filter((val) => val !== null && val !== undefined);

  return uniqueValues.sort().map((val) => ({
    value: String(val),
    label: labelFormatter ? labelFormatter(val) : String(val),
  }));
}
