# Visual and Accessibility Regression Checks

QA is not only about happy-path behavior. It also needs to catch things that break the interface or make it harder to use.

## Core facts

- Playwright can help detect accessibility issues such as low contrast, unlabeled controls, and duplicate IDs.
- Visual behavior can be part of a regression even when the DOM still renders.
- Accessibility bugs and UI bugs often overlap.

## Practical guidance

- Check that labels, roles, and interactive controls are still correct after a UI change.
- Verify the important visual states, not just the default screen.
- Treat accessibility regressions as product regressions.

## Common mistakes

- Checking only logic and ignoring the user-facing surface.
- Assuming a test that clicks a button proves the button is still accessible.
- Missing regression in focus state, contrast, or labels.
