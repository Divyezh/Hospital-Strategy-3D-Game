'use client';

import React from 'react';
import * as THREE from 'three';

export interface SportsCarMeshProps {
  color?: string;
  wheelRotation?: number;
  steerAngle?: number;
  hasSpoiler?: boolean;
  headlightsOn?: boolean;
  brakeLightsOn?: boolean;
}

export function SportsCarMesh({
  color = '#DC2626', // Rosso Corsa Red default
  wheelRotation = 0,
  steerAngle = 0,
  hasSpoiler = true,
  headlightsOn = true,
  brakeLightsOn = false,
}: SportsCarMeshProps) {
  const carbonColor = '#18181B';
  const rimColor = '#CBD5E1';
  const tireColor = '#0F172A';

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Low-slung Aerodynamic Main Chassis Tub (Length: 4.5m, Width: 2.0m, Height: 0.55m) */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.96, 0.44, 4.4]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.7} />
      </mesh>

      {/* Tapered Front Hood & Aerodynamic Nose */}
      <group position={[0, 0.46, 1.45]}>
        {/* Sloping front hood wedge */}
        <mesh rotation={[-0.14, 0, 0]} castShadow>
          <boxGeometry args={[1.88, 0.32, 1.6]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.7} />
        </mesh>
        {/* Hood Twin Air Extraction Vents */}
        <mesh position={[-0.42, 0.17, 0.1]} rotation={[-0.14, 0, 0]}>
          <boxGeometry args={[0.28, 0.02, 0.55]} />
          <meshStandardMaterial color={carbonColor} roughness={0.5} />
        </mesh>
        <mesh position={[0.42, 0.17, 0.1]} rotation={[-0.14, 0, 0]}>
          <boxGeometry args={[0.28, 0.02, 0.55]} />
          <meshStandardMaterial color={carbonColor} roughness={0.5} />
        </mesh>
      </group>

      {/* Front Carbon Splitter & Air Dam */}
      <group position={[0, 0.22, 2.22]}>
        <mesh castShadow>
          <boxGeometry args={[1.98, 0.12, 0.35]} />
          <meshStandardMaterial color={carbonColor} roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Center Lower Air Grille */}
        <mesh position={[0, 0.1, -0.02]}>
          <boxGeometry args={[1.2, 0.22, 0.08]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        {/* Side brake cooling ducts */}
        <mesh position={[-0.78, 0.1, -0.02]}>
          <boxGeometry args={[0.34, 0.18, 0.08]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <mesh position={[0.78, 0.1, -0.02]}>
          <boxGeometry args={[0.34, 0.18, 0.08]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
      </group>

      {/* Sharp Angled LED Headlights */}
      <group position={[0, 0.52, 2.16]}>
        {/* Left Headlight Blade */}
        <group position={[-0.72, 0, 0]} rotation={[0, 0.2, -0.08]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.12, 0.15]} />
            <meshStandardMaterial
              color="#FEF9C3"
              emissive={headlightsOn ? '#FEF9C3' : '#334155'}
              emissiveIntensity={headlightsOn ? 1.8 : 0.1}
              roughness={0.1}
            />
          </mesh>
        </group>
        {/* Right Headlight Blade */}
        <group position={[0.72, 0, 0]} rotation={[0, -0.2, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[0.42, 0.12, 0.15]} />
            <meshStandardMaterial
              color="#FEF9C3"
              emissive={headlightsOn ? '#FEF9C3' : '#334155'}
              emissiveIntensity={headlightsOn ? 1.8 : 0.1}
              roughness={0.1}
            />
          </mesh>
        </group>
      </group>

      {/* 2. Glass Canopy & Cockpit Greenhouse */}
      <group position={[0, 0.95, -0.15]}>
        {/* Main curved roof pod */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.56, 0.58, 2.1]} />
          <meshStandardMaterial color={carbonColor} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Raked Windshield (Front) */}
        <mesh position={[0, 0.04, 0.98]} rotation={[-0.48, 0, 0]}>
          <boxGeometry args={[1.5, 0.62, 0.04]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.65}
            roughness={0.05}
            metalness={0.95}
          />
        </mesh>

        {/* Sloping Fastback Rear Glass Window */}
        <mesh position={[0, 0.02, -0.98]} rotation={[0.48, 0, 0]}>
          <boxGeometry args={[1.48, 0.62, 0.04]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.7}
            roughness={0.05}
            metalness={0.95}
          />
        </mesh>

        {/* Tinted Side Quarter Windows */}
        <mesh position={[0.79, 0.02, 0]}>
          <boxGeometry args={[0.02, 0.44, 1.85]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.7}
            roughness={0.05}
            metalness={0.95}
          />
        </mesh>
        <mesh position={[-0.79, 0.02, 0]}>
          <boxGeometry args={[0.02, 0.44, 1.85]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.7}
            roughness={0.05}
            metalness={0.95}
          />
        </mesh>
      </group>

      {/* Aerodynamic Side Mirrors */}
      <group position={[-0.92, 0.9, 0.65]} rotation={[0, -0.15, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.1, 0.12]} />
          <meshStandardMaterial color={carbonColor} metalness={0.8} />
        </mesh>
        <mesh position={[0.05, 0, -0.05]}>
          <boxGeometry args={[0.08, 0.04, 0.1]} />
          <meshStandardMaterial color={carbonColor} />
        </mesh>
      </group>
      <group position={[0.92, 0.9, 0.65]} rotation={[0, 0.15, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.1, 0.12]} />
          <meshStandardMaterial color={carbonColor} metalness={0.8} />
        </mesh>
        <mesh position={[-0.05, 0, -0.05]}>
          <boxGeometry args={[0.08, 0.04, 0.1]} />
          <meshStandardMaterial color={carbonColor} />
        </mesh>
      </group>

      {/* Sculpted Side Air Intake Scoops (Behind doors) */}
      <mesh position={[-0.96, 0.48, -0.6]} rotation={[0, 0.12, 0]}>
        <boxGeometry args={[0.1, 0.28, 0.6]} />
        <meshStandardMaterial color="#020617" roughness={0.8} />
      </mesh>
      <mesh position={[0.96, 0.48, -0.6]} rotation={[0, -0.12, 0]}>
        <boxGeometry args={[0.1, 0.28, 0.6]} />
        <meshStandardMaterial color="#020617" roughness={0.8} />
      </mesh>

      {/* 3. Rear Tail, Full-Width LED Lightbar & Diffuser */}
      <group position={[0, 0.52, -2.18]}>
        {/* Full-Width Horizontal Sleek LED Taillight Blade */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[1.82, 0.08, 0.08]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={brakeLightsOn ? 2.5 : 1.2}
            roughness={0.2}
          />
        </mesh>

        {/* Rear Aggressive Carbon Diffuser */}
        <mesh position={[0, -0.22, 0.02]} castShadow>
          <boxGeometry args={[1.92, 0.2, 0.3]} />
          <meshStandardMaterial color={carbonColor} roughness={0.5} metalness={0.8} />
        </mesh>
        {/* Diffuser vertical aerodynamic fins */}
        {[-0.6, -0.2, 0.2, 0.6].map((fx, i) => (
          <mesh key={`diff-fin-${i}`} position={[fx, -0.24, 0.06]}>
            <boxGeometry args={[0.04, 0.18, 0.28]} />
            <meshStandardMaterial color={carbonColor} />
          </mesh>
        ))}

        {/* Quad Polished Chrome Exhaust Tips */}
        {[-0.42, -0.28, 0.28, 0.42].map((ex, i) => (
          <group key={`exh-${i}`} position={[ex, -0.16, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, 0.14, 12]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4. Rear GT Carbon Wing / Spoiler */}
      {hasSpoiler && (
        <group position={[0, 1.05, -1.95]}>
          {/* Dual Aero Struts */}
          <mesh position={[-0.45, -0.14, 0]} castShadow>
            <boxGeometry args={[0.04, 0.28, 0.15]} />
            <meshStandardMaterial color={carbonColor} metalness={0.9} />
          </mesh>
          <mesh position={[0.45, -0.14, 0]} castShadow>
            <boxGeometry args={[0.04, 0.28, 0.15]} />
            <meshStandardMaterial color={carbonColor} metalness={0.9} />
          </mesh>
          {/* Main Airfoil Wing Blade */}
          <mesh position={[0, 0.02, 0]} rotation={[0.08, 0, 0]} castShadow>
            <boxGeometry args={[1.88, 0.05, 0.42]} />
            <meshStandardMaterial color={carbonColor} roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Endplates */}
          <mesh position={[-0.94, 0.04, 0]} castShadow>
            <boxGeometry args={[0.03, 0.18, 0.48]} />
            <meshStandardMaterial color={carbonColor} />
          </mesh>
          <mesh position={[0.94, 0.04, 0]} castShadow>
            <boxGeometry args={[0.03, 0.18, 0.48]} />
            <meshStandardMaterial color={carbonColor} />
          </mesh>
        </group>
      )}

      {/* 5. Four Sports Wheels with Multi-Spoke Rims & Red Brake Calipers */}
      {/* Front Left Wheel */}
      <group position={[-0.96, 0.32, 1.35]} rotation={[0, steerAngle, 0]}>
        <group rotation={[wheelRotation, 0, 0]}>
          {/* Low-profile Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.26, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.85} />
          </mesh>
          {/* Alloy Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.27, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.15} />
          </mesh>
        </group>
        {/* Red Brake Caliper */}
        <mesh position={[-0.04, 0.12, 0.08]}>
          <boxGeometry args={[0.08, 0.1, 0.14]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>

      {/* Front Right Wheel */}
      <group position={[0.96, 0.32, 1.35]} rotation={[0, steerAngle, 0]}>
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.26, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.27, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.15} />
          </mesh>
        </group>
        <mesh position={[0.04, 0.12, 0.08]}>
          <boxGeometry args={[0.08, 0.1, 0.14]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>

      {/* Rear Left Wheel */}
      <group position={[-0.98, 0.34, -1.35]}>
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.3, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.23, 0.23, 0.31, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.15} />
          </mesh>
        </group>
        <mesh position={[-0.04, 0.12, 0.08]}>
          <boxGeometry args={[0.08, 0.1, 0.14]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>

      {/* Rear Right Wheel */}
      <group position={[0.98, 0.34, -1.35]}>
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.3, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.23, 0.23, 0.31, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.15} />
          </mesh>
        </group>
        <mesh position={[0.04, 0.12, 0.08]}>
          <boxGeometry args={[0.08, 0.1, 0.14]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
