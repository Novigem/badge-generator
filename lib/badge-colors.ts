import type {
  BadgeTier,
  BadgeColor,
  BadgeColorPalette,
  BadgeDuotone,
} from "./types";

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

/**
 * Preset swatches shown in the builder: the five hand-tuned tiers
 * plus derived colors covering the rest of the wheel.
 */
export const COLOR_PRESETS: {
  key: string;
  label: string;
  color: BadgeColor;
}[] = [
  { key: "bronze", label: "Bronze", color: { kind: "tier", tier: "bronze" } },
  { key: "silver", label: "Silver", color: { kind: "tier", tier: "silver" } },
  { key: "gold", label: "Gold", color: { kind: "tier", tier: "gold" } },
  { key: "ruby", label: "Ruby", color: { kind: "tier", tier: "ruby" } },
  {
    key: "emerald",
    label: "Emerald",
    color: { kind: "tier", tier: "emerald" },
  },
  { key: "blue", label: "Blue", color: { kind: "custom", hex: "#2563eb" } },
  { key: "purple", label: "Purple", color: { kind: "custom", hex: "#a855f7" } },
  { key: "teal", label: "Teal", color: { kind: "custom", hex: "#14b8a6" } },
  { key: "orange", label: "Orange", color: { kind: "custom", hex: "#f97316" } },
  { key: "pink", label: "Pink", color: { kind: "custom", hex: "#ec4899" } },
  { key: "slate", label: "Slate", color: { kind: "custom", hex: "#64748b" } },
  { key: "black", label: "Black", color: { kind: "custom", hex: "#262626" } },
];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

interface HSL {
  h: number; // 0..360
  s: number; // 0..1
  l: number; // 0..1
}

function hexToHsl(hex: string): HSL {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  } else if (max === g) {
    h = ((b - r) / d + 2) * 60;
  } else {
    h = ((r - g) / d + 4) * 60;
  }

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const hueToChannel = (t: number): number => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };

  const hn = h / 360;
  return [
    Math.round(hueToChannel(hn + 1 / 3) * 255),
    Math.round(hueToChannel(hn) * 255),
    Math.round(hueToChannel(hn - 1 / 3) * 255),
  ];
}

function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hslToRgbaString(
  h: number,
  s: number,
  l: number,
  alpha: number,
): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Derives a full six-value badge palette from a single base color.
 *
 * The relationships mirror the hand-tuned tiers: the base sits at mid,
 * outer is about 10 points darker and slightly more saturated, light is
 * about 8 points lighter, icon about 20 points lighter, and the two
 * shadows are dark low-alpha versions of the same hue.
 *
 * Extreme inputs are compressed so the ladder always fits: very dark
 * colors are lifted to a graphite look, very light colors are pulled
 * down so the icon shade stays visible, and grays keep their saturation
 * untouched so they never drift into a muddy tint.
 */
export function derivePalette(baseHex: string): BadgeColorPalette {
  const { h, s, l } = hexToHsl(baseHex);

  const lMid = clamp(l, 0.18, 0.8);
  const lOuter = Math.max(lMid - 0.1, 0.06);
  const lLight = Math.min(lMid + 0.08, 0.9);
  const lIcon = clamp(lMid + 0.2, lLight + 0.05, 0.96);

  // Grays stay gray: only boost saturation when there is real color.
  const sOuter = s > 0.12 ? Math.min(1, s + 0.06) : s;

  const lShadow = clamp(lMid * 0.6, 0.1, 0.35);
  const sShadow = Math.min(1, s * 1.15);
  const isLightBase = lMid > 0.6;

  return {
    outer: hslToHex(h, sOuter, lOuter),
    mid: hslToHex(h, s, lMid),
    light: hslToHex(h, s, lLight),
    icon: hslToHex(h, s, lIcon),
    shadow: hslToRgbaString(h, sShadow, lShadow, isLightBase ? 0.35 : 0.45),
    innerShadow: hslToRgbaString(
      h,
      sShadow,
      lShadow * 0.85,
      isLightBase ? 0.22 : 0.3,
    ),
  };
}

/**
 * Resolves a BadgeColor to its palette: hand-tuned for tiers,
 * derived for custom hex colors.
 */
export function resolvePalette(color: BadgeColor): BadgeColorPalette {
  return color.kind === "tier"
    ? BADGE_COLORS[color.tier]
    : derivePalette(color.hex);
}

/**
 * Compares two badge colors for picker selection state.
 */
export function isSameColor(a: BadgeColor, b: BadgeColor): boolean {
  if (a.kind === "tier" && b.kind === "tier") return a.tier === b.tier;
  if (a.kind === "custom" && b.kind === "custom") {
    return a.hex.toLowerCase() === b.hex.toLowerCase();
  }
  return false;
}

/** Fixed warm paper tone used across every sticker colorway. */
export const CREAM = "#F2EDD8";

/** Pale die-cut halo behind every sticker. */
export const HALO = "#FBF8EE";

/** Shadow color for the sticker drop shadow (used at low opacity). */
export const STICKER_SHADOW = "#4A4438";

const RGBA_PATTERN = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/;

/**
 * Returns the opaque hex version of a palette shadow value.
 * Palette shadows follow the recipe hue unchanged, s x 1.15 capped
 * at 1, l = clamp(l x 0.6, 0.1, 0.35); dropping the alpha yields a
 * dark, saturated ink in the same hue family.
 */
function opaqueShadowHex(shadow: string): string {
  if (shadow.startsWith("#")) return shadow.toUpperCase();
  const match = RGBA_PATTERN.exec(shadow);
  if (!match) return "#2F2A20";
  const toHex = (v: string) => Number(v).toString(16).padStart(2, "0");
  return `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`.toUpperCase();
}

/**
 * Maps a full six-value palette to the flat sticker duotone:
 * accent is the base color (mid), ink is the opaque version of the
 * palette shadow recipe, cream is fixed.
 */
export function toDuotone(palette: BadgeColorPalette): BadgeDuotone {
  return {
    ink: opaqueShadowHex(palette.shadow),
    accent: palette.mid,
    cream: CREAM,
  };
}

/**
 * Resolves a BadgeColor straight to its sticker duotone.
 */
export function resolveDuotone(color: BadgeColor): BadgeDuotone {
  return toDuotone(resolvePalette(color));
}
