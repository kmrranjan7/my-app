import type { Metadata } from "next";
import AdmissionPage from "@/components/AdmissionPage";
import { DEFAULT_SEO_KEYWORDS, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Admission 2026 - Latest College and Entrance Admission Updates",
  description:
    "Check latest admission notifications, entrance updates, counselling schedules, and registration timelines for government and public institutions.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "admission 2026",
    "latest admission updates",
    "entrance admission",
    "college admission",
    "counselling schedule",
  ],
  alternates: {
    canonical: "/admission",
  },
  openGraph: {
    title: "Admission 2026 - Latest College and Entrance Admission Updates",
    description:
      "Check latest admission notifications, entrance updates, counselling schedules, and registration timelines for government and public institutions.",
    url: "/admission",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Latest admission updates and entrance notifications",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Admission 2026 - Latest College and Entrance Admission Updates",
    description:
      "Check latest admission notifications, entrance updates, counselling schedules, and registration timelines for government and public institutions.",
    images: ["/twitter-image"],
  },
};

export default function AdmissionRoutePage() {
  return <AdmissionPage />;
}
