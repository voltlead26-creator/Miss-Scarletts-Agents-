# Error Handling and Observability

Good backend systems fail in ways that can be understood, traced, and recovered.

## Core principles

- Return stable error shapes.
- Differentiate user errors from system failures.
- Preserve debugging context internally.
- Log the right information without leaking secrets.
- Treat observability as part of the feature, not a polish task.

## Error behavior

- Validation failures should be actionable.
- Authorization failures should be clear.
- Downstream failures should not masquerade as success.
- Unexpected exceptions should be captured and surfaced safely.

## Observability checklist

- Request identifiers
- Correlation identifiers
- Structured logs
- Error grouping
- Latency tracking
- External dependency status

## Common mistakes

- Returning raw stack traces to callers.
- Logging too little to diagnose the failure.
- Logging sensitive data.
- Hiding the root cause behind a generic message.

## Operational notes

- If you cannot measure it, you cannot operate it well.
- The user needs a recoverable response.
- The engineer needs enough internal detail to fix the issue quickly.
