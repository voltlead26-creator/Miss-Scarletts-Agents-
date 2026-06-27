# QA Review Discipline

QA review should answer one question: does this test prove the behavior that matters without being brittle?

## Review checklist

- Does the test target a real user journey or real bug?
- Are the selectors user-facing and stable?
- Is the test isolated?
- Are the waits and assertions tied to observable state?
- Does the failure message help triage the problem?

## Good signals

- The test is small enough to understand quickly.
- The assertion describes the user-visible outcome.
- The setup is explicit.
- The failure is useful on first read.
