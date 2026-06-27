# Security Fundamentals

Security work is about reducing the chance that an attacker, mistake, or leak can turn into a compromise.

- OWASP Cheat Sheet Series collects high-value application security guidance in a concise format.
- Secrets should be centralized, provisioned, audited, and rotated rather than spread across code and docs.
- Password storage must use one-way protection; passwords should remain protected even if the application or database is compromised.
- GitHub secret scanning detects exposed credentials, and push protection can block secrets before they land in the repository.
- Authentication, authorization, transport, and storage are different controls and must be reviewed separately.
- RLS and storage policies are part of the security model when the app is backed by Supabase.

## Core facts to keep in mind

- Hard-coded secrets are a security defect.
- Logging can leak secrets even when the app code is otherwise careful.
- The least privileged control that can enforce the rule is usually the right one.
- A single control layer is not enough if another layer still allows the same bad action.

## Practical implications

- Keep the threat boundary explicit.
- Review repository, pipeline, application, and data-layer controls together.
- Prefer minimal privileges and defense in depth.
- Assume exposed secrets must be treated as compromised until rotated.
