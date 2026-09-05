# Farmer UI Specification

## Dashboard Goal

Help the farmer understand what produce they have, what it is worth now or later, which offer is most useful, what they must do next, and when payment will arrive.

## Primary Navigation

`Home`, `Produce`, `Market`, `Offers`, `Trades`, with `Services`, `Payments`, `Grievances`, and `Profile` under **More** on mobile.

## Home Dashboard

Show, in this order:

1. Urgent action card: harvest update, verification, expiring offer, pickup, or overdue payment.
2. Active produce and lot cards with lifecycle status.
3. Today's nearest-market baseline and expected net realization.
4. Best current buyer offer or FPO procurement opportunity.
5. Sell-now versus hold scenarios when applicable.
6. Active trade progress and next responsibility.
7. Recent notifications.

Primary actions: **Add expected produce**, **Record harvest**, **Request verification**, or **Review offers**, depending on state.

## Screens

### Produce

- List estimated produce, harvested produce, and verified lots separately.
- Add/edit pre-harvest facts: crop, variety, location, area, sowing date, harvest window, expected quantity, and money-needed-by.
- Record actual harvest quantity, photos, and farmer-declared quality.
- Make declared versus verified information visually distinct.

### Produce or Lot Detail

- Summary, photos, quantities, harvest dates, perishability, ownership, and status timeline.
- Verification report or prominent verification-required state.
- Contextual actions only: update harvest, request assessment, book pre-sale storage, or list verified lot.
- For expected or unverified produce, provide an opt-in control for pre-verification buyer matching. Opted-in interest is non-binding and exposes no offer/bid action.
- Assessment summary shows when and where it was performed, assessed quantity, validity window, and `Valid`, `Expiring`, or `Expired` state.

### Market Intelligence

- Nearest mandi baseline: price, distance, transport/handling estimate, and expected net.
- Local price trend, direct buyer demand, and matching FPO procurement campaigns.
- Sell today, hold, and storage scenarios ranked by expected net realization.
- Recommendation with reasons and uncertainty; farmer retains the decision.

### Auction and Listing

- Verified-lot check before entry.
- Start now or schedule; show suggested duration based on perishability.
- Live competitive-offer view with remaining time, offer count, **Best Net Offer**, **Highest Price**, **Best Payment Terms**, **Lowest Fulfilment Cost**, and early-accept action.
- Ranking is advisory and the farmer may select any valid bid. After selection, show **Accepted offer**, never winner.

### Offers and FPO Procurement

- Separate direct buyer offers from FPO procurement campaigns.
- Compare expected net, costs, pickup, payment timing, quantity tolerance, partial-acceptance rules, ownership-transfer event, transport-risk bearer, rejected-goods policy, responsibilities, and reliability.
- Offer detail supports accept, reject, and counteroffer.
- Acceptance confirmation displays all terms before freezing them.
- A procurement campaign shows the purchase price, qualifying grade, reservable quantity, collection window/location, payment timing, inbound transport terms, expiry, and downgrade/rejection rules.
- Committing quantity to an FPO creates a reservation; clearly show that the farmer keeps ownership until final verification and FPO purchase confirmation.
- After partial purchase, show the exact FPO-owned quantity and the remainder still owned and controlled by the farmer.

### Services

- Show quality, storage, or transport actions only when relevant to the lot or assigned trade responsibility.
- Provider comparisons emphasize suitability, availability, total cost, distance/ETA, and reliability.
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
