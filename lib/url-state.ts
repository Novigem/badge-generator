import type {
  BadgeConfig,
  BadgeColor,
  BadgeTier,
  BadgeShape,
} from "@/lib/types";
import { MAX_TOP_TEXT, MAX_BOTTOM_TEXT } from "@/lib/types";
import { ICON_MAP } from "@/lib/icon-data";

const SITE_URL = "https://badges.novigem.com";

const VALID_TIERS: BadgeTier[] = ["bronze", "silver", "gold", "ruby", "emerald"];
const VALID_SHAPES: BadgeShape[] = ["circle", "arch", "star", "rosette"];
/** Retired shapes from old shared URLs map to the closest current shape. */
const LEGACY_SHAPE_MAP: Record<string, BadgeShape> = {
  hexagon: "circle",
  shield: "circle",
};
const HEX_PARAM = /^[0-9a-fA-F]{6}$/;

/**
 * Reads URL search params and returns a validated partial BadgeConfig.
 * Invalid or missing values are omitted so defaults can fill in.
 *
 * Back-compat: `name` from old shared URLs maps to the top text
 * (clamped to the new arc length), `shape=hexagon` and `shape=shield`
 * map to `circle`, and `tier=` keeps working alongside `color=`.
 * Garbage in any param is ignored, which falls back to the default.
 */
export function parseConfigFromParams(
  params: URLSearchParams,
): Partial<BadgeConfig> {
  const result: Partial<BadgeConfig> = {};

  const name = params.get("name");
  if (name) {
    result.topText = name.trim().slice(0, MAX_TOP_TEXT);
  }

  const bottom = params.get("bottom");
  if (bottom) {
    result.bottomText = bottom.trim().slice(0, MAX_BOTTOM_TEXT);
  }

  const icon = params.get("icon");
  if (icon && icon in ICON_MAP) {
    result.iconName = icon;
  }

  const color = params.get("color");
  const tier = params.get("tier");
  if (color && HEX_PARAM.test(color)) {
    result.color = { kind: "custom", hex: `#${color.toLowerCase()}` };
  } else if (tier && VALID_TIERS.includes(tier as BadgeTier)) {
    result.color = { kind: "tier", tier: tier as BadgeTier };
  }

  const shape = params.get("shape");
  if (shape && VALID_SHAPES.includes(shape as BadgeShape)) {
    result.shape = shape as BadgeShape;
  } else if (shape && shape in LEGACY_SHAPE_MAP) {
    result.shape = LEGACY_SHAPE_MAP[shape];
  }

  return result;
}

/**
 * Writes the color as `tier=` for tiers (same format as old URLs)
 * or `color=` with a bare 6-digit hex for custom colors.
 */
function setColorParam(params: URLSearchParams, color: BadgeColor): void {
  if (color.kind === "tier") {
    params.set("tier", color.tier);
  } else {
    params.set("color", color.hex.replace("#", "").toLowerCase());
  }
}

/**
 * Serializes the config to search params. The top text keeps the
 * `name` param so pre-redesign URLs and new ones share one format;
 * the bottom text is omitted when empty.
 */
function configToParams(config: BadgeConfig): URLSearchParams {
  const params = new URLSearchParams();
  params.set("name", config.topText);
  if (config.bottomText) {
    params.set("bottom", config.bottomText);
  }
  params.set("icon", config.iconName);
  setColorParam(params, config.color);
  params.set("shape", config.shape);
  return params;
}

/**
 * Builds a full shareable URL with the badge config as search params.
 */
export function buildShareUrl(config: BadgeConfig): string {
  return `${SITE_URL}?${configToParams(config).toString()}`;
}

/**
 * Updates the browser URL bar without triggering navigation.
 * Callers should debounce this: Safari rate-limits replaceState.
 */
export function syncUrlToConfig(config: BadgeConfig): void {
  window.history.replaceState(
    null,
    "",
    `?${configToParams(config).toString()}#builder`,
  );
}
