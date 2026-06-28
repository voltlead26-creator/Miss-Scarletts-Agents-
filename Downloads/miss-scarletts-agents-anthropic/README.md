# Miss Scarlett's Agents — Control Room

A live control room for **Agent Smith** and twelve specialist extensions,
powered by the Anthropic API. Smith orchestrates work over a Node +
WebSocket backend, and the React frontend listens for live transcript,
status, and workflow events.

## How it works

- The owner talks to **Agent Smith only**, in chat.
- Smith has one tool, `consult_agent`. Calling it runs a second Claude call
  using the target specialist's `agents/<id>.README.md` as the system
  prompt, and returns that specialist's findings to Smith as plain text.
- Specialists never talk to the owner directly — they are extensions of
  Smith, not separate participants. Smith reads what they return and
  decides what to tell the owner.
- Work touching Supabase, Netlify, DevOps/CI, or Security always pauses for
  the owner's approval before Smith treats it as final, regardless of what
  Smith itself flags.
- Editing a specialist's behavior means editing its README file in
  `agents/` — no code change, no restart required. The file is read fresh
  on every call.

## Run it

Prerequisite: Node.js 22+ if you want to run the TypeScript server directly.

1. `npm install`
2. Copy `.env.example` to `.env` and add your `ANTHROPIC_API_KEY`
   (get one at https://console.anthropic.com).
3. `npm run dev` — starts the Node + WebSocket backend on `http://localhost:3001`
   by default.
4. `npm run build` — produces the static frontend in `dist/`.
5. `npm run start` — runs the built app with the same Node backend entrypoint.

## Netlify deployment

Netlify should host the built frontend only. The live backend still needs a
separate Node/WebSocket host.

Set these frontend environment variables at build time:

- `VITE_API_ORIGIN` for HTTP calls
- `VITE_WS_ORIGIN` for WebSocket calls

If the backend is on the same origin, leave both blank.

`netlify.toml` is configured to publish `dist/` and route all paths to
`/app.html`, which is the Vite entrypoint for the frontend.

## Repo layout

- `server.ts` — Express + WebSocket server, Smith's orchestration loop.
- `agents/*.README.md` — one file per agent. This *is* the system prompt.
- `src/types.ts` — shared types between server and (future) frontend.
- `src/App.tsx`, `src/hooks/useAgentSystem.ts` — the interactive frontend
  wired to the Node/WebSocket backend.
- `scripts/generate_agent_readmes.py` — regenerates the specialist README
  files from canonical profile data if you want to bulk-edit knowledge
  themes instead of hand-editing 12 files.
- `scripts/test_chat_client.mjs` — minimal WebSocket test client.
