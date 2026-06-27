# Release Safety and Change Control

Release safety is about reducing surprise. Netlify changes should be small, explicit, and easy to verify.

## Core principles

- Change one release variable at a time when possible.
- Keep the blast radius visible.
- Avoid surprise changes to build or runtime behavior.

## Practical guidance

- Review env changes before deploy.
- Verify deploys in the right context.
- Keep branch and production behaviors separate enough to reason about.

## Common mistakes

- Changing site linkage and build logic at the same time.
- Mixing config cleanup with release fixes.
- Forgetting to verify after the release lands.
