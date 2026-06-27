# Testing and Release Safety

Supabase changes should be tested at the boundary where they matter: data access, policy enforcement, and deploy behavior.

## Core principles

- Test policies, not just queries.
- Test function behavior with realistic environment assumptions.
- Test migrations against real-looking data shapes.
- Verify the deployed result after changing schema or functions.

## Useful test layers

- SQL and migration checks
- Policy tests
- Function tests
- Integration tests for auth and storage
- Deployment verification tests

## Common mistakes

- Only testing from a privileged account.
- Ignoring the deploy path and testing only local code.
- Missing regressions in policy behavior.
