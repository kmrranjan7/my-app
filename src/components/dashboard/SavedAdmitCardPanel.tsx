import SavedJobsPanel from "@/components/dashboard/SavedJobsPanel";
import type { NewPostPrefillRecord } from "@/components/dashboard/NewPostPanel";

type SavedAdmitCardPanelProps = Readonly<{
  readonly onEditInNewPost?: (record: NewPostPrefillRecord) => void;
  readonly refreshToken?: number;
}>;

export default function SavedAdmitCardPanel({
  onEditInNewPost,
  refreshToken,
}: SavedAdmitCardPanelProps) {
  return (
    <SavedJobsPanel
      postTypeFilter="Admit"
      title="Saved Admit Card"
      subtitle="Saved records posted as admit card updates"
      onEditInNewPost={onEditInNewPost}
      refreshToken={refreshToken}
    />
  );
}
