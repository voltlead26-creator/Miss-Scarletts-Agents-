# Timeouts, Retries, and Flakes

Timeouts and retries are control mechanisms, not substitutes for correct synchronization.

## Core facts

- Playwright Test has a default per-test timeout.
- Assertions such as `toHaveText()` have their own timeout.
- `test.slow()` and `test.setTimeout()` exist for genuinely slow cases.
- Retries can help expose flakiness, but they do not fix the underlying cause.

## Practical guidance

- Adjust timeouts when the workflow is actually slower, not when the test is just poorly synchronized.
- Use retries to confirm whether a failure is intermittent.
- Fix the timing model before extending the timeout broadly.

## Common mistakes

- Adding a long timeout to mask a broken wait condition.
- Letting flaky tests accumulate without root-cause analysis.
- Treating retries as a cure rather than a signal.
