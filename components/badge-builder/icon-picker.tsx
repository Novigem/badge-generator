"use client";

import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { ICON_REGISTRY } from "@/lib/icon-data";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  selectedKey: string;
  onSelect: (key: string) => void;
}

const COLUMN_COUNT = 8;
const VISIBLE_ROWS = 5;

export function IconPicker({ selectedKey, onSelect }: IconPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return ICON_REGISTRY;
    const q = query.toLowerCase();
    return ICON_REGISTRY.filter(
      (icon) =>
        icon.name.toLowerCase().includes(q) ||
        icon.tags.some((t) => t.includes(q)),
    );
  }, [query]);

  const handleSelect = useCallback(
    (key: string) => {
      onSelect(key);
    },
    [onSelect],
  );

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search icons..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="rounded-lg"
        aria-label="Search icons"
      />
      <div
        className="border border-border rounded-xl overflow-y-auto bg-background"
        style={{ maxHeight: `${VISIBLE_ROWS * 48}px` }}
        role="listbox"
        aria-label="Icon selection"
      >
        <div
          className="grid gap-1 p-2"
          style={{
            gridTemplateColumns: `repeat(${COLUMN_COUNT}, 1fr)`,
          }}
        >
          {filtered.map((icon) => {
            const IconComponent = icon.component;
            const isSelected = icon.key === selectedKey;

            return (
              <button
                key={icon.key}
                onClick={() => handleSelect(icon.key)}
                role="option"
                aria-selected={isSelected}
                aria-label={`Select ${icon.name} icon`}
                title={icon.name}
                className={cn(
                  "flex items-center justify-center rounded-lg p-2 transition-colors duration-150",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <IconComponent size={18} strokeWidth={1.75} />
              </button>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No icons found for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
