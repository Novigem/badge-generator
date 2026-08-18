import type { BadgeShape } from "./types";

/**
 * Flat "curved-text sticker" geometry, all in a 200x200 viewBox
 * centered at (100,100). Arc math verified in headless Chrome:
 * the bottom arc uses a reversed sweep so its text reads upright.
 */

export const CIRCLE = {
  haloRadius: 95,
  bodyRadius: 88,
  pinstripeRadius: 83,
  ringRadius: 52,
  discRadius: 46,
  /** Top text baseline: r64 arc, glyphs grow outward toward the rim. */
  arcTop: "M 36,100 A 64 64 0 0 1 164,100",
  /** Bottom text baseline: r75 arc, reversed sweep, glyphs grow inward. */
  arcBottom: "M 25,100 A 75 75 0 0 0 175,100",
  /** Accent dots on the horizontal midline, between the two arcs. */
  dots: [
    { cx: 30.5, cy: 100 },
    { cx: 169.5, cy: 100 },
  ],
} as const;

export const ARCH = {
  /** Pale die-cut halo behind the sticker. */
  haloPath:
    "M 22 90 A 78 78 0 0 1 178 90 L 178 168 Q 178 188 158 188 L 42 188 Q 22 188 22 168 Z",
  /** Cream body with a thick ink outline: half-circle top, rounded base. */
  bodyPath:
    "M 30 90 A 70 70 0 0 1 170 90 L 170 164 Q 170 180 154 180 L 46 180 Q 30 180 30 164 Z",
  /** Thin accent pinline inset from the body. */
  pinlinePath:
    "M 38 90 A 62 62 0 0 1 162 90 L 162 160 Q 162 172 152 172 L 48 172 Q 38 172 38 160 Z",
  /** Arch text baseline: r50, concentric with the r70 crown. */
  arcTop: "M 50,90 A 50 50 0 0 1 150,90",
  /** Radiating ink dash marks above the icon. */
  rays: [
    { x1: 100, y1: 82, x2: 100, y2: 72 },
    { x1: 110.3, y1: 83.8, x2: 113.7, y2: 74.4 },
    { x1: 89.7, y1: 83.8, x2: 86.3, y2: 74.4 },
    { x1: 119.3, y1: 89, x2: 125.7, y2: 81.4 },
    { x1: 80.7, y1: 89, x2: 74.3, y2: 81.4 },
  ],
  /** Straight caps line near the base for the bottom text. */
  captionY: 158,
} as const;


/**
 * Builds a five-point star outline with rounded vertices: each tip and
 * valley is replaced by a quadratic curve through the vertex, so the
 * die-cut sticker look stays soft instead of aggressive.
 */
function roundedStarPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  tipRound: number,
  valleyRound: number,
): string {
  const points: { x: number; y: number; tip: boolean }[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * i) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? outer : inner;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      tip: i % 2 === 0,
    });
  }
  const format = (x: number, y: number) =>
    `${Math.round(x * 100) / 100} ${Math.round(y * 100) / 100}`;
  const parts = points.map((vertex, i) => {
    const prev = points[(i + 9) % 10];
    const next = points[(i + 1) % 10];
    const trim = vertex.tip ? tipRound : valleyRound;
    const inLen = Math.hypot(vertex.x - prev.x, vertex.y - prev.y);
    const outLen = Math.hypot(next.x - vertex.x, next.y - vertex.y);
    const entry = format(
      vertex.x - ((vertex.x - prev.x) / inLen) * trim,
      vertex.y - ((vertex.y - prev.y) / inLen) * trim,
    );
    const exit = format(
      vertex.x + ((next.x - vertex.x) / outLen) * trim,
      vertex.y + ((next.y - vertex.y) / outLen) * trim,
    );
    return `${i === 0 ? "M" : "L"} ${entry} Q ${format(vertex.x, vertex.y)} ${exit}`;
  });
  return `${parts.join(" ")} Z`;
}

export const STAR = {
  /** Pale die-cut halo behind the sticker. */
  haloPath: roundedStarPath(100, 100, 99, 63, 10, 8),
  /** Accent body with a thick ink outline. */
  bodyPath: roundedStarPath(100, 100, 91, 58, 8, 6),
  /** Cream disc holding the icon. */
  discRadius: 40,
  /**
   * Top text baseline: r45.5 arc around the disc. Glyphs grow outward
   * and stay under r57, inside the rounded valleys at r58.
   */
  arcTop: "M 54.5,100 A 45.5 45.5 0 0 1 145.5,100",
  /** Straight caps line in the lower star region for the bottom text. */
  captionY: 153,
} as const;

export const ROSETTE = {
  /** The circle stack, scaled and raised to leave room for the ribbon. */
  cx: 100,
  cy: 86,
  haloRadius: 78,
  bodyRadius: 72,
  pinstripeRadius: 68,
  ringRadius: 42.5,
  discRadius: 37.5,
  /** Top text baseline: r52 arc concentric with the raised circle. */
  arcTop: "M 48,86 A 52 52 0 0 1 152,86",
  /** Accent dots on the circle midline. */
  dots: [
    { cx: 41, cy: 86 },
    { cx: 159, cy: 86 },
  ],
  /**
   * Ribbon banner, shown only when there is bottom text. The wings sit
   * behind the circle, the sagging center band sits in front of its
   * lower edge, and the fold triangles between them sell the wrap.
   */
  ribbon: {
    /** Halo outsets so the die-cut follows the combined silhouette. */
    haloPaths: [
      "M 14 144 L 54 140 L 54 184 L 14 182 L 24 163 Z",
      "M 186 144 L 146 140 L 146 184 L 186 182 L 176 163 Z",
      "M 31 144 Q 100 153 169 144 L 169 182 Q 100 191 31 182 Z",
    ],
    /** Notched wings poking out left and right, behind the circle. */
    wingPaths: [
      "M 20 149 L 52 146 L 52 178 L 20 176 L 29 162.5 Z",
      "M 180 149 L 148 146 L 148 178 L 180 176 L 171 162.5 Z",
    ],
    /** Darker fold triangles where the band turns behind the wings. */
    foldPaths: [
      "M 36 150 L 36 162 L 27 156 Z",
      "M 164 150 L 164 162 L 173 156 Z",
    ],
    /** Front center band with a slight downward sag. */
    bandPath:
      "M 34 149.5 Q 100 158 166 149.5 L 166 175.5 Q 100 184 34 175.5 Z",
    /** Baseline for the ribbon text, centered in the band. */
    textY: 167,
    /** Usable straight track length for the ribbon text. */
    textTrack: 112,
  },
} as const;

export const SHAPE_LABELS: Record<BadgeShape, string> = {
  circle: "Circle",
  arch: "Arch",
  star: "Star",
  rosette: "Rosette",
};
