# Backend adapter contract

KisanMitra currently runs entirely against deterministic mock data. UI code consumes typed query and command ports; it must never depend on transport details or import JSON fixtures directly.

## Integration boundary

Future adapters implement `QueryPort` and `CommandPort` from `domain/contracts.ts`. Queries receive typed parameters and the active `ActorContext`; commands return explicit success, validation, forbidden, or conflict results. Network errors are translated into the shared application error model before reaching components.

Authentication will replace the mock `ActorContext` provider. The server remains responsible for authorizing every query and command. Visible or disabled controls are presentation only and never establish permission.

Canonical records use stable status codes, ISO 8601 timestamps, `{ value, unit }` quantities, and `{ amountMinor, currency }` money. Formatting remains in `lib/formatters.ts` and is not accepted at the adapter boundary.

## Adapter replacement

1. Implement the relevant feature ports without changing their public signatures.
2. Validate boundary payloads with the feature Zod schemas.
3. Map backend errors to the shared result unions.
4. Register the adapter in `ApplicationProvider`.
5. Run the same contract tests used by the mock adapter.

No component should call `fetch`, reference an API URL, or know whether its data comes from JSON, HTTP, or server rendering.
