# Design Brief — Spatial Chronography Clock App

## Purpose
Multi-functional spatial clock application for visionOS-inspired web environments. Provides World Clock, Alarm, Stopwatch, and Timer modules within a cohesive Liquid Glass interface optimized for dark environments with specular depth cues and tactile interactivity.

## Aesthetic
Deep dark glass with specular rim lighting, vibrancy text hierarchy, and premium material depth. Inspired by visionOS Liquid Glass but optimized for web using backdrop-filter blur, subtle noise dithering, and icy cyan-blue accent glows.

## Tone
Precision meets luxury. Premium spatial computing aesthetic with tactile glass interactions, not playful or skeuomorphic. Refined minimalism with selective decorative depth.

## Differentiation
Specular rim lighting on glass panels (top/right edges), monochromatic noise texture overlay, vibrancy-based text hierarchy (primary/secondary/tertiary), and pill-shaped custom navigation ornament. Result: premium, focused, "alive" interface.

## Color Palette (Dark Mode)

| Token | OKLCH | Purpose |
| --- | --- | --- |
| Background | `0.10 0 0` | Deep near-black, imperceptible chroma |
| Foreground | `0.95 0.01 245°` | Primary text, cyan-blue cast for spatial feel |
| Card | `0.15 0.02 245°` | Glass panel base, subtle hue |
| Primary Accent | `0.75 0.16 245°` | Active states, tab highlights, icy cyan-blue glow |
| Secondary | `0.65 0.08 245°` | Descriptive context, subtitles (lower chroma) |
| Muted | `0.25 0.02 0°` | Inactive states, borders |
| Success (Chart-1) | `0.70 0.18 28°` | Fastest lap, best performance (warm green) |
| Destructive (Chart-2) | `0.60 0.20 25°` | Slowest lap, warning states (warm red) |

## Typography

| Layer | Font | Size | Weight | Use |
| --- | --- | --- | --- | --- |
| Display | General Sans | 32–64px | 700 (Bold) | Tab labels, hero timers, module headers |
| Body | DM Sans | 14–18px | 400–500 | Body text, descriptions, time displays |
| Mono | Geist Mono | 12–14px | 400 | Code, lap times, numeric data |

**Scale**: 12, 14, 16, 18, 24, 32, 48, 64px

**Vibrancy Hierarchy**:
- Primary (0.95 lightness): Titles, body text, active icons
- Secondary (0.65): Subtitles, captions, descriptive time zones
- Tertiary (0.50): Disabled buttons, inactive elements, faded backgrounds

## Elevation & Depth

| Layer | OKLCH L | Material | Use |
| --- | --- | --- | --- |
| Base | 0.10 | Solid background | Full-screen backdrop, never interactive |
| Card (L1) | 0.15 | Glass backdrop-blur | Content panels, form fields, stopwatch list |
| Navigation (L2) | 0.18 | Glass + rim light | Pill nav bar, tab ornaments |
| Accent Glow (L3) | – | Specular highlight | Active state surrounding halo, hover glow |

**Rim Lighting**: Inset top/right edges with `inset 0 1px 0 0 rgba(255,255,255,0.08)`

**Glass Effect**: `backdrop-blur-xl bg-card/40 border border-border/20` + noise-texture overlay

## Structural Zones

| Zone | Background | Border | Interactive | Purpose |
| --- | --- | --- | --- | --- |
| Header (optional) | solid background | none | tabs/breadcrumb | Module selector or branding |
| Content | glass-effect | subtle | buttons/inputs | World clocks, alarms, lap list, timer presets |
| Navigation | glass-rim + pill-nav | glass-effect border | 4 tabs | Module switching: World Clock, Alarm, Stopwatch, Timer |
| Footer (optional) | solid background | border-t | settings | Global settings, format toggle (12/24hr) |

**Pill Navigation**: 24px border-radius capsule shape, `gap-2`, `p-2`, 60×60px tap targets, active tab glows with `shadow-glass-lg`

## Spacing & Rhythm

| Scale | Px | Use |
| --- | --- | --- |
| xs | 4 | Icon padding, micro-spacing |
| sm | 8 | Element gap, button padding |
| md | 16 | Card padding, section gap |
| lg | 24 | Module padding, container max-width spacing |
| xl | 32 | Top-level section margin |

**Density**: Card-based, medium-tight (md spacing dominates), breathing room between modules via xl gaps.

## Component Patterns

| Component | Style | Interaction |
| --- | --- | --- |
| Button | solid or glass, 44px min height | Hover glow, active primary accent |
| Tab (pill nav) | glass-effect, `nav-tab-active` on selected | Icon + label, filled icon when active |
| Time Display | large monospace, vibrancy-primary | Digital or analog toggle (stopwatch) |
| Alarm/Timer List | card glass, subtle borders | Toggle, delete, repeat schedule picker |
| Input Field | glass-effect border, `input` token | Focus ring: `ring-2 ring-accent` |

## Motion & Animation

| Element | Animation | Timing | Purpose |
| --- | --- | --- | --- |
| Tab Active | nav-tab-active shadow + icon fill | 0.2s ease-out | Focus feedback |
| Hover Glow | shadow-glass-md → shadow-glass-lg | 0.3s smooth | Interactive awareness |
| Running Timer | pulse-glow looping | 2s cubic-bezier | Active state indicator |
| Entrance | float + fade-in | 0.4s ease-out | Page/module load |
| Transition | all 0.3s smooth | 0.3s cubic-bezier | Smooth state change |

**Framer Motion**: Orchestrate component entrance/exit with `motion.div`, staggered children, spring easing on icon symbols.

## Constraints

- **No vibrancy blur stacking**: Max 2 overlapping glass layers to preserve legibility
- **Text contrast**: Ensure 4.5:1 on primary text over glass (achieved via L 0.95 on L 0.15 background)
- **Icon animation**: SF Symbol-inspired only; use lucide-react with smooth `motion.div` wrapping
- **Tap targets**: 60×60px minimum on mobile, 44×44px on desktop (pill nav buttons)
- **Glass blur**: 10–12px backdrop-filter blur; avoid >16px or UI becomes unreadable
- **Noise opacity**: 0.02–0.04; higher makes surface feel gritty

## Signature Detail

**Specular Rim Lighting**: Every glass panel has a top/right 1px highlight simulating light refraction through thick glass. Combined with icy cyan-blue glows on active states, this creates a "premium thickness" that distinguishes the app from flat 2D designs. The subtle monochromatic noise overlay ensures the surface feels tangible, not plastic.

---

**Design System Version**: v1.0 | **Last Updated**: 2026-04-19 | **Framework**: React 19 + Tailwind CSS + OKLCH | **Motion**: Framer Motion v12 | **Icons**: lucide-react (SF Symbol-inspired)
