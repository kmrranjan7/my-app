import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailPageShell from "@/components/DetailPageShell";
import { upcomingExams } from "@/data/sidebarContent";
import { getSlugFromHref, titleFromSlug } from "@/lib/routeUtils";

type ExamsPageProps = {
  params: Promise<{ slug: string }>;
};

function getExamBySlug(slug: string) {
  return upcomingExams.find((item) => getSlugFromHref(item.href) === slug);
}

export async function generateStaticParams() {
  return upcomingExams.map((item) => ({ slug: getSlugFromHref(item.href) }));
}

export async function generateMetadata({ params }: ExamsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const exam = getExamBySlug(slug);

  if (!exam) {
    return { title: "Exam Not Found" };
  }

  return {
    title: exam.title,
    description: `${exam.category} schedule with date ${exam.date}.`,
  };
}

export default async function ExamDetailPage({ params }: Readonly<ExamsPageProps>) {
  const { slug } = await params;
  const exam = getExamBySlug(slug);

  if (!exam) {
    notFound();
  }

  return (
    <DetailPageShell
      eyebrow="Upcoming Exam"
      title={exam.title}
      badge={exam.badge}
      meta={exam.date}
      summary={`${titleFromSlug(slug)} is an upcoming ${exam.category.toLowerCase()} schedule. Track official date notices, admit card release windows, and exam-day instructions from the authority.`}
    />
  );
}
