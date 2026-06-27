# Supabase Integration

Backend work in this repo often flows through Supabase for auth, Postgres, row-level security, and edge functions. The backend agent should understand the platform boundaries clearly.

## Core principles

- Treat Supabase as infrastructure, not magic.
- Keep auth, database access, and policy enforcement aligned.
- Use the database to protect shared state.
- Use edge functions for logic that belongs near the platform boundary.

## Practical guidance

- Design tables around the real business process.
- Pair database access with authorization checks.
- Use RLS when the access model benefits from data-level enforcement.
- Keep function inputs and outputs explicit.
- Prefer small operational surfaces that are easy to deploy and observe.

## Common failure modes

- Assuming client libraries remove the need for server authorization.
- Letting table structure stand in for policy.
- Mixing public and privileged data paths.
- Deploying functions that depend on hidden environment assumptions.

## Operational notes

- Database writes should be traceable.
- Functions should fail loudly when configuration is missing.
- Use environment-specific settings intentionally.
