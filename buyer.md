# SIH26132 — Buyer Actor Requirements and Feature Specification

## 1. Purpose of the Buyer Actor

The Buyer actor represents the demand side of the marketplace.

The Buyer may be:

- Trader
- Wholesaler
- Processor
- Retailer
- Exporter
- Institutional Buyer
- Government Procurement Buyer

The platform should keep one main RBAC role:

```text
BUYER
```

and represent the commercial subtype separately using:

```text
buyer_type
```

The Buyer actor should answer four major questions:

1. **What produce do I need?**
2. **Which verified sellers and lots can satisfy that requirement?**
3. **What is the total landed cost and risk of each option?**
4. **How do I complete procurement, delivery, acceptance, and payment?**

The Buyer journey should therefore follow:

```text
Create Demand
      ↓
Discover / Match Supply
      ↓
Compare Lots
      ↓
Make Offer / Join Auction
      ↓
Negotiate Terms
      ↓
Accept Trade
      ↓
Fulfil Responsibilities
      ↓
Receive Produce
      ↓
Inspect / Accept
      ↓
Pay
```

---

# 2. Buyer Profile

A buyer profile should contain:

- Business / buyer name
- Buyer type
- Location
- Contact information
- Procurement regions
- Crops commonly purchased
- Typical purchase quantities
- Delivery locations
- Verification status

Optional verification fields may include:

- Business registration
- GST / tax registration
- Identity verification
- Address verification
- Payment history

The system should clearly distinguish verified buyers.

Example:

```text
ABC Foods

Buyer Type:
Processor

Location:
Pune

Verified:
Yes

Completed Transactions:
128

On-Time Payments:
97%
```

---

# 3. Buyer Type

The platform should not create separate major actor architectures for every downstream commercial participant.

Instead:

```text
BUYER
```

can have:

```text
buyer_type =
TRADER
WHOLESALER
PROCESSOR
RETAILER
EXPORTER
INSTITUTIONAL
GOVERNMENT
```

The procurement workflow remains largely the same.

---

# 4. Buyer Starts with Demand

Unlike the farmer, who starts with available produce, the Buyer usually starts with a procurement requirement.

Example:

```text
BUYER REQUIREMENT

Crop:
Red Onion

Variety:
Nashik Red

Quantity:
20 tonnes

Minimum Grade:
A

Required By:
12 September

Delivery Location:
Pune

Target Price:
₹30/kg
```

A Buyer Requirement should contain:

- Crop
- Crop subtype / variety
- Required quantity
- Quality / grade
- Size / moisture / other crop-specific specifications
- Required-by date
- Delivery location
- Target price
- Quantity tolerance
- Payment terms
- Transport preference
- Storage preference
- Requirement expiry

---

# 5. One-Time and Recurring Demand

The system may support two demand types.

## 5.1 One-Time Requirement

Example:

```text
Need:
10 tonnes Onion

Required By:
12 September
```

## 5.2 Recurring Requirement

Useful for:

- Retailers
- Processors
- Hotels
- Institutions
- Exporters
- Repeated procurement buyers

Example:

```text
Need:
5 tonnes Tomato

Frequency:
Every Monday and Thursday
```

Recurring demand is a useful extension but does not need a complex contract system in the first version.

---

# 6. Verified Supply Discovery

Buyers should preferably discover only lots that meet the platform's verification requirements.

A verified lot may show:

- Seller
- Seller type: Farmer / FPO
- Crop
- Variety
- Verified quantity
- Verified grade
- Location
- Harvest date
- Availability date
- Asking price
- Photos
- Quality assessment
- Seller reliability

Example:

```text
LOT #ON-3821

Seller:
Farmer Kevin

Crop:
Red Onion

Quantity:
4,280 kg

Grade:
A

Location:
Nashik

Harvested:
5 September

Asking Price:
₹29/kg
```

---

# 7. Buyer-Supply Matching

Matching should work in both directions.

If the Buyer posts:

```text
Requirement:
20T Grade-A Onion
```

the platform may return:

```text
MATCHED SUPPLY

FPO Lot A        10T   96% Match
Farmer Lot B      4T   94% Match
Farmer Lot C      3T   92% Match
Farmer Lot D      5T   87% Match
```

Matching criteria may include:

- Crop
- Variety
- Quality
- Quantity
- Distance
- Availability window
- Delivery date
- Asking price
- Seller reliability
- Transport feasibility

A simple deterministic matching engine is sufficient for the initial version.

---

# 8. Combining Multiple Lots

A Buyer should be able to satisfy one procurement requirement using multiple lots.

Example:

```text
Buyer Requirement:
20 tonnes
```

Available:

```text
FPO A       10T
Farmer B     4T
Farmer C     3T
Farmer D     5T
```

Selected:

```text
FPO A       10T
Farmer B     4T
Farmer C     3T
Farmer D     3T
----------------
TOTAL       20T
```

Manual multi-lot selection is sufficient initially.

Automatic optimization can be added later.

---

# 9. Direct Offers

The Buyer should be able to make a direct offer on a verified Farmer or FPO lot.

Example:

```text
BUYER OFFER

Price:
₹30/kg

Quantity:
4,000 kg

Transport:
Buyer Arranges
Buyer Pays

Storage:
Seller Responsible Until Pickup

Pickup:
Within 24 Hours

Payment:
Same Day After Delivery
```

The seller can:

- Accept
- Reject
- Counteroffer

---

# 10. Auction Participation

If a Farmer or FPO puts a verified lot into bidding:

```text
Verified Lot
      ↓
Auction
```

Buyers can submit bids.

Example:

```text
Buyer A:
₹29.20/kg

Buyer B:
₹30.00/kg

Buyer C:
₹29.70/kg
```

A bid must include full trade terms rather than only a price.

---

# 11. Standard Buyer Offer Structure

A standardized offer format should be reused across the marketplace.

Recommended fields:

```text
PRICE
₹30/kg

QUANTITY
4,000 kg

TRANSPORT
Arranged By: Buyer
Paid By: Buyer

STORAGE
Arranged By: Seller
Paid By: Seller

DELIVERY
ABC Foods Warehouse, Pune

PICKUP
Within 24 Hours

PAYMENT
Same Day After Accepted Delivery

QUALITY
Grade A Required

QUANTITY TOLERANCE
±2%

OFFER EXPIRY
6 PM Today
```

This keeps bidding and negotiation consistent.

---

# 12. Dynamic Responsibility Model

Transport and storage should not be permanently exposed to all Buyers.

Responsibilities are trade-specific.

For each service, the platform should track:

## Transport

- Arranged by
- Paid by
- Provider

## Storage

- Arranged by
- Paid by
- Provider

## Quality Assessment

- Requested by
- Paid by
- Assessed by

Example:

```text
Trade #123

Transport Arranger:
Buyer

Transport Payer:
Buyer

Storage Arranger:
Seller

Storage Payer:
Seller
```

Buyer UI:

```text
Transport:
Your Responsibility

[ Find Transport ]
```

and:

```text
Storage:
Handled by Seller
```

No unnecessary storage management feature is exposed.

---

# 13. Responsibility Is Different from Ownership

The Buyer may arrange transport before the Buyer becomes the crop owner.

Example:

```text
Buyer Books Truck
      ↓
Truck Reaches Farmer
      ↓
Produce Loaded
      ↓
Delivery / Transfer Condition Satisfied
      ↓
Ownership Changes According to Trade Terms
```

The system must not assume:

```text
Transport Arranger = Crop Owner
```

Ownership and service responsibility are separate concepts.

---

# 14. Buyer Landed Cost

The Farmer cares about:

> **Net Realization**

The Buyer cares about:

> **Total Landed Acquisition Cost**

Example:

```text
Crop Purchase:
₹1,20,000

Transport:
₹3,000

Storage:
₹1,000

Handling:
₹500

Total Landed Cost:
₹1,24,500
```

The platform should calculate this automatically when comparing sourcing options.

---

# 15. Lot Comparison

Buyers should compare more than headline price.

Example:

## Lot A

```text
Source Price:
₹30/kg

Grade:
A

Distance:
40 km

Seller Reliability:
95/100

Total Landed Cost:
₹31.20/kg
```

## Lot B

```text
Source Price:
₹29/kg

Grade:
A

Distance:
180 km

Seller Reliability:
82/100

Total Landed Cost:
₹31.80/kg
```

Lot A may be economically preferable even though its listed crop price is higher.

---

# 16. Seller Reliability

Buyer decisions should include seller reliability information.

For a Farmer:

```text
Completed Trades:
42

Quantity Accuracy:
97%

Quality Match:
94%

On-Time Readiness:
91%

Cancellations:
2

Disputes:
1
```

For an FPO:

```text
Completed Trades:
84

Fulfilment Reliability:
96%

Average Quantity Delivered:
99.2% of Committed Quantity

Quality Match:
97%
```

Seller reliability should remain visible separately from economic cost.

---

# 17. Quality Assessment Review

Buyers should be able to view:

- Quality grade
- Assessment date
- Quality assessor
- Quantity measured
- Crop-specific quality parameters
- Photos
- Assessment certificate/report if available

Example:

```text
QUALITY ASSESSMENT

Grade:
A

Verified Quantity:
4,280 kg

Moisture:
7.2%

Damage:
<2%

Assessor:
Quality Centre #12
```

---

# 18. Buyer-Requested Quality Assessment

If a lot only contains:

```text
Farmer Declared Quality
```

the Buyer may request:

```text
Official Quality Assessment
```

Flow:

```text
Buyer Requests Assessment
        ↓
Quality Assessor Assigned
        ↓
Assessment Completed
        ↓
Verified Result Published
        ↓
Buyer Continues / Renegotiates / Rejects
```

Who pays for the assessment should be part of the agreed responsibility terms.

---

# 19. Counteroffers and Negotiation

The Buyer should be able to negotiate:

- Price
- Quantity
- Transport responsibility
- Storage responsibility
- Pickup timing
- Delivery location
- Payment timing
- Quantity tolerance
- Quality conditions

Example:

```text
Buyer:
₹29/kg
Buyer Arranges Transport

Seller Counter:
₹29.50/kg
Buyer Arranges Transport

Buyer:
Accept
```

---

# 20. Trade Terms Freeze

After an offer is accepted, trade terms should become frozen.

Example:

```text
TRADE #828

Seller:
Nashik FPO

Buyer:
ABC Foods

Quantity:
20,000 kg

Price:
₹30/kg

Transport:
Buyer Arranged
Buyer Paid

Storage:
Seller Responsibility Until Pickup

Delivery:
Pune Facility

Payment:
Within 1 Day of Accepted Delivery
```

Any later modification should require explicit mutual approval.

This is critical for transparent dispute handling.

---

# 21. Buyer Fulfilment Flow

After acceptance:

```text
OFFER ACCEPTED
      ↓
TRADE CREATED
      ↓
QUALITY CONFIRMED
      ↓
TRANSPORT / STORAGE TASKS
      ↓
PICKUP
      ↓
IN TRANSIT
      ↓
DELIVERY
      ↓
RECEIVING INSPECTION
      ↓
ACCEPT / PARTIAL ACCEPT / DISPUTE
      ↓
PAYMENT
```

This is the main Buyer transaction lifecycle.

---

# 22. Transport Provider Selection

If the Buyer is the transport arranger, the Buyer should see suitable transport providers.

Example:

| Provider | Capacity | Cost | ETA |
|---|---:|---:|---:|
| Transport A | 10T | ₹5,200 | 2h |
| Transport B | 10T | ₹5,850 | 1h |

The Buyer selects a provider.

The selected Transport Manager then handles fulfilment.

If transport is the seller's responsibility, the Buyer only sees transport status.

---

# 23. Storage Provider Selection

If the Buyer is responsible for storage, the Buyer should see suitable storage providers.

Example:

```text
Pune Cold Storage

Available Capacity:
20 tonnes

Cost:
₹0.30/kg/day

Supported Crop:
Tomato

Distance From Delivery Point:
6 km
```

If the seller is responsible for storage, the Buyer sees status only.

---

# 24. Delivery Tracking

The Buyer should be able to track:

- Pickup status
- Pickup time
- Current transport status
- Estimated arrival
- Delivery location
- Delivery confirmation

Suggested states:

```text
Pickup Scheduled
      ↓
Picked Up
      ↓
In Transit
      ↓
Arriving
      ↓
Delivered
```

---

# 25. Receiving Inspection

Receiving inspection is a major Buyer responsibility.

The Buyer should be able to record:

- Delivered quantity
- Accepted quantity
- Rejected quantity
- Quality status
- Damage
- Delivery time
- Specification compliance

Example:

```text
Expected:
20,000 kg Grade A

Received:
19,850 kg

Accepted:
19,700 kg

Rejected:
150 kg

Reason:
Transport Damage
```

---

# 26. Buyer Cannot Arbitrarily Override Verified Quality

If an independent Quality Assessor has already verified:

```text
Grade A
```

the Buyer should not be able to simply change it to:

```text
Grade B
```

and reduce payment.

Instead:

```text
Buyer Disputes Quality
      ↓
Buyer Uploads Evidence
      ↓
Existing Assessment Reviewed
      ↓
Reassessment / Dispute Process
      ↓
Resolution
```

This protects both Buyers and sellers.

---

# 27. Quantity Tolerance

Buyer requirements should support quantity tolerance.

Example:

```text
Required Quantity:
20 tonnes

Tolerance:
±2%
```

Then a quantity such as:

```text
19.7 tonnes
```

may still be within acceptable trade terms.

This prevents unnecessary disputes.

---

# 28. Partial Acceptance

Agricultural deliveries may contain different accepted quality portions.

Example:

```text
Delivered:
10,000 kg

Grade A:
8,500 kg

Grade B:
1,500 kg
```

Buyer may:

```text
Accept:
8,500 kg @ ₹30/kg
```

and, if allowed by the contract:

```text
Offer:
₹25/kg for 1,500 kg Grade B
```

or:

```text
Reject:
1,500 kg
```

Partial acceptance rules should be defined in advance wherever possible.

---

# 29. Payment Calculation

Final payment should use the accepted quantity and agreed pricing rules.

Example:

```text
Accepted Quantity:
19,700 kg

Price:
₹30/kg

Final Payable:
₹5,91,000

Payment Due:
7 September

Status:
Pending
```

The Buyer should be able to track:

- Gross purchase value
- Accepted quantity
- Service charges they are responsible for
- Final payable amount
- Amount paid
- Amount pending
- Payment due date

---

# 30. Payment Tracking

Buyer payment states may include:

```text
Pending
Partially Paid
Paid
Overdue
Disputed
```

Both Buyer and Seller should see the same transaction payment status.

The initial SIH version does not necessarily need to perform real fund transfer.

Payment tracking alone is sufficient for the transaction workflow.

---

# 31. Buyer Purchase History

All completed trades should be retained.

Example:

```text
PURCHASE HISTORY

5 Sep
Onion
Nashik FPO
20T
₹5,91,000
Completed

29 Aug
Tomato
Farmer A
4T
₹96,000
Completed
```

Useful analytics may include:

- Total procurement spend
- Quantity purchased
- Average landed cost
- Crop-wise purchases
- Supplier performance
- Quality rejection rate
- Payment performance

---

# 32. Preferred Suppliers

After a successful transaction, a Buyer may mark a Farmer or FPO as a preferred supplier.

Example:

```text
Preferred Suppliers

Nashik FPO
Farmer Kevin
Pune Agro FPO
```

This supports long-term market linkages.

Future Buyer Requirements may be sent directly to preferred suppliers.

---

# 33. Public and Invited Buyer Requirements

A requirement may later support:

## Public Requirement

```text
All Eligible Sellers Can Respond
```

## Invited Requirement

```text
Only Selected Farmers / FPOs Can Respond
```

This is useful for repeat procurement and trusted supply relationships.

It is a useful extension rather than an essential MVP feature.

---

# 34. Buyer Dashboard

The Buyer dashboard should be operational and procurement-focused.

It should answer:

- What do I need to procure?
- Which requirements are active?
- What supply matches my demand?
- What offers have I made?
- Which sellers countered?
- Which trades are awaiting acceptance?
- Which orders require transport/storage action?
- What is in transit?
- What deliveries require inspection?
- What payments are due?

Example:

```text
ACTIVE REQUIREMENTS
3

MATCHED LOTS
18

OPEN OFFERS
6

IN TRANSIT
2

AWAITING INSPECTION
1

PAYMENTS DUE
₹4,20,000
```

---

# 35. Buyer Disputes

The Buyer may raise disputes for:

- Quantity shortfall
- Quality mismatch
- Wrong crop / variety
- Damaged produce
- Late delivery
- Seller cancellation
- Missing documentation
- Transport damage
- Storage damage

A dispute should be attached to:

```text
Trade Terms
+
Quality Assessment
+
Delivery Record
+
Photos
+
Transport History
+
Messages
+
Payment Record
```

This creates evidence-based resolution.

---

# 36. Notifications

Buyer notifications may include:

```text
5 new verified lots match your onion requirement.
```

```text
Nashik FPO countered your offer.
```

```text
Your purchase offer was accepted.
```

```text
Transport booking confirmed.
```

```text
Shipment arriving in 45 minutes.
```

```text
Delivery awaiting inspection.
```

```text
Payment due tomorrow.
```

Possible channels:

- In-app
- Email
- SMS
- WhatsApp

---

# 37. Buyer Authorization Model

The Buyer role defines broad capabilities such as:

- Create requirements
- Search verified lots
- Make offers
- Participate in auctions
- Accept counteroffers
- Request quality assessment
- Inspect delivered produce
- Raise disputes
- Track payment

However, service actions should still depend on:

```text
Actor Role
+
Relationship to Trade
+
Assigned Responsibility
+
Current Trade State
```

Example:

```text
Role:
Buyer

Transport Arranger:
Buyer

Trade State:
Awaiting Transport

Capability:
Book Transport
```

---

# 38. Features That Should Not Be Permanently Exposed to Buyer

Avoid permanent Buyer navigation such as:

```text
Transport Management
Storage Management
```

unless the Buyer actually has relevant responsibilities.

Instead:

```text
Transport:
Your Responsibility

[ Get Transport Quotes ]
```

or:

```text
Transport:
Handled by Seller
```

This keeps the system consistent with Farmer and FPO authorization.

---

# 39. Core Buyer Flow

The final Buyer flow should be:

```text
BUYER CREATES REQUIREMENT
        ↓
MATCH VERIFIED SUPPLY
        ↓
REVIEW FARMER / FPO LOTS
        ↓
COMPARE QUALITY + LANDED COST
        ↓
MAKE OFFER / JOIN AUCTION
        ↓
NEGOTIATE PRICE + RESPONSIBILITIES
        ↓
SELLER ACCEPTS
        ↓
TRADE TERMS FROZEN
        ↓
QUALITY CONFIRMATION
        ↓
ASSIGNED STORAGE / TRANSPORT
        ↓
PICKUP
        ↓
DELIVERY
        ↓
BUYER RECEIVING INSPECTION
        ↓
ACCEPT / PARTIAL ACCEPT / DISPUTE
        ↓
PAYMENT
        ↓
TRANSACTION HISTORY
```

---

# 40. Major Buyer Features

The major Buyer features are:

1. Buyer profile
2. Buyer verification
3. Buyer type
4. Create procurement requirements
5. One-time demand
6. Recurring demand
7. Crop / variety specification
8. Quality requirements
9. Quantity and tolerance
10. Delivery date and location
11. Match verified Farmer/FPO lots
12. Search verified supply
13. Combine multiple lots
14. View quality assessments
15. Request quality assessment
16. Make direct offers
17. Participate in auctions
18. Counteroffers
19. Define transport arranger/payer
20. Define storage arranger/payer
21. Define payment terms
22. Compare landed acquisition cost
23. View seller reliability
24. Accept trade terms
25. Trade-term freezing
26. Select transport provider when responsible
27. Select storage provider when responsible
28. Track pickup
29. Track delivery
30. Receiving inspection
31. Quantity confirmation
32. Quality confirmation
33. Partial acceptance
34. Dispute / reassessment
35. Payment calculation
36. Payment tracking
37. Purchase history
38. Preferred suppliers
39. Notifications
40. Procurement analytics dashboard

---

# 41. Key Product Principles

## Principle 1 — Buyer Starts With Demand

The Buyer experience should begin with:

> **What do I need?**

rather than only forcing the Buyer to browse available produce.

---

## Principle 2 — Verified Supply Is Preferred

Formal bidding and procurement should rely on verified quantity and quality wherever possible.

---

## Principle 3 — Match Demand and Supply Automatically

Buyers should not manually search hundreds of listings when the platform can identify compatible supply.

---

## Principle 4 — Offers Include Full Commercial Terms

A Buyer offer is not just:

```text
₹30/kg
```

It includes:

- Quantity
- Quality
- Transport
- Storage
- Pickup
- Delivery
- Payment timing
- Quantity tolerance

---

## Principle 5 — Landed Cost Over Headline Price

The platform should help the Buyer answer:

> **What will this crop actually cost me after fulfilment?**

not merely:

> **Which seller has the lowest listed price?**

---

## Principle 6 — Seller Reliability Remains Visible

Cost and reliability should not be hidden inside one unexplained score.

---

## Principle 7 — Responsibilities Belong to the Trade

Transport, storage, and quality-related actions should be dynamically assigned.

---

## Principle 8 — Ownership and Responsibility Are Separate

Arranging transport or storage does not automatically mean the Buyer owns the crop.

---

## Principle 9 — Accepted Terms Must Be Frozen

After acceptance, changes require explicit mutual agreement.

---

## Principle 10 — Receiving Inspection Must Be Fair

The Buyer can verify delivered quantity and condition, but cannot arbitrarily override independent verified quality.

---

## Principle 11 — Partial Acceptance Must Follow Agreed Rules

Downgrades, rejections, and quantity tolerance should be defined before delivery wherever possible.

---

# 42. Final Buyer Objective

The Buyer experience should ultimately answer:

```text
What do I need?
        ↓
Who has matching verified supply?
        ↓
Which combination of lots can fulfil my requirement?
        ↓
What is the actual landed cost?
        ↓
Which sellers are reliable?
        ↓
What commercial terms should I offer?
        ↓
Who handles transport/storage?
        ↓
Has the produce reached me?
        ↓
Does the delivered crop satisfy the agreement?
        ↓
What amount must I pay?
        ↓
Was the transaction completed successfully?
```

The Buyer should therefore function as a complete:

> **Demand Creation → Supply Discovery → Procurement → Fulfilment → Receiving → Payment**

workflow within SIH26132.
