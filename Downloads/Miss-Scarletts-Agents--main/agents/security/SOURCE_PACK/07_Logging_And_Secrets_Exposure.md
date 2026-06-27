# Logging and Secrets Exposure

Logs are useful only if they help diagnose problems without leaking sensitive data.

## Core facts

- Logs should help debug without becoming a secret dump.
- Error handling guidance in secure code review includes avoiding information disclosure.
- CI output can leak the same secrets that application logs can.

## Practical guidance

- Redact tokens, keys, passwords, and session values.
- Keep error messages specific enough to help support but not so specific that they disclose internals.
- Review logs and build output as if an attacker could read them.

## Common mistakes

- Printing whole request bodies or headers to logs.
- Mixing debug and production logging behavior.
- Exposing stack traces or internal paths to users.
