'use client';

import React from 'react';
import { Environment as DreiEnvironment, Lightformer } from '@react-three/drei';
import { CONFIG } from '@/data/config';

export function Environment() {
  return (
    <>
      {/* Background color: very light lavender-blue (#E6EBFA) per spec */}
      <color attach="background" args={[CONFIG.colors.sky]} />

      {/* Gentle hemisphere light: sky warmth on top, soft bounce from ground */}
      <hemisphereLight
        args={['#FFFFFF', '#D8E0F0', 0.95]}
        position={[0, 60, 0]}
      />

      {/* Main directional sun light for crisp, soft toy-like shadows across the campus */}
      <directionalLight
        position={[48, 65, 38]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-camera-left={-85}
        shadow-camera-right={85}
        shadow-camera-top={85}
        shadow-camera-bottom={-85}
        shadow-bias={-0.0004}
      />

      {/* Soft cool fill light from opposite angle */}
      <directionalLight
        position={[-40, 30, -35]}
        intensity={0.35}
        color="#C7D2FE"
      />

      {/* Offline procedural Lightformer Environment (zero external HDR downloads) */}
      <DreiEnvironment resolution={256}>
        {/* Overhead soft white sky bounce */}
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#FFFFFF"
          scale={[50, 50, 1]}
          position={[0, 30, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        {/* Warm key highlight */}
        <Lightformer
          form="circle"
          intensity={1.0}
          color="#FEF3C7"
          scale={[30, 30, 1]}
          position={[30, 20, 20]}
          target={[0, 0, 0]}
        />
        {/* Soft lavender horizon fill */}
        <Lightformer
          form="ring"
          intensity={0.8}
          color="#E6EBFA"
          scale={[60, 60, 1]}
          position={[-30, 15, -30]}
          target={[0, 0, 0]}
        />
      </DreiEnvironment>
    </>
  );
}
