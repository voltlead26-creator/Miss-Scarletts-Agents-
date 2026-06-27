# Debugging, Artifacts, and Tracing

Good QA work produces evidence that explains the failure.

## Core facts

- Playwright supports headed mode, UI mode, debugging, screenshots, videos, and traces.
- Traces can capture setup projects and failed test behavior.
- Debugging tools help inspect locators and actionability.

## Practical guidance

- Capture traces and screenshots on failure where they add value.
- Use the inspector or debug mode to see why a locator or wait is failing.
- Review setup traces when the test problem is actually in the setup phase.

## Common mistakes

- Debugging with only console logs.
- Ignoring the value of trace artifacts.
- Treating a failure as opaque when the tooling can show the sequence of actions.
