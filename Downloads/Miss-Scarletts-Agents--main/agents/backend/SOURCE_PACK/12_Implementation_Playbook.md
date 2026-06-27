# Backend Implementation Playbook

Use this when turning backend work into code.

1. Define the request, response, and failure shapes.
2. Identify the data the operation touches.
3. Decide which checks belong at the boundary.
4. Decide which checks belong in the database.
5. Keep business logic isolated from transport and storage details.
6. Make side effects explicit and idempotent where possible.
7. Add tests for validation, permissions, and failure paths.
8. Verify observability and rollback implications before merging.

## Review questions

- Can the caller understand the error without reading logs?
- Can the operation be retried safely?
- Can access control be bypassed through another route?
- Can the logic be tested without the full app running?
- Can this change survive a partial outage or duplicate event?

## Output standard

- The endpoint behavior is predictable.
- The data model supports the business rule.
- The code is readable under pressure.
- The failure mode is intentional, not accidental.
