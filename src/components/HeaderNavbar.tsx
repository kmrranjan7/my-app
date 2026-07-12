"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    globalThis.addEventListener("keydown", onEscape);

    return () => {
      globalThis.removeEventListener("keydown", onEscape);
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
        <div className="grid h-12 grid-cols-[1fr_auto] items-center gap-1.5 sm:grid-cols-[auto_1fr_auto]">
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
            className="no-scrollbar hidden min-w-0 items-center justify-end gap-0.5 overflow-x-auto whitespace-nowrap sm:flex"
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

          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2563EB]/35 bg-white/70 text-[#2563EB] transition-all duration-300 hover:border-[#2563EB]/60 hover:bg-[#EFF6FF] hover:text-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50 sm:hidden"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-drawer-nav"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

      </div>

      <button
        type="button"
        className={[
          "fixed inset-0 z-[60] bg-slate-950/55 transition-opacity duration-300 md:hidden",
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        tabIndex={isMobileMenuOpen ? 0 : -1}
        aria-hidden={!isMobileMenuOpen}
        aria-label="Close navigation menu overlay"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside
        id="mobile-drawer-nav"
        aria-label="Mobile navigation drawer"
        className={[
          "fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white p-5 shadow-2xl transition-transform duration-300 md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="text-base font-bold text-slate-900">Menu</span>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#2563EB]/35 text-[#2563EB] transition-all duration-300 hover:border-[#2563EB]/60 hover:bg-[#EFF6FF] hover:text-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-2" aria-label="Mobile primary">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
                className={[
                  "rounded-md px-4 py-3 text-[15px] font-semibold transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50",
                  active
                    ? "bg-[#EFF6FF] text-[#1d4ed8]"
                    : "border border-slate-200/80 bg-white/70 text-slate-700 hover:border-[#2563EB]/40 hover:bg-[#F8FAFC] hover:text-[#2563EB]",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 text-xs text-slate-500">
          SarkariGlobalResult • Government Job & Exam Portal
        </div>
      </aside>
    </header>
  );
}