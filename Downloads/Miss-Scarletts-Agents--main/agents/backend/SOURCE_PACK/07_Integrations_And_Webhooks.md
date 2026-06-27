# Integrations and Webhooks

Third-party integrations are failure-prone by default. Backend code must assume duplicate delivery, partial outages, and malformed payloads.

## Core principles

- Verify source authenticity where possible.
- Treat webhooks as at-least-once delivery.
- Make handlers idempotent.
- Separate ingestion from downstream processing when needed.
- Record enough metadata to replay or diagnose events.

## Processing model

- Receive and validate the payload.
- Confirm the event is relevant.
- Deduplicate using a stable key.
- Persist the raw event or a normalized record.
- Execute the business action.
- Track success, retry, and failure states.

## Common mistakes

- Calling downstream systems before verifying the event.
- Assuming provider payloads will always be complete.
- Writing non-idempotent handlers.
- Letting one failed integration block unrelated work.

## Operational notes

- Integration code should be observable.
- Retries should be bounded and intentional.
- Dead-letter handling matters.
