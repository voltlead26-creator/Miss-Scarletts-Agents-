# Environment Variables and Secrets

Environment variables are part of the contract between the app, the build, and the deployment platform.

## Core principles

- Separate build-time and runtime needs.
- Scope variables deliberately.
- Treat secrets differently from public configuration.
- Make production and preview values explicit.

## Practical guidance

- Keep public client-exposed variables separate from private values.
- Verify the right values are present in the right deploy context.
- Assume secret values cannot be read back casually later.

## Common mistakes

- Mixing preview and production values.
- Treating browser-visible values as secrets.
- Assuming a variable added in the dashboard is active everywhere.
