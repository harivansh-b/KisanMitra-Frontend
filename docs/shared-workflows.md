# Shared Workflows

## Direct Farmer-to-Buyer Flow

```text
Buyer creates a demand or selects a verified produce
  → Matching identifies suitable farmer/FPO supply
  → Buyer selects one or more produce and quantities
  → Buyer makes a direct offer or joins an auction
  → Seller compares, counters, rejects, or accepts
  → Accepted terms become a frozen trade
  → Assigned quality, storage, and transport tasks are completed
  → Produce is delivered for buyer receiving inspection
  → Buyer accepts, partially accepts under agreed rules, or opens a dispute
  → Ownership transfers on buyer acceptance by default
  → Rejected quantity remains seller-owned and follows the frozen return policy
  → Final payment is calculated from accepted terms and quantities
  → Payment is tracked to completion
  → Any actor may raise a relevant grievance
```

Seller preparation before the buyer flow:

```text
Farmer records expected produce
  → Farmer records harvest and actual quantity
  → Quality Assessor inspects the produce
  → Verified produce becomes market-ready
  → Farmer or FPO publishes the verified produce
```

## FPO Procurement and Aggregation Flow

```text
Buyer posts a requirement
  → FPO expresses interest
  → Buyer and FPO freeze a conditional commitment and supply deadline
  → FPO evaluates costs, margin, and feasible procurement price
  → FPO creates a concrete procurement campaign
  → Farmers reserve verified quantities while retaining ownership
  → FPO converts the conditional commitment to a confirmed trade only after sufficient supply is reserved
  → Produce is collected and final quantity/quality is verified
  → FPO finalizes full or partial purchases and pays each farmer
  → Exact purchased quantities transfer from farmer to FPO
  → Ownership receipt creates a new FPO Produce record with source lineage
  → New FPO Produce enters the Inventory workbench for placement and condition decisions
  → FPO merges only compatible, FPO-owned quantities
  → FPO completes assigned storage and inbound/outbound transport
  → FPO delivers to the buyer and ownership transfers under the buyer trade
  → Buyer payment to the FPO is tracked separately
```

The handover boundary is explicit: the Farmer source Produce retains its historical identity, while the purchased quantity is represented by a new FPO-owned Produce linked through the purchase and ownership receipt. The FPO then controls storage, handling, allocation and transport subject to the relevant frozen responsibilities. Custody by a warehouse or transporter does not change ownership. A later Buyer trade creates a second, separate ownership transfer under its own accepted terms.

## FPO Service Flow

```text
Farmer reviews an FPO service and its price
  → Farmer requests an individual service or explicit package
  → FPO confirms and performs or coordinates the service
  → Evidence, status, and payment are recorded
  → Farmer continues to own and control the produce
```

## Produce-led Service Request Flow

```text
Farmer opens a produce
  → UI shows only current and future stage-relevant services
  → Farmer completes a service-specific requirement
  → Farmer publishes publicly or privately to one verified provider
  → Matching provider receives the request and accepts/quotes or declines
  → Farmer reviews and awards a provider response
  → Award creates the service booking/job
  → Evidence and completion update the produce journey without transferring ownership
```

Public provider requests are discoverable only by verified providers with a matching capability, crop/handling fit, region and availability. Private requests expose the request only to the selected provider. In both cases, a provider response is non-binding until the Farmer awards it.

## Primary Lifecycles

### Participant Verification

```text
Pending → Under review → Verified
```

Alternative states: `Needs more information`, `Rejected`, and `Suspended`.

The review loop is `Submitted → Admin review → More information requested → Applicant resubmits → Review continues`. Buyer, FPO, transport, storage, and quality-assessor reviews use role-specific evidence. Farmer verification may remain lighter. Verification status must determine access to trusted marketplace actions.

### Buyer Demand

```text
Public:  Draft → Published → Supply proposals → Buyer awards exact quantities → Trades
Private: Draft → Recipients selected → Direct offers sent → Accepted quantities reserved → Trades
```

Alternative states: `Paused`, `Expired`, and `Cancelled`.

The initial UI supports one-time public and private requirements from the same requirement builder. Visibility is selected before saving or publishing and becomes read-only after publication. Public requirements collect non-reserving supply proposals; the Buyer compares responses and awards exact quantities. Private requirements behave as direct offers to selected verified produce owners: a full or partial acceptance immediately reserves the accepted quantity and fixes that seller as a contributor. A counter reserves nothing until the Buyer accepts it. Recurring and preferred-supplier demand remain future states.

The Buyer requirement workspace shows visibility, pending responses, committed produce, and remaining quantity. For public requirements, committed means Buyer-awarded quantity. For private direct offers, committed means seller-accepted quantity. Once a private requirement is full, unanswered invitations close as **Requirement filled**; they are not seller cancellations.

### Farmer Offer Window

```text
Draft → Publicly listed / Privately invited → Buyer/FPO responses
→ Farmer selects a response → Exact quantity accepted → Trade created
```

The Farmer starts an offer window from one eligible Produce record already in the Farmer's possession and publishes a complete seller proposal. Crop, variety, available quantity, location, lifecycle state, grade, and assessment evidence are inherited read-only from Produce; the offer window cannot be used to create or rewrite inventory facts. Public windows are discoverable by all eligible verified Buyers/FPOs; private windows go only to selected verified recipients, whose identities and responses remain hidden from one another. Both use the same agreement and counterproposal primitives as Buyer requirements, with the commercial direction reversed: the Farmer is the seller and the responding Buyer/FPO is the purchaser.

Responses are compared by estimated Farmer net return, price, payment timing, and fulfilment cost. Ranking remains advisory. Publishing, invitation, or response submission does not create a trade; only the Farmer's acceptance of an exact quantity and frozen terms does. Unaccepted quantities remain available.

### Supply Match and Multi-Produce Plan

One demand may reference multiple produce records and partial quantities. Public responses are compared and awarded by the Buyer. Private recipients accept, partially accept, counter, or decline; acceptance reserves immediately up to the remaining requirement. The UI must continuously show proposed or invited, committed, received, and remaining quantities without combining the two sourcing modes.

Farmer-opted-in unverified produce follows `Matched as upcoming → Expressed interest/Assessment requested → Verified`. It cannot enter binding offer or bidding states.

### Produce and Produce

```text
Pre-harvest → Harvested → Quantity recorded → Quality assessment pending
→ Quality assessed → Storage / pickup pending → In transport → Delivered
→ Transaction complete
```

`Offers open`, `Offer accepted`, and similar marketplace states are shown separately from the produce lifecycle. Storage is optional: when it is not required, the produce proceeds from quality assessment or trade confirmation to pickup pending. A delivered produce remains at `Delivered` until the relevant payment obligation is confirmed; only then does it become `Transaction complete`.

Exception states: `Verification failed`, `Withdrawn`, `Expired`, `Cancelled`, and `Disputed`.

### Offer and Negotiation

```text
Draft → Submitted → Countered → Accepted
```

Alternative terminal states: `Rejected`, `Withdrawn`, and `Expired`.

An accepted offer must display a read-only snapshot of price, quantity, quality requirement, delivery location, pickup window, payment terms, and service responsibilities.

Auction offers are ranked by estimated seller net for guidance only. Seller selection changes a bid to **Accepted offer**; the UI never labels it winner.

The shared negotiation UI must preserve direction and authority: a public Buyer requirement ends with a Buyer award, a private Buyer direct offer commits on seller acceptance, and a Farmer offer window ends with Farmer acceptance. Public/private visibility, complete terms, version history, counterproposals, exact quantities, expiry, and read-only accepted snapshots remain shared primitives.

### FPO Buyer Commitment

```text
Interested → Conditional commitment → Confirmed trade
                              └──────→ Expired
```

Conditional price, target quantity, quality, delivery location, responsibilities, and expiry are read-only until confirmation or expiry.

### FPO Procurement Campaign

```text
Draft → Published → Accepting commitments → Supply reserved
→ Buyer deal confirmed → Collection/verification → Procurement completed
```

Exception states: `Target shortfall`, `Expired`, `Paused`, and `Cancelled`.

### Farmer Supply Commitment

```text
Reserved → Collection scheduled → Collected → Verification complete
→ Purchase confirmed → Farmer paid
```

Alternative states: `Partially purchased`, `Downgraded offer pending`, `Rejected quantity`, `Released`, and `Cancelled`.

The farmer owns the committed quantity until purchase confirmation. A commitment must show reserved quantity, remaining available quantity, expiry, and procurement terms.

### FPO-Owned Produce

```text
Purchased quantity → Available for aggregation → Merged or split
→ Market-ready → Reserved for buyer → Fulfilment → Transferred to buyer
```

Every split or merge must preserve source-produce and purchase-record lineage.

### Trade

```text
Offer accepted → Tasks assigned → Pickup scheduled → Picked up
→ In transport → Delivered → Receiving inspection
→ Accepted/Partially accepted → Ownership transferred
→ Payment pending → Buyer marked paid → Seller confirmed → Completed
```

Exception states: `Delivery exception`, `Buyer rejection`, `Reassessment requested`, `Payment overdue`, `Cancelled`, and `Disputed`.

### Receiving Inspection

```text
Awaiting delivery → Delivered → Inspection in progress
→ Accepted / Partially accepted / Disputed → Finalized
```

Record expected, delivered, accepted, and rejected quantities; condition; specification result; evidence; reason; and whether the outcome is inside agreed tolerance. A quality disagreement routes to reassessment/dispute rather than overwriting the verified report.

Rejected quantity remains seller-owned by default. The receiving view must expose return arranger/payer, temporary-storage payer, collection deadline, fallback action, and any fault-based exception.

### Quality Assessment

```text
Requested → Assigned → Scheduled → Inspection in progress
→ Report submitted → Valid → Expiring → Expired
```

Exception states: `More evidence needed`, `Failed`, `Cancelled`, and `Reassessment requested`.

Assessment detail shows time, location, crop, quantity, validity window, requester, and payer. Collection/receiving performs a lightweight identity, quantity, damage, and deviation check; an expired or materially inconsistent assessment routes to reassessment. Dispute reassessment uses another assessor where available.

### Storage Booking

```text
Quote requested → Quoted → Confirmed → Check-in due
→ Stored → Check-out due → Released → Completed
```

Exception states: `Capacity changed`, `Condition incident`, `Cancelled`, and `Disputed`.

A booking may contain multiple storage items. Each item references its produce, trade, quantity, check-in/out context, and status.

### Shipment / Transport Job

```text
Quote requested → Quoted → Confirmed → Vehicle assigned
→ Pickup due → Picked up → In transport → Delivered → Completed
```

Exception states: `Delayed`, `Failed pickup`, `Damage reported`, `Cancelled`, and `Disputed`.

A shipment may contain multiple items and pickup locations while preserving each item's produce, trade, quantity, and handoff evidence.

### Incident

```text
Recorded → Acknowledged → Monitoring → Closed
```

An incident may remain an operational record or be referenced by a grievance.

### Grievance

```text
Draft → Submitted → Admin triage → Accepted as dispute / Resolved without dispute
```

Alternative states: `Information requested`, `Withdrawn`, and `Closed`.

### Dispute

```text
Open → Evidence assembled → Under review
→ Additional evidence/Reassessment if needed → Decision
→ Corrective action → Resolved → Closed
```

Alternative state: `Reopened`.

Possible explicit decisions include no action, full/partial payment, quantity adjustment, quality reassessment, service-charge refund, warning, a confirmed behavior event, restriction, suspension, or a linked transaction correction. Original records remain immutable; any reliability score is recalculated from confirmed events.

### Moderation Action

```text
Proposed → Reason confirmed → Applied → Active → Expired/Revoked
```

Actions may include warning, temporary restriction/suspension, bidding or provider restriction, permanent disablement, and restoration. Every transition creates an audit event.

## Cross-Actor Handoffs

| Trigger | From | To | Receiving UI must show |
| --- | --- | --- | --- |
| Verification submitted | Participant | Admin | Actor type, regional/business/service evidence, missing items, risk flags, history |
| More information requested | Admin | Participant | Missing evidence, request reason, due date, and resubmission action |
| Verification decided | Admin | Participant | Result, reason, effective permissions, restrictions, and review timestamp |
| Requirement published/invited | Buyer | Eligible or invited sellers/FPOs | Crop/specification, quantity/tolerance, location/date, price, payment, preferences, expiry |
| Supply matched | Platform fixture | Buyer | Match reasons, available quantity, verification, landed-cost inputs, seller reliability |
| Interest expressed on unverified produce | Buyer | Farmer | Non-binding buyer identity/need, expiry, and assessment-request option |
| Assessment requested | Farmer/FPO/Buyer | Quality Assessor | Produce, location, required checks, deadline, contact context |
| Report submitted | Quality Assessor | Produce owner and relevant buyer | Grade, quantity, evidence, exceptions, report identity |
| Produce listed | Farmer/FPO | Buyer | Verified specifications, available quantity, location, timing, terms |
| Offer submitted | Buyer/FPO | Seller | Net realization, responsibilities, payment timing, reliability, expiry |
| Offer accepted | Seller | All trade participants | Frozen terms, next task, owner, due time |
| Procurement campaign published | FPO | Eligible farmers | Price, target/available quantity, grade, collection, payment, transport, downgrade/rejection rules |
| Supply committed | Farmer | FPO | Reserved quantity, source produce, verification, ownership, and campaign shortfall |
| Procurement target reached | Farmers | FPO | Committed/collected/verified totals and buyer-confirmation action |
| Conditional commitment proposed/accepted | Buyer/FPO | Buyer/FPO | Frozen commercial terms, supply condition, deadline, and provisional status |
| FPO purchase finalized | FPO | Farmer | Purchased/rejected quantity, grade, price, ownership-transfer time, and payment status |
| Storage requested | Responsible arranger | Storage Manager | Crop suitability, quantity, dates, conditions, payer |
| Transport requested | Responsible arranger | Transport Manager | Shipment items, pickups, destination, timing, handling, payer, and risk bearer |
| Delivery completed | Transport Manager | Buyer and seller | Proof, delivered quantity, time, incidents |
| Receiving inspection completed | Buyer | Seller/Admin | Delivered/accepted/rejected quantity, tolerance, condition, evidence, dispute state, payment effect |
| Payment marked paid | Buyer/FPO | Seller | Obligation, amount claimed paid, reference/evidence, and confirm/report-missing actions |
| Payment receipt confirmed | Seller | Buyer/FPO/Admin | Confirmed amount, completion state, and any remaining balance |
| Incident recorded | Participant/provider | Related participants | Operational fact, affected item, evidence, current impact, and status |
| Grievance submitted | Participant | Admin and involved actor | Category, related incident/record, evidence, requested action, and triage state |
| Grievance accepted as dispute | Admin | Involved actors | Case ID, scope, evidence, response deadline, and assigned reviewer |
| Additional dispute evidence requested | Admin | Involved actor | Required evidence, reason, due date, and existing case context |
| Admin resolution recorded | Admin | Involved actors | Decision, remedy/adjustment, reason, evidence basis, effective date, and original record link |
| Moderation applied/restored | Admin | Affected actor | Action, reason, duration, restricted capabilities, and effective state |

## Responsibility Display

Every trade detail should include a responsibility section. Service responsibility does not imply crop ownership.

| Service | Action owner | Payer | Provider/authority | Risk bearer | Status |
| --- | --- | --- | --- | --- | --- |
| Quality | Requesting actor | Actor name | Authorized assessor | According to terms | Current state |
| Storage | Actor name | Actor name | Facility | According to terms | Current state |
| Transport | Actor name | Actor name | Carrier | Explicit actor | Current state |

Only the assigned arranger sees booking or provider-selection actions. Other participants see ownership and progress as read-only context.

## Notification Priorities

- **Critical:** payment overdue, failed pickup, unsupported quality rejection, dispute response due.
- **Action required:** offer received, counteroffer, assessment task, quote response, receiving inspection.
- **Time-sensitive:** auction ending, procurement commitment expiring, pickup approaching, storage check-out due, expiring offer.
- **Informational:** status completion, price change, new matching demand, payment received.

Admin notifications additionally prioritize new verification submissions, dispute-aging thresholds, high-severity risk alerts, regional demand/supply imbalance, price anomalies, and critical service-capacity shortages.

Each notification should deep-link to the relevant record and state the next action when one exists.
