# Event Model and Naming

Good analytics starts with a consistent event model.

## Core facts

- Events should represent meaningful user or system actions.
- Event names and properties should be stable across releases whenever possible.
- A naming convention prevents dashboards from fragmenting into near-duplicates.

## Practical guidance

- Name events by the action they represent.
- Keep property names consistent across related events.
- Version events when a breaking change is unavoidable.

## Common mistakes

- Measuring everything without deciding what should change.
- Rebuilding dashboards because naming was inconsistent.
- Letting one event mean multiple different actions.
