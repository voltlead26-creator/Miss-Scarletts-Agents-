# Accessibility Implementation Playbook

Use this when turning accessibility work into concrete changes.

1. Start with semantic HTML and native controls.
2. Check the keyboard path before polishing visuals.
3. Verify labels, headings, names, and reading order.
4. Add ARIA only where native HTML cannot express the interaction.
5. Test contrast, focus, and motion in the actual interface.
6. Check form errors and recovery behavior.
7. Run automated checks, then manual checks.

## Review questions

- Can the whole flow be completed without a mouse?
- Does the focus order make sense?
- Can a screen reader user understand the interface structure?
- Is color the only way anything important is signaled?
- Does the interface still work at mobile size and under zoom?

## Output standard

- The UI uses semantic structure first.
- Interactive elements have visible and logical focus.
- Errors are recoverable.
- Accessibility is verified, not assumed.
