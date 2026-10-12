'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { EXPLORE_TOKENS } from '@/explore/tokens';
import { getAsphaltTexture, getConcreteTexture, getPavingTexture, getGrassTexture } from '@/explore/textures';
import { CAMPUS_LAYOUT } from '@/data/campus';
import { SportsCarMesh } from './SportsCarMesh';
import { SuvCarMesh } from './SuvCarMesh';
import { SedanCarMesh } from './SedanCarMesh';

export function CampusGround() {
  const asphaltTex = useMemo(() => getAsphaltTexture(), []);
  const concreteTex = useMemo(() => getConcreteTexture(), []);
  const pavingTex = useMemo(() => getPavingTexture(), []);
  const grassTex = useMemo(() => getGrassTexture(), []);

  return (
    <group>
      {/* 1. Base Landscape Lawn Terrain (3X Expanded District: 750m x 750m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[750, 750]} />
        <meshStandardMaterial
          map={grassTex}
          color={EXPLORE_TOKENS.colors.grassSage}
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* 2. Campus Inner Ground Platform (slightly elevated + concrete curb border) */}
      <mesh position={[0, 0.05, 2]} receiveShadow>
        <boxGeometry args={[130, 0.1, 114]} />
        <meshStandardMaterial
          map={concreteTex}
          color={EXPLORE_TOKENS.colors.concrete}
          roughness={0.88}
        />
      </mesh>

      {/* 3. 3X Expanded Metropolitan Arterial Road Network */}
      {/* 3A. Grand South Metropolitan Boulevard (X: -300 to +300, Z: 60 to 88) */}
      <mesh position={[0, 0.02, 74]} receiveShadow>
        <boxGeometry args={[600, 0.04, 28]} />
        <meshStandardMaterial
          map={asphaltTex}
          color={EXPLORE_TOKENS.colors.asphalt}
          roughness={0.8}
        />
      </mesh>
      {/* Boulevard Center Landscaped Median Divider */}
      <mesh position={[0, 0.12, 74]} receiveShadow>
        <boxGeometry args={[560, 0.15, 2.4]} />
        <meshStandardMaterial color="#4A7C59" roughness={0.9} />
      </mesh>
      {/* Boulevard White Dashed Lane Separators */}
      {[-240, -180, -120, -60, 60, 120, 180, 240].map((x, i) => (
        <group key={`lane-dash-${i}`}>
          <mesh position={[x, 0.05, 68]}>
            <boxGeometry args={[18, 0.01, 0.25]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
          </mesh>
          <mesh position={[x, 0.05, 80]}>
            <boxGeometry args={[18, 0.01, 0.25]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* 3B. North Outer Expressway (Z: -145) */}
      <mesh position={[0, 0.02, -145]} receiveShadow>
        <boxGeometry args={[600, 0.04, 26]} />
        <meshStandardMaterial
          map={asphaltTex}
          color={EXPLORE_TOKENS.colors.asphalt}
          roughness={0.8}
        />
      </mesh>

      {/* 3C. East Arterial Avenue (X: 115, Z: -260 to +260) */}
      <mesh position={[115, 0.02, 0]} receiveShadow>
        <boxGeometry args={[26, 0.04, 520]} />
        <meshStandardMaterial
          map={asphaltTex}
          color={EXPLORE_TOKENS.colors.asphalt}
          roughness={0.8}
        />
      </mesh>

      {/* 3D. West Arterial Avenue (X: -115, Z: -260 to +260) */}
      <mesh position={[-115, 0.02, 0]} receiveShadow>
        <boxGeometry args={[26, 0.04, 520]} />
        <meshStandardMaterial
          map={asphaltTex}
          color={EXPLORE_TOKENS.colors.asphalt}
          roughness={0.8}
        />
      </mesh>

      {/* 4. Campus Internal Driveways */}
      {/* Gate Entrance Avenue (X: 0, Z: 24 to 58) */}
      <mesh position={[0, 0.12, 40]} receiveShadow>
        <boxGeometry args={[11, 0.06, 34]} />
        <meshStandardMaterial
          map={asphaltTex}
          color={EXPLORE_TOKENS.colors.asphalt}
          roughness={0.8}
        />
      </mesh>

      {/* Road Yellow Centerline for entrance avenue */}
      <mesh position={[0, 0.16, 40]}>
        <boxGeometry args={[0.2, 0.01, 32]} />
        <meshStandardMaterial color={EXPLORE_TOKENS.colors.asphaltMarkingYellow} roughness={0.4} />
      </mesh>

      {/* Front Entrance Drop-off Loop Road */}
      <mesh position={[0, 0.12, 22]} receiveShadow>
        <boxGeometry args={[26, 0.06, 12]} />
        <meshStandardMaterial
          map={asphaltTex}
          color={EXPLORE_TOKENS.colors.asphalt}
          roughness={0.8}
        />
      </mesh>

      {/* ER Ambulance Bay Branch Driveway */}
      <mesh position={[-20, 0.12, 19]} receiveShadow>
        <boxGeometry args={[30, 0.06, 7]} />
        <meshStandardMaterial
          map={asphaltTex}
          color={EXPLORE_TOKENS.colors.asphalt}
          roughness={0.8}
        />
      </mesh>

      {/* ER Dedicated Ambulance Bay Pad (Red marked parking boxes) */}
      <mesh position={[-32, 0.12, 8]} receiveShadow>
        <boxGeometry args={[14, 0.06, 16]} />
        <meshStandardMaterial
          map={concreteTex}
          color="#D2D6DC"
          roughness={0.75}
        />
      </mesh>

      {/* ER Red Emergency Cross Hatching on bay tarmac */}
      <group position={[-32, 0.16, 8]}>
        <mesh position={[-3.5, 0, 0]}>
          <boxGeometry args={[0.25, 0.01, 10]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.emergencyRed} />
        </mesh>
        <mesh position={[3.5, 0, 0]}>
          <boxGeometry args={[0.25, 0.01, 10]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.emergencyRed} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.25, 0.01, 10]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.emergencyRed} />
        </mesh>
      </group>

      {/* 5. Modern Drop-off Canopy (Main Entrance) */}
      <group position={[0, 0, 21]}>
        {/* Support columns */}
        <mesh position={[-9, 2.4, -4]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.22, 4.8]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[9, 2.4, -4]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.22, 4.8]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[-9, 2.4, 4]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.22, 4.8]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[9, 2.4, 4]} castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.22, 4.8]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.85} roughness={0.3} />
        </mesh>
        {/* Sleek roof slab */}
        <mesh position={[0, 4.85, 0]} castShadow receiveShadow>
          <boxGeometry args={[21, 0.35, 10]} />
          <meshStandardMaterial color="#FAF9F5" roughness={0.25} metalness={0.1} />
        </mesh>
        {/* Teal translucent glass skylight insert */}
        <mesh position={[0, 4.95, 0]}>
          <boxGeometry args={[14, 0.1, 5]} />
          <meshStandardMaterial
            color={EXPLORE_TOKENS.colors.glassTeal}
            transparent
            opacity={0.65}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* 6. ER Ambulance Canopy */}
      <group position={[-32, 0, 6]}>
        <mesh position={[-5.5, 2.2, 5]} castShadow>
          <boxGeometry args={[0.3, 4.4, 0.3]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.medicalBlueDark} metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[-5.5, 2.2, -5]} castShadow>
          <boxGeometry args={[0.3, 4.4, 0.3]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.medicalBlueDark} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Canopy roof with red emergency edge */}
        <mesh position={[-1.5, 4.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 0.3, 14]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[-1.5, 4.45, 7.05]}>
          <boxGeometry args={[10, 0.32, 0.15]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.emergencyRed} roughness={0.3} />
        </mesh>
      </group>

      {/* 7. Visitor Parking Lot with Solar Canopies */}
      <group position={[36, 0.12, 38]}>
        <mesh receiveShadow>
          <boxGeometry args={[36, 0.05, 24]} />
          <meshStandardMaterial
            map={asphaltTex}
            color={EXPLORE_TOKENS.colors.asphalt}
            roughness={0.82}
          />
        </mesh>
        {/* Solar Canopy 1 */}
        <group position={[0, 0, -5]}>
          <mesh position={[-12, 2.3, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 4.6]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.8} />
          </mesh>
          <mesh position={[12, 2.3, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 4.6]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.8} />
          </mesh>
          <mesh position={[0, 4.6, 0]} rotation={[0.12, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[32, 0.15, 7.5]} />
            <meshStandardMaterial color="#2B3E50" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Parked Cars in Bay Row 1 */}
          <group position={[-9, 0, 0]}>
            <SportsCarMesh color="#F59E0B" hasSpoiler={true} headlightsOn={false} />
          </group>
          <group position={[-3, 0, 0]}>
            <SedanCarMesh color="#F8FAFC" headlightsOn={false} />
          </group>
          <group position={[3, 0, 0]}>
            <SuvCarMesh color="#1E3A8A" headlightsOn={false} />
          </group>
          <group position={[9, 0, 0]}>
            <SedanCarMesh color="#831843" headlightsOn={false} />
          </group>
        </group>
        {/* Solar Canopy 2 */}
        <group position={[0, 0, 6]}>
          <mesh position={[-12, 2.3, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 4.6]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.8} />
          </mesh>
          <mesh position={[12, 2.3, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 4.6]} />
            <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.8} />
          </mesh>
          <mesh position={[0, 4.6, 0]} rotation={[0.12, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[32, 0.15, 7.5]} />
            <meshStandardMaterial color="#2B3E50" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Parked Cars in Bay Row 2 */}
          <group position={[-9, 0, 0]} rotation={[0, Math.PI, 0]}>
            <SportsCarMesh color="#DC2626" hasSpoiler={true} headlightsOn={false} />
          </group>
          <group position={[-3, 0, 0]} rotation={[0, Math.PI, 0]}>
            <SuvCarMesh color="#065F46" headlightsOn={false} />
          </group>
          <group position={[3, 0, 0]} rotation={[0, Math.PI, 0]}>
            <SedanCarMesh color="#1E293B" headlightsOn={false} />
          </group>
          <group position={[9, 0, 0]} rotation={[0, Math.PI, 0]}>
            <SuvCarMesh color="#D97706" headlightsOn={false} />
          </group>
        </group>
      </group>

      {/* 8. East Side Plaza (Managed by HospitalCanteenPlaza) */}

      {/* 9. Pedestrian Walkways and Plaza Paving */}
      {/* Main walkway between Gate and Reception */}
      <mesh position={[-7.5, 0.13, 40]} receiveShadow>
        <boxGeometry args={[3.2, 0.04, 34]} />
        <meshStandardMaterial map={pavingTex} color={EXPLORE_TOKENS.colors.pavingLight} roughness={0.7} />
      </mesh>
      <mesh position={[7.5, 0.13, 40]} receiveShadow>
        <boxGeometry args={[3.2, 0.04, 34]} />
        <meshStandardMaterial map={pavingTex} color={EXPLORE_TOKENS.colors.pavingLight} roughness={0.7} />
      </mesh>

      {/* Plaza in front of Hospital Main Entrance */}
      <mesh position={[0, 0.14, 14]} receiveShadow>
        <boxGeometry args={[38, 0.04, 6]} />
        <meshStandardMaterial map={pavingTex} color={EXPLORE_TOKENS.colors.pavingLight} roughness={0.7} />
      </mesh>

      {/* 10. Healing Courtyard Plaza & Water Feature */}
      <group position={[-39, 0, -28]}>
        {/* Courtyard stone terrace */}
        <mesh position={[0, 0.13, 0]} receiveShadow>
          <boxGeometry args={[24, 0.05, 24]} />
          <meshStandardMaterial map={pavingTex} color={EXPLORE_TOKENS.colors.pavingLight} roughness={0.75} />
        </mesh>
        {/* Water feature pool basin */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[4.8, 5.0, 0.5, 32]} />
          <meshStandardMaterial map={concreteTex} color={EXPLORE_TOKENS.colors.concrete} roughness={0.85} />
        </mesh>
        {/* Water surface */}
        <mesh position={[0, 0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.4, 32]} />
          <meshStandardMaterial
            color={EXPLORE_TOKENS.colors.waterBlue}
            roughness={0.05}
            metalness={0.9}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Central fountain spout pedestal */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 0.8, 16]} />
          <meshStandardMaterial color={EXPLORE_TOKENS.colors.concrete} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
