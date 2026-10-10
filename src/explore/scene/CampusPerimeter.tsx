'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { EXPLORE_TOKENS } from '@/explore/tokens';
import { getConcreteTexture } from '@/explore/textures';

interface GateProps {
  vehicleGateOpen?: boolean;
}

export function CampusPerimeter({ vehicleGateOpen = false }: GateProps) {
  const concreteTex = useMemo(() => getConcreteTexture(), []);

  // Smooth gate slide & barrier arm lerp refs
  const leftGateRef = useRef<THREE.Group>(null);
  const rightGateRef = useRef<THREE.Group>(null);
  const barrierArmRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const targetLeft = vehicleGateOpen ? -8.0 : -2.8;
    const targetRight = vehicleGateOpen ? 8.0 : 2.8;
    const targetArmAngle = vehicleGateOpen ? Math.PI / 2.3 : 0;

    if (leftGateRef.current) {
      leftGateRef.current.position.x = THREE.MathUtils.lerp(
        leftGateRef.current.position.x,
        targetLeft,
        delta * 3.5
      );
    }
    if (rightGateRef.current) {
      rightGateRef.current.position.x = THREE.MathUtils.lerp(
        rightGateRef.current.position.x,
        targetRight,
        delta * 3.5
      );
    }
    if (barrierArmRef.current) {
      barrierArmRef.current.rotation.z = THREE.MathUtils.lerp(
        barrierArmRef.current.rotation.z,
        targetArmAngle,
        delta * 4.0
      );
    }
  });

  return (
    <group>
      {/* 1. Perimeter Masonry Base Wall + Iron Railing */}
      {/* South Wall (front, except for the 16m gate gap at X: [-8, 8], Z: 56) */}
      {/* Left Front Wall: X = -65 to -8 (center -36.5, length 57) */}
      <mesh position={[-36.5, 0.45, 56]} castShadow receiveShadow>
        <boxGeometry args={[57, 0.9, 0.5]} />
        <meshStandardMaterial map={concreteTex} color={EXPLORE_TOKENS.colors.concrete} roughness={0.9} />
      </mesh>
      {/* Iron Railings on top of Left Front Wall */}
      <mesh position={[-36.5, 1.45, 56]} castShadow>
        <boxGeometry args={[57, 1.1, 0.08]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.fenceIron} metalness={0.9} roughness={0.3} wireframe={false} />
      </mesh>

      {/* Right Front Wall: X = 10 to 65 (center 37.5, length 55) */}
      <mesh position={[37.5, 0.45, 56]} castShadow receiveShadow>
        <boxGeometry args={[55, 0.9, 0.5]} />
        <meshStandardMaterial map={concreteTex} color={EXPLORE_TOKENS.colors.concrete} roughness={0.9} />
      </mesh>
      <mesh position={[37.5, 1.45, 56]} castShadow>
        <boxGeometry args={[55, 1.1, 0.08]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.fenceIron} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* North Wall: X: [-65, 65], Z: -54 (length 130) */}
      <mesh position={[0, 0.45, -54]} castShadow receiveShadow>
        <boxGeometry args={[130, 0.9, 0.5]} />
        <meshStandardMaterial map={concreteTex} color={EXPLORE_TOKENS.colors.concrete} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.45, -54]} castShadow>
        <boxGeometry args={[130, 1.1, 0.08]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.fenceIron} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* East Wall: Z: [-54, 56], X: 65 (length 110) */}
      <mesh position={[65, 0.45, 1]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.9, 110]} />
        <meshStandardMaterial map={concreteTex} color={EXPLORE_TOKENS.colors.concrete} roughness={0.9} />
      </mesh>
      <mesh position={[65, 1.45, 1]} castShadow>
        <boxGeometry args={[0.08, 1.1, 110]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.fenceIron} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* West Wall: Z: [-54, 56], X: -65 (length 110) */}
      <mesh position={[-65, 0.45, 1]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.9, 110]} />
        <meshStandardMaterial map={concreteTex} color={EXPLORE_TOKENS.colors.concrete} roughness={0.9} />
      </mesh>
      <mesh position={[-65, 1.45, 1]} castShadow>
        <boxGeometry args={[0.08, 1.1, 110]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.fenceIron} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Stone Pillars along fence */}
      {[-65, -50, -35, -20, -8, 10, 25, 40, 55, 65].map((x) => (
        <mesh key={`pillar-s-${x}`} position={[x, 1.1, 56]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 2.2, 0.8]} />
          <meshStandardMaterial color="#E0DCD4" roughness={0.85} />
        </mesh>
      ))}

      {/* 2. MAIN GATE COMPLEX (X: 0, Z: 56) */}
      {/* Archway Pillars */}
      <mesh position={[-6, 3.2, 56]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 6.4, 1.2]} />
        <meshStandardMaterial map={concreteTex} color={EXPLORE_TOKENS.colors.concrete} roughness={0.8} />
      </mesh>
      <mesh position={[6, 3.2, 56]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 6.4, 1.2]} />
        <meshStandardMaterial map={concreteTex} color={EXPLORE_TOKENS.colors.concrete} roughness={0.8} />
      </mesh>

      {/* Arch Overhead Crossbeam */}
      <mesh position={[0, 6.2, 56]} castShadow>
        <boxGeometry args={[13.2, 1.1, 1.2]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.medicalBlueDark} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Arch Signboard "MEDICITY HOSPITAL" */}
      <mesh position={[0, 6.2, 56.65]}>
        <boxGeometry args={[10.5, 0.8, 0.1]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.medicalBlue} roughness={0.2} metalness={0.4} />
      </mesh>
      <Text
        position={[0, 6.2, 56.75]}
        fontSize={0.42}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        MEDICITY HOSPITAL
      </Text>

      {/* Sliding Vehicle Gate Left Panel (Animates or shifts when open) */}
      <group ref={leftGateRef} position={[-2.8, 1.2, 56]}>
        <mesh castShadow>
          <boxGeometry args={[5.2, 2.2, 0.12]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.fenceIron} metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* Sliding Vehicle Gate Right Panel */}
      <group ref={rightGateRef} position={[2.8, 1.2, 56]}>
        <mesh castShadow>
          <boxGeometry args={[5.2, 2.2, 0.12]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.fenceIron} metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* Motorized Barrier Arm (Pivots up when gate opens) */}
      <group position={[-5.2, 1.1, 55.4]}>
        {/* Arm motor housing pedestal */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 1.1, 0.5]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.alertOrange} roughness={0.4} />
        </mesh>
        {/* Red & white striped barrier arm */}
        <group ref={barrierArmRef} position={[0.25, 0.45, 0]}>
          <mesh position={[2.6, 0, 0]} castShadow>
            <boxGeometry args={[5.2, 0.14, 0.08]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[1.5, 0, 0.01]}>
            <boxGeometry args={[0.8, 0.15, 0.08]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.emergencyRed} />
          </mesh>
          <mesh position={[3.5, 0, 0.01]}>
            <boxGeometry args={[0.8, 0.15, 0.08]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.emergencyRed} />
          </mesh>
        </group>
      </group>

      {/* Guard Booth (Right side of gate: X: 8.2, Z: 56) */}
      <group position={[8.2, 0, 56]}>
        {/* Booth base/walls */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 3.2, 3.4]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.wallWhite} roughness={0.6} />
        </mesh>
        {/* Tinted glass panoramic observation window */}
        <mesh position={[-1.61, 1.7, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[2.2, 1.3, 0.05]} />
          <meshStandardMaterial
            color={EXPLORE_TOKENS.colors.glassTeal}
            transparent
            opacity={0.6}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
        {/* Front observation window */}
        <mesh position={[0, 1.7, 1.71]}>
          <boxGeometry args={[2.0, 1.3, 0.05]} />
          <meshStandardMaterial
            color={EXPLORE_TOKENS.colors.glassTeal}
            transparent
            opacity={0.6}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
        {/* Overhanging Roof */}
        <mesh position={[0, 3.3, 0]} castShadow>
          <boxGeometry args={[3.8, 0.3, 4.0]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.medicalBlueDark} metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Pedestrian Turnstile Gate (Left of gate: X: -6.8, Z: 56) */}
      <group position={[-6.8, 0, 56]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2.2]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.1, 0]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.4, 0.06, 0.06]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalSteel} metalness={0.9} />
        </mesh>
        <mesh position={[0, 1.1, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[1.4, 0.06, 0.06]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalSteel} metalness={0.9} />
        </mesh>
      </group>

      {/* (Transit bus terminal is managed by TransitHubAndVehicles) */}
    </group>
  );
}
