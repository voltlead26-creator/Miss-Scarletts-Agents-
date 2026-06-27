# Accessibility Fundamentals

Accessibility is the practice of making content usable by as many people as possible. In web work, it is not a niche concern; it is part of basic product quality.

- WCAG 2 organizes requirements around four principles: perceivable, operable, understandable, and robust.
- WCAG success criteria are testable requirements and are grouped into conformance levels A, AA, and AAA.
- Semantic HTML gives browsers and assistive technologies built-in hooks before custom ARIA is needed.
- Keyboard support is essential because not every user can or wants to use a pointer.
- Labels, headings, reading order, and error messaging affect how meaning is exposed to assistive technologies.
- Color should not be the only signal for state, status, or error.
- ARIA can improve accessibility when native HTML cannot express an interaction, but incorrect ARIA can make things worse.

## Core facts to keep in mind

- Accessible design benefits people using screen readers, keyboards, voice input, mobile devices, or constrained environments.
- Motion, contrast, focus handling, and timing all affect accessibility.
- The browser already knows how to expose many native elements correctly; use that first.

## Practical implications

- Prefer buttons, links, headings, lists, and form controls over generic elements.
- Make focus visible and logical.
- Give controls and fields clear names.
- Use testable, standards-based checks when possible.
