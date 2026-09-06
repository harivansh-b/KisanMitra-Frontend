# Farmer UI Specification

## Dashboard Goal

Help the farmer understand what produce they have, what it is worth now or later, which offer is most useful, what they must do next, and when payment will arrive.

## Primary Navigation

`Home`, `Produce`, `Market`, `Offers`, `Trades`, with `Services`, `Payments`, `Grievances`, and `Profile` under **More** on mobile.

## Home Dashboard

Show, in this order:

1. Urgent action card: harvest update, verification, expiring offer, pickup, or overdue payment.
2. Active produce and produce cards with lifecycle status.
3. Today's nearest-market baseline and expected net realization.
4. Best current buyer offer or FPO procurement opportunity.
5. Sell-now versus hold scenarios when applicable.
6. Active trade progress and next responsibility.
7. Recent notifications.

Primary actions: **Add expected produce**, **Record harvest**, **Request verification**, or **Review offers**, depending on state.

## Screens

### Produce

- List produce by the shared lifecycle: **Pre-harvest**, **Harvested**, **Quantity recorded**, **Quality assessment pending**, **Quality assessed**, **Storage / pickup pending**, **In transport**, **Delivered**, and **Transaction complete**.
- Present each item as an operational produce summary: crop and location, available quantity, lifecycle stage, harvest timing, verified quality state, post-harvest condition estimate, and recommended next action.
- Keep verified quality and estimated condition separate. A quality grade comes from an assessor report; the condition percentage is a clearly labelled UI estimate based on recorded harvest timing, handling, storage, and assessment status.
- Explain the basis beside every condition estimate and show no percentage before harvest. Never imply that the estimate is a laboratory or assessor-certified grade.
- Keep marketplace activity such as **Offers open** separate from the produce stage. Storage is optional and may be skipped when the confirmed trade moves directly to pickup.
- Add/edit pre-harvest facts: crop, variety, location, area, sowing date, harvest window, expected quantity, and money-needed-by.
- Record actual harvest quantity, photos, and farmer-declared quality.
- Make declared versus verified information visually distinct.

#### Add Produce Interaction

- **Add produce** uses one guided form from both the Overview and Produce workspace.
- Capture crop type, optional variety, current lifecycle stage, estimated or measured quantity, location, harvest/expected-harvest date, storage status, quality status, and optional notes.
- The form must support entry at different real-world starting points, including pre-harvest, harvested, quantity recorded, quality assessment pending, quality assessed, in storage, and storage/pickup pending.
- After submission, add the new produce to the Produce workspace and select the next action from its current state. In the frontend prototype this persists only for the current session.

### Produce or Produce Detail

- Summary, photos, quantities, harvest dates, perishability, ownership, and the shared produce-stage timeline. Clearly mark completed, current, and upcoming stages.
- Verification report or prominent verification-required state.
- Opening a produce must show the remaining service path from its current stage: **Harvesting support → Quantity measurement → Quality assessment → Storage / transport → FPO market linkage**. Hide completed services while allowing future services to be planned in advance.
- A pre-harvest produce may plan every later service. Once a stage is completed, its corresponding service is no longer offered as a new request.
- Each service opens a service-specific request form rather than a generic enquiry. Common information includes required date/window, response deadline, location, visibility, budget preference, and instructions.
- Before publishing, the Farmer chooses **Public request** or **Private request**. Public requests reach matching verified providers; private requests go only to the selected verified provider.
- Provider acceptance or a quote is a response, not a booking. The Farmer reviews and awards a response before a booking is confirmed. Service requests never transfer produce ownership.
- For expected or unverified produce, provide an opt-in control for pre-verification buyer matching. Opted-in interest is non-binding and exposes no offer/bid action.
- Assessment summary shows when and where it was performed, assessed quantity, validity window, and `Valid`, `Expiring`, or `Expired` state.

### Market Intelligence

- Nearest mandi baseline: price, distance, transport/handling estimate, and expected net.
- Local price trend, direct buyer demand, and matching FPO procurement campaigns.
- Sell today, hold, and storage scenarios ranked by expected net realization.
- Recommendation with reasons and uncertainty; farmer retains the decision.

### Auction and Listing

- **Start offer window** opens a seller-side proposal builder for one eligible produce already held by the Farmer; it does not create produce or immediately start a generic auction.
- Only harvested, Farmer-owned produce with recorded available quantity and valid quality assessment may be selected for a binding offer window. Pre-harvest, unassessed, fully reserved, in-transit, delivered, or sold produce is excluded.
- Crop, variety, available quantity, current location, lifecycle state, quality grade, and assessment specifications are derived from the selected Produce record and remain read-only. Changes require the corresponding measurement, reassessment, storage, reservation, or ownership update in Produce.
- The Farmer sets only commercial terms: minimum acceptable price, pickup date/window, payment timing, service responsibilities, partial-acceptance policy, rejection policy, and response deadline before previewing the complete proposal.
- The Farmer chooses **Public offer window** or **Private offer window** before saving a draft or publishing. Visibility becomes read-only after publication.
- A public offer window is discoverable by all eligible verified Buyers/FPOs. A private offer window is sent only to selected verified Buyers/FPOs, with recipients hidden from one another.
- Recipients submit complete offers against the same proposal terms. They may vary allowed negotiable fields, but cannot silently replace the Farmer's frozen non-negotiable terms.
- Start now or schedule; show a suggested response duration based on perishability.
- Live competitive-offer view with remaining time, offer count, **Best Net Offer**, **Highest Price**, **Best Payment Terms**, **Lowest Fulfilment Cost**, and early-accept action.
- Ranking is advisory and the farmer may select any valid bid. After selection, show **Accepted offer**, never winner.
- Publishing or receiving an offer does not create a trade. A trade is created only when the Farmer accepts a specific response and confirms its exact quantity and complete frozen terms.

### Offers and FPO Procurement

- Separate direct buyer offers from FPO procurement campaigns.
- Show a **Public Buyer requirement** only when the Farmer has eligible matching verified produce. The Farmer submits a supply proposal, but produce remains unreserved until the Buyer awards an exact quantity.
- Show a **Private Buyer direct offer** only when the Buyer selected the Farmer through matching verified produce. Do not reveal other recipients or responses.
- Both bid types show complete crop, quality, quantity, price, delivery, responsibility, payment, and expiry terms before a response.
- A private direct offer supports **Accept**, **Partially accept**, **Counter**, and **Decline**. Full or partial acceptance immediately reserves the exact quantity and fixes the Farmer as a contributor.
- When partially accepting or countering, limit the response to the produce's currently available quantity and show what remains available.
- A counter reserves nothing until the Buyer accepts it. If another acceptance fills the requirement first, show **Requirement filled** rather than a Farmer cancellation.
- Public proposals become trades only after Buyer award. Private accepted quantities become separate frozen trades immediately; the remainder stays available.
- Compare expected net, costs, pickup, payment timing, quantity tolerance, partial-acceptance rules, ownership-transfer event, transport-risk bearer, rejected-goods policy, responsibilities, and reliability.
- Offer detail supports accept, reject, and counteroffer.
- Private direct-offer acceptance confirmation displays the exact quantity, remaining Buyer requirement, complete terms, and warning that the accepted allocation cannot be casually replaced. Public proposal confirmation states that no trade exists until Buyer award.
- A procurement campaign shows the purchase price, qualifying grade, reservable quantity, collection window/location, payment timing, inbound transport terms, expiry, and downgrade/rejection rules.
- Committing quantity to an FPO creates a reservation; clearly show that the farmer keeps ownership until final verification and FPO purchase confirmation.
- After partial purchase, show the exact FPO-owned quantity and the remainder still owned and controlled by the farmer.
- After Farmer-to-FPO purchase completion, mark the sold quantity as transferred to the FPO and link to the ownership receipt. Keep it in Farmer history as read-only lineage; subsequent storage, allocation and transport actions belong to the FPO workspace.

### Services

- Show harvesting/FPO support, quantity measurement, quality assessment, storage, transport, and FPO market-linkage actions only when relevant to the produce stage or assigned trade responsibility.
- Group service requests and confirmed services by source produce. Each produce group expands to show its service checklist, response or booking state, schedule/cost, and the next available action.
- Provider comparisons emphasize suitability, availability, total cost, distance/ETA, and reliability.
- Service request history shows visibility, intended recipient, pending provider responses, accepted/declined responses, awarded provider, and booking state.
- Keep optional FPO services separate from FPO procurement; using a service does not require selling and does not transfer ownership.

### Trades, Delivery, and Payment

- Timeline from accepted offer through delivery, buyer receiving inspection, and payment.
- Frozen terms and explicit responsibility table.
- Payment breakdown: gross value, deductions, net payable, paid, pending, and due date.
- Receiving result shows delivered, accepted, and rejected quantities, evidence, tolerance, and any effect on payment.
- A buyer cannot silently downgrade independently verified quality; disagreements open reassessment or dispute.
- Completed sales history with crop, buyer/FPO, quantity, net amount, and payment state.
- An FPO purchase record ends the farmer's responsibility for the purchased quantity after transfer, except for payment visibility, history, dispute rights, or an explicit accepted obligation.
- Track FPO purchase payment independently from the FPO's later buyer sale.
- When a buyer/FPO marks payment as paid, show **Confirm receipt** and **Report partial/missing payment**. Completion requires farmer confirmation unless the fixture identifies an authoritative payment-provider confirmation.

### Incidents and Grievances

- Show operational incidents separately from complaints.
- Start a grievance from the related incident, trade, assessment, service, or payment when possible.
- Category, requested action, explanation, evidence, triage state, and any resulting dispute ID.
- Show admin evidence requests and the final explicit resolution without modifying the original farmer records.

## Key UI Rules

- Pre-harvest is calm and planning-oriented; post-harvest is urgency-oriented.
- Never present farmer-declared quality as verified.
- Place expected net above headline price in comparisons.
- Keep buyer reliability and payment timing separately visible.
- If another actor arranges a service, show progress without a booking action.
- Never present an FPO supply commitment as a completed sale or ownership transfer.
- Default direct-sale ownership transfer is buyer acceptance; payment is a separate obligation.

## Responsive Priorities

- Mobile: one task per step, large action targets, short summaries, sticky primary action, and card-based offer comparison.
- Desktop: overview plus detail, multi-offer comparison, market chart beside scenarios, and persistent trade timeline.
