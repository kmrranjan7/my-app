import { PAGE_SITEMAP_PATHS, toAbsoluteUrl } from "@/lib/seo";

function buildXml(): string {
  const lastmod = new Date().toISOString();
  const urls = PAGE_SITEMAP_PATHS.map((path) => {
    const loc = toAbsoluteUrl(path);
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
