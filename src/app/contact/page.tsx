import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact SarkariGlobalResult for support and business inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-[70vh] px-4 py-10">
      <section className="mx-auto w-[min(900px,95vw)] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Contact</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Get In Touch
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          For support, corrections, or business inquiries, reach us through the details below.
          We usually respond within 24-48 hours on working days.
        </p>
        <ContactForm />
      </section>
    </main>
  );
}
