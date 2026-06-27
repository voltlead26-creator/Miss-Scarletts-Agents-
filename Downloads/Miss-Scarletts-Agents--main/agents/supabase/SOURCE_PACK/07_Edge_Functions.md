# Edge Functions

Edge functions handle server-side code that needs secrets, a trusted execution context, or a lightweight integration boundary.

## Core principles

- Keep functions small and explicit.
- Make inputs and outputs predictable.
- Treat retries and duplicate invocations as normal.
- Keep long-running orchestration separate when complexity grows.

## Good use cases

- Webhook processing
- Secure third-party API calls
- Server-side orchestration
- Lightweight data transforms
- Privileged maintenance actions

## Common mistakes

- Putting the whole backend into one function.
- Leaving a function dependent on hidden environment assumptions.
- Forgetting to make the function idempotent.
- Letting a function bypass the same access rules the rest of the app relies on.
