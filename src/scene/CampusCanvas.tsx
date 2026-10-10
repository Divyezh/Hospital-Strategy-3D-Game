'use client';

import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from './Environment';
import { CameraRig } from './CameraRig';
import { Campus } from './Campus';
import { Buildings } from './Buildings';
import { Agents } from './Agents';
import { CONFIG } from '@/data/config';
import { useSimStore } from '@/store/useSimStore';
import { simEngine } from '@/sim/engine';

// Inside Canvas driver advancing sim step on every frame
function SimDriver() {
  const simSpeed = useSimStore((s) => s.simSpeed);

  useFrame((_, dt) => {
    // Advances time and agent positions smoothly on every frame
    simEngine.step(Math.min(dt, 0.1) * simSpeed);
  });

  return null;
}

export function CampusCanvas() {
  const isDragging = useSimStore((s) => s.isDragging);

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none bg-[#E6EBFA] ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <Canvas
        frameloop="always"
        shadows
        dpr={[1, 2]}
        camera={{
          fov: CONFIG.camera.fov, // ~30 deg per spec
          near: 0.5,
          far: 500,
          position: [42 + 45, 45, 42 + 45], // initially looking at MC-04
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={null}>
          <Environment />
          <CameraRig />
          <Campus />
          <Buildings />
          <SimDriver />
          <Agents />
        </Suspense>
      </Canvas>
    </div>
  );
}
