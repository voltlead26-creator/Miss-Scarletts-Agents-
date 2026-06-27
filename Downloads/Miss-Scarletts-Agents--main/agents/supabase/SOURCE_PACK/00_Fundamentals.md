# Supabase Fundamentals

Supabase work in this repository is built on a few factual platform rules:

- Supabase is Postgres-backed. Tables, indexes, constraints, and SQL behavior are not optional implementation details.
- Row Level Security is a Postgres primitive and provides defense in depth for database access.
- Supabase Auth identifies the user and establishes session context, but it does not replace authorization.
- Publishable keys are intended for browser use when RLS is enabled. The `service_role` key bypasses RLS and must never be exposed to the browser.
- Edge Functions are server-side TypeScript functions that can use secrets and call external services.
- Storage access is part of the authorization surface and should follow the same trust model as the rest of the app.

## Core facts to keep in mind

- The `anon` and `authenticated` roles are guarded by RLS when you use publishable client access.
- OAuth scopes do not automatically grant table access.
- Policies should be written for the actual operation, not just the table name.
- Migrations are production changes because they alter live schema behavior.
- Local, staging, and production can diverge unless the schema, policies, and environment variables stay aligned.

## Practical implications

- Treat the schema as production code.
- Use RLS as the default authorization boundary.
- Keep server-only secrets out of the browser.
- Coordinate schema, policy, and function changes together.
- Verify behavior under the real user role, not only as an admin.
