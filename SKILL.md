---
name: acid-design-system
description: Design system guidelines and component tokens for Acid medical diagnostics and telemetry dashboards.
user-invocable: true
---

# Acid Design System — Agent Skill Card

This skill card equips coding assistants with instructions, code snippets, and rules required to generate or edit user interfaces following the **Acid Design System**.

---

## 🔍 Source Context & Origins

The Acid Design System is a high-signal, premium visual framework optimized for data density and clinical precision. It is designed to sustain visual discipline on diagnostics screens, minimizing fatigue while highlighting critical anomalies immediately.

- **Primary Paradigm**: Minimalist wireframe design with heavy borders (`#691073`), sharp corners, and a muted warm cream canvas background (`#F8F4E8`) contrasted by lime yellow highlight triggers (`#D2E823`).
- **Data Standard**: Monospace numerals (`Fira Code`) aligned to column matrices to prevent parsing errors.

---

## 📦 What is Inside

- **`colors_and_type.css`**: Core reusable tokens (backgrounds, text, outlines, radius, standard button/input/table components).
- **`DESIGN.md`**: Architectural specification, programmatic formulas, interactive transition standard cubic-beziers, and visual anti-patterns.
- **`preview/`**: Focused individual preview cards representing badges, alerts, buttons, spacing, typography, and palettes.
- **`ui_kits/app/`**: A runnable sandbox containing an applied Clinical Database Explorer rendering real-time metric counters, alerts, tables, and outcome registration modules.

---

## 🚦 When to Use This Skill

Incorporate this skill when a user asks for:
1. Interfaces with **high data density**, lists of telemetry metrics, or clinical registers.
2. An **aesthetic theme** characterized by flat outlines, bold displays, and retro-minimalist clinical-grade structures.
3. Components like high-contrast button offsets, bordered data tables, or notification alerts with custom left-border stripes.

---

## 🛠️ How to Use This Skill (Agent Guidelines)

### Step 1: Initialize Tokens
Always verify that your layout imports `colors_and_type.css` and links the required Google fonts (*Dela Gothic One*, *Space Grotesk*, and *Fira Code*).

### Step 2: Utilize Component Class Tokens
When writing buttons, labels, grids, or alerts, favor the native component classes declared in the tokens file over writing separate custom inline inline-styles:
- Standard Buttons: `<button class="acid-btn">`
- Primary Lime Buttons: `<button class="acid-btn acid-btn-primary">`
- Alerts: `<div class="acid-alert acid-alert-error">`
- Tables: `<table class="acid-table">`

### Step 3: Strictly Align to Spacing Formulas
Never invent custom gap numbers. Ensure element paddings match the baseline formula `n * var(--acid-grid)` where `var(--acid-grid)` evaluates to `4px`.

### Step 4: Guard Against Anti-patterns
- **Never** add unrequested telemetry labels in outer margins (like "Online" states or container ports). Keep margins fully clean.
- **Never** apply soft modern gradients. Fills must remain solid block ink.
- **Never** use corner-radius variables exceeding `4px`. Sharp boundaries are mandatory.

---

## 🎯 Design System Highlights

- **Core Typography Mapping**:
  - Displays/Titles: `families.heading` (`'Dela Gothic One'`) at `sizes.lg` with weight 600.
  - Body Text/Labels: `families.body` (`'Space Grotesk'`) at `sizes.base` or `sizes.sm`.
  - Numeric Values: `families.mono` (`'Fira Code'`) with active `font-variant-numeric: tabular-nums`.
- **Rhythmic Negative Space**: Desktop main layouts must follow a persistent `10%` padding (`--acid-margin`) to isolate active widgets and direct user attention.
- **Hover Physics**: Standardize active offsets using `150ms` fast transition durations paired with standard cubic-beziers: `transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1)`.
