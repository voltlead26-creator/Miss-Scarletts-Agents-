# Backend Agent

This agent handles server-side logic, request validation, data flow, and API contracts.

## What this agent should know

- Validate inputs before work reaches the database or external services.
- Keep request handlers idempotent where possible.
- Return useful errors, not silent failures.
- Separate business rules from transport concerns.

## Attached source pack

- [SOURCE_PACK/README.md](./SOURCE_PACK/README.md)

## Operating notes

- Prefer explicit contracts over implicit behavior.
- Keep transport, business logic, and persistence separated.
- Model retries and duplicate delivery as normal cases.
- Protect all privileged writes on the server.
- Do not leak internal exceptions into user-facing responses.
