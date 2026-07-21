"use client";

import { Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SITE_URL } from "@/lib/seo";

type ShareDetail = Readonly<{
  label: string;
  value: string;
}>;

type ShareActionButtonProps = Readonly<{
  title: string;
  href: string;
  contextLabel?: string;
  details?: readonly ShareDetail[];
  showLabel?: boolean;
  label?: string;
  buttonClassName?: string;
  iconClassName?: string;
  copiedTextClassName?: string;
  ariaLabel?: string;
  copiedText?: string;
}>;

function iconForDetail(label: string): string {
  const normalized = label.toLowerCase();

  if (normalized.includes("post") || normalized.includes("title")) return "📝";
  if (normalized.includes("state") || normalized.includes("location")) return "📍";
  if (normalized.includes("organization") || normalized.includes("org")) return "🏢";
  if (normalized.includes("seat") || normalized.includes("vacanc")) return "👥";
  if (normalized.includes("start")) return "📅";
  if (normalized.includes("last") || normalized.includes("end")) return "⏰";
  if (normalized.includes("qualif")) return "🎓";

  return "•";
}

function toAbsoluteUrl(href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  const runtimeOrigin = globalThis.location?.origin || SITE_URL;
  const normalizedHref = href.startsWith("/") ? href : `/${href}`;
  return `${runtimeOrigin}${normalizedHref}`;
}

export default function ShareActionButton({
  title,
  href,
  contextLabel = "Update",
  details = [],
  showLabel = true,
  label = "Share",
  buttonClassName,
  iconClassName,
  copiedTextClassName,
  ariaLabel,
  copiedText = "Link copied",
}: ShareActionButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        globalThis.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleShare = async () => {
    const shareUrl = toAbsoluteUrl(href);

    // const text = [
    //   `Sarkari Global Result - ${contextLabel}`,
    //   `📝 Post Name: ${title}`,
    //   ...details.map((detail) => `${iconForDetail(detail.label)} ${detail.label}: ${detail.value}`),
    //   `🔗 Link: ${shareUrl}`,
    // ].join("\n");

    const payload = {
      title: `${title} | Sarkari Global Result`,
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(payload);
        return;
      } catch {
        // Fall back to clipboard copy when native share is canceled or unavailable.
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);

        if (timeoutRef.current !== null) {
          globalThis.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = globalThis.setTimeout(() => {
          setCopied(false);
          timeoutRef.current = null;
        }, 1600);
      } catch {
        // Ignore clipboard write errors silently.
      }
    }
  };

  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={() => {
          void handleShare();
        }}
        className={
          buttonClassName ??
          "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100"
        }
        aria-label={ariaLabel ?? `Share ${title}`}
      >
        <Share2 className={iconClassName ?? "size-3"} aria-hidden="true" />
        {showLabel ? label : null}
      </button>
      {copied ? (
        <p className={copiedTextClassName ?? "mt-0.5 text-[9px] font-semibold text-emerald-700"}>{copiedText}</p>
      ) : null}
    </div>
  );
}