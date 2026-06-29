import { useEffect, useState } from 'react';
import { X, ChevronDown, RefreshCw } from 'lucide-react';
import type { AgentMeta, Workflow } from '../types';
import { apiUrl } from '../lib/api';

interface MenuDrawerProps {
  open: boolean;
  onClose: () => void;
  agents: AgentMeta[];
  workflow: Workflow | null;
  connected: boolean;
}

type Tab = 'agents' | 'history' | 'status';

function ReadmeAccordion({ agent }: { agent: AgentMeta }) {
  const [openText, setOpenText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (openText !== null) {
      setOpenText(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/agents/${agent.id}/readme`));
      setOpenText(await res.text());
    } catch {
      setOpenText('Could not load this README.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-slate-800">
      <button onClick={toggle} className="flex w-full items-center justify-between py-2.5 text-left">
        <span className="flex items-center gap-2 text-sm text-slate-200">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: agent.accent }} />
          {agent.name}
        </span>
        <ChevronDown size={14} className={`text-slate-500 transition-transform ${openText !== null ? 'rotate-180' : ''}`} />
      </button>
      {openText !== null && (
        <pre className="mb-3 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-md bg-slate-950/70 p-3 text-[11px] leading-5 text-slate-400">
          {loading ? 'Loading…' : openText}
        </pre>
      )}
    </div>
  );
}

export default function MenuDrawer({ open, onClose, agents, workflow, connected }: MenuDrawerProps) {
  const [tab, setTab] = useState<Tab>('agents');
  const [status, setStatus] = useState<{ anthropicConfigured: boolean; tedModel: string; specialistModel: string } | null>(null);

  useEffect(() => {
    if (open && tab === 'status') {
      fetch(apiUrl('/api/status')).then((r) => r.json()).then(setStatus).catch(() => setStatus(null));
    }
  }, [open, tab]);

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-[380px] max-w-[90vw] border-l border-slate-800 bg-slate-950 transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">Menu</span>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-slate-800 text-xs">
          {(['agents', 'history', 'status'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 uppercase tracking-wide ${
                tab === t ? 'border-b-2 border-cyan-400 text-cyan-200' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="h-[calc(100%-104px)] overflow-y-auto p-4">
          {tab === 'agents' && (
            <div>
              <p className="mb-3 text-xs text-slate-500">
                This is each agent's README.md — edit the file to change what it knows or how it behaves. Read fresh
                on every call, no restart needed.
              </p>
              {agents.map((a) => (
                <ReadmeAccordion key={a.id} agent={a} />
              ))}
            </div>
          )}

          {tab === 'history' && (
            <div>
              {!workflow ? (
                <p className="text-sm text-slate-500">No conversation yet.</p>
              ) : (
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Current workflow</div>
                  <div className="mt-1 text-sm text-slate-200">{workflow.title}</div>
                  <div className="mt-1 text-xs text-slate-500">Status: {workflow.status}</div>
                  <div className="mt-3 space-y-2">
                    {workflow.steps.map((s) => (
                      <div key={s.id} className="rounded-md border border-slate-800 bg-slate-900/50 p-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-200">{s.taskName}</span>
                          <span className="text-slate-500">{s.status}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">{s.agentId}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'status' && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-md border border-slate-800 p-3">
                <span className="text-slate-400">Live API</span>
                <span className={connected ? 'text-emerald-400' : 'text-rose-400'}>
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-800 p-3">
                <span className="text-slate-400">Anthropic API key</span>
                <span className={status?.anthropicConfigured ? 'text-emerald-400' : 'text-amber-400'}>
                  {status === null ? '…' : status.anthropicConfigured ? 'Configured' : 'Not set'}
                </span>
              </div>
              {status && (
                <>
                  <div className="flex items-center justify-between rounded-md border border-slate-800 p-3 text-xs">
                    <span className="text-slate-500">TED model</span>
                    <span className="text-slate-300">{status.tedModel}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-slate-800 p-3 text-xs">
                    <span className="text-slate-500">Specialist model</span>
                    <span className="text-slate-300">{status.specialistModel}</span>
                  </div>
                </>
              )}
              <button
                onClick={() => fetch(apiUrl('/api/status')).then((r) => r.json()).then(setStatus)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
