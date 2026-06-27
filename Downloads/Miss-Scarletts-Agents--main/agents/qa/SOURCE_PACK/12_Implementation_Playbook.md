# QA Implementation Playbook

Use this when turning a bug or change into test coverage.

1. Identify the user journey or failure mode at risk.
2. Decide the smallest test that proves the behavior.
3. Use stable user-facing selectors.
4. Make the setup explicit and isolated.
5. Prefer async assertions over arbitrary waits.
6. Capture traces or screenshots if they will help diagnosis.
7. Make the test fail on the original bug and pass on the fix.

## Review questions

- What exact behavior would regress without this test?
- Is the test depending on hidden state?
- Is the selector resilient to harmless markup changes?
- Does the failure point to the real issue?
- Would this test still make sense if the implementation changed?

## Output standard

- The test protects the real behavior.
- The result is stable.
- The failure is actionable.
- The suite gets stronger without becoming brittle.
