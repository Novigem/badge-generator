"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share2 } from "lucide-react";

const SHARE_TEXT =
  "I just designed a custom achievement badge with Badge Builder by @novaborsa — try it free!";

interface ShareButtonsProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  shareUrl: string;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ShareButtons({ svgRef, shareUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(!!navigator.share);
  }, []);

  const shareOnX = useCallback(() => {
    const url = new URL("https://x.com/intent/tweet");
    url.searchParams.set("text", SHARE_TEXT);
    url.searchParams.set("url", shareUrl);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }, [shareUrl]);

  const shareOnLinkedIn = useCallback(() => {
    const url = new URL("https://www.linkedin.com/shareArticle");
    url.searchParams.set("mini", "true");
    url.searchParams.set("url", shareUrl);
    url.searchParams.set("title", "Badge Builder by Novigem");
    url.searchParams.set("summary", SHARE_TEXT);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }, [shareUrl]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: prompt user
    }
  }, [shareUrl]);

  const nativeShare = useCallback(async () => {
    if (!svgRef.current || !navigator.share) return;

    try {
      // Convert SVG to PNG blob for sharing
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgRef.current);
      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const blobUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = blobUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth * 2;
      canvas.height = img.naturalHeight * 2;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(blobUrl);

      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject();
        }, "image/png");
      });

      const file = new File([pngBlob], "badge.png", { type: "image/png" });

      await navigator.share({
        title: "My Custom Badge",
        text: SHARE_TEXT,
        url: shareUrl,
        files: [file],
      });
    } catch {
      // User cancelled or share failed — try without file
      try {
        await navigator.share({
          title: "My Custom Badge",
          text: SHARE_TEXT,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    }
  }, [svgRef, shareUrl]);

  return (
    <div className="space-y-3">
      <p className="label-text text-center">Share your badge</p>
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={shareOnX}
          aria-label="Share on X"
          className="btn-interactive"
        >
          <XIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={shareOnLinkedIn}
          aria-label="Share on LinkedIn"
          className="btn-interactive"
        >
          <LinkedInIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={copyLink}
          aria-label={copied ? "Link copied" : "Copy link"}
          className="btn-interactive"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        {canNativeShare && (
          <Button
            variant="outline"
            size="icon"
            onClick={nativeShare}
            aria-label="Share"
            className="btn-interactive"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
