import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      name: "Sarkari Global Result",
      short_name: "Sarkari Result",
      description: "Government job, result, admit card, and exam updates.",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#2563eb",
      icons: [{ src: "/opengraph.png", sizes: "1200x630", type: "image/png" }],
    },
    { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "no-store" } },
  );
}
