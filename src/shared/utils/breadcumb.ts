const segmentMap: Record<string, string> = {
  "content-website": "Content Website",
  "seo-manage": "SEO",
  "users": "Users",
  "dashboard": "Dashboard",
  "articles": "Articles",
  "courses": "Courses",
  "mitras": "Mitras",
  "testimonies": "Testimonies",
  "messages": "Messages",
  "general": "General",
};

export function generateBreadcrumb(pathname: string) {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => {
      const href = "/" + array.slice(0, index + 1).join("/");
      const label = segmentMap[segment] || segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

      return {
        segment,
        label,
        href,
      };
    });
}
