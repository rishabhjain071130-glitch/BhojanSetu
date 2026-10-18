# 01 — Product Scope and Acceptance Criteria

## Product identity
- Name: **BhojanSetu**
- Tagline: **Good food deserves a destination, not a dustbin.**
- Short description: Event-based surplus-food recovery and redistribution platform.
- Primary setting: weddings, banquets, caterers, college functions, and other organized events.
- Core promise: make eligible surplus food easier to discover, coordinate, collect, and track.

## Problem
Organizers and caterers may have suitable surplus food after events, while recovery organizations and community kitchens may need advance notice and reliable collection coordination. Manual calls and scattered messages can make deadlines, quantity, capacity, and hand-offs difficult to track.

Do not claim food redistribution itself is new. BhojanSetu's proposed differentiation is its event-focused workflow, urgency-aware partner ranking, capacity-aware request flow, and traceable status history.

## Users
1. Organizer/Caterer
2. Recovery Partner (organization/community kitchen)
3. Admin/Coordinator

## MVP pages
- Public landing page
- Sign in / sign up (or clearly documented demo login if time-constrained)
- Role-aware dashboard
- Create/edit food listing
- Browse eligible surplus listings
- Listing detail page
- Partner profile / verification status
- Requests and assignments
- Pickup/delivery status history
- Impact dashboard
- Admin partner-review screen
- Help / food-safety guidance
- Not-found and error states

## Must-have functionality
- Create, validate, and persist food listings.
- Store event name/type, approximate location, food description/category, quantity and unit, preparation date/time, storage/handling notes, collection deadline, contact/collection notes, listing owner, and status.
- Reject impossible/invalid values and prevent requests for expired/cancelled/fully allocated listings.
- Partners must have an explicit verification status. Unverified partners must not receive confirmed assignments.
- Partner request must include requested quantity and a short collection note.
- Capacity must be checked before approval.
- Status changes must follow allowed transitions and be recorded in history.
- Dashboard figures must be computed from actual database/demo records, not hardcoded success statistics.
- Search/filter by category, status, deadline, and approximate area where feasible.
- Empty, loading, success, and error states on key screens.
- Responsive desktop and mobile layout.

## Out of scope for the 3-day MVP unless the core journey is already stable
- Native mobile app
- Real-time GPS tracking
- Payment processing
- Automated food-safety certification
- Machine-learning predictions
- Complex route optimization
- SMS/WhatsApp provider integration
- Multi-tenant enterprise billing
- Public claims of verified partner network without real verification

## Acceptance criteria
The MVP is acceptable only when:
- A fresh install can be configured using documented steps.
- The frontend starts without console-breaking errors.
- The backend starts and responds to a health endpoint.
- API validation and error responses are consistent.
- Organizer can create a listing.
- A verified partner can discover and request an eligible listing.
- An authorized actor can approve/assign it and record collection/delivery.
- Expired or ineligible listings cannot be requested.
- Dashboard values reflect stored records.
- Role checks exist on the server, not only in the UI.
- A production build succeeds.
- README explains configuration, demo setup, known limitations, and deployment.

## Honest demo rule
Use seed data only if labeled **Demo data**. Do not portray demo organizations as real partners. If a feature is not implemented, state that clearly.
