# Headers, Redirects, and Routing

Routing rules and headers shape the public behavior of the site. They belong in the deployment model, not as an afterthought.

## Core principles

- Redirects should be intentional and minimal.
- Headers should reflect security and caching needs.
- Routing rules should match the app’s actual behavior.

## Practical guidance

- Keep redirects readable and ordered.
- Make caching choices explicit.
- Verify that rewrites and redirects behave the same in preview and production where expected.

## Common mistakes

- Accidentally creating redirect loops.
- Setting cache or security headers in the wrong place.
- Letting routing rules drift from the app.
