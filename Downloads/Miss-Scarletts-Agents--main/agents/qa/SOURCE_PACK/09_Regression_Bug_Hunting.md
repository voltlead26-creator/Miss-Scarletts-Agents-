# Regression Bug Hunting

When a bug is fixed, the most valuable test is usually the one that proves that exact failure mode cannot return.

## Core facts

- A regression test should be narrow, concrete, and tied to the failure mode.
- The test should cover the path that failed, not just a related UI path.

## Practical guidance

- Recreate the bug in the smallest useful form.
- Assert the user-visible result that proves the fix.
- Keep the test close to the code path or scenario that broke.

## Common mistakes

- Writing a vague test that does not actually fail on the original bug.
- Expanding the test until it becomes hard to maintain.
- Forgetting to include the failure mode in the assertion.
