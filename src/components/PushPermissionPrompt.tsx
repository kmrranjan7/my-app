"use client";

import { BellRing } from "lucide-react";
import { useEffect, useState } from "react";

import { registerForPushNotifications, showPushTestNotification } from "@/lib/firebasePush";

const PUSH_PROMPT_ACCEPTED_KEY = "sgr-push-prompt-accepted";

export default function PushPermissionPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem(PUSH_PROMPT_ACCEPTED_KEY) === "true") {
      return;
    }

    const popupTimer = window.setTimeout(() => setIsOpen(true), 250);
    return () => window.clearTimeout(popupTimer);
  }, []);

  const close = () => {
    setIsOpen(false);
  };

  const enable = async () => {
    if (!("Notification" in window)) {
      setMessage("This browser does not support notifications.");
      return;
    }

    if (Notification.permission === "denied") {
      setMessage("Notifications are blocked. Allow them in this site's browser settings, then try again.");
      return;
    }

    setIsEnabling(true);
    setMessage("");

    try {
      const token = await registerForPushNotifications();
      const response = await fetch("/api/push-subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Unable to save notification preferences.");
      }

      window.localStorage.setItem(PUSH_PROMPT_ACCEPTED_KEY, "true");
      await showPushTestNotification();
      setMessage("Alerts are enabled for this device.");
      window.setTimeout(() => setIsOpen(false), 1200);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to enable alerts.");
    } finally {
      setIsEnabling(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center" role="dialog" aria-modal="true" aria-labelledby="push-permission-title">
      <div className="w-full max-w-[410px]">
      <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-[0_18px_48px_rgba(15,23,42,0.2)] backdrop-blur-xl">
        <div className="h-1 bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-400" />
        <div className="flex gap-3 px-4 pb-2 pt-4 sm:px-5 sm:pt-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-50 text-amber-600 shadow-sm sm:size-11">
            <BellRing className="size-5 sm:size-6" strokeWidth={2} aria-hidden="true" />
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600">Sarkari Global Result</p>
            <h2 id="push-permission-title" className="mt-0.5 text-[15px] font-bold leading-snug text-slate-800 sm:text-[16px]">
              Never miss an important update
            </h2>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 sm:text-xs">Get instant job, result, admit card, and exam alerts.</p>
            {message ? <p className="mt-1.5 text-[11px] font-semibold text-sky-700">{message}</p> : null}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
          <button type="button" onClick={close} className="h-10 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500 transition hover:bg-slate-50">
            Deny
          </button>
          <button type="button" onClick={() => void enable()} disabled={isEnabling} className="h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-xs font-bold text-white shadow-[0_5px_13px_rgba(37,99,235,0.28)] transition hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60">
            {isEnabling ? "Enabling..." : "Allow"}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
