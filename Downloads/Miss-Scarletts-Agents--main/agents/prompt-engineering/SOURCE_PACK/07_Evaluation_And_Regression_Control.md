# Evaluation and Regression Control

Prompts should be evaluated like code: against examples, against failure modes, and over time.

## Core facts

- A prompt is not good until it behaves consistently on representative examples.
- Regression testing matters because prompt changes can break prior behavior.
- Evaluation should reflect the actual task and failure mode.

## Practical guidance

- Build a small set of representative examples for the critical paths.
- Check both correctness and consistency.
- Re-run the same examples after prompt changes.

## Common mistakes

- Judging a prompt by a single lucky response.
- Ignoring known failure modes.
- Changing the prompt without measuring the effect.
