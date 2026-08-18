"use client";

import { useReducer, useRef, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { BadgeConfig } from "@/lib/types";
import { MAX_TOP_TEXT, MAX_BOTTOM_TEXT } from "@/lib/types";
import { BadgeSVG } from "./badge-svg";
import { BadgeControls } from "./badge-controls";
import { DownloadButton } from "./download-button";
import { ShareButtons } from "./share-buttons";
import { ICON_MAP } from "@/lib/icon-data";
import { resolveDuotone } from "@/lib/badge-colors";
import {
  parseConfigFromParams,
  buildShareUrl,
  syncUrlToConfig,
} from "@/lib/url-state";

const defaultConfig: BadgeConfig = {
  topText: "Achievement",
  bottomText: "",
  iconName: "star",
  color: { kind: "tier", tier: "gold" },
  shape: "circle",
};

function configReducer(
  state: BadgeConfig,
  action: Partial<BadgeConfig>,
): BadgeConfig {
  const next = { ...state, ...action };
  // Clamp so text can never overflow the arcs, wherever it came from.
  next.topText = next.topText.slice(0, MAX_TOP_TEXT);
  next.bottomText = next.bottomText.slice(0, MAX_BOTTOM_TEXT);
  return next;
}

function BadgeBuilderInner() {
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);
  const [config, dispatch] = useReducer(configReducer, defaultConfig);
  const svgRef = useRef<SVGSVGElement>(null);
  const iconEntry = ICON_MAP[config.iconName];

  // Read URL params on mount to set initial config
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const fromUrl = parseConfigFromParams(searchParams);
    if (Object.keys(fromUrl).length > 0) {
      dispatch(fromUrl);
    }
  }, [searchParams]);

  // Sync URL whenever config changes (after initial load).
  // Debounced: Safari rate-limits history.replaceState and throws
  // when it fires on every keystroke.
  useEffect(() => {
    if (!initializedRef.current) return;
    const timer = setTimeout(() => syncUrlToConfig(config), 300);
    return () => clearTimeout(timer);
  }, [config]);

  const handleChange = useCallback(
    (updates: Partial<BadgeConfig>) => {
      dispatch(updates);
    },
    [],
  );

  const shareUrl = buildShareUrl(config);

  return (
    <section
      id="builder"
      className="section-padding px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Controls Panel */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <BadgeControls config={config} onChange={handleChange} />
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div
                  className="absolute inset-0 blur-3xl opacity-20 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${resolveDuotone(config.color).accent}, transparent)`,
                  }}
                />
                <BadgeSVG ref={svgRef} config={config} size={280} />
              </div>

              <div className="text-center space-y-1 mb-6">
                <h3 className="heading-md">
                  {config.topText || "Untitled Badge"}
                </h3>
                {iconEntry && (
                  <p className="body-sm text-muted-foreground">
                    Icon: {iconEntry.name}
                  </p>
                )}
              </div>

              <div className="w-full max-w-xs">
                <DownloadButton
                  svgRef={svgRef}
                  filename={config.topText || "badge"}
                />
              </div>

              <div className="w-full max-w-xs mt-4 pt-4 border-t border-border">
                <ShareButtons svgRef={svgRef} shareUrl={shareUrl} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BadgeBuilder() {
  return (
    <Suspense>
      <BadgeBuilderInner />
    </Suspense>
  );
}
