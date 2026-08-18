"use client";

import type { BadgeShape } from "@/lib/types";
import { SHAPE_LABELS } from "@/lib/badge-shapes";
import { cn } from "@/lib/utils";

interface ShapePickerProps {
  selected: BadgeShape;
  onSelect: (shape: BadgeShape) => void;
}

const shapes: BadgeShape[] = ["circle", "arch", "star", "rosette"];

function ShapePreview({ shape }: { shape: BadgeShape }) {
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10" aria-hidden="true">
      {shape === "circle" && (
        <circle cx="20" cy="20" r="16" fill="currentColor" opacity={0.7} />
      )}
      {shape === "arch" && (
        <path
          d="M6,18 A14 14 0 0 1 34,18 L34,32 Q34,36 30,36 L10,36 Q6,36 6,32 Z"
          fill="currentColor"
          opacity={0.7}
        />
      )}
      {shape === "star" && (
        <path
          d="M20 3.5 L25 14 L36 15.5 L28 23.5 L30 34.5 L20 29 L10 34.5 L12 23.5 L4 15.5 L15 14 Z"
          fill="currentColor"
          opacity={0.7}
          strokeLinejoin="round"
          stroke="currentColor"
          strokeWidth={3}
        />
      )}
      {shape === "rosette" && (
        <g fill="currentColor" opacity={0.7}>
          <path d="M6 27 L34 27 L34 36 L6 36 L9 31.5 Z" />
          <circle cx="20" cy="17" r="14" />
        </g>
      )}
    </svg>
  );
}

export function ShapePicker({ selected, onSelect }: ShapePickerProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      role="radiogroup"
      aria-label="Badge shape"
    >
      {shapes.map((shape) => (
        <button
          key={shape}
          onClick={() => onSelect(shape)}
          role="radio"
          aria-checked={selected === shape}
          aria-label={SHAPE_LABELS[shape]}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl px-4 py-4 transition-all duration-200 border-2",
            selected === shape
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground",
          )}
        >
          <ShapePreview shape={shape} />
          <span className="text-xs font-medium">{SHAPE_LABELS[shape]}</span>
        </button>
      ))}
    </div>
  );
}
