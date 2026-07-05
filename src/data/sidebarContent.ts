export type LatestUpdate = {
  title: string;
  time: string;
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
  time: string;
  category: "Admit Card" | "Result";
  badge: string;
  href: string;
};

export const latestUpdates: LatestUpdate[] = [
  {
    title: "SSC CGL Result 2024",
    time: "2 hours ago",
    type: "Result",
    href: "/updates/ssc-cgl-result-2024",
  },
  {
    title: "Railway Group D Recruitment",
    time: "4 hours ago",
    type: "Job",
    href: "/updates/railway-group-d-recruitment",
  },
  {
    title: "UPSC Prelims Admit Card",
    time: "6 hours ago",
    type: "Admit Card",
    href: "/updates/upsc-prelims-admit-card",
  },
  {
    title: "Bank PO Answer Key Released",
    time: "8 hours ago",
    type: "Answer Key",
    href: "/updates/bank-po-answer-key-released",
  },
  {
    title: "Admit Card Updates",
    time: "10 hours ago",
    type: "Admit Card",
    href: "/updates/admit-card-updates",
  },
  {
    title: "Result Updates",
    time: "12 hours ago",
    type: "Result",
    href: "/updates/result-updates",
  },
  {
    title: "Admit Card Updates1",
    time: "10 hours ago",
    type: "Admit Card",
    href: "/updates/admit-card-updates-1",
  },
  {
    title: "Result Updates1",
    time: "12 hours ago",
    type: "Result",
    href: "/updates/result-updates-1",
  },
];

export const upcomingExams: UpcomingExam[] = [
  {
    title: "SSC CHSL Tier-I Exam",
    date: "15 Sep 2026",
    category: "Exam",
    badge: "SSC",
    href: "/exams/ssc-chsl-tier-1",
  },
  {
    title: "UPSC Civil Services Mains",
    date: "27 Sep 2026",
    category: "Exam",
    badge: "UPSC",
    href: "/exams/upsc-civil-services-mains",
  },
  {
    title: "IBPS PO Prelims",
    date: "04 Oct 2026",
    category: "Exam",
    badge: "IBPS",
    href: "/exams/ibps-po-prelims",
  },
  {
    title: "NDA-II Written Exam",
    date: "13 Oct 2026",
    category: "Exam",
    badge: "NDA",
    href: "/exams/nda-2-written",
  },
  {
    title: "Railway NTPC CBT",
    date: "21 Oct 2026",
    category: "Exam",
    badge: "Railway",
    href: "/exams/railway-ntpc-cbt",
  },
  {
    title: "CTET December Session",
    date: "08 Dec 2026",
    category: "Exam",
    badge: "CTET",
    href: "/exams/ctet-december-session",
  },
];

export const admitCards: RightSideItem[] = [
  {
    title: "UPSC NDA 2026",
    time: "1 hour ago",
    category: "Admit Card",
    badge: "UPSC",
    href: "/admit-cards/upsc-nda-2026",
  },
  {
    title: "SSC MTS",
    time: "3 hours ago",
    category: "Admit Card",
    badge: "SSC",
    href: "/admit-cards/ssc-mts",
  },
  {
    title: "Railway NTPC",
    time: "6 hours ago",
    category: "Admit Card",
    badge: "Railway",
    href: "/admit-cards/railway-ntpc",
  },
  {
    title: "IBPS Clerk",
    time: "9 hours ago",
    category: "Admit Card",
    badge: "IBPS",
    href: "/admit-cards/ibps-clerk",
  },
  {
    title: "STET 2026",
    time: "12 hours ago",
    category: "Admit Card",
    badge: "STET",
    href: "/admit-cards/stet-2026",
  },
  {
    title: "CTET December 2026",
    time: "1 day ago",
    category: "Admit Card",
    badge: "CTET",
    href: "/admit-cards/ctet-december-2026",
  },
  {
    title: "BPSC Teacher Phase 4",
    time: "1 day ago",
    category: "Admit Card",
    badge: "BPSC",
    href: "/admit-cards/bpsc-teacher-phase-4",
  },
  {
    title: "RRB ALP CBT-2",
    time: "2 days ago",
    category: "Admit Card",
    badge: "RRB",
    href: "/admit-cards/rrb-alp-cbt-2",
  },
  {
    title: "NTA UGC NET July 2026",
    time: "2 days ago",
    category: "Admit Card",
    badge: "NTA",
    href: "/admit-cards/nta-ugc-net-july-2026",
  },
  {
    title: "Bihar Police Constable",
    time: "3 days ago",
    category: "Admit Card",
    badge: "CSBC",
    href: "/admit-cards/bihar-police-constable",
  },
  {
    title: "Delhi Police Driver",
    time: "3 days ago",
    category: "Admit Card",
    badge: "DP",
    href: "/admit-cards/delhi-police-driver",
  },
  {
    title: "SBI Clerk Prelims 2026",
    time: "4 days ago",
    category: "Admit Card",
    badge: "SBI",
    href: "/admit-cards/sbi-clerk-prelims-2026",
  },
];

export const results: RightSideItem[] = [
  {
    title: "SSC CPO Final Result",
    time: "2 hours ago",
    category: "Result",
    badge: "SSC",
    href: "/results/ssc-cpo-final-result",
  },
  {
    title: "UP Police Result 2026",
    time: "5 hours ago",
    category: "Result",
    badge: "UP",
    href: "/results/up-police-result-2026",
  },
  {
    title: "Bank PO Mains Result",
    time: "8 hours ago",
    category: "Result",
    badge: "Bank",
    href: "/results/bank-po-mains-result",
  },
  {
    title: "UPSC CDS Result",
    time: "11 hours ago",
    category: "Result",
    badge: "UPSC",
    href: "/results/upsc-cds-result",
  },
  {
    title: "Railway Group D Result",
    time: "1 day ago",
    category: "Result",
    badge: "Railway",
    href: "/results/railway-group-d-result",
  },
  {
    title: "CTET Result 2026",
    time: "2 days ago",
    category: "Result",
    badge: "CTET",
    href: "/results/ctet-result-2026",
  },
];
