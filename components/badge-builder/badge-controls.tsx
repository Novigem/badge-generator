"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPicker } from "./icon-picker";
import { ShapePicker } from "./shape-picker";
import { TierPicker } from "./tier-picker";
import type { BadgeConfig, BadgeTier, BadgeShape } from "@/lib/types";

interface BadgeControlsProps {
  config: BadgeConfig;
  onChange: (updates: Partial<BadgeConfig>) => void;
}

export function BadgeControls({ config, onChange }: BadgeControlsProps) {
  return (
    <div className="space-y-6">
      {/* Badge Name */}
      <div className="space-y-2">
        <Label htmlFor="badge-name" className="heading-sm">
          Badge Name
        </Label>
        <Input
          id="badge-name"
          placeholder="e.g. First Steps"
          value={config.name}
          onChange={(e) => onChange({ name: e.target.value.slice(0, 50) })}
          className="rounded-lg"
          maxLength={50}
        />
        <p className="text-xs text-muted-foreground">
          {config.name.length}/50 characters
        </p>
      </div>

      {/* Shape */}
      <div className="space-y-2">
        <Label className="heading-sm">Shape</Label>
        <ShapePicker
          selected={config.shape}
          onSelect={(shape: BadgeShape) => onChange({ shape })}
        />
      </div>

      {/* Tier / Color */}
      <div className="space-y-2">
        <Label className="heading-sm">Color Tier</Label>
        <TierPicker
          selected={config.tier}
          onSelect={(tier: BadgeTier) => onChange({ tier })}
        />
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <Label className="heading-sm">Icon</Label>
        <IconPicker
          selectedKey={config.iconName}
          onSelect={(iconName: string) => onChange({ iconName })}
        />
      </div>

    </div>
  );
}
