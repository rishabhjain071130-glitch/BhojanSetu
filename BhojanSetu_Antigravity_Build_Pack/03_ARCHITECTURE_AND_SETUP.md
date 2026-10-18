# 03 — Architecture and Local Setup

## Preferred structure
Use a simple client/server repository:

/
  client/
    src/
      app/
      components/
      features/
      layouts/
      lib/
      pages/
      types/
  server/
    src/
      config/
      middleware/
      models/
      routes/
      controllers/
      services/
      validators/
      utils/
    tests/
  README.md
  .gitignore
  .env.example

Adapt to the existing repository rather than forcing this exact structure if it already has a sound working layout.

## Stack
- React + Vite
- TypeScript preferred
- Tailwind CSS or already configured styling
- React Router
- Node.js + Express
- MongoDB Atlas + Mongoose
- Zod validation
- Recharts for real impact visualizations only
- Optional Cloudinary only if image upload is necessary and configured

## API conventions
- Prefix API routes with `/api`.
- Add `GET /api/health` returning service status and a safe timestamp.
- Use JSON consistently.
- Return appropriate HTTP status codes.
- Use a shared error-handling middleware.
- Do not leak stack traces or secrets in production responses.
- Add request body validation before controller logic.
- Add a reasonable request size limit and basic security middleware.
- Use CORS with an explicit configured frontend origin in production.

## Environment variables
Server `.env.example` should include placeholders, not secrets:
- `PORT=5000`
- `NODE_ENV=development`
- `MONGODB_URI=`
- `JWT_SECRET=`
- `CLIENT_ORIGIN=http://localhost:5173`
- `DEMO_MODE=true` (only if a clearly scoped demo mode is implemented)

Client `.env.example`:
- `VITE_API_BASE_URL=http://localhost:5000/api`

Never commit real `.env` files or API keys. Check `.gitignore` before any Git operation.

## Configuration
- Validate required server environment variables at startup.
- Provide clear errors if MongoDB is not configured.
- For local development without a database, use a clearly labelled mock/demo adapter only if it supports the critical journey honestly. Do not silently pretend that data is persistent.
- Prefer one real persistence path for the main demo if Atlas can be configured.
- Do not build a complex generic repository abstraction for this short MVP.

## Development commands
Create root-level convenience scripts if appropriate, for example:
- `npm run dev` for concurrently running client and server, if a small dev dependency is justified.
- `npm run build`
- `npm run lint`
- `npm test` or server/client test scripts.

If the repository uses separate package files, document exact commands for each folder.

## Architecture principles
- Controllers handle HTTP concerns; services handle business rules.
- Server-side role and ownership checks are mandatory.
- Business rules are not duplicated inconsistently across screens.
- Keep matching deterministic and explainable.
- Avoid microservices, queues, and unnecessary state-management libraries.
- Use a small API client wrapper with centralized error handling.
- Never store authentication tokens in unsafe ad hoc locations without considering XSS risk; prefer secure httpOnly cookies if implemented cleanly, or document the trade-off for a hackathon MVP.
