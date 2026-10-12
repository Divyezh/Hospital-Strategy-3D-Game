'use client';

import React from 'react';
import * as THREE from 'three';

interface AutoRickshawMeshProps {
  colorScheme?: 'green_yellow' | 'black_yellow';
  wheelRotation?: number;
  steerAngle?: number;
  hasDriver?: boolean;
  hasPassenger?: boolean;
  passengerShirtColor?: string;
}

export function AutoRickshawMesh({
  colorScheme = 'green_yellow',
  wheelRotation = 0,
  steerAngle = 0,
  hasDriver = true,
  hasPassenger = false,
  passengerShirtColor = '#2563EB',
}: AutoRickshawMeshProps) {
  const lowerBodyColor = colorScheme === 'green_yellow' ? '#15803D' : '#1E293B';
  const canopyColor = '#FBBF24'; // Iconic auto-rickshaw yellow
  const roofCanvasColor = '#18181B'; // Black canvas top

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Chassis Frame Base */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[1.35, 0.12, 2.5]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} />
      </mesh>

      {/* 2. Lower Metal Body Tub (Green or Black) */}
      <group position={[0, 0.58, 0]}>
        {/* Main cabin lower tub */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.36, 0.44, 1.6]} />
          <meshStandardMaterial color={lowerBodyColor} roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Rear engine cover / bumper */}
        <mesh position={[0, -0.06, -0.88]} castShadow>
          <boxGeometry args={[1.34, 0.36, 0.22]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>
        {/* Rear tail lights */}
        <mesh position={[-0.52, -0.02, -0.99]}>
          <boxGeometry args={[0.18, 0.08, 0.02]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.52, -0.02, -0.99]}>
          <boxGeometry args={[0.18, 0.08, 0.02]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
        </mesh>
        {/* Rear Number Plate */}
        <mesh position={[0, -0.1, -1.0]}>
          <boxGeometry args={[0.38, 0.12, 0.02]} />
          <meshStandardMaterial color="#FEF08A" />
        </mesh>
      </group>

      {/* 3. Front Nose & Cowl (Tapered 3-wheeler front) */}
      <group position={[0, 0.58, 0.95]}>
        {/* Tapered nose wedge */}
        <mesh castShadow>
          <boxGeometry args={[0.88, 0.44, 0.7]} />
          <meshStandardMaterial color={lowerBodyColor} roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Front Yellow Apron Shield */}
        <mesh position={[0, 0.32, 0.12]} rotation={[-0.32, 0, 0]} castShadow>
          <boxGeometry args={[0.86, 0.5, 0.04]} />
          <meshStandardMaterial color={canopyColor} roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Chrome Round Center Headlight */}
        <group position={[0, 0.12, 0.36]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#FEF9C3" emissive="#FEF9C3" emissiveIntensity={1.2} />
          </mesh>
        </group>
        {/* Dual Amber Turn Indicators */}
        <mesh position={[-0.35, 0.18, 0.28]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0.35, 0.18, 0.28]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* 4. Windshield & Front Pillars */}
      <group position={[0, 1.15, 0.78]} rotation={[-0.24, 0, 0]}>
        {/* Glass windshield */}
        <mesh castShadow>
          <boxGeometry args={[0.98, 0.52, 0.03]} />
          <meshStandardMaterial color="#E0F2FE" transparent opacity={0.5} roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Windshield wiper */}
        <mesh position={[-0.1, 0, 0.02]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.02, 0.32, 0.015]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        {/* Yellow windshield border frame */}
        <mesh position={[-0.51, 0, 0]}>
          <boxGeometry args={[0.04, 0.54, 0.04]} />
          <meshStandardMaterial color={canopyColor} />
        </mesh>
        <mesh position={[0.51, 0, 0]}>
          <boxGeometry args={[0.04, 0.54, 0.04]} />
          <meshStandardMaterial color={canopyColor} />
        </mesh>
      </group>

      {/* 5. Iconic Yellow & Black Curved Canopy Roof */}
      <group position={[0, 1.48, -0.05]}>
        {/* Yellow upper header band */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.36, 0.12, 2.1]} />
          <meshStandardMaterial color={canopyColor} roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Black canvas roof curved top */}
        <mesh position={[0, 0.14, -0.05]} castShadow>
          <boxGeometry args={[1.32, 0.16, 2.05]} />
          <meshStandardMaterial color={roofCanvasColor} roughness={0.8} />
        </mesh>
        {/* Roof rear curve downward */}
        <mesh position={[0, -0.1, -1.02]} rotation={[0.4, 0, 0]} castShadow>
          <boxGeometry args={[1.32, 0.35, 0.05]} />
          <meshStandardMaterial color={roofCanvasColor} roughness={0.8} />
        </mesh>
        {/* Rear small observation window */}
        <mesh position={[0, -0.1, -1.05]}>
          <boxGeometry args={[0.55, 0.22, 0.02]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* 6. Canopy Pillars & Open Side Entry */}
      {/* Rear corner pillars */}
      <mesh position={[-0.64, 1.15, -0.98]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.72, 8]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} />
      </mesh>
      <mesh position={[0.64, 1.15, -0.98]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.72, 8]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} />
      </mesh>
      {/* Side grab handles / safety bars */}
      <mesh position={[-0.65, 0.85, 0.1]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
      </mesh>
      <mesh position={[0.65, 0.85, 0.1]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.35, 6]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
      </mesh>

      {/* 7. Interior: Driver Handlebars, Fare Meter & Passenger Bench */}
      {/* Rear passenger padded bench seat */}
      <mesh position={[0, 0.62, -0.55]} castShadow>
        <boxGeometry args={[1.2, 0.22, 0.52]} />
        <meshStandardMaterial color="#78350F" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.88, -0.78]} castShadow>
        <boxGeometry args={[1.2, 0.36, 0.1]} />
        <meshStandardMaterial color="#78350F" roughness={0.6} />
      </mesh>
      {/* Driver bucket seat */}
      <mesh position={[0, 0.65, 0.28]} castShadow>
        <boxGeometry args={[0.5, 0.22, 0.42]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} />
      </mesh>
      {/* Steering handlebar column */}
      <mesh position={[0, 0.85, 0.65]} rotation={[-0.3, 0, steerAngle]}>
        <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} />
      </mesh>
      {/* Handlebar cross grip */}
      <mesh position={[0, 1.02, 0.6]} rotation={[0, steerAngle, 0]}>
        <boxGeometry args={[0.52, 0.04, 0.04]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      {/* Fare meter on dash */}
      <group position={[0.22, 0.88, 0.65]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.09, 0.07]} />
          <meshStandardMaterial color="#B91C1C" />
        </mesh>
        <mesh position={[0, 0.01, 0.038]}>
          <boxGeometry args={[0.08, 0.04, 0.01]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 8. Driver Character (Khaki uniform) */}
      {hasDriver && (
        <group position={[0, 0.56, 0.28]}>
          {/* Driver head */}
          <mesh position={[0, 0.72, 0]} castShadow>
            <sphereGeometry args={[0.13, 10, 10]} />
            <meshStandardMaterial color="#E0AC69" />
          </mesh>
          {/* Driver khaki cap */}
          <mesh position={[0, 0.79, 0.02]}>
            <cylinderGeometry args={[0.14, 0.14, 0.08, 10]} />
            <meshStandardMaterial color="#B45309" />
          </mesh>
          {/* Driver torso in khaki shirt */}
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[0.36, 0.42, 0.2]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
          {/* Arms reaching handlebars */}
          <mesh position={[-0.18, 0.48, 0.14]} rotation={[0.6, 0, 0]}>
            <boxGeometry args={[0.08, 0.32, 0.08]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
          <mesh position={[0.18, 0.48, 0.14]} rotation={[0.6, 0, 0]}>
            <boxGeometry args={[0.08, 0.32, 0.08]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
        </group>
      )}

      {/* 9. Passenger Character */}
      {hasPassenger && (
        <group position={[0.2, 0.58, -0.52]}>
          <mesh position={[0, 0.72, 0]} castShadow>
            <sphereGeometry args={[0.13, 10, 10]} />
            <meshStandardMaterial color="#E0AC69" />
          </mesh>
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[0.34, 0.42, 0.2]} />
            <meshStandardMaterial color={passengerShirtColor} />
          </mesh>
        </group>
      )}

      {/* 10. Wheels & Suspension (Three Wheeler) */}
      {/* Single Front Wheel */}
      <group position={[0, 0.22, 1.05]} rotation={[0, steerAngle, 0]}>
        {/* Front fork */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.16, 0.25, 0.06]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Front Wheel */}
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.1, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
          {/* Wheel rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.105, 12]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Rear Left Wheel */}
      <group position={[-0.64, 0.22, -0.55]} rotation={[wheelRotation, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.125, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
        </mesh>
      </group>

      {/* Rear Right Wheel */}
      <group position={[0.64, 0.22, -0.55]} rotation={[wheelRotation, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 16]} />
          <meshStandardMaterial color="#0F172A" roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.125, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
