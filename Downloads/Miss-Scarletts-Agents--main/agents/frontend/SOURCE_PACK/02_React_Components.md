# React Components

Frontend implementation is usually component design with rules around state and composition.

## What the agent should know

- Components are functions of props and state.
- Hooks connect a component to state, effects, memoization, refs, and context.
- Render logic should stay pure.
- Effects synchronize with external systems; they should not become generic business logic.
- Derived values should usually be computed instead of stored.
- Smaller components are easier to reason about when they have one job.

## Rules of thumb

- Keep state as local as possible while preserving shared workflow.
- Move logic into helpers when it makes the component easier to scan.
- Avoid duplicating state that can be derived from props or other state.
- Make prop names explicit enough to explain the UI role.
- Use controlled components when the state matters to the app.

## Common failure modes

- Copying props into local state without a real synchronization reason.
- Letting one component own too many unrelated responsibilities.
- Using effects to compute values that should be derived synchronously.
- Making component boundaries follow file size instead of actual responsibilities.
