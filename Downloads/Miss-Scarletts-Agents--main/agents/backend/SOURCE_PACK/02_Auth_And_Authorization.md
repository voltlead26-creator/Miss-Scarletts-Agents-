# Auth and Authorization

Authentication answers who the caller is. Authorization answers what that caller is allowed to do. Backend work fails when those are treated as the same problem.

## Core concepts

- Authenticate first.
- Authorize every privileged action.
- Use the server as the source of truth.
- Distinguish user identity, role, ownership, and scope.
- Do not let UI state decide access.

## Practical model

- Authentication confirms session or token validity.
- Authorization checks role, membership, ownership, status, and policy.
- Administrative access should be explicit, not inferred.
- Shared resources need a clear ownership and membership model.
- Sensitive actions should be auditable.

## Patterns

- Check auth at the boundary.
- Re-check authorization before the write.
- Use row-level controls where they fit the platform.
- Keep permission rules in one place when possible.
- Return a clear forbidden or unauthorized response when access fails.

## Common mistakes

- Trusting a client-side admin flag.
- Using one role for every privileged action.
- Forgetting that an authenticated user may still be blocked.
- Exposing data because the UI hid the button, not because the server denied access.

## Operational notes

- Access control should be testable.
- Membership changes should have immediate effect.
- Sensitive mutations should be logged.
