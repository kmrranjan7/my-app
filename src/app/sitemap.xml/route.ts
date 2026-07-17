import { BACKEND_SITEMAP_INDEX_URL, toAbsoluteUrl } from "@/lib/seo";

type SitemapIndexEntry = Readonly<{
  loc: string;
  lastmod?: string;
}>;

function parseSitemapIndex(xml: string): SitemapIndexEntry[] {
  const sitemapMatches = xml.matchAll(/<sitemap>[\s\S]*?<\/sitemap>/gi);
  const entries: SitemapIndexEntry[] = [];
  const locPattern = /<loc>([\s\S]*?)<\/loc>/i;
  const lastModPattern = /<lastmod>([\s\S]*?)<\/lastmod>/i;

  for (const match of sitemapMatches) {
    const block = match[0];
    const locMatch = locPattern.exec(block);
    if (!locMatch?.[1]) {
      continue;
    }

    const rawUrl = locMatch[1].trim();
    const normalizedLoc = normalizeSitemapUrl(rawUrl);
    const lastModValue = lastModPattern.exec(block)?.[1]?.trim();

    entries.push({
      loc: normalizedLoc,
      lastmod: lastModValue,
    });
  }

  return entries;
}

function normalizeSitemapUrl(input: string): string {
  const extractedPath = extractPathFromAbsoluteUrl(input) ?? input;
  const normalizedPath = mapBackendSitemapPathToFrontend(extractedPath);
  return toAbsoluteUrl(normalizedPath);
}

function mapBackendSitemapPathToFrontend(pathValue: string): string {
  if (pathValue === "/api/site/post-sitemap.xml") {
    return "/post-sitemap.xml";
  }

  if (pathValue === "/api/site/page-sitemap.xml") {
    return "/page-sitemap.xml";
  }

  if (pathValue === "/api/site/category-sitemap.xml") {
    return "/category-sitemap.xml";
  }

  const chunkMatch = /^\/api\/site\/post-sitemap(\d+)\.xml$/i.exec(pathValue);
  if (chunkMatch?.[1]) {
    return `/post-sitemap${chunkMatch[1]}.xml`;
  }

  return pathValue;
}

function extractPathFromAbsoluteUrl(input: string): string | null {
  try {
    const parsed = new URL(input);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return null;
  }
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildSitemapIndexXml(entries: readonly SitemapIndexEntry[]): string {
  const body = entries
    .map((entry) => {
      const locXml = `<loc>${escapeXml(entry.loc)}</loc>`;
      const lastModXml = entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
      return `<sitemap>${locXml}${lastModXml}</sitemap>`;
    })
    .join("");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`
  );
}

function fallbackEntries(): SitemapIndexEntry[] {
  return [
    { loc: toAbsoluteUrl("/post-sitemap.xml") },
    { loc: toAbsoluteUrl("/page-sitemap.xml") },
    { loc: toAbsoluteUrl("/category-sitemap.xml") },
  ];
}

export async function GET(): Promise<Response> {
  try {
    const response = await fetch(BACKEND_SITEMAP_INDEX_URL, {
      method: "GET",
      headers: {
        Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const xml = await response.text();
      const entries = parseSitemapIndex(xml);
      if (entries.length > 0) {
        return new Response(buildSitemapIndexXml(entries), {
          status: 200,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=300",
          },
        });
      }
    }
  } catch {
    // Fallback when backend sitemap is unavailable.
  }

  return new Response(buildSitemapIndexXml(fallbackEntries()), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=300",
    },
  });
}
