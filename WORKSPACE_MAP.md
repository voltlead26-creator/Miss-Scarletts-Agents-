# Workspace Map

## Current Source Of Truth

- Git repo: `Miss-Scarletts-Agents-`
- Branch: `charlies-agents.netlify`
- App folder: `miss-scarletts-agents-anthropic`

## Notes

- The app UI is Vite-based for local build tooling, but the deployment target is Netlify.
- The backend is intended to live behind the app, not inside the browser.
- Ignore older copies such as `Miss-Scarletts-Agents--main` and any archived `files-*` exports unless explicitly needed for comparison.

## Active Path References

- Repo root: `/Users/kaichurch`
- Current app source tree: `/Users/kaichurch/.worktrees/charlies-agents/miss-scarletts-agents-anthropic`
- Legacy/duplicate trees may exist under:
  - `/Users/kaichurch/.worktrees/charlies-agents/legacy/flat-app`
  - `/Users/kaichurch/Downloads/files-3/miss-scarletts-agents-anthropic`
  - `/Users/kaichurch/Downloads/Miss-Scarletts-Agents--main`
  - `/Users/kaichurch/Downloads/jarvis-agent-interface-miss-scarletts`

## Deployment Intent

- Netlify should build the app from the `Miss-Scarletts-Agents-` repo.
- The connected Git branch should be the deploy source in Netlify.
- The app should be configured as a real backend-connected interface, not a simulation-only shell.
