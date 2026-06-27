# Secrets Management

Secrets management is about controlling where secrets live, who can access them, how they are rotated, and how they are audited.

## Core facts

- OWASP recommends centralizing secret storage, provisioning, auditing, and rotation.
- Shared secrets increase blast radius because one leak can expose multiple systems.
- Secrets should not be committed to source control.

## Practical guidance

- Use the smallest access scope that can still function.
- Rotate secrets when compromise is suspected or when a secret is no longer needed.
- Keep secrets separate from the code that uses them.

## Common mistakes

- Putting secrets in source, docs, logs, or build artifacts.
- Reusing one secret across unrelated systems.
- Treating secret scanning as the only control.
