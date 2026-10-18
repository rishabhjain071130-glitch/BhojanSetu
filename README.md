# BhojanSetu (भोजनसेतु)
> **"Good food deserves a destination, not a dustbin."**
> Event-based surplus food recovery and redistribution platform in India.

---

## 🌟 Executive Summary

**BhojanSetu** bridges the gap between surplus event food (weddings, banquets, caterers, college festivals, and corporate functions) and verified food recovery organizations (NGOs, community kitchens, shelter homes).

Instead of relying on disorganized phone calls and scattered messaging groups, BhojanSetu provides an operational coordination platform with:
- **Urgency-aware rescue tracking** with strict collection deadlines and live countdowns.
- **Explainable, rule-based partner ranking** (evaluating verification, capacity fit, deadline urgency, and locality — **transparent business logic, explicitly not AI/ML**).
- **Privacy-protected pickup coordination** (masking kitchen contacts and loading dock directions until an assignment is authorized).
- **Chronological status audit history** (Pending → Approved → Collected → Delivered).
- **Genuine live database metrics** (grouped by metric units, distinguishing user-reported volumes from formula-derived diversion estimates).

---

## 👥 Target User Roles

1. **Event Organizer / Caterer**: Creates listings for banquet/wedding surplus with preparation times, storage conditions, and deadlines. Reviews incoming requests and approves assignments.
2. **Recovery Partner (NGO / Community Kitchen)**: Discovers eligible, non-expired food, submits capacity-bounded requests, and records physical collection and delivery hand-offs.
3. **Platform Coordinator / Admin**: Oversees platform activity, reviews partner verification applications, and audits aggregate metrics.

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React 19 + Vite 8 + TypeScript + Tailwind CSS (v4) + Lucide Icons + Recharts
- **Backend**: Node.js v24 + Express + TypeScript + Mongoose + Zod Validation
- **Database**: MongoDB (Local instance or MongoDB Atlas)
- **Security**: JWT authentication (HTTP-only cookies & Bearer tokens), bcryptjs password hashing, Helmet headers, CORS origin protection, Express Rate Limiting
- **Deployment Compatibility**: Frontend on Vercel / Netlify; Backend API on Render / Railway / Fly.io

---

## 📁 Repository Structure

```text
BhojanSetu/
├── client/                     # Vite React TypeScript frontend
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── api/client.ts       # Typed API client with token management
│   │   ├── components/         # StatusBadge, UrgencyBadge, DemoAccountSelector, etc.
│   │   ├── context/AuthContext # Authentication session provider
│   │   ├── pages/              # Landing, Dashboard, Browse, CreateListing, Detail, etc.
│   │   ├── types/index.ts      # Shared frontend data contracts
│   │   ├── App.tsx             # React Router routing configuration
│   │   └── main.tsx            # Application DOM mount
│   ├── .env.example            # Frontend environment template
│   └── package.json
├── server/                     # Express Node TypeScript backend
│   ├── src/
│   │   ├── config/             # Environment validation and MongoDB connection
│   │   ├── controllers/        # Auth, listings, requests, partners, impact
│   │   ├── middleware/         # Auth guards, role checks, Zod validation, error handler
│   │   ├── models/             # Mongoose schemas: User, FoodListing, RecoveryRequest
│   │   ├── routes/             # REST endpoints (/api/...)
│   │   ├── scripts/seed.ts     # Idempotent demo database seeder
│   │   ├── services/           # Smart Rescue Engine (Rule-based matching)
│   │   ├── tests/smoke.test.ts # Automated 18-step E2E smoke test suite
│   │   ├── validators/         # Zod schemas for input validation
│   │   └── index.ts            # Server bootstrap
│   ├── .env.example            # Backend environment template
│   └── package.json
├── package.json                # Root scripts (build, test, dev, seed)
├── .gitignore                  # Git ignore rules (protecting .env and node_modules)
└── README.md                   # Project documentation
```

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24.18)
- **npm**: v9+
- **MongoDB**: A running local MongoDB instance on port 27017 (`mongodb://127.0.0.1:27017/bhojansetu`) or a free MongoDB Atlas connection string.

### 2. Clone and Configure Environment

```bash
git clone https://github.com/rishabhjain071130-glitch/BhojanSetu.git
cd BhojanSetu

# Configure backend environment
cp server/.env.example server/.env

# Configure frontend environment
cp client/.env.example client/.env
```

Ensure environment configurations in `server/.env` and `client/.env` are populated according to your local setup (reference templates provided in `server/.env.example` and `client/.env.example`).

### 3. Install Dependencies & Seed Demo Data

```bash
# Install root, server, and client dependencies
npm --prefix server install
npm --prefix client install

# Seed the database with honest demo accounts and listings
npm run seed
```

### 4. Run Automated Smoke Tests

```bash
npm test
```
*Executes an 18-step end-to-end integration test suite verifying health, authentication, listing validation, privacy masking, rule-based candidate matching, capacity conflict prevention, partner approval, hand-off state progression, and impact updates.*

### 5. Start Development Servers

In terminal 1 (or concurrently):
```bash
# Start backend API (http://localhost:5000)
npm run dev:server
```

In terminal 2:
```bash
# Start frontend client (http://localhost:5173)
npm run dev:client
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Demo Accounts for Evaluators

For rapid evaluation, the platform includes a **Hackathon Evaluation Fast-Track Switcher** located on the landing page, login page, and dashboard. You can switch between all 4 personas with a single click without entering credentials manually:

| Role | Demo Email | Organization | Capabilities |
| :--- | :--- | :--- | :--- |
| **Organizer** | `organizer@bhojansetu.demo` | Royal Grand Banquets | List surplus, view candidates, approve/reject requests |
| **Verified Partner** | `partner.verified@bhojansetu.demo` | Annapurna Seva Trust | Browse open food, submit requests, record collection/delivery |
| **Pending Partner** | `partner.pending@bhojansetu.demo` | Navjeevan Rescue | Browse food; requests gated until admin verifies |
| **Admin Coordinator** | `admin@bhojansetu.demo` | BhojanSetu Desk | Review/approve partner verification, audit all listings |

> **Quick Access**: Click any role in the floating evaluation widget or on the login screen to sign in automatically. If logging in manually, default demo credentials are initialized during `npm run seed`.

*Disclaimer: All seeded organizations, event names, and contacts are fictional demo records clearly labeled for evaluation purposes.*

---

## 🔄 End-to-End User Journey Walkthrough

1. **Organizer lists surplus**:
   - Organizer logs in and fills the listing form (`/listings/create`).
   - Inputs event name, food category, quantity (e.g. 50 kg), preparation timestamp, thermal holding conditions (`> 65°C`), collection deadline (future), and private pickup instructions.
2. **Partner discovers & requests**:
   - Verified partner logs in and discovers the listing under `/listings`.
   - Submits requested quantity and volunteer pickup note.
3. **Organizer reviews & approves**:
   - Organizer opens listing details (`/listings/:id`), reviews the **Smart Rescue Engine (Rule-Based)** recommendation score, and clicks **Approve & Assign**.
   - Concurrency protection ensures available volume cannot be oversubscribed.
4. **Partner records hand-off**:
   - Approved partner unlocks private pickup loading dock instructions.
   - Upon arriving on-site, partner clicks **Record Collection (Loaded)**.
   - Once distributed to community kitchen recipients, clicks **Record Delivery (Completed)**.
5. **Impact Dashboard updates live**:
   - `/impact` immediately updates metrics using real database aggregation pipelines.

---

## 🛡️ Food Safety & Legal Scope Boundaries

- **Coordination Tool Only**: BhojanSetu coordinates logistical hand-offs; it is not a food safety certifier.
- **Physical Inspection Mandatory**: Software status never replaces physical sensory inspection (sight, smell, temperature checks) by authorized food handlers.
- **Thermal Holding Guidelines**: Cooked food must be kept outside the danger zone (hot holding `> 65°C`, refrigerated `< 5°C`).
- **Automatic Expiration**: When a collection deadline passes, listings immediately become ineligible and cannot be assigned.

---

## 🔒 Security & Privacy Implementation

- **No Plaintext Passwords**: Hashed via `bcryptjs` (salt factor 10).
- **No Self-Assigned Admins**: Registration endpoint strictly permits only `organizer` or `partner` roles; administrative roles are protected.
- **Privacy Gating**: Exact loading dock directions and private organizer contacts remain masked until a verified partner request is authorized.
- **Protected Environment Variables**: `.env` files are excluded from Git; `.env.example` templates contain only non-sensitive placeholders.
- **Rate Limiting**: Brute-force protection enabled on authentication endpoints.

---

## 📦 Production Build & Deployment

To verify production readiness:
```bash
# Compiles both server TypeScript (tsc) and client bundle (Vite)
npm run build
```

### Deploying Frontend (Vercel)
1. Link the repository to Vercel with Root Directory set to `client`.
2. Set Environment Variable: `VITE_API_BASE_URL=https://<your-backend-api-url>/api`.
3. Build Command: `npm run build`; Output Directory: `dist`.

### Deploying Backend (Render / Railway)
1. Create a Web Service with Root Directory set to `server`.
2. Build Command: `npm run build`; Start Command: `npm start`.
3. Set Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGODB_URI=<your-mongodb-atlas-uri>`
   - `JWT_SECRET=<strong-jwt-secret>`
   - `CLIENT_ORIGIN=https://<your-frontend-domain>`

---

## ⚖️ Known Limitations & Future Roadmap

- **Distance Model**: Uses locality / service area matching rather than live GPS tracking to avoid battery and data overhead for community volunteers.
- **Split Allocations**: The MVP currently allocates a listing to a single verified partner to eliminate on-site coordination confusion. Multi-partner splitting is scheduled for v2.
- **SMS/WhatsApp Notifications**: For the MVP, real-time in-app dashboard polling and notifications are used; direct WhatsApp webhook integration is planned for the post-hackathon pilot.
