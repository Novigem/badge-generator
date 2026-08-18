"use client";

import type { BadgeShape } from "@/lib/types";
import { SHAPE_LABELS } from "@/lib/badge-shapes";
import { cn } from "@/lib/utils";

interface ShapePickerProps {
  selected: BadgeShape;
  onSelect: (shape: BadgeShape) => void;
}

const shapes: BadgeShape[] = ["circle", "arch"];

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
    </svg>
  );
}

export function ShapePicker({ selected, onSelect }: ShapePickerProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3"
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
