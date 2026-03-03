"use client";

import type { BadgeShape } from "@/lib/types";
import { SHAPE_LABELS } from "@/lib/badge-shapes";
import { cn } from "@/lib/utils";

interface ShapePickerProps {
  selected: BadgeShape;
  onSelect: (shape: BadgeShape) => void;
}

const shapes: BadgeShape[] = ["hexagon", "circle", "shield"];

function ShapePreview({ shape }: { shape: BadgeShape }) {
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10" aria-hidden="true">
      {shape === "hexagon" && (
        <path
          d="M20,2 L37,11 L37,29 L20,38 L3,29 L3,11 Z"
          fill="currentColor"
          opacity={0.7}
        />
      )}
      {shape === "circle" && (
        <circle cx="20" cy="20" r="16" fill="currentColor" opacity={0.7} />
      )}
      {shape === "shield" && (
        <path
          d="M7,10 Q13,4 20,4 Q27,4 33,10 L33,24 Q33,35 20,39 Q7,35 7,24 Z"
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
      className="grid grid-cols-3 gap-3"
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
