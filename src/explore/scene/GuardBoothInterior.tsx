'use client';

import React from 'react';
import { EXPLORE_TOKENS } from '@/explore/tokens';

export function GuardBoothInterior() {
  return (
    <group position={[8.2, 0, 56]}>
      {/* Interior Security Desk */}
      <mesh position={[0, 0.45, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.9, 0.9]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.woodWarm} roughness={0.5} />
      </mesh>

      {/* CCTV Multi-Screen Monitor Display */}
      <group position={[0, 1.25, 0.35]}>
        {/* Dual CCTV Screens side-by-side */}
        <mesh position={[-0.45, 0, 0]} castShadow>
          <boxGeometry args={[0.7, 0.45, 0.06]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        <mesh position={[-0.45, 0, 0.035]}>
          <boxGeometry args={[0.64, 0.39, 0.01]} />
          <meshStandardMaterial
            color="#0C4A6E"
            emissive="#0284C7"
            emissiveIntensity={0.85}
          />
        </mesh>

        <mesh position={[0.45, 0, 0]} castShadow>
          <boxGeometry args={[0.7, 0.45, 0.06]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        <mesh position={[0.45, 0, 0.035]}>
          <boxGeometry args={[0.64, 0.39, 0.01]} />
          <meshStandardMaterial
            color="#0C4A6E"
            emissive="#10B981"
            emissiveIntensity={0.65}
          />
        </mesh>
      </group>

      {/* Security Intercom & Radio on desk */}
      <mesh position={[-0.9, 0.96, 0.2]}>
        <boxGeometry args={[0.18, 0.1, 0.24]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>

      {/* Guard Logbook folder */}
      <mesh position={[0.9, 0.92, 0.2]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.26, 0.03, 0.35]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>

      {/* Swivel Office Chair */}
      <group position={[0, 0, -0.6]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.7]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} />
        </mesh>
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.6, 0.1, 0.6]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.95, -0.25]} castShadow>
          <boxGeometry args={[0.6, 0.55, 0.1]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>
      </group>

      {/* Booth Ceiling Warm Downlight */}
      <pointLight position={[0, 2.7, 0]} color="#FEF3C7" intensity={1.5} distance={5} decay={2} />
    </group>
  );
}
