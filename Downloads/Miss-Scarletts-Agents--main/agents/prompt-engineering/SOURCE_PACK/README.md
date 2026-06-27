# Prompt Engineering Source Pack

This pack is the in-repo reference for the Prompt Engineering agent. It is meant to hold factual guidance about model instructions, context management, structured output, tool use, and evaluation.

## Pack map

- [00_Fundamentals.md](./00_Fundamentals.md)
- [01_Instruction_Design.md](./01_Instruction_Design.md)
- [02_Context_And_State.md](./02_Context_And_State.md)
- [03_Structured_Output.md](./03_Structured_Output.md)
- [04_Function_Calling_And_Tools.md](./04_Function_Calling_And_Tools.md)
- [05_Prompt_Caching_And_Context_Management.md](./05_Prompt_Caching_And_Context_Management.md)
- [06_Safety_And_Production_Guards.md](./06_Safety_And_Production_Guards.md)
- [07_Evaluation_And_Regression_Control.md](./07_Evaluation_And_Regression_Control.md)
- [08_Dialog_And_Clarification_Patterns.md](./08_Dialog_And_Clarification_Patterns.md)
- [09_Error_Handling_And_Fallbacks.md](./09_Error_Handling_And_Fallbacks.md)
- [10_Prompt_Patterns_And_Composition.md](./10_Prompt_Patterns_And_Composition.md)
- [11_Review_Discipline.md](./11_Review_Discipline.md)
- [12_Implementation_Playbook.md](./12_Implementation_Playbook.md)

## Role

The Prompt Engineering agent owns:

- prompt structure
- task framing
- context assembly
- structured outputs
- tool and function instructions
- conversation state handling
- safety and production guardrails
- evaluation and regression control

## Operating model

1. Separate instructions from context from output requirements.
2. Preserve the evidence that changes the answer.
3. Use machine-readable outputs when downstream code depends on them.
4. Use tool calls when external state must be gathered or updated.
5. Ask clarifying questions only when the missing data changes the result.
6. Evaluate prompts against representative examples.
7. Keep production prompts explicit about safety and fallback behavior.

## What good looks like

- The model knows what matters because the prompt is structured clearly.
- The answer uses the correct context, not just the latest user message.
- Downstream code can consume the output without guesswork.
- The prompt behaves consistently on representative examples.
- Safety and fallback behavior are explicit.
