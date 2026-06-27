# React

React components should be predictable and boring in the good sense.

## What the agent should know

- Components are functions of props and state.
- Hooks connect function components to state, effects, memoization, refs, and context.
- Effects synchronize with external systems; they are not general-purpose data transformers.
- State should live as low as practical, but high enough to serve the shared workflow.
- Derived values should usually be computed, not stored.
- Memoization is a performance tool, not a default pattern.

## Rules of thumb

- Keep render logic pure.
- Use `useEffect` for synchronization, not business logic that can be calculated directly.
- Use `useMemo` only when there is a proven reason to cache computation.
- Use controlled inputs for forms that drive application state.
- Split components when they carry unrelated concerns.
- Prefer semantic HTML before custom interactive behavior.

## Common traps

- Duplicating state that can be derived.
- Using effects to copy props into state without a true synchronization need.
- Making one component too large to reason about.
- Hiding user-visible behavior inside callbacks with too many responsibilities.

## Practical signals to watch

- If a component has too many branches, it probably wants a smaller component tree.
- If state is mirrored in several places, the source of truth is probably wrong.
- If an effect changes local values without an external system, it may be a bug.
