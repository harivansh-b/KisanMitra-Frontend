# SIH26132 — Farmer Actor Requirements and Feature Specification

## 1. Purpose of the Farmer Actor

The Farmer actor is the primary seller-side participant in the platform.

The platform should help the farmer answer four major questions:

1. **What produce do I have, and when will it be ready?**
2. **What is the best economic option available to me?**
3. **When should I sell?**
4. **Once I accept a deal, what actions am I responsible for?**

The farmer journey should therefore cover the complete path:

```text
Plan
  ↓
Harvest
  ↓
Verify
  ↓
Compare Market Options
  ↓
Decide When to Sell
  ↓
Bid / Auction
  ↓
Compare Offers
  ↓
Accept Terms
  ↓
Arrange Assigned Services
  ↓
Deliver
  ↓
Get Paid
```

The platform should minimize the amount of analysis the farmer has to perform manually. The farmer should mainly provide factual information and make final decisions, while the platform performs calculations, ranking, comparisons, and recommendations.

---

# 2. Farmer Journey Modes

The farmer can enter the platform at two different stages.

## 2.1 Pre-Harvest Planning Mode

This is the better scenario because there is more time available for planning.

The farmer may provide:

- Location
- Crop
- Crop subtype / variety
- Land area
- Sowing date, if known
- Expected quantity
- Historical yield from previous harvests
- Expected harvest date/window
- Preferred time by which money is needed

The system can use:

- Farmer estimates
- Historical farmer harvest data
- Crop yield estimates
- Land area
- Crop type and variety
- Seasonal data
- Local market data

to estimate:

- Expected harvest window
- Expected quantity
- Likely demand
- Nearby mandi price trends
- Possible buyer demand
- Possible FPO aggregation opportunities
- Expected storage requirements
- Possible transport requirements

Example:

```text
Expected Harvest:
18–24 September

Expected Quantity:
4.2–4.8 tonnes

Current Market Trend:
₹24–₹28/kg

Nearby Demand:
High
```

The goal is to help the farmer prepare before urgency begins.

---

## 2.2 Harvest-Time / Post-Harvest Action Mode

If the farmer only provides data at harvest time, the system should treat the situation as more urgent.

Once the crop is ready:

- Quality can begin degrading.
- Perishable crops lose value quickly.
- The farmer may need immediate liquidity.
- Storage or transport may need to be arranged immediately.
- Auction duration may need to be shorter.

The system should therefore prioritize:

- Fast verification
- Current market price
- Immediate buyer opportunities
- Short bidding windows
- Transport availability
- Storage availability
- Net realization

Crop perishability should influence urgency.

Example:

```text
Onion
Urgency: Low

Tomato
Urgency: High

Grapes
Urgency: High

Wheat
Urgency: Very Low
```

---

# 3. Core Farmer Inputs

The farmer should provide the minimum information necessary to generate a useful market decision.

Core inputs:

- Farmer location
- Crop
- Crop subtype / variety
- Quantity
- Photos
- Self-declared quality
- Preferred time of money

Optional inputs:

- Land area
- Sowing date
- Expected harvest date
- Historical yield
- Expected quantity before harvest

The preferred-time-of-money input is important because a recommendation must respect the farmer's urgency.

Suggested options:

```text
When do you need the money?

- Immediately
- Within 3 days
- Within 7 days
- No urgency
```

A farmer who needs money immediately may receive a different recommendation from a farmer who can wait for a higher expected return.

---

# 4. Produce Lifecycle

The platform should distinguish between three different states.

## 4.1 Estimated Produce

Pre-harvest crop information.

Example:

```text
EXPECTED PRODUCE

Crop:
Onion

Estimated Quantity:
4,500 kg

Expected Harvest:
20 September
```

This record is used for planning only.

It cannot be auctioned.

---

## 4.2 Harvested Produce

Once harvesting has occurred, estimated quantity is replaced by actual quantity.

Example:

```text
HARVESTED PRODUCE

Crop:
Onion

Actual Quantity:
4,320 kg
```

The produce is still not eligible for bidding until the required quantity and quality checks are completed.

---

## 4.3 Verified Lot

Only a Verified Lot is allowed to enter bidding.

Example:

```text
VERIFIED LOT

Lot ID:
ON-3821

Crop:
Red Onion

Verified Quantity:
4,280 kg

Verified Grade:
A

Verification Status:
Verified
```

Core rule:

> A lot can only be placed for bidding after harvesting is complete and the required quantity and quality have been verified.

This improves buyer trust and prevents unreliable or inaccurate listings.

---

# 5. Farmer-Declared Quality

Before verification, the farmer may provide basic self-declared quality information.

Possible fields:

- Size
- Colour
- Variety
- Ripeness
- Moisture, if known
- Damage percentage
- Visible defects
- Photos

This must be clearly labelled as:

```text
Farmer Declared
```

The farmer should not be allowed to mark their own produce as officially verified.

After professional assessment:

```text
Verified Grade A
```

can be attached to the lot.

---

# 6. Harvesting Service Integration — Optional Add-On

Harvesting can be included as an optional part of the platform.

The farmer may request:

- Harvesting labour
- Harvesting tools
- Harvest machinery
- Quantity measurement during harvest
- Photo capture
- Preliminary quality observation

Flow:

```text
Farmer Requests Harvesting
        ↓
Harvest Team / Service Assigned
        ↓
Crop Harvested
        ↓
Quantity Measured
        ↓
Photos Captured
        ↓
Preliminary Quality Recorded
        ↓
Harvested Produce Created
```

This can reduce friction because quantity verification begins during harvesting.

However, the harvesting provider should not automatically become the final quality authority.

Recommended distinction:

```text
Quantity:
Harvest Verified

Quality:
Preliminary Grade A
```

For higher-confidence transactions, a Quality Assessor can later provide:

```text
Quality:
Verified Grade A
```

This harvesting service is useful but should remain an optional feature rather than a dependency for the entire system.

---

# 7. Current Market Baseline

Once produce is harvested or verified, the farmer should immediately see a current-sale baseline.

The platform should show:

- Nearest mandi
- Current crop price
- Distance to mandi
- Estimated transportation cost
- Handling / relevant selling costs
- Expected net realization

Example:

```text
TODAY'S BASELINE

Nearest Mandi:
Lasalgaon

Distance:
21 km

Current Price:
₹27.20/kg

Estimated Transport:
₹1,700

Estimated Handling:
₹400

Expected Net Realization:
₹1,14,316
```

This baseline is important because every future recommendation or bid can be compared against:

> "What would happen if I simply sold today?"

---

# 8. Future Sale Scenarios

The system should estimate future selling opportunities using:

- Predicted mandi price
- Expected transportation cost
- Storage cost
- Quality degradation
- Spoilage risk
- Expected buyer demand
- Preferred payment time

Instead of showing the farmer many separate calculations, the system should present simplified scenarios.

Example:

| Option | Expected Net Realization |
|---|---:|
| Sell today | ₹1,14,300 |
| Store 3 days | ₹1,18,200 |
| Store 7 days | ₹1,15,700 |

Detailed breakdown may be shown on demand.

Example:

```text
STORE 3 DAYS

Expected Selling Value:
₹1,22,000

Transport:
-₹1,700

Storage:
-₹1,100

Expected Quality Loss:
-₹1,000

Expected Net:
₹1,18,200

Expected Improvement:
+₹3,900
```

---

# 9. Sell / Hold Decision Support

The platform should provide a recommendation but must not make the decision automatically.

Possible outputs:

```text
Recommendation:
Sell Now
```

or:

```text
Recommendation:
Hold Approximately 3 Days
```

The recommendation should consider:

- Current market price
- Historical price trend
- Predicted future price
- Storage cost
- Transport cost
- Quality degradation
- Crop perishability
- Buyer demand
- Farmer's preferred time of money

The farmer always makes the final decision.

---

# 10. Auction / Bidding

Once the lot is verified, the farmer can decide when to make it available for bidding.

Possible options:

```text
Start Now
```

or:

```text
Schedule Auction
```

Suggested bidding durations:

- 2 hours
- 6 hours
- 12 hours
- 24 hours
- Custom scheduled start/end

The farmer should also be able to accept a good offer before the auction ends.

This is especially important for highly perishable crops.

---

# 11. Buyers and FPOs in Bidding

The system must distinguish between two different types of opportunities.

## 11.1 Direct Purchase Offer

A buyer directly offers to purchase the farmer's lot.

Example:

```text
DIRECT PURCHASE OFFER

Buyer:
ABC Foods

Price:
₹30/kg

Quantity:
4,000 kg
```

---

## 11.2 FPO Aggregation Offer

An FPO may not actually buy the produce.

Instead, it may offer to aggregate the farmer's produce into a larger lot.

Example:

```text
FPO AGGREGATION OFFER

FPO:
Nashik Agro FPO

Your Contribution:
4,000 kg

Expected Aggregated Lot:
40 tonnes

Expected Sale Price:
₹29/kg

FPO Service Cost:
₹0.40/kg

Expected Farmer Net:
₹28.60/kg
```

An FPO may also act as a direct buyer in some cases.

The system must therefore distinguish:

```text
FPO as Buyer
```

from:

```text
FPO as Aggregator / Seller Representative
```

---

# 12. Offer Structure

Offers should not contain only price.

An offer should represent the complete economic deal.

Recommended fields:

- Price per quantity
- Quantity requested
- Pickup time
- Payment terms
- Transport arranger
- Transport payer
- Storage arranger
- Storage payer
- Quality requirements
- Delivery location
- Offer expiry
- Buyer reliability

Example:

```text
ABC FOODS OFFER

Price:
₹30/kg

Quantity:
4,000 kg

Transport:
Buyer Arranges
Buyer Pays

Storage Before Pickup:
Farmer Arranges
Farmer Pays

Pickup:
Within 24 Hours

Payment:
Same Day

Buyer Reliability:
94/100
```

---

# 13. Responsibility Model

Transport and storage must not be permanently assigned to the Farmer or Buyer role.

They are transaction-specific responsibilities.

Each service should distinguish:

## Transport

- Who arranges it?
- Who pays for it?
- Who provides it?

Example:

```text
Transport Arranger:
Farmer

Transport Payer:
Buyer

Transport Provider:
Maha Logistics
```

or:

```text
Transport Arranger:
Buyer

Transport Payer:
Buyer

Transport Provider:
Maha Logistics
```

---

## Storage

- Who arranges it?
- Who pays for it?
- Who provides it?

Example:

```text
Storage Arranger:
FPO

Storage Payer:
Farmer

Storage Provider:
Nashik Cold Storage
```

This avoids hardcoding transport/storage features into a specific role.

---

# 14. Dynamic Feature Exposure

The platform UI should show features based on transaction responsibilities, not just RBAC role.

Example:

If the farmer is the transport arranger:

```text
Transport:
Your Responsibility

[ Find Transport Providers ]
```

If the buyer is the transport arranger:

```text
Transport:
Handled by ABC Foods
```

No transport booking action is shown to the farmer.

The same logic applies to storage.

This creates a cleaner user experience and prevents permission complexity.

---

# 15. Offer Comparison

The platform should rank offers primarily using:

> **Expected Farmer Net Realization**

not simply the headline bid price.

Example:

| Offer | Headline Price | Estimated Costs | Expected Net |
|---|---:|---:|---:|
| Buyer A | ₹30/kg | Low | ₹1,20,000 |
| Buyer B | ₹31/kg | High transport | ₹1,17,600 |

Buyer A should rank higher economically even though Buyer B offers a higher per-kg price.

---

# 16. Buyer Reliability Should Remain Separate

Buyer reliability should not be hidden inside a mysterious combined score.

Example:

```text
BUYER A

Expected Net:
₹1,20,000

Payment:
Same Day

Reliability:
96/100
```

versus:

```text
BUYER B

Expected Net:
₹1,22,000

Payment:
Within 7 Days

Reliability:
68/100
```

The platform can warn:

> Buyer B offers ₹2,000 more, but has significantly lower payment reliability.

The farmer should be able to understand the trade-off.

---

# 17. Counteroffers and Negotiation

The farmer should be able to:

- Accept
- Reject
- Counteroffer

A counteroffer may change:

- Price
- Quantity
- Transport responsibility
- Storage responsibility
- Pickup time
- Payment terms

Example:

```text
Buyer:
₹29.50/kg
Transport: Buyer
Storage: Farmer
```

Farmer counter:

```text
₹29.50/kg
Transport: Buyer
Storage: Buyer
```

Buyer can accept or reject.

---

# 18. Freeze Terms After Acceptance

Once a bid is accepted, the agreed trade terms should be frozen.

Example:

```text
TRADE AGREEMENT #828

Price:
₹29.50/kg

Quantity:
4,280 kg

Transport Arranger:
Buyer

Transport Payer:
Buyer

Storage Arranger:
Farmer

Storage Payer:
Farmer

Pickup By:
4 September

Payment Due:
Delivery Day
```

These terms should not be silently editable.

Any later modification should require an explicit mutually accepted amendment.

This is important for dispute resolution.

---

# 19. Transport Provider Selection

If the farmer is responsible for arranging transport, the platform should expose transport options.

Example:

| Provider | Capacity | Cost | ETA |
|---|---:|---:|---:|
| Transport A | 5T | ₹2,200 | 2h |
| Transport B | 5T | ₹2,550 | 1h |

Farmer chooses a suitable provider.

If the buyer is responsible, the same workflow is exposed to the buyer instead.

The Transport Manager provides the actual service.

---

# 20. Storage Provider Selection

If the farmer is responsible for storage, the platform should show suitable storage options.

Example:

```text
Nashik Warehouse

Distance:
8 km

Available Capacity:
12 tonnes

Price:
₹0.20/kg/day

Suitable For:
Onion
```

If storage is the buyer's responsibility, the buyer receives the storage selection workflow.

The Storage Manager provides the actual service.

---

# 21. Storage Before and After Trade

Storage should not depend entirely on an accepted order.

A farmer may store produce before bidding.

Example:

```text
Harvest Complete
      ↓
Market Price Unfavourable
      ↓
Farmer Books Storage
      ↓
Produce Stored
      ↓
Auction Started Later
```

Therefore, the system should treat:

```text
Lot
```

and:

```text
Trade
```

as separate concepts.

Services may attach:

- To a Lot before sale
- To a Trade after sale

---

# 22. Crop Perishability

Crop perishability should affect:

- Auction urgency
- Recommended bidding duration
- Storage recommendation
- Quality degradation calculations
- Sell/hold recommendation

This can be implemented with simple crop-level rules.

Example:

```text
Onion:
Low Urgency

Tomato:
High Urgency

Grapes:
High Urgency

Wheat:
Very Low Urgency
```

No complex AI is required for the first version.

---

# 23. Fulfilment Flow

After acceptance:

```text
Trade Terms Frozen
        ↓
Quality Tasks
if required
        ↓
Storage
if required
        ↓
Transport
if required
        ↓
Delivery
        ↓
Buyer Acceptance
        ↓
Payment
```

Responsibilities are assigned dynamically according to the accepted offer.

---

# 24. Payment Tracking

The farmer should see a transparent payment breakdown.

Example:

```text
Transaction Value:
₹28,500

Transport Deduction:
₹1,200

Other Agreed Charges:
₹300

Net Payable:
₹27,000

Paid:
₹10,000

Pending:
₹17,000

Due:
5 September
```

This prevents confusion over deductions and outstanding amounts.

---

# 25. Order Tracking

The farmer should be able to see the current status of the trade.

Suggested lifecycle:

```text
Offer Accepted
      ↓
Quality Verified
      ↓
Pickup Scheduled
      ↓
Picked Up
      ↓
In Transit
      ↓
Delivered
      ↓
Buyer Accepted
      ↓
Payment Pending
      ↓
Paid
```

---

# 26. Transaction History

All completed trades should remain visible.

Example:

```text
2026 SALES

1 Sep
Onion
ABC Foods
₹27,000
PAID

18 Aug
Tomato
Maha Retail
₹18,600
PAID
```

Transaction history can later contribute to farmer reputation and analytics.

---

# 27. Buyer Trust Information

Before accepting an offer, the farmer should see buyer credibility information.

Example:

```text
ABC Foods

Verified Business:
Yes

Completed Transactions:
128

On-Time Payments:
97%

Average Payment Time:
1.3 days

Disputes:
2

Reliability:
94/100
```

This is important because a high offered price is not useful if the buyer is unreliable.

---

# 28. Grievance / Dispute Support

The farmer should be able to raise issues such as:

- Payment not received
- Incorrect payment
- Buyer rejected agreed quality
- Quantity disagreement
- Transport damage
- Storage damage
- Buyer cancellation
- Incorrect quality assessment
- Violation of agreed trade terms

Evidence may include:

- Photos
- Quality reports
- Transaction terms
- Transport records
- Delivery records
- Payment records
- Messages

---

# 29. Notifications

Farmers should receive relevant notifications such as:

```text
Onion price increased 7%.
```

```text
A new buyer matches your lot.
```

```text
ABC Foods offered ₹29/kg.
```

```text
Pickup scheduled for 10 AM.
```

```text
Buyer confirmed delivery.
```

```text
Payment received.
```

Possible channels:

- In-app notifications
- SMS
- WhatsApp
- Voice alerts

---

# 30. Role and Authorization Principle

The farmer role determines permanent capabilities such as:

- Create own produce records
- Create own lots
- Accept or reject offers
- Raise disputes
- View own transactions

However, service actions such as transport and storage must be controlled by transaction responsibility.

Authorization should conceptually consider:

```text
Actor Role
+
Relationship to Lot / Trade
+
Assigned Responsibility
+
Current Transaction State
```

Example:

```text
Farmer Role:
Farmer

Trade Responsibility:
Seller
Quality Arranger
Storage Arranger

Not Responsible For:
Transport

Current Capabilities:
Request Quality Assessment
Find Storage
Accept / Counter Offers

Unavailable:
Book Delivery Transport
```

This prevents RBAC from becoming overly complicated.

---

# 31. Features That Should NOT Be Permanently Attached to Farmer Role

Avoid giving every farmer permanent access to features such as:

```text
Transport Management
Storage Management
```

Instead, show context-specific actions.

Example:

```text
Transport:
Buyer is arranging.
```

or:

```text
Transport:
You are responsible.

[ Get Transport Quotes ]
```

This keeps the interface simple and matches real-world transactions.

---

# 32. Recommended Farmer Flow

The final farmer journey is:

```text
                     FARMER
                        │
             ┌──────────┴──────────┐
             │                     │
        PRE-HARVEST             HARVESTED
             │                     │
      Estimate Yield        Record Actual Crop
      Harvest Window              │
      Market Outlook              ▼
             │                VERIFICATION
             │          Quantity + Quality
             │                     │
             └──────────────► VERIFIED LOT
                                   │
                                   ▼
                          MARKET INTELLIGENCE
                                   │
                           Sell Today Baseline
                           Future Scenarios
                           Storage Scenarios
                                   │
                                   ▼
                            FARMER DECIDES
                                   │
                      ┌────────────┴───────────┐
                      │                        │
                    WAIT                    AUCTION
                      │                        │
                   STORAGE                  OFFERS
                      │                        │
                      └────────────┬───────────┘
                                   ▼
                            COMPARE OFFERS
                                   │
                       Price + Responsibilities
                       Payment + Reliability
                                   │
                                   ▼
                              ACCEPT OFFER
                                   │
                                   ▼
                           TRADE TERMS FROZEN
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
                 QUALITY       TRANSPORT       STORAGE
                if needed      if needed       if needed
                    │              │              │
                    └──────────────┼──────────────┘
                                   ▼
                                DELIVERY
                                   │
                                   ▼
                                PAYMENT
```

---

# 33. Core Farmer Features

The major farmer features are:

1. Farmer profile
2. Pre-harvest planning
3. Estimated harvest quantity and date
4. Harvest-time urgent workflow
5. Produce inventory
6. Harvested produce record
7. Verified lot creation
8. Farmer-declared quality
9. Optional harvesting service
10. Current mandi price comparison
11. Transportation cost estimation
12. Storage cost estimation
13. Historical price trends
14. Future price scenarios
15. Quality degradation estimation
16. Sell / hold recommendation
17. Preferred time-of-money input
18. Auction scheduling
19. Direct buyer offers
20. FPO aggregation offers
21. Offer comparison using net realization
22. Buyer reliability information
23. Accept / reject / counteroffer
24. Dynamic transport responsibility
25. Dynamic storage responsibility
26. Quality assessment requests
27. Transport provider selection
28. Storage provider selection
29. Trade term freezing
30. Order tracking
31. Payment tracking
32. Transaction history
33. Grievances / disputes
34. Notifications
35. Mobile-first and multilingual experience

---

# 34. Key Product Principles

## Principle 1 — Verified Lots Only for Bidding

No unverified harvested produce should enter formal bidding.

---

## Principle 2 — Net Realization Over Headline Price

The platform should answer:

> "How much money will the farmer actually receive?"

not merely:

> "Which buyer offered the highest price?"

---

## Principle 3 — Responsibilities Belong to the Trade

Transport, storage, quality, loading, and similar actions should be assigned dynamically.

They should not be permanently tied to Farmer or Buyer roles.

---

## Principle 4 — Arranger and Payer Are Different Concepts

The party arranging a service may not be the party paying for it.

---

## Principle 5 — Farmer Controls the Final Decision

Forecasts and recommendations should guide the farmer, not automatically execute a decision.

---

## Principle 6 — Keep Reliability Transparent

Economic return and buyer reliability should be shown separately.

---

## Principle 7 — Pre-Harvest and Post-Harvest Are Different Experiences

Pre-harvest is planning-oriented.

Post-harvest is action-oriented and urgency-sensitive.

---

## Principle 8 — Perishability Controls Urgency

Highly perishable crops should receive shorter bidding windows and stronger storage/transport urgency.

---

# 35. Final Farmer Objective

The farmer experience should ultimately answer:

```text
What do I have?
        ↓
What is it worth today?
        ↓
What could it be worth later?
        ↓
Who wants to buy it?
        ↓
Which offer gives me the highest useful return?
        ↓
What responsibilities am I accepting?
        ↓
How do I fulfil those responsibilities?
        ↓
When will I get paid?
```

The platform should therefore function as a complete:

> **Pre-Harvest Planning → Market Intelligence → Verified Lot → Bidding → Responsibility Assignment → Fulfilment → Payment**

workflow for the Farmer actor.
