'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { EXPLORE_TOKENS } from '@/explore/tokens';

interface AmbulanceMeshProps {
  flashing?: boolean;
  wheelAngle?: number;
  brakeLights?: boolean;
  headlights?: boolean;
}

export function AmbulanceMesh({
  flashing = true,
  brakeLights = false,
  headlights = true,
}: AmbulanceMeshProps) {
  const mainGroupRef = useRef<THREE.Group>(null);
  const redLightRef = useRef<THREE.PointLight>(null);
  const blueLightRef = useRef<THREE.PointLight>(null);
  const redBoxRef = useRef<THREE.MeshStandardMaterial>(null);
  const blueBoxRef = useRef<THREE.MeshStandardMaterial>(null);

  const wheelsRef = useRef<(THREE.Group | null)[]>([]);
  const wheelAngleRef = useRef(0);
  const lastPosRef = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    // 1. Wheel spin driven by distance traveled
    if (mainGroupRef.current) {
      const curPos = mainGroupRef.current.position;
      const dist = Math.hypot(
        curPos.x - lastPosRef.current.x,
        curPos.z - lastPosRef.current.z
      );
      if (dist > 0.0005 && dist < 4.0) {
        wheelAngleRef.current += dist / 0.42;
        for (const wheel of wheelsRef.current) {
          if (wheel) wheel.rotation.x = wheelAngleRef.current;
        }
      }
      lastPosRef.current.copy(curPos);
    }

    // 2. Emergency strobe flashing
    if (!flashing) return;
    const t = clock.getElapsedTime() * 7;
    const isRed = Math.sin(t) > 0;

    if (redLightRef.current) redLightRef.current.intensity = isRed ? 2.2 : 0.1;
    if (blueLightRef.current) blueLightRef.current.intensity = isRed ? 0.1 : 2.2;

    if (redBoxRef.current) {
      redBoxRef.current.emissiveIntensity = isRed ? 2.5 : 0.2;
    }
    if (blueBoxRef.current) {
      blueBoxRef.current.emissiveIntensity = isRed ? 0.2 : 2.5;
    }
  });

  return (
    <group ref={mainGroupRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* Main Ambulance Body */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 1.6, 5.2]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>

      {/* Cab Windshield & Windows */}
      <mesh position={[0, 1.5, -1.6]}>
        <boxGeometry args={[2.2, 0.7, 1.2]} />
        <meshStandardMaterial color="#1E293B" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Emergency Red Belt Stripe */}
      <mesh position={[0, 1.05, 0.4]}>
        <boxGeometry args={[2.32, 0.35, 4.3]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.emergencyRed} roughness={0.4} />
      </mesh>

      {/* Medical Cross on sides */}
      <mesh position={[-1.17, 1.35, 0.6]}>
        <boxGeometry args={[0.02, 0.5, 0.16]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.emergencyRed} />
      </mesh>
      <mesh position={[-1.17, 1.35, 0.6]}>
        <boxGeometry args={[0.02, 0.16, 0.5]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.emergencyRed} />
      </mesh>
      <mesh position={[1.17, 1.35, 0.6]}>
        <boxGeometry args={[0.02, 0.5, 0.16]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.emergencyRed} />
      </mesh>
      <mesh position={[1.17, 1.35, 0.6]}>
        <boxGeometry args={[0.02, 0.16, 0.5]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.emergencyRed} />
      </mesh>

      {/* Roof Emergency Lightbar */}
      <group position={[0, 2.15, -1.0]}>
        {/* Lightbar housing */}
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.16, 0.3]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Red strobe lens */}
        <mesh position={[-0.5, 0.1, 0]}>
          <boxGeometry args={[0.45, 0.14, 0.24]} />
          <meshStandardMaterial
            ref={redBoxRef}
            color={EXPLORE_TOKENS.colors.emergencyRed}
            emissive={EXPLORE_TOKENS.colors.emergencyRed}
            emissiveIntensity={1.8}
          />
        </mesh>
        <pointLight ref={redLightRef} position={[-0.5, 0.3, 0]} color="#EF4444" intensity={1.5} distance={10} decay={2} />

        {/* Blue strobe lens */}
        <mesh position={[0.5, 0.1, 0]}>
          <boxGeometry args={[0.45, 0.14, 0.24]} />
          <meshStandardMaterial
            ref={blueBoxRef}
            color="#3B82F6"
            emissive="#3B82F6"
            emissiveIntensity={1.8}
          />
        </mesh>
        <pointLight ref={blueLightRef} position={[0.5, 0.3, 0]} color="#3B82F6" intensity={1.5} distance={10} decay={2} />
      </group>

      {/* Headlights (at front Z: -2.6) */}
      {headlights && (
        <>
          <mesh position={[-0.8, 0.9, -2.62]}>
            <boxGeometry args={[0.3, 0.18, 0.05]} />
            <meshStandardMaterial color="#FFFBEB" emissive="#FEF08A" emissiveIntensity={2.0} />
          </mesh>
          <mesh position={[0.8, 0.9, -2.62]}>
            <boxGeometry args={[0.3, 0.18, 0.05]} />
            <meshStandardMaterial color="#FFFBEB" emissive="#FEF08A" emissiveIntensity={2.0} />
          </mesh>
        </>
      )}

      {/* Tail / Brake Lights (at rear Z: 2.6) */}
      <mesh position={[-0.85, 1.1, 2.62]}>
        <boxGeometry args={[0.25, 0.45, 0.05]} />
        <meshStandardMaterial
          color="#DC2626"
          emissive="#EF4444"
          emissiveIntensity={brakeLights ? 3.0 : 0.8}
        />
      </mesh>
      <mesh position={[0.85, 1.1, 2.62]}>
        <boxGeometry args={[0.25, 0.45, 0.05]} />
        <meshStandardMaterial
          color="#DC2626"
          emissive="#EF4444"
          emissiveIntensity={brakeLights ? 3.0 : 0.8}
        />
      </mesh>

      {/* 4 Wheels (Spinning around lateral axis by distance traveled) */}
      {[
        [-1.15, -1.6],
        [1.15, -1.6],
        [-1.15, 1.5],
        [1.15, 1.5],
      ].map(([wx, wz], idx) => (
        <group
          key={`wheel-${wx}-${wz}`}
          ref={(el) => {
            wheelsRef.current[idx] = el;
          }}
          position={[wx, 0.42, wz]}
        >
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.25, 16]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[wx > 0 ? 0.05 : -0.05, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.26, 12]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
