# 11 — Deployment, GitHub, and README

## Before Git
- Inspect `git status`.
- Check `.gitignore` includes `.env`, `client/.env`, `server/.env`, `node_modules`, build output, logs, local database files, and editor artifacts.
- Confirm no secrets or personal information are staged.
- Do not rewrite existing history or force-push unless explicitly authorized.
- Use clear, incremental commits.

## Suggested commit sequence
1. `chore: initialize BhojanSetu app structure`
2. `feat: add responsive public landing page`
3. `feat: add authentication and role-based access`
4. `feat: add surplus food listing workflow`
5. `feat: add partner requests and status tracking`
6. `feat: add rule-based matching and impact dashboard`
7. `test: verify core recovery workflow`
8. `docs: add setup and deployment instructions`

Use only commits that match real completed work. Do not create misleading commit messages.

## README must include
- BhojanSetu description and tagline
- Problem statement and target users
- Feature list, distinguishing implemented vs planned
- Architecture/stack
- Folder structure
- Local prerequisites
- Setup commands for client and server
- Environment variable setup using `.env.example`
- MongoDB Atlas setup steps without exposing credentials
- Seed/demo instructions and fictional demo data disclaimer
- API health endpoint and main routes
- Test/build commands
- Deployment steps and required environment variables
- Food-safety and privacy limitations
- Screenshots only from the real application
- Known limitations and next steps

## Deployment
Deploy only after the production build succeeds locally.
- Frontend: Vercel-compatible build, set `VITE_API_BASE_URL`.
- Backend: Render-compatible Node service, set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, and `NODE_ENV=production`.
- Configure CORS to the actual deployed frontend origin.
- Ensure the backend health endpoint works publicly before connecting the frontend.
- Test login, create listing, request, approval, status tracking, and impact dashboard on the deployed version.
- If deployment fails or environment is unavailable, report that honestly and provide reproducible local demo instructions. Do not say “deployed” until verified.

## Deadline priority
P0: end-to-end listing → request → approve → collect → deliver.
P1: authentication/roles, validation, safety messaging, responsive UI.
P2: impact dashboard, polish, README.
P3: optional images, extra animations, nonessential integrations.

Stop adding features when P0/P1 are stable. Spend remaining time fixing defects and validating the demo.
