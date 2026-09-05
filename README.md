# KisanMitra Frontend

A responsive frontend prototype for KisanMitra, an agricultural market-intelligence and transaction-enablement interface. It contains tailored workspaces for Farmer, FPO, Buyer, Storage Manager, Transport Manager, Quality Assessor, and Admin actors.

This repository is UI/UX only. It has no backend, database, authentication service, or external API dependency. Demonstration data is loaded from JSON files in [`mockdata/`](mockdata/).

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

No environment variables or service credentials are required.

## Actor routes

The root route redirects to the Farmer workspace. Individual workspaces are also available directly:

| Actor | Route |
| --- | --- |
| Farmer | `/farmer` |
| FPO | `/fpo` |
| Buyer | `/buyer` |
| Storage Manager | `/storage` |
| Transport Manager | `/transport` |
| Quality Assessor | `/quality` |
| Admin | `/admin` |

Use the **Viewing as** selector in the header to switch actors without restarting the application.

## Available commands

```bash
# Start the development server with hot reload
npm run dev

# Check the source for lint errors
npm run lint

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

## Common setup issues

- If Node reports an unsupported engine, upgrade to Node 22.13 or newer.
- If port 3000 is already occupied, use the alternative local URL printed by the development server.
- If dependencies appear inconsistent, remove `node_modules` and rerun `npm ci`; do not delete `package-lock.json`.

Product and UI documentation is indexed in [`docs/README.md`](docs/README.md).
