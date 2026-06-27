# Release and Change Safety

Backend changes need discipline because they can affect persisted data, integrations, and user trust.

## Core principles

- Change in small steps.
- Preserve backwards compatibility until the migration is complete.
- Coordinate code, schema, and workflow changes.
- Roll out with a rollback plan.

## Safe release habits

- Add before remove.
- Backfill before enforcing.
- Deploy non-breaking schema first when needed.
- Verify environment variables and feature flags before activation.

## Common mistakes

- Deploying code that expects a schema not yet present.
- Removing legacy behavior before consumers are updated.
- Mixing refactor and behavior change in one release.
- Skipping verification after the rollout.
