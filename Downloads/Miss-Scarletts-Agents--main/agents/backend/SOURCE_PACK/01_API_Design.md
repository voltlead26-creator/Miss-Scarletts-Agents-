# API Design

Backend work starts with a contract. If the API is vague, everything downstream becomes harder to validate, test, and support.

## Core principles

- Design around user and system actions, not around tables.
- Make routes and actions describe intent.
- Prefer small, stable payloads over overstuffed endpoints.
- Keep response shapes predictable across success and failure.
- Version only when the contract truly breaks.

## Good API behavior

- Every request has a clear input shape.
- Every success response has a known output shape.
- Every error response can be handled by the client without string parsing.
- Partial failure is represented explicitly.
- Long-running work is acknowledged separately from completion.

## Common design choices

- Use resource-oriented endpoints for standard CRUD.
- Use action endpoints for non-CRUD operations such as approve, publish, resend, or recalculate.
- Prefer POST for operations with side effects.
- Use idempotency keys for retry-prone writes.
- Include request identifiers for traceability.

## Contract discipline

- Keep field names stable.
- Avoid changing meaning silently.
- Treat null, empty, and missing as distinct states when the business logic cares.
- Document allowed transitions and invalid states.

## Failure modes

- Overloading a single endpoint with too many behaviors.
- Returning different response shapes for the same logical operation.
- Burying business meaning inside generic 200 responses.
- Leaving the client to infer whether a write actually happened.
