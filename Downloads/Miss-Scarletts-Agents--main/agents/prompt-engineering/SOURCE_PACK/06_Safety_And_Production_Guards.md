# Safety and Production Guards

Production prompts should be explicit about safety, fallback behavior, and what the model must not do.

## Core facts

- Safety guidance should be explicit, not implied.
- The prompt should say what to do when information is missing or unsafe.
- Production behavior should not depend on the model guessing hidden policy.

## Practical guidance

- State the refusal, fallback, or escalation path when the answer cannot be produced safely.
- Keep the allowed behavior narrow enough to be testable.
- Define what the model should do with ambiguous or risky input.

## Common mistakes

- Hiding safety logic in vague prose.
- Leaving refusal behavior undefined.
- Expecting the model to discover policy from examples alone.
