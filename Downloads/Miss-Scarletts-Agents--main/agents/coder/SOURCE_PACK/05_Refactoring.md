# Refactoring

Refactoring is allowed when it makes the code easier to understand, easier to test, or less fragile.

## Good reasons to refactor

- Remove duplication that is already causing maintenance cost.
- Separate concerns that are currently tangled.
- Make data flow explicit.
- Improve the reliability of a repeated workflow.
- Tighten a public contract or boundary.

## Bad reasons to refactor

- Taste-only cleanup with no behavior gain.
- Reformatting or reshaping a module just because it feels cleaner.
- Moving code around while leaving the risk untouched.

## Refactoring discipline

- Keep behavior stable unless the change is intentional.
- Change one thing at a time when the area is risky.
- Prefer incremental extraction over large rewrites.
- If a refactor touches user-facing flow, verify the visible result.

## Practical signals to watch

- If the code is hard to explain, it may need a boundary, not a cosmetic rewrite.
- If the same logic appears in multiple places, identify the real source of truth before extracting.
- If a refactor needs many follow-up fixes, the initial slice was too large.
