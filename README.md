# KisanMitra Frontend

A responsive frontend prototype for KisanMitra, an agricultural market-intelligence and transaction-enablement interface. It contains tailored workspaces for Farmer, FPO, Buyer, Storage Manager, Transport Manager, Quality Assessor, and Admin actors.

This frontend uses Clerk for OAuth/email authentication and sends the Clerk session token to the KisanMitra FastAPI API. Supabase remains the database and storage layer on the server. Existing workspace fixtures remain available for prototype-only flows that do not yet have a matching backend screen.

The landing page supports guest demo browsing and public Maharashtra Mandi prices. Authenticated users can open Geography to view a privacy-safe map of nearby Farmers, Buyers, and FPOs. Configure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env.local`; keep the Clerk secret and JWKS settings in the backend only.

## Prerequisites

- [Node.js](https://nodejs.org/) 22.13 or newer
- npm, included with Node.js

Check your installed versions:

```bash
node --version
npm --version
```

## Clone and run

```bash
git clone https://github.com/harivansh-b/KisanMitra-Frontend.git
cd KisanMitra-Frontend
npm ci
npm run dev
```

The development server prints its local URL in the terminal. By default, open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and provide only public browser settings. `NEXT_PUBLIC_API_BASE_URL` defaults to `http://localhost:8000/api/v1` for local development. Never add a Supabase service-role key, database URL, or mandi API key to frontend environment files.

## Actor routes

The root route redirects to the Farmer workspace. Individual workspaces are also available directly:

| Actor | Route |
| --- | --- |
| Farmer | `/farmer/overview` |
| FPO | `/fpo/overview` |
| Buyer | `/buyer/overview` |
| Storage Manager | `/storage/overview` |
| Transport Manager | `/transport/overview` |
| Quality Assessor | `/quality/overview` |
| Admin | `/admin/overview` |

Use the **Viewing as** selector in the header to switch actors without restarting the application.

## Available commands

```bash
# Start the development server with hot reload
npm run dev

# Check the source for lint errors
npm run lint

# Validate types and backend-boundary contracts
npm run typecheck
npm test

# Create a production build
npm run build

# Run the previously created production build locally
npm run start

# Format the source
npm run format
```

Run `npm run build` before `npm run start`. Wrangler will print the production-preview URL in the terminal.

## Project structure

```text
app/          Application routes and global design tokens
components/   Actor workspaces, workflows and reusable UI components
mockdata/     JSON fixtures used by the frontend
docs/         Product, actor, workflow and design-system documentation
public/       Static icons and public assets
```

All visual styling should use the semantic tokens defined in [`app/globals.css`](app/globals.css). UI data should remain in JSON format inside `mockdata/`.

Frontend components consume data through the application provider and typed contracts in `domain/`; they do not import mock JSON directly. See [`docs/backend-adapter-contract.md`](docs/backend-adapter-contract.md) for the future backend integration boundary.

## Common setup issues

- If Node reports an unsupported engine, upgrade to Node 22.13 or newer.
- If port 3000 is already occupied, use the alternative local URL printed by the development server.
- If dependencies appear inconsistent, remove `node_modules` and rerun `npm ci`; do not delete `package-lock.json`.

Product and UI documentation is indexed in [`docs/README.md`](docs/README.md).
