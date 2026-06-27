# Threat Modeling and App-Layer Defense

Threat modeling is the habit of asking what can go wrong and which control actually stops it.

## Core facts

- A control is only useful if it protects the actual trust boundary.
- App-layer security depends on correct validation, authorization, and error handling.
- Defense in depth means one failure should not produce a full compromise.

## Practical guidance

- Identify assets, actors, trust boundaries, and abuse paths.
- Ask what happens if the client lies, the token is stolen, or a database is queried directly.
- Prefer controls at the server and data layer for privileged actions.

## Common mistakes

- Assuming the front end enforces security.
- Building one “security check” and skipping the rest.
- Failing to model the simplest abuse path.
