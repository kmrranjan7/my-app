"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNavigation from "@/components/MobileNavigation";

const quickLinks = [
  { label: "Latest Jobs", href: "/latest-job" },
  { label: "Results", href: "/result" },
  { label: "Syllabus", href: "/syllabus" },
  { label: "Answer Key", href: "/answer-key" },
] as const;

const importantLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", bg: "bg-blue-600 hover:bg-blue-700", short: "f" },
  { label: "Instagram", href: "https://instagram.com", bg: "bg-pink-600 hover:bg-pink-700", short: "i" },
  { label: "X", href: "https://x.com", bg: "bg-black hover:bg-slate-800", short: "x" },
  { label: "YouTube", href: "https://youtube.com", bg: "bg-red-600 hover:bg-red-700", short: "y" },
  { label: "Telegram", href: "https://t.me", bg: "bg-sky-500 hover:bg-sky-600", short: "t" },
  { label: "WhatsApp", href: "https://wa.me", bg: "bg-green-600 hover:bg-green-700", short: "w" },
] as const;

export default function SiteFooter() {
  const pathname = usePathname();

  const hideFooter =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  if (hideFooter) {
    return null;
  }

  return (
    <footer className="mt-10 overflow-x-clip border-t-2 border-blue-600 bg-white shadow-[0_-8px_30px_rgba(37,99,235,0.12)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-7 lg:px-8">
          {/* Top Section */}
          <div className="grid gap-6 md:grid-cols-4">
            {/* Logo & About */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                SarkariGlobalResult
              </h2>

              <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
                Get the latest Government Jobs, Admit Cards, Results,
                Admissions, Syllabus, Answer Keys and Scholarship updates
                from official sources across India.
              </p>

              <div className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 sm:text-xs">
                Trusted Government Job Updates
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Quick Links
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm">
                {quickLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex text-slate-600 transition duration-300 hover:-translate-y-1 hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Links */}
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Important Links
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm">
                {importantLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex text-slate-600 transition duration-300 hover:-translate-y-1 hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow */}
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Follow
              </h3>

              <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold uppercase text-white shadow-md transition duration-300 hover:-translate-y-1 hover:scale-110 ${social.bg}`}
                >
                  {social.short}
                </Link>
              ))}
            </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 rounded-3xl bg-slate-50 p-3 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 sm:p-4">
            <p className="text-xs text-slate-600 sm:text-sm">
              SarkariGlobalResult is an independent educational and job
              information portal. We are not affiliated with any government
              organization. Please verify all information from the official
              website before applying.
            </p>
          </div>

          {/* Bottom */}
          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
              <p className="text-xs text-slate-500 sm:text-sm">
                © {new Date().getFullYear()} SarkariGlobalResult. All Rights
                Reserved.
              </p>

              <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                <Link
                  href="/privacy-policy"
                  className="inline-flex text-slate-600 transition duration-300 hover:-translate-y-1 hover:text-blue-600"
                >
                  Privacy
                </Link>

                <Link
                  href="/disclaimer"
                  className="inline-flex text-slate-600 transition duration-300 hover:-translate-y-1 hover:text-blue-600"
                >
                  Disclaimer
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex text-slate-600 transition duration-300 hover:-translate-y-1 hover:text-blue-600"
                >
                  Contact
                </Link>

                <Link
                  href="/terms"
                  className="inline-flex text-slate-600 transition duration-300 hover:-translate-y-1 hover:text-blue-600"
                >
                  Terms
                </Link>
              </div>
            </div>

          </div>
      </div>

      <MobileNavigation pathname={pathname} />
    </footer>
  );
}