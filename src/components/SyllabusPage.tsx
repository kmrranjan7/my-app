import ExamPostsListingPage from "@/components/ExamPostsListingPage";

const SYLLABUS_CATEGORY_LINKS = [
  { label: "SSC Syllabus", href: "/syllabus?search=SSC" },
  { label: "UPSC Syllabus", href: "/syllabus?search=UPSC" },
  { label: "Railway Syllabus", href: "/syllabus?search=Railway" },
  { label: "Bank Syllabus", href: "/syllabus?search=Bank" },
  { label: "Defence Syllabus", href: "/syllabus?search=Defence" },
  { label: "Police Syllabus", href: "/syllabus?search=Police" },
  { label: "Teaching Syllabus", href: "/syllabus?search=Teaching" },
  { label: "State Exam Syllabus", href: "/syllabus?search=State" },
] as const;

export default async function SyllabusPage() {
  return (
    <ExamPostsListingPage
      pageLabel="Syllabus"
      pageTitle="Latest Syllabus and Exam Pattern Updates"
      introText="Track syllabus changes, exam pattern updates, and important curriculum notices from published records."
      emptyTitle="No syllabus updates available right now"
      emptyDescription="Please verify API response and published exam records."
      statusText="Showing records from Exam-type published posts in your API."
      categoryTitle="Syllabus by Exam Category"
      categoryDescription="Explore syllabus updates for SSC, UPSC, Railway, Banking, Defence, Police, and state-level exams."
      categoryChips={SYLLABUS_CATEGORY_LINKS}
    />
  );
}
