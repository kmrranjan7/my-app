export type JobStatus = "Open" | "Closing Soon" | "Closed";

export interface DashboardStat {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly changeText: string;
}

export interface LatestJob {
  readonly id: string;
  readonly department: string;
  readonly title: string;
  readonly location: string;
  readonly lastDate: string;
  readonly status: JobStatus;
  readonly category: string;
}

export interface UserApplication {
  readonly id: string;
  readonly jobId: string;
  readonly jobName: string;
  readonly department: string;
  readonly appliedDate: string;
  readonly status: string;
}

export interface JobCategory {
  readonly id: string;
  readonly name: string;
  readonly openPositions: number;
}

export interface NotificationItem {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly date: string;
  readonly kind: "Recruitment" | "Exam" | "Result" | "Verification";
  readonly isNew: boolean;
}

export interface CategoryChartItem {
  readonly category: string;
  readonly applications: number;
}

export interface StatusChartItem {
  readonly status: string;
  readonly value: number;
}

export interface RecruitmentChartItem {
  readonly month: string;
  readonly vacancies: number;
  readonly applications: number;
  readonly results: number;
}

export interface MonthlyTrendItem {
  readonly month: string;
  readonly jobs: number;
}

export interface DashboardPayload {
  readonly stats: ReadonlyArray<DashboardStat>;
  readonly jobs: ReadonlyArray<LatestJob>;
  readonly applications: ReadonlyArray<UserApplication>;
  readonly categories: ReadonlyArray<JobCategory>;
  readonly notifications: ReadonlyArray<NotificationItem>;
  readonly categoryChart: ReadonlyArray<CategoryChartItem>;
  readonly statusChart: ReadonlyArray<StatusChartItem>;
  readonly recruitmentChart: ReadonlyArray<RecruitmentChartItem>;
  readonly monthlyTrend: ReadonlyArray<MonthlyTrendItem>;
}