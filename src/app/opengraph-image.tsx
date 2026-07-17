import { ImageResponse } from "next/og";

export const alt = "SarkariGlobalResult latest government jobs and exam updates";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "72px",
          background:
            "radial-gradient(72% 90% at 20% -10%, rgba(56,240,184,0.28), transparent), radial-gradient(58% 70% at 95% 0%, rgba(255,207,91,0.22), transparent), linear-gradient(150deg, #060b15 0%, #0a1220 52%, #070b14 100%)",
          color: "#e7edf8",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#38f0b8",
          }}
        >
          Velora Studio
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 68,
              lineHeight: 1.02,
              fontWeight: 700,
              maxWidth: "16ch",
            }}
          >
            Premium products with company-standard engineering.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 30,
              color: "#9aa7bf",
            }}
          >
            Built for high-conversion experiences in 2026.
          </p>
        </div>
      </div>
    ),
    size,
  );
}
