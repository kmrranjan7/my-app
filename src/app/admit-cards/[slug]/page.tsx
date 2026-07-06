import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPageShell from "@/components/DetailPageShell";
import { admitCards } from "@/data/sidebarContent";
import { getSlugFromHref, titleFromSlug } from "@/lib/routeUtils";

type AdmitCardPageProps = {
  params: Promise<{ slug: string }>;
};

function getAdmitCardBySlug(slug: string) {
  return admitCards.find((item) => getSlugFromHref(item.href) === slug);
}

export async function generateStaticParams() {
  return admitCards.map((item) => ({ slug: getSlugFromHref(item.href) }));
}

export async function generateMetadata({ params }: AdmitCardPageProps): Promise<Metadata> {
  const { slug } = await params;
  const admitCard = getAdmitCardBySlug(slug);

  if (!admitCard) {
    return { title: "Admit Card Not Found" };
  }

  return {
    title: admitCard.title,
    description: `${admitCard.category} notice posted ${admitCard.time}.`,
  };
}

export default async function AdmitCardDetailPage({ params }: Readonly<AdmitCardPageProps>) {
  const { slug } = await params;
  const admitCard = getAdmitCardBySlug(slug);

  if (!admitCard) {
    notFound();
  }

  return (
    <DetailPageShell
      eyebrow="Admit Card"
      title={admitCard.title}
      badge={admitCard.badge}
      meta={admitCard.time}
      summary={`${titleFromSlug(slug)} admit card is now available in the feed. Download only from the official portal and validate photo, signature, and exam center details before exam day.`}
    />
  );
}
