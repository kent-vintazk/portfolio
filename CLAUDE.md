# CLAUDE.md — Portfolio Project Guide

## Project Overview
A personal portfolio website built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Design Vision
Inspired by [sirnik.co](https://www.sirnik.co) and [kookie-kollective.com](https://www.kookie-kollective.com).
The goal is **dark luxury minimalism with editorial sophistication**.

### Core Aesthetic Principles
- **Dark-first**: Pure black (#000) or near-black backgrounds. No light mode.
- **High contrast**: White text on black. Sparse use of one accent color only.
- **Restraint over decoration**: Let whitespace, typography, and motion do the work. No gradients, no busy patterns.
- **Editorial feel**: Large bold type, deliberate hierarchy, magazine-like section pacing.
- **Smooth, intentional motion**: Every animation must feel purposeful — no gratuitous effects.

### Color Palette
| Token         | Value              | Usage                        |
|---------------|--------------------|------------------------------|
| `--bg`        | `#000000`          | Page background              |
| `--fg`        | `#ffffff`          | Primary text                 |
| `--fg-muted`  | `rgba(255,255,255,0.35)` | Secondary/body text    |
| `--accent`    | `#4d65ff`          | Links, focus rings, highlights |

### Typography
- **Font**: Geist Sans (already installed) — clean, modern sans-serif
- **Headings**: Bold/Black weight, large (`clamp(2.5rem, 8vw, 6rem)`), tight tracking
- **Body**: Regular weight, `rgba(255,255,255,0.35)` muted color, generous line-height (1.6+)
- **Case**: Uppercase sparingly (splash screen, nav labels). Sentence case everywhere else.
- **Letter-spacing**: Tight on headings (`-0.02em`), normal on body

### Animation & Motion
- **Library target**: GSAP + ScrollTrigger (install when implementing scroll animations)
- **Entry animations**: Fade-in + translateY(18px) + slight blur, staggered for lists
- **Text reveals**: Clip/mask upward reveal (`yPercent: 120 → 0`)
- **Page transitions**: Overlay slide-up (already in KENTO_O splash)
- **Hover effects**: Subtle color shifts, underline scaleX transforms, image reveals on cursor
- **Easing**: `power3.out` or `cubic-bezier(0.76, 0, 0.24, 1)` — organic, not mechanical
- **Durations**: 0.35s–0.95s range. Never instant, never sluggish.

### Layout Principles
- **Max-width container**: 1200px centered, generous horizontal padding
- **Full-bleed sections**: Hero, images, and dividers go edge-to-edge
- **Vertical rhythm**: Large section padding (120px–160px) for breathing room
- **Grid**: CSS Grid for project cards (auto-fill, min 350px). Flexbox for nav/footer.
- **Mobile**: Stack gracefully. Hamburger nav with slide-in overlay + backdrop blur.

### Component Style Guide
| Component     | Style                                                        |
|---------------|--------------------------------------------------------------|
| **Navbar**    | Fixed, transparent bg with backdrop-blur. Logo left, links right. Minimal. |
| **Buttons**   | Text-based CTAs with animated underlines. No filled buttons except primary CTA. |
| **Cards**     | Subtle border (`white/10`), no background fill. Hover reveals accent border. |
| **Links**     | Muted white → white on hover. Underline via scaleX transform. |
| **Images**    | Full-bleed or contained with reveal-on-scroll. Slight scale on hover. |
| **Dividers**  | `border-white/10` — thin, quiet separators.                  |

---

## Project Structure
```
src/
├── app/
│   ├── layout.tsx           # Root layout (Navbar + Footer wrap all pages)
│   ├── page.tsx             # Home — splash → hero → work → skills → CTA
│   ├── globals.css          # Tailwind base + design tokens + component classes
│   ├── about/page.tsx       # Bio, experience timeline, education
│   ├── projects/page.tsx    # Full project grid
│   └── contact/page.tsx     # Contact form + social links
├── components/
│   ├── KENTO_O.tsx          # Splash/intro overlay animation
│   ├── Navbar.tsx           # Fixed nav with mobile hamburger
│   ├── Footer.tsx           # Footer with nav + socials
│   ├── Hero.tsx             # Full-screen hero section
│   └── ProjectCard.tsx      # Project card with tags + links
```

## Tech Stack
- **Framework**: Next.js 16 (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Fonts**: Geist Sans + Geist Mono (via `next/font/google`)
- **Animations**: CSS transitions now; GSAP + ScrollTrigger planned

---

## Future Work Roadmap

### Phase 1 — Visual Overhaul (COMPLETED)
- [x] Update color palette: pure black `#000` + `#4d65ff` accent + muted text `rgba(255,255,255,0.35)`
- [x] Restyle Navbar: transparent bg, removed "Hire Me" button, uppercase links with underline animation
- [x] Redesign Hero: removed stats/badge/gradient, large `clamp(3rem,10vw,7rem)` bold type, clean layout
- [x] Restyle cards: transparent bg, border-only, accent border on hover
- [x] Restyle buttons: `.link-underline` class with scaleX animated underlines, single `.btn-primary` CTA
- [x] Add scroll-triggered fade-in animations: `.fade-in-up` + `.stagger-children` CSS classes
- [x] Update Footer: single-line with copyright + social links, `.link-underline` style

### Phase 2 — Motion & Interactions (COMPLETED)
- [x] Install GSAP + ScrollTrigger (`gsap` package)
- [x] `ScrollAnimations.tsx` — global GSAP controller using `data-reveal`, `data-reveal-blur`, `data-reveal-heading`, `data-reveal-stagger` attributes
- [x] Hero text reveal: line-by-line clip-path animation with staggered timing (waits for KENTO_O splash)
- [x] Scroll-triggered card/element reveals with blur-to-clear + fade + translateY via ScrollTrigger
- [x] Cursor-tracking glow effect on ProjectCard (radial gradient follows mouse position)
- [x] `PageTransition.tsx` — accent-colored scaleY wipe overlay on route changes
- [x] `ExperienceTimeline.tsx` — horizontal scroll pinned timeline on About page (GSAP ScrollTrigger pin + scrub)

### Phase 3 — Content & Polish (IN PROGRESS)
- [ ] Replace placeholder text with real content (name, bio, projects, socials) — **waiting on user input**
- [x] Project images: `ProjectCard` now accepts `image` prop, uses `next/image` with hover scale. Place images in `public/images/projects/`
- [x] Contact form: `ContactForm.tsx` client component → `POST /api/contact` API route (add Resend/SMTP in `src/app/api/contact/route.ts`)
- [x] Resume: `public/` directory ready — drop `resume.pdf` into `public/`
- [x] OG images: `opengraph-image.tsx` auto-generates branded OG image at build time
- [x] SEO: `sitemap.ts`, `robots.ts`, `JsonLd.tsx` (Person schema) all added

### Phase 4 — Advanced Features (COMPLETED)
- [x] Blog: `/blog` listing page + `/blog/[slug]` dynamic detail pages with MDX rendering via `next-mdx-remote`
- [x] Project detail pages: `/projects/[slug]` with long descriptions (data from `src/data/projects.ts`)
- [x] Theme toggle: `ThemeProvider` (next-themes) + `ThemeToggle` button in Navbar. Light/dark modes with CSS vars
- [x] Analytics: Vercel Analytics injected in layout via `<Analytics />`
- [x] Vercel config: `vercel.json` with Next.js framework preset
- [ ] Performance audit: Lighthouse 95+ on all metrics (next: run `npm run build && npm run start` then audit)
- [ ] Deploy: push to GitHub, connect to Vercel, set custom domain in Vercel dashboard

---

## Commands
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # Run ESLint
```

## Conventions
- All components use TypeScript (`.tsx`)
- App Router file-based routing (`app/` directory)
- Path alias: `@/*` maps to `./src/*`
- Client components use `"use client"` directive at top
- Tailwind for all styling — no CSS modules, no styled-components
- Prefer server components by default; only use client when state/interactivity is needed
