import { BookmarkCheck, PencilLine, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Card, EmptyState, SectionHeading } from "@/components/dashboard/ui";
import type { NewPostPrefillRecord } from "@/components/dashboard/NewPostPanel";

type SavedPostRecord = Readonly<{
  readonly id: string;
  readonly createdAt: string;
  readonly postTitle: string;
  readonly postSlug: string;
  readonly contentHtml: string;
  readonly applicationId: string;
  readonly department: string;
  readonly organization: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly stateName: string;
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly seoFocusKeyword: string;
  readonly faqSchemaJson: string;
  readonly postStatus: "Draft" | "Pending Review" | "Scheduled" | "Published";
  readonly scheduledAt: string;
  readonly postType: "Job" | "Admit" | "Exam" | "Result";
}>;

type SavedJobsPanelProps = Readonly<{
  readonly onEditInNewPost?: (record: NewPostPrefillRecord) => void;
  readonly postTypeFilter?: "Job" | "Admit" | "Exam" | "Result";
  readonly title?: string;
  readonly subtitle?: string;
  readonly refreshToken?: number;
}>;

type StatusFilter = "All" | SavedPostRecord["postStatus"];
const PAGE_SIZE = 20;

export default function SavedJobsPanel({
  onEditInNewPost,
  postTypeFilter,
  title = "Saved Jobs",
  subtitle = "Saved records from New Post with fetch, edit, and delete actions",
  refreshToken = 0,
}: SavedJobsPanelProps) {
  const [records, setRecords] = useState<SavedPostRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    readonly id: string;
    readonly title: string;
  } | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [page, setPage] = useState(0);
  const [hasMoreRecords, setHasMoreRecords] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);
  const initialLoadKeyRef = useRef<string>("");
  const initialLoadKey = `${postTypeFilter ?? "ALL"}:${refreshToken}`;

  const loadRecords = useCallback(async (targetPage: number, mode: "replace" | "append") => {
    const params = new URLSearchParams();
    params.set("page", String(targetPage));
    params.set("size", String(PAGE_SIZE));

    if (postTypeFilter) {
      params.set("postType", postTypeFilter);
    }

    const endpoint = params.size > 0 ? `/api/posts?${params.toString()}` : "/api/posts";
    const response = await fetch(endpoint, { method: "GET" });

    if (!response.ok) {
      throw new Error("Failed to fetch saved records.");
    }

    const payload = (await response.json()) as {
      readonly records?: SavedPostRecord[];
    };

    const nextRecords = payload.records ?? [];

    if (mode === "replace") {
      setRecords(nextRecords);
    } else {
      setRecords((current) => [...current, ...nextRecords]);
    }

    return nextRecords;
  }, [postTypeFilter]);

  useEffect(() => {
    let isMounted = true;

    // In React Strict Mode (dev), effects can run twice. Skip duplicate same-key loads.
    if (initialLoadKeyRef.current === initialLoadKey) {
      return () => {
        isMounted = false;
      };
    }

    initialLoadKeyRef.current = initialLoadKey;

    const syncFromApi = async () => {
      setIsInitialLoading(true);
      setPage(0);
      setHasMoreRecords(true);

      try {
        const firstPageRecords = await loadRecords(0, "replace");
        if (isMounted) {
          setHasMoreRecords(firstPageRecords.length === PAGE_SIZE);
          setErrorMessage(null);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("Unable to load saved records right now.");
        }
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    };

    void syncFromApi();

    return () => {
      isMounted = false;
    };
  }, [initialLoadKey, loadRecords]);

  const loadNextPage = useCallback(async () => {
    if (!hasMoreRecords || isInitialLoading || isLoadingMoreRef.current) {
      return;
    }

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      const nextPage = page + 1;
      const nextPageRecords = await loadRecords(nextPage, "append");
      setPage(nextPage);
      setHasMoreRecords(nextPageRecords.length === PAGE_SIZE);
      setErrorMessage(null);
    } catch {
      setErrorMessage("Unable to load more saved records right now.");
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasMoreRecords, isInitialLoading, loadRecords, page]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadNextPage();
        }
      },
      {
        root: null,
        rootMargin: "180px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [loadNextPage]);

  const startEditing = (record: SavedPostRecord) => {
    setEditingId(record.id);
    setEditTitle(record.postTitle);
    setEditDepartment(record.department);
  };

  const saveEdit = async () => {
    if (!editingId) {
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          postTitle: editTitle,
          department: editDepartment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update record.");
      }

      await loadRecords();
      setErrorMessage(null);
      setEditingId(null);
    } catch {
      setErrorMessage("Unable to update saved record.");
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(`/api/posts?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete record.");
      }

      await loadRecords();
      setErrorMessage(null);
      if (editingId === id) {
        setEditingId(null);
      }
    } catch {
      setErrorMessage("Unable to delete saved record.");
    }
  };

  const confirmDeleteRecord = async () => {
    if (!pendingDelete) {
      return;
    }

    await deleteRecord(pendingDelete.id);
    setPendingDelete(null);
  };

  const editInNewPost = (record: SavedPostRecord) => {
    onEditInNewPost?.({
      id: record.id,
      postTitle: record.postTitle,
      postSlug: record.postSlug,
      contentHtml: record.contentHtml,
      applicationId: record.applicationId,
      department: record.department,
      organization: record.organization,
      startDate: record.startDate,
      endDate: record.endDate,
      stateName: record.stateName,
      seoTitle: record.seoTitle,
      seoDescription: record.seoDescription,
      seoFocusKeyword: record.seoFocusKeyword,
      faqSchemaJson: record.faqSchemaJson,
      postStatus: record.postStatus,
      scheduledAt: record.scheduledAt,
      postType: record.postType,
    });
    startEditing(record);
  };

  const getStatusBadgeClasses = (status: SavedPostRecord["postStatus"]) => {
    if (status === "Draft") {
      return "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";
    }

    if (status === "Pending Review") {
      return "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
    }

    if (status === "Scheduled") {
      return "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300";
    }

    return "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  };

  const getCategoryLabel = (postType: SavedPostRecord["postType"]) => {
    if (postType === "Job") {
      return "Recruitment";
    }

    return postType;
  };

  const filterTabs: readonly StatusFilter[] = [
    "All",
    "Draft",
    "Pending Review",
    "Scheduled",
    "Published",
  ];

  const byPostType = postTypeFilter
    ? records.filter((record) => record.postType === postTypeFilter)
    : records;

  const filteredRecords =
    statusFilter === "All"
      ? byPostType
      : byPostType.filter((record) => record.postStatus === statusFilter);

  const getCountByFilter = (tab: StatusFilter) => {
    if (tab === "All") {
      return byPostType.length;
    }

    return byPostType.filter((record) => record.postStatus === tab).length;
  };

  return (
    <Card className="p-4">
      {pendingDelete ? (
        <div className="fixed inset-0 z-[120] flex items-start justify-center bg-slate-950/35 p-4 pt-6 backdrop-blur-[2px]">
          <div
            role="dialog"
            aria-modal="true"
            className="w-[min(420px,94vw)] rounded-2xl border border-rose-300 bg-white p-4 shadow-[0_20px_48px_rgba(244,63,94,0.25)] dark:border-rose-900 dark:bg-slate-950"
          >
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">
              Confirm Delete
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to delete <span className="font-semibold">{pendingDelete.title || "this record"}</span>?
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => void confirmDeleteRecord()}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-rose-600 bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <SectionHeading
        title={title}
        subtitle={subtitle}
      />

      <div className="mt-4 space-y-3">
        {isInitialLoading && records.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Loading saved records...
          </p>
        ) : null}

        {errorMessage ? (
          <p className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/35 dark:text-rose-300">
            {errorMessage}
          </p>
        ) : null}

        {byPostType.length === 0 ? (
          <EmptyState
            title="No saved records yet"
            description="Save a record from New Post and it will appear here."
          />
        ) : null}

        {byPostType.length > 0 ? (
          <>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              {filterTabs.map((tab) => {
                const isActive = statusFilter === tab;
                const count = getCountByFilter(tab);

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition ${
                      isActive
                        ? "border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/35 dark:text-blue-300"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{tab}</span>
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredRecords.length === 0 ? (
              <EmptyState
                title="No records in this status"
                description="Choose another tab or update status from New Post."
              />
            ) : null}

            {filteredRecords.length > 0 ? (
              <div className="hidden overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 md:block">
                <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-900/60">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300">
                      App ID
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300">
                      Title
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300">
                      Department
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300">
                      Category
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300">
                      Created
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300">
                      Status
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-[0.06em] text-slate-600 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950/40">
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1.5">
                          <BookmarkCheck size={13} aria-hidden="true" />
                          {record.applicationId}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-900 dark:text-slate-100">
                        {editingId === record.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(event) => setEditTitle(event.target.value)}
                            className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                          />
                        ) : (
                          <p className="font-semibold">{record.postTitle}</p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200">
                        {editingId === record.id ? (
                          <input
                            type="text"
                            value={editDepartment}
                            onChange={(event) => setEditDepartment(event.target.value)}
                            className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                          />
                        ) : (
                          <span>{record.department || "General"}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {getCategoryLabel(record.postType)}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(record.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getStatusBadgeClasses(record.postStatus)}`}
                          >
                            {record.postStatus}
                          </span>
                          {record.postStatus === "Scheduled" && record.scheduledAt ? (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {new Date(record.scheduledAt).toLocaleString()}
                            </p>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        {editingId === record.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => void saveEdit()}
                              className="rounded-md border border-blue-300 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/35 dark:text-blue-300"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => editInNewPost(record)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:underline dark:text-blue-300"
                            >
                              <PencilLine size={12} aria-hidden="true" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setPendingDelete({
                                  id: record.id,
                                  title: record.postTitle,
                                })
                              }
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:underline dark:text-rose-300"
                            >
                              <Trash2 size={12} aria-hidden="true" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            ) : null}

            {filteredRecords.length > 0 ? (
              <div className="space-y-3 md:hidden">
                {filteredRecords.map((record) => (
                <article
                  key={record.id}
                  className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <BookmarkCheck size={14} aria-hidden="true" />
                      {record.applicationId}
                    </p>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(record.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {editingId === record.id ? (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      />
                      <input
                        type="text"
                        value={editDepartment}
                        onChange={(event) => setEditDepartment(event.target.value)}
                        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-400/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void saveEdit()}
                          className="rounded-md border border-blue-300 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/35 dark:text-blue-300"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {record.postTitle}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        Department: {record.department || "General"}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        Category: {getCategoryLabel(record.postType)}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getStatusBadgeClasses(record.postStatus)}`}
                        >
                          {record.postStatus}
                        </span>
                        {record.postStatus === "Scheduled" && record.scheduledAt ? (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {new Date(record.scheduledAt).toLocaleString()}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => editInNewPost(record)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:underline dark:text-blue-300"
                        >
                          <PencilLine size={12} aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPendingDelete({
                              id: record.id,
                              title: record.postTitle,
                            })
                          }
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:underline dark:text-rose-300"
                        >
                          <Trash2 size={12} aria-hidden="true" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </article>
                ))}
              </div>
            ) : null}

            {byPostType.length > 0 ? (
              <>
                {isLoadingMore ? (
                  <p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Loading 20 more records...
                  </p>
                ) : null}
                <div ref={loadMoreRef} className="h-1 w-full" aria-hidden="true" />
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </Card>
  );
}
