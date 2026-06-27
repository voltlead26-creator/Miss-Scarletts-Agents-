# Debugging

Debugging is evidence-driven work.

## What the agent should know

- Start from the observed symptom, not the suspected cause.
- Reproduce the issue if possible.
- Reduce the change set until the bug is isolated.
- Check the boundary first: inputs, environment, configuration, and state.
- When the bug is intermittent, inspect timing, caching, and stale state.

## Debugging workflow

1. Write down the exact failure.
2. Identify the smallest reproducible path.
3. Check logs, traces, and assertions.
4. Compare the broken path against the last known good path.
5. Fix the root cause, not the symptom.
6. Add a test that would have caught the break.

## Common traps

- Guessing before reproducing.
- Changing multiple variables at once.
- Treating a flaky symptom as a completely new problem.
- Fixing visible output while leaving the underlying contract broken.
