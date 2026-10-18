# BhojanSetu — Antigravity Master Build Instructions

You are the lead full-stack engineer implementing **BhojanSetu**, a hackathon MVP for event-based surplus-food recovery and redistribution in India.

## Mission
Build a polished, responsive, genuinely functional web application that helps event organizers/caterers list suitable surplus food and lets verified recovery partners discover, request, collect, and record delivery of eligible listings. Admins review partner verification and oversee activity.

This project is being built for a short hackathon deadline. Prioritize a coherent end-to-end MVP over unnecessary complexity.

## Mandatory working rules
1. **Inspect the existing workspace first.** Do not overwrite a working project blindly. Report existing files, stack, package manager, current run state, and gaps before editing.
2. Read all files in this pack in numerical order before implementation. Treat them as the project specification.
3. Implement in phases, commit-sized changes. After each phase: run the app, run relevant checks, fix errors, and summarize files changed and tests run.
4. Do not merely create mockup screens. Forms, validation, navigation, role access, listing creation, partner requests, approval/status transitions, dashboards, and filters must actually work.
5. Do not claim that features are implemented, deployed, AI-powered, or tested unless verified in the repository/runtime.
6. Do not claim machine learning. Matching is **transparent rule-based ranking**, not AI/ML.
7. Do not invent partners, real impact numbers, food-safety certifications, official affiliations, or pilot results. Clearly label seeded demo records as demo data.
8. Never hardcode secrets. Use `.env` and `.env.example`; ensure `.env` is ignored by Git. Validate required environment variables and show helpful setup messages.
9. Use accessible semantic HTML, visible labels, keyboard-friendly controls, loading/error/empty states, and responsive layouts.
10. Keep dependencies lean. Avoid adding packages unless they solve a clear need.
11. Do not stop after generating code. Install dependencies, run lint/build/tests that exist, fix failures, and verify the critical user journey.
12. If an external service is not configured, implement a safe local/demo fallback and explain its limitations. Do not fake successful cloud persistence.
13. Before changing architecture or scope, explain why and choose the simplest reliable option.
14. Keep the user informed with short, factual checkpoints. Ask a question only if a required decision cannot be reasonably inferred.

## Preferred stack
- Frontend: React + Vite + TypeScript if the workspace can support it cleanly; otherwise retain the existing language and explain.
- Styling: Tailwind CSS, or the project's already working styling system.
- Routing: React Router.
- Backend: Node.js + Express.
- Database: MongoDB Atlas with Mongoose.
- Validation: Zod (shared schemas where practical) and server-side validation.
- Charts: Recharts only if a useful impact chart is implemented.
- Optional image storage: Cloudinary; not required for MVP.
- Deployment target: Vercel frontend and Render-compatible Express API, or another actually supported host.

## Product roles
- Organizer/Caterer: create, view, edit, and cancel their own food listings; view requests and status.
- Recovery Partner: maintain organization profile, view eligible listings, submit requests, and update collection/delivery statuses only when authorized.
- Admin: review partner verification, approve/reject requests where required, oversee listings and statuses, and view aggregate platform metrics.

## Minimum end-to-end demo journey
1. Sign in using a documented demo setup or create an account.
2. Organizer creates a surplus-food listing with event details, quantity, preparation time, storage/handling details, and collection deadline.
3. Partner sees only eligible, non-expired listings and can request one if capacity permits.
4. System ranks candidate partners with understandable rule-based criteria (eligibility, verification, capacity, urgency/deadline, and distance only if reliable location data exists).
5. Authorized user/admin approves the request and records collection.
6. Partner confirms delivery/completion.
7. Dashboard updates based on stored listing/request records, clearly identifying estimated or reported metrics.

## Food safety boundaries
- The app is a coordination tool, not a food-safety certifier.
- Record preparation time, storage/handling conditions, allergen/food notes where useful, and collection deadline.
- Require partner verification and human review/inspection as appropriate.
- Never promise food is safe merely because a listing passed a software check.
- Show a visible reminder that physical inspection and applicable food-safety requirements remain essential.
- Expired listings must not be requestable or automatically assigned.

## Delivery sequence
Follow these files in order:
1. `01_PRODUCT_SCOPE_AND_ACCEPTANCE.md`
2. `02_BRAND_UI_AND_UX.md`
3. `03_ARCHITECTURE_AND_SETUP.md`
4. `04_DATA_MODEL_AND_API.md`
5. `05_AUTH_AND_ROLE_ACCESS.md`
6. `06_LISTINGS_AND_PARTNER_DISCOVERY.md`
7. `07_MATCHING_REQUESTS_AND_STATUS_FLOW.md`
8. `08_DASHBOARDS_AND_IMPACT_METRICS.md`
9. `09_SECURITY_FOOD_SAFETY_AND_ERRORS.md`
10. `10_TESTING_AND_DEMO_SCENARIO.md`
11. `11_DEPLOYMENT_GITHUB_AND_README.md`

Start by inspecting the workspace, then give a concise plan and implement File 01 first. Do not attempt all features in one giant unreviewed edit.
