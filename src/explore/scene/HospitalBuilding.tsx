'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { EXPLORE_TOKENS } from '@/explore/tokens';
import { HOSPITAL_ROOMS, FLOOR_HEIGHT, BUILDING_BOUNDS } from '@/data/hospital';
import { HospitalProps } from './HospitalProps';
import { useExploreStore } from '@/explore/store';
import { getConcreteTexture } from '@/explore/textures';
import { HospitalStaffSimulation } from './HospitalStaffSimulation';

export function HospitalBuilding() {
  const selectedFloor = useExploreStore((s) => s.selectedFloor);
  const concreteTex = useMemo(() => getConcreteTexture(), []);

  // Moving elevator reference
  const elevatorCarRef = useRef<THREE.Group>(null);
  const elevatorY = useRef(0);
  const elevatorDir = useRef(1);

  useFrame((_, delta) => {
    if (!elevatorCarRef.current) return;
    // Elevator travels up and down smoothly between G (0) and 2nd floor (8.4)
    elevatorY.current += elevatorDir.current * delta * 2.2;
    if (elevatorY.current >= FLOOR_HEIGHT * 2) {
      elevatorY.current = FLOOR_HEIGHT * 2;
      elevatorDir.current = -1;
    } else if (elevatorY.current <= 0) {
      elevatorY.current = 0;
      elevatorDir.current = 1;
    }
    elevatorCarRef.current.position.y = elevatorY.current;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Building Foundation Slab */}
      <mesh position={[0, 0.1, -1]} receiveShadow>
        <boxGeometry args={[46, 0.2, 32]} />
        <meshStandardMaterial map={concreteTex} color={EXPLORE_TOKENS.colors.concrete} roughness={0.88} />
      </mesh>

      {/* 2. Three Modular Floors */}
      {[0, 1, 2].map((floorIndex) => {
        // Cutaway visibility: hide upper floors if a lower floor is focused
        if (selectedFloor !== null && floorIndex > selectedFloor) {
          return null;
        }

        const floorY = floorIndex * FLOOR_HEIGHT;
        const floorRooms = HOSPITAL_ROOMS.filter((r) => r.floor === floorIndex);

        return (
          <group key={`floor-${floorIndex}`} position={[0, floorY, 0]}>
            {/* Floor Slab */}
            <mesh position={[0, 0.15, -1]} receiveShadow>
              <boxGeometry args={[44.8, 0.25, 30.8]} />
              <meshStandardMaterial map={concreteTex} color="#DCD7CE" roughness={0.8} />
            </mesh>

            {/* Interior Department Partitions and Rooms */}
            {floorRooms.map((room) => {
              const rw = room.bounds.maxX - room.bounds.minX;
              const rd = room.bounds.maxZ - room.bounds.minZ;
              const rx = (room.bounds.minX + room.bounds.maxX) / 2;
              const rz = (room.bounds.minZ + room.bounds.maxZ) / 2;

              return (
                <group key={`room-${room.id}`}>
                  {/* Tiled room floor finish */}
                  <mesh position={[rx, 0.22, rz]} receiveShadow>
                    <boxGeometry args={[rw - 0.2, 0.05, rd - 0.2]} />
                    <meshStandardMaterial color={room.floorColor} roughness={0.4} />
                  </mesh>

                  {/* North Wall of Room */}
                  <mesh position={[rx, FLOOR_HEIGHT / 2, room.bounds.minZ]} castShadow receiveShadow>
                    <boxGeometry args={[rw, FLOOR_HEIGHT, 0.2]} />
                    <meshStandardMaterial color={room.wallColor} roughness={0.7} />
                  </mesh>

                  {/* West Wall of Room */}
                  <mesh position={[room.bounds.minX, FLOOR_HEIGHT / 2, rz]} castShadow receiveShadow>
                    <boxGeometry args={[0.2, FLOOR_HEIGHT, rd]} />
                    <meshStandardMaterial color={room.wallColor} roughness={0.7} />
                  </mesh>

                  {/* Room Signboard on wall */}
                  <mesh position={[rx, FLOOR_HEIGHT - 0.8, room.bounds.minZ + 0.15]}>
                    <boxGeometry args={[Math.min(rw * 0.7, 5), 0.5, 0.05]} />
                    <meshStandardMaterial color={EXPLORE_TOKENS.colors.medicalBlueDark} />
                  </mesh>
                  <Text
                    position={[rx, FLOOR_HEIGHT - 0.8, room.bounds.minZ + 0.19]}
                    fontSize={0.24}
                    color="#FFFFFF"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {room.name}
                  </Text>

                  {/* All 3D props inside room */}
                  <HospitalProps props={room.props} />
                </group>
              );
            })}

            {/* Exterior Facade Walls */}
            {/* North Solid Exterior Wall with punched windows */}
            <mesh position={[0, FLOOR_HEIGHT / 2, -16.4]} castShadow receiveShadow>
              <boxGeometry args={[44.8, FLOOR_HEIGHT, 0.4]} />
              <meshStandardMaterial color={EXPLORE_TOKENS.colors.wallWhite} roughness={0.65} />
            </mesh>
            {/* East Exterior Wall */}
            <mesh position={[22.4, FLOOR_HEIGHT / 2, -1]} castShadow receiveShadow>
              <boxGeometry args={[0.4, FLOOR_HEIGHT, 30.8]} />
              <meshStandardMaterial color={EXPLORE_TOKENS.colors.wallWhite} roughness={0.65} />
            </mesh>
            {/* West Exterior Wall */}
            <mesh position={[-22.4, FLOOR_HEIGHT / 2, -1]} castShadow receiveShadow>
              <boxGeometry args={[0.4, FLOOR_HEIGHT, 30.8]} />
              <meshStandardMaterial color={EXPLORE_TOKENS.colors.wallWhite} roughness={0.65} />
            </mesh>

            {/* South Glass Curtain Wall (Facing Camera): Translucent teal so interiors are clearly visible */}
            <mesh position={[0, FLOOR_HEIGHT / 2, 14.4]}>
              <boxGeometry args={[44.6, FLOOR_HEIGHT * 0.96, 0.15]} />
              <meshStandardMaterial
                color={EXPLORE_TOKENS.colors.glassTeal}
                transparent
                opacity={0.35}
                roughness={0.1}
                metalness={0.85}
              />
            </mesh>
            {/* Modern vertical architectural mullions along the front facade */}
            {[-18, -12, -6, 0, 6, 12, 18].map((mx) => (
              <mesh key={`mullion-${floorIndex}-${mx}`} position={[mx, FLOOR_HEIGHT / 2, 14.5]} castShadow>
                <boxGeometry args={[0.2, FLOOR_HEIGHT, 0.25]} />
                <meshStandardMaterial color={EXPLORE_TOKENS.colors.woodWarm} roughness={0.4} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* 3. Central Glass Elevator Shaft & Moving Car */}
      <group position={[0, 0, -1]}>
        {/* Glass shaft tower */}
        <mesh position={[0, (FLOOR_HEIGHT * 3) / 2, 0]}>
          <boxGeometry args={[3.8, FLOOR_HEIGHT * 3, 3.8]} />
          <meshStandardMaterial
            color={EXPLORE_TOKENS.colors.glassTeal}
            transparent
            opacity={0.3}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* Stainless steel corner guide rails */}
        {[-1.8, 1.8].map((x) =>
          [-1.8, 1.8].map((z) => (
            <mesh key={`rail-${x}-${z}`} position={[x, (FLOOR_HEIGHT * 3) / 2, z]}>
              <cylinderGeometry args={[0.06, 0.06, FLOOR_HEIGHT * 3]} />
              <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalSteel} metalness={0.95} />
            </mesh>
          ))
        )}
        {/* Moving Elevator Car */}
        <group ref={elevatorCarRef} position={[0, 0, 0]}>
          {/* Car floor */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[3.2, 0.15, 3.2]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Car glass cabin */}
          <mesh position={[0, 1.6, 0]}>
            <boxGeometry args={[3.1, 2.7, 3.1]} />
            <meshStandardMaterial
              color="#FFFFFF"
              transparent
              opacity={0.45}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
          {/* Car roof and warm interior light */}
          <mesh position={[0, 3.0, 0]}>
            <boxGeometry args={[3.2, 0.15, 3.2]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <pointLight position={[0, 2.5, 0]} color="#FEF3C7" intensity={1.2} distance={6} decay={2} />
        </group>
      </group>

      {/* 4. Rooftop (y = 12.6): Shown when full building exterior is active */}
      {selectedFloor === null && (
        <group position={[0, FLOOR_HEIGHT * 3, -1]}>
          {/* Roof Slab */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[45.2, 0.4, 31.2]} />
            <meshStandardMaterial map={concreteTex} color="#D0CBC2" roughness={0.9} />
          </mesh>

          {/* Roof Perimeter Safety Parapet Wall */}
          <mesh position={[0, 0.8, -15.4]} castShadow>
            <boxGeometry args={[45.2, 1.0, 0.4]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.wallWhite} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.8, 15.4]} castShadow>
            <boxGeometry args={[45.2, 1.0, 0.4]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.wallWhite} roughness={0.7} />
          </mesh>
          <mesh position={[22.4, 0.8, 0]} castShadow>
            <boxGeometry args={[0.4, 1.0, 31.2]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.wallWhite} roughness={0.7} />
          </mesh>
          <mesh position={[-22.4, 0.8, 0]} castShadow>
            <boxGeometry args={[0.4, 1.0, 31.2]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.wallWhite} roughness={0.7} />
          </mesh>

          {/* ROOFTOP HELIPAD (West side of roof: X: -10, Z: 0) */}
          <group position={[-10, 0.42, 0]}>
            {/* Octagonal / Circular Landing Pad Base */}
            <mesh receiveShadow>
              <cylinderGeometry args={[7.2, 7.5, 0.15, 32]} />
              <meshStandardMaterial color="#374151" roughness={0.8} />
            </mesh>
            {/* Yellow Outer Perimeter Circle */}
            <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[6.2, 6.7, 32]} />
              <meshStandardMaterial color="#FBBF24" roughness={0.4} />
            </mesh>
            {/* Large Yellow "H" Marking */}
            <group position={[0, 0.1, 0]}>
              <mesh position={[-1.6, 0, 0]}>
                <boxGeometry args={[0.7, 0.02, 5.2]} />
                <meshStandardMaterial color="#FBBF24" />
              </mesh>
              <mesh position={[1.6, 0, 0]}>
                <boxGeometry args={[0.7, 0.02, 5.2]} />
                <meshStandardMaterial color="#FBBF24" />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[3.2, 0.02, 0.7]} />
                <meshStandardMaterial color="#FBBF24" />
              </mesh>
            </group>
            {/* Helipad Green Perimeter Lights */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <mesh key={`heli-light-${i}`} position={[Math.cos(a) * 6.8, 0.18, Math.sin(a) * 6.8]}>
                  <cylinderGeometry args={[0.1, 0.1, 0.2]} />
                  <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={1.8} />
                </mesh>
              );
            })}
            {/* Windsock Mast & Sock */}
            <group position={[8, 0, 7]}>
              <mesh position={[0, 2.2, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 4.4]} />
                <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalSteel} metalness={0.8} />
              </mesh>
              <mesh position={[0.7, 4.2, 0]} rotation={[0, 0, -Math.PI / 8]}>
                <coneGeometry args={[0.35, 1.6, 12]} />
                <meshStandardMaterial color={EXPLORE_TOKENS.colors.alertOrange} roughness={0.6} />
              </mesh>
            </group>
          </group>

          {/* Rooftop HVAC Chillers & Solar Equipment (East side) */}
          <group position={[11, 0.42, 0]}>
            <mesh position={[0, 1.2, -6]} castShadow>
              <boxGeometry args={[6.5, 2.2, 4.2]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.7} />
            </mesh>
            <mesh position={[0, 1.2, 6]} castShadow>
              <boxGeometry args={[6.5, 2.2, 4.2]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.7} />
            </mesh>
          </group>
        </group>
      )}

      {/* Autonomous Continuous Hospital Staff & Patient Simulation */}
      <HospitalStaffSimulation />
    </group>
  );
}
