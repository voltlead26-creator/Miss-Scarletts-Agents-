# Netlify Implementation Playbook

Use this when turning a Netlify task into a release change.

1. Identify the exact site and deployment context.
2. Confirm the app root, build command, and output path.
3. Set environment variables in the correct scope.
4. Decide whether the change belongs in preview, production, or both.
5. Make CI non-interactive and explicit.
6. Verify the live result after deploy.
7. Document the target and any release assumptions that changed.

## Review questions

- Is the target site explicit?
- Does the deploy path work without prompts?
- Are preview and production values separated?
- Can the release be rolled back cleanly?
- Does the build output match the app being served?

## Output standard

- The deploy target is obvious.
- The build is reproducible.
- The environment configuration is scoped correctly.
- The release behavior is predictable.
