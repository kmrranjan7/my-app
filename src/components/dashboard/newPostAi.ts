import { API_BASE_URL } from "@/lib/apiConfig";

type PostStatus = "Draft" | "Pending Review" | "Scheduled" | "Published";
type PostType = "Job" | "Admit" | "Exam" | "Result" | "Admission" | "Syllabus" | "Answer_Key";

const POST_STATUS_OPTIONS = ["Draft", "Pending Review", "Scheduled", "Published"] as const;
const POST_TYPE_OPTIONS = ["Job", "Admit", "Exam", "Result", "Admission", "Syllabus", "Answer_Key"] as const;

type OpenAiSendApiResponse = Readonly<{
  readonly message?: string;
  readonly data?: {
    readonly responseMessage?: string;
  };
}>;

type AiDraftSuggestion = Partial<{
  postTitle: string;
  postSlug: string;
  contentHtml: string;
  applicationId: string;
  department: string;
  organization: string;
  qualification: string;
  vacancies: number;
  startDate: string;
  endDate: string;
  stateName: string;
  faqSchemaJson: string;
  seoTitle: string;
  seoDescription: string;
  seoFocusKeyword: string;
  postStatus: PostStatus;
  scheduledAt: string;
  postType: PostType;
  isFeatured: boolean;
  priorityScore: number;
}>;

export type AiAutofillPatch = Partial<{
  postTitle: string;
  postSlug: string;
  contentHtml: string;
  applicationId: string;
  department: string;
  organization: string;
  qualification: string;
  vacancies: number;
  startDate: string;
  endDate: string;
  stateName: string;
  faqSchemaJson: string;
  seoTitle: string;
  seoDescription: string;
  seoFocusKeyword: string;
  postStatus: PostStatus;
  scheduledAt: string;
  postType: PostType;
  isFeatured: boolean;
  priorityScore: number;
}>;

export type BuildAiAutofillPatchInput = Readonly<{
  title: string;
  currentContentHtml: string;
  currentPostSlug: string;
  isSlugManuallyEdited: boolean;
  qualificationOptions: readonly string[];
  stateOptions: readonly string[];
}>;

function parseAiSuggestion(rawText: string): AiDraftSuggestion {
  const trimmed = rawText.trim();

  let jsonCandidate = trimmed;
  const fenceStart = trimmed.indexOf("```");
  if (fenceStart >= 0) {
    const afterStart = fenceStart + 3;
    const nextLineBreak = trimmed.indexOf("\n", afterStart);
    const contentStart = nextLineBreak >= 0 ? nextLineBreak + 1 : afterStart;
    const fenceEnd = trimmed.indexOf("```", contentStart);
    if (fenceEnd > contentStart) {
      jsonCandidate = trimmed.slice(contentStart, fenceEnd).trim();
    }
  }

  const firstBrace = jsonCandidate.indexOf("{");
  const lastBrace = jsonCandidate.lastIndexOf("}");
  const normalized =
    firstBrace >= 0 && lastBrace > firstBrace
      ? jsonCandidate.slice(firstBrace, lastBrace + 1)
      : jsonCandidate;

  return JSON.parse(normalized) as AiDraftSuggestion;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function requestAiSuggestion(title: string): Promise<AiDraftSuggestion> {
  const response = await fetch(`${API_BASE_URL}/api/v1/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: title }),
  });

  const payload = (await response.json()) as OpenAiSendApiResponse;
  if (!response.ok) {
    throw new Error(payload.message ?? "AI request failed.");
  }

  const aiRaw = payload.data?.responseMessage;
  if (!aiRaw) {
    throw new Error("AI response was empty.");
  }

  return parseAiSuggestion(aiRaw);
}

export async function buildAiAutofillPatch(input: BuildAiAutofillPatchInput): Promise<AiAutofillPatch> {
  const title = input.title.trim();
  if (!title) {
    throw new Error("Post title is required for AI autofill.");
  }

  const aiData = await requestAiSuggestion(title);

  const nextPostTitle = aiData.postTitle?.trim() || title;
  const nextPostSlug = aiData.postSlug?.trim() || slugify(nextPostTitle);
  const nextContentHtml = aiData.contentHtml?.trim() || input.currentContentHtml;

  const patch: AiAutofillPatch = {
    postTitle: nextPostTitle,
    contentHtml: nextContentHtml,
  };

  if (!input.isSlugManuallyEdited || !input.currentPostSlug.trim()) {
    patch.postSlug = slugify(nextPostSlug);
  }

  if (typeof aiData.applicationId === "string") patch.applicationId = aiData.applicationId;
  if (typeof aiData.department === "string") patch.department = aiData.department;
  if (typeof aiData.organization === "string") patch.organization = aiData.organization;

  if (
    typeof aiData.qualification === "string" &&
    input.qualificationOptions.includes(aiData.qualification)
  ) {
    patch.qualification = aiData.qualification;
  }

  if (typeof aiData.vacancies === "number" && Number.isFinite(aiData.vacancies) && aiData.vacancies >= 0) {
    patch.vacancies = Math.floor(aiData.vacancies);
  }

  if (typeof aiData.startDate === "string") patch.startDate = aiData.startDate;
  if (typeof aiData.endDate === "string") patch.endDate = aiData.endDate;

  if (typeof aiData.stateName === "string" && input.stateOptions.includes(aiData.stateName)) {
    patch.stateName = aiData.stateName;
  }

  if (typeof aiData.faqSchemaJson === "string") patch.faqSchemaJson = aiData.faqSchemaJson;
  if (typeof aiData.seoTitle === "string") patch.seoTitle = aiData.seoTitle;
  if (typeof aiData.seoDescription === "string") patch.seoDescription = aiData.seoDescription;
  if (typeof aiData.seoFocusKeyword === "string") patch.seoFocusKeyword = aiData.seoFocusKeyword;

  if (typeof aiData.postStatus === "string" && POST_STATUS_OPTIONS.includes(aiData.postStatus)) {
    patch.postStatus = aiData.postStatus;
  }

  if (typeof aiData.scheduledAt === "string") patch.scheduledAt = aiData.scheduledAt;

  if (typeof aiData.postType === "string" && POST_TYPE_OPTIONS.includes(aiData.postType)) {
    patch.postType = aiData.postType;
  }

  if (typeof aiData.isFeatured === "boolean") patch.isFeatured = aiData.isFeatured;
  if (typeof aiData.priorityScore === "number" && Number.isFinite(aiData.priorityScore)) {
    patch.priorityScore = Math.min(100, Math.max(0, Math.round(aiData.priorityScore)));
  }

  return patch;
}
