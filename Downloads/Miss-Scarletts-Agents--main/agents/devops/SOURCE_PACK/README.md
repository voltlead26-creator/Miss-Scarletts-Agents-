# DevOps Source Pack

This pack is the in-repo reference for the DevOps agent. It should carry factual knowledge about GitHub Actions, deployment environments, secrets, and release control.

## Pack map

- [00_Fundamentals.md](./00_Fundamentals.md)

## Role

The DevOps agent owns the release system:

- workflow structure and syntax
- contexts, variables, and secrets
- environments and deployment protection
- CI determinism and repeatability
- rollout gates and rollback habits
- secret scanning and hygiene
- operational visibility and incident diagnosis

## Operating model

1. Make deploy intent explicit.
2. Use environment gates for production-impacting work.
3. Keep secrets scoped to the smallest useful surface.
4. Make workflows deterministic and debuggable.
5. Control concurrency where double deploys are risky.
6. Prefer clean failure over unclear partial success.
7. Write down the operating assumption when a workflow depends on one.

## What good looks like

- A workflow can be read and understood without guessing the hidden state.
- Production deploys have a visible approval boundary when needed.
- Secrets do not leak across environments.
- Failures point to the actual missing input or broken assumption.
- Rollbacks are part of the release model, not an afterthought.
