# Authentication and Test Data

Authentication and test data are part of test design because the user state changes what should be visible and allowed.

## Core facts

- Playwright browser contexts can load authenticated state.
- Reusing auth state can speed up tests while still keeping tests isolated.
- Setup flows can be modeled as test projects or fixtures.

## Practical guidance

- Use authenticated state when the scenario requires it.
- Keep test data predictable and small.
- Make seed data explicit so failures are easier to understand.

## Common mistakes

- Logging in through the UI in every test when there is a cheaper reliable setup path.
- Sharing mutable test data across unrelated suites.
- Letting auth setup become a hidden dependency.
