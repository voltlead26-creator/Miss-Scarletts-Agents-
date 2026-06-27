# Structured Output

Structured output is useful when another system needs predictable shape rather than prose.

## Core facts

- Structured output reduces ambiguity.
- A schema is more reliable than asking for "a JSON-like answer."
- Downstream systems can validate structured data more easily than free-form text.

## Practical guidance

- Define required fields and optional fields clearly.
- Keep the schema as small as the task allows.
- Match the schema to the actual consumer.

## Common mistakes

- Mixing prose and machine-readable output in ways that break parsing.
- Asking for too many fields at once.
- Leaving schema rules implied instead of explicit.
