import { ImageResponse } from "next/og";
import { BADGE_COLORS } from "@/lib/badge-colors";

export const alt = "Badge Builder by Novigem: design custom achievement badges";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Same pointy-top hexagon proportions as lib/badge-shapes.ts, as a clip-path. */
const HEXAGON_CLIP =
  "polygon(50% 3%, 92% 22%, 92% 78%, 50% 97%, 8% 78%, 8% 22%)";

export default function OpengraphImage() {
  const gold = BADGE_COLORS.gold;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          backgroundColor: "#18181b",
        }}
      >
        <div
          style={{
            width: 320,
            height: 336,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            clipPath: HEXAGON_CLIP,
            background: `linear-gradient(180deg, ${gold.light} 0%, ${gold.mid} 50%, ${gold.outer} 100%)`,
          }}
        >
          <div
            style={{
              width: 240,
              height: 252,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              clipPath: HEXAGON_CLIP,
              background: `radial-gradient(circle at 50% 38%, ${gold.light} 0%, ${gold.mid} 55%, ${gold.outer} 100%)`,
            }}
          >
            <svg width="110" height="110" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={gold.icon}
              />
            </svg>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 560,
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, color: "#fafafa" }}>
            Badge Builder
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 32,
              color: "#a1a1aa",
              lineHeight: 1.4,
            }}
          >
            Design custom achievement badges. Free, client-side, no sign-up.
          </div>
          <div style={{ marginTop: 28, fontSize: 26, color: "#71717a" }}>
            badges.novigem.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
