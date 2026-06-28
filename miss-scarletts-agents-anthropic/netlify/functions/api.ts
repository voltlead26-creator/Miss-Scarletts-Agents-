import Anthropic from '@anthropic-ai/sdk';
import { AGENT_GUIDES, AGENTS, SPECIALIST_IDS } from '../../src/agentRegistry';
import { LogLevel, StepStatus, WorkflowStatus } from '../../src/types';
import type { AgentId, ChatTurn, LogEntry, Workflow, WorkflowStep } from '../../src/types';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const SMITH_MODEL = process.env.SMITH_MODEL || 'claude-sonnet-4-6';
const SPECIALIST_MODEL = process.env.SPECIALIST_MODEL || 'claude-sonnet-4-6';
const MAX_TOKENS = Number(process.env.MAX_TOKENS || 1500);
const MAX_TOOL_ROUNDS = 4;

let anthropicClient: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!ANTHROPIC_API_KEY) return null;
  if (!anthropicClient) anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  return anthropicClient;
}

function agentById(agentId: AgentId) {
  return AGENTS.find((agent) => agent.id === agentId) ?? null;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function toLog(source: string, message: string, level: LogLevel = LogLevel.INFO): LogEntry {
  return {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    source,
    message,
    level,
  };
}

function toWorkflow(title: string): Workflow {
  return {
    id: `wf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: title.slice(0, 80),
    status: WorkflowStatus.RUNNING,
    steps: [],
    createdAt: new Date().toISOString(),
  };
}

function emit(controller: ReadableStreamDefaultController<Uint8Array>, encoder: TextEncoder, type: string, payload: unknown) {
  controller.enqueue(encoder.encode(`${JSON.stringify({ type, payload })}\n`));
}

function toAnthropicMessages(history: ChatTurn[]): Anthropic.MessageParam[] {
  return history.map((turn) => ({
    role: turn.role === 'user' ? 'user' : 'assistant',
    content: turn.content,
  }));
}

function consultTool(): Anthropic.Tool {
  return {
    name: 'consult_agent',
    description:
      'Delegate a specific task to one specialist extension of yourself and get back their findings as text. Each specialist only knows what you tell it in instructions.',
    input_schema: {
      type: 'object',
      properties: {
        agent_id: { type: 'string', enum: SPECIALIST_IDS },
        task_name: { type: 'string' },
        instructions: { type: 'string' },
        approval_required: { type: 'boolean' },
      },
      required: ['agent_id', 'task_name', 'instructions', 'approval_required'],
    },
  };
}

async function runSpecialist(
  client: Anthropic,
  step: WorkflowStep,
  emitEvent: (type: string, payload: unknown) => void
) {
  const guide = AGENT_GUIDES[step.agentId];
  emitEvent('agent_status', { agentId: step.agentId, status: 'thinking' });

  let buffer = '';
  try {
    const stream = client.messages.stream({
      model: SPECIALIST_MODEL,
      max_tokens: MAX_TOKENS,
      system: guide,
      messages: [{ role: 'user', content: step.input }],
    });

    stream.on('text', (delta) => {
      if (!buffer) emitEvent('agent_status', { agentId: step.agentId, status: 'speaking' });
      buffer += delta;
      emitEvent('agent_stream_chunk', { agentId: step.agentId, delta });
    });

    await stream.finalMessage();
  } catch (error) {
    const message = `Specialist call failed: ${String(error)}`;
    emitEvent('log_added', toLog(step.agentId, message, LogLevel.ERROR));
    emitEvent('agent_status', { agentId: step.agentId, status: 'idle' });
    return message;
  }

  emitEvent('agent_status', { agentId: step.agentId, status: 'idle' });
  const final = buffer || '(empty response)';
  emitEvent('log_added', toLog(step.agentId, final, LogLevel.SUCCESS));
  return final;
}

async function runSmithTurn(
  client: Anthropic,
  message: string,
  history: ChatTurn[],
  emitEvent: (type: string, payload: unknown) => void
) {
  const workflow = toWorkflow(message);
  const conversation = toAnthropicMessages(history);
  conversation.push({ role: 'user', content: message });

  emitEvent('workflow_created', workflow);
  emitEvent('log_added', toLog('SMITH', `Received: "${message}"`, LogLevel.INFO));
  emitEvent('agent_status', { agentId: 'smith', status: 'thinking' });

  const smithSystem = AGENT_GUIDES.smith;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    let response: Anthropic.Message;
    try {
      response = await client.messages.create({
        model: SMITH_MODEL,
        max_tokens: MAX_TOKENS,
        system: smithSystem,
        messages: conversation,
        tools: [consultTool()],
      });
    } catch (error) {
      const msg = `Smith's model call failed: ${String(error)}`;
      workflow.status = WorkflowStatus.FAILED;
      emitEvent('log_added', toLog('SMITH', msg, LogLevel.ERROR));
      emitEvent('workflow_updated', workflow);
      emitEvent('smith_reply', { text: msg, workflowId: workflow.id });
      emitEvent('agent_status', { agentId: 'smith', status: 'idle' });
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
      emitEvent('log_added', toLog('SMITH', finalText, LogLevel.SUCCESS));
      emitEvent('workflow_updated', workflow);
      emitEvent('smith_reply', { text: finalText, workflowId: workflow.id });
      emitEvent('agent_status', { agentId: 'smith', status: 'idle' });
      return;
    }

    const toolUseBlocks = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    );

    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of toolUseBlocks) {
      const input = block.input as {
        agent_id: string;
        task_name: string;
        instructions: string;
        approval_required?: boolean;
      };

      const specialistId = input.agent_id as Exclude<AgentId, 'smith'>;

      if (!SPECIALIST_IDS.includes(specialistId)) {
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: `Unknown agent_id "${input.agent_id}".`,
          is_error: true,
        });
        continue;
      }

      const agentId = specialistId;
      const approvalRequired = Boolean(input.approval_required) || ['supabase', 'netlify', 'devops', 'security'].includes(agentId);

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
      emitEvent('workflow_updated', workflow);

      if (approvalRequired) {
        step.status = StepStatus.OVERRIDE_REQUESTED;
        workflow.status = WorkflowStatus.PAUSED;
        emitEvent('agent_status', { agentId, status: 'blocked' });
        emitEvent('log_added', toLog('SMITH', `Holding for owner approval — ${agentById(agentId)?.name ?? agentId}: "${step.taskName}"`, LogLevel.WARNING));
        emitEvent('workflow_updated', workflow);
        emitEvent('smith_reply', {
          text: `I’ve delegated ${step.taskName} to ${agentById(agentId)?.name ?? agentId}, but I’m holding the step for your approval before anything external is finalized. Approve, reject, or modify it in the panel and I’ll continue from there.`,
          workflowId: workflow.id,
        });
        emitEvent('agent_status', { agentId: 'smith', status: 'idle' });
        return;
      }

      const output = await runSpecialist(client, step, emitEvent);
      step.output = output;
      step.status = StepStatus.COMPLETED;
      step.completedAt = new Date().toISOString();
      emitEvent('workflow_updated', workflow);

      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: output,
      });
    }

    conversation.push({ role: 'user', content: toolResults });
  }

  const msg = `Stopped after ${MAX_TOOL_ROUNDS} delegation rounds without a final answer. Try narrowing the request.`;
  workflow.status = WorkflowStatus.FAILED;
  emitEvent('log_added', toLog('SMITH', msg, LogLevel.WARNING));
  emitEvent('workflow_updated', workflow);
  emitEvent('smith_reply', { text: msg, workflowId: workflow.id });
  emitEvent('agent_status', { agentId: 'smith', status: 'idle' });
}

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {}),
    },
  });
}

async function streamChat(request: Request) {
  const client = getClient();
  const body = await request.json().catch(() => ({}));
  const message = asString((body as { message?: unknown }).message).trim();
  const history = Array.isArray((body as { history?: unknown }).history) ? ((body as { history: ChatTurn[] }).history ?? []) : [];

  if (!message) return jsonResponse({ error: 'message (string) is required' }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const emitEvent = (type: string, payload: unknown) => emit(controller, encoder, type, payload);
      if (!client) {
        const msg = 'ANTHROPIC_API_KEY is not set. Add it in Netlify environment variables.';
        emitEvent('log_added', toLog('SMITH', msg, LogLevel.ERROR));
        emitEvent('smith_reply', { text: msg, workflowId: `wf_${Date.now()}` });
        controller.close();
        return;
      }

      (async () => {
        try {
          emitEvent('init', { agents: AGENTS });
          await runSmithTurn(client, message, history, emitEvent);
        } catch (error) {
          emitEvent('log_added', toLog('SYSTEM', `Unhandled error in Smith turn: ${String(error)}`, LogLevel.ERROR));
          emitEvent('smith_reply', {
            text: `Unhandled error in Smith turn: ${String(error)}`,
            workflowId: `wf_${Date.now()}`,
          });
        } finally {
          controller.close();
        }
      })();
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'application/x-ndjson; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const route = url.searchParams.get('path') || url.pathname;

  if (request.method === 'GET' && route === '/api/agents') {
    return jsonResponse(AGENTS);
  }

  if (request.method === 'GET' && route.startsWith('/api/agents/') && route.endsWith('/readme')) {
    const id = route.split('/')[3] as AgentId | undefined;
    if (!id || !agentById(id)) {
      return new Response('Unknown agent', { status: 404 });
    }
    return new Response(AGENT_GUIDES[id], {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  if (request.method === 'GET' && route === '/api/status') {
    return jsonResponse({
      anthropicConfigured: Boolean(ANTHROPIC_API_KEY),
      smithModel: SMITH_MODEL,
      specialistModel: SPECIALIST_MODEL,
      backendMode: 'netlify-functions',
    });
  }

  if (request.method === 'POST' && route === '/api/chat') {
    return streamChat(request);
  }

  if (request.method === 'POST' && route.startsWith('/api/approval/')) {
    const stepId = route.split('/').pop() || '';
    const body = await request.json().catch(() => ({}));
    return jsonResponse({
      status: 'ok',
      stepId,
      action: asString((body as { action?: unknown }).action),
      modifiedInput: asString((body as { modifiedInput?: unknown }).modifiedInput),
      note: 'Approval endpoints are acknowledged by the function layer; the browser maintains the interactive workflow state.',
    });
  }

  if (request.method === 'POST' && route === '/api/reset') {
    return jsonResponse({ status: 'ok' });
  }

  return jsonResponse({ error: 'Not found', route }, { status: 404 });
}

export const config = {
  path: '/api/*',
};
