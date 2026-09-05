# SIH26132 — Admin Actor Requirements and Feature Specification

## 1. Purpose of the Admin Actor

The Admin actor is responsible for maintaining trust, transparency, safety, and observability across the marketplace.

The Admin should **not normally participate directly in buying, selling, transport, storage, or quality grading**.

Instead, the Admin should focus on four major responsibilities:

1. **User and organization verification**
2. **Conflict and dispute resolution**
3. **Platform monitoring and risk control**
4. **Analytics and policy intelligence**

The Admin experience should therefore be centered around:

```text
Verify
  ↓
Monitor
  ↓
Investigate
  ↓
Resolve
  ↓
Audit
  ↓
Analyze
```

The Admin should protect the marketplace without becoming an operational participant in normal transactions.

---

# 2. Main Admin Responsibilities

The Admin actor should be responsible for:

- Verifying users and organizations
- Reviewing verification documents
- Approving or rejecting marketplace participants
- Suspending or restricting users when necessary
- Reviewing disputes
- Collecting and reviewing transaction evidence
- Requesting additional evidence
- Triggering reassessment where required
- Recording conflict-resolution decisions
- Monitoring payment reliability
- Monitoring seller and service-provider reliability
- Detecting suspicious or anomalous activity
- Monitoring marketplace activity
- Monitoring farmer outcomes
- Monitoring demand and supply
- Monitoring transport, storage, and quality-service availability
- Maintaining auditability of administrative actions

---

# 3. User and Organization Verification

The Admin should verify participants that require a higher degree of trust.

Major verification targets:

- Buyers
- FPOs
- Transport Managers / Providers
- Storage Managers / Providers
- Quality Assessors

Farmer verification may be lighter depending on the onboarding model.

The general verification flow is:

```text
User Registers
      ↓
Submits Required Information / Documents
      ↓
Verification Pending
      ↓
Admin Reviews
      ↓
Approve / Reject / Request More Information
      ↓
Verified / Rejected / Pending
```

Suggested verification states:

```text
PENDING
UNDER_REVIEW
NEEDS_MORE_INFORMATION
VERIFIED
REJECTED
SUSPENDED
```

---

# 4. Verification Must Affect Marketplace Permissions

Verification should not be only a visual badge.

It should affect platform capabilities.

Example:

```text
Unverified Buyer:
Can Browse

Verified Buyer:
Can Create Requirements
Can Bid
Can Make Offers
Can Purchase
```

Similarly:

```text
Unverified Quality Assessor:
Cannot Submit Official Assessment

Verified Quality Assessor:
Can Submit Verified Assessment
```

This makes verification meaningful.

---

# 5. Buyer Verification

The Admin may verify:

- Business name
- Business registration
- GST / tax registration if applicable
- Address
- Contact information
- Identity of authorized representative
- Procurement location
- Payment history once transactions begin

Example:

```text
BUYER VERIFICATION

Business:
ABC Foods

Business Registration:
Verified

GST:
Verified

Address:
Verified

Status:
APPROVED
```

---

# 6. FPO Verification

The Admin may verify:

- FPO identity
- Registration details
- Contact details
- Operating region
- Member base
- Collection centre details
- Service capabilities
- Procurement capabilities

The Admin should distinguish:

```text
FPO as Service Provider
```

from:

```text
FPO as Crop Buyer / Procurer
```

where relevant.

---

# 7. Transport Provider Verification

Transport providers may be verified based on:

- Provider identity
- Vehicle ownership / authorization
- Vehicle number
- Vehicle type
- Vehicle capacity
- Operating region
- Contact details
- Required licenses or documents

Example:

```text
TRANSPORT PROVIDER

Vehicle:
MH-XX-XXXX

Capacity:
5 tonnes

Operating Area:
Nashik / Pune

Status:
VERIFIED
```

---

# 8. Storage Provider Verification

Storage providers may be verified based on:

- Warehouse identity
- Location
- Capacity
- Storage type
- Supported crops
- Cold-storage capability
- Relevant certifications
- Contact details

Example:

```text
STORAGE PROVIDER

Facility:
Nashik Agri Warehouse

Capacity:
500 tonnes

Storage Type:
Dry Warehouse

Supported Crops:
Onion, Wheat, Pulses

Status:
VERIFIED
```

---

# 9. Quality Assessor Verification

Quality Assessor verification should be stricter because assessment results directly influence trade value.

Possible verification fields:

- Identity
- Qualification
- Certification
- Organization
- Authorized crop types
- Operating region
- Assessment experience

Example:

```text
QUALITY ASSESSOR

Authorized Crops:
Onion
Tomato
Grapes

Region:
Nashik

Status:
VERIFIED
```

A Quality Assessor should only be allowed to officially assess crops for which they are authorized.

---

# 10. Verification Queue

The Admin should have a centralized verification queue.

Example:

```text
VERIFICATION QUEUE

Buyer Requests:
12

FPO Requests:
4

Transport Providers:
8

Storage Providers:
3

Quality Assessors:
6
```

Useful filters:

- Actor type
- Submission date
- Region
- Verification status
- Missing documents
- Risk flags

Suggested statuses:

```text
Pending
Under Review
Needs Documents
Approved
Rejected
```

---

# 11. Request Additional Information

Instead of immediately rejecting incomplete applications, the Admin should be able to request additional information.

Flow:

```text
Admin Reviews Application
        ↓
Information Missing
        ↓
Request Additional Documents
        ↓
User Uploads
        ↓
Admin Continues Review
```

This creates a cleaner verification process.

---

# 12. User Moderation

The Admin should be able to take moderation actions such as:

- Warning
- Temporary restriction
- Temporary suspension
- Bidding restriction
- Service-provider restriction
- Permanent disablement
- Account restoration

Example:

```text
USER SUSPENSION

User:
Buyer ABC Foods

Reason:
Repeated Non-Payment

Duration:
7 Days

Admin:
A-103

Timestamp:
...
```

All moderation actions should be logged.

---

# 13. Dispute Management

The Admin should be responsible for resolving transaction conflicts that cannot be handled automatically.

Possible dispute sources:

- Farmer
- FPO
- Buyer
- Transport Provider
- Storage Provider
- Quality Assessor

Common dispute types:

```text
Payment Dispute
Quality Disagreement
Quantity Disagreement
Transport Damage
Storage Damage
Late Delivery
Buyer Rejection
Seller Cancellation
Service Provider Failure
Incorrect Assessment
Violation of Trade Terms
```

---

# 14. Structured Dispute Record

Every dispute should be attached to the relevant transaction and automatically collect available evidence.

Example:

```text
DISPUTE #D-102

Trade:
TR-8821

Raised By:
Farmer

Against:
ABC Foods

Reason:
Quantity Disagreement

Evidence:
Accepted Trade Terms
Verified Quantity
Pickup Record
Transport Record
Delivery Record
Buyer Receiving Inspection
Photos
Messages
```

The Admin should not have to manually search across multiple systems to reconstruct the transaction.

---

# 15. Conflict Resolution Flow

The dispute-resolution flow should be:

```text
Dispute Raised
      ↓
Evidence Automatically Collected
      ↓
Admin Reviews
      ↓
Request Additional Evidence if Needed
      ↓
Reassessment / Investigation if Required
      ↓
Admin Decision
      ↓
Corrective Action
      ↓
Dispute Closed
```

This is sufficient for the SIH platform without implementing a full legal arbitration system.

---

# 16. Possible Dispute Decisions

Depending on the dispute, possible outcomes may include:

- No action
- Full payment required
- Partial payment
- Quantity adjustment
- Quality reassessment
- Refund of service charge
- Warning
- Reliability penalty
- Temporary suspension
- Permanent restriction
- Transaction correction through an explicit resolution record

The Admin should not silently rewrite historical records.

---

# 17. Quality Disputes

Quality disputes should have special handling.

Example:

```text
Original Assessment:
Grade A

Buyer Claims:
Grade B
```

The Buyer should not be able to directly overwrite the existing assessment.

The Admin may trigger:

```text
Reassessment Requested
```

Flow:

```text
Original Quality Assessment
        ↓
Buyer Evidence
        ↓
Admin Review
        ↓
Independent Reassessment
        ↓
Resolution
```

This protects both the seller and the Buyer.

---

# 18. Quantity Disputes

Quantity disputes should compare:

- Verified quantity
- Pickup quantity
- Transport record
- Delivered quantity
- Accepted quantity
- Quantity tolerance
- Loss/damage evidence

Example:

```text
Verified:
20,000 kg

Loaded:
19,950 kg

Delivered:
19,700 kg

Tolerance:
±2%
```

The Admin can determine whether the discrepancy is:

- Within tolerance
- Due to transport loss
- Due to incorrect declaration
- Due to receiving error
- Due to another issue

---

# 19. Payment Disputes

The Admin should be able to view:

- Agreed amount
- Accepted quantity
- Agreed deductions
- Final payable amount
- Payment due date
- Amount paid
- Outstanding amount
- Payment status

Example:

```text
Expected:
₹1,20,000

Paid:
₹80,000

Pending:
₹40,000

Due Date:
3 Days Ago

Status:
OVERDUE
```

The Admin may then record:

- Payment overdue
- Partial settlement
- Payment resolution
- Buyer reliability impact

---

# 20. Transport Disputes

Transport disputes may involve:

- Late pickup
- Late delivery
- Crop damage
- Vehicle mismatch
- Capacity mismatch
- Cancellation
- Incorrect transport charge
- Delivery to wrong location

Evidence may include:

- Booking terms
- Pickup confirmation
- Delivery confirmation
- Photos
- Timestamps
- Route information
- Provider updates

---

# 21. Storage Disputes

Storage disputes may involve:

- Crop damage
- Spoilage
- Incorrect storage conditions
- Capacity mismatch
- Incorrect storage charges
- Delayed release
- Service failure

Evidence may include:

- Storage booking
- Check-in quantity
- Check-out quantity
- Quality records
- Photos
- Duration
- Agreed storage conditions

---

# 22. Admin Should Not Silently Modify Transactions

Original transaction records should remain immutable.

The Admin should not directly change:

```text
₹30/kg → ₹25/kg
```

or:

```text
Grade A → Grade B
```

without recording an explicit resolution.

Recommended model:

```text
ORIGINAL TRADE
Immutable

        ↓

ADMIN RESOLUTION

Adjustment:
₹5,000 Reduction

Reason:
Verified Transport Damage

Decision Date:
...
```

This preserves auditability.

---

# 23. Reliability Monitoring

The platform should calculate reliability automatically from transaction history.

The Admin monitors these metrics and investigates unusual behaviour.

## Buyer Reliability Inputs

- On-time payment rate
- Completed transactions
- Cancellations
- Disputes
- Delivery rejection rate
- Payment delays

## Farmer Reliability Inputs

- Quantity accuracy
- Quality match
- Pickup readiness
- Cancellations
- Completed trades

## FPO Reliability Inputs

- Procurement fulfilment
- Buyer fulfilment
- Quality consistency
- Quantity consistency
- Farmer payment performance

## Transport Provider Reliability Inputs

- Pickup punctuality
- Delivery punctuality
- Damage rate
- Cancellation rate

## Storage Provider Reliability Inputs

- Damage incidents
- Spoilage incidents
- Capacity accuracy
- Service completion rate

## Quality Assessor Reliability Inputs

- Assessment completion rate
- Reassessment disagreement rate
- Complaint rate
- Dispute involvement

---

# 24. Fraud and Anomaly Monitoring

The Admin should have a lightweight rule-based risk-monitoring layer.

Possible alerts:

```text
Buyer repeatedly offering unusually high prices
```

```text
Buyer repeatedly failing payment
```

```text
Farmer repeatedly misreporting quantity
```

```text
Quality Assessor frequently overturned on reassessment
```

```text
Transport Provider repeatedly cancelling
```

```text
Multiple disputes involving the same account
```

```text
Suspiciously large price deviation from nearby market
```

No advanced AI is required initially.

Simple rules and thresholds are sufficient.

---

# 25. Marketplace Analytics

The Admin dashboard should provide high-level marketplace metrics.

Examples:

```text
Total Farmers
Total FPOs
Verified Buyers
Verified Service Providers
Active Lots
Open Auctions
Active Buyer Requirements
Transactions Today
Completed Trades
Failed Trades
Total Trade Value
```

These metrics show overall marketplace activity.

---

# 26. Market Analytics

Market analytics should include:

- Crop-wise supply
- Crop-wise demand
- Average selling price
- Nearby mandi price comparison
- District-wise price differences
- Demand-supply imbalance
- Price trends
- Buyer demand trends
- FPO procurement trends

Example:

```text
Nashik Onion

Active Supply:
2,430 tonnes

Active Buyer Demand:
1,870 tonnes

Supply Surplus:
560 tonnes

Average Platform Price:
₹28.40/kg
```

---

# 27. Farmer Outcome Analytics

Because the problem statement focuses on improved farmer price realization, this should be a major Admin analytics area.

Useful metrics:

- Average farmer net realization
- Average farmer realization compared with mandi baseline
- Percentage of farmers receiving better net value than nearest mandi
- Average transport cost saved
- Average storage cost
- Average time from verification to sale
- Percentage of immediate/distress sales
- Farmer payment delay
- Average number of competing offers

Example:

```text
Average Farmer Net Improvement:
+8.4%
```

This can become one of the strongest government-facing metrics.

---

# 28. FPO Analytics

Useful FPO metrics:

- Active FPOs
- Procurement campaigns
- Farmer supply commitments
- Crop volume purchased
- Aggregated volume
- Buyer fulfilment rate
- Farmer payment performance
- FPO service usage
- Average FPO procurement price
- FPO-to-buyer margin
- Failed procurement campaigns

---

# 29. Buyer Analytics

Useful Buyer metrics:

- Active Buyers
- Active requirements
- Procurement volume
- Average landed cost
- Offer acceptance rate
- Buyer payment time
- Buyer cancellation rate
- Buyer dispute rate
- Buyer fulfilment success
- Repeat supplier relationships

---

# 30. Transport Analytics

Admin should monitor:

- Available transport providers
- Available vehicle capacity
- Average transport price
- High-demand routes
- Booking completion rate
- Pickup delays
- Delivery delays
- Damage rate
- Cancellation rate

Example:

```text
Nashik → Pune

Average Cost:
₹X / tonne

Available Vehicles:
23

Average Pickup Delay:
42 minutes
```

---

# 31. Storage Analytics

Admin should monitor:

- Available storage capacity
- Warehouse utilization
- Cold-storage utilization
- Average storage cost
- Crop-wise storage usage
- Storage-related damage rate
- Average duration of storage
- Facility availability

Example:

```text
Nashik Storage Utilization:
78%
```

---

# 32. Quality Assessment Analytics

Useful metrics:

- Assessments per day
- Average assessment turnaround
- Active assessors
- Crop-wise assessment demand
- Reassessment rate
- Assessment dispute rate
- Average time from request to verification

---

# 33. Payment Analytics

Admin should monitor:

- Total pending payments
- Overdue payments
- Average payment time
- Buyer-wise payment reliability
- FPO farmer-payment status
- Partial payments
- Payment disputes

Example:

```text
Payments Due Today:
₹8,40,000

Overdue:
₹1,20,000
```

---

# 34. Dispute Analytics

Useful metrics:

- Total open disputes
- Disputes by type
- Average resolution time
- Disputes by actor type
- Repeat offenders
- Quality reassessment frequency
- Payment dispute frequency
- Transport dispute frequency
- Storage dispute frequency

Example:

```text
OPEN DISPUTES

Payment:
14

Quality:
6

Quantity:
3

Transport:
8

Storage:
2
```

---

# 35. Dispute Aging

Admin should be able to see unresolved disputes by age.

Example:

```text
< 24 Hours:
12

1–3 Days:
8

> 3 Days:
4
```

This helps prioritize unresolved issues.

---

# 36. District and Crop Filtering

Analytics should support filtering by:

- State
- District
- Taluka
- Crop
- Crop subtype
- Date range
- Buyer type
- FPO
- Storage facility
- Transport route
- Quality assessor

This allows the Admin to investigate local market conditions.

---

# 37. Demand-Supply Imbalance Alerts

The system should identify major regional imbalances.

Examples:

```text
High Onion Surplus Detected:
Nashik
```

```text
High Tomato Demand Detected:
Mumbai
```

These alerts can help government or marketplace operators understand regional bottlenecks.

---

# 38. Price Anomaly Monitoring

The Admin should be alerted when marketplace prices differ abnormally from reference prices.

Example:

```text
Platform Onion Price:
₹15/kg

Nearby Mandi Average:
₹28/kg

Alert:
Possible Data Error / Distress Sale / Fraud
```

Possible causes:

- Incorrect data
- Unit-conversion error
- Manipulation
- Distress sale
- Fraudulent offer
- Wrong crop/quality mapping

---

# 39. Service Availability Monitoring

The Admin should be able to identify infrastructure bottlenecks.

Example:

```text
Nashik

Verified Lots:
High

Available Transport:
Low

Storage Capacity:
Critical

Quality Assessor Availability:
Normal
```

This allows operational intervention or policy planning.

---

# 40. Admin Dashboard Structure

A practical Admin dashboard can be divided into:

```text
ADMIN
  │
  ├── VERIFICATION
  │     ├── Buyers
  │     ├── FPOs
  │     ├── Transport
  │     ├── Storage
  │     └── Quality Assessors
  │
  ├── DISPUTES
  │     ├── Payment
  │     ├── Quality
  │     ├── Quantity
  │     ├── Transport
  │     └── Storage
  │
  ├── RISK / MODERATION
  │     ├── Suspicious Activity
  │     ├── Reliability
  │     ├── Account Restrictions
  │     └── Audit Logs
  │
  └── ANALYTICS
        ├── Marketplace
        ├── Farmer Outcomes
        ├── FPO
        ├── Buyer
        ├── Transport
        ├── Storage
        ├── Quality
        └── Payments
```

---

# 41. Admin Actions Should Be Auditable

Every sensitive Admin action should record:

- Admin ID
- Action type
- Target user / transaction
- Reason
- Timestamp
- Previous state
- New state

Example:

```text
AUDIT EVENT

Admin:
A-103

Action:
Suspend Buyer

Target:
ABC Foods

Reason:
Repeated Non-Payment

Previous Status:
VERIFIED

New Status:
SUSPENDED

Timestamp:
...
```

---

# 42. Admin Analytics Should Mostly Be Read-Only

The Admin should primarily:

```text
Observe
Investigate
Verify
Resolve
Moderate
```

The Admin should not manually operate:

- Farmer lots
- Buyer bids
- FPO aggregation
- Transport bookings
- Storage bookings
- Quality grading

unless performing an explicit dispute-resolution or moderation action.

This preserves clean separation of responsibilities.

---

# 43. Possible Future Admin Sub-Roles

For the SIH version, one:

```text
ADMIN
```

role is sufficient.

Later, the system may divide Admin capabilities into:

```text
SUPER_ADMIN
VERIFICATION_ADMIN
DISPUTE_ADMIN
ANALYTICS_ADMIN
MODERATION_ADMIN
```

This should not be implemented unless needed.

---

# 44. Major Admin Features

The major Admin features are:

1. Admin dashboard
2. Verification queue
3. Buyer verification
4. FPO verification
5. Transport-provider verification
6. Storage-provider verification
7. Quality-assessor verification
8. Request additional documents
9. Approve verification
10. Reject verification
11. Suspend accounts
12. Restrict marketplace actions
13. Restore accounts
14. Dispute queue
15. View complete transaction evidence
16. Request additional evidence
17. Trigger quality reassessment
18. Resolve payment disputes
19. Resolve quantity disputes
20. Resolve quality disputes
21. Resolve transport disputes
22. Resolve storage disputes
23. Record explicit resolution
24. Reliability monitoring
25. Fraud/anomaly monitoring
26. User moderation
27. Audit logs
28. Marketplace analytics
29. Farmer outcome analytics
30. FPO analytics
31. Buyer analytics
32. Transport analytics
33. Storage analytics
34. Quality-assessment analytics
35. Payment analytics
36. Dispute analytics
37. District/crop filtering
38. Demand-supply alerts
39. Price anomaly alerts
40. Service-availability monitoring

---

# 45. Key Product Principles

## Principle 1 — Admin Protects Trust

The Admin should exist to make the marketplace trustworthy, not to perform normal marketplace actions.

---

## Principle 2 — Verification Must Affect Permissions

A verified badge should correspond to actual marketplace privileges.

---

## Principle 3 — Evidence-Based Dispute Resolution

Admin decisions should be based on:

```text
Trade Terms
+
Quality Records
+
Quantity Records
+
Transport Records
+
Storage Records
+
Delivery Records
+
Payment Records
```

rather than only user claims.

---

## Principle 4 — Original Records Remain Immutable

Admin resolutions should be recorded as explicit adjustments rather than silently rewriting history.

---

## Principle 5 — Reliability Should Be Data-Driven

Reliability scores should be computed from transaction behaviour.

Admin monitors and investigates instead of manually assigning arbitrary scores.

---

## Principle 6 — Analytics Should Focus on Outcomes

The Admin dashboard should not only show activity.

It should measure whether the platform improves:

- Farmer net realization
- Buyer sourcing reliability
- FPO aggregation efficiency
- Transport efficiency
- Storage utilization
- Payment reliability
- Dispute resolution

---

## Principle 7 — Admin Actions Must Be Auditable

Every sensitive moderation, verification, or dispute action must create an audit event.

---

## Principle 8 — Admin Is Mostly Read-Only Outside Exceptions

The Admin should observe and intervene only where trust, compliance, or dispute resolution requires it.

---

# 46. Final Admin Objective

The Admin experience should ultimately answer:

```text
Who is joining the marketplace?
        ↓
Are they trustworthy and verified?
        ↓
What transactions are happening?
        ↓
Where are disputes or failures occurring?
        ↓
What evidence exists?
        ↓
What corrective action is required?
        ↓
Are certain users behaving unreliably?
        ↓
Are there suspicious market patterns?
        ↓
Are farmers receiving better outcomes?
        ↓
Where are demand, supply, logistics, or storage bottlenecks?
```

The Admin should therefore function as a complete:

> **Verification → Monitoring → Conflict Resolution → Risk Control → Analytics**

layer for SIH26132.
