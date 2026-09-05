# Locked UI Decisions

These decisions resolve cross-actor ambiguity for the frontend. They describe visible states, actions, and information; they do not define backend or service implementations.

## Frontend Prototype

- Build a realistic, navigable medium-fidelity prototype rather than disconnected static dashboards.
- Read canonical display data from JSON files in `mockdata/`.
- Use one central prototype store for local-only actions and state transitions.
- Refresh or **Reset demo** restores the canonical fixture state.
- No real authentication, network APIs, databases, payments, or realtime services are included.

### Frontend Stack

- Next.js with TypeScript.
- Tailwind CSS consuming semantic theme tokens.
- Reusable, accessible component primitives and variants following a shadcn/ui-style approach.
- Lucide icons through shared icon sizing and style variants.
- React Hook Form with Zod for prototype forms and validation.
- Recharts for dashboard and analytics charts.
- React Context with a reducer-based `PrototypeStore`; no additional global-state library initially.

### Shared Frontend Structure

- Actor route groups: `/farmer`, `/fpo`, `/buyer`, `/transport`, `/storage`, `/quality`, and `/admin`.
- Shared entity details use consistent patterns for produce, trades, shipments, assessments, storage bookings, payment obligations, grievances, and disputes.
- Reuse domain components such as `LotCard`, `OfferCard`, `TradeStatus`, `ResponsibilityCard`, `QualityBadge`, `ReliabilityBadge`, and `PaymentStatus` instead of rebuilding them per actor.
- Actor navigation remains role-specific but uses the same labels and interaction patterns for shared concepts.

## Centralized Design System

- Define the entire visual language globally using CSS variables/theme tokens and reusable component variants.
- Components consume semantic tokens such as `primary`, `surface`, `text-muted`, `border`, `success`, `warning`, `danger`, `transition-fast`, and `ease-standard` rather than raw visual values.
- Centralize colors, typography, font weights, type scale, spacing, sizes, border radii, border styles, shadows, opacity, icon size/stroke, animation duration, easing, transitions, layers, and focus treatment.
- A global token change must update every consuming component automatically.
- Do not place raw hex/RGB colors, one-off shadows, arbitrary radii, bespoke spacing, or independent animation timings in screen components.
- Create shared variants for buttons, inputs, cards, badges, alerts, tabs, navigation, tables, dialogs, drawers, sheets, status indicators, and chart presentation.
- A component-specific exception must be explicit, named, and defined through a reusable variant or scoped semantic token.
- Support reduced-motion preferences through the motion tokens.
- Keep the theme hot-swappable without editing individual screens.

### Visual Direction

- Professional agricultural marketplace with government-grade trust and restrained agricultural cues.
- Primarily neutral surfaces, deep agricultural green as the brand color, harvest amber as a restrained accent, blue for information, and red only for destructive/error states.
- Avoid decorative agriculture clichés, excessive gradients, leaf/tractor motifs, and novelty copy.
- Use a highly readable sans-serif and concise, factual interface language.

## Marketplace and Trade

### Competitive Offer Window

- Auctions have no automatic winner.
- Rank valid bids by estimated seller net realization as advisory guidance.
- The seller may accept any valid bid.
- Use **Best Net Offer**, **Highest Price**, **Best Payment Terms**, and **Lowest Fulfilment Cost**.
- Do not use **Winner**, **Winning**, **Outbid**, or **Highest Bidder**. After selection, use **Accepted offer**.
- A buyer may see their current rank by estimated seller net return.

### Ownership and Transport Risk

- Ownership transfer is a frozen trade term.
- Default direct Farmer/FPO-to-Buyer transfer: **Buyer accepts delivery**.
- Payment timing does not determine ownership.
- Transport arranger, transport payer, and transport-risk bearer are separate fields.
- Plain-language trade copy states when ownership transfers and who is responsible for transport damage.

### Rejected Produce

- Before buyer acceptance, rejected quantity remains seller-owned by default.
- On partial acceptance, ownership transfers only for the accepted quantity.
- Default return arranger and payer are the seller, unless buyer or buyer-assigned service fault caused rejection.
- Frozen trade terms show rejected-goods owner, return arranger/payer, temporary-storage payer, collection deadline, and fallback action.
- The default collection deadline displayed in examples is 24 hours; fixtures may vary it.

## FPO Buyer Commitment

Use four visible states:

```text
Interested → Conditional commitment → Confirmed trade
                         └────────────→ Expired
```

- **Interested:** non-binding signal; nothing reserved.
- **Conditional commitment:** Buyer and FPO agree terms subject to sufficient farmer supply.
- During the conditional stage, freeze buyer price, target quantity, quality, delivery location, responsibility terms, and condition expiry.
- **Confirmed trade:** created when sufficient qualifying supply is reserved and the FPO confirms.
- **Expired:** supply condition was not met before the deadline; no penalty is implied unless shown in the agreed terms.

## Verification and Assessment

### Unverified Produce

- Unverified/upcoming produce is excluded from normal marketplace search by default.
- It appears only through farmer-opted-in matching.
- Show **Farmer declared**, **Not verified**, and approximate quantity prominently.
- Allowed buyer actions: **Express interest** and **Request assessment**.
- Disabled actions: binding offer and auction bid.

### Assessment Currency

- Display assessment time, location, assessed quantity, crop, validity window, and `Valid`, `Expiring`, or `Expired` state.
- Validity comes from crop/perishability fixture configuration rather than a universal duration.
- An expired assessment remains visible as history but returns the produce to **Assessment required** for binding offers or bids.
- At FPO collection, show a lightweight receiving check for identity, quantity, obvious damage, and quality deviation.
- A new professional assessment is required only when the earlier assessment expired or a meaningful discrepancy is recorded.
- Default payer: the requesting party, unless frozen terms say otherwise.
- Routine re-check may use the same assessor; dispute reassessment should show a different assessor where available.

### Verification Permission Matrix

| Action | Unverified | Pending | Verified | Rejected | Suspended |
| --- | --- | --- | --- | --- | --- |
| View marketplace | Yes | Yes | Yes | Limited | Limited |
| Draft profile/listing | Yes | Yes | Yes | Yes | Yes |
| Publish commercial listing | No | No | Yes | No | No |
| Make/receive binding quote | No | No | Yes | No | No |
| Accept trade | No | No | Yes | No | No |
| Complete provider service | No | No | Yes | No | No |
| View own history | Yes | Yes | Yes | Yes | Yes |
| Raise grievance | Yes | Yes | Yes | Yes | Yes |

Actor-specific additions:

- Transport: may draft vehicles before verification; cannot publish availability or accept jobs.
- Storage: may draft facilities before verification; cannot publish capacity or accept bookings.
- FPO: may view demand and draft campaigns; cannot publish procurement offers or purchase crops.
- Quality Assessor: cannot publish an official report unless verified and authorized for the crop.

`Needs more information` uses the same marketplace permissions as `Pending` while exposing a document-resubmission action.

## Fulfilment and Payment

### Multi-Produce Fulfilment

- One shipment or storage booking may contain multiple items.
- Each item shows its trade, produce, quantity, pickup/check-in context, and item status.
- Trades remain separate even when logistics are consolidated.

### Payment Obligations

- Create a separate visible payment obligation for every commercial sale, including Farmer-to-FPO and Buyer-to-FPO.
- Default state flow:

```text
Pending → Buyer marked paid → Seller confirmed → Completed
```

- Branches: `Partially paid`, `Overdue`, and `Disputed`.
- Seller actions after buyer confirmation: **Confirm receipt** or **Report partial/missing payment**.
- If a future payment provider becomes authoritative, the UI may show **Payment provider confirmed** instead of requiring seller confirmation.

## Issue Terminology

- **Incident:** operational fact such as delay, damage, temperature excursion, or quantity discrepancy.
- **Grievance:** a participant requests action because an incident or other problem caused harm.
- **Dispute:** Admin accepts a grievance for formal resolution.

```text
Incident (optional) → Grievance → Admin triage → Dispute → Resolution
```

Keep these as separate UI records linked by ID.

## Accounts, Providers, and Visibility

- The interface uses one active actor context at a time.
- The demo user has access to every actor profile through a prominent **Switch role** control; do not combine role navigation.
- Role switching is a prototype demonstration device and does not represent production authorization.
- Transport and Storage accounts represent a provider organization with one or more assets. A single owner-driver or single facility is an organization with one asset.
- Public users see verification outcome and aggregated reliability indicators, never uploaded documents or private risk notes.
- Show the shared KisanMitra leaf verification mark immediately beside an Admin-approved person or organization name. Do not reuse it for crop quality, assessments, produce, payments, documents, or transaction status. Pending, rejected, suspended, and unverified profiles receive no identity badge.
- Transaction participants may see richer operational reliability relevant to their trade.
- Raw verification documents, private moderation notes, full dispute evidence, and fraud flags are Admin-only.
- Admin records confirmed behavior events; reliability displays recalculate from those events. Admin never edits the score directly.

## Initial UI Scope

Include:

- One-time, public Buyer requirements.
- Individually priced FPO services.
- English-only UI content.
- Layouts remain localization-ready without an initial language switcher.
- Dashboard shells for all seven actors.
- Three polished connected journeys: direct farmer sale, FPO procurement, and quantity-dispute resolution.
- One consistent Nashik red-onion fixture ecosystem across all roles.
- Generated realistic assets for the primary scenario, with neutral placeholders/icons for secondary records.

Defer:

- Recurring Buyer requirements.
- Invited requirements and preferred-supplier workflows.
- FPO service packages.
- Marathi, Hindi, and other localized UI content.

## Canonical Demo Scenario

- Crop: Nashik Red Onion.
- Farmer: Ramesh Patil, Nashik.
- Farmer produce: 4,280 kg, verified Grade A.
- Nearest mandi: Lasalgaon at ₹27.20/kg baseline.
- Buyer: MahaFresh Foods, requiring 20 tonnes of Grade A onion.
- Representative buyer offer: ₹29.50/kg.
- FPO: Nashik Farmers Producer Co.
- Quality record: `QA-204`.
- Main trade: `TR-1042`.
- Transport: 5-tonne vehicle on a Nashik-to-Pune route.
- Storage: Nashik Agri Warehouse.

All actor dashboards should reference this connected ecosystem where relevant so role switching preserves narrative continuity.

## Responsive Targets

- Optimize mobile layouts at 360 px, 390 px, and 430 px widths.
- Optimize desktop dashboards at 1280 px and above.
- Let tablet/intermediate layouts collapse naturally without a separate interface.
- Farmer is mobile-first; Buyer, FPO, Admin, Transport, and Storage are desktop-first but fully responsive. Quality field tasks prioritize mobile while review workflows support desktop.
