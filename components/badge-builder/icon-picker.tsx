"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filtered = useMemo(() => {
    if (!query.trim()) return ICON_REGISTRY;
    const q = query.toLowerCase();
    return ICON_REGISTRY.filter(
      (icon) =>
        icon.name.toLowerCase().includes(q) ||
        icon.tags.some((t) => t.includes(q)),
    );
  }, [query]);

  // Keep the roving tabindex anchored on the selected icon when the
  // list changes, falling back to the first item.
  useEffect(() => {
    const selectedIdx = filtered.findIndex((icon) => icon.key === selectedKey);
    setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);
  }, [filtered, selectedKey]);

  const handleSelect = useCallback(
    (key: string) => {
      onSelect(key);
    },
    [onSelect],
  );

  const moveFocus = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(filtered.length - 1, nextIndex));
      setActiveIndex(clamped);
      buttonRefs.current[clamped]?.focus();
    },
    [filtered.length],
  );

  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (filtered.length === 0) return;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          moveFocus(activeIndex + 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          moveFocus(activeIndex - 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          moveFocus(activeIndex + COLUMN_COUNT);
          break;
        case "ArrowUp":
          e.preventDefault();
          moveFocus(activeIndex - COLUMN_COUNT);
          break;
        case "Home":
          e.preventDefault();
          moveFocus(0);
          break;
        case "End":
          e.preventDefault();
          moveFocus(filtered.length - 1);
          break;
      }
    },
    [activeIndex, filtered.length, moveFocus],
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
        onKeyDown={handleGridKeyDown}
      >
        <div
          className="grid gap-1 p-2"
          style={{
            gridTemplateColumns: `repeat(${COLUMN_COUNT}, 1fr)`,
          }}
        >
          {filtered.map((icon, index) => {
            const IconComponent = icon.component;
            const isSelected = icon.key === selectedKey;

            return (
              <button
                key={icon.key}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                onClick={() => handleSelect(icon.key)}
                onFocus={() => setActiveIndex(index)}
                role="option"
                aria-selected={isSelected}
                aria-label={`Select ${icon.name} icon`}
                title={icon.name}
                tabIndex={index === activeIndex ? 0 : -1}
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
