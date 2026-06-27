# DevOps Fundamentals

DevOps work in this repository is about turning code into a controlled release process.

- A GitHub Actions workflow is a YAML-defined automated process made up of one or more jobs.
- Contexts expose information about the workflow run, variables, jobs, steps, and runner.
- Environments can hold secrets, variables, branch restrictions, reviewers, and deployment protection rules.
- Secrets must be explicitly referenced in workflows and should be scoped as narrowly as possible.
- CI should produce the same result for the same inputs.
- Production jobs deserve more control than ordinary test jobs.

## Core facts to keep in mind

- Environments are appropriate for targets like production, staging, or development.
- Deployment protection rules can require approval, branch restrictions, or custom checks.
- The `GITHUB_TOKEN` is available to workflows and should be given only the permissions needed.
- Secret scanning is a safety net, not a substitute for not committing secrets.

## Practical implications

- Use environments to distinguish release targets.
- Keep deploy logic explicit about secrets and permissions.
- Make the workflow explain its failure instead of hiding it.
- Avoid mixing validation, packaging, and deploy into one opaque step when it harms clarity.
