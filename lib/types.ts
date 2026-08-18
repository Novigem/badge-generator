export type BadgeTier = "bronze" | "silver" | "gold" | "ruby" | "emerald";
export type BadgeShape = "hexagon" | "circle" | "shield";

/**
 * Badge color is either one of the hand-tuned tiers or a custom
 * hex color whose palette is derived at render time.
 */
export type BadgeColor =
  | { kind: "tier"; tier: BadgeTier }
  | { kind: "custom"; hex: string };

export interface BadgeConfig {
  name: string;
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
