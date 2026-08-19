"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadSVG, downloadPNG } from "@/lib/export";
import { Download, Image, FileCode } from "lucide-react";

interface DownloadButtonProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  filename: string;
}

export function DownloadButton({ svgRef, filename }: DownloadButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const safeName = filename.replace(/[^a-zA-Z0-9_-]/g, "_") || "badge";

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    setError(null);
    downloadSVG(svgRef.current, safeName);
  };

  const handleDownloadPNG = async () => {
    if (!svgRef.current) return;
    setIsExporting(true);
    setError(null);
    try {
      await downloadPNG(svgRef.current, safeName, 2);
    } catch {
      setError("PNG export failed. Try again, or download the SVG.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          onClick={handleDownloadSVG}
          variant="outline"
          className="flex-1 btn-interactive"
          disabled={!svgRef.current}
        >
          <FileCode className="mr-2 h-4 w-4" />
          SVG
        </Button>
        <Button
          onClick={handleDownloadPNG}
          className="flex-1 btn-interactive"
          disabled={isExporting || !svgRef.current}
        >
          <Image className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "PNG"}
          {!isExporting && <Download className="ml-1 h-3 w-3" />}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive text-center">
          {error}
        </p>
      )}
    </div>
  );
}
