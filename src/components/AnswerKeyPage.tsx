import ExamPostsListingPage from "@/components/ExamPostsListingPage";

const ANSWER_KEY_CATEGORY_LINKS = [
  { label: "SSC Answer Key", href: "/answer-key?search=SSC" },
  { label: "UPSC Answer Key", href: "/answer-key?search=UPSC" },
  { label: "Railway Answer Key", href: "/answer-key?search=Railway" },
  { label: "Bank Answer Key", href: "/answer-key?search=Bank" },
  { label: "Defence Answer Key", href: "/answer-key?search=Defence" },
  { label: "Police Answer Key", href: "/answer-key?search=Police" },
  { label: "Teaching Answer Key", href: "/answer-key?search=Teaching" },
  { label: "State Exam Answer Key", href: "/answer-key?search=State" },
] as const;

export default async function AnswerKeyPage() {
  return (
    <ExamPostsListingPage
      pageLabel="Answer Key"
      pageTitle="Latest Answer Key Updates"
      introText="Track provisional and final answer key notifications from published exam records."
      emptyTitle="No answer key updates available right now"
      emptyDescription="Please verify API response and published exam records."
      statusText="Showing records from Exam-type published posts in your API."
      categoryTitle="Answer Key by Exam Category"
      categoryDescription="Explore official answer key updates across SSC, UPSC, Railway, Banking, Defence, Police, and state-level exams."
      categoryChips={ANSWER_KEY_CATEGORY_LINKS}
    />
  );
}
