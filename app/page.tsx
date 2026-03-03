import { Hero } from "@/components/sections/hero";
import { BadgeBuilder } from "@/components/badge-builder/badge-builder";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <BadgeBuilder />
      <SiteFooter />
    </main>
  );
}
