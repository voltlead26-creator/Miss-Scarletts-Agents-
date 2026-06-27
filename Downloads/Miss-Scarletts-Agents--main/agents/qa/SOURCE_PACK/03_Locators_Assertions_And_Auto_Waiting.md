# Locators, Assertions, and Auto-Waiting

Playwright locators and async assertions are the main tools that make tests resilient.

## Core facts

- Locators are central to Playwright's retryability and actionability model.
- Playwright recommends user-facing locators such as roles, text, and test IDs over implementation-tied CSS selectors.
- `page.getByRole()` is preferred when the element has a meaningful accessible role.
- `expect(locator).toHaveText()` and similar async assertions wait for the expected condition.
- Auto-waiting checks the element before performing actions and only proceeds when it is actionable.

## Practical guidance

- Prefer user-visible contracts over brittle DOM paths.
- Assert the state the user can observe.
- Use locators that still make sense after reasonable markup changes.
- Let the assertion wait for the expected condition instead of sleeping.

## Common mistakes

- Using raw CSS selectors for everything.
- Querying the DOM before the page is ready.
- Writing assertions that do not describe what the user sees.
