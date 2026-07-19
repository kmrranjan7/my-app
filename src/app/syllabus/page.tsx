import type { Metadata } from "next";
import SyllabusPage from "@/components/SyllabusPage";
import { DEFAULT_SEO_KEYWORDS, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Latest Syllabus 2026 - Exam Pattern and Subject Updates",
  description:
    "Get latest syllabus updates, exam pattern changes, and subject-wise coverage for SSC, UPSC, Railway, Banking, Defence, and state-level exams.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "latest syllabus 2026",
    "exam pattern updates",
    "ssc syllabus",
    "upsc syllabus",
    "railway syllabus",
  ],
  alternates: {
    canonical: "/syllabus",
  },
  openGraph: {
    title: "Latest Syllabus 2026 - Exam Pattern and Subject Updates",
    description:
      "Get latest syllabus updates, exam pattern changes, and subject-wise coverage for SSC, UPSC, Railway, Banking, Defence, and state-level exams.",
    url: "/syllabus",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Latest syllabus and exam pattern updates",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest Syllabus 2026 - Exam Pattern and Subject Updates",
    description:
      "Get latest syllabus updates, exam pattern changes, and subject-wise coverage for SSC, UPSC, Railway, Banking, Defence, and state-level exams.",
    images: ["/twitter-image"],
  },
};

export default function SyllabusRoutePage() {
  return <SyllabusPage />;
}
