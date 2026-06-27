# Builds and Monorepos

Monorepo deploys fail when the build command, base directory, and output directory are not aligned.

## Core principles

- Choose the app root deliberately.
- Keep build commands and package manager commands consistent.
- Make the output path match the actual app artifact.
- Avoid hidden assumptions about workspace layout.

## Practical guidance

- Define the exact app being deployed.
- Keep install, build, and publish steps reproducible.
- Make the build environment match the expected runtime assumptions.

## Common mistakes

- Building the wrong package in the workspace.
- Letting local success hide a wrong output path.
- Depending on implicit workspace state.
