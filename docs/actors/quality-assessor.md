# Quality Assessor / Grader UI Specification

## Dashboard Goal

Help assessors manage inspection assignments, verify quantity and quality consistently, attach evidence, issue traceable reports, and respond to reassessment or dispute requests.

## Primary Navigation

`Home`, `Requests`, `Schedule`, `Assessments`, with `Reassessments`, `Earnings`, and `Profile` under **More** on mobile.

## Home Dashboard

Show:

1. Today's inspections, overdue reports, and evidence requests.
2. New assignment requests and deadlines.
3. Assessments in progress or awaiting submission.
4. Reassessment/dispute responses requiring attention.
5. Completed work and payment summary.

Primary actions: **Accept request**, **Start inspection**, **Resume assessment**, or **Submit report**.

## Screens

### Request Queue and Schedule

- Lot, crop, declared quantity/quality, location, requester, required checks, urgency, and preferred window.
- Identify when an assessment supports an FPO collection/procurement decision and show the campaign, committed quantity, and agreed quality rules.
- Identify buyer-requested pre-trade assessments separately from post-delivery reassessments.
- Accept, propose another time, or decline with reason.
- Schedule supports list and calendar views; the list remains the primary mobile view.
- Show verified identity, qualifications/certifications, organization, authorized crops, and operating region in profile. An unverified assessor or one not authorized for the crop cannot submit an official report.
- Show who requested and pays for the assessment; the requester pays by default unless frozen terms specify otherwise.

### Assessment Workspace

- Verify lot identity before entering results.
- Structured checks for actual quantity, grade, crop-specific specifications, visible defects, moisture/ripeness where relevant, sampling notes, and evidence.
- Show farmer declaration as reference, never as a prefilled verified result.
- Save progress and clearly identify incomplete required checks.

### Report Review and Submission

- Preview verified quantity, grade, specifications, observations, evidence, assessor identity, assessment time/location, and crop-configured validity window.
- Consequential confirmation before submission.
- Submitted report is read-only; corrections use a visible revised report with reason and version history.

### Reassessment and Earnings

- Reassessment view includes disputed field, original report, evidence, requester reason, response due, and outcome.
- For a buyer receiving dispute, show frozen quality/tolerance terms, original assessment, delivery condition, accepted/rejected quantities, and buyer evidence.
- Earnings show assessment fee, approved adjustment, paid, and pending without unrelated trade values.
- Routine re-checks may use the same assessor. A dispute reassessment should visibly use a different assessor where one is available.

## Key UI Rules

- Only an authorized assessor report may display as verified quality.
- An FPO may coordinate an assessment but is not automatically the official quality authority.
- Separate quantity verification from quality grading when their evidence or authority differs.
- Never overwrite a submitted report invisibly.
- Clearly display conflicts between declared and verified values.
- Clearly label assessment state as `Valid`, `Expiring`, or `Expired`; expiry does not alter the historical report.

## Responsive Priorities

- Mobile: field inspection workflow, offline-looking saved state, large controls, camera/evidence placeholders, and step-by-step validation.
- Desktop: request triage, schedule management, report review, side-by-side evidence, and reassessment history.
