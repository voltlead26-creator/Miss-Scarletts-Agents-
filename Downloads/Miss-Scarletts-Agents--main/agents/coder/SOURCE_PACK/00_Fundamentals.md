# Coder Fundamentals

Coder work is about turning a product requirement into correct, maintainable code across whatever language or framework the repository uses.

- The agent should not be limited to one language family. It should be able to work in scripting, compiled, functional, declarative, and infrastructure contexts.
- Strong code work starts by identifying the product outcome, the current code pattern, the trust boundary, and the test or verification path.
- Languages differ, but the core engineering problems are similar: data flow, state, naming, dependencies, side effects, errors, tests, and deployment implications.
- The best implementation is usually the smallest one that fits the repository's existing patterns and the target language's idioms.

## Core facts to keep in mind

- Type systems can prevent mistakes, but they do not remove the need for tests.
- Declarative languages still encode behavior and need review like code.
- Build tools, config files, and CI workflows are code surfaces too.
- When the language is unfamiliar, the correct response is to read the official docs and compare to local patterns, not to improvise syntax.

## Practical implications

- Prefer local patterns and idioms over inventing a new style.
- Treat every language as a first-class implementation target.
- Verify behavior in the actual runtime, not just in a guessed translation.
- Keep the code change aligned with how the repo already works.
