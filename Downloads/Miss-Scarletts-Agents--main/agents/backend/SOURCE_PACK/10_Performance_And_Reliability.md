# Performance and Reliability

Backend performance is about throughput, latency, and predictable degradation.

## Core principles

- Make common paths cheap.
- Avoid unnecessary synchronous work.
- Cache deliberately, not accidentally.
- Bound external calls.
- Prefer graceful degradation over total failure.

## Reliability guidance

- Retries must be safe.
- Timeouts should exist everywhere an external dependency is involved.
- Work that can be deferred should be deferred.
- Hot paths should not depend on expensive fan-out.

## Common failure modes

- Querying more than needed.
- Recomputing data on every request.
- Waiting synchronously for tasks that can be queued.
- Letting one slow dependency dominate the entire request.
