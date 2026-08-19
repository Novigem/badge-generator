/**
 * Export utilities for downloading badge SVGs as SVG or PNG files.
 * Uses blob URLs (revoked after use) to avoid data-URI size limits.
 */

export function downloadSVG(svgEl: SVGSVGElement, filename: string): void {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  triggerDownload(blob, `${filename}.svg`);
}

/**
 * Rasterizes an SVG element to a PNG blob at the given scale.
 * Shared by PNG download and native sharing.
 */
export function svgToPngBlob(
  svgEl: SVGSVGElement,
  scale = 2,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const blob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          reject(new Error("Could not create PNG blob"));
          return;
        }
        resolve(pngBlob);
      }, "image/png");
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG as image"));
    };

    img.src = url;
  });
}

export async function downloadPNG(
  svgEl: SVGSVGElement,
  filename: string,
  scale = 2,
): Promise<void> {
  const pngBlob = await svgToPngBlob(svgEl, scale);
  triggerDownload(pngBlob, `${filename}.png`);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
