"use client";

import { ArrowRight, ExternalLink, Linkedin } from "lucide-react";
import { XIcon } from "@/components/icons/x-icon";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background/70 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* CTA banner */}
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 p-10 text-center text-white shadow-xl dark:border dark:border-border">
          <div className="relative z-10">
            <h3 className="text-xl font-semibold md:text-2xl">
              Gamify your Salesforce team&apos;s performance
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/80">
              Novigem turns everyday CRM work into clear next steps, cleaner
              data, and steady progress · with habits that last.
            </p>
            <div className="mt-6">
              <a
                href="https://novigem.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-neutral-900 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 hover:bg-neutral-50 active:translate-y-0 active:shadow-md"
              >
                Learn more about Novigem
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} · Novigem. All badges generated
            client-side · no data stored.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://novigem.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              novigem.com
            </a>
            <a
              href="https://www.linkedin.com/company/novigem/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
              className="inline-flex items-center gap-1 rounded-full outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Linkedin className="h-4 w-4" />
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://x.com/novigem"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X/Twitter (opens in a new tab)"
              className="inline-flex items-center gap-1 rounded-full outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <XIcon className="h-4 w-4" />
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
