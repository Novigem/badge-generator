import type { BadgeTier, BadgeColorPalette } from "./types";

export const BADGE_COLORS: Record<BadgeTier, BadgeColorPalette> = {
  bronze: {
    outer: "#C87810",
    mid: "#E89420",
    light: "#F5A838",
    icon: "#FFBE50",
    shadow: "rgba(160,80,0,0.45)",
    innerShadow: "rgba(120,55,0,0.30)",
  },
  silver: {
    outer: "#8898A8",
    mid: "#A0B4C4",
    light: "#B8CCDA",
    icon: "#D4E2EE",
    shadow: "rgba(70,90,115,0.35)",
    innerShadow: "rgba(55,75,100,0.22)",
  },
  gold: {
    outer: "#CCA400",
    mid: "#E8C000",
    light: "#F0CC20",
    icon: "#FFE060",
    shadow: "rgba(160,120,0,0.45)",
    innerShadow: "rgba(130,90,0,0.25)",
  },
  ruby: {
    outer: "#B01010",
    mid: "#D42020",
    light: "#E83838",
    icon: "#F06868",
    shadow: "rgba(150,8,8,0.45)",
    innerShadow: "rgba(110,0,0,0.30)",
  },
  emerald: {
    outer: "#1E6E12",
    mid: "#2E9420",
    light: "#44B232",
    icon: "#70D050",
    shadow: "rgba(15,85,5,0.45)",
    innerShadow: "rgba(10,65,5,0.30)",
  },
};

export const TIER_LABELS: Record<BadgeTier, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  ruby: "Ruby",
  emerald: "Emerald",
};
