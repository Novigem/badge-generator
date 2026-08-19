"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPicker } from "./icon-picker";
import { ShapePicker } from "./shape-picker";
import { ColorPicker } from "./color-picker";
import type { BadgeConfig, BadgeColor, BadgeShape } from "@/lib/types";
import { MAX_TOP_TEXT, MAX_BOTTOM_TEXT } from "@/lib/types";

interface BadgeControlsProps {
  config: BadgeConfig;
  onChange: (updates: Partial<BadgeConfig>) => void;
}

export function BadgeControls({ config, onChange }: BadgeControlsProps) {
  return (
    <div className="space-y-6">
      {/* Top text */}
      <div className="space-y-2">
        <Label htmlFor="badge-top-text" className="heading-sm">
          Top Text
        </Label>
        <Input
          id="badge-top-text"
          placeholder="e.g. Top Closer"
          value={config.topText}
          onChange={(e) =>
            onChange({ topText: e.target.value.slice(0, MAX_TOP_TEXT) })
          }
          className="rounded-lg"
          maxLength={MAX_TOP_TEXT}
        />
        <p className="text-xs text-muted-foreground">
          {config.topText.length}/{MAX_TOP_TEXT} characters · shown uppercase
          along the top arc
        </p>
      </div>

      {/* Bottom text */}
      <div className="space-y-2">
        <Label htmlFor="badge-bottom-text" className="heading-sm">
          Bottom Text
        </Label>
        <Input
          id="badge-bottom-text"
          placeholder="e.g. Sales · 2026 (optional)"
          value={config.bottomText}
          onChange={(e) =>
            onChange({ bottomText: e.target.value.slice(0, MAX_BOTTOM_TEXT) })
          }
          className="rounded-lg"
          maxLength={MAX_BOTTOM_TEXT}
        />
        <p className="text-xs text-muted-foreground">
          {config.bottomText.length}/{MAX_BOTTOM_TEXT} characters · leave empty
          to hide
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

      {/* Color */}
      <div className="space-y-2">
        <Label className="heading-sm">Color</Label>
        <ColorPicker
          selected={config.color}
          onSelect={(color: BadgeColor) => onChange({ color })}
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
