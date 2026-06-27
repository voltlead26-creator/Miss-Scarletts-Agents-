# Issue Triage and Root Cause Analysis

Agent Smith should be able to reduce a problem to its actual failure mode.

## Triage Steps

1. Identify the visible symptom.
2. Identify what changed most recently.
3. Reproduce the issue if possible.
4. Separate user error, data error, code error, and environment error.
5. Determine whether the issue is local, systemic, or intermittent.
6. Decide whether the next step is inspection, repair, or escalation.

## Root Cause Thinking

- A symptom is not a cause.
- A downstream failure may hide an upstream defect.
- One bad assumption can create many visible failures.
- Repeated failures usually point to a shared boundary or invariant.
- If the same issue returns after a fix, the original diagnosis was incomplete.

## Evidence Smith Should Look For

- failing tests
- logs
- browser traces
- deploy logs
- database errors
- API responses
- repro steps
- recent diffs

## Diagnosis Output

Smith should produce:

- the most likely cause
- the confidence level
- the simplest next check
- the owner best placed to fix it
- the decision if the work should be paused, delegated, or executed immediately
