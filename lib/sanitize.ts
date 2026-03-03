/**
 * Sanitizes a string for safe embedding in SVG text/attributes.
 * React JSX auto-escapes, but this is a belt-and-suspenders measure
 * for when the SVG is serialized to string for download.
 */
export function sanitizeForSVG(input: string, maxLength = 100): string {
  return input
    .slice(0, maxLength)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}
