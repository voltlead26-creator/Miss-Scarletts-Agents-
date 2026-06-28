import React from 'react';
import type { ComponentType } from 'react';
import type { AgentStatus } from '../hooks/useAgentSystem';

interface BrainProps {
  size?: 'xl' | 'lg' | 'sm';
  accent?: string;
  BadgeIcon?: ComponentType<{ size?: number; color?: string; className?: string }>;
  status?: AgentStatus;
  variant?: 'core' | 'agent';
}

const SIZE_CLASS: Record<NonNullable<BrainProps['size']>, string> = {
  xl: 'w-[min(78vh,72vw,860px)]',
  lg: 'w-[min(62vh,58vw,680px)]',
  sm: 'w-[72px]',
};

const STATUS_TUNING: Record<AgentStatus, { glow: string; speed: string; pulse: string; opacity: string }> = {
  idle: { glow: '0.68', speed: '26s', pulse: '5.2s', opacity: '0.72' },
  thinking: { glow: '0.42', speed: '12s', pulse: '3.2s', opacity: '0.86' },
  speaking: { glow: '0.95', speed: '18s', pulse: '2.3s', opacity: '1' },
  blocked: { glow: '0.78', speed: '9s', pulse: '1.9s', opacity: '0.96' },
};

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

export const Brain: React.FC<BrainProps> = ({
  size = 'lg',
  accent = '#22d3ee',
  BadgeIcon,
  status = 'idle',
  variant = 'agent',
}) => {
  const rgb = hexToRgb(accent);
  const tuning = STATUS_TUNING[status];
  const isCore = variant === 'core';
  const iconSize = isCore ? 22 : 14;
  const meshOpacity = isCore ? '0.82' : '0.9';

  return (
    <div
      className={`smith-brain relative aspect-square shrink-0 ${SIZE_CLASS[size]} ${isCore ? 'max-w-none' : ''}`}
      style={
        {
          '--brain-r': rgb.r,
          '--brain-g': rgb.g,
          '--brain-b': rgb.b,
          '--brain-accent': accent,
          '--brain-glow': tuning.glow,
          '--ring-speed': tuning.speed,
          '--pulse-speed': tuning.pulse,
          '--brain-opacity': tuning.opacity,
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes smith-ring-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes smith-ring-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes smith-core-glow {
          0%, 100% {
            opacity: calc(var(--brain-glow) * 0.55);
            transform: translate(-50%, -50%) scale(0.94);
          }
          50% {
            opacity: var(--brain-glow);
            transform: translate(-50%, -50%) scale(1.08);
          }
        }

        @keyframes smith-signal {
          0%, 100% { opacity: 0.38; }
          50% { opacity: 1; }
        }

        .smith-brain__ring {
          transform-origin: 50% 50%;
          animation-duration: var(--ring-speed);
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        .smith-brain__ring--cw {
          animation-name: smith-ring-cw;
        }

        .smith-brain__ring--ccw {
          animation-name: smith-ring-ccw;
          animation-duration: calc(var(--ring-speed) * 0.72);
        }

        .smith-brain__glow {
          animation: smith-core-glow var(--pulse-speed) ease-in-out infinite;
          background:
            radial-gradient(circle, rgba(255,255,255,0.72) 0 10%, rgba(var(--brain-r), var(--brain-g), var(--brain-b),0.58) 20%, rgba(var(--brain-r), var(--brain-g), var(--brain-b),0.18) 46%, transparent 70%);
          filter: blur(18px);
        }

        .smith-brain__spark {
          animation: smith-signal calc(var(--pulse-speed) * 0.7) ease-in-out infinite;
        }
      `}</style>

      <div
        className={`absolute inset-0 rounded-full ${
          isCore ? 'bg-[radial-gradient(circle,rgba(15,23,42,0.18),transparent_62%)]' : ''
        }`}
      />

      <div className="smith-brain__glow pointer-events-none absolute left-1/2 top-[45%] h-[48%] w-[58%] rounded-full" />

      <svg
        viewBox="0 0 640 640"
        className="relative z-10 h-full w-full overflow-visible"
        role="img"
        aria-label={isCore ? 'Agent Smith central intelligence brain' : 'Specialist agent brain'}
      >
        <defs>
          <filter id={`softGlow-${variant}-${size}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation={isCore ? '7' : '4'} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.2  0 0 0 0 0.9  0 0 0 0 1  0 0 0 1 0"
              result="colorBlur"
            />
            <feMerge>
              <feMergeNode in="colorBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`brainStroke-${variant}-${size}`} x1="100" y1="120" x2="540" y2="430">
            <stop offset="0%" stopColor="rgba(255,255,255,0.88)" />
            <stop offset="44%" stopColor={accent} />
            <stop offset="100%" stopColor="rgba(244,114,182,0.72)" />
          </linearGradient>
        </defs>

        <g opacity={meshOpacity} filter={`url(#softGlow-${variant}-${size})`}>
          <path
            d="M119 300 C83 232 121 150 211 126 C258 70 349 72 401 120 C476 126 536 194 526 274 C559 330 515 405 431 424 C369 486 257 484 203 422 C137 417 94 363 119 300 Z"
            fill={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isCore ? 0.1 : 0.18})`}
            stroke={`url(#brainStroke-${variant}-${size})`}
            strokeWidth={isCore ? 5 : 8}
          />
          <path
            d="M199 423 C189 359 218 304 283 278 C246 218 271 154 338 128 C321 197 342 248 395 282 C363 318 348 368 373 427"
            fill="none"
            stroke={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.72)`}
            strokeWidth={isCore ? 4 : 6}
          />
          <path
            d="M129 296 C203 256 258 251 321 296 C389 249 453 256 519 289"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={isCore ? 3 : 5}
          />
          <path
            d="M183 181 L276 279 L210 364 L339 293 L450 380 M264 137 L396 282 L492 213 M160 338 L292 349 L419 156 M225 417 L322 296 L430 424"
            fill="none"
            stroke={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.62)`}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isCore ? 3 : 5}
          />
          {[183, 276, 210, 339, 450, 264, 396, 492, 160, 292, 419, 225, 322, 430].map((x, index) => {
            const ys = [181, 279, 364, 293, 380, 137, 282, 213, 338, 349, 156, 417, 296, 424];
            return (
              <circle
                key={`${x}-${index}`}
                className="smith-brain__spark"
                cx={x}
                cy={ys[index]}
                r={isCore ? 5 : 7}
                fill={index % 5 === 0 ? 'rgba(244,114,182,0.96)' : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.98)`}
                style={{ animationDelay: `${index * 0.13}s` }}
              />
            );
          })}
        </g>

        {isCore && (
          <g transform="translate(320 354) rotate(-12) scale(1 0.34) translate(-320 -354)">
            <ellipse
              className="smith-brain__ring smith-brain__ring--cw"
              cx="320"
              cy="354"
              rx="262"
              ry="92"
              fill="none"
              stroke="rgba(226,232,240,0.45)"
              strokeWidth="18"
              strokeDasharray="84 34"
            />
            <ellipse
              className="smith-brain__ring smith-brain__ring--ccw"
              cx="320"
              cy="354"
              rx="210"
              ry="66"
              fill="none"
              stroke={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.66)`}
              strokeWidth="13"
              strokeDasharray="48 22"
            />
            <ellipse
              className="smith-brain__ring smith-brain__ring--cw"
              cx="320"
              cy="354"
              rx="142"
              ry="42"
              fill="none"
              stroke="rgba(196,181,253,0.46)"
              strokeWidth="8"
              strokeDasharray="30 18"
              style={{ animationDuration: `calc(var(--ring-speed) * 0.56)` }}
            />
          </g>
        )}

        <circle
          cx="320"
          cy={isCore ? '354' : '344'}
          r={isCore ? '42' : '28'}
          fill={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isCore ? 0.28 : 0.22})`}
          stroke="rgba(255,255,255,0.52)"
          strokeWidth={isCore ? 3 : 4}
        />

        {BadgeIcon && !isCore && (
          <foreignObject x="272" y="296" width="96" height="96">
            <div className="flex h-full w-full items-center justify-center">
              <BadgeIcon size={iconSize} color={accent} />
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

export default Brain;
