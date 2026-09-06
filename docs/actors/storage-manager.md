# Storage Manager UI Specification

## Dashboard Goal

Help storage operators publish usable capacity and pricing, respond to requests, manage produce check-in and check-out, and document condition or capacity exceptions.

The account represents a provider organization with one or more facilities; a single-facility operator uses the same UI with one asset.

## Primary Navigation

`Home`, `Facilities`, `Capacity`, `Requests`, `Bookings`, with `Incidents`, `Earnings`, and `Profile` under **More** on mobile.

## Home Dashboard

Show:

1. Check-ins, check-outs, and expiring holds requiring action.
2. New quote requests and response deadlines.
3. Capacity available, reserved, and occupied by facility/storage type.
4. Active bookings and condition alerts.
5. Recent completions and payment summary.

Primary actions: **Update capacity**, **Respond to request**, **Check in produce**, or **Check out produce**.

## Screens

### Facilities and Capacity

- Facility identity, location, storage types, supported crops, certifications, operating hours, and contact context.
- Capacity calendar by storage type with available, held, reserved, occupied, and unavailable quantities.
- Pricing by unit/day plus visible minimums or additional charges.
- Provider verification covers facility identity/location, stated capacity/type, supported crops, cold-storage capability, certifications, and contact. Restricted marketplace actions show their verification requirement.

### Requests

- Requested crop, quantity, dates, conditions, produce/trade context, arranger, payer, and deadline.
- Receive public requests matched by crop, capacity, location and storage capability, plus private requests addressed to the provider. Show storage type, expected duration, temperature/humidity or ventilation needs, packaging, and handling requirements.
- Respond with availability, price breakdown, terms, and quote expiry; decline with a short reason.
- A response becomes a booking only after the Farmer awards it; then remove it from the open request queue and show it under **Bookings**.

### Bookings

- List grouped by upcoming check-in, active storage, check-out due, and completed.
- Booking detail shows agreed terms, contacts, produce identity, quantity, storage conditions, payer, and timeline.
- A consolidated booking may contain multiple storage items. Each item retains its produce, trade, quantity, check-in/out context, and status.
- For FPO inventory, identify whether storage is before aggregation, during aggregation, or before buyer delivery.
- Check-in records actual quantity, timestamp, location/bin, condition, and evidence.
- Check-out records released quantity, condition, recipient, timestamp, and evidence.

### Incidents and Earnings

- Record temperature/condition issue, damage, shortage, access delay, or capacity conflict with evidence.
- An incident remains an operational fact. If a participant requests corrective action, link the resulting grievance without converting the incident itself.
- Earnings show quoted amount, adjustments, paid, and pending by booking without exposing unrelated trade finances.

## Key UI Rules

- A capacity change must not silently alter a confirmed booking.
- Distinguish provisional capacity holds from confirmed reservations.
- Keep the storage arranger and payer visible as separate fields.
- Preserve check-in and check-out evidence in the booking timeline.
- Drafting facilities is available before verification; publishing capacity and accepting bookings require verified status.

## Responsive Priorities

- Mobile: today's facility tasks, request response, check-in/out, evidence capture, and incident logging.
- Desktop: capacity calendar, multi-facility overview, request queue, and booking operations table.
