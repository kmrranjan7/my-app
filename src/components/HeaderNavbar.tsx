"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Latest Jobs", href: "/latest-job" },
  { label: "Admit Card", href: "/admit-card" },
  { label: "Results", href: "/result" },
  { label: "Admission", href: "/admission" },
  { label: "Syllabus", href: "/syllabus" },
  { label: "Answer Key", href: "/answer-key" },
];

const moreItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function HeaderNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

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
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setIsMoreOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMoreOpen(false);
      }
    };

    globalThis.addEventListener("mousedown", onPointerDown);
    globalThis.addEventListener("keydown", onEscape);

    return () => {
      globalThis.removeEventListener("mousedown", onPointerDown);
      globalThis.removeEventListener("keydown", onEscape);
    };
  }, []);

  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  if (hideHeader) {
    return null;
  }

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 border-b border-[#2563EB]/30 bg-white/90 backdrop-blur-xl transition-all duration-300",
          isScrolled
            ? "shadow-[0_14px_36px_rgba(2,6,23,0.14)]"
            : "shadow-[0_6px_18px_rgba(2,6,23,0.08)]",
        ].join(" ")}
      >
        <div className="mx-auto w-[min(1240px,96vw)] px-2 sm:px-3 lg:px-4">
          <div className="pointer-events-none hidden h-[2px] w-full bg-gradient-to-r from-transparent via-[#2563EB]/80 to-transparent lg:block" />

          <div className="grid h-12 grid-cols-[1fr_auto] items-center gap-1.5 lg:h-[62px] lg:grid-cols-[auto_1fr] lg:gap-4">
            <div className="inline-flex min-w-0 items-center gap-1.5 lg:gap-2">
              <Link
                href="/"
                className="group inline-flex min-w-0 items-center gap-2 rounded-xl px-1 py-1 text-[13px] font-extrabold tracking-tight text-slate-900 transition-all duration-300 hover:text-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45 lg:px-2"
                aria-label="Sarkari Global Result home"
              >
                <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#2563EB]/30 bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] text-[11px] font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.35)]">
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_58%)]" />
                  <span className="relative">SGR</span>
                </span>
                <span className="flex min-w-0 flex-col leading-none">
                  <span className="truncate text-[15px] font-black tracking-tight text-slate-900 lg:text-[16px]">
                    Sarkari Global Result
                  </span>
                  <span className="hidden truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB] lg:block">
                    Government Career Desk
                  </span>
                </span>
              </Link>

              <div className="hidden items-center justify-end gap-1.5 lg:flex">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 shadow-[0_6px_14px_rgba(5,150,105,0.16)] motion-safe:animate-pulse">
                  <span className="relative inline-flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                  </span>
                  <span>Live Updates</span>
                </span>
              </div>
            </div>

            <nav
              className="hidden min-w-0 items-center justify-center gap-1 overflow-visible whitespace-nowrap lg:flex lg:origin-center lg:scale-95 xl:scale-100"
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
                      "relative shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] transition-all duration-300",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45",
                      active
                        ? "border-[#2563EB]/25 bg-gradient-to-b from-[#eff6ff] to-[#dbeafe] text-[#1d4ed8] shadow-[0_10px_24px_rgba(37,99,235,0.22)]"
                        : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-white hover:text-slate-900 hover:shadow-[0_9px_22px_rgba(15,23,42,0.1)]",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div ref={moreMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsMoreOpen((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-slate-700 transition-all duration-300 hover:border-slate-200 hover:bg-white hover:text-slate-900 hover:shadow-[0_9px_22px_rgba(15,23,42,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/45"
                  aria-haspopup="menu"
                  aria-expanded={isMoreOpen}
                  aria-controls="header-more-menu"
                  aria-label="More pages"
                >
                  <span>More</span>
                  <span aria-hidden="true">▾</span>
                </button>

                <div
                  id="header-more-menu"
                  className={[
                    "absolute right-0 top-[calc(100%+8px)] z-20 min-w-[150px] rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-[0_16px_34px_rgba(2,6,23,0.16)] backdrop-blur-md transition-all duration-200",
                    isMoreOpen
                      ? "pointer-events-auto visible opacity-100"
                      : "pointer-events-none invisible opacity-0",
                  ].join(" ")}
                >
                  {moreItems.map((item) => {
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "block rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-colors duration-200",
                          active
                            ? "bg-[#eff6ff] text-[#1d4ed8]"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                        ].join(" ")}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

          </div>
        </div>
      </header>
      <div className="h-12 lg:h-[62px]" aria-hidden="true" />
    </>
  );
}