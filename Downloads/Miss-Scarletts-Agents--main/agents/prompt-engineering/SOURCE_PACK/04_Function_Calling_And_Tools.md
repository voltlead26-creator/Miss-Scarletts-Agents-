# Function Calling and Tools

Tool use is appropriate when the model must gather or update external state instead of inventing it.

## Core facts

- Function calling lets the model request an external action or lookup.
- Tool boundaries should be explicit because they change what the model is allowed to do.
- External state should be fetched rather than guessed.

## Practical guidance

- Use tools for retrieval, updates, and environment-specific work.
- Keep tool descriptions narrow and purpose-specific.
- Validate tool results before using them as final truth.

## Common mistakes

- Asking the model to infer data that should have come from a tool.
- Making tool descriptions too broad.
- Treating a tool call as proof that the state update succeeded.
