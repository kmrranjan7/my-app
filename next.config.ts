import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const parseCsvEnv = (value?: string) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

const allowedDevOrigins = Array.from(
  new Set(parseCsvEnv(process.env.NEXT_ALLOWED_DEV_ORIGINS)),
);

const sitemapApiOrigin = process.env.SITEMAP_API_ORIGIN?.trim();

if (!sitemapApiOrigin) {
  throw new Error(
    "SITEMAP_API_ORIGIN environment variable must be set.",
  );
}

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), unload=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  ...(allowedDevOrigins.length ? { allowedDevOrigins } : {}),
  async rewrites() {
    return [
      {
        source: "/post-sitemap.xml",
        destination: `${sitemapApiOrigin}/api/site/post-sitemap.xml`,
      },
      {
        source: String.raw`/post-sitemap:page(\d+).xml`,
        destination: `${sitemapApiOrigin}/api/site/post-sitemap:page.xml`,
      },
    ];
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
