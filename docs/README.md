# KisanMitra UI/UX Documentation

These documents define the frontend experience for KisanMitra's role-based dashboards. They describe screens, states, information hierarchy, and cross-role handoffs; they do not define backend services or implementation architecture.

## Product Documents

- [UI foundation](ui-foundation.md): shared product model, navigation, responsive behavior, and design principles.
- [UI decisions](ui-decisions.md): resolved cross-actor rules and deferred UI scope.
- [Design system](design-system.md): global token architecture, reusable variants, and styling acceptance rules.
- [UI research](ui-research.md): agriculture-product and SaaS/CRM patterns applied to the interface.
- [Shared workflows](shared-workflows.md): lifecycle states and handoffs between actors.
- [Mock-data contracts](mock-data-contracts.md): JSON fixture boundaries and shared entity shapes.

## Actor Specifications

- [Farmer](actors/farmer.md)
- [FPO](actors/fpo.md)
- [Buyer](actors/buyer.md)
- [Storage Manager](actors/storage-manager.md)
- [Transport Manager](actors/transport-manager.md)
- [Quality Assessor / Grader](actors/quality-assessor.md)
- [Admin](actors/admin.md)

`PS.md` remains the source problem statement. `farmer.md`, `FPO.md`, `buyer.md`, and `admin.md` remain the detailed source requirements for those actors; the actor specifications in this directory convert them into concise UI blueprints.
