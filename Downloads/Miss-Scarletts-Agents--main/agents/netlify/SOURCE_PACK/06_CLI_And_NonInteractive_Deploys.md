# CLI and Non-Interactive Deploys

Automation should not depend on prompts or local state. The Netlify CLI path needs to be deterministic.

## Core principles

- Non-interactive commands should fully specify their target.
- CI should not wait for a manual site picker.
- Local CLI state should not be required for a deploy to succeed.

## Practical guidance

- Pass the exact site or project identity in automation.
- Keep deploy scripts repeatable from a clean environment.
- Prefer command shapes that expose failure quickly.

## Common mistakes

- Depending on a remembered local login state.
- Hiding target selection behind prompts.
- Treating a CLI success message as proof the correct site was deployed.
