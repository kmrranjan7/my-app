import { API_PUBLIC_BASE_URL } from "@/lib/apiConfig";

export type PublicJob = Readonly<{
  readonly applicationId?: string;
  readonly organization?: string;
  readonly postSlug?: string;
  readonly postTitle?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly stateName?: string;
  readonly vacancies?: number;
}>;

type PublicJobsResponse = Readonly<{
  readonly data?: { readonly content?: PublicJob[] };
}>;

export async function fetchPublicJobs(
  postType: string,
  page: number,
  size = 20,
): Promise<PublicJob[]> {
  const params = new URLSearchParams({
    postType,
    postStatus: "Published",
    size: String(size),
    sortBy: "createdAt",
    sortDir: "desc",
    page: String(page),
  });

  try {
    const response = await fetch(`${API_PUBLIC_BASE_URL}/jobs?${params}`, {
      method: "GET",
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as PublicJobsResponse;
    return payload.data?.content ?? [];
  } catch {
    return [];
  }
}
