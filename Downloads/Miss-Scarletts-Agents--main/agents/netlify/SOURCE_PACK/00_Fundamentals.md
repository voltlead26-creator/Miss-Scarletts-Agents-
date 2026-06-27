# Netlify Fundamentals

Netlify work is about turning repository state into a controlled public deploy.

- Site linkage determines which deployed site a build belongs to.
- Build commands, base directories, and output directories must match the repository layout.
- Environment variables can influence both build-time behavior and runtime behavior, depending on how they are scoped.
- Deploy contexts such as production, preview, and branch builds are distinct and should not be treated as interchangeable.
- The Netlify CLI can manage deploys, local development, and environment variables.
- CI deploys should be non-interactive and should specify their target explicitly.

## Core facts to keep in mind

- A successful build is not useful if it points at the wrong site.
- Environment variable changes usually require a fresh build and deploy to take effect.
- Local `netlify dev` uses the CLI configuration and the selected context.
- Public browser variables are not the same thing as private secrets.

## Practical implications

- Always name the site explicitly in automation.
- Keep preview and production settings separate.
- Verify the publish path before the deploy step.
- Debug target selection and configuration before debugging application code.
- Treat secret handling as stricter than ordinary variables.
