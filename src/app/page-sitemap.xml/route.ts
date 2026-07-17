const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://www.sarkariglobalresult.com";

const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;

const PAGE_PATHS = [
  "/",
  "/about",
  "/admit-card",
  "/contact",
  "/disclaimer",
  "/latest-job",
  "/privacy-policy",
  "/result",
  "/terms",
] as const;

function buildXml(): string {
  const lastmod = new Date().toISOString();
  const urls = PAGE_PATHS.map((path) => {
    const loc = `${normalizedSiteUrl}${path}`;
    return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>`;
}

export async function GET(): Promise<Response> {
  return new Response(buildXml(), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=300",
    },
  });
}
