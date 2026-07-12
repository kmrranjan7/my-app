import {
  createApplicationFromJob,
  dashboardMockData,
} from "@/services/dashboard/mockData";
import type {
  DashboardPayload,
  LatestJob,
  UserApplication,
} from "@/types/dashboard";

type MutableDashboardPayload = {
  -readonly [K in keyof DashboardPayload]: DashboardPayload[K];
};

const mockDb: MutableDashboardPayload = structuredClone(dashboardMockData);

function wait(delayMs = 350): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

export const dashboardService = {
  async fetchDashboard(): Promise<DashboardPayload> {
    await wait();
    return structuredClone(mockDb);
  },

  async createApplication(job: LatestJob): Promise<UserApplication> {
    await wait(260);
    const nextId = mockDb.applications.length + 1;
    const created = createApplicationFromJob(job, nextId);
    mockDb.applications = [created, ...mockDb.applications];

    return created;
  },
};