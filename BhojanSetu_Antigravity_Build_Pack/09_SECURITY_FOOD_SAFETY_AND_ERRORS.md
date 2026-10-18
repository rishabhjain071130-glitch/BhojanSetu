# 09 — Security, Food Safety, Privacy, and Error Handling

## Security baseline
- Validate and sanitize request input.
- Use password hashing; never store plain passwords.
- Do not expose environment variables or secrets to frontend code.
- Configure CORS deliberately.
- Add Helmet or equivalent security headers if compatible.
- Use request size limits and basic auth rate limiting where practical.
- Check authorization and ownership on every protected mutation.
- Prevent mass assignment: only allow approved fields to be updated.
- Validate ObjectIds and query parameters.
- Avoid detailed production stack traces.
- Do not log passwords, tokens, private addresses, or unnecessary personal data.
- Ensure `.env`, build artifacts, and local database dumps are ignored by Git.
- Never place real credentials in README, screenshots, or commits.

## Food safety
BhojanSetu coordinates recovery; it does not certify food safety.
- Capture preparation time and storage/handling conditions.
- Require a collection deadline.
- Show human inspection and responsible handling reminders.
- Partner verification is an account/process status, not proof that each food item is safe.
- Do not automatically assign expired listings.
- Provide a report/flag option if it can be implemented safely.
- Keep safety disclaimer visible on listing detail and in the workflow.

Suggested disclaimer:
“BhojanSetu supports coordination only. Food suitability must be assessed by responsible people before collection and distribution. Follow applicable food-safety requirements, proper storage and handling, and physical inspection. A platform status does not certify food as safe.”

## Privacy
- Do not reveal exact event address or private contact details publicly.
- Reveal pickup instructions only to the approved partner and authorized coordinator.
- Avoid collecting government ID documents unless essential and safely supported. For this MVP, use a verification status and minimal organization information.
- Explain when demo data is used.

## Error states
- Network/API unavailable
- Invalid form data
- Session expired
- Unauthorized role
- Listing expired
- Capacity conflict
- Duplicate request
- Request already processed
- Database configuration missing
- Empty list/no search results

Show understandable messages and a retry action where appropriate. Do not silently fall back to fake success.
