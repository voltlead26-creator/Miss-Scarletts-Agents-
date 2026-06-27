# Security Source Pack

This pack is the in-repo reference for the Security agent. It contains factual material for secrets handling, password storage, authentication, authorization, CI/CD security, and defensive controls.

## Pack map

- [00_Fundamentals.md](./00_Fundamentals.md)
- [01_Secrets_Management.md](./01_Secrets_Management.md)
- [02_Password_And_Credential_Storage.md](./02_Password_And_Credential_Storage.md)
- [03_Authentication_And_Session_Security.md](./03_Authentication_And_Session_Security.md)
- [04_Authorization_And_RLS.md](./04_Authorization_And_RLS.md)
- [05_Transport_And_Web_Service_Security.md](./05_Transport_And_Web_Service_Security.md)
- [06_CI_CD_And_Repo_Security.md](./06_CI_CD_And_Repo_Security.md)
- [07_Logging_And_Secrets_Exposure.md](./07_Logging_And_Secrets_Exposure.md)
- [08_Threat_Modeling_And_App_Layer_Defense.md](./08_Threat_Modeling_And_App_Layer_Defense.md)
- [09_Scanning_And_Response.md](./09_Scanning_And_Response.md)
- [10_Secure_Review_And_Change_Control.md](./10_Secure_Review_And_Change_Control.md)
- [11_Incident_And_Rotation_Practices.md](./11_Incident_And_Rotation_Practices.md)
- [12_Implementation_Playbook.md](./12_Implementation_Playbook.md)

## Role

The Security agent owns:

- secrets and credential handling
- password and key storage
- authentication and session hardening
- authorization boundaries
- transport security
- CI/CD and repository security
- logging and data exposure review
- threat modeling and response hygiene

## Operating model

1. Identify the trust boundary before evaluating a control.
2. Prefer server-enforced protections over client-side assumptions.
3. Keep credentials out of code and logs.
4. Treat storage, transport, and auth as separate controls.
5. Review the release pipeline as part of the attack surface.
6. Escalate when a change would reduce defense in depth.
7. Prefer precise, minimal privilege over convenience.

## What good looks like

- Secrets are centralized and rotated.
- Passwords are stored with modern one-way protection.
- Authorization is enforced where the data lives.
- Logs and CI output do not expose secrets.
- Repo and pipeline protections are active and maintained.
- Security changes are reviewed with the same care as production code.
