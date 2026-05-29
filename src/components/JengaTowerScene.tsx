'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Bounds, useBounds } from '@react-three/drei';
import * as THREE from 'three';

const LAYERS = 18;
const BLOCKS_PER_LAYER = 3;
const BLOCK_D = 0.92;
const GAP = 0;
const BLOCK_W = (BLOCK_D + GAP) * BLOCKS_PER_LAYER;
const BLOCK_H = BLOCK_D;
const LAYER_PITCH = BLOCK_D + GAP;
const TOWER_HEIGHT = LAYER_PITCH * LAYERS;

const WOOD_COLORS = ['#c4956a', '#b8845c', '#d4a574', '#a97247', '#cfa067'];

type BlockProps = {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  layerIndex: number;
};

function Block({ position, size, color, layerIndex }: BlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.z =
      Math.sin(t * 1.4 + layerIndex * 0.35) * 0.003 * (1 + layerIndex * 0.03);
  });

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.62} metalness={0.05} />
    </mesh>
  );
}

function TowerModel() {
  const groupRef = useRef<THREE.Group>(null);
  const bounds = useBounds();

  const blocks = useMemo(() => {
    const items: {
      position: [number, number, number];
      size: [number, number, number];
      color: string;
      layerIndex: number;
    }[] = [];

    for (let layer = 0; layer < LAYERS; layer++) {
      const horizontal = layer % 2 === 0;
      const y = layer * LAYER_PITCH + BLOCK_H / 2;

      for (let i = 0; i < BLOCKS_PER_LAYER; i++) {
        const sideOffset = (i - 1) * (BLOCK_D + GAP);

        items.push({
          position: horizontal ? [0, y, sideOffset] : [sideOffset, y, 0],
          size: horizontal ? [BLOCK_W, BLOCK_H, BLOCK_D] : [BLOCK_D, BLOCK_H, BLOCK_W],
          color: WOOD_COLORS[(layer + i) % WOOD_COLORS.length],
          layerIndex: layer,
        });
      }
    }

    return items;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.35) * 0.05;
    groupRef.current.rotation.z = Math.sin(t * 0.55) * 0.012;
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      bounds.refresh().fit();
    }, 100);
    return () => window.clearTimeout(timer);
  }, [bounds]);

  return (
    <group ref={groupRef} position={[0, -TOWER_HEIGHT / 2, 0]}>
      {blocks.map((block, index) => (
        <Block key={index} {...block} />
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight position={[6, 12, 8]} intensity={1.2} castShadow />
      <directionalLight position={[-4, 6, -3]} intensity={0.35} />
      <hemisphereLight args={['#ffffff', '#f1f5f9', 0.5]} />
      <Bounds fit observe margin={1.35}>
        <TowerModel />
      </Bounds>
      <ContactShadows
        position={[0, -TOWER_HEIGHT / 2 - 0.02, 0]}
        opacity={0.18}
        scale={10}
        blur={2.5}
        far={8}
        color="#94a3b8"
      />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        target={[0, 0, 0]}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate
        autoRotateSpeed={0.45}
      />
    </>
  );
}

export default function JengaTowerScene() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.5, 12], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      dpr={[1, 2]}
    >
      <Scene />
    </Canvas>
  );
}
