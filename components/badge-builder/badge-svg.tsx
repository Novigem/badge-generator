"use client";

import React, { forwardRef, useId } from "react";
import type { BadgeConfig } from "@/lib/types";
import { BADGE_COLORS } from "@/lib/badge-colors";
import { SHAPES } from "@/lib/badge-shapes";
import { ICON_MAP } from "@/lib/icon-data";
import { sanitizeForSVG } from "@/lib/sanitize";

interface BadgeSVGProps {
  config: BadgeConfig;
  size?: number;
}

/**
 * Renders a shape element (circle or path) with the given fill and optional extras.
 */
function Shape({
  shape,
  variant,
  fill,
  filter,
  opacity,
  stroke,
  strokeWidth,
}: {
  shape: (typeof SHAPES)[keyof typeof SHAPES];
  variant: "outer" | "inner";
  fill: string;
  filter?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
}) {
  if (shape.type === "circle") {
    const r = variant === "outer" ? shape.outerRadius! : shape.innerRadius!;
    return (
      <circle
        cx="100"
        cy="100"
        r={r}
        fill={fill}
        filter={filter}
        opacity={opacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }
  const d = variant === "outer" ? shape.outerPath! : shape.innerPath!;
  return (
    <path
      d={d}
      fill={fill}
      filter={filter}
      opacity={opacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

export const BadgeSVG = forwardRef<SVGSVGElement, BadgeSVGProps>(
  function BadgeSVG({ config, size = 300 }, ref) {
    const reactId = useId();
    const uid = `b${reactId.replace(/:/g, "")}`;
    const colors = BADGE_COLORS[config.tier];
    const shape = SHAPES[config.shape];
    const iconEntry = ICON_MAP[config.iconName];
    const IconComponent = iconEntry?.component;

    return (
      <svg
        ref={ref}
        viewBox="0 0 200 210"
        width={size}
        height={size * 1.05}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${config.name || "Badge"} achievement badge`}
      >
        <title>{sanitizeForSVG(config.name || "Badge", 50)}</title>

        <defs>
          {/* ── Outer body gradient: bright top → saturated mid → dark bottom ── */}
          <linearGradient id={`${uid}-og`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.light} />
            <stop offset="50%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.outer} />
          </linearGradient>

          {/* ── Inner dish: radial gradient, brighter at upper-center ── */}
          <radialGradient id={`${uid}-ig`} cx="50%" cy="38%" r="65%">
            <stop offset="0%" stopColor={colors.light} />
            <stop offset="55%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.outer} stopOpacity="0.9" />
          </radialGradient>

          {/* ── Top highlight sheen across outer shape ── */}
          <linearGradient id={`${uid}-sh`} x1="0.2" y1="0" x2="0.5" y2="0.5">
            <stop offset="0%" stopColor="white" stopOpacity="0.30" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* ── Inner top shadow (concavity illusion) ── */}
          <linearGradient id={`${uid}-is`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="black" stopOpacity="0.18" />
            <stop offset="30%" stopColor="black" stopOpacity="0.06" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </linearGradient>

          {/* ── Inner bottom highlight (concavity rim light) ── */}
          <linearGradient id={`${uid}-bh`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.14" />
            <stop offset="25%" stopColor="white" stopOpacity="0.04" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* ── Outer bottom-edge stroke for 3D depth ── */}
          <linearGradient id={`${uid}-es`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="black" stopOpacity="0" />
            <stop offset="70%" stopColor="black" stopOpacity="0.06" />
            <stop offset="100%" stopColor="black" stopOpacity="0.18" />
          </linearGradient>

          {/* ── Soft colored glow behind the badge ── */}
          <filter id={`${uid}-gl`} x="-35%" y="-25%" width="170%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>

          {/* ── Crisp drop shadow below the badge ── */}
          <filter id={`${uid}-ds`} x="-15%" y="-10%" width="130%" height="135%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="6"
              floodColor={colors.shadow}
              floodOpacity="0.8"
            />
          </filter>
        </defs>

        <g transform="translate(0, 6)">
          {/* Layer 0: Soft colored glow behind the badge */}
          <Shape
            shape={shape}
            variant="outer"
            fill={colors.mid}
            filter={`url(#${uid}-gl)`}
            opacity={0.35}
          />

          {/* Layer 1: Outer body with drop shadow */}
          <Shape
            shape={shape}
            variant="outer"
            fill={`url(#${uid}-og)`}
            filter={`url(#${uid}-ds)`}
          />

          {/* Layer 2: Outer dark bottom-edge stroke for 3D extrusion */}
          <Shape
            shape={shape}
            variant="outer"
            fill="none"
            stroke={`url(#${uid}-es)`}
            strokeWidth={1.5}
          />

          {/* Layer 3: Sheen highlight on outer shape */}
          <Shape shape={shape} variant="outer" fill={`url(#${uid}-sh)`} />

          {/* Layer 4: Inner dish with radial gradient */}
          <Shape shape={shape} variant="inner" fill={`url(#${uid}-ig)`} />

          {/* Layer 5: Inner top shadow (concavity) */}
          <Shape shape={shape} variant="inner" fill={`url(#${uid}-is)`} />

          {/* Layer 6: Inner bottom rim highlight */}
          <Shape shape={shape} variant="inner" fill={`url(#${uid}-bh)`} />

          {/* Layer 7: Icon */}
          {IconComponent && (
            <IconComponent
              x={62}
              y={62}
              width={76}
              height={76}
              stroke={colors.icon}
              strokeWidth={1.5}
              fill={colors.icon}
              fillOpacity={0.2}
            />
          )}
        </g>
      </svg>
    );
  },
);
