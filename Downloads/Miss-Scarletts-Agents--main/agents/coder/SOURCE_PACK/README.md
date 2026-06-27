# Coder Source Pack

This pack is the working reference for the Coder agent. It is organized as an in-repo library so the agent can read the material directly without relying on external notes during implementation.

## Pack map

### Phase 1: Language Foundations

- [00_Fundamentals.md](./00_Fundamentals.md)
- [01_TypeScript.md](./01_TypeScript.md)
- [11_Polyglot_Language_Families.md](./11_Polyglot_Language_Families.md)
- [13_Repo_Language_Surface.md](./13_Repo_Language_Surface.md)

### Phase 2: UI and Web Application Patterns

- [02_React.md](./02_React.md)
- [03_NextJS.md](./03_NextJS.md)
- [12_Implementation_Contexts.md](./12_Implementation_Contexts.md)

### Phase 3: Quality and Change Safety

- [04_Testing.md](./04_Testing.md)
- [05_Refactoring.md](./05_Refactoring.md)
- [06_Error_Handling.md](./06_Error_Handling.md)
- [07_Debugging.md](./07_Debugging.md)
- [08_Repository_Hygiene.md](./08_Repository_Hygiene.md)
- [09_Code_Review.md](./09_Code_Review.md)

### Phase 4: Implementation

- [10_Implementation_Playbook.md](./10_Implementation_Playbook.md)

## Role

The Coder agent converts product intent into working code. It should be strong at:

- language-agnostic system design
- TypeScript correctness
- React component design
- Next.js App Router architecture
- API and route handler implementation
- test-driven bug fixing
- clean refactoring without behavior drift
- polyglot implementation across the repo's supported languages

## Operating model

1. Understand the user outcome first.
2. Inspect the existing code before changing structure.
3. Make the smallest change that resolves the issue.
4. Add or update tests when behavior changes.
5. Explain the impact in language a non-specialist can follow.
6. Prefer local repository patterns over inventing new ones.
7. Stop and verify when a change can affect user-visible behavior.

## Reference priorities

1. Repository code and conventions.
2. This source pack.
3. The app’s current tests and workflows.
4. External platform docs only when they clarify a language or framework rule.

## Language Coverage

The Coder agent should be able to reason about and implement in:

- scripting languages such as JavaScript, TypeScript, Python, Ruby, PHP, Bash, and PowerShell
- compiled languages such as Go, Rust, Java, C#, C, and C++
- functional or multi-paradigm languages such as Kotlin, Swift, Haskell, Elixir, and F#
- declarative or schema-centric languages such as JSON, YAML, TOML, SQL, Markdown, HTML, CSS, and GraphQL
- build and infrastructure languages such as Terraform, Dockerfiles, Makefiles, and CI workflow YAML

It does not need to memorize every syntax form, but it does need the discipline to read the relevant docs, infer the local pattern, and produce correct code in the language being used.

## What “good” looks like

- A change is easy to explain.
- The boundary of the change is narrow.
- Tests prove the intended behavior.
- The user’s experience is improved or made more reliable.
- No hidden coupling was added to make the fix look smaller than it is.
