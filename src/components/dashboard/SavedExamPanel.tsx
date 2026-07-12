import SavedJobsPanel from "@/components/dashboard/SavedJobsPanel";
import type { NewPostPrefillRecord } from "@/components/dashboard/NewPostPanel";

type SavedExamPanelProps = Readonly<{
  readonly onEditInNewPost?: (record: NewPostPrefillRecord) => void;
}>;

export default function SavedExamPanel({ onEditInNewPost }: SavedExamPanelProps) {
  return (
    <SavedJobsPanel
      postTypeFilter="Exam"
      title="Saved Exam"
      subtitle="Saved records posted as exam updates"
      onEditInNewPost={onEditInNewPost}
    />
  );
}
