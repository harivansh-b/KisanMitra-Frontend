# Admin UI Specification

## Dashboard Goal

Protect trust, transparency, safety, and observability through participant verification, evidence-based dispute resolution, reliability/risk monitoring, and outcome-focused analytics.

Admin normally does not buy, sell, grade, book services, or operate lots. Use one `Admin` role for the current UI; verification, dispute, analytics, and moderation sub-roles are future possibilities only.

## Primary Navigation

`Overview`, `Verification`, `Grievances & Disputes`, `Risk & Moderation`, `Marketplace`, `Analytics`, and `Audit`.

On mobile, prioritize `Overview`, `Queues`, `Cases`, and **More**. All actions remain available, while dense investigation and analytics layouts are optimized for desktop.

## Home Dashboard

Show, in this order:

1. Critical queue: high-severity risk alerts, overdue disputes, stuck high-value trades, and payment failures.
2. Central verification queue by actor type and aging.
3. Grievances awaiting triage and open disputes by category and age (`<24h`, `1–3 days`, `>3 days`).
4. Marketplace activity: participants, active lots/auctions/requirements, trades, failures, and value.
5. Demand/supply imbalance, price anomaly, and service-availability alerts.
6. Farmer outcome summary, especially net realization versus nearest-mandi baseline and payment delay.
7. Recent sensitive admin actions and unresolved follow-ups.

Primary actions: **Review verification**, **Open dispute**, **Investigate alert**, or **View audit event**.

## Verification

### Central Queue

- Queue counts and records for buyers, FPOs, transport providers, storage providers, and quality assessors; farmer verification may use a lighter flow.
- Filter by actor type, submission date, state/district/region, status, missing documents, and risk flags.
- States: `Pending`, `Under review`, `Needs more information`, `Verified`, `Rejected`, and `Suspended`.
- Record age, missing items, risk flags, assigned reviewer, and latest response without opening detail.

### Review Workspace

- Shared: identity/entity, contact, address/region, submitted evidence, history, duplicate/risk signals, notes, and information-request timeline.
- Buyer: business registration, tax/GST, authorized representative, procurement locations, and transaction payment history when available.
- FPO: registration, operating region, member base, collection centres, service capabilities, and procurement capabilities; distinguish service-provider and crop-buyer modes.
- Transport: provider organization plus one or more vehicles, with identity, ownership/authorization, registration, type/capacity, operating region, contact, and required licences.
- Storage: provider organization plus one or more facilities, with identity/location, capacity/type, supported crops, cold-storage capability, certifications, and contact.
- Quality assessor: identity, qualification/certification, organization, authorized crops, operating region, and experience. Crop authorization must be explicit.

### Decisions and Permission Effects

- Actions: approve, reject, request additional information, suspend, or restore.
- Prefer an information request over rejection when evidence is incomplete; show required documents, reason, and resubmission state.
- Consequential actions require reason, confirmation, effective state, and audit preview.
- Verification affects capabilities, not only badges. For example, an unverified buyer may browse but cannot create requirements, bid, offer, or purchase; an unverified/unauthorized assessor cannot publish an official report.
- Use the shared verification permission matrix and display only actor-specific exceptions in the review.
- Actor detail shows effective permissions and active restrictions after the decision.

## Marketplace Oversight

- Search and inspect participants, lots, assessments, demands, matches, auctions/bids, offers, FPO campaigns/purchases, ownership transfers, trades, services, delivery/receiving records, payments, and disputes.
- Record detail shows linked actors, owner, responsibilities, frozen terms, source evidence, state history, amendments/resolutions, and risk flags.
- Preserve traceability from farmer source lot through partial transfers, FPO split/merge, aggregated lot, delivery, and buyer ownership.
- Normal records are read-only. Admin intervention occurs only through a documented verification, moderation, or dispute-resolution action.

## Grievances and Disputes

### Queue and Case Workspace

- Triage grievances by category, severity, value, perishability impact, actor type, age, and requested action. Accepting a grievance creates a separate formal dispute with response due and assigned admin.
- Categories: payment, quality, quantity, transport damage/service, storage damage/service, late delivery, buyer rejection, seller cancellation, provider failure, incorrect assessment, and trade-term violation.
- Link operational incidents where available and automatically assemble the frozen trade, assessments, quantity records, pickup/transport, storage, delivery/receiving, photos, messages, and payment records relevant to the dispute.
- Timeline shows claims, responses, evidence requests, reassessment/investigation, decisions, corrective actions, and closure.

### Evidence-Specific Review

- Quality: original report, buyer/seller evidence, assessor authorization, and independent reassessment. Never overwrite the original grade.
- Quantity: verified, loaded, delivered, accepted, tolerance, loss/damage, and receiving evidence.
- Payment: agreed/final amount, deductions, due date, paid/outstanding amounts, and delay.
- Transport: booking, vehicle, route, pickup/delivery proof, timing, condition, charges, and provider updates.
- Storage: booking, check-in/out quantity, conditions, duration, photos, charges, and incidents.

### Resolution

- Admin may request more evidence or trigger reassessment before deciding.
- Decision types may include no action, full/partial payment, quantity adjustment, reassessment, service refund, warning, confirmed behavior event, restriction/suspension, or an explicit linked transaction correction.
- The resolution records decision, reason, evidence basis, adjustment/remedy, responsible actor, effective time, and communication summary.
- Original trade, report, service, and payment records remain immutable.

## Reliability

- Reliability is derived from transaction behavior; Admin reviews unusual results but does not manually invent scores.
- Admin confirms authoritative behavior events from resolved evidence; the reliability display then reflects the recalculated result.
- Buyer: on-time payment, completion, cancellations, disputes, rejection rate, and delays.
- Farmer: quantity accuracy, quality match, readiness, cancellations, and completed trades.
- FPO: procurement/buyer fulfilment, quality/quantity consistency, and farmer payment performance.
- Transport: pickup/delivery punctuality, damage, and cancellation.
- Storage: damage/spoilage, capacity accuracy, and completion.
- Assessor: completion, turnaround, reassessment disagreement, complaints, and dispute involvement.
- Reliability detail shows metric definitions, period, sample size, trend, source records, and investigation state.

## Risk and Moderation

### Explainable Risk Alerts

- Use lightweight rules/thresholds for repeated non-payment, unusually high offers, repeated quantity mismatch, frequent assessor overturns, provider cancellations, repeat disputes, or abnormal price deviation from mandi references.
- Alert cards show observed value, threshold, explanation, affected actors/records, evidence, severity, and review state.
- Keep `Signal`, `Under investigation`, and `Confirmed violation` visibly distinct.
- Risk alerts and private moderation notes are Admin-only.

### Moderation Actions

- Warning, temporary restriction/suspension, bidding restriction, provider restriction, permanent disablement, and restoration.
- Show capability impact, reason, duration, related cases/alerts, confirmation, and affected user's resulting state.
- Every moderation action and restoration creates an audit event.

## Analytics

### Filters

Use state, district, taluka, crop/variety, date range, buyer subtype, FPO, facility, transport route, assessor, and transaction state where relevant.

### Areas

- **Marketplace:** farmers/FPOs, verified buyers/providers, lots, auctions, requirements, trades, failures, and trade value.
- **Market:** crop supply/demand, average platform price, mandi comparison, district price differences, trends, and imbalance.
- **Farmer outcomes:** net realization, improvement versus mandi, transport/storage cost, verification-to-sale time, distress-sale signal, competing offers, and payment delay.
- **FPO:** campaigns, commitments, purchased/aggregated volume, fulfilment, farmer payments, service use, procurement price, margin, and failed campaigns.
- **Buyer:** active demand, procurement volume, landed cost, acceptance, payment time, cancellation/dispute, fulfilment, and repeat suppliers.
- **Transport:** available capacity, route pricing/demand, completion, delays, damage, and cancellation.
- **Storage:** capacity/utilization, cost, crop usage, duration, availability, spoilage, and damage.
- **Quality:** volume, turnaround, assessor supply, crop demand, reassessment, and dispute rates.
- **Payments:** due/overdue totals, average time, partial payments, buyer/FPO reliability, and disputes.
- **Cases:** grievances awaiting triage plus open disputes, category, actor, aging, resolution time, reassessment, repeat offenders, and service-specific frequency.

### Operational and Policy Alerts

- Demand/supply imbalance by crop and region.
- Platform price deviation from nearby mandi/reference prices, with possible data, unit, mapping, distress, manipulation, or fraud causes.
- Transport, storage, and assessor shortages alongside verified-lot volume.
- Analytics are mostly read-only and should emphasize marketplace outcomes rather than activity alone.

## Audit

- Every sensitive verification, moderation, or resolution action records admin ID, action, target, reason, timestamp, previous state, and new state.
- Audit filters include admin, action type, target type, date, related dispute, and risk alert.
- Record detail links back to the affected actor/record and cannot be edited.

## Information Visibility

- Public views expose verification outcome and aggregated reliability only.
- Transaction participants may see richer operational metrics relevant to the trade.
- Verification documents, private notes, full dispute evidence, and fraud/risk flags remain Admin-only.

## Key UI Rules

- Admin protects trust and does not perform normal marketplace operations.
- Verification must gate effective permissions.
- Dispute decisions must be evidence-based.
- Original records remain immutable; adjustments use explicit linked resolutions.
- Reliability is behavior-derived and inspectable.
- Risk alerts are explainable signals, not automatic guilt.
- Analytics focus on farmer outcomes and marketplace reliability.
- Every sensitive admin action is reasoned, confirmed, and auditable.

## Responsive Priorities

- Mobile: critical queues, verification review, evidence requests, dispute decisions, alert acknowledgment, and audit lookup.
- Desktop: queue triage, multi-panel evidence review, record traceability, risk investigation, filtered analytics, and audit exploration.
