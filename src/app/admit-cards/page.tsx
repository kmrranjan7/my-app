import type { Metadata } from "next";
import AdmitCardPageClient from "./AdmitCardPageClient";
import { DEFAULT_SEO_KEYWORDS, SITE_NAME } from "@/lib/seo";
import { fetchAdmitCardsFirstPage } from "./admitCardData";

export const metadata: Metadata = {
  title: "Admit Card - Download Latest Government Exam Hall Tickets",
  description: "Check and download latest government exam admit cards and hall ticket updates from official notifications.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "admit card",
    "government exam hall ticket",
    "download admit card",
    "latest admit card 2026",
    "latest admit card 2025",
    "exam hall ticket download",
    "sarkari admit card",
    "ssc admit card",
    "upsc admit card",
    "railway admit card",
    "bank exam admit card",
  ],
  alternates: {
    canonical: "/admit-card",
  },
  openGraph: {
    title: "Admit Card - Download Latest Government Exam Hall Tickets",
    description:
      "Check and download latest government exam admit cards and hall ticket updates from official notifications.",
    url: "/admit-card",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Latest government exam admit card updates",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Admit Card - Download Latest Government Exam Hall Tickets",
    description:
      "Check and download latest government exam admit cards and hall ticket updates from official notifications.",
    images: ["/twitter-image"],
  },
};

export default async function AdmitCardPage() {
  const initialRows = await fetchAdmitCardsFirstPage();
  return <AdmitCardPageClient initialRows={initialRows} />;
}
