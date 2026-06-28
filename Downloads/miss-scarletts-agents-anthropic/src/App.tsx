import { useState, type ComponentType } from 'react';
import {
  Menu,
  Cpu,
  Layers,
  Server,
  Database,
  FolderGit2,
  GitBranch,
  CheckCircle,
  ShieldAlert,
  UserCheck,
  Sliders,
  BarChart3,
  FileText,
} from 'lucide-react';

import { useAgentSystem } from './hooks/useAgentSystem';
import AgentPod from './components/AgentPod';
import SmithConsole from './components/SmithConsole';
import MenuDrawer from './components/MenuDrawer';
import type { AgentId } from './types';

const ICONS: Record<string, ComponentType<{ size?: number; color?: string; className?: string }>> = {
  Cpu,
  Layers,
  Server,
  Database,
  FolderGit2,
  GitBranch,
  CheckCircle,
  ShieldAlert,
  UserCheck,
  Sliders,
  BarChart3,
  FileText,
};

const LEFT_IDS: AgentId[] = ['coder', 'frontend', 'backend', 'supabase', 'netlify', 'devops'];
const RIGHT_IDS: AgentId[] = ['qa', 'security', 'accessibility', 'prompt-engineering', 'product-analytics', 'technical-writing'];

export default function App() {
  const { agents, connected, runtime, smithStatus, messages, workflow, pendingApproval, sendMessage, resolveApproval } =
    useAgentSystem();
  const [menuOpen, setMenuOpen] = useState(false);

  const specialists = agents.filter((a) => a.id !== 'smith');
  const byId = (id: AgentId) => specialists.find((a) => a.id === id);
  const leftAgents = LEFT_IDS.map(byId).filter(Boolean) as typeof specialists;
  const rightAgents = RIGHT_IDS.map(byId).filter(Boolean) as typeof specialists;

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
          <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-rose-500'}`} />
          Miss Scarlett's Agents
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center gap-1.5 rounded-md border border-slate-800 px-2.5 py-1.5 text-xs text-slate-400 hover:border-slate-600 hover:text-slate-200"
        >
          <Menu size={14} /> Menu
        </button>
      </header>

      <main className="relative grid min-h-0 flex-1 grid-cols-[minmax(190px,230px)_minmax(0,1.95fr)_minmax(190px,230px)] gap-2 overflow-hidden px-3 py-4">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {[12, 26, 40, 60, 74, 88].map((y) => (
            <line key={`l-${y}`} x1="50" y1="50" x2="0" y2={y} stroke="#22d3ee" strokeWidth="0.15" />
          ))}
          {[12, 26, 40, 60, 74, 88].map((y) => (
            <line key={`r-${y}`} x1="50" y1="50" x2="100" y2={y} stroke="#22d3ee" strokeWidth="0.15" />
          ))}
        </svg>

        <div className="relative z-10 flex flex-col items-start justify-center gap-3 overflow-visible">
          {leftAgents.map((meta) => (
            <AgentPod
              key={meta.id}
              meta={meta}
              Icon={ICONS[meta.icon] ?? Cpu}
              runtime={runtime[meta.id] ?? { status: 'idle', liveBuffer: '', transcript: [] }}
              side="left"
              pendingStep={pendingApproval && pendingApproval.agentId === meta.id ? pendingApproval : null}
              onResolve={resolveApproval}
            />
          ))}
        </div>

        <div className="relative z-10 min-h-0">
          <SmithConsole status={smithStatus} messages={messages} onSend={sendMessage} />
        </div>

        <div className="relative z-10 flex flex-col items-end justify-center gap-3 overflow-visible">
          {rightAgents.map((meta) => (
            <AgentPod
              key={meta.id}
              meta={meta}
              Icon={ICONS[meta.icon] ?? Cpu}
              runtime={runtime[meta.id] ?? { status: 'idle', liveBuffer: '', transcript: [] }}
              side="right"
              pendingStep={pendingApproval && pendingApproval.agentId === meta.id ? pendingApproval : null}
              onResolve={resolveApproval}
            />
          ))}
        </div>
      </main>

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        agents={agents}
        workflow={workflow}
        connected={connected}
      />
    </div>
  );
}
