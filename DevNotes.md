# 10.12.2025 Notes

ADDED "@hookform/resolvers": "^5.2.2",
ADDED "@tailwindcss/vite": "^4.1.17",
ADDED "@tanstack/react-query": "^5.90.12",
ADDED "axios": "^1.13.2",
ADDED "clsx": "^2.1.1",
ADDED "date-fns": "^4.1.0",
ADDED "react-hook-form": "^7.68.0",
ADDED "react-router-dom": "^7.10.1",
ADDED "tailwind-merge": "^3.4.0",
ADDED "tailwindcss": "^4.1.17",
ADDED "zod": "^4.1.13",
ADDED "typescript": "^5.2.2"

UPDATED "react": "19.2.1", from "19.2.0" because of "React2Shell-CVE-2025-55182" just in case even though we do not use RSC or Node in backend
UPDATED "react-dom": "19.2.1", from "19.2.0" because of "React2Shell-CVE-2025-55182" just in case even though we do not use RSC or Node in backend

Created boilerplate code, most of the code needs revisiting and changes, but the structure is there.

# Architecture explanation:

- app/ - Application setup and global providers
- features/ - Feature-based modules (challenges, leaderboard, progress)
- shared/ - Shared utilities, API clients, and types

- The app folder contains the main application provider and setup
- Each feature folder contains its own components, hooks, and types
- The shared folder contains reusable code like reusable UI stuff or shared types, hooks, contexts, utils and API clients

- index.ts barrel files in feature folders re-export components and types for easier imports so don't forget to add them when you create new files inside features
- data.ts files in feature folders are used for fetching and managing data related to that feature
- types.ts files in feature folders define types specific to that feature
