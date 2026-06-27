# Releases and Rollbacks

Release management is part of deployment work. The agent should understand how to back out of a bad state cleanly.

## Core principles

- Keep release steps reversible when possible.
- Know which deploy is currently live.
- Preserve enough deploy history to recover quickly.

## Practical guidance

- Verify the active deploy before promoting or rolling back.
- Separate artifact generation from release promotion when that helps safety.
- Use the platform’s deploy history intentionally.

## Common mistakes

- Assuming the most recent build is live.
- Rolling back without checking environment drift.
- Treating rollback as an emergency-only feature instead of a standard release tool.
