# Isolation, Fixtures, and Parallelism

Isolation is what keeps test failures local and debuggable.

## Core facts

- Playwright fixtures are isolated between tests.
- Tests should not share hidden browser state.
- Playwright runs test files in parallel by default.
- Project dependencies can be used to model setup as a testable step.

## Practical guidance

- Use fixtures to create exactly the environment each test needs.
- Reset browser state rather than relying on order.
- Make setup explicit when a test requires login or seeded data.
- Treat parallel execution as a normal operating mode, not a special case.

## Common mistakes

- Depending on execution order.
- Sharing mutable global state between tests.
- Making setup invisible and hard to debug.
