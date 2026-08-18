export type BadgeTier = "bronze" | "silver" | "gold" | "ruby" | "emerald";
export type BadgeShape = "circle" | "arch";

/**
 * Badge color is either one of the hand-tuned tiers or a custom
 * hex color whose palette is derived at render time.
 */
export type BadgeColor =
  | { kind: "tier"; tier: BadgeTier }
  | { kind: "custom"; hex: string };

/** Maximum characters that fit the curved text arcs without overflow. */
export const MAX_TOP_TEXT = 16;
export const MAX_BOTTOM_TEXT = 16;

export interface BadgeConfig {
  /** Curved text along the top arc. Stored as typed; uppercased at render. */
  topText: string;
  /**
   * Bottom line: curved along the bottom arc on the circle shape,
   * a small straight caps line on the arch shape. Empty hides it.
   */
  bottomText: string;
  iconName: string;
  color: BadgeColor;
  shape: BadgeShape;
}

export interface BadgeColorPalette {
  outer: string;
  mid: string;
  light: string;
  icon: string;
  shadow: string;
  innerShadow: string;
}

/** Flat sticker colorway derived from a palette. */
export interface BadgeDuotone {
  /** Dark outline and body color. */
  ink: string;
  /** The base color: rings, icon, dots. */
  accent: string;
  /** Fixed warm paper tone for discs and light text. */
  cream: string;
}
