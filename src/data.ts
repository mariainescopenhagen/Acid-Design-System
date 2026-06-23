import { PatientRecord, ClinicalAlert } from './types';

export const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: "PT-00482",
    name: "Sofia Loren",
    age: 42,
    gender: "F",
    marker: "Glucose",
    value: 98.4,
    unit: "mg/dL",
    status: "Normal",
    referenceRange: "70–99",
    date: "2026-06-23"
  },
  {
    id: "PT-00483",
    name: "Marcus Aurelius",
    age: 58,
    gender: "M",
    marker: "HbA1c",
    value: 6.2,
    unit: "%",
    status: "Pre-diabetic",
    referenceRange: "< 5.7",
    date: "2026-06-23"
  },
  {
    id: "PT-00484",
    name: "Amelia Earhart",
    age: 31,
    gender: "F",
    marker: "Creatinine",
    value: 1.84,
    unit: "mg/dL",
    status: "High",
    referenceRange: "0.6–1.2",
    date: "2026-06-23"
  },
  {
    id: "PT-00485",
    name: "Galileo Galilei",
    age: 72,
    gender: "M",
    marker: "Potassium",
    value: 4.2,
    unit: "mEq/L",
    status: "Normal",
    referenceRange: "3.5–5.0",
    date: "2026-06-22"
  },
  {
    id: "PT-00486",
    name: "Marie Curie",
    age: 39,
    gender: "F",
    marker: "Potassium",
    value: 6.8,
    unit: "mEq/L",
    status: "High",
    referenceRange: "3.5–5.0",
    date: "2026-06-22"
  }
];

export const INITIAL_ALERTS: ClinicalAlert[] = [
  {
    id: "alt-1",
    type: "error",
    title: "Critical value detected.",
    message: "Patient PT-00484 (Amelia Earhart) — Creatinine 1.84 mg/dL exceeds safe clinical range.",
    date: "2026-06-23 14:02 UTC",
    patientId: "PT-00484"
  },
  {
    id: "alt-2",
    type: "error",
    title: "Hyperkalemia Warning.",
    message: "Patient PT-00486 (Marie Curie) — Potassium at 6.8 mEq/L is critically elevated.",
    date: "2026-06-22 11:15 UTC",
    patientId: "PT-00486"
  },
  {
    id: "alt-3",
    type: "success",
    title: "Record Sync Successful.",
    message: "Laboratory results safely synced with core repository database.",
    date: "2026-06-23 13:45 UTC"
  }
];

export const DESIGN_RULES = {
  dos: [
    {
      id: "do-1",
      tag: "Do",
      title: "Monospace for Numbers",
      description: "Use var(--acid-f-mono) (Fira Code) for all numeric clinical values to guarantee tabular layout and clear vertical alignment."
    },
    {
      id: "do-2",
      tag: "Do",
      title: "Standard Easing",
      description: "Trigger fast, responsive transitions (150ms) with var(--acid-ease-std) for active hover interactions."
    },
    {
      id: "do-3",
      tag: "Do",
      title: "Strict 4px Radius",
      description: "Keep element corners bound to a strict 4px radius. Avoid custom rounded-lg or rounded-full pills unless representing statuses."
    },
    {
      id: "do-4",
      tag: "Do",
      title: "Spaced Layout Margins",
      description: "Follow the 10% outer padding rhythm for primary dashboard grids to maintain premium visual negative space."
    }
  ],
  donts: [
    {
      id: "dont-1",
      tag: "Don't",
      title: "No Soft Gradients",
      description: "Never apply modern standard blue/purple gradients. Stick strictly to flat, solid ink fills of brand-primary or brand-secondary."
    },
    {
      id: "dont-2",
      tag: "Don't",
      title: "Isolated Error Fills",
      description: "Never use the high-contrast crimson text without its 10% opacity backdrop screen pairing to maintain WCAG text legibility."
    },
    {
      id: "dont-3",
      tag: "Don't",
      title: "Drifting Grid Values",
      description: "Avoid arbitrary spacing paddings. Gaps and margins must always calculate as direct multiples of the baseline 4px grid (n × 4px)."
    },
    {
      id: "dont-4",
      tag: "Don't",
      title: "Decorative Visual Slop",
      description: "Never add unrequested graphs, lines, or background illustrations. Every asset must serve a clear clinical or diagnostic goal."
    }
  ]
};

export const CODE_SNIPPETS = {
  buttons: `<!-- Primary Acid Button -->
<button class="acid-btn acid-btn-primary">
  Primary Action
</button>

<!-- Secondary Acid Button -->
<button class="acid-btn acid-btn-secondary">
  Secondary Action
</button>

<!-- Default Acid Button -->
<button class="acid-btn">
  Default Layout
</button>

<!-- Ghost Acid Button -->
<button class="acid-btn acid-btn-ghost">
  Ghost Action
</button>`,

  inputs: `<!-- Default Input State -->
<label style="display: flex; flex-direction: column; gap: var(--acid-grid) * 2;">
  <span class="acid-mono" style="color: var(--acid-border);">PATIENT ID</span>
  <input class="acid-input" placeholder="PT-00000" />
</label>

<!-- Error Input State -->
<label style="display: flex; flex-direction: column; gap: var(--acid-grid) * 2;">
  <span class="acid-mono" style="color: var(--acid-error);">INVALID ID</span>
  <input class="acid-input acid-input-error" value="PT-INVALID" />
</label>`,

  badges: `<!-- Default Gray Badge -->
<span class="acid-badge">Pending</span>

<!-- Primary Lime Badge -->
<span class="acid-badge acid-badge-primary">● Active</span>

<!-- Secondary Coral Badge -->
<span class="acid-badge acid-badge-secondary">New</span>

<!-- Error Red Badge -->
<span class="acid-badge acid-badge-error">● Critical</span>`,

  alerts: `<!-- Error Notification -->
<div class="acid-alert acid-alert-error">
  <span class="acid-alert-icon">!</span>
  <div><strong>Validation failed.</strong> Patient ID must be 8 characters.</div>
</div>

<!-- Success Notification -->
<div class="acid-alert acid-alert-success">
  <span class="acid-alert-icon">✓</span>
  <div><strong>Record saved.</strong> Clinical data synced successfully.</div>
</div>`,

  cssVariables: `:root {
  /* Brand Palettes */
  --acid-brand-primary: #D2E823;
  --acid-brand-secondary: #E76F51;

  /* Semantic Interfaces */
  --acid-bg: #F8F4E8;
  --acid-surface: #FFFFFF;
  --acid-text: #09090B;
  --acid-error: #D9383A;
  --acid-error-bg: rgba(217, 56, 58, 0.1);
  --acid-border: #691073;

  /* Type Scales */
  --acid-f-heading: 'Dela Gothic One', sans-serif;
  --acid-f-body: 'Space Grotesk', sans-serif;
  --acid-f-mono: 'Fira Code', monospace;
  --acid-s-sm: 0.875rem;
  --acid-s-base: 1rem;
  --acid-s-md: 1.25rem;
  --acid-s-lg: 1.75rem;

  /* Layout Formulas */
  --acid-grid: 4px;
  --acid-radius: 4px;
  --acid-margin: 10%;
}`
};
