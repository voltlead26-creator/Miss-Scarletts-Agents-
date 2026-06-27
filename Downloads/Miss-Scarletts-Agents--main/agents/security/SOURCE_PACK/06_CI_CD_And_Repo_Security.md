# CI/CD and Repository Security

The pipeline and repository are part of the attack surface.

## Core facts

- GitHub secret scanning helps detect exposed secrets.
- Push protection can block secrets before they reach the repository.
- CI/CD pipelines are an attractive target and need their own security controls.

## Practical guidance

- Review workflow permissions, secrets, and environment scopes.
- Keep deploy jobs separated from untrusted jobs where possible.
- Treat build artifacts and logs as potential exposure points.

## Common mistakes

- Giving workflows more permission than they need.
- Relying on secret scanning after a leak rather than preventing the leak.
- Allowing untrusted code to reach privileged pipeline steps.
