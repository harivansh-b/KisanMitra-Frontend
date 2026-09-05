# Mock-Data Contracts

All displayed product data must come from JSON fixtures in `mockdata/`. These contracts define UI-facing shapes, not APIs or backend models.

## Conventions

- Use stable string IDs such as `lot_001` and ISO 8601 timestamps.
- Store money as `{ "amount": 28500, "currency": "INR" }`.
- Store quantities as `{ "value": 4280, "unit": "kg" }`.
- Include human-readable labels alongside status codes when the UI needs localization.
- Reference related entities by ID; avoid duplicating entire records.
- Add fixtures for normal, empty, urgent, overdue, completed, cancelled, and disputed states.
- Keep sensitive-looking information fictional and clearly synthetic.

## Suggested Fixture Files

```text
mockdata/
  users.json
  actors.json
  produce.json
  produce.json
  assessments.json
  demands.json
  supply-matches.json
  expressions-of-interest.json
  procurement-plans.json
  auctions.json
  bids.json
  conditional-commitments.json
  fpo-procurement-campaigns.json
  fpo-supply-commitments.json
  fpo-purchases.json
  ownership-transfers.json
  fpo-service-offerings.json
  offers.json
  trades.json
  provider-organizations.json
  storage-facilities.json
  storage-bookings.json
  vehicles.json
  shipments.json
  receiving-inspections.json
  payment-obligations.json
  incidents.json
  grievances.json
  disputes.json
  verification-applications.json
  moderation-actions.json
  admin-resolutions.json
  reliability-events.json
  reliability-profiles.json
  risk-alerts.json
  audit-events.json
  admin-analytics.json
  notifications.json
  market-insights.json
```

## Shared Entity Fields

### User and Active Actor Context

User: `id`, `displayName`, `actorProfileIds`, `activeActorId`, `language`.

Initial fixtures use `language: "en"` only; no language-switcher state is required.

The UI renders one active actor context at a time. A role switcher appears only when `actorProfileIds` contains more than one entry.

### Actor

`id`, `role`, `buyerType`, `displayName`, `location`, `verificationStatus`, `effectivePermissions`, `activeRestrictions`, `reliabilityProfileId`, `contactSummary`, `avatar`, `profileDetails`.

For buyers, `profileDetails` may contain procurement regions, common crops, typical quantities, delivery locations, and fictional verification summaries such as business, tax, identity, and address checks.

### Produce Record

`id`, `farmerId`, `stage`, `crop`, `variety`, `location`, `estimatedQuantity`, `actualQuantity`, `harvestWindow`, `moneyNeededBy`, `perishability`, `photos`.

Use the shared produce stages: `PRE_HARVEST`, `HARVESTED`, `QUANTITY_RECORDED`, `QUALITY_ASSESSMENT_PENDING`, `QUALITY_ASSESSED`, `STORAGE_OR_PICKUP_PENDING`, `IN_TRANSPORT`, `DELIVERED`, and `TRANSACTION_COMPLETE`. Marketplace states such as offers being open are stored and displayed separately. The storage step may be skipped when a trade does not require storage.

### Produce

`id`, `ownerId`, `ownerType`, `produceIds`, `parentProduceIds`, `crop`, `variety`, `quantity`, `location`, `qualityDeclaration`, `assessmentId`, `verificationStatus`, `marketStatus`, `availableFrom`, `photos`.

### Assessment

`id`, `produceId`, `assessorId`, `requesterId`, `payerId`, `status`, `assessmentType`, `assessmentTime`, `assessmentLocation`, `crop`, `assessedQuantity`, `validFrom`, `validUntil`, `validityStatus`, `grade`, `specifications`, `observations`, `evidence`, `previousAssessmentId`, `reportIssuedAt`.

### Demand

`id`, `buyerId`, `demandType`, `visibility`, `invitedSellerIds`, `crop`, `variety`, `specifications`, `grade`, `requiredQuantity`, `quantityTolerance`, `requiredBy`, `deliveryLocation`, `targetPrice`, `paymentTerms`, `transportPreference`, `storagePreference`, `recurrence`, `status`, `matchedQuantity`, `committedQuantity`, `receivedQuantity`, `expiresAt`.

The initial UI uses `demandType: one_time` and `visibility: public`. Recurring and invited values remain reserved for future fixtures.

### Supply Match

`id`, `demandId`, `produceId`, `produceId`, `sellerId`, `matchPercent`, `matchedQuantity`, `criteria`, `verificationStatus`, `farmerOptedIn`, `allowedActions`, `landedCostEstimate`, `sellerReliability`, `availability`, `transportFeasibility`.

For opted-in unverified produce, `allowedActions` contains only `express_interest` and `request_assessment`.

### Expression of Interest

`id`, `buyerId`, `farmerId`, `produceId`, `demandId`, `status`, `nonBinding`, `quantityInterest`, `message`, `assessmentRequested`, `expiresAt`.

### Procurement Plan

`id`, `demandId`, `buyerId`, `status`, `selections`, `selectedQuantity`, `committedQuantity`, `receivedQuantity`, `remainingQuantity`, `estimatedLandedCost`.

Each selection references `produceId`, `sellerId`, selected quantity, current offer/trade ID, and landed-cost contribution.

### Auction and Bid

Auction: `id`, `produceId`, `sellerId`, `status`, `startsAt`, `endsAt`, `minimumTerms`, `bidIds`, `acceptedBidId`.

Bid: `id`, `auctionId`, `buyerId`, `status`, `price`, `quantity`, `paymentTerms`, `qualityRequirements`, `quantityTolerance`, `responsibilities`, `pickupWindow`, `deliveryLocation`, `estimatedSellerNet`, `advisoryRank`, `comparisonLabels`, `landedCostEstimate`, `expiresAt`, `revision`.

No bid status means “winner.” `advisoryRank` is based on estimated seller net; seller selection uses `accepted`.

### FPO Conditional Commitment

`id`, `demandId`, `buyerId`, `fpoId`, `status`, `interestedAt`, `frozenConditionalTerms`, `requiredReservedQuantity`, `currentlyReservedQuantity`, `conditionDeadline`, `confirmedTradeId`, `expiredAt`.

`status` uses `interested`, `conditional_commitment`, `confirmed_trade`, or `expired`.

### FPO Procurement Campaign

`id`, `fpoId`, `demandId`, `conditionalCommitmentId`, `status`, `crop`, `variety`, `targetQuantity`, `committedQuantity`, `collectedQuantity`, `verifiedQuantity`, `minimumQuality`, `purchasePrice`, `collectionLocation`, `collectionWindow`, `paymentTerms`, `inboundTransportTerms`, `quantityTolerance`, `downgradeRules`, `rejectionRules`, `expiresAt`, `economics`.

### FPO Supply Commitment

`id`, `campaignId`, `farmerId`, `sourceProduceId`, `status`, `reservedQuantity`, `collectedQuantity`, `verifiedBreakdown`, `acceptedPurchaseQuantity`, `remainingFarmerQuantity`, `expiresAt`.

### FPO Purchase

`id`, `campaignId`, `commitmentId`, `fpoId`, `farmerId`, `sourceProduceId`, `resultingProduceIds`, `verifiedQuantity`, `purchasedQuantity`, `rejectedQuantity`, `gradeBreakdown`, `price`, `grossAmount`, `deductions`, `netPayable`, `paymentId`, `ownershipTransferId`, `purchasedAt`.

### Ownership Transfer

`id`, `fromActorId`, `toActorId`, `sourceProduceId`, `resultingProduceId`, `quantity`, `reason`, `relatedType`, `relatedId`, `transferredAt`.

### FPO Service Offering

`id`, `fpoId`, `serviceType`, `title`, `description`, `pricing`, `serviceArea`, `availability`, `requirements`, `packageId`, `status`.

The initial fixtures use individual services and leave `packageId` empty.

### Provider Organization and Assets

Provider organization: `id`, `providerType`, `displayName`, `ownerUserIds`, `verificationStatus`, `operatingRegions`, `contactSummary`, `reliabilityProfileId`, `assetIds`.

Transport vehicle: `id`, `providerOrganizationId`, `registrationLabel`, `vehicleType`, `capacity`, `supportedHandling`, `availabilityStatus`.

Storage facility: `id`, `providerOrganizationId`, `location`, `storageTypes`, `capacity`, `supportedCrops`, `coldStorageCapability`, `certificationLabels`, `availabilityStatus`.

### Offer

`id`, `demandId`, `procurementPlanId`, `produceId`, `sellerId`, `buyerId`, `status`, `price`, `quantity`, `pickupWindow`, `deliveryLocation`, `paymentTerms`, `qualityRequirements`, `quantityTolerance`, `partialAcceptanceRules`, `responsibilities`, `estimatedCosts`, `expectedNetRealization`, `landedCostEstimate`, `expiresAt`, `revision`.

FPO procurement terms belong to the procurement-campaign entity rather than being represented as an aggregation offer.

### Trade

`id`, `demandId`, `procurementPlanId`, `conditionalCommitmentId`, `acceptedOfferId`, `acceptedBidId`, `sellerId`, `buyerId`, `produceId`, `status`, `frozenTerms`, `ownershipTransferEvent`, `transportRiskBearerId`, `responsibilities`, `rejectedGoodsPolicy`, `taskSummary`, `delivery`, `receivingInspectionId`, `paymentObligationId`, `amendments`, `disputeStatus`.

The direct-sale default is `ownershipTransferEvent: buyer_acceptance`. `rejectedGoodsPolicy` includes owner, return arranger/payer, storage payer, collection deadline, fallback action, and fault exceptions.

### Service Booking

`id`, `serviceType`, `providerOrganizationId`, `arrangerId`, `payerId`, `status`, `items`, `quote`, `schedule`, `requirements`, `evidence`, `incidentIds`.

Each storage `item` references `produceId`, `tradeId`, quantity, check-in/out context, location/bin, and item status.

### Shipment

`id`, `providerOrganizationId`, `vehicleId`, `arrangerId`, `payerId`, `transportRiskBearerId`, `status`, `items`, `pickups`, `destination`, `quote`, `schedule`, `trackingSummary`, `pickupEvidence`, `deliveryEvidence`, `incidentIds`.

Each shipment `item` references `tradeId`, `produceId`, quantity, pickup ID, and item status. One shipment may contain several items while their trades remain separate.

### Payment Obligation

`id`, `saleType`, `relatedType`, `relatedId`, `payerId`, `payeeId`, `status`, `grossValue`, `deductions`, `netPayable`, `buyerClaimedPaidAmount`, `sellerConfirmedAmount`, `pendingAmount`, `dueAt`, `paymentMarks`, `receiptConfirmations`, `disputeId`.

States: `pending`, `buyer_marked_paid`, `seller_confirmed`, `completed`, `partially_paid`, `overdue`, and `disputed`.

### Receiving Inspection

`id`, `tradeId`, `buyerId`, `status`, `expectedQuantity`, `deliveredQuantity`, `acceptedQuantity`, `rejectedQuantity`, `gradeBreakdown`, `condition`, `specificationResults`, `withinTolerance`, `reasons`, `evidence`, `lightweightCheck`, `reassessmentId`, `rejectedGoodsPolicy`, `inspectedAt`, `finalizedAt`.

### Incident

`id`, `reportedBy`, `relatedType`, `relatedId`, `category`, `status`, `summary`, `impact`, `evidence`, `occurredAt`, `grievanceIds`.

### Grievance

`id`, `raisedBy`, `againstActorIds`, `incidentIds`, `relatedType`, `relatedId`, `category`, `severity`, `status`, `summary`, `requestedAction`, `evidence`, `timeline`, `triage`, `disputeId`.

### Dispute

`id`, `grievanceId`, `status`, `category`, `severity`, `assignedAdminId`, `involvedActorIds`, `autoCollectedEvidenceRefs`, `additionalEvidenceRequests`, `responseDueAt`, `timeline`, `resolutionId`.

### Verification Application

`id`, `actorId`, `actorType`, `status`, `submittedAt`, `region`, `documents`, `roleSpecificEvidence`, `missingItems`, `riskFlagIds`, `reviewerId`, `reviewNotes`, `informationRequests`, `decision`, `decidedAt`.

Role-specific evidence may cover buyer business/tax/address details; FPO registration, member base, centres and modes; transport vehicles/licences; storage facilities/certifications; or assessor qualifications, authorized crops, and regions.

### Moderation Action

`id`, `actorId`, `actionType`, `status`, `restrictedCapabilities`, `reason`, `adminId`, `startsAt`, `endsAt`, `restoredAt`, `relatedRiskAlertIds`, `relatedDisputeIds`, `auditEventIds`.

### Admin Resolution

`id`, `disputeId`, `decisionType`, `reason`, `evidenceRefs`, `adjustments`, `correctiveActions`, `confirmedReliabilityEventIds`, `moderationActionIds`, `adminId`, `decidedAt`.

`adjustments` describe explicit linked corrections such as payment or quantity adjustment; they never replace the source trade, assessment, service, or payment record.

### Reliability Event

`id`, `actorId`, `eventType`, `severity`, `status`, `relatedTradeId`, `relatedDisputeId`, `resolutionId`, `facts`, `confirmedAt`.

Examples include confirmed payment default, transport damage, quality misrepresentation, and unjustified rejection. Admin confirms the event, not a numeric score.

### Reliability Profile

`id`, `actorId`, `actorType`, `score`, `metrics`, `period`, `transactionCount`, `lastCalculatedAt`, `trend`, `investigationStatus`.

Metrics vary by role: payment and rejection behavior for buyers; quantity/quality/readiness for farmers; procurement, fulfilment, and farmer payment for FPOs; punctuality/damage/cancellation for transport; damage/spoilage/capacity for storage; and turnaround/reassessment disagreement for assessors.

### Risk Alert

`id`, `ruleCode`, `category`, `severity`, `status`, `actorIds`, `relatedType`, `relatedId`, `observedValue`, `threshold`, `explanation`, `evidenceRefs`, `createdAt`, `assignedAdminId`, `resolution`.

### Audit Event

`id`, `adminId`, `actionType`, `targetType`, `targetId`, `reason`, `previousState`, `newState`, `relatedDisputeId`, `relatedRiskAlertId`, `createdAt`.

### Admin Analytics

`asOf`, `filters`, `marketplace`, `market`, `farmerOutcomes`, `fpo`, `buyer`, `transport`, `storage`, `quality`, `payments`, `disputes`, `serviceAvailability`, `imbalanceAlerts`, `priceAnomalies`.

### Notification

`id`, `actorId`, `priority`, `type`, `title`, `message`, `relatedType`, `relatedId`, `createdAt`, `readAt`, `actionLabel`.

## Actor Dashboard Fixtures

Actor dashboard pages may use derived summary JSON files when this keeps components simple. A dashboard fixture should contain only IDs, counts, totals, alerts, and preview rows already represented by the shared entities; it should not introduce conflicting lifecycle states.
