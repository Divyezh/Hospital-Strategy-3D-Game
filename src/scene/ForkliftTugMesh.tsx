'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimStore } from '@/store/useSimStore';

export interface ForkliftTugData {
  id: string; // 'FL-01', 'FL-02'
  model: string; // 'Toyota 8FBE18'
  operator: string; // 'Marcus Vance'
  status: 'Loading truck' | 'Unloading truck' | 'Carrying to Yard' | 'Charging at bay' | 'Idle';
  carrying: string; // 'Empty' | 'Pallet #102: Nitrile Gloves' | 'Emergency Stretcher #402'
  battery: number; // 78
  speedKmH: number; // 5.2
  position: [number, number, number];
  rotationY: number;
  forkElevation: number; // 0 to 1
  isCarryingCargo: boolean;
  cargoType: 'pallet' | 'stretcher';
}

interface ForkliftTugMeshProps {
  data: ForkliftTugData;
}

/**
 * High-fidelity Medical Logistics Forklift Tug ("MED-LIFT FL-01" / "FL-02")
 * Modeled with the exact chassis, roll cage, and mast fork lifting mechanics seen in the WareTrack video.
 */
export function ForkliftTugMesh({ data }: ForkliftTugMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mastCarriageRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group>(null);

  const selectedAgent = useSimStore((s) => s.selectedAgent);
  const setFollowedAgent = useSimStore((s) => s.setFollowedAgent);
  const isSelected = selectedAgent?.id === data.id;

  // Fork elevation animation: 0.08m (ground) to 0.95m (raised)
  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.position.set(data.position[0], data.position[1], data.position[2]);
      groupRef.current.rotation.y = data.rotationY;
    }

    if (mastCarriageRef.current) {
      const targetY = 0.08 + data.forkElevation * 0.85;
      mastCarriageRef.current.position.y = THREE.MathUtils.lerp(
        mastCarriageRef.current.position.y,
        targetY,
        Math.min(dt * 5, 1)
      );
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setFollowedAgent({
      id: data.id,
      name: `${data.id} — ${data.model}`,
      type: 'orderly',
      label: `${data.id} · ${data.status}`,
      status: data.status,
      position: { x: data.position[0], y: data.position[1], z: data.position[2] },
      details: {
        model: data.model,
        operator: data.operator,
        carrying: data.carrying,
        battery: `${data.battery}%`,
        speed: `${data.speedKmH} km/h`,
        charger: 'C1 (Fast DC 120kW)',
        movesToday: 28,
      },
    });
  };

  return (
    <group
      ref={groupRef}
      name={`forklift-${data.id}`}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'grab';
      }}
    >
      {/* Selection Bounding Box */}
      {isSelected && (
        <group position={[0, 1.25, 0]}>
          <mesh>
            <boxGeometry args={[2.0, 2.5, 3.2]} />
            <meshBasicMaterial color="#1E60F3" transparent opacity={0.15} />
          </mesh>
          {/* Corner brackets */}
          {[-1, 1].map((cx) =>
            [-1, 1].map((cz) => (
              <group key={`${cx}-${cz}`} position={[cx * 1.0, -1.2, cz * 1.5]}>
                <mesh position={[-cx * 0.2, 0, 0]}>
                  <boxGeometry args={[0.4, 0.08, 0.08]} />
                  <meshBasicMaterial color="#1E60F3" />
                </mesh>
                <mesh position={[0, 0, -cz * 0.2]}>
                  <boxGeometry args={[0.08, 0.08, 0.4]} />
                  <meshBasicMaterial color="#1E60F3" />
                </mesh>
                <mesh position={[0, 0.2, 0]}>
                  <boxGeometry args={[0.08, 0.4, 0.08]} />
                  <meshBasicMaterial color="#1E60F3" />
                </mesh>
              </group>
            ))
          )}
        </group>
      )}

      {/* Floating 3D Status Badge above vehicle */}
      <group position={[0, 2.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.8, 0.45]} />
          <meshBasicMaterial color="#0F172A" transparent opacity={0.85} />
        </mesh>
        <mesh position={[-0.7, 0, 0.01]}>
          <circleGeometry args={[0.1, 12]} />
          <meshBasicMaterial color={data.status === 'Charging at bay' ? '#10B981' : '#2563EB'} />
        </mesh>
      </group>

      {/* Main Body Chassis (Industrial Safety Orange / Hospital Teal Accent) */}
      <group position={[0, 0.35, -0.2]}>
        {/* Lower counterweight block */}
        <mesh position={[0, 0.2, -0.6]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.65, 0.9]} />
          <meshStandardMaterial color="#EA580C" roughness={0.35} metalness={0.2} />
        </mesh>

        {/* Center engine cowling & chassis deck */}
        <mesh position={[0, 0.15, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.45, 1.1]} />
          <meshStandardMaterial color="#EA580C" roughness={0.35} metalness={0.2} />
        </mesh>

        {/* Ergonomic Driver Seat */}
        <mesh position={[0, 0.55, -0.25]} castShadow>
          <boxGeometry args={[0.55, 0.35, 0.5]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>
        {/* Seat backrest */}
        <mesh position={[0, 0.85, -0.45]} castShadow>
          <boxGeometry args={[0.55, 0.45, 0.12]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>

        {/* Steering column and wheel */}
        <mesh position={[0, 0.65, 0.2]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.45, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.85, 0.12]} rotation={[1.1, 0, 0]}>
          <torusGeometry args={[0.18, 0.03, 8, 16]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* Matte Black Roll Cage / Overhead Protective Cabin Structure */}
      <group position={[0, 1.35, -0.2]}>
        {/* 4 Pillars */}
        {[-0.55, 0.55].map((px) =>
          [-0.6, 0.5].map((pz) => (
            <mesh key={`${px}-${pz}`} position={[px, 0, pz]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
              <meshStandardMaterial color="#0F172A" roughness={0.6} />
            </mesh>
          ))
        )}
        {/* Roof protective grid bars */}
        <mesh position={[0, 0.72, -0.05]} castShadow>
          <boxGeometry args={[1.15, 0.06, 1.15]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} />
        </mesh>
        {/* Amber beacon strobe on top */}
        <mesh position={[0, 0.8, -0.45]}>
          <cylinderGeometry args={[0.08, 0.09, 0.14, 12]} />
          <meshStandardMaterial
            color="#F59E0B"
            roughness={0.2}
            emissive="#F59E0B"
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>

      {/* Front Dual Vertical Mast Rails */}
      <group position={[0, 1.05, 0.85]}>
        {[-0.42, 0.42].map((mx) => (
          <mesh key={mx} position={[mx, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 1.9, 0.1]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} metalness={0.4} />
          </mesh>
        ))}
        {/* Cross braces */}
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.92, 0.08, 0.08]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.92, 0.08, 0.08]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>

        {/* Animated Lifting Mast Carriage & Forks */}
        <group ref={mastCarriageRef} position={[0, 0.08, 0.08]}>
          {/* Horizontal Fork Backrest Carriage */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[0.95, 0.45, 0.06]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Dual Chrome Steel Lifting Forks */}
          {[-0.28, 0.28].map((fx) => (
            <group key={fx} position={[fx, 0, 0]}>
              {/* Vertical fork shank */}
              <mesh position={[0, 0.22, 0.04]} castShadow>
                <boxGeometry args={[0.1, 0.48, 0.04]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Horizontal fork blade (extends forward under cargo) */}
              <mesh position={[0, 0.02, 0.6]} castShadow receiveShadow>
                <boxGeometry args={[0.1, 0.04, 1.15]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          ))}

          {/* Carried Cargo: Wooden Pallet or Emergency Stretcher */}
          {data.isCarryingCargo && (
            <group position={[0, 0.06, 0.65]}>
              {data.cargoType === 'pallet' ? (
                // Wooden Pallet with Medical Supply Crates
                <group>
                  {/* Pallet base */}
                  <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.0, 0.12, 1.0]} />
                    <meshStandardMaterial color="#B45309" roughness={0.8} />
                  </mesh>
                  {/* Stacked medical cartons */}
                  <mesh position={[0, 0.38, 0]} castShadow>
                    <boxGeometry args={[0.88, 0.55, 0.88]} />
                    <meshStandardMaterial color="#D97706" roughness={0.6} />
                  </mesh>
                  {/* Shrink-wrap translucent sheen */}
                  <mesh position={[0, 0.38, 0]}>
                    <boxGeometry args={[0.9, 0.57, 0.9]} />
                    <meshStandardMaterial color="#FFFFFF" transparent opacity={0.25} />
                  </mesh>
                </group>
              ) : (
                // Emergency Patient Stretcher Cart
                <group>
                  <mesh position={[0, 0.25, 0]} castShadow>
                    <boxGeometry args={[0.8, 0.1, 1.5]} />
                    <meshStandardMaterial color="#94A3B8" metalness={0.7} />
                  </mesh>
                  <mesh position={[0, 0.34, 0]} castShadow>
                    <boxGeometry args={[0.74, 0.08, 1.4]} />
                    <meshStandardMaterial color="#38BDF8" roughness={0.5} />
                  </mesh>
                </group>
              )}
            </group>
          )}
        </group>
      </group>

      {/* 4 Heavy-Duty Rubber Wheels */}
      <group ref={wheelsRef}>
        {/* Front drive wheels */}
        {[-0.65, 0.65].map((wx) => (
          <mesh
            key={`fw-${wx}`}
            position={[wx, 0.22, 0.6]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.22, 0.22, 0.18, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
        ))}
        {/* Rear steering wheels (smaller) */}
        {[-0.55, 0.55].map((wx) => (
          <mesh
            key={`rw-${wx}`}
            position={[wx, 0.18, -0.65]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.18, 0.18, 0.15, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
