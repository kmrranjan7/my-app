export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://sarkariglobalresult.com";

export const NORMALIZED_SITE_URL = SITE_URL.endsWith("/")
  ? SITE_URL.slice(0, -1)
  : SITE_URL;

export const SITE_NAME = "Sarkari Global Result";

export const DEFAULT_SEO_TITLE =
  "Sarkari Result Jobs, Admit Card, Exam, Results | Sarkari Global Result";

export const DEFAULT_SEO_DESCRIPTION =
  "Get latest Sarkari result jobs, admit cards, exam dates, answer keys, and recruitment updates across India.";

export const DEFAULT_SEO_KEYWORDS = [
  // Core
  "sarkari result",
  "sarkari jobs",
  "government jobs",
  "latest government jobs",
  "free job alert",
  "rojgar result",
  "employment news",
  "govt vacancy",
  "online form",

  // Recruitment
  "government recruitment",
  "latest recruitment",
  "central government jobs",
  "state government jobs",
  "public sector jobs",
  "psu jobs",
  "railway jobs",
  "bank jobs",
  "defence jobs",
  "police jobs",
  "teaching jobs",
  "army recruitment",
  "navy recruitment",
  "air force recruitment",
  "ssc recruitment",
  "upsc recruitment",
  "bpsc recruitment",
  "state psc jobs",

  // Popular Exams
  "ssc cgl",
  "ssc chsl",
  "ssc mts",
  "ssc gd",
  "ssc je",
  "upsc civil services",
  "nda exam",
  "cds exam",
  "capf exam",
  "ibps po",
  "ibps clerk",
  "ibps rrb",
  "sbi po",
  "sbi clerk",
  "rrb ntpc",
  "rrb group d",
  "railway recruitment board",
  "neet exam",
  "jee main",
  "jee advanced",
  "ugc net",
  "ctet",
  "tet exam",
  "railway group d exam",
  "police constable exam",

  // Admit Card
  "admit card",
  "hall ticket",
  "exam admit card",
  "download admit card",
  "latest admit card",
  "exam hall ticket",
  "call letter",
  "interview call letter",

  // Result
  "exam result",
  "latest result",
  "government exam result",
  "board result",
  "university result",
  "competitive exam result",
  "result notification",
  "merit list",
  "selection list",
  
  "SSC Jobs",
  "UPSC Jobs",
  "Railway Recruitment",
  "Bank Recruitment",
  "Police Recruitment",
  "Teacher Recruitment",
  "Defence Recruitment",
  "Admit Card Download",
  "Exam Results",
  "Answer Key",
  "Sarkari Naukri",
  "Government Vacancy",
  "Latest Govt Jobs",
  "Free Job Alert",


  // Answer Key
  "answer key",
  "official answer key",
  "provisional answer key",
  "final answer key",
  "question paper solution",

  // Syllabus & Exam Pattern
  "exam syllabus",
  "latest syllabus",
  "exam pattern",
  "selection process",
  "preparation tips",
  "study material",
  "previous year papers",
  "mock test",

  // Documents
  "notification pdf",
  "official notification",
  "vacancy details",
  "eligibility criteria",
  "age limit",
  "application fee",
  "important dates",
  "apply online",
  "registration form",

  // Trending Long-Tail
  "latest government job notification",
  "today government jobs",
  "new vacancy 2025",
  "new vacancy 2026",
  "10th pass government jobs",
  "12th pass government jobs",
  "graduate government jobs",
  "engineering jobs",
  "government job updates",
  "sarkari naukri",
  "india government jobs",
  "central govt jobs notification",
  "state govt recruitment",
] as const;

export const BACKEND_SITEMAP_INDEX_URL =
  "http://localhost:8080/api/site/sitemap-index.xml";

export const PAGE_SITEMAP_PATHS = [
  "/",
  "/about",
  "/admission",
  "/admit-card",
  "/answer-key",
  "/contact",
  "/disclaimer",
  "/latest-job",
  "/privacy-policy",
  "/result",
  "/syllabus",
  "/terms",
] as const;

export const CATEGORY_SITEMAP_PATHS = [
  "/latest-job",
  "/admit-card",
  "/result",
] as const;

export function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${NORMALIZED_SITE_URL}${path}`;
  }

  return `${NORMALIZED_SITE_URL}/${path}`;
}

export function getOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    sameAs: [SITE_URL],
  };
}

export function getWebsiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/api/jobs?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
