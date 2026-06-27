# Frontend Fundamentals

Frontend work in this repository depends on a few concrete facts:

- React components are the basic unit of UI composition. Props flow down, events flow up, and local state should stay as small as possible.
- In the Next.js App Router, the `app/` directory defines routes through folders, and route handlers use the standard Web Request and Response APIs.
- Server Components render on the server by default. Client Components are opt-in and are used for browser interactivity, local state, and client-only hooks.
- Form validation improves user experience, but server-side validation still decides what is trusted.
- Semantic HTML is the base layer for accessibility. Buttons, labels, headings, lists, and landmarks carry meaning that custom divs do not.
- Responsiveness is not decoration. Layout, spacing, and content density must work at mobile and desktop sizes.
- Frontend performance is usually influenced by bundle size, rerender frequency, client/server boundaries, and the amount of work pushed into the browser.

## Core facts to keep in mind

- Route handlers belong in the `app/` directory and are appropriate for request/response logic.
- `revalidatePath` runs on the server, not in Client Components.
- Controlled inputs keep the source of truth in React state; uncontrolled inputs leave value ownership mostly to the browser.
- Loading, empty, and error states are part of the product, not fallback decoration.
- Keyboard focus, visible labels, and predictable tab order are required for usable interfaces.

## Practical implications

- Use client components only when interaction requires them.
- Keep browser state and server truth aligned.
- Prefer semantic markup before custom behavior.
- Verify mobile, desktop, and keyboard flows.
- Avoid duplicate sources of truth for the same UI state.
