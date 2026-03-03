export type BadgeTier = "bronze" | "silver" | "gold" | "ruby" | "emerald";
export type BadgeShape = "hexagon" | "circle" | "shield";

export interface BadgeConfig {
  name: string;
  iconName: string;
  tier: BadgeTier;
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
