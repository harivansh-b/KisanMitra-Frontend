# Transport Manager UI Specification

## Dashboard Goal

Help transport operators publish availability, quote suitable jobs, assign vehicles, coordinate pickup and delivery, and record proof or exceptions.

The account represents a provider organization with one or more vehicles; an owner-driver uses the same UI with one asset.

## Primary Navigation

`Home`, `Availability`, `Quote Requests`, `Jobs`, with `Fleet`, `Incidents`, `Earnings`, and `Profile` under **More** on mobile.

## Home Dashboard

Show:

1. Today's pickups, in-transit jobs, delayed tasks, and deliveries awaiting proof.
2. New quote requests and deadlines.
3. Available versus assigned vehicle capacity.
4. Active job map/list summary without making a map the only way to navigate.
5. Completion and payment summary.

Primary actions: **Update availability**, **Send quote**, **Confirm pickup**, or **Complete delivery**.

## Screens

### Availability and Fleet

- Vehicle type, capacity, supported handling, operating area/routes, available windows, and status.
- Fleet detail includes only operational identity and suitability information needed by the UI.
- Provider verification covers identity, vehicle ownership/authorization, registration number, vehicle type/capacity, region, contact, and required licences. Restricted marketplace actions show their verification requirement.

### Quote Requests

- Load crop, quantity, pickup/drop-off, time window, handling needs, produce/trade context, arranger, payer, and deadline.
- Receive public requests matched by route, capacity and vehicle conditions, plus private requests addressed to the provider. Include packaging, loading/unloading responsibility, cover/refrigeration needs, and field-access constraints.
- Quote includes price breakdown, vehicle, capacity, ETA, schedule, terms, and expiry.
- A response becomes a transport job only after the Farmer awards it; keep it in **Quote Requests** until then and move the awarded work to **Shipments**.

### Jobs

- Group by upcoming pickup, assigned, in transit, delivery due, exception, and completed.
- A consolidated shipment may contain multiple items and pickup locations. Each item retains its trade, produce, quantity, pickup, and status.
- Job detail shows frozen service terms, route, contacts, load, schedule, and milestone timeline.
- Label FPO procurement transport as inbound (`Farmer → FPO collection centre`) or outbound (`FPO → Buyer`) and keep the two legs as distinct jobs/terms.
- Pickup confirmation records quantity, time, condition, responsible handoff party, and proof.
- Delivery confirmation records quantity, time, recipient, condition, and proof.
- Delivery proof becomes receiving-inspection evidence but does not itself represent buyer acceptance.

### Incidents and Earnings

- Record delay, breakdown, failed pickup, route issue, shortage, or damage with evidence and affected milestone.
- An incident remains an operational fact. If a participant requests corrective action, link the resulting grievance without converting the incident itself.
- Earnings show agreed charge, approved adjustment, paid, and pending per job.

## Key UI Rules

- Do not silently change price or schedule after confirmation; show an amendment request.
- Keep arranger and payer separately visible.
- Preserve proof of pickup and delivery.
- Status must remain understandable without relying only on location tracking.
- Drafting vehicles is available before verification; publishing availability and accepting jobs require verified status.

## Responsive Priorities

- Mobile: driver/operator task sequence, contact actions, pickup/delivery proof, and incident capture.
- Desktop: dispatch board, quote queue, fleet availability, multi-job monitoring, and earnings review.
