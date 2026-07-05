import type { Metadata } from "next";
import HeaderNavbar from "@/components/HeaderNavbar";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_SITE_URL
  : "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Velora Studio",
    template: "%s | Velora Studio",
  },
  description:
    "Premium digital product studio delivering company-standard engineering and high-conversion brand experiences.",
  applicationName: "Velora Studio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Velora Studio",
    description:
      "Company-grade product engineering paired with premium 2026 interface design.",
    url: "/",
    siteName: "Velora Studio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Velora Studio premium digital product experience",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velora Studio",
    description:
      "Company-grade engineering with premium rich design that feels unmistakably modern.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <HeaderNavbar />
        {children}
      </body>
    </html>
  );
}
