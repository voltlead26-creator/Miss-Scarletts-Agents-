# Miss Scarletts Agent Console

This project is a browser-based central intelligence interface for Agent Smith
and the specialist agent roster. Smith is the orchestration layer, the brain
scene is the primary visual, and specialist activity is surfaced in the side
pods and transcript drawers.

## What it does

- Shows Agent Smith as the governing coordinator.
- Displays the specialist agents around Smith with live status and transcripts.
- Lets you talk to Smith through the chat box in the center dock.
- Streams delegation, review, and approval events into the interface.
- Uses Netlify Functions for the API layer, so no separate backend host is needed.

## Run locally on macOS 11

Prerequisite: Node.js 18 or newer.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npm run dev
   ```

3. Open the browser at the local URL shown in the terminal.

## Environment

Copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`.

Optional values control model selection and token limits for Smith and the
specialists.

## Build

```bash
npm run build
```

## Deployment

The repo is configured for Netlify deployment from GitHub.

- Frontend and API live together on Netlify.
- `/api/*` is handled by Netlify Functions.
- The `public/brain.png` asset is used by the Smith brain view.

## Notes

The brain UI is intentionally fixed-screen and non-scrollable. Detailed logs,
agent activity, and approval records are hidden behind tabs and drawers.
