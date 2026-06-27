# Preview, Production, and Contexts

Netlify contexts let the same codebase behave differently by branch or deploy type. The agent should use that power intentionally.

## Core principles

- Preview and production are not interchangeable.
- Context-specific behavior should be explicit.
- Branch deploys need their own verification.
- The app should know when it is in a non-production context.

## Practical guidance

- Keep preview-only settings isolated.
- Verify production settings separately.
- Use the right context for the right deploy target.

## Common mistakes

- Assuming the preview build proves production behavior.
- Reusing the same environment settings everywhere.
- Forgetting that branch deploys may be intentionally different.
