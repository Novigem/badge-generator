import type { BadgeConfig, BadgeColor, BadgeTier, BadgeShape } from "@/lib/types";
import { ICON_MAP } from "@/lib/icon-data";

const SITE_URL = "https://badges.novigem.com";

const VALID_TIERS: BadgeTier[] = ["bronze", "silver", "gold", "ruby", "emerald"];
const VALID_SHAPES: BadgeShape[] = ["hexagon", "circle", "shield"];
const HEX_PARAM = /^[0-9a-fA-F]{6}$/;

/**
 * Reads URL search params and returns a validated partial BadgeConfig.
 * Invalid or missing values are omitted so defaults can fill in.
 *
 * Color comes from either `color` (custom hex, 6 digits, no hash) or
 * `tier` (legacy tier key). Old shared URLs with `tier=` keep working.
 * Garbage in either param is ignored, which falls back to the default
 * gold config.
 */
export function parseConfigFromParams(
  params: URLSearchParams,
): Partial<BadgeConfig> {
  const result: Partial<BadgeConfig> = {};

  const name = params.get("name");
  if (name) {
    result.name = name.trim().slice(0, 50);
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
 * Builds a full shareable URL with the badge config as search params.
 */
export function buildShareUrl(config: BadgeConfig): string {
  const params = new URLSearchParams();
  params.set("name", config.name);
  params.set("icon", config.iconName);
  setColorParam(params, config.color);
  params.set("shape", config.shape);
  return `${SITE_URL}?${params.toString()}`;
}

/**
 * Updates the browser URL bar without triggering navigation.
 * Callers should debounce this: Safari rate-limits replaceState.
 */
export function syncUrlToConfig(config: BadgeConfig): void {
  const params = new URLSearchParams();
  params.set("name", config.name);
  params.set("icon", config.iconName);
  setColorParam(params, config.color);
  params.set("shape", config.shape);
  window.history.replaceState(null, "", `?${params.toString()}#builder`);
}
