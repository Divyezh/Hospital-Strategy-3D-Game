'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ExploreEnvironment } from './ExploreEnvironment';
import { ExploreCamera } from './ExploreCamera';
import { CampusGround } from './CampusGround';
import { CampusPerimeter } from './CampusPerimeter';
import { GuardBoothInterior } from './GuardBoothInterior';
import { HospitalBuilding } from './HospitalBuilding';
import { HospitalCanteenPlaza } from './HospitalCanteenPlaza';
import { TransitHubAndVehicles } from './TransitHubAndVehicles';
import { ExploreCharacters } from './ExploreCharacters';
import { CampusVegetation } from './CampusVegetation';
import { NeighbourhoodBackdrop } from './NeighbourhoodBackdrop';
import { ExploreDebugOverlay } from './ExploreDebugOverlay';
import { useExploreStore } from '@/explore/store';

export function ExploreCanvas() {
  const quality = useExploreStore((s) => s.quality);
  const [vehicleGateOpen, setVehicleGateOpen] = useState(false);

  const dpr: [number, number] =
    quality === 'low' ? [1, 1] : quality === 'medium' ? [1, 1.5] : [1, 2];

  return (
    <div className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-[#E8F1FC]">
      <Canvas
        frameloop="always"
        shadows={quality !== 'low'}
        dpr={dpr}
        camera={{
          fov: 34,
          near: 0.5,
          far: 1400,
          position: [55, 52, 78],
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          logarithmicDepthBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={null}>
          <ExploreEnvironment />
          <ExploreCamera />
          <CampusGround />
          <CampusPerimeter vehicleGateOpen={vehicleGateOpen} />
          <GuardBoothInterior />
          <HospitalBuilding />
          <HospitalCanteenPlaza />
          <TransitHubAndVehicles />
          <ExploreCharacters onGateTrigger={setVehicleGateOpen} />
          <CampusVegetation />
          <NeighbourhoodBackdrop />
        </Suspense>
      </Canvas>
    </div>
  );
}
