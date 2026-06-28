import { useState } from 'react';
import type { ComponentType } from 'react';
import { ChevronDown, Check, X, Pencil } from 'lucide-react';
import Brain from './Brain';
import type { AgentRuntime } from '../hooks/useAgentSystem';
import type { AgentMeta, WorkflowStep } from '../types';

const STATUS_LABEL: Record<string, string> = {
  idle: 'Idle',
  thinking: 'Thinking…',
  speaking: 'Responding…',
  blocked: 'Awaiting approval',
};

interface AgentPodProps {
  meta: AgentMeta;
  Icon: ComponentType<{ size?: number; color?: string; className?: string }>;
  runtime: AgentRuntime;
  side: 'left' | 'right';
  pendingStep: WorkflowStep | null;
  onResolve: (stepId: string, action: 'approve' | 'reject' | 'modify', modifiedInput?: string) => void;
}

export default function AgentPod({ meta, Icon, runtime, side, pendingStep, onResolve }: AgentPodProps) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState('');
  const isBlocked = runtime.status === 'blocked' && pendingStep;
  const open = expanded || Boolean(isBlocked);

  const preview = runtime.liveBuffer || runtime.transcript[0]?.message || '';
  const color = runtime.status === 'blocked' ? '#f59e0b' : meta.accent;

  return (
    <div className={`relative flex items-center gap-0 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
      <Brain size="sm" accent={meta.accent} BadgeIcon={Icon} status={runtime.status} />

      {/* persistent compact bubble — always visible, this is the "little chat box" */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`relative w-36 shrink-0 rounded-lg border px-2.5 py-1.5 text-left transition ${
          side === 'right' ? '-mr-1' : '-ml-1'
        }`}
        style={{ borderColor: `${color}55`, backgroundColor: 'rgba(2,6,23,0.85)' }}
      >
        {/* pointer triangle toward the brain */}
        <span
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rotate-45"
          style={{
            backgroundColor: 'rgba(2,6,23,0.85)',
            borderLeft: side === 'right' ? 'none' : `1px solid ${color}55`,
            borderBottom: side === 'right' ? 'none' : `1px solid ${color}55`,
            borderRight: side === 'right' ? `1px solid ${color}55` : 'none',
            borderTop: side === 'right' ? `1px solid ${color}55` : 'none',
            left: side === 'right' ? undefined : -4,
            right: side === 'right' ? -4 : undefined,
          }}
        />
        <div className="text-[11px] font-semibold text-slate-200">{meta.name}</div>
        <div className="text-[9px] uppercase tracking-wide" style={{ color }}>
          {STATUS_LABEL[runtime.status]}
        </div>
        {preview && (
          <p className="mt-0.5 truncate text-[10px] text-slate-500">{preview}</p>
        )}
      </button>

      {open && (
        <div
          className={`absolute top-0 z-40 w-72 rounded-lg border border-slate-800 bg-slate-950/95 p-3 shadow-2xl backdrop-blur ${
            side === 'right' ? 'right-full mr-2' : 'left-full ml-2'
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-200">{meta.name} — live transcript</span>
            {!isBlocked && (
              <button onClick={() => setExpanded(false)} className="text-slate-500 hover:text-slate-300">
                <ChevronDown size={14} />
              </button>
            )}
          </div>

          {isBlocked && pendingStep && (
            <div className="mt-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                Approval required
              </div>
              <div className="mt-1 text-xs text-slate-200">{pendingStep.taskName}</div>
              <p className="mt-1 max-h-20 overflow-y-auto text-[11px] leading-5 text-slate-400">{pendingStep.input}</p>
              <div className="mt-2 flex gap-1.5">
                <button
                  onClick={() => onResolve(pendingStep.id, 'approve')}
                  className="flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-200 hover:bg-emerald-500/20"
                >
                  <Check size={12} /> Approve
                </button>
                <button
                  onClick={() => onResolve(pendingStep.id, 'reject')}
                  className="flex items-center gap-1 rounded-md border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-[11px] text-rose-200 hover:bg-rose-500/20"
                >
                  <X size={12} /> Reject
                </button>
              </div>
              <div className="mt-2 flex gap-1.5">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Edit the instructions instead…"
                  className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-200 outline-none focus:border-cyan-500/50"
                />
                <button
                  disabled={!draft.trim()}
                  onClick={() => {
                    onResolve(pendingStep.id, 'modify', draft);
                    setDraft('');
                  }}
                  className="flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1 text-[11px] text-slate-300 disabled:opacity-40"
                >
                  <Pencil size={12} /> Send
                </button>
              </div>
            </div>
          )}

          <div className="mt-2 max-h-48 space-y-2 overflow-y-auto pr-1">
            {runtime.liveBuffer && (
              <p className="text-xs leading-5 text-slate-200">
                {runtime.liveBuffer}
                <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-cyan-400 align-middle" />
              </p>
            )}
            {runtime.transcript.length === 0 && !runtime.liveBuffer && (
              <p className="text-xs text-slate-600">No activity yet.</p>
            )}
            {runtime.transcript.map((entry) => (
              <div key={entry.id} className="border-t border-slate-900 pt-2 first:border-t-0 first:pt-0">
                <div className="text-[10px] text-slate-500">{new Date(entry.timestamp).toLocaleTimeString()}</div>
                <p className="text-xs leading-5 text-slate-300">{entry.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
