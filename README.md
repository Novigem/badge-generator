# Badge Builder by Novigem

A free, client-side tool for designing custom achievement badges in a flat curved-text sticker style. Add your text, pick a shape, colour, and icon, then download as transparent PNG or SVG.

**[badges.novigem.com](https://badges.novigem.com)**

---

## Features

- **4 badge shapes** · circle, arch, star, and rosette, drawn as flat die-cut stickers with curved text
- **Two text lines** · uppercase top text on the arc plus an optional bottom line (curved on the circle, a small caps line on the arch and star, a ribbon banner on the rosette)
- **Any colour** · 9 presets (bronze, silver, gold, ruby, emerald, blue, teal, orange, black) plus a free colour picker; each base colour maps to a duotone of ink, accent, and cream
- **108 curated icons** · sourced from Lucide
- **High-res export** · transparent PNG at 2x resolution and SVG
- **Shareable URLs** · badge configuration encoded in URL params so you can share a direct link to your design
- **Social sharing** · share on X, LinkedIn, copy link, or use the native Web Share API on mobile
- **Privacy-first** · 100% client-side rendering, no data stored, no sign-up required

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) · React 19 · TypeScript |
| Styling | Tailwind CSS v4 · shadcn/ui (new-york style) |
| Animation | Framer Motion |
| Icons | Lucide React (108 achievement-relevant icons) |
| Hosting | Vercel |

---

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

After adding or removing icons in `lib/icon-data.ts`, run `node scripts/generate-icon-bboxes.mjs` to regenerate the icon bounding-box map used for icon placement.

---

## Project Structure

```
app/
  page.tsx                  # Main landing page (Hero + Builder + Footer)
  layout.tsx                # Root layout with Geist fonts and metadata
  globals.css               # Design tokens and utility classes

components/
  badge-builder/            # Core builder components
    badge-svg.tsx            # Flat sticker SVG renderer with curved textPath arcs
    badge-controls.tsx       # Text, shape, colour, and icon controls
    badge-builder.tsx        # Main container with URL state sync
    download-button.tsx      # PNG and SVG export
    share-buttons.tsx        # Social sharing (X, LinkedIn, copy, native)
    icon-picker.tsx          # Searchable icon grid
    shape-picker.tsx         # Visual shape selector
    color-picker.tsx         # Colour presets and custom colour input
  sections/
    hero.tsx                 # Animated hero section
    site-footer.tsx          # Footer with Novigem CTA and social links

lib/
  types.ts                  # BadgeConfig, BadgeColor, BadgeShape types
  badge-colors.ts           # Tier palettes, palette derivation, and duotone mapping
  badge-shapes.ts           # Sticker geometry: circle rings and arch paths, text arcs
  icon-data.ts              # Icon registry with search tags
  export.ts                 # SVG/PNG download utilities
  url-state.ts              # URL param serialisation and validation
  sanitize.ts               # XSS prevention for SVG exports
```

---

## Deployment

This site is deployed via [Vercel](https://vercel.com).
Push to the `main` branch automatically triggers a production build.

---

## Author

Built by [Novigem](https://novigem.com)
