import { ImageResponse } from "next/og";

export const alt = "Sarkari Global Result latest government jobs, admit cards, and results";
export const size = {
  width: 1200,
  height: 630,
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
          padding: "56px",
          background:
            "radial-gradient(72% 90% at 10% -10%, rgba(14,165,233,0.28), transparent), radial-gradient(56% 70% at 95% 0%, rgba(37,99,235,0.24), transparent), linear-gradient(150deg, #081023 0%, #0d1a34 58%, #0a1427 100%)",
          color: "#e8eefc",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              height: 44,
              width: 44,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
              color: "#ffffff",
              background: "linear-gradient(160deg, #2563eb 0%, #06b6d4 100%)",
              boxShadow: "0 12px 24px rgba(37,99,235,0.34)",
            }}
          >
            S
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 26,
              letterSpacing: "0.14em",
              color: "#7dd3fc",
              textTransform: "uppercase",
            }}
          >
            Sarkari Global Result
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 56,
              maxWidth: "18ch",
              fontWeight: 700,
              lineHeight: 1.04,
            }}
          >
            Latest Govt Jobs, Admit Cards, and Results.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 28,
              color: "#a7b7d8",
            }}
          >
            Trusted updates from official notifications.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 22,
              color: "#c6d4ef",
              letterSpacing: "0.04em",
            }}
          >
            sarkariglobalresult.com
          </p>
        </div>
      </div>
    ),
    size,
  );
}
