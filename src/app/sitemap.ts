import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "http://localhost:3000";

const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;

const BACKEND_SITEMAP_INDEX_URL = "http://localhost:8080/api/site/sitemap-index.xml";

function parseSitemapIndex(xml: string): MetadataRoute.Sitemap {
  const sitemapMatches = xml.matchAll(/<sitemap>[\s\S]*?<\/sitemap>/gi);
  const entries: MetadataRoute.Sitemap = [];
  const locPattern = /<loc>([\s\S]*?)<\/loc>/i;
  const lastModPattern = /<lastmod>([\s\S]*?)<\/lastmod>/i;

  for (const match of sitemapMatches) {
    const block = match[0];
    const locMatch = locPattern.exec(block);

    if (!locMatch?.[1]) {
      continue;
    }

    const rawUrl = locMatch[1].trim();
    const url = normalizeSitemapUrl(rawUrl);
    const lastModMatch = lastModPattern.exec(block);
    const lastModifiedValue = lastModMatch?.[1]?.trim();
    const parsedDate = lastModifiedValue ? new Date(lastModifiedValue) : undefined;

    entries.push({
      url,
      lastModified: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : undefined,
    });
  }

  return entries;
}

function normalizeSitemapUrl(input: string): string {
  const extractedPath = extractPathFromAbsoluteUrl(input) ?? input;
  const normalizedPath = mapBackendSitemapPathToFrontend(extractedPath);
  if (normalizedPath.startsWith("/")) {
    return `${normalizedSiteUrl}${normalizedPath}`;
  }

  return `${normalizedSiteUrl}/${normalizedPath}`;
}

function mapBackendSitemapPathToFrontend(pathValue: string): string {
  if (pathValue === "/api/site/post-sitemap.xml") {
    return "/post-sitemap.xml";
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(BACKEND_SITEMAP_INDEX_URL, {
      method: "GET",
      headers: {
        Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [
        {
          url: `${siteUrl}/`,
          lastModified: new Date(),
        },
      ];
    }

    const xml = await response.text();
    const sitemapEntries = parseSitemapIndex(xml);

    if (sitemapEntries.length > 0) {
      return sitemapEntries;
    }
  } catch {
    // Fallback to root URL when backend sitemap API is unavailable.
  }

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
    },
  ];
}
