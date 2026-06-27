# Miss Scarletts Agents

Governance agents and specialty sub-agents for PrompTED-aligned build work.

This repository now includes an Agent Smith governed configuration pipeline.

## Structure

- `core/smith`: Agent Smith governance, human approval, and secret validation.
- `agents/*`: specialist agent workspaces.
- `apps/*`: application surfaces.
- `functions/*`: edge and serverless function config.
- `.github/workflows`: CI and approval gates.
- `docs/CONFIGURATION_PIPELINE.md`: setup notes for environments and secrets.

## Core Rule

Agents may propose and validate changes, but production-impacting changes require a human approval boundary.

Agent Smith blocks work that exposes secrets, bypasses approval, creates blank or placeholder outputs, increases confusion, or drifts away from PrompTED's outcome-completion doctrine.
