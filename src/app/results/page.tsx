import type { Metadata } from "next";
import ResultPageClient from "./ResultPageClient";
import { DEFAULT_SEO_KEYWORDS, SITE_NAME } from "@/lib/seo";
import { fetchResultsFirstPage } from "./resultData";

export const metadata: Metadata = {
  title: "Latest Sarkari Results 2026 - Government Exam Results",
  description: "Check latest government exam results, merit lists, and official result announcements in one place.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "latest sarkari results",
    "government exam result",
    "merit list",
    "sarkari result 2026",
    "sarkari result 2025",
    "result notification",
    "cut off marks",
    "selection list",
    "ssc result",
    "upsc result",
    "railway result",
    "bank exam result",
  ],
  alternates: {
    canonical: "/result",
  },
  openGraph: {
    title: "Latest Sarkari Results 2026 - Government Exam Results",
    description:
      "Check latest government exam results, merit lists, and official result announcements in one place.",
    url: "/result",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Latest Sarkari results and merit list updates",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest Sarkari Results 2026 - Government Exam Results",
    description:
      "Check latest government exam results, merit lists, and official result announcements in one place.",
    images: ["/opengraph.png"],
  },
};

export default async function ResultPage() {
  const initialRows = await fetchResultsFirstPage();
  return <ResultPageClient initialRows={initialRows} />;
}
