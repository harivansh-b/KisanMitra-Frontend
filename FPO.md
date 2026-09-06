# SIH26132 — FPO Actor Requirements and Feature Specification

## 1. Purpose of the FPO Actor

The FPO actor should support two clearly separated operating modes:

1. **FPO as Service Provider**
2. **FPO as Crop Buyer / Procurer**

This distinction is central to the architecture.

The FPO should not be treated as a generic intermediary whose responsibilities are always unclear.

Instead, every FPO interaction with a farmer should answer one of two questions:

> **Is the FPO only providing a service while the farmer continues to own the crop?**

or:

> **Is the FPO purchasing the crop, after which ownership and responsibility transfer to the FPO?**

This creates a simple and predictable ownership model.

---

# 2. FPO Operating Modes

## 2.1 Service Provider Mode

In Service Provider Mode, the FPO helps the farmer perform one or more agricultural or post-harvest services.

Examples:

- Harvesting labour
- Harvesting tools / machinery
- Quantity measurement
- Quality-assessment coordination
- Sorting
- Grading coordination
- Packaging
- Transport arrangement
- Storage arrangement

The key rule is:

> **The farmer continues to own the crop.**

The FPO is only performing or coordinating services for a fee.

Example:

```text
FARMER OWNS CROP
       │
       ├── Harvesting
       ├── Labour
       ├── Quantity Measurement
       ├── Quality Coordination
       ├── Transport
       └── Storage
       │
       ▼
FPO PROVIDES / ARRANGES SERVICE

Ownership remains:
FARMER
```

The farmer still controls:

- Whether to sell
- When to sell
- Which buyer/FPO offer to accept
- Whether to store
- Whether to wait
- Final sale terms

---

## 2.2 Crop Buyer / Procurement Mode

In Procurement Mode, the FPO buys crops from farmers.

Once the farmer accepts the FPO purchase terms and the quantity/quality conditions are satisfied:

```text
Farmer
   ↓ Sale
FPO
```

Ownership changes:

```text
Farmer → FPO
```

After ownership transfer, the farmer is no longer responsible for the future handling of the purchased quantity.

The FPO becomes responsible for:

- Aggregation
- Storage
- Transport
- Buyer fulfilment
- Future bidding/sale
- Produce management
- Risk after ownership transfer

The farmer's involvement in that purchased quantity ends after settlement and transfer.

---

# 3. Why Aggregation Is Based on Purchase

The system should avoid a model where farmers simply hand their crop to the FPO for aggregation without knowing when or how much they will be paid.

That introduces uncertainty around:

- Sale timing
- Final price
- Payment timing
- Buyer availability
- Farmer liquidity needs

Instead, the FPO should create a concrete **Procurement Offer** to farmers.

Example:

```text
Nashik FPO Procurement Offer

Crop:
Red Onion

Required:
20 tonnes

Purchase Price:
₹28.50/kg

Quality:
Grade A

Collection Window:
7–8 September

Payment:
Same day after verification
```

A farmer can accept or reject this offer.

This makes the farmer's expected payment much more predictable.

---

# 4. Relationship Between Buyer Demand and FPO Procurement

The ideal FPO workflow begins with buyer demand.

Example:

```text
BUYER REQUIREMENT

Crop:
Red Onion

Quantity:
20 tonnes

Grade:
A

Price:
₹30/kg

Delivery:
10 September
```

The FPO identifies whether this is commercially attractive.

It then calculates:

- Buyer sale price
- Transport cost
- Storage cost
- Sorting/grading cost
- Packaging cost
- Operational cost
- FPO margin

From that, it determines the maximum practical farmer procurement price.

Example:

```text
Buyer Sale Price:
₹30.00/kg

Expected Transport:
-₹0.40/kg

Expected Storage:
-₹0.15/kg

Sorting / Grading:
-₹0.20/kg

FPO Margin:
-₹0.50/kg

Farmer Procurement Price:
₹28.75/kg
```

This allows the FPO to provide farmers with a nearly exact purchase price.

---

# 5. Buyer Requirement Before Procurement

The FPO should not first buy large quantities of crops without understanding likely buyer demand.

The preferred flow is:

```text
Buyer Requirement
       ↓
FPO Identifies Opportunity
       ↓
FPO Calculates Economics
       ↓
FPO Creates Procurement Offer
       ↓
Farmers Commit Supply
```

This reduces the risk that the FPO purchases produce without a viable buyer.

---

# 6. Supply Reservation Before Final Buyer Commitment

The FPO should not unconditionally accept a buyer order before knowing that sufficient farmer supply exists.

Example problem:

```text
Buyer needs:
20 tonnes

FPO accepts immediately

Actual available farmer supply:
13 tonnes
```

This creates fulfilment failure.

The platform should therefore support a **supply reservation / farmer commitment stage**.

Flow:

```text
BUYER POSTS REQUIREMENT
        ↓
FPO CREATES PROCUREMENT OFFER
        ↓
FARMERS COMMIT PRODUCE
        ↓
ENOUGH SUPPLY RESERVED?
        │
    ┌───┴────┐
    │        │
   NO       YES
    │        │
Do not      Confirm
finalize    buyer deal
buyer deal
```

This is a lightweight mechanism and prevents over-commitment.

---

# 7. Farmer Commitment

A farmer should be able to reserve a quantity against an FPO procurement offer.

Example:

```text
Farmer:
Kevin

Crop:
Red Onion

Verified Available:
2,000 kg

Committed:
1,500 kg

FPO Purchase Price:
₹28.50/kg
```

At this stage:

- The farmer still owns the crop.
- The crop has not yet been physically aggregated.
- The FPO only has a supply commitment/reservation.

This allows the FPO to measure whether enough supply exists before final buyer confirmation.

---

# 8. Final FPO Procurement Flow

The recommended end-to-end FPO procurement flow is:

```text
BUYER POSTS REQUIREMENT
        ↓
FPO IDENTIFIES OPPORTUNITY
        ↓
FPO CALCULATES COSTS + MARGIN
        ↓
FPO CREATES PROCUREMENT OFFER
        ↓
FARMERS COMMIT VERIFIED PRODUCE
        ↓
ENOUGH SUPPLY RESERVED
        ↓
FPO CONFIRMS BUYER DEAL
        ↓
FPO COLLECTS PRODUCE
        ↓
QUANTITY + QUALITY VERIFIED
        ↓
FPO PURCHASES FROM FARMERS
        ↓
OWNERSHIP
Farmer → FPO
        ↓
FPO AGGREGATES
        ↓
STORAGE / TRANSPORT AS REQUIRED
        ↓
FPO DELIVERS TO BUYER
        ↓
OWNERSHIP
FPO → Buyer
```

---

# 9. FPO Procurement Offer

The FPO Procurement Offer should contain enough information for the farmer to make a clear decision.

Recommended fields:

- Crop
- Crop subtype / variety
- Required quantity
- Minimum quality requirement
- Purchase price
- Collection location
- Collection window
- Payment timing
- Whether transport from farm is arranged by FPO
- Whether transport from farm is paid by FPO
- Offer expiry
- Quality conditions
- Quantity tolerance
- Rejection / downgrade rules

Example:

```text
FPO PROCUREMENT OFFER

Crop:
Red Onion

Required Quantity:
20 tonnes

Minimum Grade:
A

Purchase Price:
₹28.50/kg

Collection Window:
7–8 September

Transport From Farm:
Arranged by FPO

Transport Cost:
Paid by FPO

Payment:
Same day after quantity and quality verification
```

---

# 10. Farmer View of FPO Procurement Offer

The farmer should be able to compare the FPO offer with direct buyer offers.

Example:

| Offer | Type | Price | Farmer Responsibility | Expected Net |
|---|---|---:|---|---:|
| ABC Foods | Buyer | ₹30.00/kg | Farmer transport | ₹28.90/kg |
| XYZ Retail | Buyer | ₹29.30/kg | Buyer transport | ₹29.30/kg |
| Nashik FPO | FPO Purchase | ₹28.80/kg | FPO handles everything | ₹28.80/kg |

The farmer may choose the FPO even if its headline price is slightly lower because it may provide:

- Immediate known payment
- No buyer search
- No transport responsibility
- No storage responsibility
- Reduced fulfilment complexity
- Lower transaction risk

---

# 11. Quality Verification Before FPO Purchase

A farmer commitment is not automatically a final purchase.

Before ownership transfer, quantity and quality should be verified.

Flow:

```text
FPO Procurement Offer
      ↓
Farmer Accepts
      ↓
Collection / Inspection
      ↓
Verify Quantity
      ↓
Verify Quality
      ↓
Final Payable Quantity Established
      ↓
Purchase Confirmed
```

Example:

```text
Farmer Committed:
2,000 kg Grade A

Verified:
1,850 kg Grade A
150 kg Grade B
```

The FPO may:

- Buy the 1,850 kg Grade A quantity
- Offer a lower Grade B price for the remaining 150 kg
- Reject the Grade B quantity

These downgrade rules should be stated in the procurement offer.

---

# 12. Partial Purchase

The FPO should be able to purchase only part of a farmer's produce.

Example:

```text
Farmer Produce:
5,000 kg Onion

FPO Needs:
2,000 kg
```

The system should split ownership:

```text
2,000 kg → FPO
3,000 kg → Farmer
```

After transfer:

```text
Owner of 2,000 kg:
FPO

Owner of 3,000 kg:
Farmer
```

This requires support for partial produce transfers.

---

# 13. FPO Produce Aggregation

After the FPO purchases multiple farmer produce, it may combine compatible produce.

Example:

```text
Farmer A:
2,000 kg Grade A

Farmer B:
3,000 kg Grade A

Farmer C:
1,500 kg Grade A

Farmer D:
4,000 kg Grade A
```

becomes:

```text
FPO AGGREGATED PRODUCE

Crop:
Red Onion

Grade:
A

Quantity:
10,500 kg

Owner:
FPO
```

The original farmer source produce should remain traceable internally.

---

# 14. Compatibility Rules for Aggregation

The FPO should not blindly combine incompatible produce.

Aggregation should consider:

- Crop
- Variety
- Grade
- Size
- Harvest period
- Moisture
- Quality characteristics
- Buyer specification

Example:

```text
Grade A Onion
+
Grade A Onion
=
Compatible
```

but:

```text
Grade A Onion
+
Grade C Onion
=
Do Not Merge as One Grade A Produce Batch
```

---

# 15. Split and Merge Capabilities

The FPO needs two key produce-management features.

## Merge Produce

Example:

```text
500 kg
+
700 kg
+
800 kg
=
2,000 kg FPO Produce
```

## Split Produce

Example:

```text
10 tonnes total

6 tonnes Grade A
4 tonnes Grade B
```

becomes:

```text
Produce A:
6T Grade A

Produce B:
4T Grade B
```

Or:

```text
10T Aggregated Produce

7T → Buyer A
3T → Remains Available
```

This is a major FPO-specific feature.

---

# 16. FPO as Service Provider

Service Mode must remain independent from procurement.

A farmer can use FPO services without selling to the FPO.

Possible services:

- Harvest labour
- Harvest equipment
- Quantity measurement
- Preliminary quality checks
- Quality assessment coordination
- Sorting
- Grading
- Packaging
- Transport arrangement
- Storage arrangement

Example:

```text
FPO Harvesting Service:
Yes

FPO Quality Coordination:
Yes

FPO Storage:
No

FPO Transport:
No

Sell to FPO:
No
```

The farmer can still sell independently after using services.

---

# 17. FPO Service Pricing

Each service should have clear pricing.

Example:

```text
Harvest Labour:
₹4,000

Quantity Measurement:
₹500

Transport:
₹2,200

Storage:
₹0.25/kg/day
```

The farmer should see costs before requesting a service.

The platform should not force bundled services unless the FPO explicitly offers a package.

---

# 18. Quality Assessment Role Separation

The FPO may coordinate quality assessment but should not automatically be treated as the final quality authority.

Recommended model:

```text
FPO:
Coordinates / requests assessment

Quality Assessor:
Provides official verification
```

If an FPO has its own authorized quality assessor, that can be supported explicitly.

This keeps the Quality Assessor actor meaningful and reduces conflict-of-interest risk.

---

# 19. Inbound and Outbound Transport

The FPO flow may contain multiple transport legs.

## Inbound Transport

```text
Farmer
→ FPO Collection Centre
```

This may be:

- Arranged by farmer
- Paid by farmer

or:

- Arranged by FPO
- Paid by FPO

or another agreed combination.

## Outbound Transport

```text
FPO Collection Centre
→ Buyer
```

After the FPO owns the crop, this normally becomes the FPO's operational responsibility unless buyer terms state otherwise.

Transport responsibility should still use:

- Arranged by
- Paid by
- Provider

---

# 20. Storage Responsibility

Storage may be needed:

- Before aggregation
- During aggregation
- Before buyer delivery
- While waiting for pickup

Example:

```text
FPO has purchased:
10 tonnes

Buyer pickup:
In 2 days

Storage:
Required
```

The FPO can then book storage.

If the buyer has accepted storage responsibility in the trade terms, the buyer may instead arrange it.

---

# 21. Dynamic Responsibility Model

The platform should continue using the same dynamic responsibility architecture defined for the Farmer actor.

For each service:

## Transport

- Arranged by
- Paid by
- Provider

## Storage

- Arranged by
- Paid by
- Provider

## Quality

- Requested by
- Paid by
- Assessed by

The UI should expose actions only to the responsible participant.

---

# 22. FPO Buyer-Side Offer Evaluation

Once the FPO owns and aggregates produce, it can evaluate buyer offers.

Buyer offers should include:

- Price
- Quantity
- Quality requirement
- Pickup / delivery location
- Transport responsibility
- Storage responsibility
- Payment timing
- Offer expiry
- Buyer reliability

The FPO should compare offers based on:

> **Expected Net Realization to the FPO**

not only headline price.

---

# 23. FPO Economic Calculation

The FPO should calculate:

```text
Buyer Revenue
-
Farmer Procurement Cost
-
Transport
-
Storage
-
Sorting
-
Grading
-
Packaging
-
Operational Cost
=
FPO Margin / Net Return
```

This calculation helps determine whether the buyer opportunity is commercially viable.

---

# 24. Buyer Commitment

The FPO should only finalize a buyer order when:

- Enough farmer supply is reserved
- Required quality appears achievable
- Required quantity is realistic
- Delivery terms can be satisfied
- FPO economics remain viable

This reduces buyer-fulfilment risk.

---

# 25. Ownership Transfer Model

There are two major ownership-transfer events.

## Farmer to FPO

Occurs after:

- Farmer accepts procurement terms
- Quantity is verified
- Quality is verified
- Final payable quantity is agreed
- Purchase is finalized

Ownership:

```text
Farmer → FPO
```

## FPO to Buyer

Occurs according to the accepted buyer trade terms.

Ownership:

```text
FPO → Buyer
```

The platform should explicitly track these ownership transitions.

---

# 26. Farmer Responsibility After Sale to FPO

Once the FPO purchases the crop:

```text
Farmer:
No longer owns purchased quantity
```

The farmer should no longer be responsible for:

- Future transport
- Future storage
- Buyer negotiations
- Aggregation
- Buyer fulfilment
- Future pricing decisions

The farmer should only retain:

- Payment visibility
- Transaction record
- Dispute rights
- Any explicitly agreed post-sale obligation

This greatly simplifies authorization.

---

# 27. FPO Dashboard

The FPO dashboard should be operational.

It should answer:

- What buyer demand exists?
- What procurement campaigns are active?
- How much farmer supply is committed?
- How much crop has been collected?
- What quantity has been verified?
- What FPO-owned produce exist?
- What produce is ready for buyer bidding?
- What storage tasks are pending?
- What transport tasks are pending?
- What deliveries are in progress?
- What farmer payments are pending?
- What buyer payments are pending?

Example:

```text
ACTIVE PROCUREMENT

Onion Requirement:
20 tonnes

Committed by Farmers:
18 tonnes

Collected:
10 tonnes

Verified:
8 tonnes

Still Required:
2 tonnes
```

---

# 28. Farmer Payment Tracking

For every FPO purchase, the farmer should see:

```text
Farmer:
Kevin

Verified Quantity:
1,850 kg

Agreed Price:
₹28.50/kg

Gross Amount:
₹52,725

Service Deductions:
₹0

Net Payable:
₹52,725

Status:
Paid / Pending
```

This should be independent from the later FPO-to-buyer transaction.

Once the FPO buys the crop, the farmer should not have to wait for the FPO's buyer to pay unless that was explicitly agreed.

---

# 29. FPO Purchase Record

Each purchase should retain:

- Farmer
- Source produce
- Quantity
- Quality
- Purchase price
- Payment terms
- Ownership transfer time
- Collection location
- Associated procurement campaign
- Resulting FPO produce

This creates full traceability.

---

# 30. FPO-to-Buyer Trade Tracking

After aggregation, confirmed FPO trades should track:

```text
Offer Accepted
      ↓
Trade Terms Frozen
      ↓
Storage if required
      ↓
Transport
      ↓
Delivery
      ↓
Buyer Acceptance
      ↓
Payment Pending
      ↓
Paid
```

---

# 31. Disputes

The FPO may need to raise disputes relating to:

- Buyer non-payment
- Buyer rejection
- Quantity disagreement
- Quality disagreement
- Transport damage
- Storage damage
- Buyer cancellation
- Farmer quantity mismatch
- Farmer quality mismatch
- Service-provider failure

All agreed terms and verification records should be retained as evidence.

---

# 32. Notifications

Useful notifications include:

```text
New buyer requirement matches your FPO.
```

```text
Farmer supply commitment increased to 18 tonnes.
```

```text
Procurement target reached.
```

```text
Buyer offer received.
```

```text
Transport booking confirmed.
```

```text
Buyer accepted delivery.
```

```text
Farmer payment pending.
```

---

# 33. Core Authorization Principle

The FPO role should define broad capabilities such as:

- Create procurement offers
- Purchase farmer produce
- Manage FPO-owned produce
- Merge / split produce
- Accept buyer offers
- Provide services
- Arrange assigned transport/storage
- View FPO trade data

However, specific actions should still depend on:

```text
Actor Role
+
Ownership
+
Relationship to Produce / Trade
+
Assigned Responsibility
+
Current State
```

Example:

```text
FPO owns produce:
Yes

Transport arranger:
FPO

Current trade state:
Awaiting transport

Capability:
Book Transport
```

---

# 34. Major FPO Features

The major FPO features are:

1. FPO profile
2. Service-provider mode
3. Procurement / buyer mode
4. View buyer demand
5. Evaluate buyer opportunities
6. Calculate procurement economics
7. Create farmer procurement offers
8. Farmer supply commitments
9. Supply reservation tracking
10. Buyer commitment only after sufficient supply
11. Collection management
12. Quantity verification
13. Quality assessment coordination
14. Partial farmer purchase
15. Ownership transfer from farmer to FPO
16. FPO-owned produce management
17. Merge compatible produce
18. Split produce
19. Aggregate farmer purchases
20. Storage management
21. Transport management
22. Direct buyer matching
23. Buyer bidding / offers
24. Net realization calculation
25. Buyer reliability review
26. Trade term freezing
27. Delivery tracking
28. Farmer payment tracking
29. Buyer payment tracking
30. Purchase history
31. FPO produce traceability
32. Dispute management
33. Notifications
34. Operational dashboard

---

# 35. Key Product Principles

## Principle 1 — FPO Has Two Modes

The FPO is either:

> **providing a service**

or:

> **buying the crop**

These should not be mixed.

---

## Principle 2 — Services Do Not Transfer Ownership

Using FPO harvesting, transport, quality, or storage services does not automatically transfer crop ownership.

---

## Principle 3 — Procurement Transfers Ownership

Once the FPO purchases the verified quantity:

```text
Farmer → FPO
```

The farmer's control over that quantity ends.

---

## Principle 4 — Secure Supply Before Buyer Commitment

The FPO should not finalize a major buyer commitment without sufficient farmer supply reservations.

---

## Principle 5 — Procurement Offers Should Be Concrete

Farmers should see:

- Exact/near-exact price
- Quality requirements
- Quantity
- Collection timing
- Payment timing
- Transport terms

before committing.

---

## Principle 6 — Keep FPO Services Independent

A farmer may use FPO services without being required to sell to the FPO.

---

## Principle 7 — Quality Must Be Verified Before Final Purchase

Farmer commitments are provisional until quantity and quality are confirmed.

---

## Principle 8 — Aggregation Happens After Purchase

In this platform model, the FPO first purchases the crop and then aggregates FPO-owned produce.

This keeps ownership and payment rules simple.

---

## Principle 9 — Partial Ownership Transfer Must Be Supported

Only the quantity actually purchased by the FPO changes ownership.

The remainder stays with the farmer.

---

## Principle 10 — Responsibilities Belong to the Trade

Transport, storage, and quality-related actions remain dynamically assigned based on the specific transaction.

---

# 36. Final FPO Objective

The FPO experience should ultimately answer:

```text
What buyer demand exists?
        ↓
Can our farmer network supply it?
        ↓
What can we safely offer farmers?
        ↓
How much supply has been committed?
        ↓
Can we confirm the buyer deal?
        ↓
Which farmer quantities actually meet requirements?
        ↓
What produce do we now own?
        ↓
How should we aggregate it?
        ↓
What transport/storage actions are required?
        ↓
Can we fulfil the buyer order profitably?
        ↓
Have farmers been paid?
        ↓
Has the buyer trade been completed?
```

The FPO should therefore function as:

> **Service Hub + Procurement Engine + Aggregator + Fulfilment Coordinator**

while keeping ownership rules clear and farmer payment predictable.
