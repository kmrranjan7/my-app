"use client";

import { create } from "zustand";

import { dashboardService } from "@/services/dashboard/dashboardService";
import type {
  DashboardPayload,
  LatestJob,
  NotificationItem,
  UserApplication,
} from "@/types/dashboard";

type DashboardState = {
  readonly loading: boolean;
  readonly creating: boolean;
  readonly errorMessage: string | null;
  readonly language: "EN" | "HI";
  readonly query: string;
  readonly data: DashboardPayload | null;
  fetchDashboardData: () => Promise<void>;
  setLanguage: (language: "EN" | "HI") => void;
  setQuery: (query: string) => void;
  addApplicationFromJob: (job: LatestJob) => Promise<void>;
  addApplicationFromPost: (application: UserApplication) => void;
  markNotificationRead: (notificationId: string) => void;
};

function toRead(notification: NotificationItem): NotificationItem {
  return { ...notification, isNew: false };
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  loading: true,
  creating: false,
  errorMessage: null,
  language: "EN",
  query: "",
  data: null,

  async fetchDashboardData() {
    set({ loading: true, errorMessage: null });

    try {
      const payload = await dashboardService.fetchDashboard();
      set({ data: payload, loading: false });
    } catch {
      set({
        loading: false,
        errorMessage:
          "Unable to load dashboard data right now. Please refresh and try again.",
      });
    }
  },

  setLanguage(language) {
    set({ language });
  },

  setQuery(query) {
    set({ query });
  },

  async addApplicationFromJob(job) {
    const { data } = get();

    if (!data) {
      return;
    }

    set({ creating: true, errorMessage: null });

    try {
      const created = await dashboardService.createApplication(job);
      set((state) => {
        if (!state.data) {
          return { creating: false };
        }

        return {
          creating: false,
          data: {
            ...state.data,
            applications: [created, ...state.data.applications],
            stats: state.data.stats.map((item) => {
              if (item.id === "submitted") {
                return { ...item, value: item.value + 1 };
              }

              if (item.id === "pending") {
                return { ...item, value: item.value + 1 };
              }

              return item;
            }),
          },
        };
      });
    } catch {
      set({
        creating: false,
        errorMessage: "Could not create application. Please retry.",
      });
    }
  },

  addApplicationFromPost(application) {
    set((state) => {
      if (!state.data) {
        return {};
      }

      return {
        data: {
          ...state.data,
          applications: [application, ...state.data.applications],
          stats: state.data.stats.map((item) => {
            if (item.id === "submitted") {
              return { ...item, value: item.value + 1 };
            }

            if (item.id === "pending") {
              return { ...item, value: item.value + 1 };
            }

            return item;
          }),
        },
      };
    });
  },

  markNotificationRead(notificationId) {
    set((state) => {
      if (!state.data) {
        return {};
      }

      return {
        data: {
          ...state.data,
          notifications: state.data.notifications.map((item) =>
            item.id === notificationId ? toRead(item) : item,
          ),
        },
      };
    });
  },
}));