'use client';

import React from 'react';
import * as THREE from 'three';

export interface SedanCarMeshProps {
  color?: string;
  wheelRotation?: number;
  steerAngle?: number;
  headlightsOn?: boolean;
  brakeLightsOn?: boolean;
}

export function SedanCarMesh({
  color = '#F8FAFC', // Pearl White executive sedan default
  wheelRotation = 0,
  steerAngle = 0,
  headlightsOn = true,
  brakeLightsOn = false,
}: SedanCarMeshProps) {
  const chromeColor = '#E2E8F0';
  const trimColor = '#0F172A';
  const rimColor = '#CBD5E1';
  const tireColor = '#0F172A';

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Sedan Body Chassis (Length: 4.65m, Width: 1.94m, Height: 0.58m) */}
      <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.94, 0.52, 4.65]} />
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.65} />
      </mesh>

      {/* Front Sloping Hood Section */}
      <group position={[0, 0.58, 1.4]}>
        <mesh rotation={[-0.1, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.88, 0.28, 1.62]} />
          <meshStandardMaterial color={color} roughness={0.28} metalness={0.65} />
        </mesh>
        {/* Subtle Hood Sculpt Line */}
        <mesh position={[-0.4, 0.14, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.08, 0.02, 1.4]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
        </mesh>
        <mesh position={[0.4, 0.14, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.08, 0.02, 1.4]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.7} />
        </mesh>
      </group>

      {/* Front Executive Grille & Headlight Fascia */}
      <group position={[0, 0.46, 2.28]}>
        {/* Chrome Front Grille Surround */}
        <mesh castShadow>
          <boxGeometry args={[1.15, 0.36, 0.08]} />
          <meshStandardMaterial color={chromeColor} metalness={0.92} roughness={0.15} />
        </mesh>
        {/* Grille Dark Inset Mesh */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[1.06, 0.28, 0.03]} />
          <meshStandardMaterial color="#020617" roughness={0.8} />
        </mesh>
        {/* Chrome Grille Horizontal Bars */}
        {[-0.07, 0, 0.07].map((gy, i) => (
          <mesh key={`sed-slat-${i}`} position={[0, gy, 0.04]}>
            <boxGeometry args={[1.02, 0.02, 0.02]} />
            <meshStandardMaterial color={chromeColor} metalness={0.95} />
          </mesh>
        ))}

        {/* Lower Front Bumper Air Dam */}
        <mesh position={[0, -0.22, -0.04]} castShadow>
          <boxGeometry args={[1.92, 0.2, 0.18]} />
          <meshStandardMaterial color={trimColor} />
        </mesh>
        {/* Lower Chrome Bumper Strip */}
        <mesh position={[0, -0.28, 0.06]}>
          <boxGeometry args={[1.4, 0.03, 0.02]} />
          <meshStandardMaterial color={chromeColor} metalness={0.9} />
        </mesh>

        {/* Swept-Back LED Projector Headlights */}
        {/* Left Headlight */}
        <group position={[-0.75, 0.06, -0.02]} rotation={[0, 0.18, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.16, 0.14]} />
            <meshStandardMaterial
              color="#FEF9C3"
              emissive={headlightsOn ? '#FEF9C3' : '#334155'}
              emissiveIntensity={headlightsOn ? 1.7 : 0.1}
              roughness={0.1}
            />
          </mesh>
        </group>
        {/* Right Headlight */}
        <group position={[0.75, 0.06, -0.02]} rotation={[0, -0.18, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.16, 0.14]} />
            <meshStandardMaterial
              color="#FEF9C3"
              emissive={headlightsOn ? '#FEF9C3' : '#334155'}
              emissiveIntensity={headlightsOn ? 1.7 : 0.1}
              roughness={0.1}
            />
          </mesh>
        </group>
      </group>

      {/* 2. Sleek Passenger Cabin Greenhouse (Windows & Pillars) */}
      <group position={[0, 1.05, -0.12]}>
        {/* Roof Structure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.62, 0.62, 2.25]} />
          <meshStandardMaterial color={color} roughness={0.28} metalness={0.65} />
        </mesh>

        {/* Streamlined Front Windshield */}
        <mesh position={[0, 0.02, 1.12]} rotation={[-0.42, 0, 0]}>
          <boxGeometry args={[1.56, 0.64, 0.04]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.65}
            roughness={0.06}
            metalness={0.95}
          />
        </mesh>

        {/* Graceful Raked Rear Window (Fastback Sedan angle) */}
        <mesh position={[0, 0.02, -1.12]} rotation={[0.42, 0, 0]}>
          <boxGeometry args={[1.54, 0.64, 0.04]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.7}
            roughness={0.06}
            metalness={0.95}
          />
        </mesh>

        {/* Side Passenger Windows (Right & Left) */}
        {/* Right Side Glass Strip */}
        <mesh position={[0.82, 0.02, 0]}>
          <boxGeometry args={[0.02, 0.48, 2.15]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.7}
            roughness={0.06}
            metalness={0.95}
          />
        </mesh>
        {/* Left Side Glass Strip */}
        <mesh position={[-0.82, 0.02, 0]}>
          <boxGeometry args={[0.02, 0.48, 2.15]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.7}
            roughness={0.06}
            metalness={0.95}
          />
        </mesh>

        {/* Chrome Window Perimeter Trim */}
        <mesh position={[0.825, 0.24, 0]}>
          <boxGeometry args={[0.01, 0.03, 2.18]} />
          <meshStandardMaterial color={chromeColor} metalness={0.95} />
        </mesh>
        <mesh position={[-0.825, 0.24, 0]}>
          <boxGeometry args={[0.01, 0.03, 2.18]} />
          <meshStandardMaterial color={chromeColor} metalness={0.95} />
        </mesh>
        <mesh position={[0.825, -0.22, 0]}>
          <boxGeometry args={[0.01, 0.03, 2.18]} />
          <meshStandardMaterial color={chromeColor} metalness={0.95} />
        </mesh>
        <mesh position={[-0.825, -0.22, 0]}>
          <boxGeometry args={[0.01, 0.03, 2.18]} />
          <meshStandardMaterial color={chromeColor} metalness={0.95} />
        </mesh>

        {/* B-Pillar Center Divider */}
        <mesh position={[0.83, 0.02, 0]}>
          <boxGeometry args={[0.03, 0.48, 0.1]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[-0.83, 0.02, 0]}>
          <boxGeometry args={[0.03, 0.48, 0.1]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* Aerodynamic Body-Colored Side Mirrors */}
      <group position={[-0.94, 0.92, 0.75]} rotation={[0, -0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.12, 0.14]} />
          <meshStandardMaterial color={color} metalness={0.7} />
        </mesh>
        <mesh position={[-0.06, 0, 0]}>
          <boxGeometry args={[0.02, 0.03, 0.08]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.6} />
        </mesh>
      </group>
      <group position={[0.94, 0.92, 0.75]} rotation={[0, 0.12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.22, 0.12, 0.14]} />
          <meshStandardMaterial color={color} metalness={0.7} />
        </mesh>
        <mesh position={[0.06, 0, 0]}>
          <boxGeometry args={[0.02, 0.03, 0.08]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Chrome Flush Door Handles */}
      <mesh position={[-0.98, 0.68, 0.35]}>
        <boxGeometry args={[0.02, 0.04, 0.16]} />
        <meshStandardMaterial color={chromeColor} metalness={0.95} />
      </mesh>
      <mesh position={[-0.98, 0.68, -0.45]}>
        <boxGeometry args={[0.02, 0.04, 0.16]} />
        <meshStandardMaterial color={chromeColor} metalness={0.95} />
      </mesh>
      <mesh position={[0.98, 0.68, 0.35]}>
        <boxGeometry args={[0.02, 0.04, 0.16]} />
        <meshStandardMaterial color={chromeColor} metalness={0.95} />
      </mesh>
      <mesh position={[0.98, 0.68, -0.45]}>
        <boxGeometry args={[0.02, 0.04, 0.16]} />
        <meshStandardMaterial color={chromeColor} metalness={0.95} />
      </mesh>

      {/* 3. Executive Trunk Deck, Full-Width LED Lightbar & Rear Bumper */}
      <group position={[0, 0.58, -1.95]}>
        {/* Subtle Trunk Lip */}
        <mesh position={[0, 0.12, -0.32]} castShadow>
          <boxGeometry args={[1.86, 0.06, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.25} />
        </mesh>

        {/* Modern Full-Width LED Taillight Bar */}
        <mesh position={[0, 0.04, -0.36]}>
          <boxGeometry args={[1.82, 0.09, 0.06]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={brakeLightsOn ? 2.5 : 1.2}
          />
        </mesh>

        {/* Rear Bumper Body */}
        <mesh position={[0, -0.22, -0.32]} castShadow>
          <boxGeometry args={[1.94, 0.28, 0.2]} />
          <meshStandardMaterial color={color} roughness={0.3} />
        </mesh>
        {/* Lower Black Rear Valance */}
        <mesh position={[0, -0.32, -0.32]}>
          <boxGeometry args={[1.88, 0.12, 0.18]} />
          <meshStandardMaterial color={trimColor} />
        </mesh>

        {/* Dual Integrated Chrome Oval Exhaust Tips */}
        <group position={[-0.64, -0.32, -0.28]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
            <meshStandardMaterial color={chromeColor} metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
        <group position={[0.64, -0.32, -0.28]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
            <meshStandardMaterial color={chromeColor} metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* 4. Four Executive Alloy Wheels */}
      {/* Front Left Wheel */}
      <group position={[-0.96, 0.34, 1.4]} rotation={[0, steerAngle, 0]}>
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.24, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.25, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* Front Right Wheel */}
      <group position={[0.96, 0.34, 1.4]} rotation={[0, steerAngle, 0]}>
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.24, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.25, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* Rear Left Wheel */}
      <group position={[-0.96, 0.34, -1.4]}>
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.24, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.25, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* Rear Right Wheel */}
      <group position={[0.96, 0.34, -1.4]}>
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.24, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.25, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.92} roughness={0.15} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
