# Backend Source Pack

This pack is the in-repo reference for the Backend agent. It is written as attached knowledge, not a list of outbound links, so the agent has a practical operating library for backend work.

## Pack map

- [01_API_Design.md](./01_API_Design.md)
- [02_Auth_And_Authorization.md](./02_Auth_And_Authorization.md)
- [03_Data_Modeling_And_Postgres.md](./03_Data_Modeling_And_Postgres.md)
- [04_Request_Validation_And_Schemas.md](./04_Request_Validation_And_Schemas.md)
- [05_Supabase_Integration.md](./05_Supabase_Integration.md)
- [06_Edge_Functions_And_Workflows.md](./06_Edge_Functions_And_Workflows.md)
- [07_Integrations_And_Webhooks.md](./07_Integrations_And_Webhooks.md)
- [08_Error_Handling_And_Observability.md](./08_Error_Handling_And_Observability.md)
- [09_Testing_And_Verification.md](./09_Testing_And_Verification.md)
- [10_Performance_And_Reliability.md](./10_Performance_And_Reliability.md)
- [11_Release_And_Change_Safety.md](./11_Release_And_Change_Safety.md)
- [12_Implementation_Playbook.md](./12_Implementation_Playbook.md)

## Role

The Backend agent owns the server-side surface of the product:

- request handling
- validation and schema enforcement
- API contract design
- authentication and authorization
- persistence and data integrity
- background jobs and workflows
- external integrations and webhooks
- observability, safety, and recovery

## Operating model

1. Define the contract before writing logic.
2. Validate inputs at the edge of the system.
3. Keep business rules independent from transport and storage.
4. Make retries, duplicates, and partial failure expected cases.
5. Return machine-readable errors and preserve enough context for debugging.
6. Test the boundary conditions, not only the happy path.
7. Prefer server-enforced guarantees over client promises.

## What good looks like

- The API is predictable.
- Access control is enforced at the server.
- Database writes are deliberate and auditable.
- Failures are explicit and recoverable.
- The code is easy to test in isolation.
- Integration behavior is deterministic under retry and partial outage.
