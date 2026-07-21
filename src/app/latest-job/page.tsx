import type { Metadata } from "next";
import LatestJobPageClient from "./LatestJobPageClient";
import { DEFAULT_SEO_KEYWORDS, SITE_NAME } from "@/lib/seo";
import { fetchLatestJobsFirstPage } from "./latestJobData";

export const metadata: Metadata = {
  title: "Latest Govt Jobs 2026 - Sarkari Job Notifications",
  description: "Browse latest SSC, UPSC, Railway, Bank, Defence, Police, Teaching, PSU, and all other government jobs with state-wise and central vacancy updates.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "latest govt jobs 2026",
    "latest govt jobs 2025",
    "today govt jobs",
    "latest government job notifications",
    "latest sarkari result jobs",
    "sarkari naukri latest update",
    "government jobs apply online",
    "new vacancy 2026",
    "new vacancy 2025",
    "10th pass govt jobs",
    "12th pass govt jobs",
    "graduate govt jobs",
    "all india government jobs",
    "state wise government jobs",
    "central government jobs",
    "upcoming government exams",
    "ssc jobs",
    "upsc jobs",
    "railway jobs",
    "bank jobs",
    "defence jobs",
    "police jobs",
    "teaching jobs",
    "psu jobs",
    "latest sarkari naukri",
    "all govt post",
    "government recruitment 2026",
    "govt vacancy notification",
    "job alert india",
  ],
  alternates: {
    canonical: "/latest-job",
  },
  openGraph: {
    title: "Latest Govt Jobs 2026 - Sarkari Global Result Job Notifications",
    description:
      "Latest Government Jobs, SSC, UPSC, Railway, Bank, Defence, Police, Teaching, PSU, and all other government jobs with state-wise and central vacancy updates.",
    url: "/latest-job",
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Latest government jobs and vacancy updates",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest Govt Jobs 2026 - Sarkari Global Result Job Notifications",
    description:
      "Latest Government Jobs, SSC, UPSC, Railway, Bank, Defence, Police, Teaching, PSU, and all other government jobs with state-wise and central vacancy updates.",
    images: ["/twitter-image"],
  },
};

export default async function LatestJobPage() {
  const initialRows = await fetchLatestJobsFirstPage();
  return <LatestJobPageClient initialRows={initialRows} />;
}