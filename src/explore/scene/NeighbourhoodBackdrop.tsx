'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CAMPUS_LAYOUT } from '@/data/campus';
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

      {/* 2. Moving Ambient Vehicles along South Outer Avenue (Z: 68) */}
      <group ref={carsRef}>
        {/* Car 1: White sedan westbound */}
        <group position={[-50, 0.6, 65.5]} userData={{ speed: 14, dir: 1 }}>
          <mesh castShadow>
            <boxGeometry args={[4.2, 1.2, 1.9]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0.2, 0.9, 0]}>
            <boxGeometry args={[2.2, 0.9, 1.75]} />
            <meshStandardMaterial color="#1E293B" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>

        {/* Car 2: Navy SUV eastbound */}
        <group position={[30, 0.7, 70.5]} userData={{ speed: 12, dir: -1 }}>
          <mesh castShadow>
            <boxGeometry args={[4.6, 1.4, 2.0]} />
            <meshStandardMaterial color="#1E3A8A" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[2.8, 0.9, 1.85]} />
            <meshStandardMaterial color="#1E293B" roughness={0.1} />
          </mesh>
        </group>

        {/* Car 3: Yellow taxi westbound */}
        <group position={[10, 0.6, 65.5]} userData={{ speed: 15, dir: 1 }}>
          <mesh castShadow>
            <boxGeometry args={[4.1, 1.2, 1.9]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0.2, 0.9, 0]}>
            <boxGeometry args={[2.1, 0.85, 1.75]} />
            <meshStandardMaterial color="#1E293B" roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* 3. Outer City Power / Light Poles along South Avenue */}
      {[-90, -50, -10, 30, 70].map((x) => (
        <group key={`outer-pole-${x}`} position={[x, 0, 75]}>
          <mesh position={[0, 5, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.14, 10, 8]} />
            <meshStandardMaterial color="#4A5568" metalness={0.8} />
          </mesh>
          <mesh position={[0, 9.8, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 2.8, 6]} />
            <meshStandardMaterial color="#4A5568" metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
