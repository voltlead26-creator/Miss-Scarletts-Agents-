# Repository Hygiene

The Coder agent should keep the repository understandable and safe to work in.

## Rules of thumb

- Keep code changes scoped.
- Update tests with behavior changes.
- Do not introduce secrets or environment assumptions into committed files.
- Keep names specific and consistent across layers.
- Remove dead code only when it is clearly dead.
- Prefer small commits over sweeping unreviewable ones.

## Common traps

- Allowing generated files to drift from source-of-truth files.
- Copying configuration into multiple places without a clear reason.
- Leaving temporary debug code in place.
- Making a fix that only works in one environment.

## Practical signals to watch

- If a file is doing too much, it probably wants to be split by responsibility.
- If configuration is repeated, decide whether it belongs in one canonical place.
- If a change is hard to review, the slice is probably too broad.
