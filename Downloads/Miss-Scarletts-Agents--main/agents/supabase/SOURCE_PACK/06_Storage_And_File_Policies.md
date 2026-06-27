# Storage and File Policies

Storage is part of the authorization surface, not an exception to it.

## Core principles

- File access must mirror the app’s trust model.
- Public buckets and private buckets should be deliberately separated.
- Metadata and object paths can carry authorization meaning.
- Storage policies need to be designed, not assumed.

## Practical guidance

- Decide whether a file is public, team-scoped, or user-scoped.
- Keep file upload and file access rules aligned.
- Validate file type, size, and ownership expectations.
- Do not let storage become a side channel around RLS.

## Common mistakes

- Uploading sensitive files to a bucket that is effectively public.
- Using a database rule for tables but forgetting the equivalent file rule.
- Treating signed URLs as a substitute for access design.
