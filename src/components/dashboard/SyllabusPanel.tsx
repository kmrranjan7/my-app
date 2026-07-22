import SavedJobsPanel from "@/components/dashboard/SavedJobsPanel";
import type { NewPostPrefillRecord } from "@/components/dashboard/NewPostPanel";

type SyllabusPanelProps = Readonly<{
  readonly onEditInNewPost?: (record: NewPostPrefillRecord) => void;
  readonly refreshToken?: number;
}>;

export default function SyllabusPanel({ onEditInNewPost, refreshToken }: SyllabusPanelProps) {
  return (
    <SavedJobsPanel
      postTypeFilter="Syllabus"
      title="Syllabus"
      subtitle="Saved records posted as syllabus updates"
      onEditInNewPost={onEditInNewPost}
      refreshToken={refreshToken}
    />
  );
}
