'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimStore } from '@/store/useSimStore';
import { simEngine } from '@/sim/engine';

interface BayConfig {
  id: string;
  name: string;
  slotNumber: number;
  type: string;
  position: [number, number, number];
  color: string;
}

const BAYS_DATA: BayConfig[] = [
  { id: 'bay-1', name: 'Bay 1 — Trauma Resuscitation', slotNumber: 1, type: 'Trauma & Critical Care', position: [-13.5, 0, 4.1], color: '#EF4444' },
  { id: 'bay-2', name: 'Bay 2 — Acute ER Intake', slotNumber: 2, type: 'Rapid Triage Intake', position: [-8.1, 0, 4.1], color: '#F59E0B' },
  { id: 'bay-3', name: 'Bay 3 — Inpatient Transfer', slotNumber: 3, type: 'Ward & ICU Transfer', position: [-2.7, 0, 4.1], color: '#2563EB' },
  { id: 'bay-4', name: 'Bay 4 — Medical Freight Depot', slotNumber: 4, type: 'Pharma & Sterile Logistics', position: [2.7, 0, 4.1], color: '#10B981' },
];

function SingleDockBay({
  bay,
  center,
}: {
  bay: BayConfig;
  center: [number, number, number];
}) {
  const shutterRef = useRef<THREE.Group>(null);
  const levelerRef = useRef<THREE.Group>(null);
  const selectedElement = useSimStore((s) => s.selectedElement);
  const selectElement = useSimStore((s) => s.selectElement);
  const isSelected = selectedElement?.id === bay.id;

  // Real-time bay occupancy status from engine
  const activeSite = useSimStore((s) => s.activeSite);
  const siteState = simEngine.siteStates[activeSite.id];
  const bayState = siteState?.bays.find((b) => b.slotNumber === bay.slotNumber);
  const isBusy = bayState && (bayState.status === 'docking' || bayState.status === 'unloading' || bayState.status === 'occupied');

  // Smooth animation for roll-up door and hydraulic leveler
  const targetDoorHeight = isBusy ? 3.4 : 0;
  const currentDoorHeight = useRef(0);
  const targetLevelerAngle = isBusy ? 0.08 : 0;
  const currentLevelerAngle = useRef(0);

  useFrame((_, dt) => {
    // Smooth door slide
    currentDoorHeight.current = THREE.MathUtils.lerp(
      currentDoorHeight.current,
      targetDoorHeight,
      Math.min(dt * 3.5, 1)
    );
    if (shutterRef.current) {
      shutterRef.current.position.y = currentDoorHeight.current;
    }

    // Smooth leveler tilt
    currentLevelerAngle.current = THREE.MathUtils.lerp(
      currentLevelerAngle.current,
      targetLevelerAngle,
      Math.min(dt * 4, 1)
    );
    if (levelerRef.current) {
      levelerRef.current.rotation.x = currentLevelerAngle.current;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectElement({
      id: bay.id,
      type: 'bay',
      name: bay.name,
      siteId: activeSite.id,
      status: isBusy ? 'Occupied / Active' : 'Available',
      details: {
        slot: `Bay ${bay.slotNumber}`,
        purpose: bay.type,
        doorStatus: isBusy ? 'Roll-up Door Open' : 'Roll-up Door Closed',
        leveler: isBusy ? 'Hydraulic Ramp Deployed' : 'Hydraulic Ramp Stowed',
        dockedAmbulance: bayState?.ambulanceId || 'None (Vacant)',
      },
    });
  };

  const [bx, by, bz] = bay.position;

  return (
    <group
      position={[center[0] + bx, center[1] + by, center[2] + bz]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'grab';
      }}
    >
      {/* Selection highlight box */}
      {isSelected && (
        <group position={[0, 2.2, 0]}>
          <mesh>
            <boxGeometry args={[4.4, 4.4, 1.2]} />
            <meshBasicMaterial color="#2563EB" transparent opacity={0.15} wireframe={false} />
          </mesh>
        </group>
      )}

      {/* Main Structural Bay Frame in Royal Blue (#1E60F3 / #2563EB) */}
      <mesh position={[0, 2.2, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 4.4, 0.35]} />
        <meshStandardMaterial color="#1E60F3" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Recessed Door Cavity Opening */}
      <mesh position={[0, 2.0, 0.05]}>
        <boxGeometry args={[3.6, 4.0, 0.2]} />
        <meshStandardMaterial color="#0F172A" roughness={0.8} />
      </mesh>

      {/* Animated Segmented Roll-Up Overhead Door Slats */}
      <group position={[0, 0.2, 0.12]}>
        <group ref={shutterRef}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <mesh key={idx} position={[0, 0.45 + idx * 0.45, 0]} castShadow>
              <boxGeometry args={[3.5, 0.42, 0.06]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#E2E8F0' : '#CBD5E1'}
                roughness={0.4}
                metalness={0.2}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Articulated Hydraulic Dock Leveler Ramp */}
      <group ref={levelerRef} position={[0, 0.05, 0.4]}>
        {/* Steel diamond-plate ramp */}
        <mesh position={[0, 0.04, 0.9]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.08, 1.8]} />
          <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.5} />
        </mesh>
        {/* Yellow safety perimeter toe guard edge */}
        <mesh position={[-1.42, 0.06, 0.9]}>
          <boxGeometry args={[0.04, 0.12, 1.8]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.4} />
        </mesh>
        <mesh position={[1.42, 0.06, 0.9]}>
          <boxGeometry args={[0.04, 0.12, 1.8]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.4} />
        </mesh>
      </group>

      {/* Overhead Illuminated Bay Number Badge */}
      <group position={[0, 4.45, 0.38]}>
        {/* Badge backplate */}
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.55, 0.12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* Colored header band */}
        <mesh position={[0, 0.18, 0.02]}>
          <boxGeometry args={[1.48, 0.12, 0.1]} />
          <meshStandardMaterial color={bay.color} />
        </mesh>
      </group>

      {/* Overhead Dock Spotlight (illuminates apron when busy) */}
      <mesh position={[0, 4.25, 0.45]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.25]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
      <pointLight
        position={[0, 4.1, 1.2]}
        intensity={isBusy ? 1.4 : 0.4}
        color={isBusy ? '#FEF08A' : '#94A3B8'}
        distance={9}
        decay={2}
      />

      {/* Heavy-duty Safety Yellow Crash Bollards */}
      {[-2.05, 2.05].map((bollx, idx) => (
        <group key={idx} position={[bollx, 0, 0.9]}>
          {/* Base plate */}
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.22, 0.24, 0.08, 12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Yellow safety post */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 1.2, 12]} />
            <meshStandardMaterial color="#EAB308" roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Black hazard stripe on bollard */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.142, 0.142, 0.22, 12]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Ground Painted Dock Parking Apron with Yellow Hazard Diagonal Hatching */}
      <group position={[0, 0.015, 3.8]}>
        {/* Dock parking pad */}
        <mesh receiveShadow>
          <planeGeometry args={[3.6, 6.2]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.9} />
        </mesh>
        {/* White vehicle guide lines */}
        {[-1.75, 1.75].map((gx, idx) => (
          <mesh key={idx} position={[gx, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 6.0]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        ))}
        {/* Yellow cross-hatching safety zone near door threshold */}
        <mesh position={[0, 0.005, -2.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 1.4]} />
          <meshStandardMaterial color="#FEF08A" transparent opacity={0.65} />
        </mesh>
      </group>
    </group>
  );
}

export function HospitalDockBays({ center }: { center: [number, number, number] }) {
  return (
    <group name="hospital-dock-bays-system">
      {BAYS_DATA.map((bay) => (
        <SingleDockBay key={bay.id} bay={bay} center={center} />
      ))}
    </group>
  );
}
