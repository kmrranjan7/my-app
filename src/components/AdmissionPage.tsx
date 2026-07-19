import ExamPostsListingPage from "@/components/ExamPostsListingPage";

const ADMISSION_CATEGORY_LINKS = [
  { label: "UG Admissions", href: "/admission?search=UG" },
  { label: "PG Admissions", href: "/admission?search=PG" },
  { label: "Diploma Admissions", href: "/admission?search=Diploma" },
  { label: "ITI Admissions", href: "/admission?search=ITI" },
  { label: "Engineering Admission", href: "/admission?search=Engineering" },
  { label: "Medical Admission", href: "/admission?search=Medical" },
  { label: "Law Admission", href: "/admission?search=Law" },
  { label: "Entrance Updates", href: "/admission?search=Entrance" },
] as const;

export default async function AdmissionPage() {
  return (
    <ExamPostsListingPage
      pageLabel="Admission"
      pageTitle="Latest Admission Updates"
      introText="Live admission notifications, entrance updates, and counselling timelines from published records."
      emptyTitle="No admission updates available right now"
      emptyDescription="Please verify API response and published exam records."
      statusText="Showing records from Exam-type published posts in your API."
      categoryTitle="Top Admission Categories"
      categoryDescription="Explore UG, PG, Diploma, ITI, and entrance-focused admission updates."
      categoryChips={ADMISSION_CATEGORY_LINKS}
    />
  );
}
