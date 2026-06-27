# QA Fundamentals

QA work is about proving that the system behaves as users need it to behave. The best tests are tied to the risk of the change and the behavior that matters.

- Tests should be isolated and repeatable.
- Assertions should match user-visible behavior, not implementation details.
- A stable test suite protects the user journey that actually broke.
- Flaky tests usually mean the test or environment model is wrong, not that flakiness is acceptable.
- Browser automation tools like Playwright provide locators, fixtures, timeouts, debugging artifacts, and retries to support reliable verification.

## Core facts to keep in mind

- One test should not depend on hidden state left behind by another test.
- User-facing selectors are more resilient than CSS tied to implementation detail.
- Waiting for the actual state is better than sleeping for an arbitrary duration.
- Test data, auth state, and environment setup are part of the test design.

## Practical implications

- Cover the changed behavior first.
- Prefer a small test that proves the fix over a broad test that is hard to maintain.
- Diagnose the root cause of a flaky test before adding more retries or timeouts.
- Separate product regression failures from infrastructure or setup failures.
