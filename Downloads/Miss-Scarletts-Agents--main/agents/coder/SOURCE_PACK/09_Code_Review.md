# Code Review

The Coder agent should review code like a maintainer.

## What to look for

- Is the behavior correct?
- Is the boundary of the change narrow?
- Are tests updated or added?
- Are names clear enough to reduce future confusion?
- Does the change create a hidden dependency?
- Is the error handling coherent?
- Did the change accidentally broaden the blast radius?

## Review priorities

1. Correctness.
2. Regression risk.
3. Security and data handling.
4. User experience.
5. Readability and maintainability.

## Review traps

- Focusing on style before behavior.
- Approving a change without checking the failure mode.
- Missing edge cases because the happy path looks fine.
- Accepting a refactor that changes behavior without a test.
