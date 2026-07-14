import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  ImagePlus,
  Keyboard,
  Link2,
  Plus,
  PenLine,
  Send,
  Settings2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { useEffect, useRef, useState } from "react";

import { Card, GhostButton, SectionHeading } from "@/components/dashboard/ui";
import { useDashboardStore } from "@/stores/dashboardStore";
import type { UserApplication } from "@/types/dashboard";

const NEW_POST_DRAFT_KEY = "dashboard:new-post:draft:v1";

type PostStatus = "Draft" | "Pending Review" | "Scheduled" | "Published";
type PostCategory = "Recruitment" | "Admit" | "Exam" | "Result";
type PostType = "Job" | "Admit" | "Exam" | "Result";

const qualificationOptions = [
  "Below 10th Pass",
  "10th Pass",
  "12th Pass",
  "Diploma",
  "Graduate",
  "Post Graduate",
] as const;

const stateOptions = [
  "All India",
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Ladakh",
  "Lakshadweep",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

type DraftSnapshot = Readonly<{
  readonly postTitle: string;
  readonly postSlug: string;
  readonly contentHtml: string;
  readonly applicationId: string;
  readonly department: string;
  readonly organization: string;
  readonly qualification: string;
  readonly vacancies: number | null;
  readonly startDate: string;
  readonly endDate: string;
  readonly stateName: string;
  readonly faqSchemaJson: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly seoFocusKeyword: string;
  readonly postStatus: PostStatus;
  readonly scheduledAt: string;
  readonly postType: PostType;
  readonly postCategory: PostCategory;
}>;

function categoryFromPostType(postType: PostType): PostCategory {
  if (postType === "Admit") {
    return "Admit";
  }

  if (postType === "Exam") {
    return "Exam";
  }

  if (postType === "Result") {
    return "Result";
  }

  return "Recruitment";
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type CreatePostResponse = Readonly<{
  readonly record: {
    readonly id: string;
    readonly createdAt: string;
    readonly postTitle: string;
    readonly applicationId: string;
    readonly department: string;
  };
}>;

export type NewPostPrefillRecord = Readonly<{
  readonly id: string;
  readonly postTitle: string;
  readonly postSlug: string;
  readonly contentHtml: string;
  readonly applicationId: string;
  readonly department: string;
  readonly organization: string;
  readonly qualification: string;
  readonly vacancies: number | null;
  readonly startDate: string;
  readonly endDate: string;
  readonly stateName: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly seoFocusKeyword: string;
  readonly faqSchemaJson: string;
  readonly postStatus: PostStatus;
  readonly scheduledAt: string;
  readonly postType: PostType;
}>;

type NewPostPanelProps = Readonly<{
  readonly prefillRecord?: NewPostPrefillRecord | null;
  readonly onSavedRecord?: () => void;
}>;

type ApplicationDetailsErrors = {
  applicationId?: string;
  department?: string;
  organization?: string;
  qualification?: string;
  vacancies?: string;
  stateName?: string;
  startDate?: string;
  endDate?: string;
};

type PostBasicsErrors = {
  postTitle?: string;
  postSlug?: string;
};

export default function NewPostPanel({ prefillRecord, onSavedRecord }: NewPostPanelProps) {
  const initialDraft = (() => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(NEW_POST_DRAFT_KEY);

      if (!raw) {
        return null;
      }

      return JSON.parse(raw) as DraftSnapshot;
    } catch {
      return null;
    }
  })();

  const prefilledDraft: DraftSnapshot | null = prefillRecord
    ? {
        postTitle: prefillRecord.postTitle,
        postSlug: prefillRecord.postSlug,
        contentHtml: prefillRecord.contentHtml,
        applicationId: prefillRecord.applicationId,
        department: prefillRecord.department,
        organization: prefillRecord.organization,
        qualification: prefillRecord.qualification,
        vacancies: prefillRecord.vacancies,
        startDate: prefillRecord.startDate,
        endDate: prefillRecord.endDate,
        stateName: prefillRecord.stateName,
        faqSchemaJson: prefillRecord.faqSchemaJson,
        seoTitle: prefillRecord.seoTitle,
        seoDescription: prefillRecord.seoDescription,
        seoFocusKeyword: prefillRecord.seoFocusKeyword,
        postStatus: prefillRecord.postStatus,
        scheduledAt: prefillRecord.scheduledAt,
        postType: prefillRecord.postType,
        postCategory: categoryFromPostType(prefillRecord.postType),
      }
    : null;

  const startingDraft = prefilledDraft ?? initialDraft;

  const [editorMode, setEditorMode] = useState<"visual" | "code">("visual");
  const [contentHtml, setContentHtml] = useState(startingDraft?.contentHtml ?? "");
  const [postTitle, setPostTitle] = useState(startingDraft?.postTitle ?? "");
  const [postSlug, setPostSlug] = useState(startingDraft?.postSlug ?? "");
  const [applicationId, setApplicationId] = useState(startingDraft?.applicationId ?? "");
  const [department, setDepartment] = useState(startingDraft?.department ?? "");
  const [organization, setOrganization] = useState(startingDraft?.organization ?? "");
  const [qualification, setQualification] = useState(startingDraft?.qualification ?? "");
  const [vacancies, setVacancies] = useState<number | "">(startingDraft?.vacancies ?? "");
  const [startDate, setStartDate] = useState(startingDraft?.startDate ?? "");
  const [endDate, setEndDate] = useState(startingDraft?.endDate ?? "");
  const [stateName, setStateName] = useState(startingDraft?.stateName ?? "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [seoTitle, setSeoTitle] = useState(startingDraft?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(startingDraft?.seoDescription ?? "");
  const [seoFocusKeyword, setSeoFocusKeyword] = useState(startingDraft?.seoFocusKeyword ?? "");
  const [postStatus, setPostStatus] = useState<PostStatus>(startingDraft?.postStatus ?? "Draft");
  const [scheduledAt, setScheduledAt] = useState(startingDraft?.scheduledAt ?? "");
  const [postType, setPostType] = useState<PostType>(startingDraft?.postType ?? "Job");
  const [postCategory, setPostCategory] = useState<PostCategory>(
    startingDraft?.postCategory ?? categoryFromPostType(startingDraft?.postType ?? "Job"),
  );
  const [hasRecoverableDraft, setHasRecoverableDraft] = useState(Boolean(initialDraft));
  const [lastAutosaveAt, setLastAutosaveAt] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("recruitment-notice");
  const [isTinyReady, setIsTinyReady] = useState(false);
  const [tinyStartupError, setTinyStartupError] = useState<string | null>(null);
  const [editorRetryKey, setEditorRetryKey] = useState(0);
  const [showScreenOptions, setShowScreenOptions] = useState(false);
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [faqSchemaJson, setFaqSchemaJson] = useState(startingDraft?.faqSchemaJson ?? "");
  const [lastDraftSavedAt, setLastDraftSavedAt] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [saveRecordError, setSaveRecordError] = useState<string | null>(null);
  const [postBasicsErrors, setPostBasicsErrors] = useState<PostBasicsErrors>({});
  const [applicationDetailsErrors, setApplicationDetailsErrors] = useState<ApplicationDetailsErrors>({});
  const [showDraftConfirm, setShowDraftConfirm] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [confirmationPopup, setConfirmationPopup] = useState<{
    readonly title: string;
    readonly message: string;
  } | null>(null);
  const [collapsedBoxes, setCollapsedBoxes] = useState<{
    readonly publish: boolean;
    readonly categories: boolean;
    readonly tags: boolean;
    readonly featuredImage: boolean;
    readonly seo: boolean;
  }>({
    publish: false,
    categories: false,
    tags: false,
    featuredImage: false,
    seo: false,
  });

  const editorRef = useRef<TinyMCEEditor | null>(null);
  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(
    prefillRecord?.id ?? null,
  );
  const addApplicationFromPost = useDashboardStore((state) => state.addApplicationFromPost);

  const clearApplicationFieldError = (field: keyof ApplicationDetailsErrors) => {
    setApplicationDetailsErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const isApplicationDetailsRequired = postCategory === "Recruitment";

  const validateApplicationDetails = (): ApplicationDetailsErrors => {
    const errors: Partial<ApplicationDetailsErrors> = {};

    if (!isApplicationDetailsRequired) {
      return errors;
    }

    if (!applicationId.trim()) {
      errors.applicationId = "Application ID is required.";
    }

    if (!department.trim()) {
      errors.department = "Department is required.";
    }

    if (!organization.trim()) {
      errors.organization = "Organization is required.";
    }

    if (!qualification.trim()) {
      errors.qualification = "Qualification is required.";
    }

    if (vacancies === "") {
      errors.vacancies = "Vacancies is required.";
    } else if (!Number.isInteger(vacancies) || vacancies <= 0) {
      errors.vacancies = "Vacancies must be a positive integer.";
    }

    if (!stateName.trim()) {
      errors.stateName = "State is required.";
    }

    if (!startDate.trim()) {
      errors.startDate = "Start date is required.";
    }

    if (startDate && endDate && new Date(endDate).getTime() < new Date(startDate).getTime()) {
      errors.endDate = "End date must be on or after start date.";
    }

    return errors;
  };

  const validatePostBasics = (): PostBasicsErrors => {
    const errors: PostBasicsErrors = {};

    if (!postTitle.trim()) {
      errors.postTitle = "Post title is required.";
    }

    if (!postSlug.trim()) {
      errors.postSlug = "Permalink is required.";
    }

    return errors;
  };

  useEffect(() => {
    if (editorMode !== "visual" || isTinyReady) {
      return;
    }

    const startupTimer = window.setTimeout(() => {
      if (!isTinyReady) {
        setTinyStartupError(
          "Rich text editor could not start. TinyMCE assets may be missing or blocked.",
        );
      }
    }, 4500);

    return () => {
      window.clearTimeout(startupTimer);
    };
  }, [editorMode, isTinyReady, editorRetryKey]);

  useEffect(() => {
    if (!isApplicationDetailsRequired) {
      setApplicationDetailsErrors({});
    }
  }, [isApplicationDetailsRequired]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const autosaveTimer = window.setTimeout(() => {
      const snapshot: DraftSnapshot = {
        postTitle,
        postSlug,
        contentHtml,
        applicationId,
        department,
        organization,
        qualification,
        vacancies: vacancies === "" ? null : vacancies,
        startDate,
        endDate,
        stateName,
        faqSchemaJson,
        seoTitle,
        seoDescription,
        seoFocusKeyword,
        postStatus,
        scheduledAt,
        postType,
        postCategory,
      };

      window.localStorage.setItem(NEW_POST_DRAFT_KEY, JSON.stringify(snapshot));
      setLastAutosaveAt(new Date().toLocaleTimeString());
    }, 900);

    return () => {
      window.clearTimeout(autosaveTimer);
    };
  }, [
    applicationId,
    contentHtml,
    department,
    endDate,
    faqSchemaJson,
    organization,
    qualification,
    postSlug,
    postStatus,
    postTitle,
    scheduledAt,
    seoDescription,
    seoFocusKeyword,
    seoTitle,
    startDate,
    stateName,
    vacancies,
    postType,
    postCategory,
  ]);

  const templates = [
    {
      id: "recruitment-notice",
      label: "Recruitment Notice",
      html: "<h2>Recruitment Notice</h2><p>Applications are invited for the following positions.</p><ul><li>Post Name:</li><li>Total Vacancies:</li><li>Last Date:</li></ul>",
    },
    {
      id: "exam-update",
      label: "Exam Update",
      html: "<h2>Exam Update</h2><p>Important details regarding upcoming examination.</p><ul><li>Exam Date:</li><li>Admit Card Date:</li><li>Reporting Time:</li></ul>",
    },
    {
      id: "result-announcement",
      label: "Result Announcement",
      html: "<h2>Result Announcement</h2><p>The results for the recruitment process have been published.</p><p><strong>How to check:</strong> Visit the official result portal and enter your credentials.</p>",
    },
  ] as const;

  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ?? templates[0];

  const uploadImage = async (file: Blob, progress?: (percent: number) => void) => {
    const body = new FormData();
    body.append("file", file);

    progress?.(25);

    const response = await fetch("/api/uploads/image", {
      method: "POST",
      body,
    });

    progress?.(80);

    if (!response.ok) {
      throw new Error("Image upload failed.");
    }

    const payload = (await response.json()) as { readonly location?: string };

    if (!payload.location) {
      throw new Error("Image URL was not returned.");
    }

    progress?.(100);
    return payload.location;
  };

  const insertSelectedTemplate = () => {
    if (editorMode === "visual" && editorRef.current) {
      editorRef.current.insertContent(selectedTemplate.html);
      setContentHtml(editorRef.current.getContent());
      return;
    }

    setContentHtml((current) => `${current}\n${selectedTemplate.html}`);
  };

  const handleAddMedia = () => {
    mediaInputRef.current?.click();
  };

  const handleMediaSelection = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const location = await uploadImage(file);
      const imageHtml = `<img src="${location}" alt="Uploaded media" />`;

      if (editorMode === "visual" && editorRef.current) {
        editorRef.current.insertContent(imageHtml);
        setContentHtml(editorRef.current.getContent());
      } else {
        setContentHtml((current) => `${current}\n${imageHtml}`);
      }
    } catch {
      // Keep UI resilient; posting flow is mocked.
    } finally {
      event.target.value = "";
    }
  };
  const toggleMetaBox = (
    box: "publish" | "categories" | "tags" | "featuredImage" | "seo",
  ) => {
    setCollapsedBoxes((current) => ({
      ...current,
      [box]: !current[box],
    }));
  };

  const permalink = postSlug
    ? `https://sarkariglobalresult.gov.in/posts/${postSlug}`
    : "https://sarkariglobalresult.gov.in/posts/your-post-slug";

  const seoTitleLength = seoTitle.length;
  const seoDescriptionLength = seoDescription.length;
  const normalizedKeyword = seoFocusKeyword.trim().toLowerCase();
  const normalizedTitle = postTitle.trim().toLowerCase();
  const normalizedSlug = postSlug.trim().toLowerCase();
  const plainContent = contentHtml
    .replace(/<[^>]+>/g, " ")
    .toLowerCase();

  const seoChecks = [
    {
      label: "Post title is present",
      passed: postTitle.trim().length > 0,
    },
    {
      label: "SEO title is between 40-60 characters",
      passed: seoTitleLength >= 40 && seoTitleLength <= 60,
    },
    {
      label: "Meta description is between 120-160 characters",
      passed: seoDescriptionLength >= 120 && seoDescriptionLength <= 160,
    },
    {
      label: "Focus keyword is defined",
      passed: normalizedKeyword.length > 0,
    },
    {
      label: "Focus keyword appears in title",
      passed: normalizedKeyword.length > 0 && normalizedTitle.includes(normalizedKeyword),
    },
    {
      label: "Focus keyword appears in permalink",
      passed:
        normalizedKeyword.length > 0 && normalizedSlug.includes(slugify(normalizedKeyword)),
    },
    {
      label: "Focus keyword appears in content",
      passed: normalizedKeyword.length > 0 && plainContent.includes(normalizedKeyword),
    },
  ] as const;

  const seoScore = seoChecks.filter((item) => item.passed).length;
  const seoLevel =
    seoScore >= 6 ? "good" : seoScore >= 4 ? "medium" : "poor";

  const seoBadgeClasses =
    seoLevel === "good"
      ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-300"
      : seoLevel === "medium"
        ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-300"
        : "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-300";

  const seoLabel =
    seoLevel === "good"
      ? "SEO Strong"
      : seoLevel === "medium"
        ? "SEO Medium"
        : "SEO Weak";

  const handleRestoreDraft = () => {
    if (!initialDraft) {
      setHasRecoverableDraft(false);
      return;
    }

    setPostTitle(initialDraft.postTitle);
    setPostSlug(initialDraft.postSlug);
    setContentHtml(initialDraft.contentHtml);
    setApplicationId(initialDraft.applicationId ?? "");
    setDepartment(initialDraft.department ?? "");
    setOrganization(initialDraft.organization ?? "");
    setQualification(initialDraft.qualification ?? "");
    setVacancies(initialDraft.vacancies ?? "");
    setStartDate(initialDraft.startDate ?? "");
    setEndDate(initialDraft.endDate ?? "");
    setStateName(initialDraft.stateName ?? "");
    setFaqSchemaJson(initialDraft.faqSchemaJson ?? "");
    setSeoTitle(initialDraft.seoTitle);
    setSeoDescription(initialDraft.seoDescription);
    setSeoFocusKeyword(initialDraft.seoFocusKeyword);
    setPostStatus(initialDraft.postStatus);
    setScheduledAt(initialDraft.scheduledAt);
    setPostType(initialDraft.postType ?? "Job");
    setPostCategory(initialDraft.postCategory ?? categoryFromPostType(initialDraft.postType ?? "Job"));
    setApplicationDetailsErrors({});
    setHasRecoverableDraft(false);
    setIsSlugManuallyEdited(true);
  };

  const handleDiscardDraft = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(NEW_POST_DRAFT_KEY);
    }

    setHasRecoverableDraft(false);
  };

  const handlePublish = async () => {
    const missingRules: string[] = [];

    if (!postTitle.trim()) {
      missingRules.push("Post title");
    }
    if (contentHtml.replace(/<[^>]+>/g, " ").trim().length < 120) {
      missingRules.push("Content (minimum length)");
    }

    if (missingRules.length > 0) {
      setPublishError(`Cannot publish yet: ${missingRules.join(", ")}.`);
      return;
    }

    setPublishError(null);
    const statusToSet: PostStatus =
      postStatus === "Scheduled" && scheduledAt
        ? "Scheduled"
        : postStatus === "Pending Review"
          ? "Pending Review"
          : "Published";

    const published = await handleSavePostRecord(statusToSet);
    if (!published) {
      return;
    }

    setPostStatus(statusToSet);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(NEW_POST_DRAFT_KEY);
    }

    setLastAutosaveAt(null);
    setHasRecoverableDraft(false);
  };

  const handlePublishWithConfirmation = async () => {
    setShowPublishConfirm(false);
    await handlePublish();
  };

  const handleDraftWithConfirmation = async () => {
    setShowDraftConfirm(false);
    await handleSavePostRecord("Draft");
  };

  const handleCreateNewPost = () => {
    setPostTitle("");
    setPostSlug("");
    setIsSlugManuallyEdited(false);
    setContentHtml("");
    setApplicationId("");
    setDepartment("");
    setOrganization("");
    setQualification("");
    setVacancies("");
    setStartDate("");
    setEndDate("");
    setStateName("");
    setFaqSchemaJson("");
    setSeoTitle("");
    setSeoDescription("");
    setSeoFocusKeyword("");
    setPostStatus("Draft");
    setScheduledAt("");
    setPostType("Job");
    setPostCategory("Recruitment");
    setSelectedTemplateId("recruitment-notice");
    setLastAutosaveAt(null);
    setPublishError(null);
    setSaveRecordError(null);
    setPostBasicsErrors({});
    setApplicationDetailsErrors({});
    setHasRecoverableDraft(false);
    setEditingRecordId(null);

    if (editorRef.current) {
      editorRef.current.setContent("");
    }

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(NEW_POST_DRAFT_KEY);
    }
  };

  const handleSaveDraftVersion = () => {
    const snapshot: DraftSnapshot = {
      postTitle,
      postSlug,
      contentHtml,
      applicationId,
      department,
      organization,
      qualification,
      vacancies: vacancies === "" ? null : vacancies,
      startDate,
      endDate,
      stateName,
      faqSchemaJson,
      seoTitle,
      seoDescription,
      seoFocusKeyword,
      postStatus,
      scheduledAt,
      postType,
      postCategory,
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(NEW_POST_DRAFT_KEY, JSON.stringify(snapshot));
    }

    setLastDraftSavedAt(new Date().toLocaleTimeString());
    setHasRecoverableDraft(true);
  };

  const handleSavePostRecord = async (statusOverride?: PostStatus): Promise<boolean> => {
    const basicsErrors = validatePostBasics();
    const detailsErrors = validateApplicationDetails();

    setPostBasicsErrors(basicsErrors);
    setApplicationDetailsErrors(detailsErrors);

    if (Object.keys(basicsErrors).length > 0 || Object.keys(detailsErrors).length > 0) {
      setSaveRecordError("Please complete all required fields.");
      return false;
    }

    setSaveRecordError(null);
    handleSaveDraftVersion();

    try {
      const finalStatus = statusOverride ?? postStatus;

      const payloadBody = {
        postTitle,
        postSlug,
        contentHtml,
        applicationId,
        department,
        organization,
        qualification,
        vacancies: vacancies === "" ? null : vacancies,
        startDate,
        endDate,
        stateName,
        seoTitle,
        seoDescription,
        seoFocusKeyword,
        faqSchemaJson,
        postStatus: finalStatus,
        scheduledAt,
        postType,
      };

      const response = await fetch("/api/posts", {
        method: editingRecordId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingRecordId
            ? {
                id: editingRecordId,
                ...payloadBody,
              }
            : payloadBody,
        ),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { readonly message?: string };
        throw new Error(payload.message ?? "Failed to save post record.");
      }

      const payload = (await response.json()) as CreatePostResponse;

      if (statusOverride && statusOverride !== postStatus) {
        setPostStatus(statusOverride);
      }

      const successMessage =
        finalStatus === "Draft"
          ? "Your draft has been saved successfully."
          : finalStatus === "Scheduled"
            ? "Your post is scheduled successfully."
            : finalStatus === "Pending Review"
              ? "Your post has been submitted for review."
              : "Your post has been published successfully.";

      setConfirmationPopup({
        title: "Saved Successfully",
        message: successMessage,
      });

      if (editingRecordId) {
        onSavedRecord?.();
        return true;
      }

      setEditingRecordId(payload.record.id);

      const application: UserApplication = {
        id: payload.record.applicationId,
        jobId: payload.record.id,
        jobName: payload.record.postTitle,
        department: payload.record.department || "General",
        appliedDate: payload.record.createdAt.slice(0, 10),
        status: "Applied",
      };

      addApplicationFromPost(application);
      onSavedRecord?.();
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save post record.";
      setSaveRecordError(message);
      return false;
    }
  };

  let faqSchemaError: string | null = null;
  if (faqSchemaJson.trim()) {
    try {
      JSON.parse(faqSchemaJson);
    } catch {
      faqSchemaError = "FAQ schema is not valid JSON.";
    }
  }

  const seoPreviewTitle = seoTitle.trim() || postTitle.trim() || "Untitled Post";
  const seoPreviewDescription =
    seoDescription.trim() ||
    "Add an SEO description to control how this page appears in search results.";
  const isPostBasicsValid = Object.keys(validatePostBasics()).length === 0;
  const isApplicationDetailsValid = Object.keys(validateApplicationDetails()).length === 0;
  const isFormValid = isPostBasicsValid && isApplicationDetailsValid;

  return (
    <Card className="relative overflow-hidden border-0 bg-transparent p-0 shadow-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(14,116,144,0.14),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(2,132,199,0.12),transparent_38%),linear-gradient(180deg,#f8fbff_0%,#f3f7fb_100%)]"
      />
      <div className="relative p-3 md:p-4">
      {confirmationPopup ? (
        <div className="fixed inset-0 z-[120] flex items-start justify-center bg-slate-950/35 p-4 pt-6 backdrop-blur-[2px]">
          <div
            role="dialog"
            aria-modal="true"
            className="w-[min(420px,94vw)] rounded-2xl border border-emerald-300 bg-white p-4 shadow-[0_20px_48px_rgba(5,150,105,0.3)] dark:border-emerald-900 dark:bg-slate-950"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                  {confirmationPopup.title}
                </p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  {confirmationPopup.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmationPopup(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Close confirmation"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setConfirmationPopup(null)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-emerald-600 bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showPublishConfirm ? (
        <div className="fixed inset-0 z-[120] flex items-start justify-center bg-slate-950/35 p-4 pt-6 backdrop-blur-[2px]">
          <div
            role="dialog"
            aria-modal="true"
            className="w-[min(420px,94vw)] rounded-2xl border border-blue-300 bg-white p-4 shadow-[0_20px_48px_rgba(37,99,235,0.25)] dark:border-blue-900 dark:bg-slate-950"
          >
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              Confirm Publish
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to continue? This action will save the post to the database.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPublishConfirm(false)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => void handlePublishWithConfirmation()}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-blue-600 bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showDraftConfirm ? (
        <div className="fixed inset-0 z-[120] flex items-start justify-center bg-slate-950/35 p-4 pt-6 backdrop-blur-[2px]">
          <div
            role="dialog"
            aria-modal="true"
            className="w-[min(420px,94vw)] rounded-2xl border border-blue-300 bg-white p-4 shadow-[0_20px_48px_rgba(37,99,235,0.25)] dark:border-blue-900 dark:bg-slate-950"
          >
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              Confirm Save Draft
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to save this draft? This action will save the draft to the database.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDraftConfirm(false)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => void handleDraftWithConfirmation()}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-blue-600 bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <SectionHeading
        title="New Post"
        subtitle=""
      />

      {hasRecoverableDraft ? (
        <div className="mt-3 rounded-2xl border border-blue-200/80 bg-white/85 px-3 py-2.5 text-xs text-blue-900 shadow-[0_12px_28px_rgba(37,99,235,0.10)] backdrop-blur-sm dark:border-blue-900/60 dark:bg-blue-950/25 dark:text-blue-200">
          <p className="font-semibold">Recover previous draft?</p>
          <p className="mt-1">A saved draft is available from your last editing session.</p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="inline-flex h-7 items-center rounded-md border border-blue-400 bg-white px-2 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200 dark:hover:bg-blue-900/35"
            >
              Restore draft
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="inline-flex h-7 items-center rounded-md border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Discard
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5 border-b border-slate-300/70 pb-3 dark:border-slate-700">
        <button
          type="button"
          onClick={handleCreateNewPost}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-emerald-300/90 bg-gradient-to-b from-emerald-100 to-emerald-50 px-2.5 text-xs font-semibold text-emerald-800 shadow-[0_8px_18px_rgba(16,185,129,0.18)] transition hover:-translate-y-[1px] hover:from-emerald-200 hover:to-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
        >
          <Plus size={13} aria-hidden="true" />
          New Post
        </button>
        <button
          type="button"
          onClick={() => setShowScreenOptions((current) => !current)}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-300/90 bg-white/90 px-2.5 text-xs font-semibold text-slate-700 shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px] hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <SlidersHorizontal size={13} aria-hidden="true" />
          Screen Options
        </button>
        <button
          type="button"
          onClick={() => setShowHelpPanel((current) => !current)}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-300/90 bg-white/90 px-2.5 text-xs font-semibold text-slate-700 shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px] hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <CircleHelp size={13} aria-hidden="true" />
          Help
        </button>
        <button
          type="button"
          onClick={() => setShowShortcutsModal(true)}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-300/90 bg-white/90 px-2.5 text-xs font-semibold text-slate-700 shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px] hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Keyboard size={13} aria-hidden="true" />
          Shortcuts
        </button>
      </div>

      {showScreenOptions ? (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <p className="font-semibold">Choose what to display on this screen:</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-1.5">
              <input type="checkbox" defaultChecked className="rounded border-slate-300" />
              Publish
            </label>
            <label className="inline-flex items-center gap-1.5">
              <input type="checkbox" defaultChecked className="rounded border-slate-300" />
              Categories
            </label>
            <label className="inline-flex items-center gap-1.5">
              <input type="checkbox" defaultChecked className="rounded border-slate-300" />
              Tags
            </label>
            <label className="inline-flex items-center gap-1.5">
              <input type="checkbox" defaultChecked className="rounded border-slate-300" />
              Featured Image
            </label>
          </div>
        </div>
      ) : null}

      {showHelpPanel ? (
        <div className="mt-3 rounded-lg border border-blue-200/70 bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/35 dark:text-blue-300">
          <p className="font-semibold">Editor help</p>
          <p className="mt-1">
            Use Visual mode for formatting buttons and Text mode for raw HTML.
            Toolbar Toggle reveals additional formatting controls.
          </p>
        </div>
      ) : null}

      <form
        className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_340px]"
        onSubmit={(event) => event.preventDefault()}
      >
        <section className="space-y-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/40">
            <label
              htmlFor="post-title"
              className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400"
            >
              Add Title <span className="text-rose-600" aria-hidden="true">*</span>
            </label>
            <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                id="post-title"
                type="text"
                placeholder="Enter title here"
                value={postTitle}
                onChange={(event) => {
                  const nextTitle = event.target.value;
                  setPostTitle(nextTitle);
                  setPostBasicsErrors((current) => ({
                    ...current,
                    postTitle: undefined,
                  }));

                  if (!isSlugManuallyEdited) {
                    setPostSlug(slugify(nextTitle));
                  }
                }}
                required
                aria-invalid={Boolean(postBasicsErrors.postTitle)}
                className={`h-10 w-full rounded-xl border bg-white px-3 text-[15px] font-semibold text-slate-900 outline-none transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${
                  postBasicsErrors.postTitle
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400/35"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-400/35"
                }`}
              />
            </div>
            {postBasicsErrors.postTitle ? (
              <p className="mt-1 text-[11px] text-rose-600">{postBasicsErrors.postTitle}</p>
            ) : null}

            <label
              htmlFor="post-slug"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400"
            >
              <Link2 size={12} aria-hidden="true" />
              Permalink <span className="text-rose-600" aria-hidden="true">*</span>
            </label>
            <input
              id="post-slug"
              type="text"
              placeholder="new-recruitment-announcement"
              value={postSlug}
              onChange={(event) => {
                setIsSlugManuallyEdited(true);
                setPostSlug(slugify(event.target.value));
                setPostBasicsErrors((current) => ({
                  ...current,
                  postSlug: undefined,
                }));
              }}
              required
              aria-invalid={Boolean(postBasicsErrors.postSlug)}
              className={`mt-1 h-8 w-full rounded-lg border bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${
                postBasicsErrors.postSlug
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400/35"
                  : "border-slate-300 focus:border-blue-500 focus:ring-blue-400/35"
              }`}
            />
            {postBasicsErrors.postSlug ? (
              <p className="mt-1 text-[11px] text-rose-600">{postBasicsErrors.postSlug}</p>
            ) : null}

            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <p className="truncate">
                <span className="font-semibold">Permalink:</span> {permalink}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSlugManuallyEdited(false);
                  setPostSlug(slugify(postTitle));
                }}
                className="mt-1 text-[11px] font-semibold text-blue-700 hover:underline dark:text-blue-300"
              >
                Reset to auto slug
              </button>
            </div>

            {lastAutosaveAt ? (
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                Autosaved at {lastAutosaveAt}
              </p>
            ) : null}

          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/40">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
              Application Details
            </p>

            <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Application ID {isApplicationDetailsRequired ? <span className="text-rose-600" aria-hidden="true">*</span> : null}
                </label>
                <input
                  type="text"
                  value={applicationId}
                  onChange={(event) => {
                    setApplicationId(event.target.value);
                    clearApplicationFieldError("applicationId");
                  }}
                  required={isApplicationDetailsRequired}
                  aria-invalid={Boolean(applicationDetailsErrors.applicationId)}
                  placeholder="APP-IDBI-SO-2026"
                  className={`mt-1 h-9 w-full rounded-lg border bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${
                    applicationDetailsErrors.applicationId
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400/35"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-400/35"
                  }`}
                />
                {applicationDetailsErrors.applicationId ? (
                  <p className="mt-1 text-[11px] text-rose-600">{applicationDetailsErrors.applicationId}</p>
                ) : null}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Department {isApplicationDetailsRequired ? <span className="text-rose-600" aria-hidden="true">*</span> : null}
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(event) => {
                    setDepartment(event.target.value);
                    clearApplicationFieldError("department");
                  }}
                  required={isApplicationDetailsRequired}
                  aria-invalid={Boolean(applicationDetailsErrors.department)}
                  placeholder="Specialist Officer"
                  className={`mt-1 h-9 w-full rounded-lg border bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${
                    applicationDetailsErrors.department
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400/35"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-400/35"
                  }`}
                />
                {applicationDetailsErrors.department ? (
                  <p className="mt-1 text-[11px] text-rose-600">{applicationDetailsErrors.department}</p>
                ) : null}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Organization {isApplicationDetailsRequired ? <span className="text-rose-600" aria-hidden="true">*</span> : null}
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(event) => {
                    setOrganization(event.target.value);
                    clearApplicationFieldError("organization");
                  }}
                  required={isApplicationDetailsRequired}
                  aria-invalid={Boolean(applicationDetailsErrors.organization)}
                  placeholder="IDBI Bank"
                  className={`mt-1 h-9 w-full rounded-lg border bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${
                    applicationDetailsErrors.organization
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400/35"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-400/35"
                  }`}
                />
                {applicationDetailsErrors.organization ? (
                  <p className="mt-1 text-[11px] text-rose-600">{applicationDetailsErrors.organization}</p>
                ) : null}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Qualification {isApplicationDetailsRequired ? <span className="text-rose-600" aria-hidden="true">*</span> : null}
                </label>
                <select
                  value={qualification}
                  onChange={(event) => {
                    setQualification(event.target.value);
                    clearApplicationFieldError("qualification");
                  }}
                  required={isApplicationDetailsRequired}
                  aria-invalid={Boolean(applicationDetailsErrors.qualification)}
                  className={`mt-1 h-9 w-full rounded-lg border bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${
                    applicationDetailsErrors.qualification
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400/35"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-400/35"
                  }`}
                >
                  <option value="">Select Qualification</option>
                  {qualificationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {applicationDetailsErrors.qualification ? (
                  <p className="mt-1 text-[11px] text-rose-600">{applicationDetailsErrors.qualification}</p>
                ) : null}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Vacancies {isApplicationDetailsRequired ? <span className="text-rose-600" aria-hidden="true">*</span> : null}
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={vacancies}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    if (!nextValue) {
                      setVacancies("");
                      return;
                    }

                    const parsed = Number.parseInt(nextValue, 10);
                    if (!Number.isNaN(parsed)) {
                      setVacancies(parsed);
                      clearApplicationFieldError("vacancies");
                    }
                  }}
                  required={isApplicationDetailsRequired}
                  aria-invalid={Boolean(applicationDetailsErrors.vacancies)}
                  placeholder="120"
                  className={`mt-1 h-9 w-full rounded-lg border bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${
                    applicationDetailsErrors.vacancies
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400/35"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-400/35"
                  }`}
                />
                {applicationDetailsErrors.vacancies ? (
                  <p className="mt-1 text-[11px] text-rose-600">{applicationDetailsErrors.vacancies}</p>
                ) : null}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  State {isApplicationDetailsRequired ? <span className="text-rose-600" aria-hidden="true">*</span> : null}
                </label>
                <select
                  value={stateName}
                  onChange={(event) => {
                    setStateName(event.target.value);
                    clearApplicationFieldError("stateName");
                  }}
                  required={isApplicationDetailsRequired}
                  aria-invalid={Boolean(applicationDetailsErrors.stateName)}
                  className={`mt-1 h-9 w-full rounded-lg border bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${
                    applicationDetailsErrors.stateName
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400/35"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-400/35"
                  }`}
                >
                  <option value="">Select State</option>
                  {stateOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {applicationDetailsErrors.stateName ? (
                  <p className="mt-1 text-[11px] text-rose-600">{applicationDetailsErrors.stateName}</p>
                ) : null}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Start Date {isApplicationDetailsRequired ? <span className="text-rose-600" aria-hidden="true">*</span> : null}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    clearApplicationFieldError("startDate");
                    clearApplicationFieldError("endDate");
                  }}
                  required={isApplicationDetailsRequired}
                  aria-invalid={Boolean(applicationDetailsErrors.startDate)}
                  className={`mt-1 h-9 w-full rounded-lg border bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${
                    applicationDetailsErrors.startDate
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400/35"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-400/35"
                  }`}
                />
                {applicationDetailsErrors.startDate ? (
                  <p className="mt-1 text-[11px] text-rose-600">{applicationDetailsErrors.startDate}</p>
                ) : null}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    clearApplicationFieldError("endDate");
                  }}
                  aria-invalid={Boolean(applicationDetailsErrors.endDate)}
                  className={`mt-1 h-9 w-full rounded-lg border bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ${
                    applicationDetailsErrors.endDate
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-400/35"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-400/35"
                  }`}
                />
                {applicationDetailsErrors.endDate ? (
                  <p className="mt-1 text-[11px] text-rose-600">{applicationDetailsErrors.endDate}</p>
                ) : null}
              </div>
            </div>

          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/40">
            <div className="mb-2">
              <button
                type="button"
                onClick={handleAddMedia}
                className="inline-flex h-7.5 items-center gap-1.5 rounded-md border border-slate-300 bg-slate-50 px-2 text-xs font-semibold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ImagePlus size={13} aria-hidden="true" />
                Add Media
              </button>
              <input
                ref={mediaInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleMediaSelection}
              />
            </div>

            <div className="mb-2 flex flex-wrap items-center gap-2">
              <select
                value={selectedTemplateId}
                onChange={(event) => {
                  const nextTemplate = event.target.value;
                  setSelectedTemplateId(nextTemplate);

                  if (nextTemplate === "exam-update") {
                    setPostType("Exam");
                    setPostCategory("Exam");
                    return;
                  }

                  if (nextTemplate === "result-announcement") {
                    setPostType("Result");
                    setPostCategory("Result");
                    return;
                  }

                  setPostType("Job");
                  setPostCategory("Recruitment");
                }}
                className="h-7.5 rounded-md border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={insertSelectedTemplate}
                className="inline-flex h-7.5 items-center gap-1.5 rounded-md border border-blue-300 bg-blue-50 px-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/35 dark:text-blue-300 dark:hover:bg-blue-950/50"
              >
                <Plus size={12} aria-hidden="true" />
                Insert Template
              </button>
            </div>

            <div className="mb-3 inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 p-1 text-xs dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setEditorMode("visual")}
                className={[
                  "rounded-md px-2.5 py-1 font-semibold",
                  editorMode === "visual"
                    ? "bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-300",
                ].join(" ")}
              >
                Visual
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditorMode("code");
                }}
                className={[
                  "rounded-md px-2.5 py-1 font-semibold",
                  editorMode === "code"
                    ? "bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-300",
                ].join(" ")}
              >
                Text
              </button>
            </div>

            {editorMode === "visual" ? (
              <>
                {tinyStartupError ? (
                  <div className="mb-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/35 dark:text-amber-200">
                    <p className="font-semibold">TinyMCE startup issue</p>
                    <p className="mt-1">{tinyStartupError}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTinyStartupError(null);
                          setIsTinyReady(false);
                          setEditorRetryKey((current) => current + 1);
                        }}
                        className="inline-flex h-7 items-center rounded-md border border-amber-400 bg-white px-2 text-[11px] font-semibold text-amber-800 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200 dark:hover:bg-amber-900/35"
                      >
                        Retry editor
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorMode("code")}
                        className="inline-flex h-7 items-center rounded-md border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Use Text mode
                      </button>
                    </div>
                  </div>
                ) : null}

                <Editor
                  key={editorRetryKey}
                  id="post-content"
                  apiKey="no-api-key"
                  licenseKey="gpl"
                  tinymceScriptSrc="/tinymce/tinymce.min.js"
                  value={contentHtml}
                  onInit={(_, editor) => {
                    editorRef.current = editor;
                    setIsTinyReady(true);
                    setTinyStartupError(null);
                  }}
                  onEditorChange={(value) => {
                    setContentHtml(value);
                  }}
                  init={{
                    height: 420,
                    menubar: false,
                    branding: false,
                    browser_spellcheck: true,
                    contextmenu: false,
                    toolbar_sticky: true,
                    plugins:
                      "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",
                    toolbar:
                      "styleselect | bold italic underline | alignleft aligncenter alignright | bullist numlist blockquote | link image media | code fullscreen | undo redo | removeformat",
                    automatic_uploads: true,
                    images_upload_handler: async (
                      blobInfo: { readonly blob: () => Blob },
                      progress: (percent: number) => void,
                    ) => {
                      return uploadImage(blobInfo.blob(), progress);
                    },
                    content_style:
                      "body { font-family: Georgia, 'Times New Roman', serif; font-size:14px; line-height:1.6; padding:8px; } h2 { font-size:1.3rem; } blockquote { border-left:3px solid #cbd5e1; margin: 0.8rem 0; padding: 0.2rem 0 0.2rem 0.8rem; color: #475569; }",
                  }}
                />
              </>
            ) : (
              <textarea
                id="post-content"
                rows={14}
                placeholder="Write HTML content here..."
                value={contentHtml}
                onChange={(event) => {
                  setContentHtml(event.target.value);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            )}

            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <PenLine size={13} aria-hidden="true" />
              Publishing is currently mocked in UI mode.
            </p>
          </div>
        </section>

        <aside className="space-y-3 xl:sticky xl:top-4 self-start">
          <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/40">
            <button
              type="button"
              onClick={() => toggleMetaBox("publish")}
              className="flex w-full items-center justify-between"
            >
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                <Settings2 size={14} aria-hidden="true" />
                Publish
              </span>
              {collapsedBoxes.publish ? (
                <ChevronDown size={14} aria-hidden="true" />
              ) : (
                <ChevronUp size={14} aria-hidden="true" />
              )}
            </button>

            {!collapsedBoxes.publish ? (
              <>
                <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <p>
                    Status: <span className="font-semibold">{postStatus}</span>
                  </p>
                  <p>
                    Visibility: <span className="font-semibold">Public</span> • <button type="button" className="text-blue-700 hover:underline dark:text-blue-300">Edit</button>
                  </p>
                  <p>
                    Publish: <span className="font-semibold">{postStatus === "Scheduled" && scheduledAt ? scheduledAt : "Immediately"}</span>
                  </p>
                </div>
                <div className="mt-2 space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Workflow Status
                  </label>
                  <select
                    value={postStatus}
                    onChange={(event) => setPostStatus(event.target.value as PostStatus)}
                    className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                {postStatus === "Scheduled" ? (
                  <div className="mt-2 space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(event) => setScheduledAt(event.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    />
                  </div>
                ) : null}

                <div className="mt-3 flex flex-col gap-2">
                  <GhostButton
                    label="Save Draft"
                    onClick={() => setShowDraftConfirm(true)}
                    disabled={!isFormValid}
                  />
                  <button
                    type="submit"
                    onClick={() => setShowPublishConfirm(true)}
                    disabled={!isFormValid}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-blue-600 bg-blue-600 px-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send size={14} aria-hidden="true" />
                    {postStatus === "Scheduled" ? "Schedule" : postStatus === "Pending Review" ? "Submit for Review" : "Publish"}
                  </button>
                </div>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <CalendarClock size={12} aria-hidden="true" />
                  Publish immediately
                </p>

                {publishError ? (
                  <p className="mt-2 rounded-md border border-rose-300 bg-rose-50 px-2 py-1 text-[11px] text-rose-700 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-300">
                    {publishError}
                  </p>
                ) : null}

                {lastDraftSavedAt ? (
                  <p className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-300">
                    Draft saved at {lastDraftSavedAt}
                  </p>
                ) : null}

                {saveRecordError ? (
                  <p className="mt-2 rounded-md border border-rose-300 bg-rose-50 px-2 py-1 text-[11px] text-rose-700 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-300">
                    {saveRecordError}
                  </p>
                ) : null}

              </>
            ) : null}
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/40">
            <button
              type="button"
              onClick={() => toggleMetaBox("categories")}
              className="flex w-full items-center justify-between"
            >
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Categories</span>
              {collapsedBoxes.categories ? (
                <ChevronDown size={14} aria-hidden="true" />
              ) : (
                <ChevronUp size={14} aria-hidden="true" />
              )}
            </button>

            {!collapsedBoxes.categories ? (
              <div className="mt-2 space-y-1.5 text-sm text-slate-700 dark:text-slate-200">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="post-category"
                    checked={postCategory === "Recruitment"}
                    onChange={() => {
                      setPostCategory("Recruitment");
                      setPostType("Job");
                    }}
                    className="border-slate-300"
                  />
                  Recruitment
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="post-category"
                    checked={postCategory === "Admit"}
                    onChange={() => {
                      setPostCategory("Admit");
                      setPostType("Admit");
                    }}
                    className="border-slate-300"
                  />
                  Admit
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="post-category"
                    checked={postCategory === "Exam"}
                    onChange={() => {
                      setPostCategory("Exam");
                      setPostType("Exam");
                    }}
                    className="border-slate-300"
                  />
                  Exam
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="post-category"
                    checked={postCategory === "Result"}
                    onChange={() => {
                      setPostCategory("Result");
                      setPostType("Result");
                    }}
                    className="border-slate-300"
                  />
                  Result
                </label>
              </div>
            ) : null}
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/40">
            <button
              type="button"
              onClick={() => toggleMetaBox("tags")}
              className="flex w-full items-center justify-between"
            >
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Tags</span>
              {collapsedBoxes.tags ? (
                <ChevronDown size={14} aria-hidden="true" />
              ) : (
                <ChevronUp size={14} aria-hidden="true" />
              )}
            </button>

            {!collapsedBoxes.tags ? (
              <input
                type="text"
                placeholder="jobs, notice, railway"
                className="mt-2 h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />
            ) : null}
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/40">
            <button
              type="button"
              onClick={() => toggleMetaBox("featuredImage")}
              className="flex w-full items-center justify-between"
            >
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Featured Image</span>
              {collapsedBoxes.featuredImage ? (
                <ChevronDown size={14} aria-hidden="true" />
              ) : (
                <ChevronUp size={14} aria-hidden="true" />
              )}
            </button>

            {!collapsedBoxes.featuredImage ? (
              <button
                type="button"
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-400 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
              >
                <ImagePlus size={14} aria-hidden="true" />
                Set Featured Image
              </button>
            ) : null}
          </article>

          <article className="rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_14px_34px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/40">
            <button
              type="button"
              onClick={() => toggleMetaBox("seo")}
              className="flex w-full items-center justify-between"
            >
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">SEO</span>
              {collapsedBoxes.seo ? (
                <ChevronDown size={14} aria-hidden="true" />
              ) : (
                <ChevronUp size={14} aria-hidden="true" />
              )}
            </button>

            {!collapsedBoxes.seo ? (
              <div className="mt-2 space-y-2.5">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      SEO Score: {seoScore}/7
                    </span>
                    <span
                      className={[
                        "rounded-full border px-2 py-0.5 text-[11px] font-bold",
                        seoBadgeClasses,
                      ].join(" ")}
                    >
                      {seoLabel}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={[
                        "h-full transition-all",
                        seoLevel === "good"
                          ? "bg-emerald-500"
                          : seoLevel === "medium"
                            ? "bg-amber-500"
                            : "bg-rose-500",
                      ].join(" ")}
                      style={{ width: `${Math.round((seoScore / 7) * 100)}%` }}
                    />
                  </div>
                </div>

                <ul className="space-y-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] dark:border-slate-700 dark:bg-slate-900">
                  {seoChecks.map((check) => (
                    <li key={check.label} className="flex items-start justify-between gap-2">
                      <span className="text-slate-600 dark:text-slate-300">{check.label}</span>
                      <span
                        className={[
                          "shrink-0 rounded-full px-1.5 py-0.5 font-semibold",
                          check.passed
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/35 dark:text-emerald-300"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-950/35 dark:text-rose-300",
                        ].join(" ")}
                      >
                        {check.passed ? "Pass" : "Fix"}
                      </span>
                    </li>
                  ))}
                </ul>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(event) => setSeoTitle(event.target.value)}
                    placeholder="Optimized title for search engines"
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {seoTitleLength}/60 characters
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={(event) => setSeoDescription(event.target.value)}
                    placeholder="Short summary for search snippets"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    {seoDescriptionLength}/160 characters
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Focus Keyword
                  </label>
                  <input
                    type="text"
                    value={seoFocusKeyword}
                    onChange={(event) => setSeoFocusKeyword(event.target.value)}
                    placeholder="eg. railway recruitment 2026"
                    className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                    SEO Snippet Preview
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {seoPreviewTitle}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-emerald-700 dark:text-emerald-300">
                    {permalink}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                    {seoPreviewDescription}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    FAQ Schema (JSON-LD)
                  </label>
                  <textarea
                    rows={7}
                    value={faqSchemaJson}
                    onChange={(event) => setFaqSchemaJson(event.target.value)}
                    placeholder='{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": []
}'
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 font-mono text-[11px] text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  />
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Optional: add custom FAQ JSON-LD schema.
                  </p>
                  {faqSchemaError ? (
                    <p className="mt-1 text-[11px] text-rose-700 dark:text-rose-300">
                      {faqSchemaError}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </article>
        </aside>
      </form>

      {showShortcutsModal ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Keyboard Shortcuts
              </h3>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Close shortcuts modal"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Ctrl+B</td>
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300">Bold</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Ctrl+I</td>
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300">Italic</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Ctrl+U</td>
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300">Underline</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Ctrl+Z</td>
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300">Undo</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Ctrl+Y</td>
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300">Redo</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 font-semibold text-slate-700 dark:text-slate-200">Alt+Shift+1</td>
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300">Heading 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
      </div>
    </Card>
  );
}
