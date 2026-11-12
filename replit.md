# One Liberia Connect

A public-facing website for One Liberia Connect, a division of One Liberia Enterprise Corporation, covering community broadband, planned school technology hubs, partnerships, and community requests.

## Run & Operate

- The `artifacts/one-liberia-connect: web` workflow runs the website preview.
- `pnpm --filter @workspace/one-liberia-connect run typecheck` checks the website.
- The website preview does not require environment variables or the API server.

## Stack

- pnpm workspace, React, TypeScript, and Vite
- Static frontend; no API or database dependency for the public website

## Where things live

- Website routes and page content: `artifacts/one-liberia-connect/src`
- Website styles: `artifacts/one-liberia-connect/src/index.css` and `src/pages/home.css`
- Website photos and logo: `artifacts/one-liberia-connect/public/images`
- Shared API server and libraries: `artifacts/api-server` and `lib`

## Architecture decisions

- The public website is a static React + Vite app and does not depend on the shared API server.
- Community, contact, and partnership forms currently validate in the browser only; they do not transmit or store submissions.
- Campaign dates and reach targets must remain clearly labeled as plans or goals, not completed outcomes.

## User preferences

- Keep the UI clean and polished, taking the CorelDRAW website as a visual reference without copying it.
- Use the logo and photos supplied by the user.

## Gotchas

- Connect a secure submission service before collecting real inquiries.
- The original website repository is `https://github.com/teamitechnetwork/One-Liberia`.

