import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPageShell from "@/components/DetailPageShell";
import { latestUpdates } from "@/data/sidebarContent";
import { getSlugFromHref, titleFromSlug } from "@/lib/routeUtils";

type UpdatePageProps = {
  params: Promise<{ slug: string }>;
};

function getUpdateBySlug(slug: string) {
  return latestUpdates.find((item) => getSlugFromHref(item.href) === slug);
}

export async function generateStaticParams() {
  return latestUpdates.map((item) => ({ slug: getSlugFromHref(item.href) }));
}

export async function generateMetadata({ params }: UpdatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);

  if (!update) {
    return { title: "Update Not Found" };
  }

  return {
    title: update.title,
    description: `${update.type} update posted ${update.time}.`,
  };
}

export default async function UpdateDetailPage({ params }: Readonly<UpdatePageProps>) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);

  if (!update) {
    notFound();
  }

  return (
    <DetailPageShell
      eyebrow="Latest Update"
      title={update.title}
      badge={update.type}
      meta={update.time}
      summary={`${titleFromSlug(slug)} is currently listed under ${update.type}. Please verify official notification details such as eligibility, dates, and next actions before proceeding.`}
    />
  );
}
