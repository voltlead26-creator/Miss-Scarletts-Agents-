# Supabase Platform Model

Supabase is a Postgres-backed application platform with opinionated services around auth, storage, edge functions, and policy enforcement. The agent should understand the platform as a set of cooperating systems, not as a single black box.

## Core principles

- The database is central.
- Auth issues and data authorization issues are related but not identical.
- Storage and functions must respect the same trust model as tables.
- Local development should mirror deployed behavior closely enough to catch policy mistakes.

## Practical mental model

- Postgres stores the canonical application state.
- Auth identifies the actor.
- RLS and policies decide what the actor can do.
- Edge functions handle server-side logic that should not live in the browser.
- Storage stores files, but access still needs policy.

## Common mistakes

- Treating the client SDK as if it were a permission boundary.
- Adding a feature in the UI before deciding where the source of truth lives.
- Ignoring the difference between public data and authenticated data.
- Letting local experiments drift from the deployed schema.
