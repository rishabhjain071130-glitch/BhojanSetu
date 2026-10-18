# 04 — Data Model and API Contract

Implement only the fields needed for the end-to-end MVP. Use Mongoose schemas and Zod/request validation.

## User
- `name`: required, trimmed
- `email`: required, normalized, unique
- `passwordHash`: required; never store raw password
- `role`: `organizer | partner | admin`
- `organizationName`: optional/required by role where appropriate
- `phone`: optional; private
- `verificationStatus`: `not_submitted | pending | verified | rejected`
- `verificationNote`: admin-visible, avoid storing unnecessary sensitive data
- timestamps

Do not allow a public registration request to self-select the admin role.

## FoodListing
- `ownerId`
- `eventName`
- `eventType`: `wedding | banquet | catering | college | community | other`
- `foodTitle`
- `foodCategory`
- `description`
- `quantity`
- `unit`: `kg | servings | meal_boxes | trays | other`
- `preparedAt`
- `storageConditions`
- `allergenNotes` (optional)
- `collectionDeadline`
- `areaOrAddress` (avoid public exposure of precise address until authorized)
- `pickupInstructions` (private to approved partner/coordinator)
- `status`: `open | requested | assigned | collected | delivered | cancelled | expired`
- `createdAt`, `updatedAt`

Use timezone-aware date handling. Reject a preparation time in the future unless the product requirements explicitly allow scheduled preparation. Reject a deadline in the past. Do not assume the software can determine food safety from these fields.

## RecoveryRequest / Assignment
- `listingId`
- `partnerId`
- `requestedQuantity`
- `collectionNote`
- `status`: `pending | approved | rejected | cancelled | collected | delivered`
- `approvedBy`
- `approvedAt`
- `collectedAt`
- `deliveredAt`
- `statusHistory`: actor, previous status, new status, timestamp, optional reason
- timestamps

Prevent oversubscription: total approved/assigned quantities must not exceed the listing quantity. If multiple partners can split a listing, implement allocation carefully; otherwise make one approved request reserve the listing and explain that MVP limitation.

## Audit event (optional if statusHistory is sufficient)
Record important status changes and admin decisions without logging passwords or secrets.

## Suggested endpoints
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Listings
- `GET /api/listings` with filters and pagination
- `POST /api/listings` organizer only
- `GET /api/listings/:id`
- `PATCH /api/listings/:id` owner/admin with allowed-state checks
- `POST /api/listings/:id/cancel` owner/admin

### Partner
- `GET /api/partners/me`
- `PATCH /api/partners/me`
- `POST /api/partners/me/verification` to submit verification details
- `GET /api/admin/partners?status=pending` admin only
- `PATCH /api/admin/partners/:id/verification` admin only

### Requests / workflow
- `POST /api/listings/:id/requests` verified partner only
- `GET /api/requests/mine`
- `GET /api/listings/:id/requests` owner/admin only
- `PATCH /api/requests/:id/decision` owner/admin according to policy
- `PATCH /api/requests/:id/status` authorized partner/coordinator only

### Impact
- `GET /api/impact/summary`
- `GET /api/impact/timeseries` only if the stored data supports it

## API behavior
- Validate IDs and return 400 for malformed IDs.
- Return 404 for missing records.
- Return 401 for unauthenticated requests, 403 for forbidden roles/ownership.
- Return 409 for conflicts such as expired listings, duplicate requests, or capacity conflicts.
- Return 422 or 400 for validation errors consistently.
- Never trust client-supplied owner IDs, partner verification, status, or approval actor.
- Add pagination and maximum page size to list endpoints.
- Use indexes for common filters if reasonable.
