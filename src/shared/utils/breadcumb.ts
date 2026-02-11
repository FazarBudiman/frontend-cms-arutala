export function generateBreadcrumb(pathname: string) {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => {
      const href = "/" + array.slice(0, index + 1).join("/");

      return {
        label: segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        href,
      };
    });
}
