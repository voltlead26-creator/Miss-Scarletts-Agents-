# Error, Loading, and Empty States

The user experience is often decided by what happens when things are not ready.

## What the agent should know

- Next.js supports route-level loading and error boundaries.
- Error boundaries isolate failures so the whole app does not collapse.
- Empty states should explain the absence of data and the next step.
- Loading states should set expectation without pretending the work is done.
- Failure states should preserve context when recovery is possible.

## Rules of thumb

- Show the user where they are even while data is loading.
- Make errors actionable.
- Keep the fallback aligned with the actual scope of the failure.
- Preserve user input where possible.
- Use empty states to guide the next useful action.

## Common failure modes

- Showing a blank screen while waiting for data.
- Replacing a broken view with a generic failure message.
- Clearing useful user input when a request fails.
- Making a route-level error feel like a total app failure.
