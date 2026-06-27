# Implementation Contexts

Coder work happens in different contexts, and each has different failure modes.

## Application code

- Focus on behavior, state, data flow, and user-visible effect.
- Keep business logic isolated where the repo already separates it.

## Tests

- Prefer tests that fail for the original bug.
- Use the lightest test layer that still proves the behavior.

## Config and infra

- Treat config, build, and deployment files as code.
- Review environment differences carefully.

## Refactors and migrations

- Move in small steps.
- Preserve behavior until the final switch.

## Operating note

The Coder agent should always match the implementation context to the language and file type in front of it before editing.
