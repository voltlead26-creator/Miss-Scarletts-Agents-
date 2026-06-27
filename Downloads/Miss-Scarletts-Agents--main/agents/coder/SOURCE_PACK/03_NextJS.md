# Next.js App Router

The App Router changes how the app should be structured.

## What the agent should know

- The `app` directory is file-system routed.
- Server Components are the default unless a file uses `"use client"`.
- Layouts persist across route transitions.
- Loading and error boundaries are first-class route concerns.
- Route handlers replace most `pages/api` use cases in this architecture.
- Metadata belongs in the route tree rather than improvised in the UI.

## Route and server boundaries

- Keep data fetching near the route or server boundary when possible.
- Use client components only when interaction or browser APIs require them.
- Treat route handlers as API contracts, not just helper functions.
- Keep client components free of server-only imports.
- Avoid moving server concerns into the browser unless there is a strong reason.

## Common traps

- Marking a large subtree as client-only when only one child needs interactivity.
- Putting fetch logic in the wrong layer and creating hydration surprises.
- Mixing route handlers and UI code so the contract becomes unclear.
- Ignoring loading, error, and empty states.

## Practical signals to watch

- If a page needs auth, data, and layout changes, decide which layer owns each concern before coding.
- If a route becomes hard to test, the boundary is usually too wide.
- If a client component only exists to pass data through, the data likely belongs higher up.
