"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share2 } from "lucide-react";
import { XIcon } from "@/components/icons/x-icon";
import { svgToPngBlob } from "@/lib/export";

const SHARE_TEXT =
  "I just designed a custom achievement badge with Badge Builder by Novigem. Try it free!";

interface ShareButtonsProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  shareUrl: string;
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function isShareCancel(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

export function ShareButtons({ svgRef, shareUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy the link. Copy it from the address bar instead.");
    }
  }, [shareUrl]);

  const nativeShare = useCallback(async () => {
    if (!svgRef.current || !navigator.share) return;
    setError(null);

    try {
      const pngBlob = await svgToPngBlob(svgRef.current, 2);
      const file = new File([pngBlob], "badge.png", { type: "image/png" });

      await navigator.share({
        title: "My Custom Badge",
        text: SHARE_TEXT,
        url: shareUrl,
        files: [file],
      });
    } catch (err) {
      if (isShareCancel(err)) return;
      // Sharing with a file failed, retry without it
      try {
        await navigator.share({
          title: "My Custom Badge",
          text: SHARE_TEXT,
          url: shareUrl,
        });
      } catch (retryErr) {
        if (isShareCancel(retryErr)) return;
        setError("Sharing failed. Copy the link instead.");
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
            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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
      {error && (
        <p role="alert" className="text-xs text-destructive text-center">
          {error}
        </p>
      )}
    </div>
  );
}
