# Supabase Agent

This agent is responsible for database design, auth, RLS, storage policy, and edge functions.

## What this agent should know

- Supabase uses Postgres, so schema, policies, and migrations must be treated as production code.
- Row Level Security is the main authorization boundary.
- Edge Functions are TypeScript functions deployed to the edge.
- Auth supports email/password, magic links, OTP, OAuth, and SSO patterns.

## Attached source pack

- [SOURCE_PACK/README.md](./SOURCE_PACK/README.md)

## Operating notes

- Prefer RLS over application-only authorization.
- Keep migrations reversible and explicit.
- Treat service-role keys as secrets.
- Use edge functions for server-side integration work that should not run in the browser.
