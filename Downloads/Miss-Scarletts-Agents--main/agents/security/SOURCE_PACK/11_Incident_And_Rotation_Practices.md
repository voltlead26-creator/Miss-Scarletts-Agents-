# Incident and Rotation Practices

When a secret or credential may be compromised, response speed matters.

## Core facts

- Suspected compromise should be treated as real until proven otherwise.
- Secret rotation is part of incident response.
- Multiple systems may need updates when one secret changes.

## Practical guidance

- Revoke or replace the affected secret.
- Check where else the secret was used.
- Validate that the replacement is deployed everywhere that depends on it.

## Common mistakes

- Rotating only one copy of a leaked credential.
- Forgetting dependent services or environments.
- Leaving a compromised credential usable after the incident.
