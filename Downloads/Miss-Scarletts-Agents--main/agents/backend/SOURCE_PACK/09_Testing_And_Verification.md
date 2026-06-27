# Testing and Verification

Backend tests should prove behavior at the contract boundary, not just internal helper behavior.

## Core principles

- Test the public behavior of handlers and services.
- Cover authorization and validation failures.
- Verify idempotency and retry behavior.
- Test integrations with realistic assumptions.
- Use fixtures that resemble actual production shapes.

## Useful test layers

- Unit tests for business rules
- Contract tests for API behavior
- Integration tests for database and policy behavior
- Workflow tests for retries and re-entry
- Regression tests for bugs that have already escaped

## What to verify

- Input rejection
- Permission checks
- Response shape
- Side effects
- State transitions
- Error recovery

## Common mistakes

- Only testing the happy path.
- Mocking away the thing you actually need confidence in.
- Writing tests that mirror implementation instead of behavior.
- Skipping the cases that are expensive to debug later.
