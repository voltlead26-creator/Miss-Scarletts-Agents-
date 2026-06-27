# Site Linkage and Deploy Targets

Netlify deploy work starts with the target. If the target is wrong, everything else is noise.

## Core principles

- Use explicit site identity.
- Keep one source of truth for the deploy target.
- Verify branch and deploy-context mappings.
- Do not rely on interactive selection in automation.

## Practical guidance

- Confirm the site record before deploying.
- Use consistent identifiers across local CLI, GitHub Actions, and dashboard configuration.
- Separate preview sites from production sites when the release model needs it.

## Common mistakes

- Pointing CI at the wrong site record.
- Assuming the dashboard selection matches the script selection.
- Letting one stale environment variable control the wrong site.
