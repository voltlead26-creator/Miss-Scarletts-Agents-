# Netlify Platform Model

Netlify is a deploy and delivery platform. The agent should understand its role as the layer that turns repository state into public web delivery.

## Core principles

- Source code and deploy output are related but not identical.
- Site linkage is a configuration decision, not a convenience detail.
- Build-time and runtime concerns are different.
- Deploy contexts are part of the release model.

## Practical model

- The repo triggers a build.
- The build produces a deploy artifact.
- The site record defines where that artifact goes.
- Environment variables shape build and runtime behavior.

## Common mistakes

- Treating the wrong site as “close enough.”
- Assuming a preview deploy behaves like production without checking contexts.
- Forgetting that monorepo root selection affects build output.
