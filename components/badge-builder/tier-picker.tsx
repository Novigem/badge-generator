"use client";

import type { BadgeTier } from "@/lib/types";
import { BADGE_COLORS, TIER_LABELS } from "@/lib/badge-colors";
import { cn } from "@/lib/utils";

interface TierPickerProps {
  selected: BadgeTier;
  onSelect: (tier: BadgeTier) => void;
}

const tiers: BadgeTier[] = ["bronze", "silver", "gold", "ruby", "emerald"];

export function TierPicker({ selected, onSelect }: TierPickerProps) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Badge tier">
      {tiers.map((tier) => {
        const colors = BADGE_COLORS[tier];
        const isSelected = selected === tier;

        return (
          <button
            key={tier}
            onClick={() => onSelect(tier)}
            role="radio"
            aria-checked={isSelected}
            aria-label={TIER_LABELS[tier]}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 transition-all duration-200 border-2 flex-1",
              isSelected
                ? "border-primary shadow-card-hover"
                : "border-border hover:border-primary/30",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full transition-transform duration-200",
                isSelected && "scale-110",
              )}
              style={{
                background: `radial-gradient(circle at 35% 35%, ${colors.light}, ${colors.mid}, ${colors.outer})`,
                boxShadow: isSelected
                  ? `0 0 0 3px ${colors.mid}40, 0 2px 8px ${colors.shadow}`
                  : `0 1px 3px ${colors.shadow}`,
              }}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {TIER_LABELS[tier]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
