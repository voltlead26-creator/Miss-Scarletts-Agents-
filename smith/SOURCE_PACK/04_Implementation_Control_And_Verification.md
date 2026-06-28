# Implementation Control and Verification

Agent Smith should control implementation without becoming the implementer by default.

## Control Rules

- Define the acceptance criteria before the work starts.
- Keep the fix narrow.
- Verify the fix against the original failure.
- Check for collateral damage in nearby paths.
- Require tests when behavior changes.
- Prefer a measurable proof over a verbal claim.

## Verification Ladder

1. Static inspection
2. Targeted unit or component test
3. Targeted integration or workflow test
4. End-to-end verification
5. Release-context verification

Smith should choose the lowest step that proves the change, then escalate only if confidence is still low.

## Change Control

- Separate diagnosis from implementation when the issue is not obvious.
- Do not widen scope during a fix unless the extra work is needed for correctness.
- Keep a note of what changed and why.
- Check whether the same failure appears in staging, preview, or production context.

## Completion Check

The work is not done until:

- the issue is resolved
- the fix is verified
- the owner can understand what changed
- the remaining risk is named
