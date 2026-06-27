# Playwright Test Model

Playwright Test is built around browser contexts, test functions, fixtures, and assertions.

## Core facts

- Playwright Test provides `test` and `expect`.
- Tests run in isolated browser contexts.
- Playwright Test can run in parallel by default.
- The `playwright.config` file centralizes browsers, retries, projects, timeouts, and reporters.

## Practical guidance

- Use the project model when you need different browsers or setup flows.
- Use test fixtures to provide the environment each test needs.
- Treat browser context isolation as part of reproducibility.

## Common mistakes

- Reusing state across tests without an explicit reason.
- Treating config as an afterthought.
- Assuming one browser tells you everything you need to know.
