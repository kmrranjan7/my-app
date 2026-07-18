"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  Grid2x2,
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
  { label: "Latest Jobs", href: "/latest-job", icon: BriefcaseBusiness },
  { label: "Admit Card", href: "/admit-card", icon: IdCard },
  { label: "Results", href: "/result", icon: Trophy },
];

type CategoryItem = {
  label: string;
  href: string;
};

const categoryItems: CategoryItem[] = [
  { label: "Admission", href: "/admission" },
  { label: "Syllabus", href: "/syllabus" },
  { label: "Answer Key", href: "/answer-key" },
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

export default function MobileNavigation({ pathname }: MobileNavigationProps) {
  const categoryMenuRef = useRef<HTMLDetailsElement | null>(null);
  const isCategoryActive = categoryItems.some((item) =>
    isActiveRoute(pathname, item.href),
  );
  const leftItems = mobileNavItems.slice(0, 2);
  const rightItems = mobileNavItems.slice(2);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const menu = categoryMenuRef.current;

      if (!menu?.open) {
        return;
      }

      if (event.target instanceof Node && !menu.contains(event.target)) {
        menu.open = false;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && categoryMenuRef.current?.open) {
        categoryMenuRef.current.open = false;
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const closeCategoryMenu = () => {
    if (categoryMenuRef.current?.open) {
      categoryMenuRef.current.open = false;
    }
  };

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] pt-1 lg:hidden"
        aria-label="Mobile Footer Navigation"
      >
        <div className="grid w-full grid-cols-5 bg-white px-1 py-1.5">
          {leftItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45"
              >
                <Icon
                  className={[
                    "h-[18px] w-[18px] transition-colors duration-200",
                    active ? "text-[#4b9eff]" : "text-slate-400 group-hover:text-slate-600",
                  ].join(" ")}
                  strokeWidth={2.1}
                  aria-hidden="true"
                />
                <span
                  className={[
                    "text-[9px] font-semibold leading-none transition-colors duration-200",
                    active ? "text-[#4b9eff]" : "text-slate-400 group-hover:text-slate-600",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          <details ref={categoryMenuRef} className="group relative">
            <summary
              className={[
                "group flex min-h-11 list-none flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45",
                isCategoryActive
                  ? "text-[#4b9eff]"
                  : "text-slate-400 hover:text-slate-600",
              ].join(" ")}
            >
              <Grid2x2 className="h-[18px] w-[18px]" strokeWidth={2.1} aria-hidden="true" />
              <span className="text-[9px] font-semibold leading-none">Category</span>
            </summary>

            <div className="absolute bottom-[calc(100%+0.55rem)] right-0 z-30 hidden min-w-[160px] flex-col gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.16)] group-open:flex">
              {categoryItems.map((item) => {
                const active = isActiveRoute(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeCategoryMenu}
                    className={[
                      "rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors duration-200",
                      active
                        ? "bg-blue-50 text-[#1d4ed8]"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </details>

          {rightItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45"
              >
                <Icon
                  className={[
                    "h-[18px] w-[18px] transition-colors duration-200",
                    active ? "text-[#4b9eff]" : "text-slate-400 group-hover:text-slate-600",
                  ].join(" ")}
                  strokeWidth={2.1}
                  aria-hidden="true"
                />
                <span
                  className={[
                    "text-[9px] font-semibold leading-none transition-colors duration-200",
                    active ? "text-[#4b9eff]" : "text-slate-400 group-hover:text-slate-600",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div aria-hidden="true" className="h-[74px] lg:hidden" />
    </>
  );
}
