import SavedJobsPanel from "@/components/dashboard/SavedJobsPanel";
import type { NewPostPrefillRecord } from "@/components/dashboard/NewPostPanel";

type AnswerKeyPanelProps = Readonly<{
  readonly onEditInNewPost?: (record: NewPostPrefillRecord) => void;
  readonly refreshToken?: number;
}>;

export default function AnswerKeyPanel({ onEditInNewPost, refreshToken }: AnswerKeyPanelProps) {
  return (
    <SavedJobsPanel
      postTypeFilter="Answer_Key"
      title="Answer Key"
      subtitle="Saved records posted as answer key updates"
      onEditInNewPost={onEditInNewPost}
      refreshToken={refreshToken}
    />
  );
}
