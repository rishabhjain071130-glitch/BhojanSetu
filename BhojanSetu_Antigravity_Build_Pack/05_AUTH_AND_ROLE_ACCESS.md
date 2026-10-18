# 05 — Authentication, Roles, and Authorization

Implement a small, secure-enough hackathon authentication flow. Prefer an established password-hashing library and validated inputs.

## Requirements
- Register organizer and partner accounts. Do not allow admin registration through the public form.
- Login/logout and `me` session check.
- Hash passwords using bcrypt/bcryptjs or another maintained standard library already supported by the project.
- Use a strong JWT secret from environment variables if JWT is chosen.
- Prefer httpOnly, Secure-in-production, SameSite cookies for session tokens when practical. If using Authorization headers instead, document storage and XSS trade-offs and do not claim it is fully secure.
- Avoid logging credentials, tokens, or sensitive personal information.
- Rate-limit login/register endpoints if practical.
- Validate email/password and return friendly generic login errors.
- Protect all sensitive API routes with authentication middleware.
- Enforce role checks and record ownership on the server.
- Client route guards are for UX only; they do not replace server authorization.

## Role matrix
| Action | Organizer | Verified Partner | Unverified Partner | Admin |
|---|---|---|---|---|
| Create listing | Own account | No | No | Optional |
| Edit own listing | Yes, allowed states only | No | No | Yes |
| Browse eligible listings | Own/relevant views | Yes | Limited or browse-only | Yes |
| Request food | No | Yes | No | Optional for support |
| Approve request | Owner/coordinator policy | No | No | Yes |
| Update collection/delivery | Limited by assignment policy | Assigned request only | No | Yes |
| Verify partner | No | No | No | Yes |
| View aggregate impact | Yes, scoped or aggregate | Yes, scoped or aggregate | Limited | Yes |

Choose one consistent request approval policy. For a simple MVP, organizer or admin approves a partner request; then the request becomes an assignment.

## Demo access
If demo accounts are provided:
- Make them clearly labelled for demonstration.
- Never use a real person's password.
- Never publish a privileged admin password in a production environment.
- Prefer a local-only seed script that prints generated demo credentials to the terminal.
- Do not automatically seed demo accounts on a public production deployment unless explicitly controlled.

## Verification workflow
- Partner starts as `pending` or `not_submitted`.
- Admin can approve/reject with a reason.
- Only `verified` partners may submit a request or receive an approved assignment.
- UI must display verification state accurately.
- Do not imply that an external government agency or FSSAI verified a partner unless that process actually occurred.
