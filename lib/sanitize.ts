/**
 * Sanitizes user text for safe rendering inside the badge SVG.
 *
 * Entity escaping is deliberately left to the consumers: React escapes
 * JSX text nodes, and XMLSerializer escapes text nodes again when the
 * SVG is serialized for download. Pre-escaping here would double-escape
 * and display literal `&amp;` on the badge. This function only clamps
 * length and strips control characters that are invalid in XML.
 *
 * Note for export: the badge relies on `<defs><path>` + `<textPath>`
 * for curved text. Nothing in this module (or the export pipeline,
 * which serializes the live DOM) strips textPath, defs, or use
 * elements; keep it that way so downloaded SVGs stay intact.
 */
export function sanitizeForSVG(input: string, maxLength = 100): string {
  return input
    .slice(0, maxLength)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}
