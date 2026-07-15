"use client";

import { ImagePlus, RefreshCcw, Trash2, UploadCloud } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Card, EmptyState, SectionHeading } from "@/components/dashboard/ui";

type UploadedImage = Readonly<{
  readonly name: string;
  readonly url: string;
}>;

type UploadResponse = Readonly<{
  readonly fileName: string;
  readonly url: string;
  readonly contentType: string;
  readonly size: number;
}>;

type ImagesListResponse = Readonly<{
  readonly images?: readonly string[];
  readonly page?: number;
  readonly totalPages?: number;
  readonly hasMore?: boolean;
  readonly message?: string;
}>;

type ImageTabMode = "matched" | "unmatched";

const SKELETON_IMAGE_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;
const IMAGE_PAGE_SIZE = 20;

function toAbsoluteUploadUrl(relativeOrAbsolute: string) {
  if (/^https?:\/\//i.test(relativeOrAbsolute)) {
    return relativeOrAbsolute;
  }

  if (relativeOrAbsolute.startsWith("/")) {
    return relativeOrAbsolute;
  }

  return `/uploads/${relativeOrAbsolute}`;
}

export default function ImageManagerPanel() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeTab, setActiveTab] = useState<ImageTabMode>("matched");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null);
  const [copiedImageName, setCopiedImageName] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);

  const loadImages = useCallback(async (
    targetPage = 1,
    loadMode: "replace" | "append" = "replace",
    tabMode: ImageTabMode = activeTab,
  ) => {
    if (loadMode === "replace") {
      setIsLoading(true);
    }

    try {
      const response = await fetch(`/api/images?page=${targetPage}&size=${IMAGE_PAGE_SIZE}&mode=${tabMode}`, {
        method: "GET",
        cache: "no-store",
      });
      const payload = (await response.json()) as ImagesListResponse;

      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to fetch images.");
      }

      const mapped = (payload.images ?? []).map((name) => ({
        name,
        url: toAbsoluteUploadUrl(name),
      }));

      if (loadMode === "replace") {
        setImages(mapped);
      } else {
        setImages((current) => [...current, ...mapped]);
      }

      const nextPage = payload.page ?? targetPage;
      setCurrentPage(nextPage);
      setHasMore(payload.hasMore ?? (nextPage < (payload.totalPages ?? 1)));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch images.");
    } finally {
      if (loadMode === "replace") {
        setIsLoading(false);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(false);
    setImages([]);
    void loadImages(1, "replace", activeTab);
  }, [activeTab, loadImages]);

  const loadNextPage = useCallback(async () => {
    if (!hasMore || isLoading || isLoadingMoreRef.current) {
      return;
    }

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      await loadImages(currentPage + 1, "append");
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoading, loadImages]);

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
        rootMargin: "220px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [loadNextPage]);

  const totalImagesLabel = useMemo(() => `${images.length} image${images.length === 1 ? "" : "s"}`, [images.length]);
  const showEmpty = !isLoading && images.length === 0;
  const showGrid = !isLoading && images.length > 0;

  const onUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        readonly upload?: UploadResponse;
        readonly message?: string;
      };

      if (!response.ok || !payload.upload) {
        throw new Error(payload.message ?? "Failed to upload image.");
      }

      const created: UploadedImage = {
        name: payload.upload.fileName,
        url: toAbsoluteUploadUrl(payload.upload.url),
      };

      setImages((current) => [created, ...current.filter((item) => item.name !== created.name)]);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const deleteImage = async (imageName: string) => {
    setPendingDelete(imageName);
    try {
      const response = await fetch(`/api/images?name=${encodeURIComponent(imageName)}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as {
        readonly message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to delete image.");
      }

      setImages((current) => current.filter((item) => item.name !== imageName));
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete image.");
    } finally {
      setPendingDelete(null);
    }
  };

  const confirmDeleteImage = async () => {
    if (!confirmDeleteName) {
      return;
    }

    await deleteImage(confirmDeleteName);
    setConfirmDeleteName(null);
  };

  const copyImageUrl = async (image: UploadedImage) => {
    const absoluteUrl =
      typeof window !== "undefined" ? new URL(image.url, window.location.origin).toString() : image.url;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopiedImageName(image.name);
      window.setTimeout(() => {
        setCopiedImageName((current) => (current === image.name ? null : current));
      }, 1300);
      return;
    }

    throw new Error("Clipboard not supported in this browser.");
  };

  return (
    <Card className="p-4">
      <SectionHeading
        title="Image Manager"
        subtitle="Upload, browse, and delete dashboard images from uploads folder"
        action={
          <button
            type="button"
            onClick={() => {
              void loadImages(1, "replace");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <RefreshCcw size={13} aria-hidden="true" />
            Refresh
          </button>
        }
      />

      <div className="mt-3 rounded-xl border border-dashed border-cyan-300/70 bg-cyan-50/70 p-3 dark:border-cyan-900 dark:bg-cyan-950/20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-cyan-900 dark:text-cyan-200">Upload New Image</p>
            <p className="mt-0.5 text-xs text-cyan-700 dark:text-cyan-300">Allowed: JPG, JPEG, PNG, WEBP, GIF</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-300 bg-white px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:border-cyan-500 hover:text-cyan-900 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">
            <UploadCloud size={14} aria-hidden="true" />
            {isUploading ? "Uploading..." : "Choose Image"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                void onUploadFile(event);
              }}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <ImagePlus size={14} aria-hidden="true" />
          {totalImagesLabel}
        </p>
        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Page {currentPage}</p>
      </div>

      <div className="mt-2 inline-flex rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => {
            setActiveTab("matched");
          }}
          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
            activeTab === "matched"
              ? "bg-blue-600 text-white"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          Match Upload + DB
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("unmatched");
          }}
          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
            activeTab === "unmatched"
              ? "bg-amber-600 text-white"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          Not Match On DB
        </button>
      </div>

      {errorMessage ? (
        <p className="mt-2 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/25 dark:text-rose-300">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-3">
        {isLoading && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {SKELETON_IMAGE_KEYS.map((key) => (
              <div
                key={`image-skeleton-${key}`}
                className="h-24 animate-pulse rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"
              />
            ))}
          </div>
        )}

        {showEmpty && (
          <EmptyState
            title="No uploaded images"
            description="Upload your first image to manage gallery assets from the dashboard."
          />
        )}

        {showGrid && (
          <>
            <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image) => {
                const deleting = pendingDelete === image.name;
                const copied = copiedImageName === image.name;
                return (
                  <article
                    key={image.name}
                    className="rounded-lg border border-slate-200 bg-white p-1.5 shadow-[0_6px_16px_rgba(2,6,23,0.05)] dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.url}
                        alt={image.name}
                        className="h-20 w-full object-cover sm:h-24"
                        loading="lazy"
                      />
                    </div>

                    <p className="mt-1 line-clamp-2 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                      {image.name}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center justify-end gap-1">
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-slate-300 px-1.5 py-1 text-[10px] font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300"
                      >
                        View
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          void copyImageUrl(image).catch((error) => {
                            setErrorMessage(
                              error instanceof Error ? error.message : "Failed to copy image URL.",
                            );
                          });
                        }}
                        className="rounded-md border border-blue-300 bg-blue-50 px-1.5 py-1 text-[10px] font-semibold text-blue-700 transition hover:border-blue-500 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
                      >
                        {copied ? "Copied" : "Copy URL"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDeleteName(image.name);
                        }}
                        disabled={deleting}
                        className="inline-flex items-center gap-1 rounded-md border border-rose-300 bg-rose-50 px-1.5 py-1 text-[10px] font-semibold text-rose-700 transition hover:border-rose-500 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
                      >
                        <Trash2 size={12} aria-hidden="true" />
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div ref={loadMoreRef} className="h-4 w-full" aria-hidden="true" />

            {isLoadingMore ? (
              <p className="mt-2 text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Loading more images...
              </p>
            ) : null}
          </>
        )}
      </div>

      {confirmDeleteName ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-rose-200 bg-white p-4 shadow-[0_24px_64px_rgba(2,6,23,0.28)] dark:border-rose-900 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Delete Image?</h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              This will permanently delete
              {" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{confirmDeleteName}</span>
              {" "}
              from uploads folder.
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmDeleteName(null);
                }}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  void confirmDeleteImage();
                }}
                disabled={pendingDelete === confirmDeleteName}
                className="rounded-lg border border-rose-500 bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingDelete === confirmDeleteName ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
