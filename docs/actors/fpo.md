# FPO UI Specification

## Dashboard Goal

Help an FPO operate in two clearly separated modes:

1. **Service provider:** perform or coordinate paid services while the farmer keeps ownership and sale control.
2. **Crop buyer / procurer:** respond to buyer demand, secure farmer supply, purchase verified quantities, aggregate FPO-owned produce, fulfil the buyer trade, and manage both payment legs.

The current mode and crop owner must remain visible throughout the experience.

FPO verification should cover registration, operating region, member base, collection centres, service capabilities, and procurement capabilities. Restricted procurement or service actions must show the relevant verification requirement.

## Primary Navigation

Keep five primary destinations: `Home`, `Procurement`, `Inventory`, `Sales`, and `Services`.

- **Procurement** contains `Campaigns` and `Farmer supply` as contextual tabs.
- **Sales** contains `Open demand`, `Responses`, and `Confirmed trades` as contextual tabs.
- **Services** contains `Service requests` and active/catalogue `Services` as contextual tabs.
- Keep `Documents`, `Settings`, and demo controls directly visible in the desktop **Manage** section. Mobile navigation may group secondary destinations under **More** to preserve usable tap targets.
- Use icons only for the five primary destinations. Contextual tabs use text labels and retain the existing underlying screens and actions.

## Home Dashboard

Keep Home as a prioritization surface rather than a second copy of every workspace. Show, in this order:

1. One priority campaign with reserved, target, shortfall, deadline, and a direct Procurement action.
2. A maximum of five action-queue rows covering campaign shortfalls, Farmer collections, ownership handovers, delivery tasks, and overdue payments.
3. One compact commercial snapshot for the priority campaign.

Detailed campaign stages, Farmer rows, Buyer negotiations, inventory evidence, logistics and service jobs remain available in their grouped workspaces.

Primary actions: **Evaluate buyer demand**, **Create procurement campaign**, **Manage collection**, **Build FPO produce**, or **Review buyer offers**.

## Operating-Mode Entry

Use an explicit mode switch or clearly separated home sections:

- **Procurement & Sales** for ownership-changing purchases and buyer fulfilment.
- **Farmer Services** for independent paid services that do not transfer ownership.

Do not present service booking as a required step in procurement or imply that using an FPO service requires selling to that FPO.

## Procurement and Sales Screens

### Open Demand

- Review **Public Buyer requirements** when the FPO has eligible matching verified produce. The FPO submits a supply proposal that remains unreserved until Buyer award.
- Review **Private Buyer direct offers** only when the Buyer selected the FPO through matching verified produce. Keep the recipient list and other responses hidden.
- Show crop, variety, grade/specifications, requested quantity/tolerance, price, location, delivery date, responsibilities, payment, expiry, and buyer reliability for both bid types.
- A private direct offer supports **Accept**, **Partially accept**, **Counter**, and **Decline**. Acceptance immediately commits the exact quantity and fixes the FPO as a contributing seller, so the FPO should accept only against verified FPO-owned or already secured produce.
- A private counter reserves nothing until the Buyer accepts it. Public proposals may be conditional on securing farmer supply, but any condition must remain visible and must be satisfied before a Buyer award becomes a confirmed trade.
- Recurring bids and preferred-supplier lists are deferred.
- Opportunity detail shows expected buyer revenue; transport, storage, sorting, grading, packaging, and operating costs; intended FPO margin; and maximum feasible farmer price.
- For public requirements requiring aggregation, use `Proposal → Conditional supply → Buyer award → Supply confirmed → Confirmed trade`. For private direct offers use `Invited → Accepted quantity reserved → Confirmed trade`, with counters separately awaiting Buyer acceptance.
- In the conditional state, show frozen buyer price, target quantity, quality, delivery location, responsibilities, and condition deadline while farmer supply is reserved.
- Confirming the buyer trade is available only when supply, likely quality, timing, and projected margin are viable.
- Also surface public Farmer offer windows for produce the FPO can procure and private Farmer offer windows addressed to the FPO. Keep these visually distinct from Buyer demand because the FPO responds as a crop buyer, not as a seller.
- A Farmer offer window shows verified produce, available quantity, minimum price, pickup/payment expectations, responsibilities, expiry, and allowed negotiation fields. The FPO may submit an offer or permitted counterproposal; no purchase exists until the Farmer accepts an exact quantity and freezes the terms.

### Responses

- Show every public proposal, private acceptance, partial acceptance, counterproposal, decline, and conditional public proposal already sent to a Buyer.
- Keep the offered quantity, revised terms, response expiry, secured supply, remaining supply condition, and Buyer decision visible.
- A public proposal remains separate from a trade while awaiting Buyer award. A private full or partial acceptance immediately creates the allocation and moves its exact quantity to **Confirmed Trades**.
- Move public responses to **Confirmed Trades** only after the exact awarded quantity and frozen terms are available and any required supply condition has been satisfied.

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
- Completing the Farmer-to-FPO purchase creates an ownership receipt and a new FPO Produce record for the exact accepted quantity. It does not overwrite or repurpose the Farmer's source record.
- Route the new record into **Inventory** immediately. Its first action is determined by its condition, location, existing storage, Buyer allocation, and the responsibilities frozen in the purchase.

### FPO Inventory and Produce Workbench

- Treat this page as the operational home for produce after Farmer purchase completion. Show new ownership handovers first, followed by produce needing placement, in storage, buyer allocated, dispatch ready, and sold.
- Separate collected-but-not-owned, FPO-owned, buyer-ready, reserved, and sold quantities.
- Keep the default inventory row concise: identity, location, FPO-owned quantity, current operation, condition summary, and one recommended next action. Move assessment evidence, storage details, Buyer allocation, complete journey, and lineage into the detail drawer.
- Use a readable milestone journey rather than a generic percentage: `Farmer purchase → Receiving check → FPO ownership → Storage/dispatch → Buyer allocation → Delivery`.
- A handover detail shows the source Farmer, source Produce IDs, purchase ID, accepted quantity/grade, payment confirmation, ownership receipt and transfer time.
- From Inventory, expose stage-appropriate actions such as arrange storage, request transport, request reassessment, allocate to Buyer demand, split produce, merge compatible produce, confirm dispatch, or report an incident.
- Merge only compatible FPO-owned quantities using crop, variety, grade, size, harvest period, moisture, quality characteristics, and buyer specification.
- Split produce by grade, buyer allocation, or remaining availability.
- Every resulting produce retains its source farmer produce, purchase records, and ownership history.
- Produce detail shows quantity, grade, location, storage, availability, buyer allocation, lineage, and verification evidence.
- FPO ownership continues until the transfer event in a later FPO-to-Buyer trade. Storage custody or transport possession must never be displayed as ownership.

### Confirmed Trades

- Compare buyer offers using expected FPO net realization rather than headline price.
- Show price, quantity, quality requirement, pickup/delivery, payment timing, expiry, buyer reliability, and responsibility allocation.
- Expected FPO net includes buyer revenue minus farmer procurement, inbound/outbound transport, storage, sorting, grading, packaging, and operating costs.
- Direct-offer negotiation supports full acceptance, partial acceptance, decline, and counteroffer. Private Buyer-offer acceptance creates a frozen FPO-to-Buyer allocation immediately; public proposals require Buyer award.
- If one buyer requirement uses multiple sellers, keep the FPO trade independent while showing its allocation within the buyer's total requirement.
- Show public Buyer-awarded quantities and private accepted quantities with frozen commercial terms on this page; unanswered demand and uncommitted responses remain in **Open Demand** and **Responses** respectively.

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

- Keep **Service Requests** as the inbox for unawarded public/private requests and provider responses. Keep **Services** for awarded, scheduled, in-progress, completed, cancelled, or disputed jobs and the service catalogue.
- Receive public Farmer requests matched to the FPO's verified service capability and private requests addressed specifically to the FPO. Request detail shows the source produce, current stage, scope, field/location access, schedule, response deadline, handling needs, and Farmer instructions.
- Respond by accepting and quoting or declining. Acceptance remains a response until the Farmer awards it; only then show the work as a confirmed service job.
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
