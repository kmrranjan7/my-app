"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "🏠 Home", href: "/" },
  { label: "💼 Latest Jobs", href: "/latest-job" },
  { label: "🎫 Admit Card", href: "/admit-card" },
  { label: "🏆 Results", href: "/result" },
  { label: "🎓 Admission", href: "/admission" },
  { label: "📚 Syllabus", href: "/syllabus" },
  { label: "✅ Answer Key", href: "/answer-key" },
];

export default function HeaderNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const hideHeader =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(globalThis.scrollY > 8);
    };

    onScroll();
    globalThis.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      globalThis.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (hideHeader) {
    return null;
  }

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b-2 border-[#2563EB]/75 bg-white/92 backdrop-blur-xl transition-all duration-300",
        isScrolled
          ? "shadow-[0_10px_30px_rgba(2,6,23,0.12)]"
          : "shadow-[0_4px_16px_rgba(2,6,23,0.06)]",
      ].join(" ")}
    >
      <div className="mx-auto w-[min(1200px,95vw)] px-2 sm:px-3">
        <div className="grid h-12 grid-cols-[1fr_auto] items-center gap-1.5 lg:grid-cols-[auto_1fr_auto]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] font-extrabold tracking-tight text-slate-900 transition-colors duration-300 hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50"
            aria-label="SarkariGlobalResult home"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-bold text-[#2563EB] shadow-sm">
              SG
            </span>
            <span className="truncate">SarkariGlobalResult</span>
          </Link>

          <nav
            className="no-scrollbar hidden min-w-0 items-center justify-end gap-0.5 overflow-x-auto whitespace-nowrap lg:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "relative shrink-0 rounded-full px-2 py-1 text-[12px] font-semibold tracking-[0.01em] transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50",
                    active
                      ? "text-[#1d4ed8] after:absolute after:bottom-[-4px] after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-[#2563EB]"
                      : "text-slate-700 hover:bg-white/70 hover:text-slate-900 hover:backdrop-blur-md hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-1.5" />
        </div>
      </div>
    </header>
  );
}