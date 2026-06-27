# Observability and Debugging

Deploy problems usually live in one of a few places: target selection, build input, environment scope, or runtime configuration.

## Core principles

- Confirm the target first.
- Inspect the build log before changing code.
- Distinguish build failure from runtime failure.
- Trace configuration before tracing application logic.

## Debugging checklist

- Confirm the correct site ID or project ID.
- Confirm the right branch is deploying.
- Confirm the build command and output path.
- Confirm the correct environment variables are available.
- Confirm the runtime and preview contexts are what you expected.

## Common mistakes

- Fixing the app when the deploy target is wrong.
- Treating an auth or permissions error as a build error.
- Ignoring deploy context differences.
