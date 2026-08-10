"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Vec3 = [number, number, number];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A layered "software architecture" graph: a hub node surrounded by rings of
 * connected systems, joined by data-flow edges. Meaning over spectacle — it
 * reads as connected architecture rather than a generic globe.
 */
function buildGraph() {
  const rand = mulberry32(0xadc1);
  const nodes: Vec3[] = [[0, 0.2, 0]];

  const layerDefs = [
    { r: 1.5, n: 6, y: 0.15, jitter: 0.45 },
    { r: 2.5, n: 9, y: 0.8, jitter: 0.6 },
    { r: 3.4, n: 12, y: -0.45, jitter: 0.7 },
  ];

  const layers: Vec3[][] = [];
  for (const def of layerDefs) {
    const ring: Vec3[] = [];
    for (let i = 0; i < def.n; i++) {
      const angle = (i / def.n) * Math.PI * 2;
      ring.push([
        Math.cos(angle) * def.r + (rand() - 0.5) * def.jitter,
        def.y + (rand() - 0.5) * def.jitter,
        Math.sin(angle) * def.r + (rand() - 0.5) * def.jitter,
      ]);
    }
    layers.push(ring);
    nodes.push(...ring);
  }

  const segments: number[] = [];
  const seen = new Set<string>();
  const link = (a: Vec3, b: Vec3) => {
    const key = `${a.join(",")}-${b.join(",")}`;
    if (seen.has(key)) return;
    seen.add(key);
    segments.push(a[0], a[1], a[2], b[0], b[1], b[2]);
  };

  for (const node of layers[0]) link(nodes[0], node);

  for (let l = 0; l < layers.length - 1; l++) {
    for (const a of layers[l]) {
      let best = layers[l + 1][0];
      let bestDist = Infinity;
      for (const b of layers[l + 1]) {
        const d =
          (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
        if (d < bestDist) {
          bestDist = d;
          best = b;
        }
      }
      link(a, best);
    }
  }

  for (const ring of layers) {
    for (let i = 0; i < ring.length; i++) link(ring[i], ring[(i + 1) % ring.length]);
  }

  return { nodes, segments: new Float32Array(segments) };
}

function SystemGraph() {
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const { nodes, segments } = useMemo(() => buildGraph(), []);

  const positions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n[0];
      arr[i * 3 + 1] = n[1];
      arr[i * 3 + 2] = n[2];
    });
    return arr;
  }, [nodes]);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.05;
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.28 + Math.sin(state.clock.elapsedTime * 0.9) * 0.09;
    }
  });

  return (
    <group ref={groupRef} position={[2.3, 0, -1.4]}>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[segments, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#5eead4" transparent opacity={0.32} depthWrite={false} />
      </lineSegments>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#5eead4"
          size={0.07}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial
          color="#5eead4"
          emissive="#0e9384"
          emissiveIntensity={0.7}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

function ParticleField({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const rand = mulberry32(0x5eed);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 30;
      arr[i * 3 + 1] = (rand() - 0.5) * 14;
      arr[i * 3 + 2] = (rand() - 0.5) * 30;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#5eead4"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function GridFloor() {
  return (
    <Grid
      position={[0, -3.4, 0]}
      args={[20, 20]}
      cellSize={0.9}
      cellThickness={0.6}
      cellColor="#5eead4"
      sectionSize={4.5}
      sectionThickness={1}
      sectionColor="#5eead4"
      fadeDistance={22}
      fadeStrength={2.2}
      infiniteGrid
      followCamera={false}
    />
  );
}

function SceneContent({ variant }: { variant: string }) {
  const parallaxRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!parallaxRef.current) return;
    parallaxRef.current.rotation.y = THREE.MathUtils.lerp(
      parallaxRef.current.rotation.y,
      state.pointer.x * 0.14,
      0.045,
    );
    parallaxRef.current.rotation.x = THREE.MathUtils.lerp(
      parallaxRef.current.rotation.x,
      state.pointer.y * 0.07,
      0.045,
    );
  });

  return (
    <group ref={parallaxRef}>
      {variant === "particles" ? <ParticleField /> : <GridFloor />}
      <SystemGraph />
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={18} color="#5eead4" />
    </group>
  );
}

export function HeroScene({ variant }: { variant: string }) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#08090b", 10, 24]} />
        <SceneContent variant={variant} />
      </Canvas>
    </div>
  );
}
