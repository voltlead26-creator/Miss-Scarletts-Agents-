# UI Testing and QA

Frontend quality has to be proved in the browser path the user actually takes.

## What the agent should know

- Unit tests protect pure logic.
- Component tests protect interaction and rendering.
- Integration tests protect data flow between frontend layers.
- End-to-end tests protect the real user journey.

## Rules of thumb

- Add tests around regressions and user-visible behavior changes.
- Prefer stable selectors and state-based assertions.
- Keep tests readable enough that the bug is obvious when they fail.
- Test keyboard paths and responsive behavior where it matters.
- Verify loading, empty, and error states as deliberately as the happy path.

## Common failure modes

- Relying on brittle text-only assertions.
- Mocking so much that the test no longer resembles the app.
- Ignoring accessibility regressions because the screen still looks right.
- Treating flakiness as normal.
