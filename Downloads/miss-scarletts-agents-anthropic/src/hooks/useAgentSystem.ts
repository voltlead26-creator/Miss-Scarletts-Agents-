import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AgentId,
  AgentMeta,
  ChatTurn,
  LogEntry,
  Workflow,
  WorkflowStep,
} from '../types';

export type AgentStatus = 'idle' | 'thinking' | 'speaking' | 'blocked';

export interface AgentRuntime {
  status: AgentStatus;
  liveBuffer: string;
  transcript: LogEntry[];
}

function emptyRuntime(): AgentRuntime {
  return { status: 'idle', liveBuffer: '', transcript: [] };
}

function apiUrl(path: string) {
  const origin = import.meta.env.VITE_API_ORIGIN?.trim();
  return origin ? new URL(path, origin).toString() : path;
}

function wsUrl() {
  const origin = import.meta.env.VITE_WS_ORIGIN?.trim() || import.meta.env.VITE_API_ORIGIN?.trim();
  if (origin) {
    const resolved = new URL(origin);
    resolved.protocol = resolved.protocol === 'https:' ? 'wss:' : 'ws:';
    resolved.pathname = '/ws';
    resolved.search = '';
    resolved.hash = '';
    return resolved.toString();
  }
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}/ws`;
}

export function useAgentSystem() {
  const [agents, setAgents] = useState<AgentMeta[]>([]);
  const [connected, setConnected] = useState(false);
  const [runtime, setRuntime] = useState<Record<string, AgentRuntime>>({});
  const [smithStatus, setSmithStatus] = useState<AgentStatus>('idle');
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [pendingApproval, setPendingApproval] = useState<WorkflowStep | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  const ensureRuntime = useCallback((id: string) => {
    setRuntime((prev) => (prev[id] ? prev : { ...prev, [id]: emptyRuntime() }));
  }, []);

  useEffect(() => {
    fetch(apiUrl('/api/agents'))
      .then((r) => r.json())
      .then((list: AgentMeta[]) => {
        setAgents(list);
        setRuntime((prev) => {
          const next = { ...prev };
          for (const a of list) if (!next[a.id]) next[a.id] = emptyRuntime();
          return next;
        });
      })
      .catch(() => {
        // The menu's Status tab surfaces this; the brains just stay dim.
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let retryDelay = 1000;
    let socket: WebSocket | null = null;

    function connect() {
      if (cancelled) return;
      socket = new WebSocket(wsUrl());
      wsRef.current = socket;

      socket.onopen = () => {
        setConnected(true);
        retryDelay = 1000;
      };

      socket.onclose = () => {
        setConnected(false);
        if (!cancelled) {
          setTimeout(connect, retryDelay);
          retryDelay = Math.min(retryDelay * 1.5, 10000);
        }
      };

      socket.onmessage = (event) => {
        const { type, payload } = JSON.parse(event.data);

        switch (type) {
          case 'init': {
            setAgents(payload.agents);
            setRuntime((prev) => {
              const next = { ...prev };
              for (const a of payload.agents as AgentMeta[]) {
                if (!next[a.id]) next[a.id] = emptyRuntime();
              }
              return next;
            });
            break;
          }
          case 'log_added': {
            const entry: LogEntry = payload;
            if (entry.source === 'SMITH' || entry.source === 'SYSTEM') break;
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
            if (agentId === 'smith') {
              setSmithStatus(status);
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
            const wf: Workflow = payload;
            setWorkflow(wf);
            const blocked = wf.steps.find((s) => s.status === 'override_requested') ?? null;
            setPendingApproval(blocked);
            break;
          }
          case 'smith_reply': {
            const { text } = payload as { text: string; workflowId: string };
            setSmithStatus('idle');
            setMessages((prev) => [...prev, { role: 'assistant', content: text, timestamp: new Date().toISOString() }]);
            break;
          }
          default:
            break;
        }
      };
    }

    connect();
    return () => {
      cancelled = true;
      socket?.close();
    };
  }, [ensureRuntime]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: 'user', content: trimmed, timestamp: new Date().toISOString() }]);
    setSmithStatus('thinking');
    fetch(apiUrl('/api/chat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed }),
    }).catch(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Couldn't reach the server. Is `npm run dev` running?", timestamp: new Date().toISOString() },
      ]);
      setSmithStatus('idle');
    });
  }, []);

  const resolveApproval = useCallback(
    (stepId: string, action: 'approve' | 'reject' | 'modify', modifiedInput?: string) => {
      fetch(apiUrl(`/api/approval/${stepId}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, modifiedInput }),
      });
    },
    []
  );

  return { agents, connected, runtime, smithStatus, messages, workflow, pendingApproval, sendMessage, resolveApproval };
}
