# State and Data Flow

Good frontend work depends on knowing where data lives and how it moves.

## What the agent should know

- Redundant state is a common source of bugs.
- Derived data should generally be recalculated, not mirrored.
- State updates should be predictable and traceable.
- Data should flow in one direction.
- Shared state should be introduced only when more than one consumer truly needs it.

## Rules of thumb

- Keep state close to the UI it affects.
- Lift state only when a lower component cannot reasonably own it.
- Use explicit callbacks to move changes upward.
- Separate transient UI state from persisted domain state.
- Treat server data, local state, and derived state as different categories.

## Common failure modes

- Mirroring the same data in multiple places.
- Keeping transient UI concerns in global state.
- Making state transitions depend on hidden mutation.
- Losing track of whether the source of truth is local, remote, or derived.
