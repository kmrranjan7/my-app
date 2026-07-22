import SavedJobsPanel from "@/components/dashboard/SavedJobsPanel";
import type { NewPostPrefillRecord } from "@/components/dashboard/NewPostPanel";

type AdmissionPanelProps = Readonly<{
  readonly onEditInNewPost?: (record: NewPostPrefillRecord) => void;
  readonly refreshToken?: number;
}>;

export default function AdmissionPanel({ onEditInNewPost, refreshToken }: AdmissionPanelProps) {
  return (
    <SavedJobsPanel
      postTypeFilter="Admission"
      title="Admission"
      subtitle="Saved records posted as admission updates"
      onEditInNewPost={onEditInNewPost}
      refreshToken={refreshToken}
    />
  );
}
