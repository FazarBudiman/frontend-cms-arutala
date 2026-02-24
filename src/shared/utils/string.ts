/**
 * Formats a string from snake_case or SCREAMING_SNAKE_CASE to Title Case.
 * Example: "PENDING_REVIEW" -> "Pending Review"
 *
 * @param str - The string to format.
 * @returns The formatted title case string.
 */
export const formatSnakeCaseToTitle = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
