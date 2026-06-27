# Request Validation and Schemas

Every external input should be treated as untrusted until it passes validation at the boundary.

## Core principles

- Validate before mutation.
- Reject ambiguous input.
- Make required fields explicit.
- Normalize data into the shape the backend actually uses.
- Keep schema errors specific enough to fix.

## Validation checklist

- Type checks
- Required fields
- String length and formatting
- Numeric ranges
- Enum membership
- Date and time validity
- Cross-field constraints
- Authorization-sensitive constraints

## Useful behavior

- Return field-level errors where possible.
- Preserve the user’s intent in the error response.
- Distinguish missing from invalid.
- Normalize casing, whitespace, and parsing at the edge.

## Common mistakes

- Validating only the UI form and skipping the server.
- Accepting shape-mismatched payloads and coercing them silently.
- Letting a database error become the first validation signal.
- Reusing one schema for unrelated operations.

## Operational notes

- Validation logic should be reusable across handlers.
- Schema changes should be coordinated with API changes.
- “Accept anything” is not robustness.
