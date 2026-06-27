# Prompt Caching and Context Management

Long prompts and repeated context can be expensive, so prompt design should account for reuse and token pressure.

## Core facts

- Prompt caching is part of OpenAI's context management guidance.
- Context compaction and token counting help manage long conversations.
- Repeated stable instructions are better candidates for caching than volatile user-specific facts.

## Practical guidance

- Keep stable instructions separate from changing evidence.
- Remove redundant text when the same instruction appears in multiple places.
- Preserve the facts that affect the answer, even when compressing history.

## Common mistakes

- Repeating the same instructions in multiple forms.
- Compaction that removes the evidence needed for a correct answer.
- Treating all context as equally valuable.
