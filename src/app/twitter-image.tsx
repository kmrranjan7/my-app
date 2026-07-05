import { ImageResponse } from "next/og";

export const alt = "Velora Studio premium rich 2026 interface";
export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "64px",
          background:
            "radial-gradient(72% 90% at 18% -10%, rgba(56,240,184,0.24), transparent), linear-gradient(155deg, #060b15 0%, #0a1220 57%, #070b14 100%)",
          color: "#e7edf8",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 24,
              letterSpacing: "0.18em",
              color: "#38f0b8",
              textTransform: "uppercase",
            }}
          >
            Velora Studio
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 58,
              maxWidth: "19ch",
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            Premium digital products engineered to company standards.
          </p>
        </div>
      </div>
    ),
    size,
  );
}
