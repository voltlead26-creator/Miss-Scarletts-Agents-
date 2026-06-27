# TypeScript

TypeScript is the language of contracts in this repo.

## What the agent should know

- Basic types, object types, arrays, tuples, enums, and literal types.
- Union and intersection types.
- Narrowing with `typeof`, `instanceof`, `in`, equality checks, and truthiness.
- Control-flow analysis and why a value can change type across branches.
- Utility types such as `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly`, `ReturnType`, `Parameters`, and `Awaited`.
- Optional properties, nullability, and the difference between missing, empty, and undefined.
- Generic functions, constraints, and type inference.
- Type aliases versus interfaces.
- Discriminated unions for state machines and workflow states.

## Rules of thumb

- Validate external data at the boundary.
- Use narrow types where the domain is stable.
- Prefer discriminated unions over boolean soup.
- Avoid `any` unless it is isolated and unavoidable.
- If a value crosses module boundaries, make its type explicit.
- If code branches on a property, encode that branch in the type.

## Common traps

- Casting away errors instead of solving the shape problem.
- Using optional properties when the state has a better explicit model.
- Allowing `null` and `undefined` to leak across multiple layers.
- Over-modeling with type machinery that obscures runtime behavior.

## Typical Coder moves

- Define or tighten the shared type first.
- Add runtime validation where external data enters the system.
- Refactor call sites only after the type contract is sound.
- Keep the runtime shape and the type shape aligned.
