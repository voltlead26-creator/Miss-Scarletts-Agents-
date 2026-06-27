# Supabase Source Pack

This pack is the local reference for the Supabase agent. It is structured as attached in-repo knowledge so the agent can reason from concrete operating guidance instead of a short link list.

## Pack map

- [01_Supabase_Platform_Model.md](./01_Supabase_Platform_Model.md)
- [02_Postgres_Foundation.md](./02_Postgres_Foundation.md)
- [03_Auth_And_Session_Handling.md](./03_Auth_And_Session_Handling.md)
- [04_RLS_And_Authorization.md](./04_RLS_And_Authorization.md)
- [05_Schema_Design_And_Migrations.md](./05_Schema_Design_And_Migrations.md)
- [06_Storage_And_File_Policies.md](./06_Storage_And_File_Policies.md)
- [07_Edge_Functions.md](./07_Edge_Functions.md)
- [08_Environment_And_Secrets.md](./08_Environment_And_Secrets.md)
- [09_Deployments_And_Local_Development.md](./09_Deployments_And_Local_Development.md)
- [10_Observability_And_Debugging.md](./10_Observability_And_Debugging.md)
- [11_Testing_And_Release_Safety.md](./11_Testing_And_Release_Safety.md)
- [12_Implementation_Playbook.md](./12_Implementation_Playbook.md)

## Role

The Supabase agent owns the platform surfaces that back the product:

- database schema and migrations
- authentication and session handling
- row-level security and authorization
- storage buckets and file access
- edge functions and server-side integrations
- environment variables and secrets
- local development, branches, and deploys
- debugging, observability, and release safety

## Operating model

1. Treat the schema as production code.
2. Decide the authorization model before writing queries.
3. Keep browser-visible client behavior separate from server-only behavior.
4. Make deploys and migrations explicit and reversible where possible.
5. Test against real access rules, not assumptions.
6. Separate local, staging, and production concerns.
7. Prefer clear ownership of data and files over broad access.

## What good looks like

- Data access is intentional.
- Auth state is consistent across client and server.
- RLS enforces the rules the app depends on.
- Functions are deployable without hidden local state.
- Storage does not bypass authorization.
- Debugging a failure does not require guessing which environment caused it.
