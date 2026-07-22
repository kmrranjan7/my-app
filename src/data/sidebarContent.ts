export type LatestUpdate = {
  title: string;
  startDate: string;
  type: string;
  href: string;
};

export type UpcomingExam = {
  title: string;
  date: string;
  category: "Exam";
  badge: string;
  href: string;
};

export type RightSideItem = {
  title: string;
  startDate: string;
  category: "Admit Card" | "Result";
  badge: string;
  href: string;
};

export type LatestJob = {
  badge: string;
  postName: string;
  qualification: string;
  seats: string;
  state: string;
  startDate: string;
  lastDate: string;
  href: string;
  isFeatured?: boolean;
  priorityScore?: number;
};

