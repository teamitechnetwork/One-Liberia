# One Liberia Connect

A multi-page website for One Liberia Connect, a division of One Liberia Enterprise Corporation. The site explains the community broadband and planned school technology hub work and provides pathways for community requests and partnership inquiries.

## Pages

- Home
- About Us
- Our Services
- Our Cause
- Partners and Investors
- Contact
- Connect Your Community

## Develop and build

Run checks and build the website from the repository root:

```sh
pnpm --filter @workspace/one-liberia-connect run typecheck
pnpm --filter @workspace/one-liberia-connect run build
```

The production files are written to `artifacts/one-liberia-connect/dist/public`.

## Vercel

Import the repository with the repository root as the Vercel project root. The root `vercel.json` installs the pnpm workspace, builds this website package, serves its production output, and rewrites the site routes to the SPA entry point. No environment variables are required for the current static build.

## Before collecting inquiries

The community, contact, and partnership forms currently validate input in the browser only. They do not transmit or store submissions. Connect a secure submission service before using the forms to collect real inquiries.
