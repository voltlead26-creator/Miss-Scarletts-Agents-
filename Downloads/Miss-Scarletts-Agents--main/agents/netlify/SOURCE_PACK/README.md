# Netlify Source Pack

This pack is the local reference for the Netlify agent. It is structured as attached in-repo knowledge so deploy decisions can be made from concrete operating guidance instead of a short list of links.

## Pack map

- [00_Fundamentals.md](./00_Fundamentals.md)
- [01_Netlify_Platform_Model.md](./01_Netlify_Platform_Model.md)
- [02_Site_Linkage_And_Deploy_Targets.md](./02_Site_Linkage_And_Deploy_Targets.md)
- [03_Builds_And_Monorepos.md](./03_Builds_And_Monorepos.md)
- [04_Environment_Variables_And_Secrets.md](./04_Environment_Variables_And_Secrets.md)
- [05_Preview_Production_And_Contexts.md](./05_Preview_Production_And_Contexts.md)
- [06_CLI_And_NonInteractive_Deploys.md](./06_CLI_And_NonInteractive_Deploys.md)
- [07_GitHub_Integration_And_CI.md](./07_GitHub_Integration_And_CI.md)
- [08_Releases_And_Rollbacks.md](./08_Releases_And_Rollbacks.md)
- [09_Headers_Redirects_And_Routing.md](./09_Headers_Redirects_And_Routing.md)
- [10_Observability_And_Debugging.md](./10_Observability_And_Debugging.md)
- [11_Release_Safety_And_Change_Control.md](./11_Release_Safety_And_Change_Control.md)
- [12_Implementation_Playbook.md](./12_Implementation_Playbook.md)

## Role

The Netlify agent owns the deployment surface for the web app:

- site linkage and deploy targeting
- build settings and monorepo app selection
- environment variables and secrets
- preview, branch, and production deploy contexts
- non-interactive CLI deploys
- GitHub-based CI deploys
- rollbacks, headers, redirects, and routing behavior
- deploy troubleshooting and release safety

## Operating model

1. Identify the exact site and app before deploying.
2. Keep preview, branch, and production behavior separate.
3. Prefer non-interactive deploys in CI.
4. Treat environment scope as part of the configuration contract.
5. Verify the deploy target before assuming success.
6. Keep build output, runtime config, and secrets aligned.
7. Debug the deploy path before changing application code.

## What good looks like

- The correct site is targeted every time.
- Preview and production are distinct and intentional.
- CI deploys do not require manual prompts.
- Environment variables resolve the way the app expects.
- Rollbacks are possible without guesswork.
- Deploy failures explain themselves clearly.
