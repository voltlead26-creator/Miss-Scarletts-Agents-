# Auth and Session Handling

Authentication establishes identity. Session handling keeps that identity available consistently across the app.

## Core principles

- Identify the user before applying access logic.
- Keep browser and server session behavior aligned.
- Distinguish anonymous, authenticated, and privileged states.
- Treat session tokens as sensitive data.

## Practical guidance

- Use the platform’s auth flow consistently rather than inventing parallel session logic.
- Handle expiration and refresh deliberately.
- Make sign-out clear and complete.
- Keep server-side reads and writes aligned with the current session context.

## Common mistakes

- Assuming auth state in the UI means the server will accept the request.
- Storing sensitive tokens in the wrong place.
- Mixing session state with business ownership rules.
- Forgetting to handle expired or missing sessions cleanly.
