# Observability and Debugging

Supabase issues are often boundary issues: auth, policy, schema, deployment, or environment mismatch. Good debugging isolates the layer first.

## Core principles

- Identify the failing layer before changing code.
- Preserve request and event context.
- Make failures easy to correlate across logs and environments.
- Distinguish auth failure from policy failure from schema failure.

## Debugging checklist

- Confirm environment variables and project references.
- Confirm the schema matches the code.
- Confirm policy behavior under the actual user role.
- Confirm function deployment status.
- Confirm the request path is hitting the expected project or branch.

## Common mistakes

- Changing application code before checking the platform state.
- Assuming a 401, 403, or 500 all mean the same thing.
- Forgetting that deploy and runtime problems can look identical from the UI.
