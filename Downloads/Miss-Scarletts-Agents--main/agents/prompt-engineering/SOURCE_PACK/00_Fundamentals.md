# Prompt Engineering Fundamentals

Prompt engineering is the practice of shaping the model's input so the output is more reliable, more constrained, and easier to use.

- OpenAI docs organize the API around prompting, structured output, function calling, conversation state, and context management.
- A prompt should state the task, the relevant context, the constraints, and the required output shape.
- Structured output is useful when downstream code needs predictable data rather than just a good answer.
- Function calling is useful when the model needs to gather or update external state.
- Conversation state matters when the model must preserve evidence across turns.
- Context management and caching matter when prompts become long or repeated.

## Core facts to keep in mind

- The model cannot infer hidden business rules reliably if they are not supplied.
- If the answer depends on evidence, the evidence should be carried forward explicitly.
- Evaluation is part of prompt design because a prompt is only useful if it behaves consistently.
- The prompt should match the decision boundary: what must be asked, retrieved, or inferred.

## Practical implications

- Structure the prompt before trying to make it more verbose.
- Preserve important prior context instead of assuming the model will remember it.
- Prefer predictable schemas when another system consumes the output.
- Use prompts to narrow the task, not to hide ambiguity.
