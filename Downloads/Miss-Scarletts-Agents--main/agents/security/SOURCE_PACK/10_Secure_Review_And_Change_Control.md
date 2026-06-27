# Secure Review and Change Control

Security changes need review discipline because they often affect authentication, data access, or release behavior.

## Core facts

- Security-focused code review checks for secrets, environment separation, secure defaults, error handling, and access control.
- A change that weakens a boundary should be treated as production-relevant even if it looks small.

## Practical guidance

- Review auth, transport, storage, and logging together.
- Ask what happens if the feature is used outside the intended path.
- Keep sensitive changes small and easy to inspect.

## Common mistakes

- Reviewing only the visible feature while missing the security effect.
- Accepting environment drift.
- Letting convenience erase defense in depth.
