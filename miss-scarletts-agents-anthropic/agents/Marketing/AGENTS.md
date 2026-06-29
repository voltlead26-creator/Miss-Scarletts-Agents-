# Marketing- Agent Guide

## Agent system

This repo uses two operating agents:

1. `agents/agent-smith.md` — **Agent SMITH**, the campaign controller and AI CMO orchestrator.
2. `agents/digital-marketing-agent.md` — the specialist digital marketing strategist and campaign producer.

Use Agent SMITH first when the task involves strategy, campaign planning, market positioning, channel planning, launch readiness, performance measurement or cross-functional marketing work.

Use the Digital Marketing Agent directly when the task is a specific marketing deliverable such as ad copy, email copy, landing page copy, campaign review or channel plan.

## Repository purpose

This repo is the AI CMO layer of an Autonomous Marketing Engine. Its core purpose is to turn business context into marketing strategy, campaign plans, brand-governed content and ROI reporting.

## Priorities

1. Australian market context first.
2. Australian consumer, privacy and electronic marketing rules first.
3. US market and compliance layer second.
4. Campaigns must be measurable, brand-aligned and revenue-aware.
5. Public-facing content must be checked before release.

## Default output structure

Every recommendation should include:

- objective,
- target audience,
- positioning,
- channel plan,
- content plan,
- measurement plan,
- compliance notes,
- assumptions,
- next actions.

## Verdicts

For campaign readiness or public-facing content, use:

- `PASS` — ready to proceed to normal human review,
- `REVISE` — usable after listed fixes,
- `BLOCK` — do not publish or launch until corrected.
