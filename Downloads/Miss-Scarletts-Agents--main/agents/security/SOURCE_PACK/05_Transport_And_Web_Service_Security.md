# Transport and Web Service Security

Transport security protects credentials and data in motion.

## Core facts

- HTTPS is the baseline for secure REST services.
- Secure transport protects credentials such as passwords, API keys, and tokens in transit.
- Web service security also includes request validation, rate limiting, and boundary checks.

## Practical guidance

- Require secure transport for sensitive workflows.
- Validate and normalize inbound data before trust decisions.
- Treat public APIs as attack surfaces.

## Common mistakes

- Sending sensitive data over insecure transport.
- Trusting inbound payloads without validation.
- Treating API design and security as separate concerns.
