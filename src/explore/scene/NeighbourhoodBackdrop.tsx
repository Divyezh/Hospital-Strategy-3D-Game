'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CAMPUS_LAYOUT } from '@/data/campus';
import { SportsCarMesh } from './SportsCarMesh';
import { SuvCarMesh } from './SuvCarMesh';
import { SedanCarMesh } from './SedanCarMesh';
import { StreetLight } from './StreetLight';
import { EXPLORE_TOKENS } from '@/explore/tokens';
import { useExploreStore } from '@/explore/store';

export function NeighbourhoodBackdrop() {
  const timeOfDay = useExploreStore((s) => s.timeOfDay);
  const isNight = timeOfDay === 'night';

  const carsRef = useRef<THREE.Group>(null);

  // Moving ambient traffic on the perimeter ring roads
  useFrame((_, delta) => {
    if (!carsRef.current) return;
    carsRef.current.children.forEach((car) => {
      const speed = (car.userData.speed || 12) * delta;
      const dir = car.userData.dir || 1;
      car.position.x += speed * dir;

      // Wrap around expanded road bounds
      if (dir > 0 && car.position.x > 300) {
        car.position.x = -300;
      } else if (dir < 0 && car.position.x < -300) {
        car.position.x = 300;
      }
    });
  });

  return (
    <group>
      {/* 1. Surrounding City Skyline Buildings */}
      {CAMPUS_LAYOUT.neighbourhoodBuildings.map((b, idx) => (
        <group key={`city-bldg-${idx}`} position={[b.x, 0, b.z]}>
          {/* Main building block */}
          <mesh position={[0, b.height / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.65}
              metalness={b.type === 'tower' ? 0.35 : 0.05}
            />
          </mesh>

          {/* Glass window curtain stripes for towers */}
          {b.type === 'tower' && (
            <mesh position={[0, b.height / 2, b.depth / 2 + 0.05]}>
              <boxGeometry args={[b.width * 0.82, b.height * 0.9, 0.08]} />
              <meshStandardMaterial
                color={b.windowColor || EXPLORE_TOKENS.colors.glassTeal}
                roughness={0.12}
                metalness={0.88}
                transparent
                opacity={0.85}
              />
            </mesh>
          )}

          {/* Night window lights glow */}
          {isNight && (
            <mesh position={[0, b.height * 0.5, b.depth * 0.5 + 0.08]}>
              <boxGeometry args={[b.width * 0.7, b.height * 0.75, 0.05]} />
              <meshStandardMaterial
                color="#FFE699"
                emissive="#FFD777"
                emissiveIntensity={1.2}
              />
            </mesh>
          )}

          {/* Rooftop utility equipment / antenna */}
          <mesh position={[0, b.height + 0.9, 0]} castShadow>
            <boxGeometry args={[b.width * 0.35, 1.8, b.depth * 0.35]} />
            <meshStandardMaterial color="#68737D" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* 2. Moving Ambient Vehicles along South Outer Metropolitan Boulevard */}
      <group ref={carsRef}>
        {/* Car 1: Luxury Pearl White Sedan (Eastbound on Z: 70.5) */}
        <group position={[-50, 0.15, 70.5]} rotation={[0, Math.PI / 2, 0]} userData={{ speed: 14, dir: 1 }}>
          <SedanCarMesh color="#F8FAFC" headlightsOn={true} />
        </group>

        {/* Car 2: Deep Navy Luxury SUV (Westbound on Z: 78.5) */}
        <group position={[30, 0.15, 78.5]} rotation={[0, -Math.PI / 2, 0]} userData={{ speed: 12, dir: -1 }}>
          <SuvCarMesh color="#1E3A8A" headlightsOn={true} />
        </group>

        {/* Car 3: Rosso Red High-Performance Sports Car (Eastbound on Z: 70.5) */}
        <group position={[-160, 0.15, 70.5]} rotation={[0, Math.PI / 2, 0]} userData={{ speed: 18, dir: 1 }}>
          <SportsCarMesh color="#DC2626" hasSpoiler={true} headlightsOn={true} />
        </group>

        {/* Car 4: Sunset Orange Supercar (Westbound on Z: 78.5) */}
        <group position={[140, 0.15, 78.5]} rotation={[0, -Math.PI / 2, 0]} userData={{ speed: 17, dir: -1 }}>
          <SportsCarMesh color="#F59E0B" hasSpoiler={true} headlightsOn={true} />
        </group>

        {/* Car 5: Slate Gray Luxury SUV (Eastbound on Z: 70.5) */}
        <group position={[70, 0.15, 70.5]} rotation={[0, Math.PI / 2, 0]} userData={{ speed: 13, dir: 1 }}>
          <SuvCarMesh color="#334155" headlightsOn={true} />
        </group>

        {/* Car 6: Executive Graphite Sedan (Westbound on Z: 78.5) */}
        <group position={[-80, 0.15, 78.5]} rotation={[0, -Math.PI / 2, 0]} userData={{ speed: 15, dir: -1 }}>
          <SedanCarMesh color="#1E293B" headlightsOn={true} />
        </group>
      </group>

      {/* 3. Modern LED Architectural Streetlights along Metropolitan Boulevard */}
      <group>
        {/* South Curbside Streetlights (Illuminating Westbound Lanes) */}
        {[-200, -150, -100, -50, 0, 50, 100, 150, 200].map((x) => (
          <StreetLight
            key={`south-light-${x}`}
            position={[x, 0, 84]}
            rotationY={-Math.PI / 2}
            height={8.5}
            armReach={3.2}
            glowRadius={8.5}
          />
        ))}

        {/* North Curbside Streetlights (Illuminating Eastbound Lanes) */}
        {[-175, -125, -75, -25, 25, 75, 125, 175].map((x) => (
          <StreetLight
            key={`north-light-${x}`}
            position={[x, 0, 62]}
            rotationY={Math.PI / 2}
            height={8.5}
            armReach={3.2}
            glowRadius={8.5}
          />
        ))}
      </group>
    </group>
  );
}
