# Miss Scarletts Agents

Governance agents and specialty sub-agents for PrompTED-aligned build work.

This repository now includes an Agent Smith governed configuration pipeline.

## What This Repository Is

This repo defines a coordinated agent system:

- Agent Smith is the governing coordinator.
- Specialist agents each own one domain.
- Each agent has a source pack that gives it factual context for its field.
- Agent Smith routes work, controls timing, and blocks unsafe changes.

## How The Agents Communicate

The communication path is intentionally narrow:

1. A task enters through Agent Smith.
2. Agent Smith identifies the real problem and the right specialist.
3. The specialist agent works from its source pack and MCP integration surface.
4. The specialist returns a proposed change, diagnosis, or verification result.
5. Agent Smith reviews the outcome, checks risk, and decides whether the work is ready.
6. If the change affects production, the human owner must approve it before release.

Agent Smith is the only coordinating layer. Specialists do not coordinate each other directly unless Agent Smith routes them into a shared task.

## Agent Roles

| Agent | Role |
| --- | --- |
| Agent Smith | Governing coordinator, planner, triage layer, release gatekeeper |
| Coder | Broad implementation agent for code, fixes, and repo changes |
| Frontend | UI, layout, component behavior, and client-side interaction |
| Backend | API contracts, server behavior, validation, and data flow |
| Supabase | Database, auth, policies, storage, and edge functions |
| Netlify | Site linkage, deploys, build context, and release management |
| DevOps | CI/CD, workflow hygiene, environment control, and release safety |
| QA | Regression control, browser verification, flake reduction, and test coverage |
| Security | Secrets, auth, transport, repo security, and app-layer defense |
| Accessibility | Semantic structure, keyboard support, contrast, and WCAG review |
| Prompt Engineering | Prompt design, structured outputs, tool use, and conversation state |
| Product Analytics | Instrumentation, funnels, cohorts, dashboards, and measurement quality |
| Technical Writing | Documentation structure, clarity, error text, and recovery guidance |

## Configuration Pipeline

The agent system is configured through the repository, then enforced through GitHub and the runtime surfaces:

1. `core/smith` defines Agent Smith behavior, approval boundaries, and coordinator knowledge.
2. `agents/*` contains the specialist workspaces and their attached source packs.
3. `apps/*` and `functions/*` hold the application and function surfaces that the agents work on.
4. `.github/workflows` enforces CI checks, review gates, and deployment controls.
5. `docs/CONFIGURATION_PIPELINE.md` documents the environment and secret requirements.
6. At runtime, Agent Smith reads the repo structure, assigns work, and blocks production-impacting changes until the owner approves them.

## Repository Layout

- `core/smith`: Agent Smith governance, planning, triage, and approval logic.
- `agents/*`: specialist agent workspaces.
- `apps/*`: application surfaces.
- `functions/*`: edge and serverless function config.
- `.github/workflows`: CI and approval gates.
- `docs/CONFIGURATION_PIPELINE.md`: setup notes for environments and secrets.

## Core Rule

Agents may propose and validate changes, but production-impacting changes require a human approval boundary.

Agent Smith blocks work that exposes secrets, bypasses approval, creates blank or placeholder outputs, increases confusion, or drifts away from PrompTED's outcome-completion doctrine.
