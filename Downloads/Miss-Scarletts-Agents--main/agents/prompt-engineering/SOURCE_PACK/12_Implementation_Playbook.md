# Prompt Engineering Implementation Playbook

Use this when turning a prompt task into a concrete prompt or tool flow.

1. Identify the exact job the model should do.
2. Separate instructions, context, constraints, and output format.
3. Decide whether the answer should be free-form or structured.
4. Decide whether the task needs a tool call or state update.
5. Define what happens when context is missing or unsafe.
6. Add representative examples or evaluation cases.
7. Check that the prompt behaves consistently after changes.

## Review questions

- What evidence must survive across turns?
- What can the model infer safely, and what must be stated?
- Does downstream code need a schema?
- What should happen if the answer cannot be produced safely?
- What examples prove the prompt still works?

## Output standard

- The prompt is explicit.
- The output is predictable.
- The fallback is defined.
- The prompt can be maintained without guesswork.
