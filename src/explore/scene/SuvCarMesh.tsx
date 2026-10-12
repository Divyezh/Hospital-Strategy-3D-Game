'use client';

import React from 'react';
import * as THREE from 'three';

export interface SuvCarMeshProps {
  color?: string;
  wheelRotation?: number;
  steerAngle?: number;
  hasRoofRails?: boolean;
  headlightsOn?: boolean;
  brakeLightsOn?: boolean;
}

export function SuvCarMesh({
  color = '#1E3A8A', // Deep Luxury Navy default
  wheelRotation = 0,
  steerAngle = 0,
  hasRoofRails = true,
  headlightsOn = true,
  brakeLightsOn = false,
}: SuvCarMeshProps) {
  const trimColor = '#0F172A'; // Black cladding
  const chromeColor = '#CBD5E1';
  const rimColor = '#E2E8F0';
  const tireColor = '#0F172A';

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Lower Body Cladding & Rocker Panels */}
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.08, 0.3, 4.85]} />
        <meshStandardMaterial color={trimColor} roughness={0.7} />
      </mesh>

      {/* 2. Main Sculpted SUV Body (Length: 4.8m, Width: 2.05m, Height: 0.75m) */}
      <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.06, 0.62, 4.8]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Muscular Front Hood & Fender Flares */}
      <group position={[0, 0.95, 1.55]}>
        <mesh rotation={[-0.08, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.32, 1.65]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Hood Character Power Bulges */}
        <mesh position={[-0.45, 0.16, 0]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.22, 0.04, 1.4]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.6} />
        </mesh>
        <mesh position={[0.45, 0.16, 0]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.22, 0.04, 1.4]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.6} />
        </mesh>
      </group>

      {/* Front Bold Grille & Bumper Assembly */}
      <group position={[0, 0.68, 2.42]}>
        {/* Chrome Front Grille Surround */}
        <mesh castShadow>
          <boxGeometry args={[1.35, 0.46, 0.08]} />
          <meshStandardMaterial color={chromeColor} metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Grille Honeycomb Inset */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[1.22, 0.38, 0.04]} />
          <meshStandardMaterial color="#020617" roughness={0.8} />
        </mesh>
        {/* Horizontal Chrome Slats */}
        {[-0.1, 0, 0.1].map((gy, i) => (
          <mesh key={`grille-slat-${i}`} position={[0, gy, 0.04]}>
            <boxGeometry args={[1.18, 0.03, 0.03]} />
            <meshStandardMaterial color={chromeColor} metalness={0.9} />
          </mesh>
        ))}

        {/* Lower Front Bumper & Rugged Skid Plate */}
        <mesh position={[0, -0.32, -0.05]} castShadow>
          <boxGeometry args={[2.05, 0.3, 0.2]} />
          <meshStandardMaterial color={trimColor} />
        </mesh>
        {/* Silver Off-road Skid Plate */}
        <mesh position={[0, -0.35, 0.06]}>
          <boxGeometry args={[0.95, 0.16, 0.06]} />
          <meshStandardMaterial color={chromeColor} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Dual LED Projector Headlights with Eyebrow DRL */}
        {/* Left Headlight */}
        <group position={[-0.82, 0.12, -0.02]} rotation={[0, 0.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.44, 0.22, 0.12]} />
            <meshStandardMaterial
              color="#FEF9C3"
              emissive={headlightsOn ? '#FEF9C3' : '#334155'}
              emissiveIntensity={headlightsOn ? 1.6 : 0.1}
              roughness={0.1}
            />
          </mesh>
        </group>
        {/* Right Headlight */}
        <group position={[0.82, 0.12, -0.02]} rotation={[0, -0.1, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.44, 0.22, 0.12]} />
            <meshStandardMaterial
              color="#FEF9C3"
              emissive={headlightsOn ? '#FEF9C3' : '#334155'}
              emissiveIntensity={headlightsOn ? 1.6 : 0.1}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* Lower Round Fog Lamps */}
        <mesh position={[-0.78, -0.22, 0.04]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={1.0} />
        </mesh>
        <mesh position={[0.78, -0.22, 0.04]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={1.0} />
        </mesh>
      </group>

      {/* 3. Spacious SUV Glass Greenhouse (Windows & Roof) */}
      <group position={[0, 1.42, -0.32]}>
        {/* Roof Structure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.72, 0.65, 2.75]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Large Upright Windshield */}
        <mesh position={[0, 0.04, 1.34]} rotation={[-0.34, 0, 0]}>
          <boxGeometry args={[1.68, 0.68, 0.04]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.65}
            roughness={0.08}
            metalness={0.9}
          />
        </mesh>

        {/* Upright Tailgate Rear Glass Window */}
        <mesh position={[0, 0.06, -1.34]} rotation={[0.22, 0, 0]}>
          <boxGeometry args={[1.66, 0.64, 0.04]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.7}
            roughness={0.08}
            metalness={0.9}
          />
        </mesh>

        {/* Side Panoramic Window Strips (Front, Middle, Rear Quarter) */}
        {/* Right Side Glass Strip */}
        <mesh position={[0.87, 0.04, 0]}>
          <boxGeometry args={[0.02, 0.54, 2.62]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.7}
            roughness={0.08}
            metalness={0.9}
          />
        </mesh>
        {/* Left Side Glass Strip */}
        <mesh position={[-0.87, 0.04, 0]}>
          <boxGeometry args={[0.02, 0.54, 2.62]} />
          <meshStandardMaterial
            color="#0F172A"
            transparent
            opacity={0.7}
            roughness={0.08}
            metalness={0.9}
          />
        </mesh>

        {/* Black B & C Pillars dividing side windows */}
        <mesh position={[0.88, 0.04, 0.35]}>
          <boxGeometry args={[0.03, 0.56, 0.08]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[-0.88, 0.04, 0.35]}>
          <boxGeometry args={[0.03, 0.56, 0.08]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0.88, 0.04, -0.45]}>
          <boxGeometry args={[0.03, 0.56, 0.08]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[-0.88, 0.04, -0.45]}>
          <boxGeometry args={[0.03, 0.56, 0.08]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>

      {/* 4. Roof Rails & Panoramic Sunroof */}
      {hasRoofRails && (
        <group position={[0, 1.78, -0.32]}>
          {/* Panoramic Dark Sunroof Glass on Top */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 0.02, 1.9]} />
            <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.95} />
          </mesh>
          {/* Left Roof Rail */}
          <group position={[-0.78, 0.06, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.05, 0.08, 2.4]} />
              <meshStandardMaterial color={chromeColor} metalness={0.8} />
            </mesh>
            {[-1.0, 0, 1.0].map((rz, i) => (
              <mesh key={`l-rail-post-${i}`} position={[0, -0.04, rz]}>
                <boxGeometry args={[0.06, 0.08, 0.06]} />
                <meshStandardMaterial color={trimColor} />
              </mesh>
            ))}
          </group>
          {/* Right Roof Rail */}
          <group position={[0.78, 0.06, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.05, 0.08, 2.4]} />
              <meshStandardMaterial color={chromeColor} metalness={0.8} />
            </mesh>
            {[-1.0, 0, 1.0].map((rz, i) => (
              <mesh key={`r-rail-post-${i}`} position={[0, -0.04, rz]}>
                <boxGeometry args={[0.06, 0.08, 0.06]} />
                <meshStandardMaterial color={trimColor} />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* Side Mirrors */}
      <group position={[-1.02, 1.15, 0.9]} rotation={[0, -0.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.24, 0.14, 0.14]} />
          <meshStandardMaterial color={color} metalness={0.6} />
        </mesh>
        <mesh position={[-0.08, 0, -0.02]}>
          <boxGeometry args={[0.02, 0.04, 0.08]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.8} />
        </mesh>
      </group>
      <group position={[1.02, 1.15, 0.9]} rotation={[0, 0.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.24, 0.14, 0.14]} />
          <meshStandardMaterial color={color} metalness={0.6} />
        </mesh>
        <mesh position={[0.08, 0, -0.02]}>
          <boxGeometry args={[0.02, 0.04, 0.08]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 5. Rear Tailgate, LED Taillights & Dual Exhaust */}
      <group position={[0, 0.82, -2.4]}>
        {/* Tailgate Spoiler Winglet */}
        <mesh position={[0, 0.92, -0.05]} castShadow>
          <boxGeometry args={[1.74, 0.1, 0.32]} />
          <meshStandardMaterial color={color} roughness={0.3} />
        </mesh>
        {/* High-mount third brake light */}
        <mesh position={[0, 0.91, 0.09]}>
          <boxGeometry args={[0.42, 0.03, 0.02]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={1.5} />
        </mesh>

        {/* Wraparound Modern LED Taillight Clusters */}
        <mesh position={[-0.78, 0.12, 0.02]}>
          <boxGeometry args={[0.44, 0.18, 0.08]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={brakeLightsOn ? 2.5 : 1.3}
          />
        </mesh>
        <mesh position={[0.78, 0.12, 0.02]}>
          <boxGeometry args={[0.44, 0.18, 0.08]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={brakeLightsOn ? 2.5 : 1.3}
          />
        </mesh>
        {/* Red Reflector Bridge Bar across tailgate */}
        <mesh position={[0, 0.12, 0.03]}>
          <boxGeometry args={[1.1, 0.04, 0.02]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
        </mesh>

        {/* Rear Bumper & Cladding */}
        <mesh position={[0, -0.35, -0.02]} castShadow>
          <boxGeometry args={[2.06, 0.34, 0.18]} />
          <meshStandardMaterial color={trimColor} />
        </mesh>
        {/* Silver Rear Skid Plate */}
        <mesh position={[0, -0.38, 0.06]}>
          <boxGeometry args={[0.95, 0.18, 0.06]} />
          <meshStandardMaterial color={chromeColor} metalness={0.7} />
        </mesh>

        {/* Dual Rectangular Chrome Exhaust Outlets */}
        <group position={[-0.68, -0.38, 0.08]}>
          <mesh>
            <boxGeometry args={[0.18, 0.1, 0.12]} />
            <meshStandardMaterial color={chromeColor} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.14, 0.06, 0.02]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
        </group>
        <group position={[0.68, -0.38, 0.08]}>
          <mesh>
            <boxGeometry args={[0.18, 0.1, 0.12]} />
            <meshStandardMaterial color={chromeColor} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[0.14, 0.06, 0.02]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
        </group>
      </group>

      {/* 6. Four Rugged SUV Wheels with All-Terrain Tires & Alloy Rims */}
      {/* Front Left */}
      <group position={[-1.02, 0.42, 1.45]} rotation={[0, steerAngle, 0]}>
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.28, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.29, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.88} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Front Right */}
      <group position={[1.02, 0.42, 1.45]} rotation={[0, steerAngle, 0]}>
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.28, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.29, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.88} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Rear Left */}
      <group position={[-1.02, 0.42, -1.45]}>
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.28, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.29, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.88} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Rear Right */}
      <group position={[1.02, 0.42, -1.45]}>
        <group rotation={[wheelRotation, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.28, 20]} />
            <meshStandardMaterial color={tireColor} roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.29, 16]} />
            <meshStandardMaterial color={rimColor} metalness={0.88} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
