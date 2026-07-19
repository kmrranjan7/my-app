"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNavigation from "@/components/MobileNavigation";

const quickLinks = [
  { label: "Latest Jobs", href: "/latest-job" },
  { label: "Results", href: "/result" },
  { label: "Syllabus", href: "/syllabus" },
  { label: "Answer Key", href: "/answer-key" },
   { label: "Admit Card", href: "/admit-card" },
  { label: "Contact", href: "/contact" },
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

const discoveryPoints = [
  "Daily refreshed government vacancy intelligence",
  "Official notification-first editorial workflow",
  "Fast category discovery across SSC, UPSC, Railway, Bank, Defence, Police, Teaching, and PSU",
] as const;

const categoryDiscoveryLinks = [
  { label: "SSC Recruitment Updates", href: "/latest-job?search=SSC" },
  { label: "UPSC Recruitment Updates", href: "/latest-job?search=UPSC" },
  { label: "Railway Recruitment Updates", href: "/latest-job?search=Railway" },
  { label: "Bank Recruitment Updates", href: "/latest-job?search=Bank" },
  { label: "Defence Recruitment Updates", href: "/latest-job?search=Defence" },
  { label: "Police Recruitment Updates", href: "/latest-job?search=Police" },
  { label: "Teaching Recruitment Updates", href: "/latest-job?search=Teaching" },
  { label: "PSU Recruitment Updates", href: "/latest-job?search=PSU" },
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
    <footer className="mt-5 overflow-x-clip border-t-2 border-blue-600 bg-white shadow-[0_-8px_30px_rgba(37,99,235,0.12)]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-5 sm:py-5 lg:px-8">
          {/* Top Section */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Logo & About */}
            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Sarkari Global Result
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                Get the latest Government Jobs, Admit Cards, Results,
                Admissions, Syllabus, Answer Keys and Scholarship updates
                from official sources across India.
              </p>

              <div className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-medium text-blue-700 sm:text-xs">
                Trusted Government Job Updates
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-1 text-sm font-semibold text-slate-900">
                Quick Links
              </h3>

              <ul className="space-y-1.5 text-xs sm:text-sm">
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
              <h3 className="mb-1 text-sm font-semibold text-slate-900">
                Important Links
              </h3>

              <ul className="space-y-1.5 text-xs sm:text-sm">
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
              <h3 className="mb-1 text-sm font-semibold text-slate-900">
                Follow
              </h3>

              <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold uppercase text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:scale-105 ${social.bg}`}
                >
                  {social.short}
                </Link>
              ))}
            </div>
            </div>
          </div>

          <section className="mt-4 rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)] sm:p-3.5">
            <h3 className="text-xs font-black uppercase tracking-[0.1em] text-slate-900 sm:text-sm">
              Discover Govt Jobs Faster
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
              Navigate structured, high-intent sections to discover the latest government jobs,
              admit cards, and results across major recruitment domains with speed and clarity.
            </p>

            <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
              {discoveryPoints.map((point) => (
                <p
                  key={point}
                  className="rounded-xl border border-blue-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-700"
                >
                  {point}
                </p>
              ))}
            </div>

            <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {categoryDiscoveryLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-800 transition duration-300 hover:bg-cyan-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Disclaimer */}
          <div className="mt-4 rounded-3xl bg-slate-50 p-2.5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-0.5 sm:p-3">
            <p className="text-xs text-slate-600 sm:text-sm">
              Sarkari Global Result is an independent educational and job
              information portal. We are not affiliated with any government
              organization. Please verify all information from the official
              website before applying.
            </p>
          </div>

          {/* Bottom */}
          <div className="mt-4 border-t border-slate-200 pt-3">
            <div className="flex flex-col items-center justify-between gap-1.5 md:flex-row">
              <p className="text-xs text-slate-500 sm:text-sm">
                © {new Date().getFullYear()} Sarkari Global Result. All Rights
                Reserved.
              </p>

              <div className="flex flex-wrap gap-2.5 text-xs sm:text-sm">
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