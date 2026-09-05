# UI research and applied direction

This research informs the frontend visual and interaction direction. It is not a feature or service specification.

## Products reviewed

- **AgriWebb:** operational agriculture software built around quick visibility into tasks, inventory, records, performance and field activity. Applied lesson: lead with today’s work and operational status, not decorative analytics.
- **Cropin:** agriculture operations presented as connected farm and supply-chain workspaces. Applied lesson: keep agricultural context in the terminology, status models and data presentation rather than relying on literal farm imagery.
- **Attio:** a collapsible workspace sidebar with search, tasks, reports, records and saved lists. Applied lesson: use stable object navigation and make records the center of the interface.
- **HubSpot CRM:** object index pages lead into structured record pages with overview, activity and associated information. Applied lesson: use compact tables for scanning, then reveal richer context in a detail view.
- **Linear:** saved filtered views, list/board display options, clear status language and focused work queues. Applied lesson: prefer dense, legible views and contextual filtering over many disconnected dashboard cards.
- **Stripe Dashboard:** a stable primary navigation, searchable business objects, task surfaces and overview metrics that lead to operational detail. Applied lesson: metrics should summarize work and provide a route into the underlying records.
- **Coupa Workbench:** centralizes requests that need action instead of making procurement users interpret a generic analytics page. Applied lesson: the buyer home should reconcile demand, selected supply and pending receiving work.
- **Odoo Inventory:** separates daily warehouse operations from inventory/location metrics and prioritizes overdue receipts, deliveries and transfers. Applied lesson: the storage home should center capacity state, dock movements and condition exceptions.
- **Samsara:** combines active routes, stop progress, vehicle state and dispatch exceptions. Applied lesson: the transport home should be a live dispatch board rather than an inventory table.
- **SafetyCulture:** structures field work around scheduled inspections, repeatable checklists, captured evidence and report handoff. Applied lesson: the assessor home should behave like a field workbench with large sequential actions.
- **Stripe Radar:** separates review queues, case-level signals and aggregate risk health. Applied lesson: the admin home should be a dense oversight console with traceable review work, not a participant dashboard.

## KisanMitra design direction

KisanMitra should feel like an agricultural operations workspace: calm, grounded, precise and trustworthy. It should not resemble a generic AI assistant, chat product or template dashboard.

- Use a persistent desktop rail and a compact mobile navigation bar.
- Keep one clear page title, one primary action and a small number of decision-ready metrics.
- Make the action queue more prominent than charts.
- Use compact list/table rows as the default way to scan produce, requirements, bookings, assessments, shipments and cases.
- Use status chips as meaningful operational labels, not decoration.
- Use deep forest green for primary actions, warm neutral surfaces for agricultural tone and amber only for time-sensitive attention.
- Reserve charts for trends and comparisons that support a decision.
- Reuse navigation, controls, statuses and design tokens, but give every actor a distinct information hierarchy based on their operating job.

## Role-specific operating models

- **Farmer:** crop-first cards, one urgent decision, expected net-return comparison and a short trade journey. Optimized for mobile comprehension and action.
- **FPO:** campaign funnel, farmer aggregation queue and frozen buyer-term economics. Optimized for coordinating many suppliers against one commitment.
- **Buyer:** requirement fulfilment reconciliation, selectable multi-produce sourcing plan, landed-cost summary and receiving action.
- **Storage manager:** capacity composition by facility, timed check-ins/check-outs, room-condition exceptions and quote requests.
- **Transport manager:** active route with stop milestones, driver/vehicle context, fleet availability and unassigned quote opportunities.
- **Quality assessor:** field schedule, current assessment checklist, evidence step and report deadlines.
- **Admin:** compact verification and case queues, platform health, outcome measures and audit activity.

## Source references

- [AgriWebb livestock management platform](https://www.agriwebb.com/us/)
- [Cropin agriculture platform](https://www.cropin.com/)
- [Attio workspace navigation](https://attio.com/help/reference/productivity-collaborating/navigating-your-workspace)
- [Attio records](https://attio.com/help/reference/attio-101/attios-data-model/understanding-records)
- [HubSpot record customization](https://knowledge.hubspot.com/object-settings/customize-records)
- [Linear custom views](https://linear.app/docs/custom-views)
- [Linear dashboards](https://linear.app/docs/dashboards)
- [Stripe web dashboard](https://docs.stripe.com/dashboard/basics)
- [Coupa Supplier Portal workbench](https://docs.coupa.com/en/supplier-documentation/coupa-for-suppliers/the-coupa-supplier-portal-or-csp/features-and-processes-in-the-coupa-supplier-portal/understand-the-csp-workbench)
- [Odoo Inventory features](https://www.odoo.com/app/inventory-features)
- [Odoo warehouse dashboards](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/warehouses_storage/reporting/dashboards.html)
- [Samsara routing and dispatch](https://www.samsara.com/uk/products/telematics/routing)
- [SafetyCulture operations platform](https://safetyculture.com/platform/)
- [Stripe Radar risk workspace](https://docs.stripe.com/radar)

## Agricultural agreement research

The Buyer requirement and FPO procurement campaign are presented as plain-language commercial proposals rather than price-only posts. The proposal becomes a frozen trade only when a seller accepts it; a counterproposal creates a new visible revision rather than overwriting the earlier terms.

Applied agreement content:

- Verified party identity, purpose, crop/variety, eligible production region, quantity and tolerance.
- Objective quality specifications and the independent assessment/weighing process.
- Fixed or clearly explained price basis, deductions, payment timing and payment method.
- Delivery or collection date, location and window.
- Transport arranger, payer and risk bearer shown separately from ownership transfer.
- Partial acceptance, rejected-produce ownership, return deadline and fault exceptions.
- Events outside either party's reasonable control, cooperative renegotiation, remedies, dispute steps and proposal expiry.
- A version history with explicit **Accept**, **Decline**, and **Send counterproposal** actions for the farmer.

The UI keeps language short and understandable, and treats the generated proposal as a commercial term sheet that should be reviewed for the applicable transaction and jurisdiction.

Research references:

- [FAO contract-farming agreement essentials](https://www.fao.org/in-action/contract-farming/about/frequently-asked-questions/en)
- [FAO contract-analysis checklist](https://www.fao.org/in-action/contract-farming/toolkit/contract-analysis/en/)
- [FAO learning module on contract content](https://www.fao.org/in-action/contract-farming/learning-centre/contract-farming-course/e-learning-detail/module3-understanding-the-content-of-a-contract/en)
- [UNIDROIT/FAO/IFAD Legal Guide overview](https://www.unidroit.org/instruments/contract-farming/overview/)
- [e-NAM trader guidance on assaying and electronic payments](https://enam.gov.in/stakeholders-Involved/traders)
