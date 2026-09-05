# FPO UI Specification

## Dashboard Goal

Help an FPO operate in two clearly separated modes:

1. **Service provider:** perform or coordinate paid services while the farmer keeps ownership and sale control.
2. **Crop buyer / procurer:** respond to buyer demand, secure farmer supply, purchase verified quantities, aggregate FPO-owned produce, fulfil the buyer trade, and manage both payment legs.

The current mode and crop owner must remain visible throughout the experience.

FPO verification should cover registration, operating region, member base, collection centres, service capabilities, and procurement capabilities. Restricted procurement or service actions must show the relevant verification requirement.

## Primary Navigation

`Home`, `Buyer Demand`, `Procurement`, `Inventory`, `Buyer Sales`, with `Services`, `Payments`, `Disputes`, and `Profile` under **More** on mobile.

## Home Dashboard

Show, in this order:

1. Action queue: buyer opportunity decisions, campaign shortfalls, collections, verification gaps, delivery tasks, and overdue payments.
2. Active procurement campaigns with target, committed, collected, verified, purchased, and still-required quantities.
3. Relevant buyer demand and commercial viability summary.
4. FPO-owned inventory, produce awaiting split/merge, and buyer-ready produce.
5. Pending inbound transport, storage, outbound transport, and deliveries.
6. Farmer payments and buyer receivables as separate summaries.
7. Active service-provider jobs.

Primary actions: **Evaluate buyer demand**, **Create procurement campaign**, **Manage collection**, **Build FPO produce**, or **Review buyer offers**.

## Operating-Mode Entry

Use an explicit mode switch or clearly separated home sections:

- **Procurement & Sales** for ownership-changing purchases and buyer fulfilment.
- **Farmer Services** for independent paid services that do not transfer ownership.

Do not present service booking as a required step in procurement or imply that using an FPO service requires selling to that FPO.

## Procurement and Sales Screens

### Buyer Demand

- Browse buyer requirements by crop, variety, grade/specifications, quantity/tolerance, price, location, delivery date, payment, visibility, recurrence, and buyer reliability.
- The initial UI uses public, one-time requirements; invited and recurring requirements are deferred.
- Opportunity detail shows expected buyer revenue; transport, storage, sorting, grading, packaging, and operating costs; intended FPO margin; and maximum feasible farmer price.
- Use `Interested → Conditional commitment → Confirmed trade`, with `Expired` when the supply condition is not met.
- In the conditional state, show frozen buyer price, target quantity, quality, delivery location, responsibilities, and condition deadline while farmer supply is reserved.
- Confirming the buyer trade is available only when supply, likely quality, timing, and projected margin are viable.

### Procurement Campaigns

- Create a concrete offer with crop/variety, target quantity, minimum grade, purchase price, collection location/window, payment timing, inbound transport arranger/payer, expiry, tolerance, and downgrade/rejection rules.
- Link the campaign to the active conditional Buyer–FPO commitment so its frozen buyer terms and supply deadline remain visible.
- Campaign list shows `Draft`, `Accepting commitments`, `Target shortfall`, `Supply reserved`, `Collection`, `Verification`, and `Completed` states.
- Campaign progress must separately display target, committed, collected, verified, purchased, rejected, and remaining quantities.
- Farmer commitments are reservations; label farmer ownership clearly until the purchase is finalized.

### Farmer Commitments and Collection

- Commitment row shows farmer, verified source produce, available quantity, reserved quantity, collection schedule, and status.
- Allow a commitment to be released, expire, or result in partial purchase without losing the source record.
- Collection view coordinates inbound transport, arrival, actual quantity, inspection status, and evidence.
- When verification differs from commitment, show grade/quantity breakdown and the campaign's agreed downgrade or rejection rules.
- Collection performs a lightweight identity, quantity, damage, and quality-deviation check. Show whether the existing assessment is still valid and request reassessment only when expired or materially inconsistent.

### Purchase Confirmation

- Review the final accepted quantity by grade, purchase price, gross amount, service deductions if agreed, net payable, and payment timing.
- Support full purchase, partial purchase, lower-grade counter terms, and rejected remainder.
- Confirmation records the exact ownership transfer from farmer to FPO.
- The unpurchased quantity remains in a farmer-owned produce.

### FPO Inventory and Produce Workbench

- Separate collected-but-not-owned, FPO-owned, buyer-ready, reserved, and sold quantities.
- Merge only compatible FPO-owned quantities using crop, variety, grade, size, harvest period, moisture, quality characteristics, and buyer specification.
- Split produce by grade, buyer allocation, or remaining availability.
- Every resulting produce retains its source farmer produce, purchase records, and ownership history.
- Produce detail shows quantity, grade, location, storage, availability, buyer allocation, lineage, and verification evidence.

### Buyer Offers and Sales

- Compare buyer offers using expected FPO net realization rather than headline price.
- Show price, quantity, quality requirement, pickup/delivery, payment timing, expiry, buyer reliability, and responsibility allocation.
- Expected FPO net includes buyer revenue minus farmer procurement, inbound/outbound transport, storage, sorting, grading, packaging, and operating costs.
- Negotiation supports accept, reject, and counteroffer; accepted terms become a frozen FPO-to-buyer trade.
- If one buyer requirement uses multiple sellers, keep the FPO trade independent while showing its allocation within the buyer's total requirement.

### Fulfilment

- Track storage before/during aggregation, inbound and outbound transport legs, delivery, buyer receiving inspection, acceptance/partial acceptance, and payment.
- Expose booking actions only when the FPO is the assigned arranger.
- Distinguish arranger, payer, and provider for transport/storage, and requester, payer, and assessor for quality.
- For the FPO-to-buyer trade, show buyer-acceptance ownership transfer by default and display transport-risk bearer separately.

### Payments and Purchase Records

- **Farmer payments:** verified quantity, agreed price, gross, deductions, net payable, paid, pending, and due date per purchase.
- **Buyer receivables:** FPO-to-buyer invoice value, adjustments, received, pending, and due date per trade.
- A farmer payment must not depend on buyer payment unless that dependency was explicitly included in accepted farmer terms.
- Each Farmer-to-FPO purchase and Buyer-to-FPO sale has a separate payment obligation with `Buyer/FPO marked paid → Seller confirmed → Completed` states.
- Purchase history retains farmer, source produce, quantity/grade, price, payment terms, transfer time, collection location, campaign, and resulting FPO produce.

## Farmer Services Screens

### Service Catalogue

- Individual offerings may include harvesting labour/equipment, quantity measurement, preliminary checks, assessor coordination, sorting, grading, packaging, transport arrangement, and storage arrangement.
- Each service shows scope, availability, service area, prerequisites, and transparent pricing before request.
- The initial UI supports individually priced services only; service packages are deferred.

### Service Requests and Jobs

- Queue by requested, quoted, scheduled, in progress, evidence required, completed, cancelled, and disputed.
- Job detail shows farmer-owned produce, service scope, price, assigned provider/coordinator, schedule, evidence, payment, and status timeline.
- Quality coordination must identify the independent authorized assessor; the FPO is not automatically the official grading authority.

## Incidents, Grievances, Disputes, and Notifications

- Disputes may involve buyer non-payment/rejection/cancellation, quantity or quality mismatch, farmer mismatch, transport/storage damage, or provider failure.
- Keep campaign terms, purchase records, verified reports, frozen buyer terms, service evidence, and payments available as case evidence.
- Notifications cover matching buyer demand, campaign commitment progress, target reached, collection/verification tasks, buyer offers, service confirmations, delivery acceptance, and farmer/buyer payment exceptions.
- A buyer quality disagreement must preserve the official report and route to reassessment/dispute; partial acceptance follows frozen tolerance and downgrade/rejection rules.
- Operational failures are incidents; an FPO request for action is a grievance; Admin acceptance creates the formal dispute.

## Key UI Rules

- Always distinguish `Service Provider` from `Crop Buyer / Procurer` mode.
- Services do not transfer ownership; a finalized procurement purchase does.
- Secure sufficient farmer reservations before final buyer commitment.
- A reservation is not a purchase, and physical aggregation occurs only after purchase.
- Require final quantity and quality verification before ownership transfer.
- Support partial purchase and exact ownership splitting.
- Preserve source-produce traceability across every split and merge.
- Keep farmer payment independent from the later buyer trade.
- Assign quality, storage, and transport actions by ownership, relationship, responsibility, and current state.

## Responsive Priorities

- Mobile: opportunity alerts, commitment/collection updates, verification decisions, purchase confirmation, task completion, and payment exceptions.
- Desktop: buyer-demand economics, campaign pipeline, quantity reconciliation, produce split/merge workbench, offer comparison, fulfilment operations, and two-sided payment tracking.
