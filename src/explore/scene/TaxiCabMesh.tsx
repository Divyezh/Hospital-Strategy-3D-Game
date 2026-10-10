
'use client';

import React from 'react';
import * as THREE from 'three';

interface TaxiCabMeshProps {
  wheelRotation?: number;
  hasDriver?: boolean;
  trunkOpen?: boolean;
}

export function TaxiCabMesh({
  wheelRotation = 0,
  hasDriver = true,
  trunkOpen = false,
}: TaxiCabMeshProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Lower Body Chassis (Length 4.5m, Width 1.9m, Height 0.65m) */}
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.55, 4.4]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Front & Rear Bumpers */}
      <mesh position={[0, 0.42, 2.22]} castShadow>
        <boxGeometry args={[1.92, 0.28, 0.15]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      <mesh position={[0, 0.42, -2.22]} castShadow>
        <boxGeometry args={[1.92, 0.28, 0.15]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>

      {/* Checkered Taxi Stripe along side doors */}
      <mesh position={[0.96, 0.62, 0]}>
        <boxGeometry args={[0.02, 0.08, 2.8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.96, 0.62, 0]}>
        <boxGeometry args={[0.02, 0.08, 2.8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* 2. Cabin Greenhouse (Roof & Glass) */}
      <mesh position={[0, 1.15, -0.1]} castShadow>
        <boxGeometry args={[1.65, 0.72, 2.4]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.3} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.15, 1.05]} rotation={[-0.32, 0, 0]}>
        <boxGeometry args={[1.58, 0.62, 0.04]} />
        <meshStandardMaterial color="#0F172A" transparent opacity={0.65} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Rear glass */}
      <mesh position={[0, 1.15, -1.25]} rotation={[0.32, 0, 0]}>
        <boxGeometry args={[1.58, 0.62, 0.04]} />
        <meshStandardMaterial color="#0F172A" transparent opacity={0.65} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Side windows */}
      <mesh position={[0.84, 1.15, -0.1]}>
        <boxGeometry args={[0.02, 0.52, 2.1]} />
        <meshStandardMaterial color="#0F172A" transparent opacity={0.65} roughness={0.1} />
      </mesh>
      <mesh position={[-0.84, 1.15, -0.1]}>
        <boxGeometry args={[0.02, 0.52, 2.1]} />
        <meshStandardMaterial color="#0F172A" transparent opacity={0.65} roughness={0.1} />
      </mesh>

      {/* 3. Illuminated "TAXI" Roof Light Beacon */}
      <group position={[0, 1.58, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.16, 0.22]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={1.5} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.09, 0]}>
          <boxGeometry args={[0.7, 0.04, 0.25]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* 4. Headlights & Taillights */}
      <mesh position={[-0.68, 0.6, 2.22]}>
        <boxGeometry args={[0.32, 0.16, 0.04]} />
        <meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.68, 0.6, 2.22]}>
        <boxGeometry args={[0.32, 0.16, 0.04]} />
        <meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-0.68, 0.6, -2.22]}>
        <boxGeometry args={[0.32, 0.16, 0.04]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0.68, 0.6, -2.22]}>
        <boxGeometry args={[0.32, 0.16, 0.04]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.4} />
      </mesh>

      {/* 5. Driver */}
      {hasDriver && (
        <group position={[-0.45, 0.95, 0.2]}>
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.13, 8, 8]} />
            <meshStandardMaterial color="#E0AC69" />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.32, 0.35, 0.18]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        </group>
      )}

      {/* 6. Wheels */}
      {/* Front Left */}
      <group position={[-0.86, 0.32, 1.35]} rotation={[wheelRotation, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.23, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
        </mesh>
      </group>
      {/* Front Right */}
      <group position={[0.86, 0.32, 1.35]} rotation={[wheelRotation, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.23, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
        </mesh>
      </group>
      {/* Rear Left */}
      <group position={[-0.86, 0.32, -1.35]} rotation={[wheelRotation, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.23, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
        </mesh>
      </group>
      {/* Rear Right */}
      <group position={[0.86, 0.32, -1.35]} rotation={[wheelRotation, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.22, 16]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.23, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
