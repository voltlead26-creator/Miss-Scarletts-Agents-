import React, { useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import '../lib/NeuralCore.js';
import type { AgentStatus } from '../hooks/useAgentSystem';

interface NeuralCoreInstance {
  start(): void;
  stop(): void;
  setMode(mode: string): void;
  setAccent(hex: string): void;
  pulse(amount?: number): void;
}

interface NeuralCoreConstructor {
  new (
    canvas: HTMLCanvasElement,
    options?: { accentColor?: string; intensity?: number; mode?: string; autoCycle?: boolean }
  ): NeuralCoreInstance;
}

declare global {
  interface Window {
    NeuralCore?: NeuralCoreConstructor;
  }
}

interface BrainProps {
  size?: 'xl' | 'lg' | 'sm';
  accent?: string;
  BadgeIcon?: ComponentType<{ size?: number; color?: string; className?: string }>;
  status?: AgentStatus;
  variant?: 'core' | 'agent';
}

const SIZE_CLASS: Record<NonNullable<BrainProps['size']>, string> = {
  xl: 'w-[min(78vh,72vw,880px)]',
  lg: 'w-[min(62vh,58vw,700px)]',
  sm: 'w-[72px]',
};

const STATUS_TUNING: Record<AgentStatus, { glow: number; speed: number; pulse: number; line: number }> = {
  idle: { glow: 0.58, speed: 0.18, pulse: 0.75, line: 0.78 },
  thinking: { glow: 0.34, speed: 0.48, pulse: 1.15, line: 0.95 },
  speaking: { glow: 0.96, speed: 0.28, pulse: 1.45, line: 1 },
  blocked: { glow: 0.72, speed: 0.62, pulse: 1.7, line: 0.95 },
};

// NeuralCore's own mode vocabulary is idle / thinking / working / writing.
// 'speaking' maps to 'writing' rather than 'working' because writing mode is
// themed around active output generation (a convergence glow toward one
// region) — which is literally what's happening while TED is streaming a
// reply. 'blocked' has no real equivalent, so it stays visually idle but
// recolors amber to flag "needs you" the same way the rest of the UI does.
const MODE_FOR_STATUS: Record<AgentStatus, 'idle' | 'thinking' | 'working' | 'writing'> = {
  idle: 'idle',
  thinking: 'thinking',
  speaking: 'writing',
  blocked: 'idle',
};

const BLOCKED_ACCENT = '#f59e0b';

function CoreBrainCanvas({ accent, status }: { accent: string; status: AgentStatus }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brainRef = useRef<NeuralCoreInstance | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const NeuralCoreCtor = window.NeuralCore;
    if (!canvas || !NeuralCoreCtor) return undefined;

    const brain = new NeuralCoreCtor(canvas, { accentColor: accent, intensity: 1.3 });
    brainRef.current = brain;
    brain.start();

    return () => {
      brain.stop();
      brainRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const brain = brainRef.current;
    if (!brain) return;
    brain.setMode(MODE_FOR_STATUS[status]);
    brain.setAccent(status === 'blocked' ? BLOCKED_ACCENT : accent);
  }, [status, accent]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized.padEnd(6, '0').slice(0, 6);
  const number = Number.parseInt(value, 16);
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
}

function AgentBrain({ accent, BadgeIcon, status }: Pick<BrainProps, 'accent' | 'BadgeIcon' | 'status'>) {
  const rgb = hexToRgb(accent ?? '#22d3ee');
  const tuning = STATUS_TUNING[status ?? 'idle'];
  const iconSize = 14;

  return (
    <div
      className="smith-mini-brain relative aspect-square w-[72px] shrink-0"
      style={
        {
          '--mini-r': rgb.r,
          '--mini-g': rgb.g,
          '--mini-b': rgb.b,
          '--mini-glow': tuning.glow,
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes mini-pulse {
          0%, 100% { opacity: calc(var(--mini-glow) * 0.42); transform: translate(-50%, -50%) scale(0.9); }
          50% { opacity: var(--mini-glow); transform: translate(-50%, -50%) scale(1.08); }
        }
        .smith-mini-brain__glow {
          animation: mini-pulse 4s ease-in-out infinite;
          background: radial-gradient(circle, rgba(var(--mini-r), var(--mini-g), var(--mini-b),0.52), transparent 68%);
        }
      `}</style>
      <div className="smith-mini-brain__glow absolute left-1/2 top-1/2 h-[88%] w-[88%] rounded-full blur-md" />
      <svg viewBox="0 0 120 120" className="relative z-10 h-full w-full overflow-visible">
        <path
          d="M21 58 C13 41 24 23 43 25 C53 10 75 15 80 31 C100 34 108 53 97 69 C101 88 77 101 62 88 C43 104 20 88 28 69 C22 67 19 63 21 58 Z"
          fill="none"
          stroke={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.86)`}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M30 57 L49 39 L62 57 L82 38 M34 73 L58 62 L78 79 M50 28 L64 57 L54 91"
          fill="none"
          stroke="rgba(236,254,255,0.58)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[30, 49, 62, 82, 34, 58, 78, 50, 54].map((x, index) => {
          const ys = [57, 39, 57, 38, 73, 62, 79, 28, 91];
          return <circle key={`${x}-${index}`} cx={x} cy={ys[index]} r="3.5" fill={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.95)`} />;
        })}
        {BadgeIcon && (
          <foreignObject x="42" y="42" width="36" height="36">
            <div className="flex h-full w-full items-center justify-center">
              <BadgeIcon size={iconSize} color={accent} />
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
}

export const Brain: React.FC<BrainProps> = ({
  size = 'lg',
  accent = '#22d3ee',
  BadgeIcon,
  status = 'idle',
  variant = 'agent',
}) => {
  if (variant !== 'core') {
    return <AgentBrain accent={accent} BadgeIcon={BadgeIcon} status={status} />;
  }

  return (
    <div className={`relative aspect-square shrink-0 ${SIZE_CLASS[size]}`}>
      <CoreBrainCanvas accent={accent} status={status} />
    </div>
  );
};

export default Brain;
