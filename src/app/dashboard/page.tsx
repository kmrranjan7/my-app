import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";
import {
  AUTH_COOKIE_NAME,
  isAuthenticatedCookieValue,
} from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!isAuthenticatedCookieValue(authCookie)) {
    redirect("/login?next=/dashboard");
  }

  return (
    <main className="mx-auto w-[min(1320px,95vw)] py-3 sm:py-4">
      <DashboardShell />
    </main>
  );
}
