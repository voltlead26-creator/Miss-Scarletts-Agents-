# Backend Fundamentals

Backend work in this repository depends on a few concrete facts:

- HTTP methods carry meaning. `GET` is retrieval, `POST` is for non-idempotent creation or actions, `PUT` and `PATCH` are for updates, and `DELETE` removes resources.
- Next.js App Router route handlers live in the `app/` directory and use the standard Web Request and Response APIs.
- Authentication identifies the caller. Authorization decides what that caller may do.
- Idempotency matters because retries, duplicate webhooks, and flaky networks are normal.
- Database constraints are part of application behavior, not optional implementation detail.
- Request boundaries should validate, authorize, and normalize before business logic mutates data.

## Core facts to keep in mind

- Server code is the trust boundary.
- Client-side checks are useful for UX but do not secure privileged operations.
- Read and write paths may need different policy checks.
- Data models that allow contradictions will eventually produce contradictions.
- Observability is part of correctness because failures must be diagnosable.

## Practical implications

- Keep transport, validation, and persistence separate.
- Make side effects explicit.
- Treat partial failure as normal.
- Test the boundary conditions, not only the happy path.
- Prefer server-enforced guarantees over UI promises.
