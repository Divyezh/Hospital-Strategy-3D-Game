'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { EXPLORE_TOKENS } from '@/explore/tokens';
import { generateCampusTrees, generateCampusStreetlights, generateCampusBenches } from '@/data/campus';
import { useExploreStore } from '@/explore/store';
import { StreetLight } from './StreetLight';

export function CampusVegetation() {
  const timeOfDay = useExploreStore((s) => s.timeOfDay);
  const isNight = timeOfDay === 'night';

  const foliageGroupRef = useRef<THREE.Group>(null);

  const trees = useMemo(() => generateCampusTrees(), []);
  const streetlights = useMemo(() => generateCampusStreetlights(), []);
  const benches = useMemo(() => generateCampusBenches(), []);

  // Subtle wind sway animation on foliage
  useFrame(({ clock }) => {
    if (!foliageGroupRef.current) return;
    const t = clock.getElapsedTime();
    foliageGroupRef.current.children.forEach((child, i) => {
      child.rotation.z = Math.sin(t * 1.5 + i * 0.4) * 0.035;
      child.rotation.x = Math.cos(t * 1.2 + i * 0.3) * 0.025;
    });
  });

  return (
    <group>
      {/* 1. Realistic Trees Group */}
      <group ref={foliageGroupRef}>
        {trees.map((t, idx) => {
          if (t.type === 'palm') {
            return (
              <group key={`tree-${idx}`} position={[t.x, 0, t.z]} scale={t.scale} rotation={[0, t.rotation, 0]}>
                {/* Slender curved trunk */}
                <mesh position={[0, 3.2, 0]} castShadow>
                  <cylinderGeometry args={[0.2, 0.36, 6.4, 8]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.woodDark} roughness={0.9} />
                </mesh>
                {/* Lush Organic Palm Canopy */}
                <group position={[0, 6.2, 0]}>
                  {/* Central Palm Crown Top */}
                  <mesh position={[0, 0.1, 0]} castShadow>
                    <sphereGeometry args={[0.5, 10, 10]} />
                    <meshStandardMaterial color="#1E392A" roughness={0.7} />
                  </mesh>

                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((frondIdx) => {
                    const angle = (frondIdx / 10) * Math.PI * 2;
                    const frondColor =
                      frondIdx % 2 === 0 ? '#15803D' : '#166534';
                    return (
                      <group key={`palm-frond-${frondIdx}`} rotation={[0, angle, 0]}>
                        {/* Frond Stem Segment 1 */}
                        <group position={[0, 0.1, 0.4]} rotation={[-0.35, 0, 0]}>
                          <mesh position={[0, 0, 0.7]} castShadow>
                            <boxGeometry args={[0.42, 0.05, 1.4]} />
                            <meshStandardMaterial color={frondColor} roughness={0.6} />
                          </mesh>
                          {/* Frond Droop Segment 2 (Nested for continuous curvature) */}
                          <group position={[0, 0, 1.35]} rotation={[-0.45, 0, 0]}>
                            <mesh position={[0, 0, 0.7]} castShadow>
                              <boxGeometry args={[0.32, 0.04, 1.4]} />
                              <meshStandardMaterial color={frondColor} roughness={0.6} />
                            </mesh>
                            {/* Frond Droop Segment 3 */}
                            <group position={[0, 0, 1.35]} rotation={[-0.55, 0, 0]}>
                              <mesh position={[0, 0, 0.6]} castShadow>
                                <boxGeometry args={[0.2, 0.03, 1.2]} />
                                <meshStandardMaterial color={frondColor} roughness={0.6} />
                              </mesh>
                            </group>
                          </group>
                        </group>
                      </group>
                    );
                  })}
                </group>
              </group>
            );
          }

          // Broadleaf / Ornamental / Flowering trees
          const foliageColor =
            t.type === 'flowering'
              ? EXPLORE_TOKENS.colors.flowerPink
              : t.tintIndex === 0
              ? EXPLORE_TOKENS.colors.grassDeep
              : t.tintIndex === 1
              ? EXPLORE_TOKENS.colors.grassLawn
              : EXPLORE_TOKENS.colors.grassSage;

          return (
            <group key={`tree-${idx}`} position={[t.x, 0, t.z]} scale={t.scale} rotation={[0, t.rotation, 0]}>
              {/* Wooden Trunk */}
              <mesh position={[0, 1.8, 0]} castShadow>
                <cylinderGeometry args={[0.26, 0.44, 3.6, 8]} />
                <meshStandardMaterial color={EXPLORE_TOKENS.colors.woodDark} roughness={0.9} />
              </mesh>

              {/* Multi-cluster Organic Canopy */}
              <group position={[0, 3.8, 0]}>
                {/* Center Main Canopy Sphere */}
                <mesh position={[0, 0.4, 0]} castShadow>
                  <sphereGeometry args={[1.7, 8, 8]} />
                  <meshStandardMaterial color={foliageColor} roughness={0.82} />
                </mesh>
                {/* Clustered side puff 1 */}
                <mesh position={[-0.9, 0.1, 0.5]} scale={0.85} castShadow>
                  <sphereGeometry args={[1.3, 7, 7]} />
                  <meshStandardMaterial color={foliageColor} roughness={0.82} />
                </mesh>
                {/* Clustered side puff 2 */}
                <mesh position={[0.8, 0.3, -0.6]} scale={0.9} castShadow>
                  <sphereGeometry args={[1.2, 7, 7]} />
                  <meshStandardMaterial color={foliageColor} roughness={0.82} />
                </mesh>
                {/* Top crest puff */}
                <mesh position={[0.2, 1.3, 0.1]} scale={0.75} castShadow>
                  <sphereGeometry args={[1.1, 7, 7]} />
                  <meshStandardMaterial color={foliageColor} roughness={0.82} />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>

      {/* 2. Structured Box Hedges along walkways and plazas */}
      {/* Front Entrance Avenue Left Hedge */}
      <mesh position={[-5.8, 0.6, 40]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 30]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.hedgeDark} roughness={0.85} />
      </mesh>
      {/* Front Entrance Avenue Right Hedge */}
      <mesh position={[5.8, 0.6, 40]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 30]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.hedgeDark} roughness={0.85} />
      </mesh>

      {/* Courtyard garden border hedges */}
      <mesh position={[-39, 0.55, -16]} castShadow receiveShadow>
        <boxGeometry args={[22, 0.8, 0.8]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.hedgeDark} roughness={0.85} />
      </mesh>
      <mesh position={[-51, 0.55, -28]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.8, 22]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.hedgeDark} roughness={0.85} />
      </mesh>

      {/* 3. Flowerbeds in Garden & Plaza Borders */}
      <group position={[-39, 0.16, -20]}>
        <mesh receiveShadow>
          <boxGeometry args={[8, 0.1, 1.8]} />
          <meshStandardMaterial color="#4A3B2C" roughness={0.9} />
        </mesh>
        {/* Colorful flowers */}
        {[-3, -1.8, -0.6, 0.6, 1.8, 3].map((fx, i) => (
          <mesh key={`flower-${i}`} position={[fx, 0.22, (i % 2 === 0 ? 0.3 : -0.3)]}>
            <cylinderGeometry args={[0.2, 0.2, 0.18, 6]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? EXPLORE_TOKENS.colors.flowerPink : i % 3 === 1 ? EXPLORE_TOKENS.colors.flowerYellow : EXPLORE_TOKENS.colors.flowerLavender}
              roughness={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* 4. Streetlights with dynamic night illumination & road glow */}
      {streetlights.map((l, idx) => (
        <StreetLight
          key={`lamp-${idx}`}
          position={[l.x, 0, l.z]}
          rotationY={l.rotation}
          height={l.height || 5.2}
          armReach={1.8}
          glowRadius={5.5}
        />
      ))}

      {/* 5. Campus Wooden Benches */}
      {benches.map((b, idx) => (
        <group key={`bench-${idx}`} position={[b.x, 0, b.z]} rotation={[0, b.rotation, 0]}>
          {/* Metal legs */}
          <mesh position={[-0.75, 0.25, 0]} castShadow>
            <boxGeometry args={[0.08, 0.5, 0.5]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.8} />
          </mesh>
          <mesh position={[0.75, 0.25, 0]} castShadow>
            <boxGeometry args={[0.08, 0.5, 0.5]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.8} />
          </mesh>
          {/* Wooden seat slats */}
          <mesh position={[0, 0.48, 0]} castShadow>
            <boxGeometry args={[1.8, 0.06, 0.55]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.woodWarm} roughness={0.5} />
          </mesh>
          {/* Wooden backrest */}
          <mesh position={[0, 0.78, -0.22]} castShadow>
            <boxGeometry args={[1.8, 0.4, 0.06]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.woodWarm} roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
