# Prompt Patterns and Composition

Good prompts often combine a few stable patterns: role definition, task framing, constraints, examples, and output schema.

## Core facts

- Composition works better when each prompt block has one job.
- Strong prompts often read like a contract, not a conversation.
- A composed prompt should still be readable and maintainable.

## Practical guidance

- Separate instruction, context, constraints, and output requirements.
- Use reusable prompt blocks for stable behavior.
- Keep examples short and relevant.

## Common mistakes

- Packing everything into one paragraph.
- Rewriting the same prompt from scratch every time.
- Using examples that contradict the rules.
