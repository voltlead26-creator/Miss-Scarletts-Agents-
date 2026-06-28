# Miss Scarlett's Agents

A live control room for Agent Smith and a specialist agent roster.
The frontend is a fixed-screen, brain-first interface with Smith's central
reactor in the middle, specialist brains in the side pods, and chat-driven
coordination through the Netlify Functions backend.

## What it does

- You talk to Agent Smith in chat.
- Smith analyzes the request, clarifies the goal, and delegates work to the
  best specialist agent.
- Specialist activity is streamed back into the UI as live transcripts.
- External work affecting GitHub, Supabase, or Netlify pauses for Smith
  review and signoff before it is finalized.
- The page is non-scrollable by default. The brain scene is the primary view.

## Local development

1. `npm install`
2. Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`.
3. `npm run dev`

That starts:

- the Vite frontend
- the local Netlify Functions server

## Build

- `npm run build`
- `npm run lint`

## Netlify deployment

Netlify hosts the frontend and the functions together. No separate backend
host is required for the current architecture.

Set your production environment variables in Netlify, especially:

- `ANTHROPIC_API_KEY`
- `SMITH_MODEL`
- `SPECIALIST_MODEL`
- `MAX_TOKENS`

`netlify.toml` is configured to build `dist/` and route `/api/*` into the
Netlify Functions handler.

## Structure

- `netlify/functions/api.ts` - Netlify Functions handler for chat, status,
  approval, and agent metadata.
- `src/App.tsx` - fixed layout shell with Smith brain centered and agents in
  side pods.
- `src/hooks/useAgentSystem.ts` - client state and streaming API adapter.
- `src/components/Brain.tsx` - animated 3D brain rendering.
- `src/agentRegistry.ts` - shared agent roster and prompt guides.
