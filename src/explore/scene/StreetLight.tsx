'use client';

import React from 'react';
import * as THREE from 'three';
import { useExploreStore } from '@/explore/store';

export interface StreetLightProps {
  position: [number, number, number];
  rotationY?: number;
  height?: number;
  armReach?: number;
  lightColor?: string;
  glowRadius?: number;
}

export function StreetLight({
  position,
  rotationY = 0,
  height = 8.2,
  armReach = 2.8,
  lightColor = '#FEF08A',
  glowRadius = 7.5,
}: StreetLightProps) {
  const timeOfDay = useExploreStore((s) => s.timeOfDay);
  const isNight = timeOfDay === 'night';
  const isGolden = timeOfDay === 'golden';
  const lightsActive = isNight || isGolden;

  // Steel pole color
  const steelColor = '#334155';
  const luminaireColor = '#1E293B';

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Octagonal Concrete / Steel Base Plinth with Bolt Flanges */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.34, 0.6, 8]} />
        <meshStandardMaterial color="#475569" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Base Anchor Trim Collar */}
      <mesh position={[0, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.24, 0.1, 10]} />
        <meshStandardMaterial color={steelColor} metalness={0.8} />
      </mesh>

      {/* 2. Main Tapered Fluted Steel Mast (Tall Urban Streetlight) */}
      <mesh position={[0, height * 0.45 + 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.18, height * 0.9, 12]} />
        <meshStandardMaterial color={steelColor} metalness={0.82} roughness={0.3} />
      </mesh>

      {/* Mid-pole junction collar */}
      <mesh position={[0, height * 0.85, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.18, 10]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} />
      </mesh>

      {/* 3. Sweeping Arched Cantilever Outreach Arm extending over the road */}
      <group position={[0, height, 0]}>
        {/* Curved upper arm tube */}
        <mesh
          position={[armReach * 0.45, 0.4, 0]}
          rotation={[0, 0, -Math.PI / 4.5]}
          castShadow
        >
          <cylinderGeometry args={[0.07, 0.09, armReach * 1.1, 8]} />
          <meshStandardMaterial color={steelColor} metalness={0.85} roughness={0.3} />
        </mesh>
        {/* Horizontal extension tube */}
        <mesh
          position={[armReach * 0.85, 0.72, 0]}
          rotation={[0, 0, -Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.06, 0.07, armReach * 0.45, 8]} />
          <meshStandardMaterial color={steelColor} metalness={0.85} roughness={0.3} />
        </mesh>

        {/* 4. Modern Aerodynamic LED Luminaire Cobra Head */}
        <group position={[armReach, 0.7, 0]} rotation={[0, 0, 0.08]}>
          {/* Luminaire outer casing */}
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.18, 0.9]} />
            <meshStandardMaterial color={luminaireColor} roughness={0.4} metalness={0.7} />
          </mesh>
          {/* Top heatsink cooling fins */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.34, 0.05, 0.7]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} />
          </mesh>

          {/* Translucent LED Optic Lens on Underside */}
          <mesh position={[0, -0.09, 0]}>
            <boxGeometry args={[0.36, 0.02, 0.78]} />
            <meshStandardMaterial
              color={lightsActive ? lightColor : '#94A3B8'}
              emissive={lightsActive ? lightColor : '#000000'}
              emissiveIntensity={isNight ? 5.0 : isGolden ? 2.0 : 0}
              roughness={0.1}
            />
          </mesh>

          {/* Active Night Downward Spotlight/PointLight */}
          {lightsActive && (
            <pointLight
              position={[0, -0.3, 0]}
              color={lightColor}
              intensity={isNight ? 4.5 : 1.5}
              distance={26}
              decay={1.8}
            />
          )}
        </group>
      </group>

      {/* =========================================================================
          5. ROAD GLOW POOL (Too much glow on road!)
             Intense radiant golden-yellow illumination pooling onto the tarmac
         ========================================================================= */}
      {lightsActive && (
        <group position={[armReach, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Intense Inner Core Road Glow */}
          <mesh position={[0, 0, 0]}>
            <circleGeometry args={[glowRadius * 0.45, 24]} />
            <meshBasicMaterial
              color="#FEF08A"
              transparent
              opacity={isNight ? 0.55 : 0.25}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Broad Luminous Radial Spill Pool across Road */}
          <mesh position={[0, 0, 0.005]}>
            <circleGeometry args={[glowRadius, 32]} />
            <meshBasicMaterial
              color="#FBBF24"
              transparent
              opacity={isNight ? 0.38 : 0.15}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Ambient Outer Feather Spill Ring */}
          <mesh position={[0, 0, 0.01]}>
            <ringGeometry args={[glowRadius * 0.7, glowRadius * 1.5, 32]} />
            <meshBasicMaterial
              color="#F59E0B"
              transparent
              opacity={isNight ? 0.18 : 0.06}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
