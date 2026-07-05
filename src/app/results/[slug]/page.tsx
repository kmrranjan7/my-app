import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPageShell from "@/components/DetailPageShell";
import { results } from "@/data/sidebarContent";
import { getSlugFromHref, titleFromSlug } from "@/lib/routeUtils";

type ResultsPageProps = {
  params: Promise<{ slug: string }>;
};

function getResultBySlug(slug: string) {
  return results.find((item) => getSlugFromHref(item.href) === slug);
}

export async function generateStaticParams() {
  return results.map((item) => ({ slug: getSlugFromHref(item.href) }));
}

export async function generateMetadata({ params }: ResultsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getResultBySlug(slug);

  if (!result) {
    return { title: "Result Not Found" };
  }

  return {
    title: result.title,
    description: `${result.category} update posted ${result.time}.`,
  };
}

export default async function ResultDetailPage({ params }: ResultsPageProps) {
  const { slug } = await params;
  const result = getResultBySlug(slug);

  if (!result) {
    notFound();
  }

  return (
    <DetailPageShell
      eyebrow="Result"
      title={result.title}
      badge={result.badge}
      meta={result.time}
      summary={`${titleFromSlug(slug)} has been listed in the latest results feed. Cross-check roll number, category cut-off, and qualification status from the official result publication.`}
    />
  );
}
