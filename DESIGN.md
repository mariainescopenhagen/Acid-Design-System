# Acid Design System — Design Specifications & Guidelines

> **System Atmosphere**: Minimalist. Premium. Clinical.  
> **Primary Use Case**: Data-dense medical diagnostic interfaces and high-precision telemetry dashboards.

This document details the visual parameters, structural patterns, and programmatic rules that govern the Acid Design System. All components, layouts, and interactive modules must follow these parameters strictly.

---

## 1. Visual Theme & Atmosphere

The Acid Design System is engineered to feel clinical-grade, highly precise, and visually distinctive. It avoids generic modern trends (such as rounded bubble corners, neon drop shadows, and soft gradients) in favor of structured high-contrast wireframe layouts, sharp 4px boundaries, and raw ink colors.

- **Primary Mood**: Objective, authoritative, and structured.
- **Visual Rhythm**: High contrast, crisp lines, generous white space (10% outer padding), and mono-aligned tabular indicators.
- **Product Context**: Medical databases, clinical diagnostic reports, laboratory summaries, and telemetry tracking.

---

## 2. Color System

Color is a semantic tool in Acid. We utilize solid, un-gradient ink colors with strict pairing guidelines to maintain high accessibility and legible readings.

### 2.1 Brand Palettes
- **Acid Primary (`--acid-brand-primary`)**: `#D2E823` (High-visibility lime yellow). Used strictly for active highlight states, primary buttons, and critical normal badges.
- **Acid Secondary (`--acid-brand-secondary`)**: `#E76F51` (Coral red). Used for visual anchors, highlights, and secondary elements.

### 2.2 Semantic Interfaces
- **Cream Background (`--acid-bg`)**: `#F8F4E8`. A warm, soft, non-reflective off-white designed to reduce eye strain during prolonged screen exposure in clinical environments.
- **Pure Surface (`--acid-surface`)**: `#FFFFFF`. Standard background for modules, panels, lists, and form terminals.
- **Deep Slate Text (`--acid-text`)**: `#09090B`. Primary typography and active ink color.
- **Crimson Error (`--acid-error`)**: `#D9383A`. Text and outline color for abnormal clinical readings and warning banners. Must never be used in isolation (see Anti-patterns).
- **Error Screen Background (`--acid-error-bg`)**: `rgba(217, 56, 58, 0.1)`. A 10% opacity backdrop screen to pair with `--acid-error` to keep contrast text AA compliant.
- **Success Screen Background (`--acid-success-bg`)**: `rgba(210, 232, 35, 0.25)`. A soft light-green screen backplate used in conjunction with primary badges/borders for in-range readings.
- **Deep Purple Border (`--acid-border`)**: `#691073`. Signature dark violet used for primary component outlines, table cells, and module frames.
- **Subtle Purple Border (`--acid-border-subtle`)**: `rgba(105, 16, 115, 0.15)`. 15% opacity violet used for internal dividing lines, table rows, and disabled states.

---

## 3. Typography System

Acid pairs three distinct font families with specific semantic roles to maximize hierarchy readability.

```
+-------------------------------------------------------------------------------+
| DELA GOTHIC ONE  -> Page headings, primary display titles, logo logotype      |
| SPACE GROTESK    -> Reading text, body copy, input values, button labels      |
| FIRA CODE        -> Patient IDs, numeric lab values, units, date metadata      |
+-------------------------------------------------------------------------------+
```

### 3.1 Font Families
- **Display Heading Font (`--acid-f-heading`)**: `'Dela Gothic One', sans-serif`. A bold, heavy, high-impact display face. Restricted to page titles and large section headings.
- **Body & Label Font (`--acid-f-body`)**: `'Space Grotesk', sans-serif`. A clean, geometrically balanced grotesque face. Highly legible at small and medium scales. Used for labels, body copy, and UI text.
- **Monospace Numeric Font (`--acid-f-mono`)**: `'Fira Code', monospace`. Monospace face with tabular numerals. **Mandatory** for all clinical numbers, times, ranges, and patient IDs to align columns perfectly.

### 3.2 Font Scale
- **Small (`--acid-s-sm`)**: `0.875rem` (14px)
- **Base/Medium (`--acid-s-base`)**: `1rem` (16px)
- **Large Heading (`--acid-s-md`)**: `1.25rem` (20px)
- **Display Hero (`--acid-s-lg`)**: `1.75rem` (28px)

---

## 4. Spacing, Margin & Grid

All dimensions are derived programmatically from a baseline increment to ensure structural discipline and eliminate design drift.

- **Grid Baseline (`--acid-grid`)**: `4px`.
- **Rhythmic Gaps**: Gaps, paddings, and margins are calculated strictly as multiples of the baseline grid:
  - `calc(var(--acid-grid) * 2)` = `8px`
  - `calc(var(--acid-grid) * 3)` = `12px`
  - `calc(var(--acid-grid) * 4)` = `16px`
  - `calc(var(--acid-grid) * 6)` = `24px`
  - `calc(var(--acid-grid) * 8)` = `32px`
  - `calc(var(--acid-grid) * 12)` = `48px`
- **Outer Page Margin (`--acid-margin`)**: `10%` on desktop viewports. This large padding preserves negative space, focusing the clinical operator's attention on central data modules.

---

## 5. Layout & Grid Composition

- **Module Cards**: All primary dashboard blocks use a `--acid-surface` white background, framed by a 1px solid `--acid-border` deep purple outline, and use a strict 4px border radius.
- **Dashboard Columns**: Responsive multi-column layout using flexible grid systems. On desktop, sidebars stay persistent with a 240px width.
- **Header Structure**: Each screen features a consistent page header with an uppercase monospace eyebrow label, a heavy Dela Gothic title, and a datetime status anchor.

---

## 6. UI Components Specifications

All components must inherit tokens from `colors_and_type.css`.

### 6.1 Buttons (`.acid-btn`)
- **Visuals**: 2px solid `--acid-text` black outline, 4px strict border-radius.
- **Primary Variant (`.acid-btn-primary`)**: Filled with `--acid-brand-primary` lime yellow.
- **Secondary Variant (`.acid-btn-secondary`)**: Filled with `--acid-brand-secondary` coral red.
- **Ghost Variant (`.acid-btn-ghost`)**: Transparent background, framed with `--acid-border` deep purple outline.
- **States**: Hover state triggers a `translate(-2px, -2px)` offset combined with a 4px solid drop-shadow offset. Active click resets translation back to `(0, 0)` with no shadow.

### 6.2 Input Fields (`.acid-input`)
- **Visuals**: 1px solid `--acid-border` deep purple outline, 4px strict border-radius.
- **States**: Focused state changes border color to `--acid-text` and applies a `0 0 0 3px rgba(210, 232, 35, 0.4)` glowing shadow.
- **Error State (`.acid-input-error`)**: Outline changes to `--acid-error` crimson with an `--acid-error-bg` light-pink backplate.

### 6.3 Badges (`.acid-badge`)
- **Visuals**: 11px monospace typography, thin border outline. Used for status indicators.
- **Variants**: Grey (`Default`), lime yellow (`.acid-badge-primary`), coral red (`.acid-badge-secondary`), or crimson (`.acid-badge-error`).

### 6.4 Alerts (`.acid-alert`)
- **Visuals**: Horizontal notice strip, thick 4px left-side status border, 10% opacity background backplates.
- **Variants**: `.acid-alert-error`, `.acid-alert-success`, and `.acid-alert-info`.

---

## 7. Motion & Interactive Physics

- **Fast Transition (`--acid-dur-fast`)**: `150ms`. Used for immediate hover animations on buttons, inputs, and tab selectors.
- **Normal Transition (`--acid-dur-normal`)**: `300ms`. Used for sliding panel drawers and collapsing alerts.
- **Easing Formulas**:
  - **Standard Ease (`--acid-ease-std`)**: `cubic-bezier(0.4, 0, 0.2, 1)`. Programmatic transition for hover triggers.
  - **Decelerated Ease (`--acid-ease-dec`)**: `cubic-bezier(0, 0, 0.2, 1)`. Smooth exit curves for active overlays and alert purges.

---

## 8. Anti-patterns (Forbidden Choices)

To maintain the elite minimalist aesthetic of Acid, agents must never implement the following patterns:
1. **No Rounding Over-Drift**: Never use circular pills (`rounded-full` or large radii > 4px) for cards, buttons, or input blocks. Keep corner radius strictly capped at `4px`.
2. **No Modern Gradients**: Standard modern blue-purple gradients are forbidden. Fills must remain solid ink blockouts.
3. **No Isolated Crimson Texts**: Never write high-contrast red messages without pairing them with their respective `--acid-error-bg` translucent screen. Isolation causes WCAG text-accessibility degradation.
4. **No Arbitrary Layout Gaps**: Gaps must never drift to random values. They must calculate as direct multiples of the `4px` grid.
5. **No Visual Telemetry Clutter**: Avoid adding unrequested status labels like "Online", "System Active", or "Port: 3000" in page margins. Clean pages should limit outer elements.
