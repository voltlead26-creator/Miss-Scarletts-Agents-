import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AgentId, AgentMeta, ChatTurn, LogEntry, Workflow, WorkflowStep } from '../types';
import { apiUrl } from '../lib/api';

export type AgentStatus = 'idle' | 'thinking' | 'speaking' | 'blocked';

export interface AgentRuntime {
  status: AgentStatus;
  liveBuffer: string;
  transcript: LogEntry[];
}

interface ChatEvent {
  type: string;
  payload: unknown;
}

interface PersistedState {
  agents: AgentMeta[];
  runtime: Record<string, AgentRuntime>;
  tedStatus: AgentStatus;
  messages: ChatTurn[];
  workflow: Workflow | null;
  pendingApproval: WorkflowStep | null;
}

const STORAGE_KEY = 'miss-scarletts-agents.state';

function emptyRuntime(): AgentRuntime {
  return { status: 'idle', liveBuffer: '', transcript: [] };
}

function loadPersistedState(): Partial<PersistedState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    return {};
  }
}

function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init);
}

function parseChunk(buffer: string) {
  const lines = buffer.split('\n');
  const rest = lines.pop() ?? '';
  const events: ChatEvent[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      events.push(JSON.parse(trimmed) as ChatEvent);
    } catch {
      // Ignore malformed frames.
    }
  }
  return { events, rest };
}

export function useAgentSystem() {
  const persisted = useMemo(() => loadPersistedState(), []);
  const [agents, setAgents] = useState<AgentMeta[]>(persisted.agents ?? []);
  const [connected, setConnected] = useState(false);
  const [runtime, setRuntime] = useState<Record<string, AgentRuntime>>(persisted.runtime ?? {});
  const [tedStatus, setTedStatus] = useState<AgentStatus>(persisted.tedStatus ?? 'idle');
  const [messages, setMessages] = useState<ChatTurn[]>(persisted.messages ?? []);
  const [workflow, setWorkflow] = useState<Workflow | null>(persisted.workflow ?? null);
  const [pendingApproval, setPendingApproval] = useState<WorkflowStep | null>(persisted.pendingApproval ?? null);
  const [apiOnline, setApiOnline] = useState(false);

  const messagesRef = useRef(messages);
  const workflowRef = useRef(workflow);
  const pendingApprovalRef = useRef(pendingApproval);
  const runtimeRef = useRef(runtime);
  const agentsRef = useRef(agents);

  useEffect(() => {
    messagesRef.current = messages;
    workflowRef.current = workflow;
    pendingApprovalRef.current = pendingApproval;
    runtimeRef.current = runtime;
    agentsRef.current = agents;
  }, [agents, messages, pendingApproval, runtime, workflow]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          agents,
          runtime,
          tedStatus,
          messages,
          workflow,
          pendingApproval,
        } satisfies PersistedState)
      );
    } catch {
      // Non-fatal. The live UI still works without persistence.
    }
  }, [agents, messages, pendingApproval, runtime, tedStatus, workflow]);

  const ensureRuntime = useCallback((id: string) => {
    setRuntime((prev) => (prev[id] ? prev : { ...prev, [id]: emptyRuntime() }));
  }, []);

  const applyEvent = useCallback(
    (event: ChatEvent) => {
      const { type, payload } = event;
      switch (type) {
        case 'init': {
          const data = payload as { agents: AgentMeta[] };
          setAgents(data.agents);
          setRuntime((prev) => {
            const next = { ...prev };
            for (const agent of data.agents) {
              if (!next[agent.id]) next[agent.id] = emptyRuntime();
            }
            return next;
          });
          setApiOnline(true);
          setConnected(true);
          break;
        }
        case 'log_added': {
          const entry = payload as LogEntry;
          if (entry.source === 'TED' || entry.source === 'SYSTEM') break;
          ensureRuntime(entry.source);
          setRuntime((prev) => ({
            ...prev,
            [entry.source]: {
              ...(prev[entry.source] ?? emptyRuntime()),
              liveBuffer: '',
              transcript: [entry, ...(prev[entry.source]?.transcript ?? [])].slice(0, 50),
            },
          }));
          break;
        }
        case 'agent_status': {
          const { agentId, status } = payload as { agentId: AgentId; status: AgentStatus };
          if (agentId === 'ted') {
            setTedStatus(status);
            break;
          }
          ensureRuntime(agentId);
          setRuntime((prev) => ({
            ...prev,
            [agentId]: { ...(prev[agentId] ?? emptyRuntime()), status },
          }));
          break;
        }
        case 'agent_stream_chunk': {
          const { agentId, delta } = payload as { agentId: AgentId; delta: string };
          ensureRuntime(agentId);
          setRuntime((prev) => ({
            ...prev,
            [agentId]: {
              ...(prev[agentId] ?? emptyRuntime()),
              liveBuffer: (prev[agentId]?.liveBuffer ?? '') + delta,
            },
          }));
          break;
        }
        case 'workflow_created':
        case 'workflow_updated': {
          const wf = payload as Workflow;
          setWorkflow(wf);
          setPendingApproval(wf.steps.find((s) => s.status === 'override_requested') ?? null);
          break;
        }
        case 'ted_reply': {
          const { text } = payload as { text: string; workflowId?: string };
          setTedStatus('idle');
          setMessages((prev) => [...prev, { role: 'assistant', content: text, timestamp: new Date().toISOString() }]);
          break;
        }
        case 'api_online': {
          setApiOnline(true);
          setConnected(true);
          break;
        }
        default:
          break;
      }
    },
    [ensureRuntime]
  );

  useEffect(() => {
    let cancelled = false;

    Promise.all([apiFetch('/api/agents'), apiFetch('/api/status')])
      .then(async ([agentsRes, statusRes]) => {
        if (cancelled) return;
        if (agentsRes.ok) {
          const list = (await agentsRes.json()) as AgentMeta[];
          applyEvent({ type: 'init', payload: { agents: list } });
        }
        if (statusRes.ok) {
          setApiOnline(true);
          setConnected(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setConnected(false);
          setApiOnline(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [applyEvent]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const nextMessages: ChatTurn[] = [
        ...messagesRef.current,
        { role: 'user', content: trimmed, timestamp: new Date().toISOString() },
      ];
      setMessages(nextMessages);
      setTedStatus('thinking');

      try {
        const response = await apiFetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history: nextMessages,
            workflow: workflowRef.current,
            pendingApproval: pendingApprovalRef.current,
          }),
        });

        if (!response.ok || !response.body) {
          const textBody = await response.text();
          throw new Error(textBody || `Request failed with ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parsed = parseChunk(buffer);
          buffer = parsed.rest;
          for (const event of parsed.events) applyEvent(event);
        }

        if (buffer.trim()) {
          try {
            applyEvent(JSON.parse(buffer) as ChatEvent);
          } catch {
            // ignore trailing fragments
          }
        }
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `TED could not complete that turn: ${error instanceof Error ? error.message : String(error)}`,
            timestamp: new Date().toISOString(),
          },
        ]);
        setTedStatus('idle');
        setConnected(false);
      }
    },
    [applyEvent]
  );

  const resolveApproval = useCallback(
    (stepId: string, action: 'approve' | 'reject' | 'modify', modifiedInput?: string) => {
      const step = workflowRef.current?.steps.find((item) => item.id === stepId) ?? pendingApprovalRef.current;
      if (!step) return;

      let text = '';
      if (action === 'approve') {
        text = `Owner approved ${step.taskName}. Proceed with the delegated task using the existing instructions.`;
      } else if (action === 'reject') {
        text = `Owner rejected ${step.taskName}. Do not proceed. Describe a safer alternative and replan the task.`;
      } else {
        text = `Owner modified ${step.taskName}. Replace the instructions with: ${modifiedInput ?? ''}`;
      }

      void sendMessage(text);
    },
    [sendMessage]
  );

  return {
    agents,
    connected: connected || apiOnline,
    runtime,
    tedStatus,
    messages,
    workflow,
    pendingApproval,
    sendMessage,
    resolveApproval,
  };
}
