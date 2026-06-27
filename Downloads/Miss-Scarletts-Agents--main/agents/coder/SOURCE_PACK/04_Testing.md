# Testing

The Coder agent should think about tests as evidence of behavior.

## Test hierarchy

- Unit tests for pure functions and isolated logic.
- Component tests for user-visible interaction in a DOM-like environment.
- Integration tests for data flow across modules or services.
- End-to-end tests for critical user journeys.

## Test rules

- Fix the behavior that broke, then encode the fix in a test.
- Prefer stable selectors and user-centered assertions.
- Avoid timing assumptions where a state-based assertion will do.
- Mock external systems at the boundary, not everywhere.
- Keep tests short enough that a failure reveals the bug quickly.

## Common test traps

- Over-mocking until the test no longer resembles production.
- Depending on exact text when the user outcome matters more than wording.
- Letting flaky tests accumulate.
- Covering implementation branches without covering the user journey.

## Practical signals to watch

- A test that is hard to read is usually protecting the wrong boundary.
- If a bug can reappear through the UI, the test should probably touch the UI.
- If a unit test takes a lot of setup, the code may be too coupled.
