"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};
const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const noAnim = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const reduceMotion = useReducedMotion();
  const fade = reduceMotion ? noAnim : fadeInUp;
  const group = reduceMotion ? noAnim : stagger;

  return (
    <section className="relative isolate w-full overflow-hidden bg-neutral-50">
      {/* Soft radial background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200/30 via-emerald-200/20 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-24">
        <motion.div
          variants={group}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div
            variants={fade}
            className="mb-3 flex items-center justify-center text-xs font-medium tracking-wide text-muted-foreground"
          >
            A free tool by{" "}
            <a
              href="https://novigem.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-foreground hover:underline underline-offset-4"
            >
              Novigem
            </a>
          </motion.div>

          <motion.h1
            variants={fade}
            className="text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl"
          >
            Design Custom Achievement Badges
          </motion.h1>

          <motion.p
            variants={fade}
            className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-lg"
          >
            Pick a shape, colour, and icon. Download as PNG or SVG · free, no
            sign-up required.
          </motion.p>

          <motion.div
            variants={fade}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              asChild
              className="rounded-full cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Link href="#builder" className="gap-2">
                Start building <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fade}
            className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground"
          >
            <span className="rounded-full bg-foreground/5 px-2.5 py-0.5">
              100% client-side
            </span>
            <span className="rounded-full bg-foreground/5 px-2.5 py-0.5">
              No sign-up
            </span>
            <span className="rounded-full bg-foreground/5 px-2.5 py-0.5">
              Free forever
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
