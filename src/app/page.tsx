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
    title: "Sarkari Global Result – Latest Govt Jobs, Results, Admit Card & Exams",
    description:
      "Get the latest Government Jobs, Sarkari Results, Admit Cards, Answer Keys, Exam Dates, Syllabus, Admissions, Scholarships, and Online Forms. Stay updated with SSC, UPSC, Railway, Banking, Defence, Police, PSU, State Government, and other recruitment notifications across India.",
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph.png",
        width: 1200,
        height: 630,
        alt: "Sarkari Global Result latest government jobs and exam updates",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarkari Global Result – Latest Govt Jobs, Results, Admit Card & Exams",
    description:
      "Get the latest Government Jobs, Sarkari Results, Admit Cards, Answer Keys, Exam Dates, Syllabus, Admissions, Scholarships, and Online Forms. Stay updated with SSC, UPSC, Railway, Banking, Defence, Police, PSU, State Government, and other recruitment notifications across India.",
    images: ["/opengraph.png"],
  },
};

export default function Home() {
  return <HomePage />;
}
