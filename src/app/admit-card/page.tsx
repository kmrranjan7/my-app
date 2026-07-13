import type { Metadata } from "next";
import AdmitCardPageClient from "./AdmitCardPageClient";

export const metadata: Metadata = {
  title: "Admit Card",
  description: "Latest published admit cards fetched from API.",
};

export default function AdmitCardPage() {
  return <AdmitCardPageClient />;
}
