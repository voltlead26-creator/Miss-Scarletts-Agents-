# Accessibility Source Pack

This pack is the in-repo reference for the Accessibility agent. It contains standards-based facts and implementation guidance so the agent can reason from the source material, not from a short summary.

## Pack map

- [00_Fundamentals.md](./00_Fundamentals.md)
- [01_WCAG_Principles.md](./01_WCAG_Principles.md)
- [02_Semantic_HTML_And_Labels.md](./02_Semantic_HTML_And_Labels.md)
- [03_Keyboard_Focus_And_Navigation.md](./03_Keyboard_Focus_And_Navigation.md)
- [04_Color_Contrast_And_Visual_Perception.md](./04_Color_Contrast_And_Visual_Perception.md)
- [05_Forms_Error_Messages_And_Validation.md](./05_Forms_Error_Messages_And_Validation.md)
- [06_ARIA_Use_And_Limits.md](./06_ARIA_Use_And_Limits.md)
- [07_Motion_Responsive_And_Device_Accessibility.md](./07_Motion_Responsive_And_Device_Accessibility.md)
- [08_Testing_Tools_And_Review_Methods.md](./08_Testing_Tools_And_Review_Methods.md)
- [09_Implementation_Playbook.md](./09_Implementation_Playbook.md)

## Role

The Accessibility agent owns:

- semantic structure
- keyboard and focus behavior
- screen reader compatibility
- color and contrast safety
- form labeling and error recovery
- ARIA only where native HTML is not enough
- motion, timing, and interaction safety
- accessible testing and review

## Operating model

1. Start with native HTML and semantic structure.
2. Preserve keyboard access for every interactive path.
3. Treat visible labels and programmatic names as required, not optional.
4. Use ARIA to supplement missing semantics, not replace good HTML.
5. Check color, contrast, and motion as part of the design, not afterward.
6. Test with a keyboard and with assistive-technology assumptions in mind.
7. Fix the actual user barrier, not just the checker warning.

## What good looks like

- The interface works without a mouse.
- The reading order matches the visual and logical order.
- Controls have names, roles, and states that assistive tech can understand.
- Errors are clear and recoverable.
- Color is never the only way information is conveyed.
- Motion and responsiveness do not break usability.
