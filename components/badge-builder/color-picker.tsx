"use client";

import type { BadgeColor } from "@/lib/types";
import {
  COLOR_PRESETS,
  resolvePalette,
  isSameColor,
} from "@/lib/badge-colors";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  selected: BadgeColor;
  onSelect: (color: BadgeColor) => void;
}

const HEX_PATTERN = /^#[0-9a-f]{6}$/i;

export function ColorPicker({ selected, onSelect }: ColorPickerProps) {
  const selectedPalette = resolvePalette(selected);
  const isPreset = COLOR_PRESETS.some((preset) =>
    isSameColor(selected, preset.color),
  );
  const currentHex =
    selected.kind === "custom" ? selected.hex : selectedPalette.mid;

  const handleCustomChange = (value: string) => {
    if (!HEX_PATTERN.test(value)) return;
    onSelect({ kind: "custom", hex: value.toLowerCase() });
  };

  return (
    <div className="space-y-3">
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Badge color"
      >
        {COLOR_PRESETS.map((preset) => {
          const colors = resolvePalette(preset.color);
          const isSelected = isSameColor(selected, preset.color);

          return (
            <button
              key={preset.key}
              onClick={() => onSelect(preset.color)}
              role="radio"
              aria-checked={isSelected}
              aria-label={preset.label}
              title={preset.label}
              className={cn(
                "flex items-center justify-center rounded-xl p-1.5 transition-all duration-200 border-2",
                isSelected
                  ? "border-primary shadow-card-hover"
                  : "border-border hover:border-primary/30",
              )}
            >
              <span
                className={cn(
                  "block w-7 h-7 rounded-full transition-transform duration-200",
                  isSelected && "scale-110",
                )}
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${colors.light}, ${colors.mid}, ${colors.outer})`,
                  boxShadow: isSelected
                    ? `0 0 0 3px ${colors.mid}40, 0 2px 8px ${colors.shadow}`
                    : `0 1px 3px ${colors.shadow}`,
                }}
              />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <label
          htmlFor="custom-badge-color"
          className={cn(
            "flex items-center justify-center rounded-xl p-1 transition-all duration-200 border-2 cursor-pointer",
            !isPreset
              ? "border-primary shadow-card-hover"
              : "border-border hover:border-primary/30",
          )}
        >
          <input
            id="custom-badge-color"
            type="color"
            value={currentHex.toLowerCase()}
            onChange={(e) => handleCustomChange(e.target.value)}
            aria-label="Custom color"
            className="w-8 h-8 cursor-pointer rounded-lg border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-lg [&::-moz-color-swatch]:border-0"
          />
        </label>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">
            Custom color
          </span>
          <span className="text-xs font-mono text-foreground">
            {currentHex.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
