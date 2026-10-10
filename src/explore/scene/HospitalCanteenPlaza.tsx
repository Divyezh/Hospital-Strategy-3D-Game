'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { EXPLORE_TOKENS } from '@/explore/tokens';
import { getAsphaltTexture, getPavingTexture, getConcreteTexture } from '@/explore/textures';
import { HumanoidMesh } from './HumanoidMesh';

// Waypoint path for pedestrian loop
interface Waypoint {
  x: number;
  z: number;
}

interface WalkingVisitor {
  id: string;
  waypoints: Waypoint[];
  speed: number;
  shirtColor: string;
  pantsColor: string;
  holdingItem?: 'none' | 'coffee_cup' | 'food_tray';
}

const WALKING_VISITORS_DATA: WalkingVisitor[] = [
  // 1. Visitor walking from Hospital Lobby to MediCafé
  {
    id: 'cant_walk_1',
    waypoints: [
      { x: 18, z: 14 },
      { x: 26, z: 10 },
      { x: 34, z: 4 },
      { x: 44, z: -2 },
      { x: 44, z: -2 }, // Pause at kiosk
      { x: 38, z: 6 },
      { x: 26, z: 10 },
      { x: 18, z: 14 },
    ],
    speed: 1.8,
    shirtColor: '#DC2626', // Crimson red
    pantsColor: '#1E293B',
    holdingItem: 'none',
  },
  // 2. Doctor walking from Hospital East Door to Canteen for lunch
  {
    id: 'cant_walk_2',
    waypoints: [
      { x: 22, z: 2 },
      { x: 28, z: 2 },
      { x: 35, z: -4 },
      { x: 41, z: 1 }, // Table B
      { x: 41, z: 1 },
      { x: 28, z: 2 },
      { x: 22, z: 2 },
    ],
    speed: 1.6,
    shirtColor: '#FFFFFF', // Doctor coat
    pantsColor: '#334155',
    holdingItem: 'coffee_cup',
  },
  // 3. Ordinary visitor in mustard sweater walking with a food tray
  {
    id: 'cant_walk_3',
    waypoints: [
      { x: 28, z: -3 },
      { x: 32, z: 5 },
      { x: 32, z: 8 }, // Table C
      { x: 32, z: 8 },
      { x: 38, z: 12 },
      { x: 44, z: 14 },
      { x: 36, z: 2 },
      { x: 28, z: -3 },
    ],
    speed: 1.5,
    shirtColor: '#D97706', // Mustard
    pantsColor: '#1F2937',
    holdingItem: 'food_tray',
  },
  // 4. Nurse in scrubs coming out to get afternoon juice
  {
    id: 'cant_walk_4',
    waypoints: [
      { x: 20, z: 12 },
      { x: 26, z: 6 },
      { x: 35, z: -4 }, // Juice Bar
      { x: 35, z: -4 },
      { x: 30, z: 4 },
      { x: 20, z: 12 },
    ],
    speed: 2.0,
    shirtColor: '#0D9488', // Teal scrubs
    pantsColor: '#0D9488',
    holdingItem: 'coffee_cup',
  },
  // 5. Visitor with friend walking through plaza towards garden terrace
  {
    id: 'cant_walk_5',
    waypoints: [
      { x: 19, z: 14 },
      { x: 27, z: 8 },
      { x: 38, z: -6 },
      { x: 48, z: -12 }, // Garden terrace
      { x: 48, z: -12 },
      { x: 38, z: -6 },
      { x: 27, z: 8 },
      { x: 19, z: 14 },
    ],
    speed: 1.7,
    shirtColor: '#4F46E5', // Indigo
    pantsColor: '#374151',
    holdingItem: 'none',
  },
  // 6. Ordinary citizen in casual sage jacket enjoying a snack
  {
    id: 'cant_walk_6',
    waypoints: [
      { x: 46, z: -3 },
      { x: 42, z: 6 },
      { x: 48, z: 12 },
      { x: 48, z: 12 },
      { x: 42, z: 6 },
      { x: 46, z: -3 },
    ],
    speed: 1.4,
    shirtColor: '#15803D', // Forest green
    pantsColor: '#1E293B',
    holdingItem: 'food_tray',
  },
];

export function HospitalCanteenPlaza() {
  const asphaltTex = useMemo(() => getAsphaltTexture(), []);
  const pavingTex = useMemo(() => getPavingTexture(), []);
  const concreteTex = useMemo(() => getConcreteTexture(), []);

  // Animated elements references
  const worker1ArmRef = useRef<number>(0);
  const worker2BlenderRef = useRef<THREE.Group>(null);
  const worker3TongsRef = useRef<number>(0);

  // Pedestrian positions and refs
  const visitorGroups = useRef<(THREE.Group | null)[]>([]);
  const visitorDistances = useRef<number[]>(WALKING_VISITORS_DATA.map((_, i) => i * 14));
  const visitorPhases = useRef<number[]>(WALKING_VISITORS_DATA.map(() => 0));

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // 1. Worker 2: Blender micro-shake animation
    if (worker2BlenderRef.current) {
      worker2BlenderRef.current.position.y = 1.05 + Math.sin(time * 35) * 0.008;
      worker2BlenderRef.current.rotation.z = Math.sin(time * 30) * 0.02;
    }

    // 2. Pedestrians along waypoints
    WALKING_VISITORS_DATA.forEach((data, idx) => {
      const grp = visitorGroups.current[idx];
      if (!grp) return;

      // Compute total path length
      let totalLen = 0;
      const segLens: number[] = [];
      for (let i = 0; i < data.waypoints.length; i++) {
        const next = data.waypoints[(i + 1) % data.waypoints.length];
        const curr = data.waypoints[i];
        const dx = next.x - curr.x;
        const dz = next.z - curr.z;
        const len = Math.sqrt(dx * dx + dz * dz);
        segLens.push(len);
        totalLen += len;
      }

      if (totalLen === 0) return;

      // Update distance traversed
      visitorDistances.current[idx] = (visitorDistances.current[idx] + delta * data.speed) % totalLen;
      const currentDist = visitorDistances.current[idx];

      // Find current segment
      let accum = 0;
      let segIdx = 0;
      let segProgress = 0;
      for (let i = 0; i < segLens.length; i++) {
        if (accum + segLens[i] >= currentDist) {
          segIdx = i;
          segProgress = (currentDist - accum) / (segLens[i] || 1);
          break;
        }
        accum += segLens[i];
      }

      const pCurr = data.waypoints[segIdx];
      const pNext = data.waypoints[(segIdx + 1) % data.waypoints.length];

      // Interpolate position
      const curX = pCurr.x + (pNext.x - pCurr.x) * segProgress;
      const curZ = pCurr.z + (pNext.z - pCurr.z) * segProgress;

      grp.position.set(curX, 0.15, curZ);

      // Interpolate facing angle
      const dx = pNext.x - pCurr.x;
      const dz = pNext.z - pCurr.z;
      if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
        const yaw = Math.atan2(dx, dz);
        grp.rotation.y = yaw;
      }

      visitorPhases.current[idx] = time * 7.5 * (data.speed / 1.6);
    });
  });

  return (
    <group position={[0, 0, 0]}>
      {/* =========================================================================
          1. PLAZA FLOORING & HARDSCAPING (BOTH BLACK AREA & EMPTY AREA)
         ========================================================================= */}
      {/* 1A. Core Black/Charcoal Asphalt & Slate Foundation (X: 22 to 54, Z: -12 to 12) */}
      <mesh position={[38, 0.125, 0]} receiveShadow>
        <boxGeometry args={[32.4, 0.05, 24.4]} />
        <meshStandardMaterial
          map={asphaltTex}
          color="#22252A" // Deep refined charcoal asphalt
          roughness={0.78}
        />
      </mesh>

      {/* Decorative Granite Border Curbing */}
      <mesh position={[38, 0.16, -12.2]}>
        <boxGeometry args={[32.6, 0.07, 0.35]} />
        <meshStandardMaterial map={concreteTex} color="#CBD5E1" roughness={0.6} />
      </mesh>
      <mesh position={[38, 0.16, 12.2]}>
        <boxGeometry args={[32.6, 0.07, 0.35]} />
        <meshStandardMaterial map={concreteTex} color="#CBD5E1" roughness={0.6} />
      </mesh>
      <mesh position={[54.2, 0.16, 0]}>
        <boxGeometry args={[0.35, 0.07, 24.6]} />
        <meshStandardMaterial map={concreteTex} color="#CBD5E1" roughness={0.6} />
      </mesh>

      {/* 1B. Raised Honey-Oak Timber Dining Promenade Deck (X: 28 to 48, Z: -3 to 11) */}
      <group position={[38, 0.16, 4]}>
        {/* Main timber deck slab */}
        <mesh receiveShadow>
          <boxGeometry args={[20.5, 0.07, 14.5]} />
          <meshStandardMaterial color="#B4824C" roughness={0.65} />
        </mesh>
        {/* Deck edge bronze trim */}
        <mesh position={[0, 0.04, -7.28]}>
          <boxGeometry args={[20.6, 0.04, 0.1]} />
          <meshStandardMaterial color="#3F2716" />
        </mesh>
        <mesh position={[0, 0.04, 7.28]}>
          <boxGeometry args={[20.6, 0.04, 0.1]} />
          <meshStandardMaterial color="#3F2716" />
        </mesh>
      </group>

      {/* 1C. Extension into Empty Ground (North Garden Terrace: X: 24 to 53, Z: -12 to -22) */}
      <group position={[38, 0.13, -17]}>
        {/* Light paved stone terrace */}
        <mesh receiveShadow>
          <boxGeometry args={[29, 0.04, 9.8]} />
          <meshStandardMaterial map={pavingTex} color={EXPLORE_TOKENS.colors.pavingLight} roughness={0.7} />
        </mesh>
        {/* Manicured Grass Lawn Strips */}
        <mesh position={[-11, 0.03, 0]} receiveShadow>
          <boxGeometry args={[5.5, 0.05, 8.5]} />
          <meshStandardMaterial color="#4A7C59" roughness={0.9} />
        </mesh>
        <mesh position={[11, 0.03, 0]} receiveShadow>
          <boxGeometry args={[5.5, 0.05, 8.5]} />
          <meshStandardMaterial color="#4A7C59" roughness={0.9} />
        </mesh>
        {/* Colorful Flower Beds in grass strips */}
        {[-12, -10, 10, 12].map((x, i) => (
          <group key={`flower-bed-${i}`} position={[x, 0.07, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.9, 1.0, 0.12, 16]} />
              <meshStandardMaterial color="#CBD5E1" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.75, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#E11D48' : '#F59E0B'} roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 1D. Connecting Pedestrian Walkway from Hospital Front Entrance */}
      {/* Links Main Entrance Plaza (X: 18, Z: 14) to Canteen (X: 28, Z: 10) */}
      <mesh position={[24, 0.14, 13.5]} receiveShadow>
        <boxGeometry args={[11, 0.04, 3.4]} />
        <meshStandardMaterial map={pavingTex} color={EXPLORE_TOKENS.colors.pavingLight} roughness={0.7} />
      </mesh>
      {/* Walkway along Hospital East Wall */}
      <mesh position={[23.5, 0.14, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.04, 23.5]} />
        <meshStandardMaterial map={pavingTex} color={EXPLORE_TOKENS.colors.pavingLight} roughness={0.7} />
      </mesh>

      {/* 1E. Welcoming Plaza Entrance Archway Sign */}
      <group position={[25, 0, 12]}>
        <mesh position={[-1.8, 2.0, 0]} castShadow>
          <boxGeometry args={[0.25, 4.0, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[1.8, 2.0, 0]} castShadow>
          <boxGeometry args={[0.25, 4.0, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 3.8, 0]} castShadow>
          <boxGeometry args={[4.2, 0.7, 0.18]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <mesh position={[0, 3.8, 0.1]}>
          <boxGeometry args={[4.0, 0.55, 0.04]} />
          <meshStandardMaterial color="#F97316" />
        </mesh>
        <Text
          position={[0, 3.8, 0.13]}
          fontSize={0.24}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          MEDICITY CANTEEN & FOOD PLAZA
        </Text>
      </group>

      {/* 1F. Festoon String Lights Across the Plaza */}
      {[
        { x: 26, z: 10 },
        { x: 38, z: 10 },
        { x: 50, z: 10 },
        { x: 26, z: -2 },
        { x: 50, z: -2 },
      ].map((p, idx) => (
        <group key={`festoon-pole-${idx}`} position={[p.x, 0, p.z]}>
          {/* Slender pole */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 5.0, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          {/* Cross arm */}
          <mesh position={[0, 4.9, 0]}>
            <boxGeometry args={[0.8, 0.06, 0.06]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          {/* Warm glowing festoon bulb */}
          <mesh position={[0.3, 4.75, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={1.8} />
          </mesh>
          <pointLight position={[0.3, 4.6, 0]} color="#FEF3C7" intensity={0.4} distance={8} decay={2} />
        </group>
      ))}

      {/* 1G. Modern Planter Boxes with Lush Shrubs around perimeter */}
      {[
        { x: 28, z: 11.5, rot: 0 },
        { x: 33, z: 11.5, rot: 0 },
        { x: 43, z: 11.5, rot: 0 },
        { x: 48, z: 11.5, rot: 0 },
        { x: 53, z: 8, rot: Math.PI / 2 },
        { x: 53, z: 2, rot: Math.PI / 2 },
        { x: 53, z: -4, rot: Math.PI / 2 },
      ].map((pos, idx) => (
        <group key={`canteen-planter-${idx}`} position={[pos.x, 0, pos.z]} rotation={[0, pos.rot, 0]}>
          {/* Planter box */}
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.8, 0.65, 0.7]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {/* Soil */}
          <mesh position={[0, 0.65, 0]}>
            <boxGeometry args={[2.6, 0.05, 0.55]} />
            <meshStandardMaterial color="#3E2723" roughness={0.9} />
          </mesh>
          {/* Green hedge bushes */}
          <mesh position={[-0.8, 0.85, 0]} castShadow>
            <sphereGeometry args={[0.38, 8, 8]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow>
            <sphereGeometry args={[0.42, 8, 8]} />
            <meshStandardMaterial color="#388E3C" roughness={0.8} />
          </mesh>
          <mesh position={[0.8, 0.85, 0]} castShadow>
            <sphereGeometry args={[0.38, 8, 8]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 1H. 3-Compartment Recycling / Waste Station */}
      <group position={[52, 0, 10.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.5, 1.0, 0.5]} />
          <meshStandardMaterial color="#64748B" metalness={0.7} />
        </mesh>
        {/* Three colored lids: Organic, Recycle, Waste */}
        <mesh position={[-0.45, 1.02, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.45]} />
          <meshStandardMaterial color="#16A34A" />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.45]} />
          <meshStandardMaterial color="#2563EB" />
        </mesh>
        <mesh position={[0.45, 1.02, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.45]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* =========================================================================
          2. THE 3 SHOPS / FOOD KIOSKS WITH ACTIVE WORKERS
         ========================================================================= */}

      {/* -------------------------------------------------------------------------
          SHOP 1: "MEDICAFÉ & ARTISAN BAKERY" (North-East: X: 47, Z: -6)
         ------------------------------------------------------------------------- */}
      <group position={[47, 0, -6]}>
        {/* Main Kiosk Cabin */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 3.2, 3.2]} />
          <meshStandardMaterial color="#271F1B" roughness={0.8} />
        </mesh>
        {/* Warm Timber Slat Front Facade */}
        <mesh position={[0, 1.4, 1.62]} receiveShadow>
          <boxGeometry args={[4.6, 2.6, 0.06]} />
          <meshStandardMaterial color="#8D5B36" roughness={0.7} />
        </mesh>
        {/* Roof Border / Fascia */}
        <mesh position={[0, 3.25, 0.1]} castShadow>
          <boxGeometry args={[5.1, 0.35, 3.5]} />
          <meshStandardMaterial color="#1C1917" metalness={0.8} />
        </mesh>
        {/* Striped Canopy Awning (Orange & Cream) */}
        <group position={[0, 2.9, 2.2]} rotation={[0.24, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.9, 0.05, 1.4]} />
            <meshStandardMaterial color="#EA580C" roughness={0.5} />
          </mesh>
          {/* Stripes */}
          {[-1.8, -1.0, -0.2, 0.6, 1.4, 2.2].map((sx, i) => (
            <mesh key={`bakery-stripe-${i}`} position={[sx - 0.2, 0.03, 0]}>
              <boxGeometry args={[0.35, 0.02, 1.38]} />
              <meshStandardMaterial color="#FEF3C7" roughness={0.5} />
            </mesh>
          ))}
          {/* Front Awning Valance */}
          <mesh position={[0, -0.12, 0.7]}>
            <boxGeometry args={[4.9, 0.22, 0.04]} />
            <meshStandardMaterial color="#C2410C" />
          </mesh>
        </group>

        {/* Counter Opening (Cutout serving window) */}
        <mesh position={[0, 1.25, 1.63]}>
          <boxGeometry args={[3.8, 1.5, 0.1]} />
          <meshStandardMaterial color="#0C0A09" roughness={0.9} />
        </mesh>
        {/* White Quartz Serving Countertop */}
        <mesh position={[0, 0.98, 1.8]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.12, 0.85]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Chalkboard Menu Sign */}
        <group position={[0, 2.6, 1.66]}>
          <mesh castShadow>
            <boxGeometry args={[3.6, 0.6, 0.05]} />
            <meshStandardMaterial color="#18181B" roughness={0.9} />
          </mesh>
          <Text
            position={[0, 0.08, 0.035]}
            fontSize={0.2}
            color="#FDE047"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            MEDICAFÉ & ARTISAN BAKERY
          </Text>
          <Text
            position={[0, -0.12, 0.035]}
            fontSize={0.11}
            color="#E2E8F0"
            anchorX="center"
            anchorY="middle"
          >
            Espresso $3.00 | Cappuccino $4.20 | Fresh Pastries $3.50
          </Text>
        </group>

        {/* Counter Props & Equipment: */}
        {/* 1. Chrome 2-Group Espresso Machine */}
        <group position={[-1.2, 1.15, 1.8]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.55, 0.5]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Portafilters */}
          <mesh position={[-0.2, -0.05, 0.28]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0.2, -0.05, 0.28]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          {/* Cup warming rack on top */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.8, 0.05, 0.4]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
          </mesh>
        </group>

        {/* 2. Coffee Bean Grinder */}
        <group position={[-1.8, 1.15, 1.75]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.5, 12]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          {/* Bean Hopper */}
          <mesh position={[0, 0.35, 0]}>
            <coneGeometry args={[0.15, 0.3, 12]} />
            <meshStandardMaterial color="#78350F" transparent opacity={0.85} />
          </mesh>
        </group>

        {/* 3. Curved Glass Pastry Showcase */}
        <group position={[0.6, 1.25, 1.8]}>
          {/* Glass display box */}
          <mesh castShadow>
            <boxGeometry args={[1.6, 0.5, 0.5]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.4} roughness={0.1} />
          </mesh>
          {/* Shelves with fresh pastries */}
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[1.5, 0.02, 0.45]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.6} />
          </mesh>
          {/* Golden Croissants & Muffins */}
          {[-0.5, -0.2, 0.1, 0.4].map((px, i) => (
            <group key={`pastry-${i}`} position={[px, -0.02, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshStandardMaterial color="#D97706" roughness={0.6} />
              </mesh>
            </group>
          ))}
          <pointLight position={[0, 0.1, 0]} color="#FEF3C7" intensity={0.6} distance={2} decay={2} />
        </group>

        {/* 4. Digital POS Cash Register & Stacks of Cups */}
        <group position={[-0.4, 1.12, 1.85]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.22, 0.22]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          {/* Screen */}
          <mesh position={[0, 0.14, 0.06]} rotation={[-0.4, 0, 0]}>
            <boxGeometry args={[0.26, 0.18, 0.02]} />
            <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={0.8} />
          </mesh>
        </group>
        <group position={[-0.05, 1.18, 1.85]}>
          {/* Cup stack */}
          <mesh>
            <cylinderGeometry args={[0.05, 0.04, 0.35, 10]} />
            <meshStandardMaterial color="#F8FAFC" />
          </mesh>
        </group>

        {/* Active Worker: Barista Alex */}
        <group position={[-0.7, 0, 1.1]} rotation={[0, 0, 0]}>
          <HumanoidMesh
            role="barista"
            isWorking
            breathPhase={1.5}
            shirtColorOverride="#3E2723"
            pantsColorOverride="#18181B"
          />
        </group>

        {/* Waiting Customer at Bakery Window */}
        <group position={[-0.4, 0, 2.6]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh
            role="visitor"
            shirtColorOverride="#2563EB" // Royal blue coat
            pantsColorOverride="#1E293B"
            holdingItem="coffee_cup"
          />
        </group>
      </group>

      {/* -------------------------------------------------------------------------
          SHOP 2: "FRESH JUICE & SMOOTHIES" (Center: X: 36, Z: -8)
         ------------------------------------------------------------------------- */}
      <group position={[36, 0, -8]}>
        {/* Kiosk Cabin */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 3.2, 3.2]} />
          <meshStandardMaterial color="#F0FDF4" roughness={0.7} />
        </mesh>
        {/* Mint Green Accents & Trim */}
        <mesh position={[0, 1.4, 1.62]} receiveShadow>
          <boxGeometry args={[4.6, 2.6, 0.06]} />
          <meshStandardMaterial color="#10B981" roughness={0.6} />
        </mesh>
        {/* Roof Fascia */}
        <mesh position={[0, 3.25, 0.1]} castShadow>
          <boxGeometry args={[5.1, 0.35, 3.5]} />
          <meshStandardMaterial color="#065F46" metalness={0.7} />
        </mesh>
        {/* Green & White Striped Canopy */}
        <group position={[0, 2.9, 2.2]} rotation={[0.24, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.9, 0.05, 1.4]} />
            <meshStandardMaterial color="#10B981" roughness={0.5} />
          </mesh>
          {[-1.8, -1.0, -0.2, 0.6, 1.4, 2.2].map((sx, i) => (
            <mesh key={`juice-stripe-${i}`} position={[sx - 0.2, 0.03, 0]}>
              <boxGeometry args={[0.35, 0.02, 1.38]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
            </mesh>
          ))}
          <mesh position={[0, -0.12, 0.7]}>
            <boxGeometry args={[4.9, 0.22, 0.04]} />
            <meshStandardMaterial color="#047857" />
          </mesh>
        </group>

        {/* Counter Opening */}
        <mesh position={[0, 1.25, 1.63]}>
          <boxGeometry args={[3.8, 1.5, 0.1]} />
          <meshStandardMaterial color="#064E3B" roughness={0.9} />
        </mesh>
        {/* Countertop */}
        <mesh position={[0, 0.98, 1.8]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.12, 0.85]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Overhead Sign */}
        <group position={[0, 2.6, 1.66]}>
          <mesh castShadow>
            <boxGeometry args={[3.6, 0.6, 0.05]} />
            <meshStandardMaterial color="#064E3B" roughness={0.8} />
          </mesh>
          <Text
            position={[0, 0.08, 0.035]}
            fontSize={0.2}
            color="#34D399"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            FRESH JUICE & HEALTHY BOWLS
          </Text>
          <Text
            position={[0, -0.12, 0.035]}
            fontSize={0.11}
            color="#E2E8F0"
            anchorX="center"
            anchorY="middle"
          >
            Green Detox $5.00 | Mango Smoothie $5.50 | Fruit Bowl $4.80
          </Text>
        </group>

        {/* Equipment & Props: */}
        {/* Blenders Station with Micro-Shake animation */}
        <group ref={worker2BlenderRef} position={[-1.1, 1.05, 1.8]}>
          {/* Blender 1 (Berry smoothie) */}
          <group position={[-0.3, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.09, 0.11, 0.18, 12]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.06, 0.26, 12]} />
              <meshStandardMaterial color="#A855F7" transparent opacity={0.9} roughness={0.2} />
            </mesh>
          </group>
          {/* Blender 2 (Mango smoothie) */}
          <group position={[0.3, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.09, 0.11, 0.18, 12]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.06, 0.26, 12]} />
              <meshStandardMaterial color="#F59E0B" transparent opacity={0.9} roughness={0.2} />
            </mesh>
          </group>
        </group>

        {/* Twin Transparent Drink Dispensers */}
        <group position={[-0.1, 1.25, 1.8]}>
          {/* Orange juice dispenser */}
          <mesh castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.45, 16]} />
            <meshStandardMaterial color="#F97316" transparent opacity={0.88} roughness={0.15} />
          </mesh>
          {/* Spigot valve */}
          <mesh position={[0, -0.16, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
        </group>

        {/* Fruit Crates with Apples & Oranges */}
        <group position={[1.1, 1.15, 1.8]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.22, 0.5]} />
            <meshStandardMaterial color="#B45309" roughness={0.8} />
          </mesh>
          {/* Fruit spheres */}
          {[-0.4, -0.15, 0.1, 0.35].map((fx, i) => (
            <mesh key={`fruit-${i}`} position={[fx, 0.14, 0]} castShadow>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#16A34A' : '#EA580C'} roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* Active Worker: Juice Chef Maya */}
        <group position={[-0.5, 0, 1.1]} rotation={[0, 0, 0]}>
          <HumanoidMesh
            role="chef"
            isWorking
            breathPhase={2.8}
            shirtColorOverride="#10B981" // Bright green apron
            pantsColorOverride="#1E293B"
          />
        </group>

        {/* Queueing Customer */}
        <group position={[-0.2, 0, 2.6]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh
            role="visitor"
            shirtColorOverride="#9333EA" // Purple hoodie
            pantsColorOverride="#334155"
          />
        </group>
      </group>

      {/* -------------------------------------------------------------------------
          SHOP 3: "CHAI & HOT SNACKS EXPRESS" (West: X: 26, Z: -5)
         ------------------------------------------------------------------------- */}
      <group position={[26, 0, -5]} rotation={[0, 0.22, 0]}>
        {/* Kiosk Cabin */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.6, 3.2, 3.0]} />
          <meshStandardMaterial color="#2E1C14" roughness={0.8} />
        </mesh>
        {/* Terracotta Front */}
        <mesh position={[0, 1.4, 1.52]} receiveShadow>
          <boxGeometry args={[4.4, 2.6, 0.06]} />
          <meshStandardMaterial color="#B45309" roughness={0.7} />
        </mesh>
        {/* Canopy */}
        <group position={[0, 2.9, 2.1]} rotation={[0.24, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.7, 0.05, 1.4]} />
            <meshStandardMaterial color="#B91C1C" roughness={0.5} />
          </mesh>
          {[-1.6, -0.8, 0, 0.8, 1.6].map((sx, i) => (
            <mesh key={`snack-stripe-${i}`} position={[sx, 0.03, 0]}>
              <boxGeometry args={[0.35, 0.02, 1.38]} />
              <meshStandardMaterial color="#FEF3C7" roughness={0.5} />
            </mesh>
          ))}
          <mesh position={[0, -0.12, 0.7]}>
            <boxGeometry args={[4.7, 0.22, 0.04]} />
            <meshStandardMaterial color="#991B1B" />
          </mesh>
        </group>

        {/* Counter Opening */}
        <mesh position={[0, 1.25, 1.53]}>
          <boxGeometry args={[3.6, 1.5, 0.1]} />
          <meshStandardMaterial color="#1C1917" roughness={0.9} />
        </mesh>
        {/* Countertop */}
        <mesh position={[0, 0.98, 1.7]} castShadow receiveShadow>
          <boxGeometry args={[4.0, 0.12, 0.8]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Sign */}
        <group position={[0, 2.6, 1.56]}>
          <mesh castShadow>
            <boxGeometry args={[3.4, 0.6, 0.05]} />
            <meshStandardMaterial color="#1C1917" roughness={0.9} />
          </mesh>
          <Text
            position={[0, 0.08, 0.035]}
            fontSize={0.2}
            color="#FBBF24"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            CHAI & HOT SNACKS EXPRESS
          </Text>
          <Text
            position={[0, -0.12, 0.035]}
            fontSize={0.11}
            color="#E2E8F0"
            anchorX="center"
            anchorY="middle"
          >
            Masala Chai $2.50 | Veg Samosas $3.20 | Grilled Panini $5.00
          </Text>
        </group>

        {/* Equipment: */}
        {/* 1. Large Brass/Stainless Steel Chai Samovar Urn */}
        <group position={[-1.2, 1.3, 1.7]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.65, 16]} />
            <meshStandardMaterial color="#D97706" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Urn Lid with Brass Knob */}
          <mesh position={[0, 0.36, 0]}>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} />
          </mesh>
          {/* Spigot Tap */}
          <mesh position={[0, -0.22, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} />
          </mesh>
        </group>

        {/* 2. Heated Glass Showcase with Hot Samosas & Rolls */}
        <group position={[0.4, 1.25, 1.7]}>
          <mesh castShadow>
            <boxGeometry args={[1.6, 0.45, 0.5]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.35} roughness={0.1} />
          </mesh>
          {/* Interior warm glow */}
          <pointLight position={[0, 0, 0]} color="#F59E0B" intensity={0.9} distance={1.8} decay={2} />
          {/* Food items inside */}
          {[-0.5, -0.2, 0.1, 0.4].map((sx, i) => (
            <mesh key={`hot-snack-${i}`} position={[sx, -0.1, 0]} castShadow>
              <coneGeometry args={[0.08, 0.12, 4]} />
              <meshStandardMaterial color="#B45309" roughness={0.5} />
            </mesh>
          ))}
        </group>

        {/* Active Worker: Chef Marco */}
        <group position={[-0.5, 0, 1.0]} rotation={[0, 0, 0]}>
          <HumanoidMesh
            role="canteen_worker"
            isWorking
            breathPhase={3.5}
            shirtColorOverride="#EA580C"
            pantsColorOverride="#1E293B"
          />
        </group>

        {/* Waiting Customer */}
        <group position={[0.1, 0, 2.5]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh
            role="visitor"
            shirtColorOverride="#047857" // Emerald jacket
            pantsColorOverride="#1E293B"
          />
        </group>
      </group>

      {/* =========================================================================
          3. DINING TABLES, CHAIRS & PRODUCTS (4 TO 5 RICH SETS)
         ========================================================================= */}

      {/* -------------------------------------------------------------------------
          TABLE SET 1: Round Teak Cafe Table with Canvas Parasol (X: 31, Z: 2)
         ------------------------------------------------------------------------- */}
      <group position={[31, 0.16, 2]}>
        {/* Cast iron pedestal */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.35, 0.75, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>
        {/* Round slatted timber tabletop */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.06, 24]} />
          <meshStandardMaterial color="#8C5E35" roughness={0.65} />
        </mesh>

        {/* Large Sun Parasol / Umbrella */}
        <group position={[0, 0.75, 0]}>
          {/* Center pole */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 2.8, 8]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
          {/* Cream fabric umbrella canopy */}
          <mesh position={[0, 2.65, 0]} castShadow>
            <coneGeometry args={[1.8, 0.65, 8]} />
            <meshStandardMaterial color="#FEF3C7" roughness={0.7} />
          </mesh>
          <mesh position={[0, 3.0, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#D97706" />
          </mesh>
        </group>

        {/* Products on Table: */}
        {/* Ceramic Cappuccino Mugs & Saucers */}
        <mesh position={[-0.3, 0.81, 0.15]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.015, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[-0.3, 0.85, 0.15]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.08, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Golden Croissant on Plate */}
        <mesh position={[0.2, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.015, 12]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.2, 0.84, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.06, 0.025, 8, 12, Math.PI * 1.2]} />
          <meshStandardMaterial color="#D97706" roughness={0.5} />
        </mesh>
        {/* Soda Can & Condiment Caddy */}
        <mesh position={[-0.1, 0.85, -0.3]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.12, 10]} />
          <meshStandardMaterial color="#DC2626" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 4 Ergonomic Dining Chairs around table */}
        {[
          { x: 0, z: 1.1, rot: 0 },
          { x: 1.1, z: 0, rot: -Math.PI / 2 },
          { x: 0, z: -1.1, rot: Math.PI },
          { x: -1.1, z: 0, rot: Math.PI / 2 },
        ].map((c, i) => (
          <group key={`t1-chair-${i}`} position={[c.x, 0, c.z]} rotation={[0, c.rot, 0]}>
            {/* Seat */}
            <mesh position={[0, 0.44, 0]} castShadow>
              <boxGeometry args={[0.44, 0.05, 0.42]} />
              <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.72, -0.18]} castShadow>
              <boxGeometry args={[0.42, 0.45, 0.05]} />
              <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>
            {/* Legs */}
            <mesh position={[-0.18, 0.22, -0.16]}>
              <cylinderGeometry args={[0.02, 0.02, 0.44]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
            <mesh position={[0.18, 0.22, -0.16]}>
              <cylinderGeometry args={[0.02, 0.02, 0.44]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
            <mesh position={[-0.18, 0.22, 0.16]}>
              <cylinderGeometry args={[0.02, 0.02, 0.44]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
            <mesh position={[0.18, 0.22, 0.16]}>
              <cylinderGeometry args={[0.02, 0.02, 0.44]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
          </group>
        ))}

        {/* Seated Diners at Table 1: */}
        {/* Diner 1: Ordinary visitor sipping coffee */}
        <group position={[0, 0.06, 1.1]} rotation={[0, 0, 0]}>
          <HumanoidMesh
            role="visitor"
            isSitting
            isDrinking
            breathPhase={0.8}
            shirtColorOverride="#0284C7" // Sky blue polo
            pantsColorOverride="#1E293B"
          />
        </group>
        {/* Diner 2: Companion eating and chatting */}
        <group position={[0, 0.06, -1.1]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh
            role="visitor"
            isSitting
            breathPhase={2.1}
            shirtColorOverride="#EC4899" // Rose pink top
            pantsColorOverride="#334155"
          />
        </group>
      </group>

      {/* -------------------------------------------------------------------------
          TABLE SET 2: Square Teak Table with Offset Cantilever Parasol (X: 41, Z: 1)
         ------------------------------------------------------------------------- */}
      <group position={[41, 0.16, 1]}>
        {/* Square Table */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[0.08, 0.72, 0.08]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.06, 1.5]} />
          <meshStandardMaterial color="#B4824C" roughness={0.6} />
        </mesh>

        {/* Cantilever Terracotta Parasol */}
        <group position={[1.4, 0, 1.4]}>
          <mesh position={[0, 1.6, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 3.2]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[-0.7, 3.15, -0.7]} rotation={[0, 0, 0]} castShadow>
            <coneGeometry args={[1.9, 0.55, 8]} />
            <meshStandardMaterial color="#EA580C" roughness={0.6} />
          </mesh>
        </group>

        {/* Products on Table: */}
        {/* 2 Smoothie Tall Cups with Straws */}
        <mesh position={[-0.3, 0.85, 0.2]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.16, 12]} />
          <meshStandardMaterial color="#10B981" transparent opacity={0.9} />
        </mesh>
        <mesh position={[-0.3, 0.96, 0.2]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.12, 6]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
        {/* Salad Bowl & Sandwich Plate */}
        <mesh position={[0.25, 0.82, -0.2]} castShadow>
          <cylinderGeometry args={[0.14, 0.09, 0.08, 12]} />
          <meshStandardMaterial color="#F8FAFC" />
        </mesh>
        <mesh position={[0.25, 0.86, -0.2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#15803D" />
        </mesh>

        {/* 4 Armchairs */}
        {[
          { x: 0, z: 1.15, rot: 0 },
          { x: 1.15, z: 0, rot: -Math.PI / 2 },
          { x: 0, z: -1.15, rot: Math.PI },
          { x: -1.15, z: 0, rot: Math.PI / 2 },
        ].map((c, i) => (
          <group key={`t2-chair-${i}`} position={[c.x, 0, c.z]} rotation={[0, c.rot, 0]}>
            <mesh position={[0, 0.44, 0]} castShadow>
              <boxGeometry args={[0.46, 0.05, 0.44]} />
              <meshStandardMaterial color="#475569" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.72, -0.19]} castShadow>
              <boxGeometry args={[0.44, 0.45, 0.06]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          </group>
        ))}

        {/* Seated Diners at Table 2: */}
        {/* Doctor on break in white coat */}
        <group position={[0, 0.06, 1.15]} rotation={[0, 0, 0]}>
          <HumanoidMesh
            role="doctor"
            isSitting
            isDrinking
            breathPhase={1.2}
          />
        </group>
        {/* Nurse in scrubs eating lunch */}
        <group position={[1.15, 0.06, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <HumanoidMesh
            role="nurse"
            isSitting
            breathPhase={3.0}
          />
        </group>
      </group>

      {/* -------------------------------------------------------------------------
          TABLE SET 3: Scandinavian Picnic Table (X: 32, Z: 8)
         ------------------------------------------------------------------------- */}
      <group position={[32, 0.16, 8]}>
        {/* Picnic Table Slab */}
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.06, 1.0]} />
          <meshStandardMaterial color="#8D5B36" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.36, 0]} castShadow>
          <boxGeometry args={[1.8, 0.7, 0.6]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        {/* Attached Benches */}
        <mesh position={[0, 0.44, 0.85]} castShadow>
          <boxGeometry args={[2.2, 0.05, 0.35]} />
          <meshStandardMaterial color="#8D5B36" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.44, -0.85]} castShadow>
          <boxGeometry args={[2.2, 0.05, 0.35]} />
          <meshStandardMaterial color="#8D5B36" roughness={0.7} />
        </mesh>

        {/* Products on Table: */}
        {/* Fast Food Trays with burger & fries */}
        <mesh position={[-0.4, 0.78, 0]} castShadow>
          <boxGeometry args={[0.35, 0.02, 0.25]} />
          <meshStandardMaterial color="#B91C1C" />
        </mesh>
        <mesh position={[-0.4, 0.82, -0.04]} castShadow>
          <boxGeometry args={[0.12, 0.07, 0.12]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>
        {/* Drink cups with lids */}
        <mesh position={[0.4, 0.84, 0.1]} castShadow>
          <cylinderGeometry args={[0.045, 0.035, 0.14, 10]} />
          <meshStandardMaterial color="#2563EB" />
        </mesh>

        {/* Seated Diners: Ward Boy & Visitor */}
        <group position={[-0.4, 0.06, 0.85]} rotation={[0, 0, 0]}>
          <HumanoidMesh
            role="ward_boy"
            isSitting
            breathPhase={2.4}
          />
        </group>
        <group position={[0.4, 0.06, -0.85]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh
            role="visitor"
            isSitting
            shirtColorOverride="#4B5563" // Dark charcoal jacket
            pantsColorOverride="#1E293B"
            breathPhase={0.4}
          />
        </group>
      </group>

      {/* -------------------------------------------------------------------------
          TABLE SET 4: High-Top Bistro Bar Table with Barstools (X: 43, Z: 8)
         ------------------------------------------------------------------------- */}
      <group position={[43, 0.16, 8]}>
        {/* High table */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.3, 1.1, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.75, 0.75, 0.05, 24]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Products on High Table */}
        <mesh position={[0.1, 1.15, 0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.07, 10]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.15, 1.14, -0.1]} castShadow>
          <boxGeometry args={[0.22, 0.015, 0.16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        {/* 4 Barstools */}
        {[
          { x: 0, z: 0.8, rot: 0 },
          { x: 0.8, z: 0, rot: -Math.PI / 2 },
          { x: 0, z: -0.8, rot: Math.PI },
          { x: -0.8, z: 0, rot: Math.PI / 2 },
        ].map((s, i) => (
          <group key={`barstool-${i}`} position={[s.x, 0, s.z]} rotation={[0, s.rot, 0]}>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.03, 0.18, 0.8, 12]} />
              <meshStandardMaterial color="#64748B" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.8, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
              <meshStandardMaterial color="#D97706" roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Seated Diner on Barstool */}
        <group position={[0, 0.42, 0.8]} rotation={[0, 0, 0]}>
          <HumanoidMesh
            role="visitor"
            isSitting
            isDrinking
            shirtColorOverride="#7C3AED" // Violet sweater
            pantsColorOverride="#1E293B"
            breathPhase={1.9}
          />
        </group>
      </group>

      {/* -------------------------------------------------------------------------
          TABLE SET 5: Garden Patio Table in North Empty Ground (X: 48, Z: -15)
         ------------------------------------------------------------------------- */}
      <group position={[48, 0.13, -15]}>
        {/* Patio Table */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.28, 0.74, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.05, 20]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>

        {/* Green Sun Umbrella */}
        <group position={[0, 0.75, 0]}>
          <mesh position={[0, 1.35, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 2.7, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow>
            <coneGeometry args={[1.7, 0.55, 8]} />
            <meshStandardMaterial color="#047857" roughness={0.6} />
          </mesh>
        </group>

        {/* 3 Garden Wire Chairs */}
        {[
          { x: 0, z: 0.95, rot: 0 },
          { x: 0.85, z: -0.45, rot: -Math.PI * 0.7 },
          { x: -0.85, z: -0.45, rot: Math.PI * 0.7 },
        ].map((gc, i) => (
          <group key={`garden-chair-${i}`} position={[gc.x, 0, gc.z]} rotation={[0, gc.rot, 0]}>
            <mesh position={[0, 0.44, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.2, 0.05, 12]} />
              <meshStandardMaterial color="#047857" />
            </mesh>
            <mesh position={[0, 0.72, -0.16]}>
              <boxGeometry args={[0.38, 0.4, 0.04]} />
              <meshStandardMaterial color="#047857" />
            </mesh>
          </group>
        ))}

        {/* Products */}
        <mesh position={[0.1, 0.8, 0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.12, 10]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>

        {/* Seated Senior Visitor */}
        <group position={[0, 0.06, 0.95]} rotation={[0, 0, 0]}>
          <HumanoidMesh
            role="visitor"
            isSitting
            shirtColorOverride="#0284C7"
            pantsColorOverride="#475569"
            breathPhase={3.2}
          />
        </group>
      </group>

      {/* =========================================================================
          4. PEDESTRIANS WALKING TO & FROM HOSPITAL
         ========================================================================= */}
      {WALKING_VISITORS_DATA.map((visitor, idx) => (
        <group
          key={visitor.id}
          ref={(el) => {
            visitorGroups.current[idx] = el;
          }}
          position={[visitor.waypoints[0].x, 0.15, visitor.waypoints[0].z]}
        >
          <HumanoidMesh
            role="visitor"
            walkPhase={visitorPhases.current[idx]}
            shirtColorOverride={visitor.shirtColor}
            pantsColorOverride={visitor.pantsColor}
            holdingItem={visitor.holdingItem || 'none'}
          />
        </group>
      ))}
    </group>
  );
}
