# Supabase Implementation Playbook

Use this when turning a Supabase task into a concrete change.

1. Define the data model and access model first.
2. Decide whether the feature needs a table, policy, storage rule, or function.
3. Add or adjust the schema with the smallest safe migration.
4. Write or update the RLS rules.
5. Wire the app to the expected auth/session behavior.
6. Add tests or verification steps for the affected boundary.
7. Confirm local, staging, and production assumptions separately.
8. Release only after the behavior is clear under the intended role.

## Review questions

- Does the server enforce the rule or just the UI?
- Could a user bypass the feature through another route?
- Does the function or migration depend on hidden environment state?
- Is the change safe to retry?
- Can the deployment be verified cleanly?

## Output standard

- The platform rules are explicit.
- The access path is least-privileged.
- The deploy path is repeatable.
- The failure mode is understandable.
