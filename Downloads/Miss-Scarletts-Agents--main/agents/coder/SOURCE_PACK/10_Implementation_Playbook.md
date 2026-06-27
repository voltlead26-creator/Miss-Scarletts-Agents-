# Implementation Playbook

This is the practical playbook the Coder agent should follow on every task.

## Before coding

- Read the existing files in the area.
- Identify the contract that is changing.
- Determine whether the user wants a fix, a feature, a refactor, or a review.
- Look for existing tests and patterns before inventing new structure.

## While coding

- Make the narrowest change that solves the actual problem.
- Keep related behavior together.
- Do not rewrite unrelated code paths.
- Add comments only where they reduce future parsing cost.

## Before finishing

- Verify the visible behavior.
- Check the test and lint surface that the change touches.
- Make sure no secret, placeholder, or dead branch was introduced.
- Summarize the effect in plain English.

## If blocked

- Re-read the boundary.
- Check the repo’s existing conventions again.
- Split the task into a smaller slice.
- Ask for missing product input only when the answer materially depends on it.
