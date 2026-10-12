'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TrafficCar {
  id: number;
  type: 'bus' | 'truck' | 'sedan';
  laneZ: number;
  dir: number; // 1 = right, -1 = left
  speed: number;
  color: string;
  xOffset: number;
}

export function HighwayTraffic() {
  const groupRef = useRef<THREE.Group>(null);

  // Initialize a realistic stream of highway traffic
  const vehicles: TrafficCar[] = useMemo(
    () => [
      { id: 1, type: 'bus', laneZ: 28, dir: 1, speed: 12, color: '#0284C7', xOffset: -45 },
      { id: 2, type: 'truck', laneZ: 28, dir: 1, speed: 10, color: '#FFFFFF', xOffset: 5 },
      { id: 3, type: 'sedan', laneZ: 28, dir: 1, speed: 15, color: '#E11D48', xOffset: 35 },
      { id: 4, type: 'sedan', laneZ: 32, dir: -1, speed: 14, color: '#3B82F6', xOffset: 40 },
      { id: 5, type: 'truck', laneZ: 32, dir: -1, speed: 11, color: '#0D9488', xOffset: -10 },
      { id: 6, type: 'sedan', laneZ: 32, dir: -1, speed: 16, color: '#F59E0B', xOffset: -50 },
    ],
    []
  );

  const vehicleRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame((_, dt) => {
    vehicles.forEach((veh, idx) => {
      const mesh = vehicleRefs.current[idx];
      if (!mesh) return;

      mesh.position.x += veh.dir * veh.speed * dt;

      // Wrap around road boundaries (-85 to +85)
      if (veh.dir === 1 && mesh.position.x > 85) {
        mesh.position.x = -85;
      } else if (veh.dir === -1 && mesh.position.x < -85) {
        mesh.position.x = 85;
      }
    });
  });

  return (
    <group ref={groupRef} name="highway-traffic">
      {vehicles.map((veh, idx) => (
        <group
          key={veh.id}
          ref={(el) => {
            vehicleRefs.current[idx] = el;
          }}
          position={[veh.xOffset, 0, veh.laneZ]}
          rotation={[0, veh.dir === 1 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          {veh.type === 'bus' ? (
            // City Transit Bus
            <group position={[0, 1.3, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[2.5, 2.2, 9.2]} />
                <meshStandardMaterial color={veh.color} roughness={0.3} />
              </mesh>
              {/* Roof AC unit */}
              <mesh position={[0, 1.25, 0]}>
                <boxGeometry args={[1.6, 0.35, 4.2]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
              {/* Tinted glass ribbon */}
              <mesh position={[0, 0.35, 0]}>
                <boxGeometry args={[2.54, 0.75, 8.8]} />
                <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.8} />
              </mesh>
            </group>
          ) : veh.type === 'truck' ? (
            // Commercial Freight Truck
            <group position={[0, 1.4, 0]}>
              {/* Cab */}
              <mesh position={[0, -0.2, 2.5]} castShadow>
                <boxGeometry args={[2.4, 2.1, 2.0]} />
                <meshStandardMaterial color="#1E293B" roughness={0.4} />
              </mesh>
              {/* Cargo Box */}
              <mesh position={[0, 0.2, -1.2]} castShadow receiveShadow>
                <boxGeometry args={[2.5, 2.5, 5.5]} />
                <meshStandardMaterial color={veh.color} roughness={0.3} />
              </mesh>
            </group>
          ) : (
            // Sedan
            <group position={[0, 0.65, 0]}>
              <mesh castShadow>
                <boxGeometry args={[1.9, 0.75, 4.2]} />
                <meshStandardMaterial color={veh.color} roughness={0.3} metalness={0.2} />
              </mesh>
              {/* Cabin Glass */}
              <mesh position={[0, 0.55, -0.2]}>
                <boxGeometry args={[1.6, 0.55, 2.2]} />
                <meshStandardMaterial color="#93C5FD" roughness={0.1} metalness={0.7} />
              </mesh>
            </group>
          )}

          {/* Rubber Wheels */}
          {[-1.1, 1.1].map((wx) =>
            [-1.8, 1.8].map((wz) => (
              <mesh
                key={`${wx}-${wz}`}
                position={[wx, 0.32, wz]}
                rotation={[0, 0, Math.PI / 2]}
                castShadow
              >
                <cylinderGeometry args={[0.32, 0.32, 0.22, 12]} />
                <meshStandardMaterial color="#0F172A" roughness={0.9} />
              </mesh>
            ))
          )}
        </group>
      ))}
    </group>
  );
}
