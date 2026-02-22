# aploy-app

Vue 3 + **Nuxt 3** frontend for Aploy, using **Vue Options API**.

## Setup

```bash
# Remove old Next.js artifacts if present (optional)
rm -rf src .next next.config.js postcss.config.js tailwind.config.js tsconfig.json

npm install
npm run dev
```

- **Dev:** `npm run dev` — Nuxt dev server with hot reload (default http://localhost:3000).
- **Build:** `npm run build`
- **Start (prod):** `npm run start`

## Stack

- **Nuxt 3** — Vue 3 framework, file-based routing.
- **Vue Options API** — All pages and components use `defineComponent` + `data()`, `methods`, etc.
- **Tailwind CSS** — Via `@nuxtjs/tailwindcss` and `assets/css/main.css`.

## Layouts

- **blank** — Used for `/`, `/login`, `/auth/callback` (no sidebar).
- **app** — Used for all `/app/*` routes (sidebar + right-side ChatPanel). Set via `definePageMeta({ layout: 'app' })` on each app page.
- **default** — Minimal wrapper for any page that doesn’t set a layout.

## Env

- `NUXT_PUBLIC_API_URL` — Base URL of aploy-api (default `http://localhost:4000`). Used for auth and API calls.

## Routes (pages/)

- `/` — Home (layout: blank)
- `/login` — Sign in with Google (layout: blank)
- `/auth/callback` — OAuth callback + MFA (layout: blank)
- `/app` — Dashboard (layout: app)
- `/app/projects`, `/app/projects/new`, `/app/projects/[id]`
- `/app/datasets`, `/app/datasets/new`, `/app/datasets/[id]`
- `/app/runs`, `/app/runs/[id]`
- `/app/training/new`
- `/app/evaluations`
- `/app/registry`, `/app/registry/[id]`
- `/app/deployments`, `/app/deployments/new`
- `/app/billing`, `/app/settings`, `/app/org`

Right-side **ChatPanel** (OpenAI assistant) is included in the `app` layout and calls `POST /api/chat` with optional `openai_api_key`.
