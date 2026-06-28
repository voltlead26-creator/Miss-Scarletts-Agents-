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
  idle: { glow: '0.58', speed: '28s', pulse: '5.4s', opacity: '0.76' },
  thinking: { glow: '0.36', speed: '12s', pulse: '3.1s', opacity: '0.9' },
  speaking: { glow: '0.95', speed: '17s', pulse: '2.2s', opacity: '1' },
  blocked: { glow: '0.74', speed: '8s', pulse: '1.9s', opacity: '0.96' },
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
  const isCore = variant === 'core';
  const activeAccent = isCore ? '#38e8ff' : accent;
  const rgb = hexToRgb(activeAccent);
  const tuning = STATUS_TUNING[status];
  const iconSize = isCore ? 22 : 14;
  const meshOpacity = isCore ? '0.98' : '0.9';
  const brainPaths = [
    'M98 294 C72 242 96 171 166 142 C205 84 296 80 342 125 C409 104 494 150 517 222 C560 250 560 331 514 371 C489 440 403 458 349 421 C284 472 185 449 156 386 C105 377 76 334 98 294 Z',
    'M154 358 C128 312 140 244 195 214 C175 157 226 111 286 130 C317 82 386 108 394 169 C461 169 503 224 482 287 C522 327 493 391 433 391 C398 446 311 428 302 358 C241 392 184 391 154 358 Z',
    'M172 217 C227 188 285 199 322 246 C368 196 438 202 486 248',
    'M149 303 C218 268 282 280 336 332 C389 275 453 273 513 311',
    'M196 383 C230 331 277 312 332 340 C381 303 429 322 462 374',
    'M288 126 C278 196 303 238 358 270 C325 301 313 353 342 421',
    'M215 148 C254 220 255 293 215 375',
    'M432 166 C392 219 389 299 433 391',
  ];
  const neuralLinks = [
    'M154 266 L224 210 L292 248 L367 198 L455 236',
    'M139 321 L228 291 L325 331 L427 286 L509 316',
    'M190 389 L262 344 L336 378 L448 345',
    'M219 165 L286 230 L218 302 L322 274 L423 188',
    'M245 416 L329 340 L407 408',
    'M123 285 L211 356 L304 305 L390 354 L499 283',
  ];

  return (
    <div
      className={`smith-brain relative aspect-square shrink-0 ${SIZE_CLASS[size]} ${isCore ? 'max-w-none' : ''}`}
      style={
        {
          '--brain-r': rgb.r,
          '--brain-g': rgb.g,
          '--brain-b': rgb.b,
          '--brain-accent': activeAccent,
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
            opacity: calc(var(--brain-glow) * 0.45);
            transform: translate(-50%, -50%) scale(0.92);
          }
          50% {
            opacity: var(--brain-glow);
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes smith-signal {
          0%, 100% { opacity: 0.34; }
          50% { opacity: 1; }
        }

        @keyframes smith-trace {
          0% { stroke-dashoffset: 420; opacity: 0.22; }
          38% { opacity: 0.94; }
          100% { stroke-dashoffset: 0; opacity: 0.5; }
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
            radial-gradient(circle, rgba(var(--brain-r), var(--brain-g), var(--brain-b),0.48) 0 16%, rgba(var(--brain-r), var(--brain-g), var(--brain-b),0.24) 38%, transparent 72%);
          filter: blur(22px);
        }

        .smith-brain__spark {
          animation: smith-signal calc(var(--pulse-speed) * 0.7) ease-in-out infinite;
        }

        .smith-brain__trace {
          stroke-dasharray: 18 24;
          animation: smith-trace calc(var(--pulse-speed) * 2.4) linear infinite;
        }
      `}</style>

      <div
        className={`absolute inset-0 rounded-full ${
          isCore ? 'bg-[radial-gradient(circle,rgba(15,23,42,0.18),transparent_62%)]' : ''
        }`}
      />

      <div className="smith-brain__glow pointer-events-none absolute left-1/2 top-[38%] h-[46%] w-[62%] rounded-full" />

      <svg
        viewBox="0 0 640 640"
        className="relative z-10 h-full w-full overflow-visible"
        role="img"
        aria-label={isCore ? 'Agent Smith central intelligence brain' : 'Specialist agent brain'}
      >
        <defs>
          <filter id={`softGlow-${variant}-${size}`} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation={isCore ? '5.5' : '4'} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`brainStroke-${variant}-${size}`} x1="100" y1="120" x2="540" y2="430">
            <stop offset="0%" stopColor="rgba(236,254,255,0.96)" />
            <stop offset="48%" stopColor={activeAccent} />
            <stop offset="100%" stopColor="rgba(125,211,252,0.7)" />
          </linearGradient>
        </defs>

        {isCore && (
          <g opacity="0.88" filter={`url(#softGlow-${variant}-${size})`}>
            <path
              d="M94 470 C186 386 445 382 548 454"
              fill="none"
              stroke={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.16)`}
              strokeWidth="18"
              strokeLinecap="round"
            />
            <g transform="translate(320 432) rotate(-12) scale(1 0.34) translate(-320 -432)">
              <ellipse
                className="smith-brain__ring smith-brain__ring--cw"
                cx="320"
                cy="432"
                rx="288"
                ry="108"
                fill="none"
                stroke={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.66)`}
                strokeWidth="13"
                strokeDasharray="90 42"
              />
              <ellipse
                className="smith-brain__ring smith-brain__ring--ccw"
                cx="320"
                cy="432"
                rx="235"
                ry="78"
                fill="none"
                stroke="rgba(236,254,255,0.52)"
                strokeWidth="8"
                strokeDasharray="54 24"
              />
              <ellipse
                className="smith-brain__ring smith-brain__ring--cw"
                cx="320"
                cy="432"
                rx="158"
                ry="46"
                fill="none"
                stroke={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`}
                strokeWidth="6"
                strokeDasharray="28 18"
                style={{ animationDuration: `calc(var(--ring-speed) * 0.56)` }}
              />
            </g>
            <path
              className="smith-brain__trace"
              d="M88 438 C178 507 456 490 552 407"
              fill="none"
              stroke="rgba(236,254,255,0.5)"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </g>
        )}

        <g opacity={meshOpacity} filter={`url(#softGlow-${variant}-${size})`}>
          {brainPaths.map((path, index) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke={index === 0 ? `url(#brainStroke-${variant}-${size})` : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${index < 2 ? 0.8 : 0.52})`}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={index === 0 ? (isCore ? 6 : 8) : isCore ? 3.2 : 5}
            />
          ))}
          {neuralLinks.map((path, index) => (
            <path
              key={path}
              className="smith-brain__trace"
              d={path}
              fill="none"
              stroke={index % 3 === 0 ? 'rgba(236,254,255,0.66)' : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.72)`}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isCore ? 2.4 : 4}
              style={{ animationDelay: `${index * 0.42}s` }}
            />
          ))}
          {[
            [154, 266],
            [224, 210],
            [292, 248],
            [367, 198],
            [455, 236],
            [228, 291],
            [325, 331],
            [427, 286],
            [262, 344],
            [336, 378],
            [423, 188],
            [304, 305],
            [499, 283],
          ].map(([x, y], index) => (
            <circle
              key={`${x}-${y}`}
              className="smith-brain__spark"
              cx={x}
              cy={y}
              r={isCore ? 4.8 : 6.5}
              fill={index % 4 === 0 ? 'rgba(236,254,255,0.98)' : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.98)`}
              style={{ animationDelay: `${index * 0.17}s` }}
            />
          ))}
        </g>

        {isCore && (
          <g opacity="0.72" filter={`url(#softGlow-${variant}-${size})`}>
            <path
              d="M257 552 L383 552 M279 520 L361 520 M300 488 L340 488 M320 432 L320 552"
              fill="none"
              stroke={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.46)`}
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M198 574 C245 548 398 548 444 574"
              fill="none"
              stroke="rgba(236,254,255,0.35)"
              strokeLinecap="round"
              strokeWidth="5"
            />
          </g>
        )}

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
