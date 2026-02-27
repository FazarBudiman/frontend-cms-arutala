/**
 * Formats a date string to id-ID locale.
 * NOTE: When using this in a component, consider adding `suppressHydrationWarning`
 * to the parent element to avoid Next.js hydration mismatches due to locale differences.
 */
export const formatedDate = (date: string) => {
  const formatedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formatedDate;
};
