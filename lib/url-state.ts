import type { BadgeConfig, BadgeTier, BadgeShape } from "@/lib/types";
import { ICON_MAP } from "@/lib/icon-data";

const SITE_URL = "https://badges.novigem.com";

const VALID_TIERS: BadgeTier[] = ["bronze", "silver", "gold", "ruby", "emerald"];
const VALID_SHAPES: BadgeShape[] = ["hexagon", "circle", "shield"];

/**
 * Reads URL search params and returns a validated partial BadgeConfig.
 * Invalid or missing values are omitted so defaults can fill in.
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

  const tier = params.get("tier");
  if (tier && VALID_TIERS.includes(tier as BadgeTier)) {
    result.tier = tier as BadgeTier;
  }

  const shape = params.get("shape");
  if (shape && VALID_SHAPES.includes(shape as BadgeShape)) {
    result.shape = shape as BadgeShape;
  }

  return result;
}

/**
 * Builds a full shareable URL with the badge config as search params.
 */
export function buildShareUrl(config: BadgeConfig): string {
  const params = new URLSearchParams();
  params.set("name", config.name);
  params.set("icon", config.iconName);
  params.set("tier", config.tier);
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
  params.set("tier", config.tier);
  params.set("shape", config.shape);
  window.history.replaceState(null, "", `?${params.toString()}#builder`);
}
