# Semantic HTML and Labels

Semantic HTML is the baseline for accessible interfaces. Before adding ARIA or custom scripts, use the element that already means what you want.

## Core facts

- A `button` is a button. A `a` element is a link. A `label` ties text to a form control. Headings create document structure.
- Native elements come with expected keyboard behavior, focus behavior, and accessibility semantics.
- The accessible name of a control comes from its label, related text, or ARIA naming where appropriate.
- Reading order matters because assistive technologies often follow the DOM order.

## Practical guidance

- Use headings to describe document sections, not to control spacing.
- Use lists for collections of related items.
- Use fieldsets and legends for grouped form controls when group meaning matters.
- Provide text alternatives for meaningful non-text content.

## Common mistakes

- Using a clickable `div` where a `button` should be used.
- Hiding labels visually in a way that removes them from assistive technology.
- Using heading levels for styling instead of structure.
