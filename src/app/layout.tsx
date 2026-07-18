import type { Metadata, Viewport } from "next";
import HeaderNavbar from "@/components/HeaderNavbar";
import SiteFooter from "@/components/SiteFooter";
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_KEYWORDS,
  DEFAULT_SEO_TITLE,
  SITE_NAME,
  SITE_URL,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const organizationJsonLd = getOrganizationJsonLd();
const websiteJsonLd = getWebsiteJsonLd();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_SEO_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SEO_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [...DEFAULT_SEO_KEYWORDS],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: DEFAULT_SEO_TITLE,
    description:
      "Find the latest Sarkari Result Jobs, Government Recruitment Notifications, Admit Cards, Exam Dates, Answer Keys, Results, and Online Forms for SSC, UPSC, Railway, Banking, Police, Defence, PSU, and State Government Exams.",
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SarkariGlobalResult logo and government jobs updates",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SEO_TITLE,
    description:
      "Track latest Sarkari jobs, admit card releases, exam notices, and results.",
    images: ["/twitter-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <HeaderNavbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
