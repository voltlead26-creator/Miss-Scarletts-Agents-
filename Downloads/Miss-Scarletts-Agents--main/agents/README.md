# Agent Workspaces

This folder holds the specialty knowledge bases for the 12 agent roles used by Miss Scarletts Agents.

Each workspace should contain:

- a narrow specialty scope
- a source pack built from primary or authoritative documentation
- operating notes that tell the agent what to optimize for
- no blank or placeholder outputs
- a clear purpose statement
- a declared MCP integration surface

## Current Specialties

### Core Coordinator

- [Agent Smith](../core/smith/README.md)

Agent Smith is the governing coordinator that assigns, sequences, reviews, and escalates work across the specialist agents.

1. [Coder](./coder/README.md)
1. [Frontend](./frontend/README.md)
1. [Backend](./backend/README.md)
1. [Supabase](./supabase/README.md)
1. [Netlify](./netlify/README.md)
1. [DevOps](./devops/README.md)
1. [QA](./qa/README.md)
1. [Security](./security/README.md)
1. [Accessibility](./accessibility/README.md)
1. [Prompt Engineering](./prompt-engineering/README.md)
1. [Product Analytics](./product-analytics/README.md)
1. [Technical Writing](./technical-writing/README.md)

## Purpose And MCP Integrations

| Agent | Purpose | MCP integrations |
| --- | --- | --- |
| Coder | Implement repo changes, fix bugs, and wire features across the codebase. | Local shell, GitHub, Playwright, Supabase, Netlify, Figma when design input is needed. |
| Frontend | Build and refine UI behavior, layout, interaction, and component composition. | Local shell, Playwright, GitHub, Figma, Netlify. |
| Backend | Design and implement server logic, contracts, validation, and API behavior. | Local shell, GitHub, Supabase, Playwright. |
| Supabase | Manage database, auth, policies, storage, functions, and deploy state. | Supabase, GitHub, local shell. |
| Netlify | Manage site linkage, builds, deploys, env vars, and release contexts. | Netlify, GitHub, local shell. |
| DevOps | Orchestrate CI/CD, environment protection, release gates, and workflow hygiene. | GitHub, local shell, Supabase, Netlify. |
| QA | Verify behavior, reduce flake, and protect user journeys with tests. | Playwright, local shell, GitHub. |
| Security | Review secrets, auth, transport, repo security, and app-layer defense. | GitHub, local shell, Supabase, Netlify. |
| Accessibility | Review semantics, keyboard behavior, contrast, screen reader support, and WCAG alignment. | Playwright, Figma, GitHub, local shell. |
| Prompt Engineering | Shape prompts, structured outputs, tool calls, and conversation state. | Local shell, GitHub, OpenAI API docs, evaluation tooling when available. |
| Product Analytics | Design measurement, instrumentation, dashboards, and analysis. | Local shell, GitHub, analytics platforms such as PostHog or GA4. |
| Technical Writing | Produce and edit documentation, error messages, and recovery guidance. | Local shell, GitHub, source docs, design or product context when needed. |

## Shared Rule

Specialty agents should prefer evidence from their source pack, keep changes scoped, and stop short of production-impacting action unless Agent Smith and the human owner have approved it.

When Agent Smith delegates work to a specialist, the specialist may call the MCP integrations listed for its role to complete the task.
