# Configuration Pipeline

This pipeline gives Miss Scarletts Agents a controlled path for agent-created changes.

## Workflows

- `.github/workflows/ci.yml` validates the pnpm workspace on pushes and pull requests to `main`.
- `.github/workflows/agent-smith-gate.yml` adds an Agent Smith review reminder and requires the `Production_Owner_Approval` GitHub Environment before production-impacting changes proceed.

## Required GitHub Environment

Create a GitHub Environment named:

`Production_Owner_Approval`

Then add the human owner as the required reviewer.

## Required Secrets

Add only the secrets that are needed for the active deployment surface:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Do not commit real secrets to the repository.

## Agent Smith Rules

Agent Smith blocks changes that:

- expose secrets
- bypass human approval
- create blank or placeholder documents
- make PrompTED harder for non-technical users
- drift away from outcome completion
