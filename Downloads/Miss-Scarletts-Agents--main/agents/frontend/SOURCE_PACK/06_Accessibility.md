# Accessibility

Accessibility is a core frontend responsibility, not a final polish task.

## What the agent should know

- WCAG organizes accessibility around perceivable, operable, understandable, and robust content.
- Semantic HTML gives the browser and assistive tech useful structure.
- Every interactive element should be reachable with a keyboard.
- Labels, headings, alt text, and reading order matter because assistive technology depends on them.
- Color should not be the only signal for state, error, or status.

## Rules of thumb

- Use native controls before custom widgets.
- Keep focus visible and predictable.
- Make error states understandable without color.
- Ensure screen-reader text and visible text agree.
- Test the keyboard path for any new interaction.

## Common failure modes

- Using clickable divs where a button or link would work.
- Hiding labels or focus states.
- Building a layout that traps keyboard focus.
- Making responsive design decisions that accidentally harm accessibility.
