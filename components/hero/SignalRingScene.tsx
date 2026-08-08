"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

const PROJECT_LABELS = ["Skillence", "Bookverse", "Cardy Cash", "ELEVEN"];

function SignalRing() {
  const groupRef = useRef<THREE.Group>(null);
  const barsRef = useRef<THREE.Mesh[]>([]);
  const barCount = 48;

  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const angle = (i / barCount) * Math.PI * 2;
      return { angle, seed: Math.random() };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.05;
    }
    barsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const { seed } = bars[i];
      const pulse = 0.4 + Math.abs(Math.sin(t * 1.4 + seed * 10)) * 0.9;
      mesh.scale.y = pulse;
    });
  });

  return (
    <group ref={groupRef}>
      {bars.map(({ angle }, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) barsRef.current[i] = el;
          }}
          position={[Math.cos(angle) * 2.4, Math.sin(angle) * 2.4, 0]}
          rotation={[0, 0, angle + Math.PI / 2]}
        >
          <boxGeometry args={[0.035, 0.22, 0.035]} />
          <meshBasicMaterial color="#C4B5FD" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function ProjectCard({
  index,
  total,
  label,
}: {
  index: number;
  total: number;
  label: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const radius = 3.6;
  const speed = 0.06;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + (index / total) * Math.PI * 2;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius - 1;
      ref.current.position.y = Math.sin(t * 1.3) * 0.4;
      ref.current.lookAt(0, 0, 3);
    }
  });

  return (
    <group ref={ref}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
        <RoundedBox args={[1.5, 1, 0.06]} radius={0.08} smoothness={4}>
          <meshPhysicalMaterial
            color="#0D0B14"
            transparent
            opacity={0.55}
            roughness={0.2}
            metalness={0.1}
            transmission={0.4}
            thickness={0.5}
          />
        </RoundedBox>
      </Float>
    </group>
  );
}

function CursorParallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const x = (state.pointer.x * viewport.width) / 40;
    const y = (state.pointer.y * viewport.height) / 40;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      x * 0.15,
      0.05
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -y * 0.1,
      0.05
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function SignalRingScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.8]}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={30} color="#8B5CF6" />
      <pointLight position={[-5, -3, 2]} intensity={15} color="#C026D3" />
      <CursorParallax>
        <SignalRing />
        {PROJECT_LABELS.map((label, i) => (
          <ProjectCard key={label} index={i} total={PROJECT_LABELS.length} label={label} />
        ))}
      </CursorParallax>
    </Canvas>
  );
}
