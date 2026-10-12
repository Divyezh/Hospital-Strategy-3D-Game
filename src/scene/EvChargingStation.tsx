'use client';

import React from 'react';
import { useSimStore } from '@/store/useSimStore';

interface EvChargingStationProps {
  position: [number, number, number];
  rotation?: number;
}

export function EvChargingStation({
  position,
  rotation = 0,
}: EvChargingStationProps) {
  const selectElement = useSimStore((s) => s.selectElement);
  const selectedElement = useSimStore((s) => s.selectedElement);
  const isSelected = selectedElement?.id === 'charger-c1';

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectElement({
      id: 'charger-c1',
      type: 'restStation',
      name: 'EV Charger C1 — Fast DC Hub',
      siteId: 'site-mc-04',
      status: 'Active · Charging',
      details: {
        model: 'Fast DC 120kW EV & Logistics Charger',
        currentlyConnected: 'MED-LIFT FL-02 (Toyota 8FBE18)',
        batteryLevel: '95%',
        chargeRate: '8% / min',
        energyDelivered: '48.1 kWh today',
        sessionsToday: '6 sessions',
      },
    });
  };

  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'grab';
      }}
    >
      {/* Selection Box */}
      {isSelected && (
        <group position={[0, 1.2, 0]}>
          <mesh>
            <boxGeometry args={[4.2, 2.6, 3.4]} />
            <meshBasicMaterial color="#10B981" transparent opacity={0.15} />
          </mesh>
        </group>
      )}

      {/* Painted EV Parking Bays on Ground (Green outline with electric icons) */}
      <group position={[0, 0.015, 0.8]}>
        {/* Green EV bay parking pad */}
        <mesh receiveShadow>
          <planeGeometry args={[4.0, 3.6]} />
          <meshStandardMaterial color="#065F46" roughness={0.9} />
        </mesh>
        {/* White parking bay boundaries */}
        {[-1.9, 0, 1.9].map((px) => (
          <mesh key={px} position={[px, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, 3.5]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        ))}
        {/* EV Electric Lightning Stencil on asphalt */}
        <mesh position={[-0.95, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 1.2]} />
          <meshBasicMaterial color="#34D399" />
        </mesh>
        <mesh position={[0.95, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.7, 1.2]} />
          <meshBasicMaterial color="#34D399" />
        </mesh>
      </group>

      {/* 2 Modern Fast EV Charging Pedestals (C1 & C2) */}
      {[-1.0, 1.0].map((cx, idx) => (
        <group key={idx} position={[cx, 0, -1.2]}>
          {/* Concrete pedestal base */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.7, 0.2, 0.6]} />
            <meshStandardMaterial color="#64748B" roughness={0.8} />
          </mesh>

          {/* Sleek white tower chassis */}
          <mesh position={[0, 1.05, 0]} castShadow>
            <boxGeometry args={[0.55, 1.7, 0.45]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.1} />
          </mesh>

          {/* Navy Blue side accent trim */}
          <mesh position={[0, 1.05, 0.23]}>
            <boxGeometry args={[0.45, 1.6, 0.02]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>

          {/* Illuminated Neon Green LED Charging Status Screen */}
          <mesh position={[0, 1.35, 0.245]}>
            <planeGeometry args={[0.38, 0.42]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
          <pointLight
            position={[0, 1.35, 0.4]}
            intensity={0.6}
            color="#34D399"
            distance={3}
            decay={2}
          />

          {/* Heavy-duty flexible charging cable looped to ground */}
          <mesh position={[0.3, 0.65, 0.15]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.03, 0.03, 0.9, 8]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>

          {/* Yellow crash protection mini-bollard */}
          <mesh position={[0, 0.4, 0.45]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.8, 8]} />
            <meshStandardMaterial color="#EAB308" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
