# Design-System Contract

The KisanMitra interface uses one centralized, reusable design system. This document defines the frontend styling contract; exact token values may be tuned during implementation without changing screen code.

## Source of Truth

- Raw visual values belong only in global theme definitions.
- CSS variables provide the runtime theme contract.
- Tailwind utilities map to those semantic variables.
- Components and screens consume semantic utilities or reusable variants, never raw values.
- Changing a global token must update every consumer automatically.

## Token Layers

### Foundation Tokens

Global scales define the available raw palette, font families, type sizes, spacing, radii, shadows, icon sizes/strokes, motion durations, easing curves, breakpoints, and layers.

These values are implementation details of the theme and must not be referenced directly from screens.

### Semantic Tokens

Semantic tokens describe intent:

- Surfaces: `background`, `surface`, `surface-muted`, `surface-raised`, `overlay`.
- Text: `text`, `text-muted`, `text-subtle`, `text-inverse`, `text-link`.
- Brand/action: `primary`, `primary-hover`, `primary-pressed`, `primary-foreground`.
- Borders/focus: `border`, `border-strong`, `focus-ring`.
- Status: `info`, `success`, `warning`, `danger`, with matching foreground and surface tokens.
- Marketplace: semantic states for verified, farmer-declared, best-net, conditional, overdue, disputed, and completed presentations.
- Identity verification: `verified-surface`, `verified-text`, and `verified-ring`. The identity badge uses a blue-green trust color that remains visually separate from agricultural-green actions and quality/status badges.
- Motion: `transition-fast`, `transition-standard`, `transition-slow`, `ease-standard`, `ease-emphasized`.

Status must never be communicated by color alone; pair tokens with labels and icons.

### Component Tokens and Variants

Use component tokens only when a semantic token needs component-specific behavior. Expose named variants rather than accepting arbitrary visual values.

Required shared variants include:

- Buttons: `primary`, `secondary`, `outline`, `ghost`, `destructive`.
- Inputs: default, invalid, disabled, read-only.
- Cards: standard, interactive, selected, attention, summary.
- Badges/status: neutral, info, success, warning, danger, verified, declared, conditional.
- Alerts: informational, success, warning, critical.
- Navigation: desktop item, mobile item, active, collapsed.
- Tables/lists: standard, compact, selectable, responsive-card representation.
- Dialogs/drawers/sheets: confirmation, form, detail, destructive action.
- Charts: series colors, axes, grid, tooltip, positive/negative, and reference baseline.

## Visual Direction

- Professional agricultural marketplace with government-grade trust.
- Neutral surfaces dominate the interface.
- Deep agricultural green is the restrained brand/action color.
- Harvest amber is an accent and warning-adjacent highlight, not the primary surface color.
- Blue communicates information; red is reserved for destructive actions and errors.
- Avoid excessive gradients, decorative leaf/tractor motifs, and novelty illustrations or copy.
- Use one highly readable sans-serif family and a consistent type hierarchy.

## Spacing, Shape, and Elevation

- Components use the shared spacing scale; screen-specific arbitrary gaps are prohibited.
- Radius variants define control, card, dialog, and pill shapes.
- Elevation variants define flat, raised, overlay, and focus/attention states.
- Borders and shadows must use semantic tokens and remain legible in every supported theme.

## Icons

- Use Lucide icons through shared icon components or variants.
- Centralize size, stroke width, color, alignment, and label spacing.
- Icons supplement text and must not be the only indicator for important actions or status.
- The reusable profile-verification mark uses the KisanMitra leaf emblem by itself beside the profile name, exposes the Admin-verification explanation on hover, and includes equivalent screen-reader text. The mark is non-interactive so it remains valid inside clickable identity rows.

## Motion

- All transitions and animations use global duration and easing tokens.
- Motion clarifies state changes, hierarchy, and continuity; it is not decorative noise.
- Reduced-motion preferences disable or simplify nonessential movement through the centralized motion theme.

## Responsive Application

- Responsive spacing, type, navigation, table/card transformation, dialog/drawer behavior, and content widths use shared layout primitives.
- Do not create actor-specific breakpoint systems.
- Mobile targets: 360 px, 390 px, and 430 px.
- Desktop target: 1280 px and above; intermediate layouts collapse naturally.

## Explicit Overrides

A visual exception is allowed only when all are true:

1. The default semantic token or variant cannot express the required meaning.
2. The exception is named according to its purpose.
3. It is implemented as a reusable component variant or scoped semantic token.
4. It remains accessible and responsive.

Do not add inline styles or raw Tailwind arbitrary values as a shortcut.

## Review Checklist

A screen is design-system compliant when:

- It contains no raw color, shadow, radius, spacing, icon, or motion values.
- All interactive controls use shared components and named variants.
- Status styling uses semantic tokens plus text/icon meaning.
- Focus, disabled, loading, error, empty, and reduced-motion states are present where applicable.
- Mobile and desktop layouts use shared responsive primitives.
- A theme-token change propagates without editing the screen.
