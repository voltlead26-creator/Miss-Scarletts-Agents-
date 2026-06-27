# Schema Design and Migrations

Supabase migrations are production changes. They need the same care as application releases.

## Core principles

- Additive changes are safer than destructive ones.
- Backfill before you tighten constraints.
- Keep schema and policy changes coordinated.
- Make migration intent obvious to future maintainers.

## Migration discipline

- Prefer small, reversible steps.
- Test on realistic data.
- Separate structural changes from data transformations when possible.
- Do not ship a schema that the current application cannot use.

## Common mistakes

- Deploying a code path that expects columns or policies not yet present.
- Dropping fields before consumers are fully migrated.
- Letting schema drift accumulate across environments.

## Operational notes

- Migration order matters.
- Post-deploy verification matters.
- Rollbacks are easier when changes were staged clearly.
