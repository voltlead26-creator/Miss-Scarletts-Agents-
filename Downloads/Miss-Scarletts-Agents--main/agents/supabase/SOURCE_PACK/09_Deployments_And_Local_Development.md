# Deployments and Local Development

Supabase projects work best when local, staging, and production follow the same mental model.

## Core principles

- Local development should approximate production structure.
- Deploys should be explicit and repeatable.
- Database changes and function changes should be coordinated.
- Verification belongs after each meaningful release step.

## Practical guidance

- Keep the local setup aligned with the deployed schema.
- Test function deploys in the same shape the CI system will use.
- Verify that migrations have landed before assuming the app is out of date.
- Use branches or isolated environments when changes are risky.

## Common mistakes

- Debugging a staging issue with a different schema locally.
- Deploying functions without confirming the matching database state.
- Treating local success as proof of production readiness.
