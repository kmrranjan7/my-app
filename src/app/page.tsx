import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { DEFAULT_SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sarkari Result Jobs 2026 - Latest Government Job Notifications",
  description:
    "Explore latest Sarkari result jobs, central and state government vacancies, admit cards, exam updates, and results.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "sarkari result 2026",
    "latest government job notifications",
    "state government vacancies",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomePage />;
}
