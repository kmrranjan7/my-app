import type { Metadata } from "next";
import AnswerKeyPage from "@/components/AnswerKeyPage";
import { DEFAULT_SEO_KEYWORDS, SITE_NAME } from "@/lib/seo";
import { fetchAnswerKeyFirstPage } from "./answerKeyData";

export const metadata: Metadata = {
  title: "Latest Answer Key 2026 - Official and Provisional Key Updates",
  description:
    "Track latest official and provisional answer key notifications for SSC, UPSC, Railway, Banking, Defence, Police, and state-level exams.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "latest answer key 2026",
    "official answer key",
    "provisional answer key",
    "ssc answer key",
    "upsc answer key",
  ],
  alternates: {
    canonical: "/answer-key",
  },
  openGraph: {
    title: "Latest Answer Key 2026 - Official and Provisional Key Updates",
    description:
      "Track latest official and provisional answer key notifications for SSC, UPSC, Railway, Banking, Defence, Police, and state-level exams.",
    url: "/answer-key",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Latest official and provisional answer key updates",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest Answer Key 2026 - Official and Provisional Key Updates",
    description:
      "Track latest official and provisional answer key notifications for SSC, UPSC, Railway, Banking, Defence, Police, and state-level exams.",
    images: ["/twitter-image"],
  },
};

export default async function AnswerKeyRoutePage() {
  const initialRows = await fetchAnswerKeyFirstPage();
  return <AnswerKeyPage initialRows={initialRows} />;
}
