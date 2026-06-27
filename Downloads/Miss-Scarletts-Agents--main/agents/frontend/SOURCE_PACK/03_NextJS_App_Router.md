# Next.js App Router

This agent should understand the application structure imposed by the App Router.

## What the agent should know

- The `app` directory is file-system routed.
- Server Components are the default unless a file uses `"use client"`.
- Route layouts persist across transitions.
- Loading and error boundaries are first-class route concerns.
- Route handlers are the main API mechanism in the App Router world.
- Metadata belongs in the route tree.

## Rules of thumb

- Keep data fetching near the route or server boundary when possible.
- Use client components only when interactivity or browser APIs require them.
- Keep server-only logic away from the browser bundle.
- Treat route handlers as API contracts, not helper scripts.
- Think about route-level loading, empty, and error states before implementing the happy path.

## Common failure modes

- Marking too much of the tree as client-only.
- Putting fetch logic in the wrong layer and making hydration harder to reason about.
- Mixing route code and presentation code until the boundary disappears.
- Forgetting to define fallback states for streaming or delayed data.
