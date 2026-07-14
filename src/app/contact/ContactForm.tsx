"use client";

import { useState } from "react";

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(event: { preventDefault: () => void; currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setIsOpen(true);
    form.reset();
  }

  return (
    <>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">Contact Form</h2>
        <p className="mt-1 text-sm text-slate-600">
          Fill in the form below and our team will get back to you shortly.
        </p>

        <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
          <label className="grid gap-1.5 text-sm text-slate-700">
            <span>Full Name</span>
            <input
              type="text"
              name="fullName"
              required
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter your full name"
            />
          </label>

          <label className="grid gap-1.5 text-sm text-slate-700">
            <span>Email Address</span>
            <input
              type="email"
              name="email"
              required
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="you@example.com"
            />
          </label>

          <label className="grid gap-1.5 text-sm text-slate-700">
            <span>Mobile Number</span>
            <input
              type="text"
              name="phone"
              required
              inputMode="numeric"
              pattern="[0-9]{10}"
              minLength={10}
              maxLength={10}
              title="Enter a valid 10-digit mobile number using digits only"
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter 10-digit mobile number"
            />
          </label>

          <label className="grid gap-1.5 text-sm text-slate-700">
            <span>Inquiry Type</span>
            <select
              name="inquiryType"
              defaultValue=""
              required
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="" disabled>
                Select inquiry type
              </option>
              <option value="support">Support</option>
              <option value="correction">Correction Request</option>
              <option value="business">Business Inquiry</option>
              <option value="advertising">Advertising</option>
            </select>
          </label>

          <label className="grid gap-1.5 text-sm text-slate-700 sm:col-span-2">
            <span>Subject</span>
            <input
              type="text"
              name="subject"
              required
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Write a short subject"
            />
          </label>

          <label className="grid gap-1.5 text-sm text-slate-700 sm:col-span-2">
            <span>Message</span>
            <textarea
              name="message"
              rows={5}
              required
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Write your message here..."
            />
          </label>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Submit Message
            </button>
          </div>
        </form>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Submitted Successfully</h3>
            <p className="mt-2 text-sm text-slate-600">
              Thank you for contacting us. We will get back to you soon.
            </p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
