import React, { useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import * as THREE from 'three';
import type { AgentStatus } from '../hooks/useAgentSystem';

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

const BRAIN_Y_OFFSET = 0.18;

function seededRandom(seed: number) {
  const next = Math.sin(seed * 12.9898) * 43758.5453;
  return next - Math.floor(next);
}

// ---------------------------------------------------------------------------
// Two hemispheres + cerebral cortex + dense dendritic network.
//
// Each hemisphere is built in two density tiers: a dense ring of "cortex"
// points tracing a gyrus-folded boundary (the visible brain surface), and a
// sparser interior fill of "white matter" points. The two hemispheres are
// generated independently (different seeds) rather than mirrored, so they
// read as organic rather than a perfect reflection. A deliberate gap is left
// at the midline (the longitudinal fissure); the only thing crossing it is a
// small explicit bundle of corpus-callosum links added afterward.
// ---------------------------------------------------------------------------

const CORTEX_PER_HEMISPHERE = 58;
const INTERIOR_PER_HEMISPHERE = 30;
const FISSURE_HALF_GAP = 0.16;

interface HemiPoint {
  point: [number, number, number];
  isCortex: boolean;
}

function buildHemisphere(sign: 1 | -1, seedBase: number): HemiPoint[] {
  const cx = sign * 1.3;
  const cy = 0.3;
  const out: HemiPoint[] = [];

  for (let i = 0; i < CORTEX_PER_HEMISPHERE; i += 1) {
    const theta = (i / CORTEX_PER_HEMISPHERE) * Math.PI * 2;
    const fold =
      1 +
      0.1 * Math.sin(5 * theta + seedBase * 1.7) +
      0.055 * Math.sin(9 * theta + seedBase * 2.6) +
      0.032 * Math.sin(13 * theta - seedBase * 1.3);
    const rx = 1.48 * fold;
    const ry = 1.5 * fold;
    const jitterX = (seededRandom(i + seedBase * 71) - 0.5) * 0.06;
    const jitterY = (seededRandom(i + seedBase * 113) - 0.5) * 0.06;
    let x = cx + Math.cos(theta) * rx * sign + jitterX;
    const y = cy + Math.sin(theta) * ry + jitterY;
    const z = (seededRandom(i + seedBase * 191) - 0.5) * 0.85;

    // keep the midline clear so the two hemispheres don't fuse
    if (sign === -1 && x > -FISSURE_HALF_GAP) x = -FISSURE_HALF_GAP - seededRandom(i + 7) * 0.1;
    if (sign === 1 && x < FISSURE_HALF_GAP) x = FISSURE_HALF_GAP + seededRandom(i + 7) * 0.1;

    out.push({ point: [x, y, z], isCortex: true });
  }

  for (let i = 0; i < INTERIOR_PER_HEMISPHERE; i += 1) {
    const theta = seededRandom(i + seedBase * 37) * Math.PI * 2;
    const radius = Math.sqrt(seededRandom(i + seedBase * 53)) * 0.92;
    let x = cx + Math.cos(theta) * radius * 1.3 * sign;
    const y = cy + Math.sin(theta) * radius * 1.35;
    const z = (seededRandom(i + seedBase * 233) - 0.5) * 0.6;

    if (sign === -1 && x > -FISSURE_HALF_GAP) x = -FISSURE_HALF_GAP - seededRandom(i + 13) * 0.15;
    if (sign === 1 && x < FISSURE_HALF_GAP) x = FISSURE_HALF_GAP + seededRandom(i + 13) * 0.15;

    out.push({ point: [x, y, z], isCortex: false });
  }

  return out;
}

function createNeuralPoints(): { points: Array<[number, number, number]>; cortexFlags: boolean[]; hemiOf: number[] } {
  const left = buildHemisphere(-1, 11);
  const right = buildHemisphere(1, 53);
  const all = [...left, ...right];
  return {
    points: all.map((p) => p.point),
    cortexFlags: all.map((p) => p.isCortex),
    hemiOf: [...left.map(() => 0), ...right.map(() => 1)],
  };
}

function distance2(a: [number, number, number], b: [number, number, number]) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz * 0.5;
}

function createNeuralLinks(points: Array<[number, number, number]>, hemiOf: number[]) {
  const links = new Set<string>();
  const add = (a: number, b: number) => {
    if (a === b) return;
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    links.add(key);
  };

  // dense nearest-neighbour wiring within each hemisphere
  points.forEach((point, index) => {
    const nearest = points
      .map((candidate, candidateIndex) => ({ candidateIndex, distance: distance2(candidate, point) }))
      .filter((item) => item.candidateIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 6);

    nearest.forEach((item) => {
      if (item.distance < 0.42 || seededRandom(index * 31 + item.candidateIndex) > 0.55) {
        add(index, item.candidateIndex);
      }
    });
  });

  // a small explicit corpus-callosum bundle bridging the two hemispheres —
  // the only thing allowed to cross the fissure
  const leftIdx = points.map((_, i) => i).filter((i) => hemiOf[i] === 0);
  const rightIdx = points.map((_, i) => i).filter((i) => hemiOf[i] === 1);
  const pairs: Array<{ a: number; b: number; d: number }> = [];
  leftIdx.forEach((a) => {
    rightIdx.forEach((b) => {
      pairs.push({ a, b, d: distance2(points[a], points[b]) });
    });
  });
  pairs.sort((p, q) => p.d - q.d);
  pairs.slice(0, 6).forEach(({ a, b }) => add(a, b));

  return Array.from(links).map((key) => key.split(':').map(Number) as [number, number]);
}

// short terminal stubs off real nodes, ending in empty space — this is what
// reads as "dendrites" rather than a plain node graph
function createDendriteStubs(points: Array<[number, number, number]>) {
  const segments: Array<[[number, number, number], [number, number, number]]> = [];
  points.forEach((point, index) => {
    const stubCount = seededRandom(index * 17 + 5) > 0.45 ? (seededRandom(index * 19 + 9) > 0.7 ? 2 : 1) : 0;
    for (let s = 0; s < stubCount; s += 1) {
      const angle = seededRandom(index * 23 + s * 41) * Math.PI * 2;
      const tilt = (seededRandom(index * 29 + s * 47) - 0.5) * Math.PI;
      const length = 0.1 + seededRandom(index * 37 + s * 53) * 0.16;
      const end: [number, number, number] = [
        point[0] + Math.cos(angle) * Math.cos(tilt) * length,
        point[1] + Math.sin(tilt) * length,
        point[2] + Math.sin(angle) * Math.cos(tilt) * length,
      ];
      segments.push([point, end]);
    }
  });
  return segments;
}

const { points: NODE_POINTS, hemiOf: HEMI_OF } = createNeuralPoints();
const LINKS = createNeuralLinks(NODE_POINTS, HEMI_OF);
const DENDRITE_SEGMENTS = createDendriteStubs(NODE_POINTS);

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

function makeCurve(points: THREE.Vector3[], segments = 80) {
  return new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(points).getPoints(segments));
}

function brainVector(point: [number, number, number]) {
  return new THREE.Vector3(point[0], point[1] + BRAIN_Y_OFFSET, point[2]);
}

function CoreBrainScene({ status }: { status: AgentStatus }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.12, 9.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const electric = new THREE.Color('#38e8ff');
    const white = new THREE.Color('#ecfeff');
    const brainGroup = new THREE.Group();
    const pedestalGroup = new THREE.Group();
    scene.add(brainGroup, pedestalGroup);

    const glowSprite = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(236,254,255,0.72)');
        gradient.addColorStop(0.28, 'rgba(56,232,255,0.46)');
        gradient.addColorStop(0.64, 'rgba(56,232,255,0.16)');
        gradient.addColorStop(1, 'rgba(56,232,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.5 });
      const sprite = new THREE.Sprite(material);
      sprite.position.set(0, 0.08, -0.45);
      sprite.scale.set(5.8, 3.9, 1);
      brainGroup.add(sprite);
      return { sprite, material };
    })();

    // cortex contour — one closed gyrus-folded line per hemisphere
    const shellMaterial = new THREE.LineBasicMaterial({ color: electric, transparent: true, opacity: 0.8 });
    const brightMaterial = new THREE.LineBasicMaterial({ color: white, transparent: true, opacity: 0.54 });
    const leftCortexIdx = NODE_POINTS.map((_, i) => i).filter((i) => HEMI_OF[i] === 0).slice(0, 58);
    const rightCortexIdx = NODE_POINTS.map((_, i) => i).filter((i) => HEMI_OF[i] === 1).slice(0, 58);
    const closedLoop = (idx: number[]) => [...idx, idx[0]].map((i) => brainVector(NODE_POINTS[i]));
    const shellCurves = [
      makeCurve(closedLoop(leftCortexIdx), 200),
      makeCurve(closedLoop(rightCortexIdx), 200),
    ];

    shellCurves.forEach((geometry, index) => {
      const line = new THREE.Line(geometry, index % 2 === 0 ? shellMaterial : brightMaterial);
      brainGroup.add(line);
    });

    // dense link mesh (the "pathways")
    const linkGeometry = new THREE.BufferGeometry();
    const linkPositions: number[] = [];
    for (const [a, b] of LINKS) {
      const start = NODE_POINTS[a];
      const end = NODE_POINTS[b];
      linkPositions.push(start[0], start[1] + BRAIN_Y_OFFSET, start[2], end[0], end[1] + BRAIN_Y_OFFSET, end[2]);
    }
    linkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linkPositions, 3));
    const linkMaterial = new THREE.LineBasicMaterial({ color: electric, transparent: true, opacity: 0.5 });
    brainGroup.add(new THREE.LineSegments(linkGeometry, linkMaterial));

    // dendrite stubs (the "dendrites") — same material family, dimmer
    const dendriteGeometry = new THREE.BufferGeometry();
    const dendritePositions: number[] = [];
    for (const [start, end] of DENDRITE_SEGMENTS) {
      dendritePositions.push(start[0], start[1] + BRAIN_Y_OFFSET, start[2], end[0], end[1] + BRAIN_Y_OFFSET, end[2]);
    }
    dendriteGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dendritePositions, 3));
    const dendriteMaterial = new THREE.LineBasicMaterial({ color: electric, transparent: true, opacity: 0.3 });
    brainGroup.add(new THREE.LineSegments(dendriteGeometry, dendriteMaterial));

    const pointGeometry = new THREE.BufferGeometry().setFromPoints(NODE_POINTS.map(brainVector));
    const pointMaterial = new THREE.PointsMaterial({
      color: electric,
      size: 0.07,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    brainGroup.add(new THREE.Points(pointGeometry, pointMaterial));

    const pedestalMaterial = new THREE.LineBasicMaterial({ color: electric, transparent: true, opacity: 0.42 });
    const pedestalGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.7, -2.55, 0),
      new THREE.Vector3(1.7, -2.55, 0),
      new THREE.Vector3(1.16, -2.2, 0),
      new THREE.Vector3(-1.16, -2.2, 0),
      new THREE.Vector3(-1.7, -2.55, 0),
    ]);
    pedestalGroup.add(new THREE.Line(pedestalGeometry, pedestalMaterial));
    pedestalGroup.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.36, 0), new THREE.Vector3(0, -2.22, 0)]),
        pedestalMaterial
      )
    );

    const resize = () => {
      const size = mount.clientWidth || 640;
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const tuning = STATUS_TUNING[statusRef.current];
      const pulse = (Math.sin(elapsed * tuning.pulse) + 1) / 2;
      const glow = tuning.glow * (0.56 + pulse * 0.44);
      const swaySpeed = 0.16 + tuning.speed * 0.18;

      brainGroup.rotation.y = Math.sin(elapsed * swaySpeed) * 0.1;
      brainGroup.rotation.x = Math.sin(elapsed * swaySpeed * 0.82) * 0.04;
      glowSprite.material.opacity = glow;
      glowSprite.sprite.scale.set(5.3 + pulse * 0.42, 3.55 + pulse * 0.32, 1);

      shellMaterial.opacity = 0.58 + glow * 0.36;
      brightMaterial.opacity = 0.34 + glow * 0.28;
      linkMaterial.opacity = 0.3 + tuning.line * 0.28 + pulse * 0.16;
      dendriteMaterial.opacity = 0.16 + tuning.line * 0.18 + pulse * 0.1;
      pointMaterial.opacity = 0.64 + pulse * 0.34;
      pointMaterial.size = 0.062 + pulse * 0.02;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      shellCurves.forEach((geometry) => geometry.dispose());
      linkGeometry.dispose();
      dendriteGeometry.dispose();
      pointGeometry.dispose();
      pedestalGeometry.dispose();
      shellMaterial.dispose();
      brightMaterial.dispose();
      linkMaterial.dispose();
      dendriteMaterial.dispose();
      pointMaterial.dispose();
      pedestalMaterial.dispose();
      glowSprite.material.map?.dispose();
      glowSprite.material.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" />;
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
      <CoreBrainScene status={status} />
    </div>
  );
};

export default Brain;
