# Password and Credential Storage

Passwords and long-lived credentials need one-way protection and careful handling.

## Core facts

- Password storage should use modern one-way approaches designed for password hashing.
- Passwords must still be protected if the database is compromised.
- Password handling should not silently truncate valid passwords.
- Cryptographic storage guidance distinguishes hashing from encryption and key management.

## Practical guidance

- Use established password hashing algorithms and parameters appropriate to the system.
- Allow sufficiently long passwords and passphrases.
- Avoid reversible storage for passwords.

## Common mistakes

- Hashing without a proper password-focused algorithm.
- Truncating passwords silently.
- Confusing hashing, encryption, and encoding.
