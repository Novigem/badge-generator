"use client";

import { ArrowRight, ExternalLink, Linkedin } from "lucide-react";

function XIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200/70 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* CTA banner */}
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 p-10 text-center text-white shadow-xl">
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
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-gray-900 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 hover:bg-gray-50 active:translate-y-0 active:shadow-md"
              >
                Learn more about Novigem
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-sm text-gray-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} · Novigem. All badges generated
            client-side · no data stored.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://novigem.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              novigem.com
            </a>
            <a
              href="https://www.linkedin.com/company/novigem/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
              className="inline-flex items-center gap-1 rounded-full outline-none hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Linkedin className="h-4 w-4" />
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://x.com/novigem"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X/Twitter (opens in a new tab)"
              className="inline-flex items-center gap-1 rounded-full outline-none hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <XIcon />
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
