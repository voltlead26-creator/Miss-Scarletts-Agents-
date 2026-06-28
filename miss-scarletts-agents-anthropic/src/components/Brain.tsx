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

const NODE_POINTS: Array<[number, number, number]> = [
  [-2.6, 0.25, 0.0],
  [-2.25, 0.95, -0.35],
  [-1.75, 1.55, 0.28],
  [-1.0, 1.9, -0.2],
  [-0.2, 2.05, 0.18],
  [0.62, 1.96, -0.3],
  [1.38, 1.62, 0.24],
  [2.05, 1.02, -0.22],
  [2.38, 0.26, 0.15],
  [2.16, -0.48, -0.28],
  [1.58, -1.04, 0.2],
  [0.76, -1.32, -0.18],
  [-0.1, -1.42, 0.22],
  [-1.0, -1.3, -0.24],
  [-1.78, -0.96, 0.18],
  [-2.34, -0.38, -0.12],
  [-1.5, 0.35, 0.34],
  [-0.78, 0.72, -0.34],
  [0.02, 0.78, 0.3],
  [0.82, 0.58, -0.28],
  [1.48, 0.18, 0.22],
  [1.16, -0.48, -0.22],
  [0.28, -0.66, 0.24],
  [-0.62, -0.56, -0.2],
  [-1.28, -0.1, 0.2],
  [-0.34, 1.36, 0.42],
  [0.94, 1.18, 0.35],
  [-1.56, 1.08, -0.42],
  [1.78, 0.82, -0.42],
];

const LINKS = [
  [0, 2],
  [0, 5],
  [1, 4],
  [1, 7],
  [2, 8],
  [3, 11],
  [4, 10],
  [5, 14],
  [6, 13],
  [7, 15],
  [8, 16],
  [9, 18],
  [10, 20],
  [11, 21],
  [12, 22],
  [13, 23],
  [14, 24],
  [16, 19],
  [17, 21],
  [18, 23],
  [19, 24],
  [20, 25],
  [21, 26],
  [22, 27],
  [23, 28],
  [25, 18],
  [26, 20],
  [27, 17],
  [28, 19],
];

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
    camera.position.set(0, 0.35, 9.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const electric = new THREE.Color('#38e8ff');
    const white = new THREE.Color('#ecfeff');
    const brainGroup = new THREE.Group();
    const ringGroup = new THREE.Group();
    const pedestalGroup = new THREE.Group();
    scene.add(brainGroup, ringGroup, pedestalGroup);

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
      sprite.position.set(0, 0.62, -0.45);
      sprite.scale.set(5.8, 3.9, 1);
      brainGroup.add(sprite);
      return { sprite, material };
    })();

    const shellMaterial = new THREE.LineBasicMaterial({ color: electric, transparent: true, opacity: 0.8 });
    const brightMaterial = new THREE.LineBasicMaterial({ color: white, transparent: true, opacity: 0.54 });
    const shellCurves = [
      makeCurve(NODE_POINTS.slice(0, 16).map(([x, y, z]) => new THREE.Vector3(x, y + 0.72, z)), 120),
      makeCurve([0, 3, 6, 8, 10, 12, 14, 0].map((i) => new THREE.Vector3(...NODE_POINTS[i]).add(new THREE.Vector3(0, 0.72, 0))), 120),
      makeCurve([1, 17, 18, 19, 20, 9].map((i) => new THREE.Vector3(...NODE_POINTS[i]).add(new THREE.Vector3(0, 0.72, 0))), 80),
      makeCurve([15, 24, 23, 22, 21, 10].map((i) => new THREE.Vector3(...NODE_POINTS[i]).add(new THREE.Vector3(0, 0.72, 0))), 80),
    ];

    shellCurves.forEach((geometry, index) => {
      const line = new THREE.Line(geometry, index % 2 === 0 ? shellMaterial : brightMaterial);
      brainGroup.add(line);
    });

    const linkGeometry = new THREE.BufferGeometry();
    const linkPositions: number[] = [];
    for (const [a, b] of LINKS) {
      const start = NODE_POINTS[a];
      const end = NODE_POINTS[b];
      linkPositions.push(start[0], start[1] + 0.72, start[2], end[0], end[1] + 0.72, end[2]);
    }
    linkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linkPositions, 3));
    const linkMaterial = new THREE.LineBasicMaterial({ color: electric, transparent: true, opacity: 0.62 });
    brainGroup.add(new THREE.LineSegments(linkGeometry, linkMaterial));

    const pointGeometry = new THREE.BufferGeometry().setFromPoints(
      NODE_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y + 0.72, z))
    );
    const pointMaterial = new THREE.PointsMaterial({
      color: electric,
      size: 0.075,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    brainGroup.add(new THREE.Points(pointGeometry, pointMaterial));

    const ringMaterials = [
      new THREE.LineBasicMaterial({ color: electric, transparent: true, opacity: 0.78 }),
      new THREE.LineBasicMaterial({ color: white, transparent: true, opacity: 0.55 }),
      new THREE.LineBasicMaterial({ color: electric, transparent: true, opacity: 0.48 }),
    ];

    const rings: THREE.Line[] = [];
    [
      { radius: 3.8, yScale: 0.22, y: -0.95, z: 0.1, material: ringMaterials[0] },
      { radius: 3.05, yScale: 0.18, y: -0.84, z: 0.15, material: ringMaterials[1] },
      { radius: 2.18, yScale: 0.14, y: -0.72, z: 0.2, material: ringMaterials[2] },
    ].forEach((ring) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 256; i += 1) {
        const angle = (i / 256) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius * ring.yScale, ring.z));
      }
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ring.material);
      line.position.y = ring.y;
      line.rotation.x = -0.22;
      line.rotation.z = -0.18;
      ringGroup.add(line);
      rings.push(line);
    });

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
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.82, 0), new THREE.Vector3(0, -2.22, 0)]),
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

      brainGroup.rotation.y = Math.sin(elapsed * 0.22) * 0.08;
      brainGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.035;
      glowSprite.material.opacity = glow;
      glowSprite.sprite.scale.set(5.3 + pulse * 0.42, 3.55 + pulse * 0.32, 1);

      shellMaterial.opacity = 0.58 + glow * 0.36;
      brightMaterial.opacity = 0.34 + glow * 0.28;
      linkMaterial.opacity = 0.38 + tuning.line * 0.3 + pulse * 0.16;
      pointMaterial.opacity = 0.64 + pulse * 0.34;
      pointMaterial.size = 0.065 + pulse * 0.022;

      rings[0].rotation.z = -0.18 + elapsed * tuning.speed;
      rings[1].rotation.z = 0.28 - elapsed * tuning.speed * 1.38;
      rings[2].rotation.z = -0.08 + elapsed * tuning.speed * 1.9;
      ringMaterials[0].opacity = 0.5 + glow * 0.32;
      ringMaterials[1].opacity = 0.34 + glow * 0.26;
      ringMaterials[2].opacity = 0.26 + glow * 0.22;

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
      pointGeometry.dispose();
      pedestalGeometry.dispose();
      shellMaterial.dispose();
      brightMaterial.dispose();
      linkMaterial.dispose();
      pointMaterial.dispose();
      pedestalMaterial.dispose();
      ringMaterials.forEach((material) => material.dispose());
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
