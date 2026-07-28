"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type RefObject } from "react";

const EMPTY_ITEMS: readonly never[] = [];

type UseInfinitePagedFeedParams<T> = Readonly<{
  initialItems?: readonly T[];
  pageSize: number;
  fetchPage: (page: number) => Promise<readonly T[]>;
  getKey: (item: T) => string;
  rootMargin?: string;
  loadFirstPageOnMount?: boolean;
}>;

type UseInfinitePagedFeedResult<T> = Readonly<{
  items: readonly T[];
  hasMore: boolean;
  isLoadingMore: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
  reloadFirstPage: () => Promise<void>;
}>;

function mergeUniqueItems<T>(
  existing: readonly T[],
  incoming: readonly T[],
  getKey: (item: T) => string,
): T[] {
  const seen = new Set(existing.map(getKey));
  const merged = [...existing];

  for (const item of incoming) {
    const key = getKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }

  return merged;
}

export function useInfinitePagedFeed<T>({
  initialItems = EMPTY_ITEMS as readonly T[],
  pageSize,
  fetchPage,
  getKey,
  rootMargin = "320px 0px",
  loadFirstPageOnMount = false,
}: UseInfinitePagedFeedParams<T>): UseInfinitePagedFeedResult<T> {
  const shouldAssumeMoreInitially = loadFirstPageOnMount || initialItems.length >= pageSize;
  const [items, setItems] = useState<readonly T[]>(initialItems);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(shouldAssumeMoreInitially);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const nextPageRef = useRef(loadFirstPageOnMount ? 0 : 1);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(shouldAssumeMoreInitially);
  const initialConfigRef = useRef({ initialItems, loadFirstPageOnMount, pageSize });

  useEffect(() => {
    const previousConfig = initialConfigRef.current;
    if (
      previousConfig.initialItems === initialItems &&
      previousConfig.loadFirstPageOnMount === loadFirstPageOnMount &&
      previousConfig.pageSize === pageSize
    ) {
      return;
    }

    initialConfigRef.current = { initialItems, loadFirstPageOnMount, pageSize };
    setItems(initialItems);
    const initialHasMore = loadFirstPageOnMount || initialItems.length >= pageSize;
    setHasMore(initialHasMore);
    hasMoreRef.current = initialHasMore;
    nextPageRef.current = loadFirstPageOnMount ? 0 : 1;
  }, [initialItems, loadFirstPageOnMount, pageSize]);

  const loadNextPage = useCallback(async () => {
    if (isFetchingRef.current || !hasMoreRef.current) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);

    const currentPage = nextPageRef.current;
    const fetchedItems = await fetchPage(currentPage);

    if (fetchedItems.length === 0) {
      hasMoreRef.current = false;
      setHasMore(false);
    } else {
      setItems((previous) => mergeUniqueItems(previous, fetchedItems, getKey));
      nextPageRef.current = currentPage + 1;

      if (fetchedItems.length < pageSize) {
        hasMoreRef.current = false;
        setHasMore(false);
      }
    }

    setIsLoadingMore(false);
    isFetchingRef.current = false;
  }, [fetchPage, getKey, pageSize]);

  const reloadFirstPage = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);

    const firstPageItems = await fetchPage(0);
    setItems(firstPageItems);

    const firstPageHasMore = firstPageItems.length >= pageSize;
    setHasMore(firstPageHasMore);
    hasMoreRef.current = firstPageHasMore;
    nextPageRef.current = 1;

    setIsLoadingMore(false);
    isFetchingRef.current = false;
  }, [fetchPage, pageSize]);

  useEffect(() => {
    if (!loadFirstPageOnMount || items.length > 0 || isFetchingRef.current) return;

    void reloadFirstPage();
  }, [items.length, loadFirstPageOnMount, reloadFirstPage]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          void loadNextPage();
        }
      },
      { rootMargin },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [loadNextPage, rootMargin]);

  return {
    items,
    hasMore,
    isLoadingMore,
    sentinelRef,
    reloadFirstPage,
  };
}
