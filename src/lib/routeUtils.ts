export function getSlugFromHref(href: string) {
  const segments = href.split("/").filter(Boolean);
  return segments.at(-1) ?? "";
}

export function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
