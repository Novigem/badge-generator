"use client";

import React, { forwardRef, useId } from "react";
import type { BadgeConfig, BadgeDuotone } from "@/lib/types";
import { MAX_TOP_TEXT, MAX_BOTTOM_TEXT } from "@/lib/types";
import { resolveDuotone, HALO, STICKER_SHADOW } from "@/lib/badge-colors";
import { CIRCLE, ARCH } from "@/lib/badge-shapes";
import { ICON_MAP } from "@/lib/icon-data";
import { ICON_BBOXES } from "@/lib/icon-bboxes";
import { sanitizeForSVG } from "@/lib/sanitize";
import type { LucideIcon } from "lucide-react";

interface BadgeSVGProps {
  config: BadgeConfig;
  size?: number;
}

const LETTER_SPACING = 2.5;
/** Average uppercase glyph advance as a fraction of font size. */
const GLYPH_WIDTH_RATIO = 0.62;

/** Half-circumference of each text baseline arc, in viewBox units. */
const ARC_LENGTH = {
  circleTop: Math.PI * 64,
  circleBottom: Math.PI * 75,
  archTop: Math.PI * 50,
};

/**
 * Shrinks the font size when the text would overflow its arc, so long
 * names truncate gracefully instead of spilling past the baseline.
 */
function fitFontSize(text: string, base: number, trackLength: number): number {
  if (!text) return base;
  const usable = trackLength * 0.94;
  const fit = (usable / text.length - LETTER_SPACING) / GLYPH_WIDTH_RATIO;
  return Math.round(Math.min(base, Math.max(7, fit)) * 10) / 10;
}

/**
 * Per-shape icon placement targets, in viewBox units. `box` is the
 * legacy square used when an icon is missing from the bbox map;
 * `target` and `clear` drive the normalized placement below, tuned so
 * the brain icon (the approved reference) renders unchanged.
 */
interface IconFit {
  /** Anchor the icon's visual center lands on. */
  cx: number;
  cy: number;
  /** Legacy square icon box, used as the fallback transform. */
  box: number;
  /** Max drawn dimension (bbox `w`/`h`) after scaling. */
  target: number;
  /** Max drawn radius (bbox `r`) from the anchor after scaling. */
  clear: number;
}

const ARCH_ICON_FIT: IconFit = {
  cx: 100,
  cy: 112,
  box: 48,
  target: 48.8,
  clear: 26.8,
};

const CIRCLE_ICON_FIT: IconFit = {
  cx: 100,
  cy: 100,
  box: 52,
  target: 52.9,
  clear: 29,
};

/**
 * Lucide icons are stroke-based, so the "accent with ink stroke" look
 * is drawn in two passes: a wider ink stroke underneath and the accent
 * stroke on top, which outlines every icon regardless of its geometry.
 *
 * All icons share a 24x24 viewBox but their drawn content varies, so
 * placement is normalized against the precomputed bbox map: the icon is
 * centered on its visual center and scaled so its largest dimension hits
 * `target`, capped so no drawn point gets closer to the arch's dash fan
 * than `clear` allows. Diagonally drawn icons like the rocket reach far
 * along the diagonal at an ordinary bbox size, which is why the radial
 * cap (not the box) is what keeps the gap below the dashes constant.
 * Stroke widths are compensated so ink weight matches at every scale.
 */
function StickerIcon({
  icon: Icon,
  iconKey,
  fit,
  duotone,
}: {
  icon: LucideIcon;
  iconKey: string;
  fit: IconFit;
  duotone: BadgeDuotone;
}) {
  const bbox = ICON_BBOXES[iconKey];
  const baseScale = fit.box / 24;

  let x = fit.cx - fit.box / 2;
  let y = fit.cy - fit.box / 2;
  let size = fit.box;
  let strokeScale = 1;

  if (bbox) {
    const scale = Math.min(
      fit.target / Math.max(bbox.w, bbox.h),
      fit.clear / bbox.r,
    );
    size = 24 * scale;
    x = fit.cx - (bbox.x + bbox.w / 2) * scale;
    y = fit.cy - (bbox.y + bbox.h / 2) * scale;
    strokeScale = baseScale / scale;
  }

  const shared = {
    x,
    y,
    width: size,
    height: size,
    fill: "none",
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
  return (
    <>
      <Icon {...shared} stroke={duotone.ink} strokeWidth={3.6 * strokeScale} />
      <Icon
        {...shared}
        stroke={duotone.accent}
        strokeWidth={1.8 * strokeScale}
      />
    </>
  );
}

/**
 * Flat curved-text sticker badge. Duotone colors (ink, accent, cream)
 * derive from the selected palette; the geometry follows the approved
 * sticker type sheet, with textPath arcs kept inside defs so curved
 * text survives SVG export.
 */
export const BadgeSVG = forwardRef<SVGSVGElement, BadgeSVGProps>(
  function BadgeSVG({ config, size = 300 }, ref) {
    const reactId = useId();
    const uid = `b${reactId.replace(/:/g, "")}`;
    const duotone = resolveDuotone(config.color);
    const iconEntry = ICON_MAP[config.iconName];
    const IconComponent = iconEntry?.component;

    const topText = sanitizeForSVG(config.topText, MAX_TOP_TEXT)
      .toUpperCase()
      .trim();
    const bottomText = sanitizeForSVG(config.bottomText, MAX_BOTTOM_TEXT)
      .toUpperCase()
      .trim();

    const isCircle = config.shape === "circle";

    return (
      <svg
        ref={ref}
        viewBox="0 0 200 200"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        fontFamily="system-ui, sans-serif"
        role="img"
        aria-label={`${config.topText || "Badge"} achievement badge`}
      >
        <title>{config.topText || "Badge"}</title>

        <defs>
          {isCircle ? (
            <>
              <path id={`${uid}-arc-top`} d={CIRCLE.arcTop} />
              <path id={`${uid}-arc-bottom`} d={CIRCLE.arcBottom} />
            </>
          ) : (
            <path id={`${uid}-arc-top`} d={ARCH.arcTop} />
          )}
          <filter id={`${uid}-ds`} x="-12%" y="-12%" width="124%" height="128%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2"
              floodColor={STICKER_SHADOW}
              floodOpacity="0.16"
            />
          </filter>
        </defs>

        {isCircle ? (
          <g>
            {/* Pale die-cut halo with the single subtle drop shadow */}
            <circle
              cx="100"
              cy="100"
              r={CIRCLE.haloRadius}
              fill={HALO}
              filter={`url(#${uid}-ds)`}
            />
            {/* Ink body */}
            <circle cx="100" cy="100" r={CIRCLE.bodyRadius} fill={duotone.ink} />
            {/* Cream pinstripe inside the rim */}
            <circle
              cx="100"
              cy="100"
              r={CIRCLE.pinstripeRadius}
              fill="none"
              stroke={duotone.cream}
              strokeWidth={1.5}
              opacity={0.55}
            />
            {/* Accent ring around the inner disc */}
            <circle
              cx="100"
              cy="100"
              r={CIRCLE.ringRadius}
              fill="none"
              stroke={duotone.accent}
              strokeWidth={2.5}
            />
            {/* Cream inner disc */}
            <circle cx="100" cy="100" r={CIRCLE.discRadius} fill={duotone.cream} />
            {IconComponent && (
              <StickerIcon
                icon={IconComponent}
                iconKey={config.iconName}
                fit={CIRCLE_ICON_FIT}
                duotone={duotone}
              />
            )}
            {topText && (
              <text
                fontSize={fitFontSize(topText, 13, ARC_LENGTH.circleTop)}
                fontWeight={700}
                letterSpacing={LETTER_SPACING}
                fill={duotone.cream}
              >
                <textPath
                  href={`#${uid}-arc-top`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {topText}
                </textPath>
              </text>
            )}
            {bottomText && (
              <text
                fontSize={fitFontSize(bottomText, 13, ARC_LENGTH.circleBottom)}
                fontWeight={700}
                letterSpacing={LETTER_SPACING}
                fill={duotone.cream}
              >
                <textPath
                  href={`#${uid}-arc-bottom`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {bottomText}
                </textPath>
              </text>
            )}
            {CIRCLE.dots.map((dot) => (
              <circle
                key={`${dot.cx}-${dot.cy}`}
                cx={dot.cx}
                cy={dot.cy}
                r={3}
                fill={duotone.accent}
              />
            ))}
          </g>
        ) : (
          <g>
            {/* Pale die-cut halo with the single subtle drop shadow */}
            <path d={ARCH.haloPath} fill={HALO} filter={`url(#${uid}-ds)`} />
            {/* Cream body with thick ink outline */}
            <path
              d={ARCH.bodyPath}
              fill={duotone.cream}
              stroke={duotone.ink}
              strokeWidth={5}
              strokeLinejoin="round"
            />
            {/* Accent pinline */}
            <path
              d={ARCH.pinlinePath}
              fill="none"
              stroke={duotone.accent}
              strokeWidth={2}
            />
            {/* Radiating ink dash marks above the icon */}
            <g stroke={duotone.ink} strokeWidth={3} strokeLinecap="round">
              {ARCH.rays.map((ray) => (
                <line key={`${ray.x1}-${ray.y1}`} {...ray} />
              ))}
            </g>
            {IconComponent && (
              <StickerIcon
                icon={IconComponent}
                iconKey={config.iconName}
                fit={ARCH_ICON_FIT}
                duotone={duotone}
              />
            )}
            {topText && (
              <text
                fontSize={fitFontSize(topText, 12, ARC_LENGTH.archTop)}
                fontWeight={700}
                letterSpacing={LETTER_SPACING}
                fill={duotone.ink}
              >
                <textPath
                  href={`#${uid}-arc-top`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {topText}
                </textPath>
              </text>
            )}
            {bottomText && (
              <text
                x={100}
                y={ARCH.captionY}
                fontSize={fitFontSize(bottomText, 9, 118)}
                fontWeight={700}
                letterSpacing={LETTER_SPACING}
                fill={duotone.ink}
                textAnchor="middle"
              >
                {bottomText}
              </text>
            )}
          </g>
        )}
      </svg>
    );
  },
);
