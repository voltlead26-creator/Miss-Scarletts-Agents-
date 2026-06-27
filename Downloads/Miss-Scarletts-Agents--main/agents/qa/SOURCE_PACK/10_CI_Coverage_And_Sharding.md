# CI Coverage and Sharding

QA work has to run in CI as well as locally, and larger suites need a way to scale.

## Core facts

- Playwright tests can run across multiple browsers using projects.
- Sharding can split test work across jobs to speed up CI.
- Reports, traces, and retries are useful in CI because failures often need post-run analysis.

## Practical guidance

- Keep CI and local behavior as close as practical.
- Split setup and execution when it helps diagnostics.
- Use parallelism intentionally so the suite stays fast enough to trust.

## Common mistakes

- Allowing CI to drift from local behavior.
- Hiding setup failures inside a large job.
- Overusing retries until the suite becomes uninformative.
