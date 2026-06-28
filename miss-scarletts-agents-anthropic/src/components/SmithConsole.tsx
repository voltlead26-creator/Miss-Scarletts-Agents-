import { useEffect, useRef, useState } from 'react';
import { Shield, Mic, Send, MessagesSquare } from 'lucide-react';
import Brain from './Brain';
import type { AgentStatus } from '../hooks/useAgentSystem';
import type { ChatTurn } from '../types';

interface SmithConsoleProps {
  status: AgentStatus;
  messages: ChatTurn[];
  onSend: (text: string) => void;
}

const STATUS_LABEL: Record<AgentStatus, string> = {
  idle: 'SMITH.STANDBY',
  thinking: 'SMITH.DELEGATING',
  speaking: 'SMITH.RESPONDING',
  blocked: 'SMITH.HOLDING',
};

export default function SmithConsole({ status, messages, onSend }: SmithConsoleProps) {
  const [draft, setDraft] = useState('');
  const [transcriptOpen, setTranscriptOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const submit = () => {
    if (!draft.trim()) return;
    onSend(draft);
    setDraft('');
  };

  return (
    <div className="relative flex h-full min-h-0 items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex h-full min-h-0 w-full items-center justify-center py-0">
          <Brain size="xl" variant="core" accent="#22d3ee" BadgeIcon={Shield} status={status} />
        </div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-cyan-200">
        {STATUS_LABEL[status]}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 px-4 pb-2">
        <div className="flex w-full max-w-xl items-center justify-between px-2">
          <button
            type="button"
            onClick={() => setTranscriptOpen((value) => !value)}
            className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-100"
          >
            <MessagesSquare size={12} />
            Transcript
          </button>
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
            {messages.length} turns
          </div>
        </div>

        {transcriptOpen && (
          <div
            ref={scrollRef}
            className="flex w-full max-w-xl max-h-[30vh] min-h-[112px] flex-col gap-3 overflow-y-auto rounded-xl border border-cyan-500/20 bg-slate-950/88 px-3 py-3 shadow-[0_0_32px_rgba(34,211,238,0.08)] backdrop-blur"
          >
            {messages.length === 0 && (
              <p className="mt-1 text-center text-sm text-slate-500">
                Tell Smith what you need. It will pull in specialists on its own where it has to.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-6 ${
                  m.role === 'user'
                    ? 'self-end border border-cyan-500/30 bg-cyan-500/10 text-cyan-50'
                    : 'self-start border border-slate-800 bg-slate-900 text-slate-200'
                }`}
              >
                {m.content}
              </div>
            ))}
            {status === 'thinking' && (
              <div className="max-w-[85%] self-start rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-sm leading-6 text-cyan-100">
                Smith is analysing intent and selecting the right specialist agents
                <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-cyan-300 align-middle" />
              </div>
            )}
          </div>
        )}

        <div className="w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 shadow-[0_0_40px_rgba(2,6,23,0.55)] backdrop-blur">
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              placeholder="Talk to Smith…"
              className="min-h-[40px] flex-1 resize-none rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-500/50"
            />
            <button
              type="button"
              title="Voice input isn't wired up yet — text only for now"
              disabled
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 text-slate-600"
            >
              <Mic size={16} />
            </button>
            <button
              type="button"
              onClick={submit}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
