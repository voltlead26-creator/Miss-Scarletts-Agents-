# Authorization and RLS

Authorization controls what an authenticated actor may do. In Supabase-backed apps, RLS is a major part of that boundary.

## Core facts

- Authentication does not grant access by itself.
- RLS is a database-level control, not a UI convenience feature.
- Storage access policies should align with table access policy.

## Practical guidance

- Enforce access at the server and database layers.
- Model ownership, membership, and role separately when needed.
- Test authorization under the real role, not only under admin access.

## Common mistakes

- Trusting client checks for privileged behavior.
- Allowing a route to bypass the database policy model.
- Forgetting storage is part of the same security surface.
