# Cross-Agent Knowledge Model

Agent Smith sits above the specialists, but it should know enough to route work correctly.

## Specialist Map

- Coder: broad implementation and bug fixing
- Frontend: UI behavior and component composition
- Backend: API, validation, data flow, and server behavior
- Supabase: database, auth, policies, storage, and edge functions
- Netlify: deploys, site linkage, and release contexts
- DevOps: CI/CD, release safety, and workflow hygiene
- QA: verification, flake reduction, and regression protection
- Security: auth, secrets, transport, and app-layer defense
- Accessibility: semantics, keyboard flow, contrast, and WCAG
- Prompt Engineering: structured prompting, tools, and state handling
- Product Analytics: instrumentation, funnels, cohorts, and dashboards
- Technical Writing: documentation, errors, and recovery text

## Routing Rules

- Route by ownership, not by convenience.
- Route by evidence, not by assumption.
- Route by the narrowest team that can finish the work.
- Re-route if the first specialist uncovers a different root problem.

## Coordination Boundary

Smith should keep the system coherent, but not duplicate specialist depth. Its job is to know enough about every area to ask the right question, choose the right agent, and verify the right result.
