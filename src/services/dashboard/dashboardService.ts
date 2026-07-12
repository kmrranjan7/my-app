import type {
  DashboardPayload,
  LatestJob,
  UserApplication,
} from "@/types/dashboard";

type DashboardApiErrorPayload = Readonly<{
  readonly message?: string;
}>;

type CreatePostApiResponse = Readonly<{
  readonly record: {
    readonly id: string;
    readonly createdAt: string;
    readonly postTitle: string;
    readonly applicationId: string;
    readonly department: string;
  };
}>;

function wait(delayMs = 350): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const dashboardService = {
  async fetchDashboard(): Promise<DashboardPayload> {
    const response = await fetch("/api/dashboard", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as DashboardApiErrorPayload | null;
      throw new Error(payload?.message ?? "Failed to fetch dashboard.");
    }

    const payload = (await response.json()) as DashboardPayload;
    return payload;
  },

  async createApplication(job: LatestJob): Promise<UserApplication> {
    await wait(220);

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postTitle: job.title,
        postSlug: slugify(job.title),
        contentHtml: `<p>Application created from dashboard for ${job.title}.</p>`,
        applicationId: job.id,
        department: job.department,
        organization: job.department,
        endDate: job.lastDate,
        stateName: job.location,
        postStatus: "Draft",
        postType: "Job",
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as DashboardApiErrorPayload | null;
      throw new Error(payload?.message ?? "Failed to create application.");
    }

    const payload = (await response.json()) as CreatePostApiResponse;

    return {
      id: payload.record.applicationId || job.id,
      jobId: payload.record.id,
      jobName: payload.record.postTitle,
      department: payload.record.department || job.department,
      appliedDate: payload.record.createdAt.slice(0, 10),
      status: "Applied",
    };
  },
};