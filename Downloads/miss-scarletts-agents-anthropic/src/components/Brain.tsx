import React from 'react';
import type { ComponentType } from 'react';
import type { AgentStatus } from '../hooks/useAgentSystem';

interface BrainProps {
  size?: 'xl' | 'lg' | 'sm';
  accent?: string;
  BadgeIcon?: ComponentType<{ size?: number; color?: string }>;
  status?: AgentStatus;
  variant?: 'core' | 'agent';
}

export const Brain: React.FC<BrainProps> = ({ accent = '#22d3ee', status = 'idle' }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-2xl shadow-cyan-950/50">
      {/* Scoped CSS Styles for 3D spinning animations */}
      <style>{`
        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-counterclockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes core-pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .reactor-plane-1 {
          /* Matches the 3D tilt of the outer rings in the image */
          transform: rotateX(72deg) rotateY(15deg) rotateZ(0deg);
          transform-style: preserve-3d;
        }
        .reactor-plane-2 {
          /* Matches the 3D tilt of the inner rings in the image */
          transform: rotateX(65deg) rotateY(-10deg) rotateZ(0deg);
          transform-style: preserve-3d;
        }
        .spin-cw {
          animation: spin-clockwise 25s linear infinite;
        }
        .spin-ccw {
          animation: spin-counterclockwise 18s linear infinite;
        }
        .pulse-glow {
          animation: core-pulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Main Holographic Brain & Console Image */}
      <img
        src="/brain.png"
        alt="Central Brain Interface"
        className="w-full h-full object-cover opacity-90 select-none pointer-events-none"
      />

      {/* Ambient Grid and Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

      {/* Interactive HUD Overlays */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-400/60 space-y-1 select-none">
        <div>SYSTEM: ONLINE</div>
        <div>COGNITIVE_CORE: 98.4%</div>
        <div>REACTOR_LOAD: NOMINAL</div>
      </div>
      <div className="absolute top-4 right-4 font-mono text-[10px] text-cyan-400/60 text-right space-y-1 select-none">
        <div>SECURE_LINK: ACTIVE</div>
        <div>MODEL_NODE: SONNET_3.5</div>
        <div>COGNITIVE_DRIFT: 0.00%</div>
      </div>

      {/* Tilted 3D Holographic Spinning Rings */}
      {/* Aligned precisely with the glowing white sphere at (40% top, 50% left) */}
      <div
        className="absolute w-[80%] h-[80%] pointer-events-none"
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          perspective: '1000px',
        }}
      >
        {/* Outer Ring Animation Layer */}
        <div className="absolute inset-0 flex items-center justify-center reactor-plane-1">
          <div className="relative w-[76%] h-[76%] rounded-full border border-dashed border-cyan-400/40 spin-cw flex items-center justify-center">
            {/* Glowing energy pulses traveling along the outer ring */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
          </div>
        </div>

        {/* Inner Ring Animation Layer */}
        <div className="absolute inset-0 flex items-center justify-center reactor-plane-2">
          <div className="relative w-[62%] h-[62%] rounded-full border border-double border-cyan-400/30 spin-ccw flex items-center justify-center">
            {/* Energy pulses traveling along the inner ring */}
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>
        </div>

        {/* Central Glowing Core Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-cyan-300/10 blur-xl pulse-glow" />
        </div>
      </div>

      {/* Cybernetic bracket overlays at corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/40 rounded-tl" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/40 rounded-tr" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/40 rounded-bl" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/40 rounded-br" />
    </div>
  );
};

export default Brain;
