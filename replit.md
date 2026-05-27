# AgriNova AI

A premium AI-powered smart agriculture SaaS platform — crop prediction, disease detection, market analytics, weather monitoring, yield estimation, and fertilizer recommendations, all in one polished dashboard.

## Run & Operate

- `pnpm --filter @workspace/agrinova run dev` — run the frontend (uses PORT env var)
- `pnpm --filter @workspace/api-server run dev` — run the Node.js API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Python backend (`agrinova/backend/`) runs separately at `http://localhost:8000` via FastAPI
- Set `VITE_API_URL` to point the frontend at your Python backend (default: `http://localhost:8000`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite + Tailwind CSS v4 + Framer Motion + Recharts + shadcn/ui
- Routing: wouter
- Forms: react-hook-form + zod
- Notifications: sonner
- Theming: next-themes (dark/light mode)
- API: Express 5 (Node.js health check server)
- External Backend: Python FastAPI (user's existing backend at localhost:8000)
- DB: PostgreSQL + Drizzle ORM (Node.js side)

## Where things live

- `artifacts/agrinova/src/pages/` — all 12 pages (dashboard, crop, disease, analytics, alerts, market, weather, fertilizer, yield, profile, login, signup)
- `artifacts/agrinova/src/components/` — layout, protected-route, theme-provider, shadcn ui components
- `artifacts/agrinova/src/lib/api.ts` — manual API client for the Python FastAPI backend
- `artifacts/api-server/src/routes/` — Node.js API routes (health check)
- `lib/api-spec/openapi.yaml` — OpenAPI spec for Node.js server

## Architecture decisions

- Frontend calls the Python FastAPI backend directly via `VITE_API_URL` (not proxied through Node.js server) — keeps the existing Python backend untouched
- Auth uses localStorage (JWT token + user JSON) matching the existing Python backend's auth flow
- All API pages have fallback mock data so the UI is always functional even when the Python backend is offline
- Dark mode by default with next-themes toggling `.dark` class on document root
- Manual API client in `src/lib/api.ts` instead of codegen hooks — Python backend has its own schema outside the monorepo

## Product

**AgriNova AI** gives farmers and agri-analysts:
- **Dashboard** — real-time weather KPIs, AI suggestions, active alert count, quick actions
- **Crop Prediction** — soil profile form → AI-ranked crop candidates with confidence scores
- **Disease Detection** — drag-and-drop leaf photo → diagnosis with severity, confidence, and remedies
- **Analytics** — yield trends (area chart), crop distribution (pie), soil health (radar), price history
- **Smart Alerts** — list/create alerts, evaluate irrigation triggers with sliders
- **Market Prices** — 8-week price trend charts with crop selector
- **Weather** — current conditions + 7-day forecast + AI farming suggestions
- **Fertilizer Advisor** — soil + crop inputs → nutrient recommendations
- **Yield Estimator** — soil + climate inputs → yield range with visual gauge
- **Profile** — farmer profile management

## User preferences

- Keep Python FastAPI backend unchanged — frontend only improvement
- Modern premium SaaS look: forest green palette, glassmorphism, Framer Motion animations
- Dark mode default
- All features must work with fallback mock data when backend is offline

## Gotchas

- Set `VITE_API_URL=http://localhost:8000` in the frontend's `.env.local` to point at the Python backend
- The Python backend requires MongoDB — see `agrinova/backend/.env.example`
- Login/signup calls the Python backend; if it's not running, use the mock data fallback (change ProtectedRoute to skip auth check temporarily)
- All `red` CSS variables in index.css have been replaced with the AgriNova green/amber palette

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Python backend entry: `agrinova/backend/main.py` (FastAPI)
- Frontend API client: `artifacts/agrinova/src/lib/api.ts`
