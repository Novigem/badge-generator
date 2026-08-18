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

export const SHAPE_LABELS: Record<BadgeShape, string> = {
  circle: "Circle",
  arch: "Arch",
};
