# One Liberia Connect

A public-facing website for One Liberia Connect, a division of One Liberia Enterprise Corporation, explaining community broadband, planned school technology hubs, partnerships, and the community request process.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Website: `artifacts/one-liberia-connect`
- Website routes and page content: `artifacts/one-liberia-connect/src/App.tsx`
- Website styles: `artifacts/one-liberia-connect/src/index.css`
- Website images and logo: `artifacts/one-liberia-connect/public/images`
- Vercel settings: root `vercel.json`
- Website deploy notes: `README.md`

## Architecture decisions

- The public website is a static React + Vite app; it does not depend on the shared API server.
- The Vercel project root must be the repository root so the pnpm workspace install and root `vercel.json` work.
- Contact and community request forms are browser-only previews and do not deliver or store submissions.

## Product

- Multi-page site for community broadband, planned school technology hubs, partnerships, and community requests.
- Brand tagline: “In the Community, Built by the Diaspora.”
- Campaign dates and reach targets must remain clearly labeled as plans or goals, not completed outcomes.

## User preferences

- Keep the UI clean and polished, taking the CorelDRAW website as a visual reference without copying it.
- Use the logo and photos supplied by the user.

## Gotchas

- Connect a secure submission service before collecting real inquiries; current forms do not transmit or store data.
- The Vercel config is at the repository root and builds only the One Liberia Connect website.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
