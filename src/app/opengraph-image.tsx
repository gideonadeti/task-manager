import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt = siteConfig.name;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background:
            "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #3b82f6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 36,
              textAlign: "center",
              maxWidth: 900,
              opacity: 0.9,
            }}
          >
            Modern Task Management App
          </div>
          <div
            style={{
              fontSize: 24,
              textAlign: "center",
              maxWidth: 800,
              opacity: 0.8,
              marginTop: 20,
            }}
          >
            Organize your tasks, boost your productivity
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
