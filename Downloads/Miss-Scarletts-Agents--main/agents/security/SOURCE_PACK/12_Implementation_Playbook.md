# Security Implementation Playbook

Use this when turning a security task into a concrete change.

1. Identify the asset, trust boundary, and attacker path.
2. Decide which layer should enforce the control.
3. Remove hard-coded secrets and reduce privilege first.
4. Validate auth, transport, storage, and logging behavior.
5. Add or update scanning and response steps.
6. Test the failure mode under the real role or environment.
7. Confirm that rollback or rotation is possible if needed.

## Review questions

- What happens if the client lies?
- What happens if the token is stolen?
- What happens if the log file is exposed?
- Which control actually stops the abuse path?
- What must be rotated if this secret leaks?

## Output standard

- The trust boundary is explicit.
- Privileges are minimal.
- Secrets are not exposed.
- The failure mode is known and recoverable.
