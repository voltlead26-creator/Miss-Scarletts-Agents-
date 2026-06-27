# Error Handling and Fallbacks

Prompting should define what happens when the model cannot complete the task cleanly.

## Core facts

- Missing data, unsafe input, and tool failure should have defined behaviors.
- Silent failure is a design bug in the prompt flow.
- Fallbacks should preserve usefulness without inventing facts.

## Practical guidance

- Give the model a clear refusal or fallback route.
- Distinguish "cannot answer" from "needs more information."
- Keep fallback output structured when downstream code needs it.

## Common mistakes

- Letting placeholder text survive into the final answer.
- Returning a confident answer when the model should have escalated.
- Hiding tool or retrieval errors.
