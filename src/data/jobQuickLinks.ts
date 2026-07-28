export type QuickLink = Readonly<{
  readonly label: string;
  readonly href: string;
}>;

export const GOVT_CATEGORY_LINKS: readonly QuickLink[] = [
  { label: "SSC Jobs", href: "/?search=SSC" },
  { label: "UPSC Jobs", href: "/?search=UPSC" },
  { label: "Railway Jobs", href: "/?search=Railway" },
  { label: "Bank Jobs", href: "/?search=Bank" },
  { label: "Defence Jobs", href: "/?search=Defence" },
  { label: "Police Jobs", href: "/?search=Police" },
  { label: "Teaching Jobs", href: "/?search=Teaching" },
  { label: "PSU Jobs", href: "/?search=PSU" },
] as const;

export const STATE_WISE_LINKS: readonly QuickLink[] = [
  { label: "Uttar Pradesh Jobs", href: "/?search=Uttar%20Pradesh" },
  { label: "Bihar Jobs", href: "/?search=Bihar" },
  { label: "Madhya Pradesh Jobs", href: "/?search=Madhya%20Pradesh" },
  { label: "Rajasthan Jobs", href: "/?search=Rajasthan" },
  { label: "Maharashtra Jobs", href: "/?search=Maharashtra" },
  { label: "Gujarat Jobs", href: "/?search=Gujarat" },
  { label: "Delhi Jobs", href: "/?search=Delhi" },
  { label: "West Bengal Jobs", href: "/?search=West%20Bengal" },
] as const;
