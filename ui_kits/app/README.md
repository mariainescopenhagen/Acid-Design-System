# Applied UI Kit — Acid Clinical Dashboard

> **Product Target**: Medical diagnostic panels, high-density charts, and telemetry tracking dashboards.
> **Source Base**: Preserved Clinical-grade telemetry guidelines.

This directory houses the applied implementation playground for the Acid Design System. It models a live web interface of an interactive, high-precision Clinical Registry Explorer and patient data-logger.

---

## 📂 File Architecture

```
/ui_kits/app/
├── index.html        # Main browser playpen (loads React, Babel, and CSS tokens)
└── README.md         # This documentation file explaining usage and components
```

---

## 🛠️ Components Composed

1. **Applied App Shell**: A persistent, left-aligned standard 240px clinical navigation sidebar with signature brand assets and section labels.
2. **Clinical KPI Cards**: Quantitative stat blocks representing database counts, critical violations, and response times.
3. **Data-dense Results Table**: A robust tabular interface displaying patient details, in-range markers, and custom abnormal thresholds.
4. **Outcome Form Terminal**: Interactive form to log diagnostics, calculating patient statuses automatically.
5. **Notice Banner Center**: State-based alert notification boxes for validation, successes, and informational logs.

---

## 📦 How to Import & Reuse

To reuse this applied UI kit inside a new HTML, React, or Vite project:

### 1. Load Token Variables
Ensure you have loaded the core design tokens by linking `/colors_and_type.css` in your document `<head>`:
```html
<link rel="stylesheet" href="path/to/colors_and_type.css" />
```

### 2. Include Required Fonts
The typography rules require **Dela Gothic One**, **Space Grotesk**, and **Fira Code**:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/fontsource/fonts/dela-gothic-one@latest/latin-400-normal.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-400-normal.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/fontsource/fonts/fira-code@latest/latin-400-normal.css" />
```

### 3. Copy Component Classes
Apply the CSS utilities on structural markup:
- Buttons: `<button class="acid-btn acid-btn-primary">`
- Inputs: `<input class="acid-input" />`
- Badges: `<span class="acid-badge acid-badge-primary">`
- Alerts: `<div class="acid-alert acid-alert-error">`
- Tables: `<table class="acid-table">`

---

## 🎨 Layout Design Guidelines

- **Baseline Calculations**: Ensure all outer containers follow the `n * var(--acid-grid)` calculation (derived from `4px`).
- **Card Constraints**: Cards must preserve sharp boundaries. Never apply rounded-lg or rounded-full utility selectors to core components.
- **Tabular Numerics**: Any field printing patient diagnostics, values, units, or timestamps must include `.acid-num` class to lock tabular monospace alignment.
