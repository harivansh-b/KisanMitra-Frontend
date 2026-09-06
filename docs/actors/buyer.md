# Buyer UI Specification

## Dashboard Goal

Help a buyer define procurement demand, find matching verified supply, combine produce where needed, compare landed cost and seller reliability, agree complete terms, fulfil assigned tasks, inspect delivery fairly, and pay the final accepted amount.

Use one `Buyer` role. Show commercial subtype—trader, wholesaler, processor, retailer, exporter, institutional buyer, or government buyer—as profile information rather than separate dashboard architectures.

## Primary Navigation

`Home`, `Requirements`, `Matches`, `Offers`, `Purchases`, with `Payments`, `Grievances`, and `Profile` under **More** on mobile.

## Home Dashboard

Show, in this order:

1. Action queue: counteroffers, expiring bids, assigned service tasks, arriving deliveries, inspections, and payments due.
2. Active requirements with required, matched, committed, received, and remaining quantities.
3. Newly matched verified produce and procurement plans that need produce selection.
4. Open offers, auction bids, and seller responses.
5. In-transit purchases and delivery exceptions.
6. Deliveries awaiting receiving inspection.
7. Payment total due and procurement summary.

Primary actions: **Add requirement**, **Review matches**, **Make offer**, **Join auction**, or **Inspect delivery**.

## Profile and Verification

- Business/buyer name, buyer subtype, location, contact information, procurement regions, commonly purchased crops, typical quantities, and delivery locations.
- Verification summary may include fictional business registration, tax/GST, identity, address, and payment-history indicators.
- Keep verification status and reliability visible to sellers without exposing unnecessary details.
- An unverified buyer may browse, but requirement publishing, bidding, offers, and purchasing remain visibly locked until verification. The locked state links to missing verification information.

## Requirements

### Add or Edit Requirement

- Crop, variety, grade, crop-specific size/moisture/specifications, required quantity, quantity tolerance, required-by date, delivery location, target price, payment terms, transport/storage preferences, and expiry.
- The initial UI supports one-time public and private requirements from one builder. The Buyer chooses visibility before saving a draft or publishing; visibility is locked after publication.
- Publishing a requirement creates either a **Public requirement**, visible to every eligible Farmer/FPO with matching verified produce, or a **Private direct offer**, visible only to selected matched Farmer/FPO recipients.
- Recurring requirements and preferred-supplier lists are deferred and should not add initial navigation or form controls.

### Public and Private Bid Workflow

- Public requirement: `Draft → Published to eligible marketplace → Supply proposals → Buyer awards exact quantities → Separate trades`.
- Private direct offer: `Draft → Matching produce selected → Sent to selected sellers → Full/partial acceptances reserve quantity → Separate trades`.
- Private recipient selection is produce-led: match verified available produce first, then identify its Farmer or FPO owner. Do not invite a seller based only on their usual crop profile.
- Public sellers submit full or partial supply proposals or counterproposals. These do not reserve produce; the Buyer may award multiple exact quantities, and unselected proposals become **Not awarded** when sourcing closes.
- Private recipients may **Accept**, **Partially accept**, **Counter**, or **Decline**. Full or partial acceptance immediately reserves that quantity and fixes the seller as a contributor. The Buyer cannot replace an accepted seller except through the frozen cancellation, expiry, failure, or dispute rules.
- A private counter reserves nothing until the Buyer accepts it. Counter acceptance commits only the exact quantity still required; later acceptances cannot exceed the shared remaining balance.
- Each public award or private acceptance creates a separate seller trade with its own frozen quantity and terms.
- Other marketplace participants cannot see a private direct offer's terms, requested quantity, recipient list, responses, or commitments. The Buyer and Admin retain the necessary visibility.

### Requirement List and Detail

- Show `Draft`, `Active`, `Partially sourced`, `Fully sourced`, `Fulfilment`, `Completed`, `Paused`, and `Expired` states.
- Progress must separately show required, proposed/invited, committed, received, and remaining quantities, using labels appropriate to the visibility mode.
- Requirement detail combines match results, selected produce, active offers/trades, fulfilment progress, and landed-cost estimate.
- Private direct-offer cards show recipients sent, pending responses, accepted/partial/counter/declined counts, committed quantity, and remaining quantity. Accepted quantities count as committed immediately.
- When an FPO is reserving farmer supply, label its response provisional until supply is sufficient and the buyer deal is confirmed.

## Supply Discovery and Matching

### Match Results

- Match farmer and FPO supply in both directions using crop, variety, quality, quantity, distance, availability, delivery timing, asking price, seller reliability, and transport feasibility.
- Show match percentage with visible reasons; never use an unexplained score alone.
- Verified supply is preferred and eligible for formal offers/bids.
- Farmer-declared-only produce appears only through farmer-opted-in matching as **Upcoming / Unverified Produce**.
- Allowed actions are **Express interest** and **Request assessment**; binding offers and bids remain unavailable.

### Produce Detail and Comparison

- Seller/type, crop/variety, verified quantity and grade, location, harvest/availability date, asking price, photos, assessment report, and seller reliability.
- Farmer reliability may show quantity accuracy, quality match, readiness, cancellations, completed trades, and disputes.
- FPO reliability may show fulfilment rate, delivered-versus-committed quantity, quality match, completed trades, and disputes.
- Compare source price, quality, distance, seller reliability, fulfilment timing, and total landed acquisition cost.

## Requirement Sourcing Control

- Start by choosing one published requirement and display its sourcing mode, ID, crop/grade, quantity, price, destination, delivery date, and deadline throughout.
- For a public requirement, open directly into proposal comparison. Show seller, verified Produce, quantity, price, fulfilment terms, reliability and landed cost; allow exact split awards up to the remaining requirement.
- For a private direct offer, let the Buyer choose the top matched sellers, a smaller preset, or a manual recipient set from verified available produce.
- Keep recipient identities private from one another and show why each produce matched.
- Allow a per-recipient maximum and show invited capacity before sending. Accepted quantities reserve immediately, so each later acceptance is capped by the shared remaining requirement.
- Present accepted and partially accepted private allocations as locked. The Buyer decides only on counters; accepting a counter commits the exact allowed quantity.
- When a private requirement becomes full, close pending invitations as **Requirement filled** rather than **Cancelled**. When a public requirement becomes full, mark unselected proposals **Not awarded**.
- Show each selected produce's seller, quantity, verification, response/trade state, landed-cost contribution, and delivery compatibility.
- Automatic optimization is not required for the initial UI.

## Offers, Buyer Bids, and Auctions

Keep these concepts visibly distinct:

- **Public requirement:** an open sourcing event in which sellers submit supply proposals and the Buyer awards exact quantities.
- **Private direct offer:** fixed Buyer terms sent only to selected matched sellers; acceptance reserves immediately.
- **Seller response:** public supply proposal, private full/partial acceptance, counter, or decline.
- **Buyer award:** the action that turns a public proposal and exact quantity into a trade.
- **Auction bid:** a Buyer's complete offer inside a seller-run competitive offer window.

### Direct Offer

- Buyer can make an offer on a verified farmer or FPO produce.
- Standard terms include price, quantity, grade/specifications, quantity tolerance, pickup, delivery location, payment timing, expiry, partial-acceptance rules, and transport/storage/quality responsibilities.
- Preview expected crop cost, buyer-paid services, handling, and total landed cost before submission.

### Auction Participation

- Marketplace discovery includes public Farmer offer windows. A private Farmer offer window appears only when the Buyer was explicitly selected as a recipient; other recipients remain hidden.
- Offer-window detail shows the verified produce, available quantity, Farmer's minimum price and frozen terms, pickup and payment expectations, responsibilities, closing time, and bid activity appropriate for the UI.
- Every bid includes complete commercial terms, not price alone.
- The Buyer may submit a conforming offer or a permitted counterproposal. Submission does not create a trade; only the Farmer's explicit acceptance of an exact quantity does.
- Show the buyer's advisory rank by estimated seller net and comparison labels; do not use winner, winning, outbid, or highest-bidder language. A selected bid becomes **Accepted offer**.

### Negotiation

- Buyer can revise price, quantity, responsibilities, pickup/delivery, payment timing, tolerance, and quality conditions.
- Display seller counters and complete revision history without overwriting earlier versions.
- A private full or partial acceptance immediately creates the seller allocation and frozen trade. A public proposal requires a Buyer award.
- Private counter acceptance and public award confirmation show the complete terms and exact committed quantity.
- Any later change requires an explicit mutually accepted amendment.

## Landed Cost

Use total landed acquisition cost as the primary economic comparison:

```text
Crop purchase
+ Buyer-paid transport
+ Buyer-paid storage
+ Buyer-paid handling/services
= Total landed acquisition cost
```

Show both total and per-unit landed cost. Keep seller reliability separate from cost so the buyer can understand the trade-off.

## Quality Assessment

- Assessment detail shows grade, verified quantity, date, authorized assessor, crop-specific measurements, observations, photos, and report/certificate.
- An expired report remains visible as history but the produce returns to **Assessment required** before a binding offer or bid.
- Buyer may request an official assessment when only farmer-declared quality is available; the UI must state who requested and who pays.
- After assessment, buyer may continue, renegotiate, or reject before trade acceptance.
- After delivery, a disagreement with verified quality must open reassessment/dispute; the buyer cannot directly replace the verified grade.

## Fulfilment and Assigned Services

- Trade detail shows frozen terms, ownership-transfer condition, responsibility table, assessment, pickup, delivery, receiving, payment, amendments, and exception timeline.
- Transport/storage provider selection appears only when the buyer is the assigned arranger.
- If the seller arranges a service, show status and evidence without a buyer booking action.
- Arranging transport or storage does not imply current ownership; display owner and responsibility separately.
- Default ownership transfer is buyer acceptance. Show transport-risk bearer separately from ownership, arranger, and payer.

## Delivery and Receiving Inspection

- Track `Pickup scheduled`, `Picked up`, `In transport`, `Arriving`, and `Delivered` with ETA, location context, and proof.
- Receiving inspection records expected, delivered, accepted, and rejected quantity; quality/specification result; damage/condition; delivery time; and evidence.
- Evaluate delivery against the frozen quantity tolerance.
- Support full acceptance, agreed partial acceptance, or dispute.
- Grade-based partial acceptance may apply an agreed lower-grade price or reject that portion only when permitted by accepted terms.
- Any unsupported quality downgrade or adjustment routes to evidence-backed reassessment/dispute.
- Rejected quantity remains seller-owned by default. Show return arranger/payer, storage payer, collection deadline, fallback action, and any fault exception before finalizing the inspection.

## Payments and History

- Calculate final payable amount from accepted quantity and agreed price/partial-acceptance rules.
- Show gross crop value, buyer-responsible service charges, adjustments, final payable, paid, pending, and due date.
- Payment states: `Pending`, `Buyer marked paid`, `Seller confirmed`, `Completed`, `Partially paid`, `Overdue`, and `Disputed`.
- Marking payment paid requires amount and reference/evidence; it notifies the seller to confirm receipt or report a problem.
- Buyer and seller views must display the same transaction payment status.
- Purchase history supports spend, purchased quantity, average landed cost, crop totals, supplier performance, rejection rate, and buyer payment performance.

## Deferred Supplier Features

- Preferred-supplier lists and recurring requirements are Phase 2 and do not appear in the initial navigation. Private recipient selection by current verified-produce match is part of the initial UI.

## Incidents, Grievances, and Notifications

- Record delivery or service problems as incidents.
- Raise a grievance when the buyer requests action; Admin triage may create a formal dispute.
- Categories include quantity shortfall, quality/variety mismatch, damage, late delivery, seller cancellation, missing documents, and transport/storage damage.
- A formal dispute combines frozen terms, quality report, receiving record, photos, transport history, messages, and payment record.
- Notifications cover new matches, seller counteroffers, accepted offers, auction changes, service confirmation, shipment ETA, inspection required, and payment due.

## Key UI Rules

- Start with buyer demand and matched supply, not marketplace browsing alone.
- Prefer verified produce for formal procurement.
- Support one requirement with multiple produce records and partial quantities.
- Compare options by landed cost while keeping seller reliability separately visible.
- Offers and bids always include full commercial terms.
- Assign service actions dynamically per trade.
- Keep responsibility separate from ownership.
- Freeze accepted terms and preserve negotiation history.
- Receiving inspection cannot silently override independent verified quality.
- Apply tolerance and partial-acceptance rules agreed before delivery.

## Responsive Priorities

- Mobile: requirement creation, match cards, saved filters, offer/bid actions, shipment tracking, receiving inspection, evidence capture, and payment tasks.
- Desktop: demand-to-supply workspace, multi-produce selection, dense comparison, landed-cost breakdown, auction/negotiation monitoring, purchase operations, and procurement analytics.
