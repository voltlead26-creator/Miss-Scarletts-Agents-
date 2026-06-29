/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Miss Scarlett's Agents — server
 * ---------------------------------
 * Agent Smith is a Claude conversation with one tool: `consult_agent`.
 * Calling that tool runs a SEPARATE Claude call using the target
 * specialist's README.md as the system prompt, and returns the specialist's
 * text back to Smith as a tool_result. Smith decides what to do with it and
 * is the only thing that ever replies to the owner — specialists never talk
 * to the owner directly. This is what "specialists are extensions of Smith"
 * means in code: they are tool calls Smith makes against itself, not
 * separate chat participants.
 *
 * Live activity and the transcript are NOT simulated. Every log entry is
 * either a real Claude completion or a real system/lifecycle event.
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import Anthropic from '@anthropic-ai/sdk';
import { createServer as createViteServer } from 'vite';

import { LogLevel, StepStatus, WorkflowStatus } from './src/types.ts';
import type { AgentId, AgentMeta, LogEntry, Workflow, WorkflowStep } from './src/types.ts';

const ROOT = process.cwd();
const AGENTS_DIR = path.join(ROOT, 'agents');
const DB_FILE = path.join(ROOT, 'db_logs.json');

// ---------------------------------------------------------------------------
// Agent registry — metadata only. Behaviour lives in agents/<id>.README.md.
// ---------------------------------------------------------------------------

const SPECIALISTS: AgentMeta[] = [
  { id: 'coder', name: 'Coder', role: 'Polyglot implementation specialist', accent: '#38bdf8', icon: 'Cpu', approvalRequired: false, readmeFile: 'coder.README.md' },
  { id: 'frontend', name: 'Frontend', role: 'UI and interaction specialist', accent: '#60a5fa', icon: 'Layers', approvalRequired: false, readmeFile: 'frontend.README.md' },
  { id: 'backend', name: 'Backend', role: 'Server logic and data contract specialist', accent: '#34d399', icon: 'Server', approvalRequired: false, readmeFile: 'backend.README.md' },
  { id: 'supabase', name: 'Supabase', role: 'Database and edge platform specialist', accent: '#22c55e', icon: 'Database', approvalRequired: true, readmeFile: 'supabase.README.md' },
  { id: 'netlify', name: 'Netlify', role: 'Deploy and release specialist', accent: '#f59e0b', icon: 'FolderGit2', approvalRequired: true, readmeFile: 'netlify.README.md' },
  { id: 'devops', name: 'DevOps', role: 'CI/CD and release safety specialist', accent: '#a78bfa', icon: 'GitBranch', approvalRequired: true, readmeFile: 'devops.README.md' },
  { id: 'qa', name: 'QA', role: 'Verification and regression specialist', accent: '#f472b6', icon: 'CheckCircle', approvalRequired: false, readmeFile: 'qa.README.md' },
  { id: 'security', name: 'Security', role: 'Secrets and trust-boundary specialist', accent: '#fb7185', icon: 'ShieldAlert', approvalRequired: true, readmeFile: 'security.README.md' },
  { id: 'accessibility', name: 'Accessibility', role: 'Semantic and WCAG specialist', accent: '#f59e0b', icon: 'UserCheck', approvalRequired: false, readmeFile: 'accessibility.README.md' },
  { id: 'prompt-engineering', name: 'Prompt Engineering', role: 'Instruction and tool-shaping specialist', accent: '#c084fc', icon: 'Sliders', approvalRequired: false, readmeFile: 'prompt-engineering.README.md' },
  { id: 'marketing', name: 'Marketing', role: 'Growth, positioning, campaigns, and go-to-market specialist', accent: '#fb923c', icon: 'Megaphone', approvalRequired: false, readmeFile: 'marketing.README.md' },
  { id: 'product-analytics', name: 'Product Analytics', role: 'Measurement and insight specialist', accent: '#eab308', icon: 'BarChart3', approvalRequired: false, readmeFile: 'product-analytics.README.md' },
  { id: 'technical-writing', name: 'Technical Writing', role: 'Documentation and recovery specialist', accent: '#14b8a6', icon: 'FileText', approvalRequired: false, readmeFile: 'technical-writing.README.md' },
];

const SMITH_META: AgentMeta = {
  id: 'smith',
  name: 'Agent Smith',
  role: 'Governing coordinator',
  accent: '#22d3ee',
  icon: 'Shield',
  approvalRequired: false,
  readmeFile: 'smith.README.md',
};

const SPECIALIST_IDS = SPECIALISTS.map((a) => a.id);
const AGENT_BY_ID = new Map<AgentId, AgentMeta>([[SMITH_META.id, SMITH_META], ...SPECIALISTS.map((a) => [a.id, a] as const)]);

function readReadme(agentId: AgentId): string {
  const meta = AGENT_BY_ID.get(agentId);
  if (!meta) throw new Error(`Unknown agent: ${agentId}`);
  const fullPath = path.join(AGENTS_DIR, meta.readmeFile);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`README missing for ${agentId} at ${fullPath}`);
  }
  // Read fresh every call on purpose: editing a README takes effect on the
  // very next request, no restart needed.
  return fs.readFileSync(fullPath, 'utf-8');
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const SMITH_MODEL = process.env.SMITH_MODEL || 'claude-sonnet-4-6';
const SPECIALIST_MODEL = process.env.SPECIALIST_MODEL || 'claude-sonnet-4-6';
const MAX_TOKENS = Number(process.env.MAX_TOKENS || 1500);
const MAX_TOOL_ROUNDS = 6; // safety cap against runaway delegation loops
const PORT = Number(process.env.PORT || 3001);

let anthropicClient: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!ANTHROPIC_API_KEY) return null;
  if (!anthropicClient) anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  return anthropicClient;
}

// ---------------------------------------------------------------------------
// State (single local user — no multi-session handling on purpose)
// ---------------------------------------------------------------------------

let logs: LogEntry[] = [];
let workflows: Workflow[] = [];
let conversation: Anthropic.MessageParam[] = [];

if (fs.existsSync(DB_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    logs = data.logs || [];
    workflows = data.workflows || [];
    conversation = data.conversation || [];
  } catch (err) {
    console.error('Failed to load db_logs.json, starting empty', err);
  }
}

function saveDB() {
  try {
    if (logs.length > 500) logs = logs.slice(logs.length - 500);
    fs.writeFileSync(DB_FILE, JSON.stringify({ logs, workflows, conversation }, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db_logs.json', err);
  }
}

const pendingApprovals = new Map<string, (decision: { action: 'approve' | 'reject' | 'modify'; modifiedInput?: string }) => void>();

// ---------------------------------------------------------------------------
// WebSocket broadcast
// ---------------------------------------------------------------------------

const clients = new Set<WebSocket>();

function broadcast(type: string, payload: unknown) {
  const msg = JSON.stringify({ type, payload });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

function addLog(source: string, message: string, level: LogLevel = LogLevel.INFO): LogEntry {
  const entry: LogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    source,
    message,
    level,
  };
  logs.push(entry);
  broadcast('log_added', entry);
  console.log(`[${level.toUpperCase()}] [${source}] ${message}`);
  return entry;
}

type AgentStatus = 'idle' | 'thinking' | 'speaking' | 'blocked';
function setAgentStatus(agentId: string, status: AgentStatus) {
  broadcast('agent_status', { agentId, status });
}

// ---------------------------------------------------------------------------
// The consult_agent tool definition Smith is given
// ---------------------------------------------------------------------------

const CONSULT_TOOL: Anthropic.Tool = {
  name: 'consult_agent',
  description:
    "Delegate a specific task to one specialist extension of yourself and get back their findings as text. Each specialist only knows what you tell it in `instructions` — give it enough context to act.",
  input_schema: {
    type: 'object',
    properties: {
      agent_id: {
        type: 'string',
        enum: SPECIALIST_IDS,
        description: 'Which specialist extension to consult.',
      },
      task_name: {
        type: 'string',
        description: 'Short label for this task (shown in the live transcript).',
      },
      instructions: {
        type: 'string',
        description: 'Precise instructions and context for the specialist to act on.',
      },
      approval_required: {
        type: 'boolean',
        description:
          "True if this is production-impacting and the owner must sign off before it's treated as final. The system also enforces this automatically for supabase, netlify, devops, and security regardless of what you set.",
      },
    },
    required: ['agent_id', 'task_name', 'instructions', 'approval_required'],
  },
};

const ALWAYS_REQUIRE_APPROVAL = new Set<AgentId>(['supabase', 'netlify', 'devops', 'security']);

// ---------------------------------------------------------------------------
// Run one specialist consult (real, streamed Claude call)
// ---------------------------------------------------------------------------

async function runSpecialist(step: WorkflowStep): Promise<string> {
  const client = getClient();
  if (!client) {
    const msg = 'ANTHROPIC_API_KEY is not set on the server. Add it to .env and restart.';
    addLog(step.agentId, msg, LogLevel.ERROR);
    return msg;
  }

  setAgentStatus(step.agentId, 'thinking');
  let buffer = '';
  try {
    const system = readReadme(step.agentId);
    const stream = client.messages.stream({
      model: SPECIALIST_MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages: [{ role: 'user', content: step.input }],
    });

    stream.on('text', (delta) => {
      if (buffer.length === 0) setAgentStatus(step.agentId, 'speaking');
      buffer += delta;
      // Live, ephemeral typing signal — not persisted to the transcript.
      // The frontend uses this to animate the agent while it's "alive".
      broadcast('agent_stream_chunk', { stepId: step.id, agentId: step.agentId, delta });
    });

    await stream.finalMessage();
  } catch (err) {
    const msg = `Specialist call failed: ${String(err)}`;
    addLog(step.agentId, msg, LogLevel.ERROR);
    setAgentStatus(step.agentId, 'idle');
    return msg;
  }

  setAgentStatus(step.agentId, 'idle');
  addLog(step.agentId, buffer || '(empty response)', LogLevel.SUCCESS);
  return buffer || '(empty response)';
}

// ---------------------------------------------------------------------------
// Approval gate
// ---------------------------------------------------------------------------

function waitForApproval(step: WorkflowStep, workflow: Workflow): Promise<{ action: 'approve' | 'reject' | 'modify'; modifiedInput?: string }> {
  step.status = StepStatus.OVERRIDE_REQUESTED;
  workflow.status = WorkflowStatus.PAUSED;
  addLog('SMITH', `Holding for owner approval — ${AGENT_BY_ID.get(step.agentId)?.name}: "${step.taskName}"`, LogLevel.WARNING);
  setAgentStatus(step.agentId, 'blocked');
  broadcast('workflow_updated', workflow);
  saveDB();

  return new Promise((resolve) => {
    pendingApprovals.set(step.id, resolve);
  });
}

// ---------------------------------------------------------------------------
// Smith's orchestration loop
// ---------------------------------------------------------------------------

async function runSmithTurn(userText: string) {
  const client = getClient();
  const workflow: Workflow = {
    id: `wf_${Date.now()}`,
    title: userText.slice(0, 80),
    status: WorkflowStatus.RUNNING,
    steps: [],
    createdAt: new Date().toISOString(),
  };
  workflows.push(workflow);
  broadcast('workflow_created', workflow);

  if (!client) {
    const msg = 'ANTHROPIC_API_KEY is not set on the server. Add it to .env (see .env.example) and restart the server.';
    addLog('SMITH', msg, LogLevel.ERROR);
    workflow.status = WorkflowStatus.FAILED;
    broadcast('workflow_updated', workflow);
    broadcast('smith_reply', { text: msg, workflowId: workflow.id });
    saveDB();
    return;
  }

  conversation.push({ role: 'user', content: userText });
  addLog('SMITH', `Received: "${userText}"`, LogLevel.INFO);

  const smithSystem = readReadme('smith');

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    setAgentStatus('smith', 'thinking');
    let response: Anthropic.Message;
    try {
      response = await client.messages.create({
        model: SMITH_MODEL,
        max_tokens: MAX_TOKENS,
        system: smithSystem,
        messages: conversation,
        tools: [CONSULT_TOOL],
      });
    } catch (err) {
      const msg = `Smith's model call failed: ${String(err)}`;
      addLog('SMITH', msg, LogLevel.ERROR);
      workflow.status = WorkflowStatus.FAILED;
      broadcast('workflow_updated', workflow);
      broadcast('smith_reply', { text: msg, workflowId: workflow.id });
      saveDB();
      return;
    }

    conversation.push({ role: 'assistant', content: response.content });

    if (response.stop_reason !== 'tool_use') {
      const finalText = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('\n');

      workflow.status = WorkflowStatus.COMPLETED;
      workflow.finalReply = finalText;
      setAgentStatus('smith', 'idle');
      addLog('SMITH', finalText, LogLevel.SUCCESS);
      broadcast('workflow_updated', workflow);
      broadcast('smith_reply', { text: finalText, workflowId: workflow.id });
      saveDB();
      return;
    }

    // Smith called consult_agent one or more times this round.
    const toolUseBlocks = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    );

    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of toolUseBlocks) {
      const input = block.input as { agent_id: string; task_name: string; instructions: string; approval_required?: boolean };

      if (!SPECIALIST_IDS.includes(input.agent_id as AgentId)) {
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: `Unknown agent_id "${input.agent_id}". Valid options: ${SPECIALIST_IDS.join(', ')}.`,
          is_error: true,
        });
        continue;
      }

      const agentId = input.agent_id as AgentId;
      const approvalRequired = Boolean(input.approval_required) || ALWAYS_REQUIRE_APPROVAL.has(agentId);

      const step: WorkflowStep = {
        id: `step_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        agentId,
        taskName: input.task_name,
        input: input.instructions,
        status: StepStatus.RUNNING,
        approvalRequired,
        startedAt: new Date().toISOString(),
      };
      workflow.steps.push(step);
      broadcast('workflow_updated', workflow);

      if (approvalRequired) {
        const decision = await waitForApproval(step, workflow);
        pendingApprovals.delete(step.id);

        if (decision.action === 'reject') {
          step.status = StepStatus.REJECTED;
          step.completedAt = new Date().toISOString();
          workflow.status = WorkflowStatus.RUNNING;
          broadcast('workflow_updated', workflow);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: 'The owner rejected this step. Do not proceed with it. Explain the rejection and suggest a different path if one exists.',
          });
          continue;
        }

        if (decision.action === 'modify' && decision.modifiedInput) {
          step.input = decision.modifiedInput;
        }
        workflow.status = WorkflowStatus.RUNNING;
        step.status = StepStatus.RUNNING;
        broadcast('workflow_updated', workflow);
      }

      const output = await runSpecialist(step);
      step.output = output;
      step.status = StepStatus.COMPLETED;
      step.completedAt = new Date().toISOString();
      broadcast('workflow_updated', workflow);

      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: output,
      });
    }

    conversation.push({ role: 'user', content: toolResults });
    saveDB();
  }

  // Hit MAX_TOOL_ROUNDS without Smith settling on a final answer.
  const msg = `Stopped after ${MAX_TOOL_ROUNDS} delegation rounds without a final answer. This usually means the task is too broad — try breaking it into a smaller request.`;
  addLog('SMITH', msg, LogLevel.WARNING);
  workflow.status = WorkflowStatus.FAILED;
  broadcast('workflow_updated', workflow);
  broadcast('smith_reply', { text: msg, workflowId: workflow.id });
  saveDB();
}

// ---------------------------------------------------------------------------
// Express + WebSocket wiring
// ---------------------------------------------------------------------------

const app = express();
app.use(express.json());

app.get('/api/agents', (_req, res) => {
  res.json([SMITH_META, ...SPECIALISTS]);
});

app.get('/api/agents/:id/readme', (req, res) => {
  try {
    const text = readReadme(req.params.id as AgentId);
    res.type('text/markdown').send(text);
  } catch (err) {
    res.status(404).json({ error: String(err) });
  }
});

app.get('/api/status', (_req, res) => {
  res.json({
    anthropicConfigured: Boolean(ANTHROPIC_API_KEY),
    smithModel: SMITH_MODEL,
    specialistModel: SPECIALIST_MODEL,
  });
});

app.get('/api/logs', (_req, res) => res.json(logs));
app.get('/api/workflows', (_req, res) => res.json(workflows));

app.post('/api/chat', (req, res) => {
  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message (string) is required' });
  }
  // Fire and forget — progress and the final reply both arrive over the
  // WebSocket ('workflow_updated', 'log_added', 'smith_reply').
  runSmithTurn(message).catch((err) => {
    addLog('SYSTEM', `Unhandled error in Smith turn: ${String(err)}`, LogLevel.ERROR);
  });
  res.status(202).json({ status: 'accepted' });
});

app.post('/api/approval/:stepId', (req, res) => {
  const { stepId } = req.params;
  const { action, modifiedInput } = req.body || {};
  const resolve = pendingApprovals.get(stepId);
  if (!resolve) {
    return res.status(404).json({ error: 'No pending approval for that step id.' });
  }
  if (!['approve', 'reject', 'modify'].includes(action)) {
    return res.status(400).json({ error: 'action must be approve, reject, or modify' });
  }
  resolve({ action, modifiedInput });
  res.json({ status: 'ok' });
});

app.post('/api/reset', (_req, res) => {
  logs = [];
  workflows = [];
  conversation = [];
  saveDB();
  addLog('SYSTEM', 'Transcript and conversation history cleared.', LogLevel.WARNING);
  res.json({ status: 'ok' });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'init', payload: { logs, workflows, agents: [SMITH_META, ...SPECIALISTS] } }));
  ws.on('close', () => clients.delete(ws));
});

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => wss.emit('connection', ws, request));
  } else {
    socket.destroy();
  }
});

async function startServer() {
  if (!ANTHROPIC_API_KEY) {
    console.warn(
      '\n[WARNING] ANTHROPIC_API_KEY is not set. The server will start, but every chat turn will return a setup error until you add it to .env.\n'
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(ROOT, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'app.html')));
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Miss Scarlett's Agents server active at http://localhost:${PORT}`);
  });
}

startServer();
