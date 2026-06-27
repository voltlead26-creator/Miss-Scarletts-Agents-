# RLS and Authorization

Row Level Security is the main server-enforced authorization layer in Supabase projects. The agent should treat it as a first-class part of the product.

## Core principles

- Authorization belongs in the database where possible.
- Policies should be readable and testable.
- Allow only the access the feature truly needs.
- Model ownership, membership, role, and scope separately if needed.

## Policy design

- Write policies for each action, not just each table.
- Check both read and write paths.
- Make policy intent obvious in the code and tests.
- Ensure admin or service paths are explicit and isolated.

## Common mistakes

- Using permissive policies as a shortcut.
- Assuming a client role or UI state protects data.
- Forgetting that inserts, updates, deletes, and selects may need different rules.
- Hiding policy logic so deeply that nobody can maintain it.

## Operational notes

- Test policies with representative roles.
- Keep privileged access limited.
- Changes to policies should be reviewed like schema changes.
