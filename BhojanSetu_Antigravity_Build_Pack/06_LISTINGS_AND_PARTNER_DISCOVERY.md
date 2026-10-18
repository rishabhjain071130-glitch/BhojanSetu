# 06 — Food Listings and Partner Discovery

## Listing creation form
Required:
- Event name and event type
- Food title/category and description
- Quantity and unit
- Preparation date/time
- Storage/handling information
- Collection deadline
- Approximate area
- Collection instructions, private until a request is approved

Optional:
- Allergen notes
- Photo if upload configuration is already working

## Validation rules
- Quantity must be a finite positive number.
- Collection deadline must be in the future at creation time.
- Preparation timestamp must be valid.
- Do not mark food as safe based on form data alone.
- Require a storage/handling note and display a food-safety reminder.
- Prevent editing a listing in a way that invalidates an approved assignment without cancellation/review.
- If the deadline passes, it should no longer be requestable. A scheduled background job is not necessary; eligibility can be calculated when listing queries and request endpoints run.

## Listing states
- `open`: eligible to receive requests if all checks pass.
- `requested`: at least one pending request exists, but the listing may remain available only if partial allocations are supported. If not supporting partial allocations, keep it effectively unavailable for duplicate requests.
- `assigned`: an approved partner has been assigned.
- `collected`: collection recorded.
- `delivered`: delivery recorded.
- `cancelled`: cancelled by authorized actor.
- `expired`: deadline passed; can be computed lazily or persisted by a maintenance action.

## Browse and filters
- Default to listings that are open, non-expired, and otherwise eligible.
- Filter by category, event type, approximate area, and deadline.
- Sort by soonest deadline or most urgent.
- Never expose exact pickup details or private contact information to unapproved users.
- Show a clear “expired”, “unavailable”, or “request pending” reason.

## Listing details
Show:
- Food/event summary
- Quantity and unit
- Prepared time
- Storage/handling notes
- Collection deadline with readable urgency
- Approximate area
- Eligibility state
- Food safety disclaimer
- Request action only for verified partners and eligible listings

## User feedback
- Show success after a listing is created.
- Preserve form data if a save fails where practical.
- Avoid silent failures.
- Disable submit while saving.
- Handle no results with useful next steps.
