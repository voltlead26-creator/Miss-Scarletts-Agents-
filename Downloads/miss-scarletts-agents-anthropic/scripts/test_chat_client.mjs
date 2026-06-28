// Minimal test client for the Miss Scarlett's Agents backend.
//
// Usage:
//   node scripts/test_chat_client.mjs "your message here"
//
// Connects to the WebSocket, prints every event live, sends your message
// over the HTTP chat endpoint, and — if Smith pauses on an approval-required
// step — prompts you in the terminal to approve / reject / modify it, the
// same decision a future UI would collect from a button click.

import readline from 'node:readline';

const PORT = process.env.PORT || 3000;
const BASE = `http://localhost:${PORT}`;
const message = process.argv.slice(2).join(' ') || 'Say hello and tell me what you can help with.';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

function ts() {
  return new Date().toLocaleTimeString();
}

async function main() {
  const ws = new WebSocket(`ws://localhost:${PORT}/ws`);

  ws.addEventListener('open', async () => {
    console.log(`[${ts()}] connected. sending: "${message}"`);
    const res = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (res.status !== 202) {
      console.error('chat request failed:', res.status, await res.text());
    }
  });

  ws.addEventListener('message', async (event) => {
    const { type, payload } = JSON.parse(event.data);

    switch (type) {
      case 'init':
        console.log(`[${ts()}] init — ${payload.agents.length} agents, ${payload.logs.length} prior log lines`);
        break;
      case 'log_added':
        console.log(`[${ts()}] [${payload.source}] ${payload.message}`);
        break;
      case 'agent_status':
        console.log(`[${ts()}] (status) ${payload.agentId} -> ${payload.status}`);
        break;
      case 'agent_stream_chunk':
        process.stdout.write(payload.delta);
        break;
      case 'workflow_updated': {
        const pending = payload.steps.find((s) => s.status === 'override_requested');
        if (pending) {
          console.log(`\n[${ts()}] APPROVAL REQUIRED — ${pending.agentId}: "${pending.taskName}"`);
          console.log(`  input: ${pending.input}`);
          const answer = await ask('  approve / reject / modify? ');
          if (answer.startsWith('m')) {
            const modifiedInput = await ask('  new input: ');
            await fetch(`${BASE}/api/approval/${pending.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'modify', modifiedInput }),
            });
          } else {
            const action = answer.startsWith('r') ? 'reject' : 'approve';
            await fetch(`${BASE}/api/approval/${pending.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action }),
            });
          }
        }
        break;
      }
      case 'smith_reply':
        console.log(`\n[${ts()}] SMITH: ${payload.text}\n`);
        rl.close();
        ws.close();
        process.exit(0);
        break;
      default:
        break;
    }
  });

  ws.addEventListener('error', (err) => {
    console.error('WebSocket error — is `npm run dev` running?', err.message || err);
    process.exit(1);
  });
}

main();
