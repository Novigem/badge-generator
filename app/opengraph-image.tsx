import { ImageResponse } from "next/og";
import { BADGE_COLORS, toDuotone, HALO } from "@/lib/badge-colors";

export const alt = "Badge Builder by Novigem: design custom achievement badges";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG card in the flat sticker style: circle badge, duotone gold
 * colorway, cream inner disc, star icon in accent with an ink stroke.
 * ImageResponse cannot render SVG textPath, so the curved arc text is
 * approximated with straight uppercase lines above and below the disc.
 */
export default function OpengraphImage() {
  const { ink, accent, cream } = toDuotone(BADGE_COLORS.gold);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 90,
          backgroundColor: "#EFEDE6",
        }}
      >
        {/* Pale die-cut halo */}
        <div
          style={{
            width: 400,
            height: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: HALO,
            boxShadow: "0 4px 8px rgba(74,68,56,0.16)",
          }}
        >
          {/* Ink body */}
          <div
            style={{
              width: 370,
              height: 370,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: ink,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 6,
                color: cream,
                marginBottom: 16,
              }}
            >
              ACHIEVEMENT
            </div>
            {/* Cream inner disc with accent ring */}
            <div
              style={{
                width: 190,
                height: 190,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: cream,
                border: `5px solid ${accent}`,
              }}
            >
              <svg width="104" height="104" viewBox="0 0 24 24">
                <path
                  d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                  fill={accent}
                  stroke={ink}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 5,
                color: cream,
                marginTop: 16,
              }}
            >
              BADGE · 2026
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 560,
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, color: "#3A3428" }}>
            Badge Builder
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 32,
              color: "#7A7466",
              lineHeight: 1.4,
            }}
          >
            Design custom achievement badges. Free, client-side, no sign-up.
          </div>
          <div style={{ marginTop: 28, fontSize: 26, color: "#9A937F" }}>
            badges.novigem.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
