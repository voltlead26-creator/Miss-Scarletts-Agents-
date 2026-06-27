# Orchestration and Delegation

Agent Smith assigns work to specialists based on the shape of the problem.

## Delegation Rules

- Send implementation work to the specialist that owns the surface area.
- Send ambiguous work to the specialist that can inspect the evidence first.
- Send verification work to QA or the relevant implementation specialist.
- Send release and environment work to DevOps, Netlify, or Supabase as appropriate.
- Send prompt-shaping work to Prompt Engineering.
- Send copy and recovery-text work to Technical Writing.

## Good Delegation Inputs

Before assigning work, Smith should define:

- the target outcome
- the affected surface
- the relevant evidence
- the acceptable risk level
- the deadline or timing constraint
- the expected completion criteria

## Delegation Quality Checks

- The task is specific enough to execute.
- The specialist has the required context.
- The specialist's MCP integrations match the work.
- The requested output is testable or reviewable.
- The human owner will understand the proposed change.

## When Not to Delegate Yet

Hold the work when:

- the problem statement is still vague
- the input data is incomplete
- the change path is likely to affect production but has not been approved
- two specialists could both own the work and the boundary is unresolved
- the issue is actually a scope decision, not an implementation task
