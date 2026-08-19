/**
 * Generates lib/icon-bboxes.ts: the true drawn bounding box of every
 * icon in lib/icon-data.ts, measured once at build time so the badge
 * renderer can center and scale icons deterministically at runtime.
 *
 * How it works:
 * 1. Parses the icon registry in lib/icon-data.ts (key -> lucide export).
 * 2. Renders each icon to static SVG markup with react-dom/server.
 * 3. Loads all of them in headless Chrome and measures getBBox() per icon,
 *    plus the max radial extent r: the farthest sampled point on any drawn
 *    stroke from the bbox center. The arch's dash fan sits on a circle
 *    around the icon anchor, so r (not the axis-aligned box) is what
 *    decides whether a diagonally drawn icon like the rocket pokes into it.
 * 4. Pads box and radius for stroke extents: the renderer's widest pass is
 *    the 3.6-unit ink stroke, so half of that plus a little extra for the
 *    round caps is added on every side (2.2 units total per side).
 * 5. Writes the map to lib/icon-bboxes.ts.
 *
 * Run it whenever icons are added to or removed from the registry:
 *   node scripts/generate-icon-bboxes.mjs
 *
 * Requires Google Chrome. Override the binary with CHROME_BIN if needed.
 */

import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as lucide from "lucide-react";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const CHROME =
  process.env.CHROME_BIN ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** Ink stroke is 3.6 units wide with round caps: 1.8 + 0.4 cap allowance. */
const STROKE_PAD = 2.2;

// 1. Parse the registry: { name: "...", key: "...", component: Ident, ... }
const source = readFileSync(join(root, "lib/icon-data.ts"), "utf8");
const entryPattern = /key:\s*"([^"]+)",\s*component:\s*([A-Za-z0-9]+)/g;
const entries = [...source.matchAll(entryPattern)].map((match) => ({
  key: match[1],
  exportName: match[2],
}));
if (entries.length === 0) {
  throw new Error("No icon entries found in lib/icon-data.ts");
}

// 2. Render every icon to static SVG markup.
const blocks = entries.map(({ key, exportName }) => {
  const Icon = lucide[exportName];
  if (!Icon) {
    throw new Error(`lucide-react has no export named ${exportName}`);
  }
  const svg = renderToStaticMarkup(createElement(Icon, { size: 24 }));
  return `<div data-key="${key}">${svg}</div>`;
});

// 3. Measure every icon's getBBox in headless Chrome. The page writes
//    the results as JSON into a <pre>, which --dump-dom captures.
const html = `<!doctype html><meta charset="utf-8">
${blocks.join("\n")}
<pre id="out"></pre>
<script>
const out = {};
for (const wrapper of document.querySelectorAll("div[data-key]")) {
  const svg = wrapper.querySelector("svg");
  const box = svg.getBBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  let r = 0;
  for (const el of svg.querySelectorAll(
    "path, line, polyline, polygon, circle, ellipse, rect",
  )) {
    const total = el.getTotalLength();
    const steps = Math.max(64, Math.ceil(total * 8));
    for (let i = 0; i <= steps; i++) {
      const p = el.getPointAtLength((total * i) / steps);
      r = Math.max(r, Math.hypot(p.x - cx, p.y - cy));
    }
  }
  out[wrapper.dataset.key] = {
    x: box.x, y: box.y, w: box.width, h: box.height, r,
  };
}
document.getElementById("out").textContent = JSON.stringify(out);
</script>`;

const workDir = mkdtempSync(join(tmpdir(), "icon-bboxes-"));
const pagePath = join(workDir, "measure.html");
writeFileSync(pagePath, html);

let dom;
try {
  dom = execFileSync(
    CHROME,
    ["--headless=new", "--disable-gpu", "--no-sandbox", "--dump-dom", pagePath],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

const jsonMatch = /<pre id="out">([\s\S]*?)<\/pre>/.exec(dom);
if (!jsonMatch || !jsonMatch[1].trim()) {
  throw new Error("Headless Chrome produced no measurements");
}
const measured = JSON.parse(jsonMatch[1]);

// 4. Pad for stroke extents and round to two decimals.
const round = (value) => Math.round(value * 100) / 100;
const lines = entries.map(({ key }) => {
  const box = measured[key];
  if (!box) {
    throw new Error(`No measurement captured for icon "${key}"`);
  }
  const x = round(box.x - STROKE_PAD);
  const y = round(box.y - STROKE_PAD);
  const w = round(box.w + STROKE_PAD * 2);
  const h = round(box.h + STROKE_PAD * 2);
  const r = round(box.r + STROKE_PAD);
  return `  "${key}": { x: ${x}, y: ${y}, w: ${w}, h: ${h}, r: ${r} },`;
});

// 5. Write the TypeScript map.
const output = `/**
 * GENERATED FILE. Do not edit by hand.
 *
 * True drawn bounding box of every icon in lib/icon-data.ts, measured
 * in the icon's own 24x24 viewBox units via getBBox in headless Chrome,
 * padded ${STROKE_PAD} units per side for the renderer's ink stroke.
 * r is the max radial extent of the drawn strokes from the box center,
 * with the same stroke padding. Regenerate after changing the registry:
 *   node scripts/generate-icon-bboxes.mjs
 */

export interface IconBBox {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Max distance of any drawn point from the box center. */
  r: number;
}

export const ICON_BBOXES: Record<string, IconBBox> = {
${lines.join("\n")}
};
`;

writeFileSync(join(root, "lib/icon-bboxes.ts"), output);
console.log(`Wrote lib/icon-bboxes.ts with ${entries.length} icons.`);
