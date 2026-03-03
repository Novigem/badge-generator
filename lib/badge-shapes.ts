import type { BadgeShape } from "./types";

/** All paths are in a 200×200 viewBox, centered at (100,100). */

// Hexagon: pointy-top orientation
const HEXAGON_OUTER =
  "M100,10 L183,50 L183,150 L100,190 L17,150 L17,50 Z";
const HEXAGON_INNER =
  "M100,30 L167,62 L167,138 L100,170 L33,138 L33,62 Z";

// Shield: slim, tall, gentle top arch, angular shoulders, straight sides, smooth bottom point
const SHIELD_OUTER =
  "M24,34 Q62,10 100,10 Q138,10 176,34 L176,124 Q176,172 100,196 Q24,172 24,124 Z";
const SHIELD_INNER =
  "M40,48 Q66,28 100,28 Q134,28 160,48 L160,118 Q160,158 100,178 Q40,158 40,118 Z";

export interface ShapeConfig {
  type: "path" | "circle";
  outerPath?: string;
  innerPath?: string;
  outerRadius?: number;
  innerRadius?: number;
}

export const SHAPES: Record<BadgeShape, ShapeConfig> = {
  hexagon: {
    type: "path",
    outerPath: HEXAGON_OUTER,
    innerPath: HEXAGON_INNER,
  },
  circle: {
    type: "circle",
    outerRadius: 90,
    innerRadius: 70,
  },
  shield: {
    type: "path",
    outerPath: SHIELD_OUTER,
    innerPath: SHIELD_INNER,
  },
};

export const SHAPE_LABELS: Record<BadgeShape, string> = {
  hexagon: "Hexagon",
  circle: "Circle",
  shield: "Shield",
};
