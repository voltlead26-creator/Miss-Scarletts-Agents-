# Environment and Secrets

Environment design is part of Supabase operations. Configuration mistakes often look like application bugs.

## Core principles

- Separate local, staging, and production settings.
- Treat secrets as secrets.
- Prefer explicit environment naming.
- Keep deploy-time assumptions visible.

## Secret hygiene

- Never expose privileged keys in browser code.
- Use the least-privileged token possible for the task.
- Do not rely on hidden local state for deploys.
- Document which environment owns which secret.

## Common mistakes

- Mixing preview and production credentials.
- Storing service-role credentials in places they can leak.
- Assuming one environment behaves exactly like another.
