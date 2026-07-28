"use client";

import Link from "next/link";
import { Bell, CircleDot } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { initializeForegroundPushNotifications } from "@/lib/firebasePush";

const PAGE_SIZE = 10;
const CACHE_DURATION_MS = 60 * 1000;
const LATEST_UPDATES_API_URL =
  `/api/latest-update?postStatus=Published&size=${PAGE_SIZE}&sortBy=createdAt&sortDir=desc`;

type PublicLatestUpdateItem = Readonly<{
  readonly id?: string;
  readonly createdAt?: string;
  readonly startDate?: string;
  readonly postType?: string;
  readonly postSlug?: string;
  readonly postTitle?: string;
}>;

type PublicLatestUpdateResponse = Readonly<{
  readonly data?: {
    readonly content?: PublicLatestUpdateItem[];
  };
}>;

type NotificationItem = Readonly<{
  readonly key: string;
  readonly title: string;
  readonly href: string;
  readonly type: string;
  readonly dateLabel: string;
}>;

function formatDate(value?: string): string {
  if (!value) {
    return "Date TBA";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date TBA";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function mapLatestUpdateItem(item: PublicLatestUpdateItem, index: number): NotificationItem {
  const slug = item.postSlug?.trim();

  return {
    key: item.id?.trim() || slug || `${item.postTitle || "Untitled"}-${index}`,
    title: item.postTitle?.trim() || "Untitled Update",
    href: slug ? `/${slug}` : "/latest-jobs",
    type: item.postType?.trim() || "Update",
    dateLabel: formatDate(item.startDate || item.createdAt),
  };
}

export default function NotifyBellHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);
  const [showUnreadDot, setShowUnreadDot] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    void initializeForegroundPushNotifications();

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    globalThis.addEventListener("mousedown", onPointerDown);
    globalThis.addEventListener("keydown", onEscape);

    return () => {
      globalThis.removeEventListener("mousedown", onPointerDown);
      globalThis.removeEventListener("keydown", onEscape);
    };
  }, []);

  const fetchLatestUpdatesPage = useCallback(async (page: number): Promise<NotificationItem[]> => {
    const response = await fetch(`${LATEST_UPDATES_API_URL}&page=${page}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch latest updates.");
    }

    const payload = (await response.json()) as PublicLatestUpdateResponse;
    const content = payload.data?.content ?? [];
    const pageOffset = page * PAGE_SIZE;

    return content.map((item, index) => mapLatestUpdateItem(item, pageOffset + index));
  }, []);

  const fetchLatestUpdates = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const firstPageNotifications = await fetchLatestUpdatesPage(0);
      setNotifications(firstPageNotifications);
      setCurrentPage(0);
      setHasMore(firstPageNotifications.length === PAGE_SIZE);
      setLastFetchedAt(Date.now());
    } catch {
      setNotifications([]);
      setCurrentPage(0);
      setHasMore(false);
      setLastFetchedAt(null);
      setErrorMessage("Unable to load notifications.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchLatestUpdatesPage]);

  const loadMore = useCallback(async () => {
    if (!isOpen || isLoading || !hasMore || isLoadingMoreRef.current) {
      return;
    }

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      const nextPage = currentPage + 1;
      const nextPageNotifications = await fetchLatestUpdatesPage(nextPage);

      setNotifications((previous) => [...previous, ...nextPageNotifications]);
      setCurrentPage(nextPage);
      setHasMore(nextPageNotifications.length === PAGE_SIZE);
      setErrorMessage(null);
    } catch {
      setErrorMessage("Unable to load more notifications.");
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [currentPage, fetchLatestUpdatesPage, hasMore, isLoading, isOpen]);

  useEffect(() => {
    const root = listRef.current;
    const target = loadMoreTriggerRef.current;

    if (!isOpen || !root || !target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadMore();
        }
      },
      {
        root,
        rootMargin: "120px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [isOpen, loadMore]);

  const handleBellClick = async () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);

    if (nextOpen) {
      if (showUnreadDot) {
        setShowUnreadDot(false);
      }

      const isCacheExpired = !lastFetchedAt || Date.now() - lastFetchedAt > CACHE_DURATION_MS;

      if (isCacheExpired && !isLoading) {
        await fetchLatestUpdates();
      }
    }
  };

  let loadMoreStatusLabel = "All updates loaded";

  if (isLoadingMore) {
    loadMoreStatusLabel = "Loading more...";
  } else if (hasMore) {
    loadMoreStatusLabel = "Scroll for more";
  }

  return (
    <div ref={dropdownRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => {
          void handleBellClick();
        }}
        className="relative inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-sky-200 bg-sky-50 px-1.5 text-sky-600 transition-colors hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        aria-label="Notifications"
        title="Notifications"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="header-notification-menu"
      >
        <Bell className="size-3.5" aria-hidden="true" />
        {showUnreadDot ? (
          <span
            className="absolute right-[1px] top-[1px] h-2 w-2 rounded-full bg-sky-600 ring-2 ring-white"
            aria-hidden="true"
          />
        ) : null}
      </button>

      <div
        id="header-notification-menu"
        className={[
          "absolute right-0 top-[calc(100%+8px)] z-20 w-[min(290px,calc(100vw-16px))] max-w-[290px] rounded-2xl border border-sky-200/80 bg-white/95 p-1.5 shadow-[0_16px_34px_rgba(2,6,23,0.16)] backdrop-blur-md transition-all duration-200",
          isOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        ].join(" ")}
        role="menu"
        aria-label="Latest update notifications"
      >
        <div className="mb-1 flex items-center justify-between gap-2 px-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-700">
            Latest Updates ({notifications.length})
          </p>
          {isLoading ? (
            <span className="text-[10px] font-semibold text-sky-600">Loading...</span>
          ) : null}
        </div>

        <div ref={listRef} className="max-h-72 space-y-1 overflow-y-auto pr-0.5">
          {errorMessage ? (
            <p className="rounded-xl border border-dashed border-rose-300 bg-rose-50 px-2 py-3 text-[11px] text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          {!errorMessage && !isLoading && notifications.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-2 py-3 text-[11px] text-slate-500">
              No latest updates found.
            </p>
          ) : null}

          {!errorMessage
            ? notifications.map((item) => (
                <article
                  key={item.key}
                  className="group rounded-xl border border-sky-100/80 bg-white px-1.5 py-1.5 transition-colors hover:border-sky-200 hover:bg-sky-50/40"
                >
                  <div className="flex min-w-0 items-start gap-1.5">
                    <span className="mt-0.5 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                      <CircleDot className="h-2.5 w-2.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={item.href}
                        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                      >
                        <p className="line-clamp-1 text-[11px] font-semibold leading-4 text-slate-800 group-hover:text-sky-800">
                          {item.title}
                        </p>
                        <p className="text-[10px] leading-4 text-slate-500">
                          {item.type} • {item.dateLabel}
                        </p>
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            : null}

          {!errorMessage && notifications.length > 0 ? (
            <div ref={loadMoreTriggerRef} className="py-1 text-center text-[10px] text-slate-500">
              {loadMoreStatusLabel}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
