# Postgres Foundation

Because Supabase runs on Postgres, backend work must respect relational design and SQL discipline.

## Core principles

- Model the business state directly.
- Keep constraints close to the data.
- Use relational integrity to prevent impossible states.
- Make queries clear enough to review under pressure.

## Design guidance

- Use primary and foreign keys intentionally.
- Encode uniqueness where the business rule requires it.
- Store timestamps, statuses, and ownership fields in consistent formats.
- Keep denormalized data only when there is a clear read-path need.

## Query discipline

- Select only what the caller needs.
- Index the columns that appear in filters and joins.
- Be deliberate about pagination and ordering.
- Avoid expensive fan-out unless the use case justifies it.

## Common mistakes

- Leaving business rules to application code alone.
- Allowing duplicate rows that should be unique.
- Building queries that are hard to reason about or test.
