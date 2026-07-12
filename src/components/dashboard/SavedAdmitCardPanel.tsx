import SavedJobsPanel from "@/components/dashboard/SavedJobsPanel";
import type { NewPostPrefillRecord } from "@/components/dashboard/NewPostPanel";

type SavedAdmitCardPanelProps = Readonly<{
  readonly onEditInNewPost?: (record: NewPostPrefillRecord) => void;
}>;

export default function SavedAdmitCardPanel({
  onEditInNewPost,
}: SavedAdmitCardPanelProps) {
  return (
    <SavedJobsPanel
      postTypeFilter="Admit"
      title="Saved Admit Card"
      subtitle="Saved records posted as admit card updates"
      onEditInNewPost={onEditInNewPost}
    />
  );
}
