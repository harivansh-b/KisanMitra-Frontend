# Locked UI Decisions

These decisions resolve cross-actor ambiguity for the frontend. They describe visible states, actions, and information; they do not define backend or service implementations.

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
- An expired assessment remains visible as history but returns the lot to **Assessment required** for binding offers or bids.
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

### Multi-Lot Fulfilment

- One shipment or storage booking may contain multiple items.
- Each item shows its trade, lot, quantity, pickup/check-in context, and item status.
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
- If a mock user has multiple actor profiles, show a simple **Switch role** control; do not combine role navigation.
- Transport and Storage accounts represent a provider organization with one or more assets. A single owner-driver or single facility is an organization with one asset.
- Public users see verification outcome and aggregated reliability indicators, never uploaded documents or private risk notes.
- Transaction participants may see richer operational reliability relevant to their trade.
- Raw verification documents, private moderation notes, full dispute evidence, and fraud flags are Admin-only.
- Admin records confirmed behavior events; reliability displays recalculate from those events. Admin never edits the score directly.

## Initial UI Scope

Include:

- One-time, public Buyer requirements.
- Individually priced FPO services.
- English-only UI content.
- Layouts remain localization-ready without an initial language switcher.

Defer:

- Recurring Buyer requirements.
- Invited requirements and preferred-supplier workflows.
- FPO service packages.
- Marathi, Hindi, and other localized UI content.
