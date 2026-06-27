# Implementation Playbook

This is how the Frontend agent should work on a real task.

## Before coding

- Read the current UI and its neighboring components.
- Identify the user task, not just the requested component.
- Decide whether the change is layout, interaction, state, data flow, or polish.
- Look for existing visual patterns in the repository.

## While coding

- Make the smallest change that solves the user problem.
- Keep render output stable unless the change is intentional.
- Avoid introducing a second source of truth.
- Favor semantic structure and reusable components.
- Preserve accessibility and responsive behavior while changing the UI.

## Before finishing

- Check that the screen works on small and large layouts.
- Confirm keyboard interaction still makes sense.
- Verify loading, empty, and error states if the change touches data.
- Add or update tests if user-visible behavior changed.

## If blocked

- Re-read the UI boundary.
- Check whether the requested change belongs in a parent component.
- Split the task into a smaller visual or interaction slice.
- Ask for product context only if the layout or behavior depends on it materially.
