"use client";

import React, { forwardRef, useId } from "react";
import type { BadgeConfig, BadgeDuotone } from "@/lib/types";
import { MAX_TOP_TEXT, MAX_BOTTOM_TEXT } from "@/lib/types";
import {
  resolveDuotone,
  darkenHex,
  HALO,
  STICKER_SHADOW,
} from "@/lib/badge-colors";
import { CIRCLE, ARCH, STAR, ROSETTE } from "@/lib/badge-shapes";
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
  starTop: Math.PI * 45.5,
  rosetteTop: Math.PI * 50,
};

/**
 * Shrinks the font size when the text would overflow its arc, so long
 * names truncate gracefully instead of spilling past the baseline.
 */
function fitFontSize(text: string, base: number, trackLength: number): number {
  if (!text) return base;
  // Real glyphs run a little wider than the average-ratio estimate, so
  // the usable factor keeps a safety margin against textPath overflow.
  const usable = trackLength * 0.86;
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

const STAR_ICON_FIT: IconFit = {
  cx: 100,
  cy: 100,
  box: 45,
  target: 46,
  clear: 25.2,
};

const ROSETTE_ICON_FIT: IconFit = {
  cx: 100,
  cy: 86,
  box: 42,
  target: 43.1,
  clear: 23.6,
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
    const isArch = config.shape === "arch";
    const isStar = config.shape === "star";
    const isRosette = config.shape === "rosette";

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
          {isCircle && (
            <>
              <path id={`${uid}-arc-top`} d={CIRCLE.arcTop} />
              <path id={`${uid}-arc-bottom`} d={CIRCLE.arcBottom} />
            </>
          )}
          {isArch && <path id={`${uid}-arc-top`} d={ARCH.arcTop} />}
          {isStar && <path id={`${uid}-arc-top`} d={STAR.arcTop} />}
          {isRosette && <path id={`${uid}-arc-top`} d={ROSETTE.arcTop} />}
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

        {isCircle && (
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
        )}

        {isArch && (
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

        {isStar && (
          <g>
            {/* Pale die-cut halo with the single subtle drop shadow */}
            <path d={STAR.haloPath} fill={HALO} filter={`url(#${uid}-ds)`} />
            {/* Accent body with thick ink outline and rounded points */}
            <path
              d={STAR.bodyPath}
              fill={duotone.accent}
              stroke={duotone.ink}
              strokeWidth={5}
              strokeLinejoin="round"
            />
            {/* Cream disc holding the icon */}
            <circle
              cx={100}
              cy={100}
              r={STAR.discRadius}
              fill={duotone.cream}
              stroke={duotone.ink}
              strokeWidth={2.5}
            />
            {IconComponent && (
              <StickerIcon
                icon={IconComponent}
                iconKey={config.iconName}
                fit={STAR_ICON_FIT}
                duotone={duotone}
              />
            )}
            {topText && (
              <text
                fontSize={fitFontSize(topText, 10.5, ARC_LENGTH.starTop)}
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
                y={STAR.captionY}
                fontSize={fitFontSize(bottomText, 8, 64)}
                fontWeight={700}
                letterSpacing={2}
                fill={duotone.ink}
                textAnchor="middle"
                // The lower star region is narrow and fitFontSize floors at
                // 7, so long captions are compressed to the track instead
                // of spilling over the star's edges.
                textLength={
                  bottomText.length *
                    (GLYPH_WIDTH_RATIO * fitFontSize(bottomText, 8, 64) + 2) >
                  62
                    ? 62
                    : undefined
                }
                lengthAdjust="spacingAndGlyphs"
              >
                {bottomText}
              </text>
            )}
          </g>
        )}

        {isRosette && (
          <g>
            {/* Halo follows the combined circle-plus-ribbon silhouette */}
            <g filter={`url(#${uid}-ds)`}>
              <circle
                cx={ROSETTE.cx}
                cy={ROSETTE.cy}
                r={ROSETTE.haloRadius}
                fill={HALO}
              />
              {bottomText &&
                ROSETTE.ribbon.haloPaths.map((d) => (
                  <path key={d} d={d} fill={HALO} />
                ))}
            </g>
            {/* Notched ribbon wings tucked behind the circle */}
            {bottomText && (
              <>
                {ROSETTE.ribbon.wingPaths.map((d) => (
                  <path
                    key={d}
                    d={d}
                    fill={duotone.accent}
                    stroke={duotone.ink}
                    strokeWidth={3}
                    strokeLinejoin="round"
                  />
                ))}
                {ROSETTE.ribbon.foldPaths.map((d) => (
                  <path key={d} d={d} fill={darkenHex(duotone.ink, 0.35)} />
                ))}
              </>
            )}
            {/* Ink body */}
            <circle
              cx={ROSETTE.cx}
              cy={ROSETTE.cy}
              r={ROSETTE.bodyRadius}
              fill={duotone.ink}
            />
            {/* Cream pinstripe inside the rim */}
            <circle
              cx={ROSETTE.cx}
              cy={ROSETTE.cy}
              r={ROSETTE.pinstripeRadius}
              fill="none"
              stroke={duotone.cream}
              strokeWidth={1.5}
              opacity={0.55}
            />
            {/* Accent ring around the inner disc */}
            <circle
              cx={ROSETTE.cx}
              cy={ROSETTE.cy}
              r={ROSETTE.ringRadius}
              fill="none"
              stroke={duotone.accent}
              strokeWidth={2.5}
            />
            {/* Cream inner disc */}
            <circle
              cx={ROSETTE.cx}
              cy={ROSETTE.cy}
              r={ROSETTE.discRadius}
              fill={duotone.cream}
            />
            {IconComponent && (
              <StickerIcon
                icon={IconComponent}
                iconKey={config.iconName}
                fit={ROSETTE_ICON_FIT}
                duotone={duotone}
              />
            )}
            {topText && (
              <text
                fontSize={fitFontSize(topText, 10.5, ARC_LENGTH.rosetteTop)}
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
            {ROSETTE.dots.map((dot) => (
              <circle
                key={`${dot.cx}-${dot.cy}`}
                cx={dot.cx}
                cy={dot.cy}
                r={2.6}
                fill={duotone.accent}
              />
            ))}
            {/* Sagging front band carrying the bottom text */}
            {bottomText && (
              <>
                <path d={ROSETTE.ribbon.bandPath} fill={duotone.ink} />
                <text
                  x={100}
                  y={ROSETTE.ribbon.textY}
                  fontSize={fitFontSize(
                    bottomText,
                    9,
                    ROSETTE.ribbon.textTrack,
                  )}
                  fontWeight={700}
                  letterSpacing={2}
                  fill={duotone.cream}
                  textAnchor="middle"
                >
                  {bottomText}
                </text>
              </>
            )}
          </g>
        )}
      </svg>
    );
  },
);
