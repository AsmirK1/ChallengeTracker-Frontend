## ChallengeTracker Frontend

React 19 + Vite + TypeScript client for ChallengeTracker. It handles authentication, challenge browsing, and progress tracking via the backend API.

> Need the API instructions? See `../ChallengeTracker-Backend/readme.md`.

---

## Prerequisites

| Tool    | Version         | Notes                              |
| ------- | --------------- | ---------------------------------- |
| Node.js | ≥ 20 LTS        | Required for Vite dev server/build |
| npm     | ships with Node | Replace with yarn/pnpm if desired  |

Clone the repo and install dependencies:

```bash
git clone <repo-url> ChallengeTracker
cd ChallengeTracker/ChallengeTracker-Frontend
npm install
```

---

## Environment configuration

The client reads the backend base URL from `VITE_API_BASE_URL`.

Create `.env.local` (or edit `.env`) in `ChallengeTracker-Frontend/`:

```bash
VITE_API_BASE_URL=http://localhost:5000
```

Set the value to match the backend port (e.g., `http://localhost:5055` if you changed it). Vite automatically loads `.env.local`.

---

## Running locally

Backend must be running first (see backend README). Then start the frontend:

```bash
npm run dev
```

Open the URL shown in the console (default `http://localhost:5173`). Axios automatically attaches the JWT from `localStorage` to requests once you log in.

---

## Build, lint, and preview

```bash
# Type-check + build production bundle
npm run build

# Preview built assets locally
npm run preview

# ESLint (React + TypeScript rules)
npm run lint
```

TanStack Query handles server state caching, Tailwind CSS (via `@tailwindcss/vite`) powers styling, and React Router controls navigation.

---

## Troubleshooting

| Issue                                                   | Fix                                                                                                                                                                              |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API requests fail with `ERR_CONNECTION_REFUSED`         | Ensure the backend console shows “Now listening …” and that `VITE_API_BASE_URL` matches its URL.                                                                                 |
| Login succeeds but subsequent calls are unauthenticated | Inspect DevTools → Application → Local Storage for `token`. If missing, verify the backend response and ensure interceptors are configured (see `src/shared/api/api-client.ts`). |
| Tailwind styles missing                                 | Restart `npm run dev` after modifying Tailwind config.                                                                                                                           |
| Vite can’t find `@/...` imports                         | The alias is defined in `vite.config.ts`; avoid deleting it.                                                                                                                     |

---

## Deployment tips

- `npm run build` outputs the production bundle in `dist/`. Serve it via any static host (Netlify, Vercel, Azure Static Web Apps, etc.).
- Remember to set `VITE_API_BASE_URL` (or an equivalent env var) during deploy so the client knows how to reach the backend.
- For containerization, pair this build step with a lightweight Nginx/Apache image.
