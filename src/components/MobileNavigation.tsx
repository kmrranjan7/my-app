"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  MoreHorizontal,
  Home,
  BriefcaseBusiness,
  IdCard,
  Trophy,
  type LucideIcon,
} from "lucide-react";

type MobileNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const mobileNavItems: MobileNavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Latest Jobs", href: "/latest-jobs", icon: BriefcaseBusiness },
  { label: "Admit Cards", href: "/admit-cards", icon: IdCard },
  { label: "Results", href: "/results", icon: Trophy },
];

type MenuSection = {
  title: string;
  items: Array<{ label: string; href: string }>;
};

const moreMenuSections: MenuSection[] = [
  {
    title: "Exam & Study",
    items: [
      { label: "Exams", href: "/exams" },
      { label: "Syllabus", href: "/syllabus" },
      { label: "Answer Keys", href: "/answer-keys" },
      { label: "Admissions", href: "/admissions" },
    ],
  },
  {
    title: "Tools",
    items: [
      { label: "Image Compressor", href: "/image-compress" },
    ],
  },
  {
    title: "Information",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

type MobileNavigationProps = Readonly<{
  pathname: string;
}>;

const isActiveRoute = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
};

const isMoreMenuActive = (pathname: string, sections: MenuSection[]) => {
  return sections.some((section) =>
    section.items.some((item) => isActiveRoute(pathname, item.href))
  );
};

export default function MobileNavigation({ pathname }: MobileNavigationProps) {
  const moreMenuRef = useRef<HTMLDetailsElement | null>(null);
  const isMoreActive = isMoreMenuActive(pathname, moreMenuSections);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const menu = moreMenuRef.current;

      if (!menu?.open) {
        return;
      }

      if (event.target instanceof Node && !menu.contains(event.target)) {
        menu.open = false;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && moreMenuRef.current?.open) {
        moreMenuRef.current.open = false;
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const closeMoreMenu = () => {
    if (moreMenuRef.current?.open) {
      moreMenuRef.current.open = false;
    }
  };

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-white via-white/95 to-transparent px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden"
        aria-label="Mobile Footer Navigation"
      >
        <div className="relative overflow-visible rounded-2xl border border-white/70 bg-white/90 shadow-[0_14px_38px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5 backdrop-blur-2xl backdrop-saturate-150">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(120deg,rgba(255,255,255,0.82),rgba(255,255,255,0.12))]" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200/80 to-transparent" />
          
          <div className="relative grid w-full grid-cols-5 p-1">
            {mobileNavItems.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-1 text-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2"
                >
                  {active && (
                    <span className="absolute bottom-1 size-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.7)]" />
                  )}
                  
                  <span className={[
                    "relative inline-flex items-center justify-center transition-all duration-300",
                    active
                      ? "size-8 scale-105 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-[0_5px_12px_rgba(79,70,229,0.32)]"
                      : "group-active:scale-90",
                  ].join(" ")}>
                    <Icon
                      className={[
                        "size-5 transition-all duration-200",
                        active
                          ? "text-white"
                          : "text-slate-500 group-active:text-slate-700",
                      ].join(" ")}
                      strokeWidth={active ? 2.4 : 2}
                      aria-hidden="true"
                    />
                  </span>
                  
                  <span
                    className={[
                      "relative text-[9px] font-bold leading-none tracking-tight transition-all duration-200",
                      active
                        ? "text-indigo-700"
                        : "text-slate-500 group-active:text-slate-700",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <details ref={moreMenuRef} className="group relative [&_summary::-webkit-details-marker]:hidden">
              <summary
                className={[
                  "relative flex min-h-[58px] list-none flex-col items-center justify-center gap-1 rounded-xl px-1 text-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 cursor-pointer",
                ].join(" ")}
              >
                {isMoreActive && (
                  <span className="absolute bottom-1 size-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.7)]" />
                )}
                
                <span className={[
                  "relative inline-flex items-center justify-center transition-all duration-300",
                  isMoreActive
                    ? "size-8 scale-105 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-[0_5px_12px_rgba(79,70,229,0.32)]"
                    : "group-active:scale-90",
                ].join(" ")}>
                  <MoreHorizontal
                    className={[
                      "size-5 transition-all duration-200",
                      isMoreActive
                        ? "text-white"
                        : "text-slate-500 group-active:text-slate-700",
                    ].join(" ")}
                    strokeWidth={isMoreActive ? 2.4 : 2}
                    aria-hidden="true"
                  />
                </span>
                
                <span
                  className={[
                      "relative text-[9px] font-bold leading-none tracking-tight transition-all duration-200",
                      isMoreActive
                        ? "text-indigo-700"
                      : "text-slate-500 group-active:text-slate-700",
                  ].join(" ")}
                >
                  More
                </span>
              </summary>

              <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.75rem)] z-50 hidden max-h-[70vh] flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/95 shadow-[0_28px_70px_-18px_rgba(15,23,42,0.36),0_0_0_1px_rgba(15,23,42,0.06)] backdrop-blur-2xl backdrop-saturate-150 group-open:flex animate-in fade-in slide-in-from-bottom-5 duration-300">
                <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_right,rgba(186,230,253,0.9),transparent_48%),linear-gradient(120deg,#eef2ff,#ffffff,#ecfeff)] px-5 pb-3 pt-2.5">
                  <span className="mx-auto mb-2 block h-1 w-9 rounded-full bg-slate-300/80" aria-hidden="true" />
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-indigo-700">Explore more</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-800">Useful sections and tools</p>
                </div>
                <div className="overflow-y-auto overscroll-contain">
                  {moreMenuSections.map((section, sectionIndex) => (
                    <div
                      key={section.title}
                      className={[
                        "px-3 py-2.5",
                        sectionIndex < moreMenuSections.length - 1 ? "border-b border-slate-200/50" : "",
                      ].join(" ")}
                    >
                      <p className="mb-1.5 px-2 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                        {section.title}
                      </p>
                      <div className="space-y-1">
                        {section.items.map((item) => {
                          const active = isActiveRoute(pathname, item.href);

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              aria-current={active ? "page" : undefined}
                              onClick={closeMoreMenu}
                              className={[
                                "group/item relative block overflow-hidden rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 active:scale-[0.98]",
                                active
                                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25"
                                  : "text-slate-700 hover:bg-slate-50 active:bg-slate-100",
                              ].join(" ")}
                            >
                              {!active && (
                                <span className="absolute inset-0 bg-gradient-to-br from-slate-100/0 via-slate-100/0 to-slate-100/50 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 group-active/item:opacity-100" />
                              )}
                              <span className="relative">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="sticky bottom-0 h-4 bg-gradient-to-t from-white/95 to-transparent pointer-events-none" />
              </div>
            </details>
          </div>
        </div>
      </nav>

      <div aria-hidden="true" className="h-[92px] lg:hidden" />
    </>
  );
}
