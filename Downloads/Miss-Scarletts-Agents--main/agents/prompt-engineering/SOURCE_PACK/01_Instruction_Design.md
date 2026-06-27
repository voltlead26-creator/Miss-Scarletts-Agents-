# Instruction Design

Instruction design is about making the model's job unambiguous.

## Core facts

- Separate the task, constraints, examples, and output requirements.
- Clear instructions reduce the model's need to guess priorities.
- Specificity is better than vague style guidance when the output must be stable.

## Practical guidance

- Put hard constraints in clearly labeled sections.
- Distinguish mandatory rules from preferences.
- Use examples only when they clarify behavior, not when they add noise.

## Common mistakes

- Mixing system-like rules into the same block as casual conversation.
- Hiding important constraints in long paragraphs.
- Expecting the model to infer the output format from tone alone.
