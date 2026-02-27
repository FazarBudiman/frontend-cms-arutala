export function filterByRole<T extends { roles: string[] }>(items: T[], role: string) {
  return items.filter((item) => item.roles.includes(role));
}
