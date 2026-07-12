import SavedJobsPanel from "@/components/dashboard/SavedJobsPanel";
import type { NewPostPrefillRecord } from "@/components/dashboard/NewPostPanel";

type SavedResultPanelProps = Readonly<{
  readonly onEditInNewPost?: (record: NewPostPrefillRecord) => void;
}>;

export default function SavedResultPanel({ onEditInNewPost }: SavedResultPanelProps) {
  return (
    <SavedJobsPanel
      postTypeFilter="Result"
      title="Saved Result"
      subtitle="Saved records posted as result announcements"
      onEditInNewPost={onEditInNewPost}
    />
  );
}
