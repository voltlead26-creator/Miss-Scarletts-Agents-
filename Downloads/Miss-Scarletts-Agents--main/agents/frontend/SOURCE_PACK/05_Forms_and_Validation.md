# Forms and Validation

Forms are one of the most failure-prone parts of frontend work.

## What the agent should know

- The built-in form element is the starting point for interactive submission.
- Inputs should be labeled, constrained, and validated at the appropriate layer.
- The UI should show submission pending, success, and failure clearly.
- Client validation improves experience but should not be the only validation.
- A form should help the user recover from mistakes without redoing everything.

## Rules of thumb

- Use native form semantics unless there is a strong reason not to.
- Keep validation messages close to the field that needs attention.
- Preserve entered values when validation fails.
- Make submission state visible.
- Keep destructive actions separate from regular submit flows.

## Common failure modes

- Building forms from arbitrary divs and click handlers.
- Clearing user input on validation failure.
- Hiding errors at the top of the page where they are easy to miss.
- Relying on client checks alone for data quality.
