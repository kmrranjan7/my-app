import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { DEFAULT_SEO_KEYWORDS, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sarkari Result Jobs 2026 - Latest Government Job Notifications",
  description:
    "Explore latest Sarkari result jobs, central and state government vacancies, admit cards, exam updates, and results.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "sarkari result 2026",
    "sarkari result 2025",
    "latest government job notifications",
    "state government vacancies",
    "central government recruitment",
    "latest admit card updates",
    "latest exam results",
    "answer key notifications",
    "free job alert india",
    "govt jobs apply online",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sarkari Result Jobs, Admit Card, Exam, Results | Sarkari Global Result",
    description:
      "Find the latest Sarkari Result Jobs, Government Recruitment Notifications, Admit Cards, Exam Dates, Answer Keys, Results, and Online Forms for SSC, UPSC, Railway, Banking, Police, Defence, PSU, and State Government Exams.",
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sarkari Global Result latest government jobs and exam updates",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarkari Result Jobs, Admit Card, Exam, Results | Sarkari Global Result",
    description:
      "Track latest Sarkari jobs, admit card releases, exam notices, and results.",
    images: ["/twitter-image"],
  },
};

export default function Home() {
  return <HomePage />;
}
