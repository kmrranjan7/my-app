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
  { label: "Jobs", href: "/latest-jobs", icon: BriefcaseBusiness },
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
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/40 bg-white/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl backdrop-saturate-150 lg:hidden"
        aria-label="Mobile Footer Navigation"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50/30 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative grid w-full grid-cols-5 px-2 py-2">
            {mobileNavItems.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-center transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2"
                >
                  {active && (
                    <span className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-10 rounded-xl bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent" />
                  )}
                  
                  <span className={[
                    "relative inline-flex items-center justify-center transition-all duration-300",
                    active ? "scale-110" : "group-active:scale-90",
                  ].join(" ")}>
                    <Icon
                      className={[
                        "h-[22px] w-[22px] transition-all duration-300",
                        active 
                          ? "text-blue-600 drop-shadow-[0_2px_8px_rgba(59,130,246,0.4)]" 
                          : "text-slate-500 group-active:text-slate-700",
                      ].join(" ")}
                      strokeWidth={active ? 2.5 : 2.2}
                      aria-hidden="true"
                    />
                  </span>
                  
                  <span
                    className={[
                      "relative text-[10px] font-semibold leading-none tracking-tight transition-all duration-300",
                      active 
                        ? "text-blue-600" 
                        : "text-slate-500 group-active:text-slate-700",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <details ref={moreMenuRef} className="group relative">
              <summary
                className={[
                  "relative flex min-h-[60px] list-none flex-col items-center justify-center gap-1 rounded-2xl px-1 text-center transition-all duration-300 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 cursor-pointer",
                ].join(" ")}
              >
                {isMoreActive && (
                  <span className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-10 rounded-xl bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent" />
                )}
                
                <span className={[
                  "relative inline-flex items-center justify-center transition-all duration-300",
                  isMoreActive ? "scale-110" : "group-active:scale-90",
                ].join(" ")}>
                  <MoreHorizontal
                    className={[
                      "h-[22px] w-[22px] transition-all duration-300",
                      isMoreActive 
                        ? "text-blue-600 drop-shadow-[0_2px_8px_rgba(59,130,246,0.4)]" 
                        : "text-slate-500 group-active:text-slate-700",
                    ].join(" ")}
                    strokeWidth={isMoreActive ? 2.5 : 2.2}
                    aria-hidden="true"
                  />
                </span>
                
                <span
                  className={[
                    "relative text-[10px] font-semibold leading-none tracking-tight transition-all duration-300",
                    isMoreActive 
                      ? "text-blue-600" 
                      : "text-slate-500 group-active:text-slate-700",
                  ].join(" ")}
                >
                  More
                </span>
              </summary>

              <div className="absolute bottom-[calc(100%+12px)] right-2 z-50 hidden max-h-[65vh] w-[min(320px,calc(100vw-32px))] flex-col overflow-hidden rounded-[20px] border border-slate-200/40 bg-white/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] backdrop-blur-2xl backdrop-saturate-150 group-open:flex animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="overflow-y-auto overscroll-contain">
                  {moreMenuSections.map((section, sectionIndex) => (
                    <div
                      key={section.title}
                      className={[
                        "px-3 py-3",
                        sectionIndex < moreMenuSections.length - 1 ? "border-b border-slate-200/50" : "",
                      ].join(" ")}
                    >
                      <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
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
                                "group/item relative block overflow-hidden rounded-xl px-4 py-3 text-[13px] font-semibold transition-all duration-200 active:scale-[0.98]",
                                active
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                                  : "text-slate-700 active:bg-slate-100",
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
                
                <div className="sticky bottom-0 h-6 bg-gradient-to-t from-white/95 to-transparent pointer-events-none" />
              </div>
            </details>
          </div>
        </div>
      </nav>

      <div aria-hidden="true" className="h-[88px] lg:hidden" />
    </>
  );
}
