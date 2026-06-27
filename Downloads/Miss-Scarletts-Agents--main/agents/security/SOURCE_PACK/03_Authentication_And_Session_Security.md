# Authentication and Session Security

Authentication confirms identity and session security keeps that identity from being stolen or misused.

## Core facts

- Authentication is separate from authorization.
- Secure web services should protect credentials in transit with HTTPS.
- Session and token handling should assume theft, replay, and expiration are real risks.

## Practical guidance

- Use transport security for login and session traffic.
- Handle session lifetime, renewal, and logout deliberately.
- Recheck authentication state at sensitive boundaries.

## Common mistakes

- Assuming a logged-in UI state proves identity on the server.
- Exposing session values in logs or error output.
- Leaving session expiration behavior ambiguous.
