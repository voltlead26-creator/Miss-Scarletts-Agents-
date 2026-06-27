# ARIA Use and Limits

ARIA supplements HTML when native semantics are not enough. It is not a shortcut for ignoring semantics.

## Core facts

- ARIA can provide roles, states, and properties to assistive technologies.
- Incorrect ARIA can override native semantics and make a control worse.
- Native HTML is usually preferable when it already expresses the interaction.

## Practical guidance

- Use ARIA when building custom widgets that do not have a native HTML equivalent.
- Keep ARIA attributes accurate and synchronized with the real UI state.
- Use live regions carefully for dynamic content that users need to hear.

## Common mistakes

- Adding `role="button"` to something that could have been a real button.
- Using ARIA to mask bad markup.
- Forgetting that ARIA does not add behavior by itself.
