# UI Foundation

## Product Purpose

KisanMitra is a market-intelligence and transaction-enablement interface connecting farmers and FPOs with verified buyers and the quality, storage, and transport providers needed to complete a trade.

The UI should make three things clear at all times:

1. What requires the user's attention now.
2. What state each produce record, offer, booking, or trade is in.
3. What the user is responsible for next.

## Actors

| Actor | Primary goal |
| --- | --- |
| Farmer | Prepare produce, discover its value, select a sale option, and receive payment. |
| FPO | Provide independent farmer services or purchase verified produce, aggregate FPO-owned produce, and fulfil buyer demand. |
| Buyer | Find suitable verified produce, agree terms, and complete purchases. |
| Storage Manager | Publish capacity and manage storage requests and stored produce. |
| Transport Manager | Publish availability, quote jobs, and coordinate deliveries. |
| Quality Assessor | Inspect produce and issue evidence-backed quantity and quality reports. |
| Admin | Oversee access, verification, disputes, risk, and platform activity. |

## Shared Product Model

- **Produce record:** pre-harvest estimate or harvested produce owned by a farmer.
- **Produce:** a defined quantity of harvested produce. Only a verified produce can enter formal bidding.
- **Procurement campaign:** an FPO offer to buy qualifying farmer produce against a target quantity, price, collection window, and payment terms.
- **Supply commitment:** a provisional reservation of farmer-owned, verified produce against an FPO procurement campaign.
- **FPO purchase:** the finalized purchase of an agreed verified quantity, transferring ownership from farmer to FPO.
- **Aggregation:** compatible FPO-owned quantities merged into a larger traceable produce after purchase.
- **Demand:** a buyer's requested crop, grade, quantity, location, price range, and delivery window.
- **Supply match:** a scored connection between a buyer requirement and an eligible farmer or FPO produce.
- **Procurement plan:** the buyer's selected quantities from one or more produce used to fulfil a demand.
- **Offer:** complete proposed trade terms, not price alone.
- **Trade:** the frozen agreement created when an offer is accepted.
- **Assessment:** quantity and quality evidence issued by an assessor.
- **Service booking:** storage or transport attached to a produce or trade.
- **Shipment:** one transport movement containing one or more produce/trade items.
- **Payment obligation:** one commercial sale's payable amount and two-party confirmation state.
- **Receiving inspection:** the buyer's evidence-backed record of delivered, accepted, and rejected quantities and condition.
- **Incident:** an operational fact recorded during assessment, storage, transport, delivery, or payment.
- **Grievance:** a participant's request for action about a problem.
- **Dispute:** a grievance accepted for formal Admin resolution.
- **Ownership transfer:** the recorded transfer of an exact quantity from farmer to FPO or FPO to buyer.
- **Verification application:** evidence and review history used to grant, reject, or suspend trusted marketplace permissions.
- **Admin resolution:** an explicit decision or adjustment linked to a dispute without overwriting original records.
- **Reliability profile:** behavior-derived metrics for an actor, kept separate from prices and risk allegations.
- **Risk alert:** an explainable rule/threshold signal requiring review, not proof of wrongdoing.
- **Audit event:** the actor, action, target, reason, timestamp, and before/after state for a sensitive admin action.

## Product-Wide Rules

- Rank sale choices by expected net realization; show headline price separately.
- Keep reliability visible as its own measure rather than hiding it in a combined score.
- The farmer always makes the final sell-or-hold and offer decisions.
- Clearly distinguish farmer-declared quality from assessor-verified quality.
- Do not allow unverified produce into formal bidding.
- Assign transport, storage, quality, loading, and payment responsibilities per trade.
- Show both who arranges a service and who pays for it.
- Freeze accepted trade terms. Later changes must appear as explicit amendments.
- Adjust urgency, warnings, and suggested time windows according to perishability.
- Use plain language, visible units, local currency, and unambiguous dates and times.
- Keep FPO service-provider and procurement modes visibly separate. Buying an FPO service never transfers crop ownership.
- Treat a farmer supply commitment as a reservation, not a sale. Ownership transfers only after final quantity/quality verification and purchase confirmation.
- Aggregate only compatible produce already owned by the FPO, while preserving source-produce lineage.
- Track farmer-to-FPO payment separately from the later FPO-to-buyer trade.
- Keep the primary role as `Buyer`; represent trader, wholesaler, processor, retailer, exporter, institutional, or government procurement as a buyer subtype.
- Start the buyer experience with demand and matched supply rather than requiring marketplace browsing.
- Compare buyer sourcing options by total landed acquisition cost while showing seller reliability separately.
- Keep ownership and service responsibility separate; arranging transport does not determine when ownership transfers.
- Receiving inspection may confirm delivery condition and accepted quantity but cannot silently replace an independent quality report.
- Apply rejection, downgrade, partial acceptance, and quantity-tolerance rules agreed before delivery wherever possible.
- Auctions are competitive offer windows: rankings are advisory, the seller may choose any valid offer, and the selected bid is labelled **Accepted offer**, never winner.
- Default direct-sale ownership transfer occurs when the buyer accepts delivery; the frozen terms may explicitly use another event.
- Display transport-risk responsibility separately from ownership, arranger, and payer.
- Verification status must affect actions, not only badges. Restricted controls should explain the required verification or missing evidence.
- Only a verified and crop-authorized assessor may issue an official quality report.
- Preserve original trade, assessment, service, delivery, and payment records; corrections and dispute outcomes appear as linked resolutions or amendments.
- Reliability metrics come from transaction behavior. Admins monitor or investigate them rather than assigning arbitrary scores.
- Treat risk signals, allegations, and confirmed violations as different states.
- Admin interfaces are read-only for normal marketplace operations and allow mutation only through explicit verification, moderation, or resolution actions.
- Use one active actor context at a time; show a role switcher only for mock users with multiple actor profiles.
- Public views show verification outcomes and aggregated reliability, not raw verification documents, private notes, full case evidence, or fraud flags.

## Design System

All visual styling must originate from a centralized, reusable design system.

- Define global CSS variables/theme tokens for color, typography, spacing, sizing, radii, borders, shadows, opacity, icon treatment, layers, focus states, animation duration, easing, and transitions.
- Use semantic names such as `primary`, `surface`, `surface-muted`, `text`, `text-muted`, `border`, `success`, `warning`, `danger`, `transition-fast`, and `ease-standard`.
- Screens and components must not hardcode raw colors or independent visual values.
- Shared components expose reusable semantic variants. Explicit exceptions are defined as named variants or scoped semantic tokens.
- Theme changes must propagate throughout the application without editing individual screens.
- Motion tokens must respect reduced-motion preferences.

The initial visual direction is a professional agricultural marketplace with government-grade trust: mostly neutral surfaces, restrained deep green branding, harvest amber accents, and clear informational/status colors.

## Responsive Structure

All roles follow one responsive product foundation with role-specific navigation.

### Desktop

- Persistent left navigation for primary sections.
- Top bar for page context, search when useful, notifications, and profile.
- Show the prominent demo **Switch role** control in the profile area; changing role replaces the actor navigation while preserving the shared scenario.
- Multi-column dashboards may place attention items and summaries beside operational lists.
- Dense tables are appropriate for operational roles, with filters and row detail drawers.

### Mobile

- Bottom navigation for the three or four most-used destinations; place remaining destinations under **More**.
- Convert tables into summary cards with progressive disclosure.
- Keep the primary action reachable near the bottom of the viewport.
- Use full-screen steps for long forms and negotiations; preserve entered values between steps.
- Avoid requiring horizontal scrolling to understand a status or compare essential values.

### Breakpoint Behavior

- Preserve the same tasks and information across sizes; only hierarchy and presentation may change.
- Collapse secondary filters into a filter sheet on narrow screens.
- Turn side-by-side comparisons into swipeable cards or a stacked comparison with pinned labels.
- Use drawers on desktop and full-screen detail views on mobile.

### Target Widths

- Mobile: 360 px, 390 px, and 430 px.
- Desktop: 1280 px and above.
- Farmer and field-assessment tasks are mobile-first.
- Buyer, FPO, Admin, Transport, and Storage dashboards are desktop-first while retaining complete mobile access.

## Shared Screen States

Every primary screen should account for:

- Loading/skeleton
- First-use empty state with a clear next action
- No search or filter results
- Partial or unavailable data
- Time-sensitive warning or overdue state
- Read-only completed/cancelled state
- Confirmation for consequential UI actions such as accepting terms or publishing a report

## Accessibility and Localization Readiness

- Support keyboard use, visible focus, semantic headings, and screen-reader labels.
- Do not communicate status using color alone.
- Maintain readable contrast and touch targets of at least 44 × 44 px.
- Build the initial UI and all visible copy in English only.
- Keep layouts flexible enough for longer translated labels later, but do not include a language switcher in the initial UI.
- Keep units beside values and avoid unexplained abbreviations.
