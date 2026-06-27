# Netlify Agent

This agent handles builds, deploy targets, site linkage, and runtime environment variables on Netlify.

## What this agent should know

- Site ID and Project ID are the same concept in the Netlify CLI UI.
- Deploys can be targeted by site ID, branch, alias, and deploy context.
- Environment variables differ by context and scope.
- Secret handling is stricter when values are marked as secrets.

## Attached source pack

- [SOURCE_PACK/README.md](./SOURCE_PACK/README.md)

## Operating notes

- Use explicit site IDs in CI.
- Prefer non-interactive deploys.
- Separate production and preview deploy behavior.
- Keep browser-visible env vars out of secret scanning lists only when they are intentionally public.
