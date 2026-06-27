# Context and State

Context is the evidence the model uses to answer. State is the information that must survive from one turn to the next.

## Core facts

- Conversation state is necessary when the answer depends on earlier evidence.
- Context management is not just about token count; it is about preserving the right facts.
- If a new user message changes the answer, the old evidence should still be available.

## Practical guidance

- Carry forward the relevant facts, not the entire conversation indiscriminately.
- Update the stored context when the user adds something material.
- Separate transient chat text from durable facts.

## Common mistakes

- Dropping the earlier evidence that makes the final answer different.
- Treating the most recent message as the only thing that matters.
- Keeping irrelevant context so long that the important material gets buried.
