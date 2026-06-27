# Edge Functions and Workflows

Edge functions and background workflows are useful when the system needs isolated execution, external calls, or controlled side effects.

## Core principles

- Keep function entry points small.
- Make side effects deliberate.
- Design for retries and re-entry.
- Separate orchestration from business logic when it grows.

## Good use cases

- Webhook receivers
- Scheduled tasks
- External API adapters
- Lightweight orchestration
- Notification dispatch
- Data sync and reconciliation

## Workflow discipline

- Persist progress when work spans multiple steps.
- Track correlation identifiers across steps.
- Treat transient errors differently from permanent ones.
- Do not assume a function runs only once.

## Common failure modes

- Packing an entire business process into one handler.
- Hiding a workflow state machine inside ad hoc conditionals.
- Losing track of the original request context.
- Failing silently after a retryable external error.
