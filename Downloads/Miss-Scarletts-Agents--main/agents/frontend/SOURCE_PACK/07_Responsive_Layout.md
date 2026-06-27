# Responsive Layout

Responsive design is not an optional layer; it is the default condition of the web.

## What the agent should know

- Responsive web design helps pages work across screen sizes and resolutions.
- Media queries are one of the main tools for adapting layout.
- Layout decisions should assume phones, tablets, laptops, and wide displays.
- Responsive behavior also affects accessibility and task completion.
- Content density should change intentionally by viewport, not accidentally.

## Rules of thumb

- Build from a narrow, usable layout outward.
- Use flexible containers and sensible min/max constraints.
- Let text wrap instead of overflowing.
- Protect stable alignment for toolbars, panels, and repeated controls.
- Confirm that interactive elements stay reachable on small screens.

## Common failure modes

- Designing only for desktop.
- Making breakpoints that look good at one width and fail at adjacent widths.
- Overusing fixed widths where flexible sizing would be safer.
- Letting labels collide with controls or icons on smaller screens.
