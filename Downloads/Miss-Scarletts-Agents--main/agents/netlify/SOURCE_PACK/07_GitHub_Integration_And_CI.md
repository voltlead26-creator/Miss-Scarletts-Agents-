# GitHub Integration and CI

GitHub-driven deploys should be aligned with the platform configuration so the branch flow is predictable.

## Core principles

- The repository should trigger the correct deploy path.
- CI should make the target clear in the workflow.
- Branch filtering should match the release strategy.
- Build steps should not depend on human intervention.

## Practical guidance

- Keep workflow triggers narrow and intentional.
- Make the release branch explicit.
- Use environment-scoped secrets where appropriate.

## Common mistakes

- Letting multiple workflows compete for the same site.
- Deploying from the wrong branch.
- Assuming the GitHub integration and CLI use identical defaults.
