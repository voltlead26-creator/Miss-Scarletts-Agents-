# Test Strategy and Risk

Test coverage should follow risk. Not every line deserves the same level of protection, and not every bug deserves a huge suite.

## Core facts

- High-risk flows deserve stronger coverage than trivial internal helpers.
- User journeys are often the highest value regression target.
- Fixing a bug without a test often invites the same bug back later.

## Practical guidance

- Test the path that users take, especially where money, account access, or data integrity are involved.
- Add regression coverage for bugs that already escaped.
- Use smaller tests when they can prove the same thing more clearly.
- Balance unit, integration, and end-to-end coverage according to the failure mode.

## Common mistakes

- Writing tests that mirror code structure instead of behavior.
- Overinvesting in low-risk internal details.
- Assuming a large test count means good coverage.
