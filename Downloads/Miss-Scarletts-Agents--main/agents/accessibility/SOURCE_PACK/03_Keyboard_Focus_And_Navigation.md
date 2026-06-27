# Keyboard Focus and Navigation

Keyboard access is a required part of accessibility because many users navigate without a mouse.

## Core facts

- Every interactive control should be reachable by keyboard.
- Focus order should follow a logical sequence.
- Focus should be visible.
- Custom widgets need keyboard behavior that matches the user’s expectations for that widget type.

## Practical guidance

- Use native controls where possible because they already handle keyboard semantics.
- Manage focus when UI changes move the user to a new context, such as a modal or a new page.
- Avoid focus traps unless the user is intentionally constrained inside a modal or similar component.
- Ensure skip links or other navigation aids work when the app has repeated page chrome.

## Common mistakes

- Removing outlines without replacement.
- Making a control clickable only with pointer events.
- Creating keyboard paths that do not match pointer paths.
