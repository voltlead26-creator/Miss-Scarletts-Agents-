# Performance

Frontend performance is user experience.

## What the agent should know

- Core Web Vitals describe load, visual stability, and responsiveness.
- Large client bundles make the app slower to start and harder to interact with.
- Unnecessary rerenders can turn simple screens into sluggish ones.
- Images, fonts, and data fetching should be considered as part of the UI design.
- Performance work should start with what the user actually feels.

## Rules of thumb

- Load only what the current view needs.
- Prefer server rendering or streaming when it improves the first useful paint.
- Memoize only when measurement or clear reasoning says it helps.
- Avoid large client-only components if the same result can be achieved with less JS.
- Measure before and after on the path that users actually take.

## Common failure modes

- Optimizing for bundle size in the abstract instead of a real slow path.
- Adding memoization everywhere without measuring.
- Pulling too much data or JS into the first view.
- Treating layout jank as a styling issue when it is really a loading issue.
