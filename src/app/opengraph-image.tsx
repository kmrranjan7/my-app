import { ImageResponse } from "next/og";

export const alt = "Sarkari Global Result Latest government jobs, admit cards, and results";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ alignItems: "center", background: "linear-gradient(135deg, #eef2ff, #ecfeff)", color: "#0f172a", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", width: "100%" }}>
        <div style={{ color: "#4338ca", fontSize: 32, fontWeight: 700 }}>Sarkari Global Result</div>
        <div style={{ fontSize: 62, fontWeight: 800, marginTop: 24 }}>Jobs, Admit Cards & Results</div>
        <div style={{ color: "#475569", fontSize: 28, marginTop: 24 }}>Latest government updates in one place</div>
      </div>
    ),
    size,
  );
}
