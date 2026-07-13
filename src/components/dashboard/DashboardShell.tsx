"use client";

import dynamic from "next/dynamic";
import { AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LatestJobsWidget from "@/components/dashboard/LatestJobsWidget";
import type { NewPostPrefillRecord } from "@/components/dashboard/NewPostPanel";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import StatsCards from "@/components/dashboard/StatsCards";
import { SkeletonBlock } from "@/components/dashboard/ui";
import { useDashboardStore } from "@/stores/dashboardStore";

const NewPostPanel = dynamic(() => import("@/components/dashboard/NewPostPanel"));
const SavedJobsPanel = dynamic(() => import("@/components/dashboard/SavedJobsPanel"));
const SavedAdmitCardPanel = dynamic(() => import("@/components/dashboard/SavedAdmitCardPanel"));
const SavedExamPanel = dynamic(() => import("@/components/dashboard/SavedExamPanel"));
const SavedResultPanel = dynamic(() => import("@/components/dashboard/SavedResultPanel"));
const ProfileManagementPanel = dynamic(() => import("@/components/dashboard/ProfileManagementPanel"));
const HelpSupportPanel = dynamic(() => import("@/components/dashboard/HelpSupportPanel"));

function DashboardSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <SkeletonBlock className="h-24" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={`stat-${index}`} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[290px_minmax(0,1fr)]">
        <SkeletonBlock className="h-[580px]" />
        <SkeletonBlock className="h-[580px]" />
      </div>
    </div>
  );
}

export default function DashboardShell() {
  const {
    loading,
    creating,
    errorMessage,
    data,
    query,
    language,
    addApplicationFromJob,
    fetchDashboardData,
    markNotificationRead,
    setLanguage,
    setQuery,
  } = useDashboardStore((state) => state);
  const [activeMenuKey, setActiveMenuKey] = useState("Dashboard");
  const [prefillRecord, setPrefillRecord] = useState<NewPostPrefillRecord | null>(null);
  const [savedRecordsVersion, setSavedRecordsVersion] = useState(0);

  const handleStatNavigation = (statId: string) => {
    if (statId === "job") {
      setActiveMenuKey("Saved Jobs");
      return;
    }

    if (statId === "admit") {
      setActiveMenuKey("Saved Admit Card");
      return;
    }

    if (statId === "exam") {
      setActiveMenuKey("Saved Exam");
      return;
    }

    if (statId === "results") {
      setActiveMenuKey("Saved Result");
    }
  };

  const filteredJobs = useMemo(() => {
    if (!data) {
      return [];
    }

    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return data.jobs;
    }

    return data.jobs.filter((job) => {
      const candidate = `${job.title} ${job.department} ${job.location} ${job.id}`.toLowerCase();
      return candidate.includes(normalized);
    });
  }, [data, query]);

  useEffect(() => {
    void fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-rose-300 bg-rose-50 p-5 text-rose-800 dark:border-rose-900 dark:bg-rose-950/25 dark:text-rose-200">
        <div className="flex items-start gap-2">
          <AlertTriangle size={18} className="mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-bold">Dashboard failed to load</p>
            <p className="mt-1 text-sm">{errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                void fetchDashboardData();
              }}
              className="mt-3 inline-flex rounded-lg border border-rose-400 px-3 py-1.5 text-sm font-semibold transition hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-950/45"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-3 pb-6">
      <DashboardHeader
        query={query}
        language={language}
        unreadCount={data.notifications.filter((item) => item.isNew).length}
        onQueryChange={setQuery}
        onLanguageChange={setLanguage}
      />

      <section className="grid grid-cols-1 gap-3 xl:grid-cols-[290px_minmax(0,1fr)]">
        <DashboardSidebar
          activeKey={activeMenuKey}
          onSelectKey={(nextKey) => {
            if (nextKey !== "New Post") {
              setPrefillRecord(null);
            }
            setActiveMenuKey(nextKey);
          }}
        />

        <div className="space-y-3">
          {activeMenuKey === "Job Notifications" ? (
            <NotificationPanel
              notifications={data.notifications}
              onMarkRead={markNotificationRead}
            />
          ) : activeMenuKey === "Current Vacancies" ? (
            <LatestJobsWidget
              jobs={filteredJobs}
              creating={creating}
              onApply={(job) => {
                void addApplicationFromJob(job);
              }}
            />
          ) : activeMenuKey === "Saved Jobs" ? (
            <SavedJobsPanel
              postTypeFilter="Job"
              refreshToken={savedRecordsVersion}
              onEditInNewPost={(record) => {
                setPrefillRecord(record);
                setActiveMenuKey("New Post");
              }}
            />
          ) : activeMenuKey === "Saved Admit Card" ? (
            <SavedAdmitCardPanel
              refreshToken={savedRecordsVersion}
              onEditInNewPost={(record) => {
                setPrefillRecord(record);
                setActiveMenuKey("New Post");
              }}
            />
          ) : activeMenuKey === "Saved Exam" ? (
            <SavedExamPanel
              refreshToken={savedRecordsVersion}
              onEditInNewPost={(record) => {
                setPrefillRecord(record);
                setActiveMenuKey("New Post");
              }}
            />
          ) : activeMenuKey === "Saved Result" ? (
            <SavedResultPanel
              refreshToken={savedRecordsVersion}
              onEditInNewPost={(record) => {
                setPrefillRecord(record);
                setActiveMenuKey("New Post");
              }}
            />
          ) : activeMenuKey === "Profile Management" ? (
            <ProfileManagementPanel />
          ) : activeMenuKey === "New Post" ? (
            <NewPostPanel
              prefillRecord={prefillRecord}
              onSavedRecord={() => {
                setSavedRecordsVersion((current) => current + 1);
                void fetchDashboardData();
              }}
            />
          ) : activeMenuKey === "Help & Support" ? (
            <HelpSupportPanel />
          ) : (
            <>
              <StatsCards stats={data.stats} onStatClick={handleStatNavigation} />

              <AnalyticsSection
                categoryData={data.categoryChart}
                statusData={data.statusChart}
                recruitmentData={data.recruitmentChart}
                monthlyTrend={data.monthlyTrend}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
