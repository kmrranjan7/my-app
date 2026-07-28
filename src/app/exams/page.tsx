import ExamPage from "@/components/ExamPage";
import { fetchExamFirstPage } from "./examData";

export default async function ExamsRoutePage() {
  const initialRows = await fetchExamFirstPage();
  return <ExamPage initialRows={initialRows} />;
}
