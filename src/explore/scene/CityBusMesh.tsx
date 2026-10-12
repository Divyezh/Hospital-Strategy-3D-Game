'use client';

import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface CityBusMeshProps {
  routeNumber?: string;
  destination?: string;
  wheelRotation?: number;
  doorsOpen?: boolean;
  colorTheme?: 'teal_white' | 'blue_white';
  hasPassengers?: boolean;
}

export function CityBusMesh({
  routeNumber = '101',
  destination = 'MEDICITY EXP',
  wheelRotation = 0,
  doorsOpen = false,
  colorTheme = 'teal_white',
  hasPassengers = false,
}: CityBusMeshProps) {
  const primaryColor = colorTheme === 'teal_white' ? '#0D9488' : '#2563EB'; // Teal or Blue
  const secondaryColor = '#FFFFFF';
  const doorSlideOffset = doorsOpen ? 0.35 : 0;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Bus Body Chassis (Length: 11.5m, Width: 2.8m, Height: 3.3m) */}
      {/* Lower chassis body */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.75, 1.1, 11.4]} />
        <meshStandardMaterial color={primaryColor} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Upper white roof & pillar body */}
      <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.74, 1.6, 11.35]} />
        <meshStandardMaterial color={secondaryColor} roughness={0.4} />
      </mesh>

      {/* Front Curved Aerodynamic Nose */}
      <group position={[0, 1.65, 5.75]}>
        {/* Front bumper */}
        <mesh position={[0, -0.9, 0]} castShadow>
          <boxGeometry args={[2.76, 0.5, 0.45]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} />
        </mesh>
        {/* Dual LED Headlight clusters */}
        <mesh position={[-1.0, -0.65, 0.2]}>
          <boxGeometry args={[0.42, 0.22, 0.08]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[1.0, -0.65, 0.2]}>
          <boxGeometry args={[0.42, 0.22, 0.08]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={1.2} />
        </mesh>
        {/* Fog lights */}
        <mesh position={[-1.0, -0.95, 0.22]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[1.0, -0.95, 0.22]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 2. Panoramic Windshield (Front) */}
      <mesh position={[0, 2.05, 5.74]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[2.62, 1.45, 0.08]} />
        <meshStandardMaterial color="#0F172A" transparent opacity={0.6} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Electronic LED Matrix Destination Display (Front Top) */}
      <group position={[0, 2.92, 5.72]}>
        <mesh>
          <boxGeometry args={[2.1, 0.42, 0.1]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <Text
          position={[0, 0.02, 0.06]}
          fontSize={0.24}
          color="#FDE047"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {`${routeNumber} ${destination}`}
        </Text>
      </group>

      {/* 3. Large Side Panoramic Windows (Left & Right) */}
      {/* Right passenger side glass strip */}
      <mesh position={[1.38, 2.05, 0]} castShadow>
        <boxGeometry args={[0.05, 1.25, 10.6]} />
        <meshStandardMaterial color="#0F172A" transparent opacity={0.65} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Left side glass strip */}
      <mesh position={[-1.38, 2.05, 0]} castShadow>
        <boxGeometry args={[0.05, 1.25, 10.6]} />
        <meshStandardMaterial color="#0F172A" transparent opacity={0.65} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Rear Window */}
      <mesh position={[0, 2.15, -5.72]} castShadow>
        <boxGeometry args={[2.4, 1.1, 0.06]} />
        <meshStandardMaterial color="#0F172A" transparent opacity={0.7} />
      </mesh>

      {/* 4. Passenger Entry & Exit Doors (Right side) */}
      {/* Front Entrance Door */}
      <group position={[1.39, 1.5, 4.2]}>
        <mesh position={[0, 0, -doorSlideOffset]} castShadow>
          <boxGeometry args={[0.06, 2.1, 0.9]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        {/* Door glass panes */}
        <mesh position={[0.02, 0.25, -doorSlideOffset]}>
          <boxGeometry args={[0.04, 1.2, 0.75]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.5} />
        </mesh>
      </group>
      {/* Center Exit Door */}
      <group position={[1.39, 1.5, -0.6]}>
        <mesh position={[0, 0, -doorSlideOffset]} castShadow>
          <boxGeometry args={[0.06, 2.1, 0.9]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        <mesh position={[0.02, 0.25, -doorSlideOffset]}>
          <boxGeometry args={[0.04, 1.2, 0.75]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* 5. Rooftop Equipment (AC Pods, Emergency Hatch, Gas Pods) */}
      <group position={[0, 3.25, 0]}>
        {/* Main Climate Control AC pod */}
        <mesh position={[0, 0.22, 1.2]} castShadow>
          <boxGeometry args={[1.8, 0.38, 3.4]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* AC Vents */}
        <mesh position={[0, 0.42, 1.2]}>
          <boxGeometry args={[1.5, 0.04, 2.8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Rear AC / Battery Pod */}
        <mesh position={[0, 0.2, -2.8]} castShadow>
          <boxGeometry args={[1.7, 0.34, 2.2]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.7} />
        </mesh>
      </group>

      {/* 6. Rear Tail Lights & Grille */}
      <group position={[0, 1.2, -5.74]}>
        {/* Bumper */}
        <mesh position={[0, -0.7, 0]} castShadow>
          <boxGeometry args={[2.76, 0.45, 0.25]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        {/* Red Brake Lights */}
        <mesh position={[-1.1, 0.2, 0]}>
          <boxGeometry args={[0.26, 0.45, 0.06]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.4} />
        </mesh>
        <mesh position={[1.1, 0.2, 0]}>
          <boxGeometry args={[0.26, 0.45, 0.06]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.4} />
        </mesh>
      </group>

      {/* 7. Driver in Cabin */}
      <group position={[-0.75, 1.5, 4.6]}>
        {/* Driver head */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <sphereGeometry args={[0.16, 10, 10]} />
          <meshStandardMaterial color="#E0AC69" />
        </mesh>
        {/* Driver cap */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 12]} />
          <meshStandardMaterial color="#1E3A8A" />
        </mesh>
        {/* Torso in navy driver uniform */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[0.42, 0.5, 0.24]} />
          <meshStandardMaterial color="#1E3A8A" />
        </mesh>
        {/* Steering Wheel */}
        <mesh position={[0, 0.2, 0.38]} rotation={[-0.7, 0, 0]}>
          <torusGeometry args={[0.22, 0.03, 8, 16]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* 7B. Seated Passengers visible through Panoramic Windows */}
      {hasPassengers && (
        <group position={[0, 1.5, 0]}>
          {/* Passenger 1 (Right Front Window) */}
          <group position={[0.85, 0.25, 2.2]}>
            <mesh position={[0, 0.32, 0]} castShadow>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshStandardMaterial color="#E0AC69" />
            </mesh>
            <mesh position={[0, 0.04, 0]} castShadow>
              <boxGeometry args={[0.36, 0.38, 0.22]} />
              <meshStandardMaterial color="#DC2626" />
            </mesh>
          </group>
          {/* Passenger 2 (Right Middle Window) */}
          <group position={[0.85, 0.25, 0.6]}>
            <mesh position={[0, 0.32, 0]} castShadow>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshStandardMaterial color="#E0AC69" />
            </mesh>
            <mesh position={[0, 0.04, 0]} castShadow>
              <boxGeometry args={[0.36, 0.38, 0.22]} />
              <meshStandardMaterial color="#2563EB" />
            </mesh>
          </group>
          {/* Passenger 3 (Left Front Window) */}
          <group position={[-0.85, 0.25, 1.8]}>
            <mesh position={[0, 0.32, 0]} castShadow>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshStandardMaterial color="#E0AC69" />
            </mesh>
            <mesh position={[0, 0.04, 0]} castShadow>
              <boxGeometry args={[0.36, 0.38, 0.22]} />
              <meshStandardMaterial color="#16A34A" />
            </mesh>
          </group>
          {/* Passenger 4 (Left Rear Window) */}
          <group position={[-0.85, 0.25, -2.0]}>
            <mesh position={[0, 0.32, 0]} castShadow>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshStandardMaterial color="#E0AC69" />
            </mesh>
            <mesh position={[0, 0.04, 0]} castShadow>
              <boxGeometry args={[0.36, 0.38, 0.22]} />
              <meshStandardMaterial color="#D97706" />
            </mesh>
          </group>
        </group>
      )}

      {/* 8. Bus Wheels (Front Axle & Rear Dual Axle) */}
      {/* Front Left Wheel */}
      <group position={[-1.32, 0.5, 3.8]} rotation={[wheelRotation, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.34, 20]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.35, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
        </mesh>
      </group>
      {/* Front Right Wheel */}
      <group position={[1.32, 0.5, 3.8]} rotation={[wheelRotation, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.34, 20]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.35, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
        </mesh>
      </group>

      {/* Rear Left Dual Wheels */}
      <group position={[-1.32, 0.5, -3.4]} rotation={[wheelRotation, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.38, 20]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.39, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
        </mesh>
      </group>
      {/* Rear Right Dual Wheels */}
      <group position={[1.32, 0.5, -3.4]} rotation={[wheelRotation, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.38, 20]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.39, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
