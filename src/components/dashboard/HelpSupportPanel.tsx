"use client";

import { useEffect, useState } from "react";

import { SectionHeading } from "@/components/dashboard/ui";
import { API_BASE_URL } from "@/lib/apiConfig";

type ContactRow = Readonly<{
  readonly createdAt: string;
  readonly email: string;
  readonly fullName: string;
  readonly id: number;
  readonly inquiryType: string;
  readonly message: string;
  readonly phone: string;
  readonly subject: string;
}>;

type ContactPagedData = Readonly<{
  readonly content: ReadonlyArray<ContactRow>;
  readonly first: boolean;
  readonly last: boolean;
  readonly page: number;
  readonly size: number;
  readonly sort: string;
  readonly totalElements: number;
  readonly totalPages: number;
}>;

type ContactApiResponse = Readonly<{
  readonly data: ContactPagedData;
  readonly message: string;
  readonly success: boolean;
}>;

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

export default function HelpSupportPanel() {
  const [rows, setRows] = useState<ReadonlyArray<ContactRow>>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchContacts() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const query = new URLSearchParams({
          page: String(page),
          size: String(size),
          sortBy: "createdAt",
          sortDir: "desc",
        });

        const response = await fetch(`${API_BASE_URL}/api/contact?${query.toString()}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contact details.");
        }

        const payload = (await response.json()) as ContactApiResponse;
        if (!payload.success || !payload.data) {
          throw new Error(payload.message || "Unable to load contact details.");
        }

        if (!isMounted) {
          return;
        }

        setRows(payload.data.content ?? []);
        setTotalPages(payload.data.totalPages ?? 0);
        setTotalElements(payload.data.totalElements ?? 0);
      } catch {
        if (!isMounted) {
          return;
        }
        setRows([]);
        setErrorMessage("Unable to load contact records right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void fetchContacts();

    return () => {
      isMounted = false;
    };
  }, [page, size]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <SectionHeading
        title="Support Requests"
        subtitle="Live contact form submissions fetched from API"
      />

      {loading ? <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Loading contact details...</p> : null}

      {errorMessage ? (
        <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
          {errorMessage}
        </p>
      ) : null}

      {!loading && !errorMessage ? (
        <>
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="min-w-[980px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
              <thead className="bg-slate-100/80 dark:bg-slate-900/60">
                <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Created At</th>
                  <th className="px-3 py-2">Full Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Inquiry Type</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      No contact records found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="align-top text-slate-700 dark:text-slate-200">
                      <td className="px-3 py-2 font-semibold">{row.id}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatDateTime(row.createdAt)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{row.fullName}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{row.email}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{row.phone}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{row.inquiryType}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{row.subject}</td>
                      <td className="px-3 py-2 max-w-[320px]">
                        <div className="overflow-x-auto whitespace-nowrap text-slate-700 dark:text-slate-200">
                          {row.message}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Total: {totalElements} records
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPage((current) => Math.max(0, current - 1));
                }}
                disabled={page <= 0}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Page {Math.max(1, page + 1)} of {Math.max(1, totalPages)}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPage((current) => current + 1);
                }}
                disabled={totalPages === 0 || page >= totalPages - 1}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
