# Data Modeling and Postgres

Backend quality depends on the shape of the data. If the model is weak, the API and UI inherit that weakness.

## Core principles

- Model for correctness first, then convenience.
- Preserve the true domain state.
- Make invalid states difficult to represent.
- Keep write paths constrained and explicit.
- Prefer server-enforced constraints over application-only checks.

## Modeling guidance

- Use primary keys that are stable and non-ambiguous.
- Separate canonical records from derived views.
- Store timestamps in a consistent, comparable form.
- Use foreign keys to protect relationships.
- Use constraints to encode invariant business rules when possible.

## Query discipline

- Query only the data needed for the request.
- Avoid unnecessary round trips.
- Filter as early as possible.
- Be deliberate about joins and fan-out.
- Treat pagination as part of the contract, not an afterthought.

## Migration discipline

- Make schema changes incremental.
- Backfill safely before tightening constraints.
- Keep destructive changes separate from additive ones when possible.
- Test migrations on realistic data shapes.

## Common failure modes

- Encoding business rules only in application code.
- Allowing duplicate or contradictory records.
- Joining more than needed and creating expensive fan-out.
- Treating migrations as mere formatting changes.
