# Error Handling

Good error handling reduces confusion and helps recovery.

## What the agent should know

- Return actionable errors, not vague failures.
- Separate user-facing messages from internal diagnostics.
- Preserve enough context to debug the issue later.
- Distinguish validation failures from unexpected faults.
- Avoid swallowing errors unless there is a deliberate fallback path.

## Rules of thumb

- Fail early on invalid input.
- Normalize and classify errors before they leave the boundary.
- If the user can recover, tell them how.
- If the system needs a retry, make that explicit.
- If an error is internal, keep the diagnostic detail out of the user-facing surface.

## Common traps

- Returning raw exceptions to the browser.
- Collapsing validation, auth, and system failures into one generic message.
- Logging too little to debug a failure later.
- Logging too much and exposing sensitive data.
