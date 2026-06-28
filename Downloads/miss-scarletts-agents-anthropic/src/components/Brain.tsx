import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { Brain as BrainIcon } from 'lucide-react';
import type { AgentStatus } from '../hooks/useAgentSystem';
import * as THREE from 'three';

interface BrainProps {
  size: 'xl' | 'lg' | 'sm';
  accent: string;
  BadgeIcon?: ComponentType<{ size?: number; color?: string }>;
  status: AgentStatus;
  variant?: 'core' | 'agent';
}

const DIMENSIONS = {
  xl: { box: 'clamp(640px, 78vmin, 1060px)', icon: 0, badge: 34, badgeIcon: 16, tick: 10 },
  lg: { box: 176, icon: 96, badge: 30, badgeIcon: 16, tick: 9 },
  sm: { box: 66, icon: 36, badge: 16, badgeIcon: 9, tick: 4 },
};

const SPIN_DURATION: Record<AgentStatus, string> = {
  idle: '20s',
  thinking: '7s',
  speaking: '3s',
  blocked: '20s',
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function deformBrainGeometry(geometry: THREE.BufferGeometry) {
  const position = geometry.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < position.count; i += 1) {
    v.fromBufferAttribute(position, i);
    const yShape = 1 - Math.min(0.48, Math.abs(v.y) * 0.17);
    const xBulge = 1 + 0.11 * Math.sin(v.y * 2.8) + 0.05 * Math.sin(v.z * 5.2);
    const zBulge = 1 + 0.08 * Math.sin(v.x * 3.1) - 0.04 * Math.cos(v.y * 6.5);
    const lobeOffset = 0.12 * Math.sin((v.x + v.z) * 2.6);
    v.x = (v.x + lobeOffset * Math.sign(v.x || 1)) * xBulge;
    v.y = v.y * yShape + 0.03 * Math.sin(v.x * 4.2);
    v.z = v.z * zBulge + 0.06 * Math.cos((v.x - v.y) * 3.3);
    position.setXYZ(i, v.x, v.y, v.z);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

function colorWithAlpha(color: string, alpha: number) {
  const c = new THREE.Color(color);
  return `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${alpha})`;
}

function CoreBrainScene({ accent, status }: { accent: string; status: AgentStatus }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const color = status === 'blocked' ? '#f59e0b' : accent;
  const speed = status === 'speaking' ? 1.8 : status === 'thinking' ? 1.15 : 0.72;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.18);

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.25, 7.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.localClippingEnabled = true;
    host.appendChild(renderer.domElement);

    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    const organicGeo = new THREE.SphereGeometry(1.96, 96, 72, 0, Math.PI);
    const mechanicalGeo = new THREE.SphereGeometry(1.96, 96, 72, Math.PI, Math.PI);
    deformBrainGeometry(organicGeo);
    deformBrainGeometry(mechanicalGeo);

    const organicShellGeo = organicGeo.clone();
    organicShellGeo.scale(1.03, 1.03, 1.03);
    const mechanicalShellGeo = mechanicalGeo.clone();
    mechanicalShellGeo.scale(1.03, 1.03, 1.03);

    const organicMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#c76d79'),
      roughness: 0.5,
      metalness: 0.02,
      clearcoat: 0.45,
      clearcoatRoughness: 0.2,
      transmission: 0.18,
      thickness: 0.9,
      transparent: true,
      opacity: 0.96,
      emissive: new THREE.Color('#ff8ea0'),
      emissiveIntensity: 0.22,
    });

    const organicShellMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f3b1ba'),
      roughness: 0.2,
      metalness: 0.04,
      transparent: true,
      opacity: 0.2,
      transmission: 0.5,
      thickness: 1.2,
      emissive: new THREE.Color('#f97383'),
      emissiveIntensity: 0.1,
    });

    const mechanicalMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#64748b'),
      roughness: 0.16,
      metalness: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.96,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.12,
    });

    const mechanicalShellMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#94a3b8'),
      roughness: 0.08,
      metalness: 1,
      transparent: true,
      opacity: 0.18,
      transmission: 0.1,
      thickness: 0.8,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.08,
    });

    const organicMesh = new THREE.Mesh(organicGeo, organicMaterial);
    const organicShell = new THREE.Mesh(organicShellGeo, organicShellMaterial);
    const mechanicalMesh = new THREE.Mesh(mechanicalGeo, mechanicalMaterial);
    const mechanicalShell = new THREE.Mesh(mechanicalShellGeo, mechanicalShellMaterial);

    const jointBandGeo = new THREE.TorusGeometry(1.56, 0.08, 12, 180);
    const jointBand = new THREE.Mesh(
      jointBandGeo,
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.42,
        metalness: 0.72,
        roughness: 0.22,
        transparent: true,
        opacity: 0.86,
      })
    );
    jointBand.rotation.x = Math.PI / 2.7;
    jointBand.rotation.z = Math.PI / 16;

    const coreGeo = new THREE.SphereGeometry(0.82, 64, 48);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: '#dff8ff',
      emissive: new THREE.Color(color),
      emissiveIntensity: 1.35,
      roughness: 0.18,
      metalness: 0.0,
      transparent: true,
      opacity: 0.96,
    });

    const coreMesh = new THREE.Mesh(coreGeo, coreMaterial);
    coreMesh.position.set(0.02, -0.03, 0.08);
    brainGroup.add(organicMesh, organicShell, mechanicalMesh, mechanicalShell, jointBand, coreMesh);

    const ridgeMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.42,
    });

    const ridgeCurves = [
      [
        [-1.8, 0.5, 0.2],
        [-1.25, 0.95, 0.08],
        [-0.7, 1.05, 0.0],
        [-0.1, 0.85, -0.04],
        [0.42, 0.62, 0.02],
        [0.95, 0.92, 0.12],
        [1.56, 0.54, 0.18],
      ],
      [
        [-1.72, -0.32, 0.26],
        [-1.15, -0.06, 0.14],
        [-0.44, 0.1, 0.1],
        [0.12, 0.14, 0.02],
        [0.6, 0.08, -0.06],
        [1.18, -0.04, 0.0],
        [1.68, -0.34, 0.18],
      ],
      [
        [-1.24, -1.0, 0.1],
        [-0.92, -0.58, 0.02],
        [-0.38, -0.34, -0.06],
        [0.18, -0.14, -0.08],
        [0.74, -0.04, -0.02],
        [1.22, -0.36, 0.12],
        [1.45, -0.92, 0.16],
      ],
      [
        [-0.88, 1.34, -0.1],
        [-0.68, 0.88, 0.02],
        [-0.38, 0.42, 0.1],
        [-0.12, 0.02, 0.14],
        [0.18, -0.28, 0.05],
        [0.52, -0.68, -0.05],
        [0.72, -1.12, 0.08],
      ],
    ];

    ridgeCurves.forEach((points, index) => {
      const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
      const pts = curve.getPoints(64);
      const geometry = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geometry, ridgeMaterial.clone());
      line.material.opacity = 0.18 + index * 0.07;
      brainGroup.add(line);
    });

    const circuitMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.55,
    });
    const circuitCurves = [
      [[0.18, 1.18, 0.42], [0.56, 0.98, 0.34], [0.88, 0.58, 0.3], [1.16, 0.06, 0.3], [1.34, -0.38, 0.22]],
      [[0.2, 0.4, 0.56], [0.72, 0.34, 0.52], [1.14, 0.12, 0.46], [1.38, -0.14, 0.4]],
      [[0.36, -0.48, 0.46], [0.72, -0.18, 0.46], [1.16, 0.14, 0.34]],
    ];
    circuitCurves.forEach((points, index) => {
      const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
      const pts = curve.getPoints(32);
      const geometry = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geometry, circuitMaterial.clone());
      line.material.opacity = 0.28 + index * 0.1;
      brainGroup.add(line);
    });

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.02, 12, 180), ringMaterial);
    ring1.rotation.x = Math.PI / 2.8;
    ring1.rotation.z = Math.PI / 10;
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.018, 12, 160), ringMaterial.clone());
    ring2.rotation.x = Math.PI / 2.2;
    ring2.rotation.z = -Math.PI / 7;
    brainGroup.add(ring1, ring2);

    const lights = [
      new THREE.HemisphereLight(0xe0f7ff, 0x020617, 2.4),
      new THREE.DirectionalLight(new THREE.Color(color), 3.1),
      new THREE.PointLight(new THREE.Color(color), 22, 18, 2),
    ];
    lights[0].position.set(0, 4, 0);
    lights[1].position.set(2.5, 4, 5);
    lights[2].position.set(0, 0, 4.5);
    scene.add(...lights);

    const accentLight = new THREE.PointLight(new THREE.Color(color), 7, 10, 2);
    accentLight.position.set(-2.8, -1.4, 3.8);
    scene.add(accentLight);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let raf = 0;
    let start = performance.now();
    const loop = (time: number) => {
      const elapsed = (time - start) / 1000;
      const pulse = 1 + Math.sin(elapsed * 2.1) * 0.045;

      brainGroup.rotation.y = 0;
      brainGroup.rotation.x = 0;
      brainGroup.rotation.z = 0;
      brainGroup.scale.setScalar(pulse);

      if (status === 'speaking') {
        coreMesh.scale.setScalar(1.12 + Math.sin(elapsed * 5) * 0.05);
        accentLight.intensity = 10 + Math.sin(elapsed * 14) * 1.7;
      } else if (status === 'thinking') {
        coreMesh.scale.setScalar(1.04 + Math.sin(elapsed * 3.2) * 0.03);
        accentLight.intensity = 7 + Math.sin(elapsed * 8) * 0.7;
      } else if (status === 'blocked') {
        coreMesh.scale.setScalar(0.98 + Math.sin(elapsed * 2.4) * 0.015);
        accentLight.intensity = 5.2 + Math.sin(elapsed * 4) * 0.3;
      } else {
        coreMesh.scale.setScalar(1);
        accentLight.intensity = 6.2;
      }

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      organicGeo.dispose();
      mechanicalGeo.dispose();
      organicShellGeo.dispose();
      mechanicalShellGeo.dispose();
      coreGeo.dispose();
      jointBandGeo.dispose();
      organicMaterial.dispose();
      organicShellMaterial.dispose();
      mechanicalMaterial.dispose();
      mechanicalShellMaterial.dispose();
      coreMesh.material.dispose();
      ridgeMaterial.dispose();
      circuitMaterial.dispose();
      ring1.geometry.dispose();
      ring2.geometry.dispose();
      ring1.material.dispose();
      ring2.material.dispose();
      lights.forEach((light) => scene.remove(light));
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, [accent, status, speed]);

  return (
    <div
      ref={hostRef}
      className="absolute inset-[0%] rounded-full pointer-events-none"
      style={{
        background:
          'radial-gradient(circle at 50% 42%, rgba(248,250,252,0.05), rgba(2,6,23,0) 35%), radial-gradient(circle at 50% 58%, rgba(34,211,238,0.12), rgba(2,6,23,0.08) 56%, rgba(2,6,23,0) 74%)',
        boxShadow: `0 0 50px ${colorWithAlpha(color, 0.2)} inset`,
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${color}22`,
          boxShadow: `0 0 26px ${color}14 inset, 0 0 60px ${color}1f`,
        }}
      />
    </div>
  );
}

function BrainShell({ accent, status, animate }: { accent: string; status: AgentStatus; animate: boolean }) {
  const color = status === 'blocked' ? '#f59e0b' : accent;
  const lineColor = `${color}77`;

  const foldLines = useMemo(
    () => [
      'M178 196c38-42 95-62 149-54',
      'M202 251c49-35 117-44 170-18',
      'M194 322c40-19 84-22 129-11',
      'M227 387c31-15 73-18 113-10',
      'M355 180c43 2 86 20 114 53',
      'M366 240c48 8 88 37 107 78',
      'M372 310c46 10 82 40 96 85',
      'M349 388c40 1 74 17 95 43',
      'M248 184c-18 23-27 49-26 77',
      'M217 263c-11 27-13 58-5 87',
      'M232 349c-2 25 2 47 14 68',
      'M312 169c-10 25-11 50-3 73',
      'M308 253c-11 23-14 49-7 75',
      'M319 338c-3 24 3 49 17 69',
    ],
    []
  );

  return (
    <svg
      viewBox="0 0 640 640"
      className="h-full w-full"
      style={{ filter: `drop-shadow(0 0 34px ${color}55) drop-shadow(0 0 80px ${color}28)` }}
    >
      <defs>
        <radialGradient id="brain-base" cx="35%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.95" />
          <stop offset="28%" stopColor="#94a3b8" stopOpacity="0.9" />
          <stop offset="58%" stopColor="#1e293b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#020617" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="brain-sheen" cx="31%" cy="20%" r="52%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#dbeafe" stopOpacity="0.42" />
          <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="brain-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.88" />
          <stop offset="50%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="brain-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.7" />
          <stop offset="20%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
        </linearGradient>
        <filter id="brain-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="blur" />
          <feOffset dx="0" dy="16" result="offsetBlur" />
          <feColorMatrix
            in="offsetBlur"
            type="matrix"
            values="0 0 0 0 0.02  0 0 0 0 0.07  0 0 0 0 0.15  0 0 0 0.6 0"
          />
          <feBlend in="SourceGraphic" in2="blur" mode="normal" />
        </filter>
        <filter id="brain-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="g1" />
          <feGaussianBlur stdDeviation="16" in="SourceGraphic" result="g2" />
          <feMerge>
            <feMergeNode in="g2" />
            <feMergeNode in="g1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="highlight" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      <g transform="translate(320 320)">
        <ellipse cx="0" cy="12" rx="190" ry="198" fill="url(#brain-core)" opacity="0.5" filter="url(#brain-soft-glow)" />

        <g
          className={animate ? 'brain-orbit' : ''}
          style={{ transformOrigin: 'center', animationDuration: SPIN_DURATION[status] }}
        >
          <ellipse
            cx="0"
            cy="0"
            rx="224"
            ry="176"
            fill="none"
            stroke={lineColor}
            strokeWidth="2"
            strokeDasharray="12 18"
            opacity="0.8"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="250"
            ry="206"
            fill="none"
            stroke={`${color}55`}
            strokeWidth="1.5"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="156"
            ry="140"
            fill="none"
            stroke={`${color}33`}
            strokeWidth="1.25"
            strokeDasharray="3 10"
          />
        </g>

        <g filter="url(#brain-shadow)">
          <path
            d="M-170 -20c-8-61 30-123 97-143 49-15 101 1 135 35 13-27 36-48 68-57 65-18 134 21 158 84 43 9 76 40 86 82 11 48-9 97-47 126 7 50-13 98-58 123-35 19-76 19-113 5-29 23-68 34-108 28-41-6-77-29-97-61-58-7-107-49-122-107-12-46-2-92 1-115Z"
            fill="url(#brain-base)"
            stroke="url(#brain-rim)"
            strokeWidth="4"
          />

          <path
            d="M-102 -98c34-53 108-74 164-47 12 6 22 14 31 24 17-28 52-47 90-45 52 3 96 42 107 92 9 42-8 85-38 112 8 19 12 39 11 58-5 70-66 125-139 123-28-1-55-8-77-22-19 9-40 14-61 14-78 0-139-61-139-137 0-47 22-87 51-112Z"
            fill="url(#brain-sheen)"
            opacity="0.72"
          />

          <path
            d="M-103 -104c34-53 108-74 164-47 12 6 22 14 31 24 17-28 52-47 90-45 52 3 96 42 107 92 9 42-8 85-38 112 8 19 12 39 11 58-5 70-66 125-139 123-28-1-55-8-77-22-19 9-40 14-61 14-78 0-139-61-139-137 0-47 22-87 51-112Z"
            fill="none"
            stroke={`${color}50`}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          <path
            d="M-146 34c36-13 70-10 100 9 17 10 29 24 40 40 19 29 52 46 88 46 36 0 70-18 89-47 11-17 24-32 43-42 31-16 65-18 100-6"
            fill="none"
            stroke={`${color}48`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M-123 -54c31 9 55 29 72 58 14 23 29 38 46 46 18 8 41 12 66 10 25-2 48-9 69-21 20-11 38-28 54-51 16-23 38-40 65-49"
            fill="none"
            stroke={`${color}44`}
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {foldLines.map((d, index) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke={index % 2 === 0 ? `${color}50` : `${color}32`}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          ))}

          <path
            d="M-35 -150c18 18 18 36 0 54"
            fill="none"
            stroke="#f8fafc"
            strokeOpacity="0.55"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#highlight)"
          />
          <ellipse cx="-82" cy="-92" rx="24" ry="18" fill="#fff" opacity="0.09" />
          <ellipse cx="-44" cy="-70" rx="12" ry="8" fill="#fff" opacity="0.08" />
        </g>

        {animate && (
          <g className="brain-pulse" style={{ animationDuration: SPIN_DURATION[status] }}>
            <circle cx="-4" cy="6" r="148" fill="none" stroke={color} strokeOpacity="0.18" strokeWidth="2" />
            <circle cx="0" cy="0" r="112" fill="none" stroke={color} strokeOpacity="0.28" strokeWidth="1.4" />
            <circle cx="0" cy="0" r="78" fill="none" stroke={color} strokeOpacity="0.3" strokeWidth="1.2" />
          </g>
        )}

        <g filter="url(#brain-soft-glow)">
          {[...Array(12)].map((_, index) => {
            const angle = (index / 12) * Math.PI * 2;
            const rx = 150 + (index % 2) * 14;
            const ry = 120 + ((index + 1) % 3) * 10;
            const x = Math.cos(angle) * rx;
            const y = Math.sin(angle) * ry * 0.78;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={index % 3 === 0 ? 3.2 : 2.2}
                fill={color}
                opacity={index % 3 === 0 ? 0.88 : 0.52}
              />
            );
          })}
        </g>

        {status === 'speaking' && (
          <circle cx="0" cy="4" r="96" fill="none" stroke={color} strokeOpacity="0.2" strokeWidth="10" />
        )}
      </g>
    </svg>
  );
}

function AgentShell({
  accent,
  status,
  BadgeIcon,
}: {
  accent: string;
  status: AgentStatus;
  BadgeIcon?: ComponentType<{ size?: number; color?: string }>;
}) {
  const color = status === 'blocked' ? '#f59e0b' : accent;
  const reducedMotion = useReducedMotion();
  const animate = !reducedMotion;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 80, height: 80, perspective: '900px' }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid ${color}30`, boxShadow: `0 0 18px ${color}20 inset` }}
      />
      <div
        className={animate ? 'absolute inset-[7%] rounded-full border border-dashed' : 'absolute inset-[7%] rounded-full border border-dashed'}
        style={{ borderColor: `${color}35`, animationDuration: SPIN_DURATION[status] }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: animate ? 'translateZ(0) rotateX(14deg) rotateY(-18deg)' : 'none',
          transition: 'transform 180ms linear',
        }}
      >
        <BrainIcon
          size={46}
          color={color}
          strokeWidth={1.5}
          className={animate && status === 'thinking' ? 'animate-pulse' : ''}
          style={{ filter: `drop-shadow(0 0 10px ${color}aa) drop-shadow(0 0 20px ${color}55)` }}
        />
      </div>

      {BadgeIcon && (
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{
            width: 20,
            height: 20,
            right: -1,
            bottom: -1,
            backgroundColor: '#020617',
            border: `1.5px solid ${color}`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        >
          <BadgeIcon size={11} color={color} />
        </div>
      )}
    </div>
  );
}

export default function Brain({ size, accent, BadgeIcon, status, variant = 'agent' }: BrainProps) {
  const d = DIMENSIONS[size];
  const reducedMotion = useReducedMotion();
  const color = status === 'blocked' ? '#f59e0b' : accent;
  const animate = !reducedMotion;
  const boxSize = typeof d.box === 'number' ? d.box : 640;

  if (variant === 'core') {
    return (
      <div
        className="relative shrink-0"
        style={{
          width: d.box,
          height: d.box,
          perspective: '1400px',
        }}
        role="img"
        aria-label={`Agent Smith status: ${status}`}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: 'none',
            transformStyle: 'preserve-3d',
          }}
        >
          <CoreBrainScene accent={accent} status={status} />
        </div>

        {BadgeIcon && (
          <div
            className="absolute right-6 top-6 flex items-center justify-center rounded-full"
            style={{
              width: 34,
              height: 34,
              backgroundColor: '#020617',
              border: `1.5px solid ${color}`,
              boxShadow: `0 0 12px ${color}66`,
            }}
          >
            <BadgeIcon size={16} color={color} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative shrink-0" style={{ width: d.box, height: d.box }} role="img" aria-label={`status: ${status}`}>
      <div className={animate ? 'absolute inset-0 animate-spin' : 'absolute inset-0'} style={{ animationDuration: SPIN_DURATION[status] }}>
        <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${color}30` }} />
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute"
              style={{
                width: 2,
                height: d.tick,
                backgroundColor: `${color}90`,
                top: -2,
                left: boxSize / 2 - 1,
                transformOrigin: `1px ${boxSize / 2 + 2}px`,
                transform: `rotate(${deg}deg)`,
              }}
            />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {status === 'speaking' && (
          <span
            className={animate ? 'absolute rounded-full animate-ping' : 'absolute rounded-full'}
            style={{ width: d.icon * 0.9, height: d.icon * 0.9, backgroundColor: color, opacity: 0.15 }}
          />
        )}
        <AgentShell accent={accent} status={status} BadgeIcon={BadgeIcon} />
      </div>
    </div>
  );
}
