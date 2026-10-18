# 07 — Rule-Based Matching, Requests, and Status Flow

## Do not call this AI/ML
The matching engine is deterministic, explainable business logic. Label it **Rule-Based Rescue Matching** or **Smart Rescue Engine (rule-based)**. Do not imply machine learning.

## Eligibility gates
Exclude a candidate if any condition applies:
1. Partner is not verified.
2. Listing is cancelled, expired, delivered, or otherwise unavailable.
3. Requested/allocated quantity exceeds available listing quantity.
4. Partner capacity is absent, invalid, or too low.
5. Collection deadline has passed.
6. Other explicitly configured eligibility rule fails.

## Ranking
Among eligible partners, use a simple transparent score. Possible components:
- Urgency/deadline fit
- Partner capacity fit
- Distance only if trustworthy coordinates or a reliable distance estimate are available
- Matching category or service area if stored

Do not invent precise distances. If only a text area is known, use area match as a categorical signal, not a numeric kilometre value. Document weights and show a short “Why recommended” explanation such as “Verified partner”, “Capacity fits”, “Deadline is soon”, “Service area match”.

A score is a recommendation, not an automatic food-safety decision. Human approval remains required.

## Request workflow
1. Verified partner opens an eligible listing.
2. Partner submits requested quantity and collection note.
3. API checks verification, deadline, quantity, duplicate request, and listing status.
4. Request becomes `pending`.
5. Organizer or admin reviews it.
6. Approval reserves/assigns the listing under the chosen MVP allocation model.
7. Assigned partner records `collected`.
8. Assigned partner or authorized coordinator records `delivered`.
9. Each change appends status history with actor and timestamp.
10. Dashboard updates from persisted records.

## State transitions
Implement explicit allowed transitions. Do not accept arbitrary status strings from the client.
- Pending request → approved or rejected
- Approved/assigned → collected
- Collected → delivered
- Pending request → cancelled by requester where permitted
- Assigned request → cancelled only with authorized review/reason
- Listing → cancelled only if it has no active assignment or the assignment is explicitly resolved

Return 409 when a transition is not allowed.

## Concurrency
Prevent two partners from both being approved for the same remaining quantity. Use an atomic update/transaction if supported, or re-check availability immediately before approval and handle conflicts. Do not promise split allocations unless implemented and tested.

## UI
- Display status history in chronological order.
- Confirm approval/rejection and require a reason for rejection if practical.
- Display assigned partner details only to authorized users.
- Make every action show a loading, success, or error state.
