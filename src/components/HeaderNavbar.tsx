"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Latest Job", href: "/latest-job" },
  { label: "Admit Card", href: "/admit-card" },
  { label: "Result", href: "/result" },
  { label: "Admission", href: "/admission" },
  { label: "Syllabus", href: "/syllabus" },
  { label: "Answer Key", href: "/answer-key" },
];

export default function HeaderNavbar() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
    setIsDark(dark);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <header className="site-header">
      <div className="shell nav-shell">
        <Link href="/" className="brand-mark">
          CareerPulse
        </Link>

        <nav className="site-nav site-nav-desktop" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle"
            aria-label="Toggle dark mode"
            onClick={() => applyTheme(!isDark)}
          >
            {isDark ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M12 3.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75Zm0 14.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM5.55 5.55a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L5.55 6.61a.75.75 0 0 1 0-1.06Zm10.78 10.78a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM3.75 12a.75.75 0 0 1 .75-.75H6a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Zm14.25 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 18 12ZM6.61 16.33a.75.75 0 0 1 1.06 1.06L6.61 18.45a.75.75 0 0 1-1.06-1.06l1.06-1.06Zm10.78-10.78a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06ZM12 8.25A3.75 3.75 0 1 0 12 15.75 3.75 3.75 0 0 0 12 8.25Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M14.77 4.9a.75.75 0 0 1 .3.96 6.75 6.75 0 1 0 8.07 8.07.75.75 0 0 1 1.4.56 8.25 8.25 0 1 1-9.77-9.77z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          <details className="nav-disclosure">
            <summary className="menu-toggle" aria-label="Toggle navigation menu">
              <span />
              <span />
            </summary>
            <nav className="site-nav site-nav-mobile" aria-label="Mobile primary">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="site-nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
