# 🎨 Acid Design System

> A minimalist, premium, clinical-grade design system built for high-density diagnostic interfaces and high-precision telemetry dashboards.

This package houses the design tokens, applied UI component library, preview specs, and documentation that bridge design parameters with production clinical layouts.

---

## 🛠️ Product Overview & Visual Context

The **Acid Design System** is engineered to optimize diagnostic legibility, information density, and data structural consistency. It targets professional telemetry platforms, laboratory registries, and clinical database tools that require extreme visual order and fast reading speeds.

- **Atmosphere**: Objective, high-contrast, structured, and flat.
- **Aesthetic**: Flat high-visibility brand highlights paired with deep purple boundaries, sharp 4px corners, and warm cream surfaces to reduce visual fatigue.
- **Visual Baseline**: 4px baseline grid formula (`gap = n * 4px`) and 10% outer desktop page margins.

---

## 📦 Package Contents

```
/
├── colors_and_type.css      # Reusable design tokens (colors, variables, states, reset)
├── DESIGN.md                # Full specifications, anti-patterns, motion & typography parameters
├── README.md                # This file (Product overview, preview manifest, and integration guide)
├── SKILL.md                 # Agent-facing instructions for invoking the Acid design language
│
├── preview/                 # Focused visual preview HTML cards
│   ├── brand-assets.html
│   ├── colors-primary.html
│   ├── components-alerts.html
│   ├── components-badges.html
│   ├── components-buttons.html
│   ├── components-inputs.html
│   ├── spacing-tokens.html
│   └── typography-specimens.html
│
└── ui_kits/app/             # Applied UI dashboard playground
    ├── index.html           # Live interactive explorer (React + Babel + CSS tokens)
    └── README.md            # App shell, component layout guidance
```

---

## 📋 Preview Manifest

The following preview cards are available in the `/preview/` folder to inspect, audit, or review individual visual behaviors:

- 🎨 **[preview/colors-primary.html](./preview/colors-primary.html)**: Interactive palette card with hex values and variable keys for `#D2E823`, `#E76F51`, `#F8F4E8`, and `#691073`.
- ✍️ **[preview/typography-specimens.html](./preview/typography-specimens.html)**: Font family specimens showcasing *Dela Gothic One* (headings), *Space Grotesk* (reading/UI), and *Fira Code* (tabular numeric data).
- 📏 **[preview/spacing-tokens.html](./preview/spacing-tokens.html)**: Graphical representation of the 4px baseline layout spacing and multiple scales.
- 🔳 **[preview/brand-assets.html](./preview/brand-assets.html)**: Guidelines for the Acid brand wordmark logo, launcher symbols, and dark-theme reversals.
- 🔘 **[preview/components-buttons.html](./preview/components-buttons.html)**: Action button previews demonstrating offset shadow positions, focus glowing, and disabled parameters.
- 💬 **[preview/components-alerts.html](./preview/components-alerts.html)**: Notification banners for successes, clinical errors, and system logs.
- 🏷️ **[preview/components-badges.html](./preview/components-badges.html)**: Evaluation status badges (In-range, Pre-diabetic, and Critical).
- ⌨️ **[preview/components-inputs.html](./preview/components-inputs.html)**: Text fields, error indicators, and label stack alignments.

---

## ⚙️ Core Integration & Reuse

### 1. In Vanilla HTML / CSS
Link the stylesheet token and fonts inside your document `<head>`:
```html
<link rel="stylesheet" href="colors_and_type.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/fontsource/fonts/dela-gothic-one@latest/latin-400-normal.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-400-normal.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/fontsource/fonts/fira-code@latest/latin-400-normal.css" />
```

Apply semantic utility classes directly on elements:
```html
<button class="acid-btn acid-btn-primary">Execute Diagnostics</button>
<div class="acid-card">
  <span class="acid-badge acid-badge-primary">● Active</span>
</div>
```

### 2. In Tailwind v4 CSS
You can bind the variables inside your tailwind base configuration:
```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #D2E823;
  --color-brand-secondary: #E76F51;
  --font-heading: 'Dela Gothic One', sans-serif;
  --font-body: 'Space Grotesk', sans-serif;
  --font-mono: 'Fira Code', monospace;
}
```
