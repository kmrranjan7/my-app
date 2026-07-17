import type { Metadata } from "next";
import AdmitCardPageClient from "./AdmitCardPageClient";
import { DEFAULT_SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Admit Card - Download Latest Government Exam Hall Tickets",
  description: "Check and download latest government exam admit cards and hall ticket updates from official notifications.",
  keywords: [
    ...DEFAULT_SEO_KEYWORDS,
    "admit card",
    "government exam hall ticket",
    "download admit card",
  ],
  alternates: {
    canonical: "/admit-card",
  },
};

export default function AdmitCardPage() {
  return <AdmitCardPageClient />;
}
