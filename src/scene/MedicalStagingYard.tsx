'use client';

import React from 'react';
import { useSimStore } from '@/store/useSimStore';

interface PalletItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  units: number;
  weightKg: number;
  slot: string;
  position: [number, number, number];
  color: string;
}

const PALLETS: PalletItem[] = [
  {
    id: 'pallet-101',
    name: 'Nitrile Examination Gloves',
    sku: 'MED-GLV-8501',
    category: 'PPE & Infection Control',
    units: 850,
    weightKg: 54,
    slot: 'VH-01 Yard Slot 101',
    position: [-10, 0, 10.5],
    color: '#0284C7',
  },
  {
    id: 'pallet-102',
    name: '0.9% Normal Saline IV Fluids',
    sku: 'MED-IV-4802',
    category: 'Emergency Resuscitation Fluids',
    units: 480,
    weightKg: 240,
    slot: 'VH-02 Yard Slot 102',
    position: [-6.8, 0, 10.5],
    color: '#38BDF8',
  },
  {
    id: 'pallet-103',
    name: 'N95 Particulate Respirators',
    sku: 'MED-MSK-6203',
    category: 'PPE Airborne Filtration',
    units: 620,
    weightKg: 38,
    slot: 'VH-03 Yard Slot 103',
    position: [-3.6, 0, 10.5],
    color: '#D97706',
  },
  {
    id: 'pallet-104',
    name: 'Medical Oxygen D-Cylinders',
    sku: 'MED-O2-0068',
    category: 'Critical Respiratory Gas',
    units: 68,
    weightKg: 180,
    slot: 'VH-04 Yard Slot 104',
    position: [6.0, 0, 10.5],
    color: '#059669',
  },
];

export function MedicalStagingYard() {
  const selectElement = useSimStore((s) => s.selectElement);
  const selectedElement = useSimStore((s) => s.selectedElement);

  return (
    <group name="medical-staging-yard">
      {/* Painted Dashed Yard Staging Bays on Asphalt */}
      {PALLETS.map((pallet) => {
        const isSelected = selectedElement?.id === pallet.id;

        return (
          <group
            key={pallet.id}
            position={pallet.position}
            onClick={(e) => {
              e.stopPropagation();
              selectElement({
                id: pallet.id,
                type: 'building',
                name: `${pallet.name} — PALLET #${pallet.id.replace('pallet-', '')}`,
                siteId: 'site-mc-04',
                status: 'Staged · Ready for Transfer',
                details: {
                  item: pallet.name,
                  sku: pallet.sku,
                  category: pallet.category,
                  quantity: `${pallet.units} units`,
                  grossWeight: `${pallet.weightKg} kg`,
                  location: pallet.slot,
                  arrival: 'Today 08:30 AM',
                },
              });
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'grab';
            }}
          >
            {/* Selection Highlight */}
            {isSelected && (
              <group position={[0, 0.75, 0]}>
                <mesh>
                  <boxGeometry args={[1.7, 1.6, 1.7]} />
                  <meshBasicMaterial color="#2563EB" transparent opacity={0.18} />
                </mesh>
              </group>
            )}

            {/* Ground Dashed Staging Slot Boundary */}
            <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[1.8, 1.8]} />
              <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
            </mesh>

            {/* Wooden Euro Pallet Base */}
            <group position={[0, 0.07, 0]}>
              {/* 3 Bottom skids */}
              {[-0.55, 0, 0.55].map((sx) => (
                <mesh key={sx} position={[sx, -0.04, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.1, 0.08, 1.3]} />
                  <meshStandardMaterial color="#B45309" roughness={0.8} />
                </mesh>
              ))}

              {/* 5 Top deck slats */}
              {[-0.5, -0.25, 0, 0.25, 0.5].map((sz) => (
                <mesh key={sz} position={[0, 0.02, sz]} castShadow receiveShadow>
                  <boxGeometry args={[1.3, 0.04, 0.18]} />
                  <meshStandardMaterial color="#D97706" roughness={0.75} />
                </mesh>
              ))}
            </group>

            {/* Stacked Medical Supply Boxes */}
            <group position={[0, 0.52, 0]}>
              {/* Main stack */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1.15, 0.75, 1.15]} />
                <meshStandardMaterial color={pallet.color} roughness={0.5} />
              </mesh>

              {/* White shipping label sticker */}
              <mesh position={[0, 0.1, 0.58]}>
                <planeGeometry args={[0.4, 0.28]} />
                <meshBasicMaterial color="#FFFFFF" />
              </mesh>

              {/* Shrink-wrap clear film overlay */}
              <mesh>
                <boxGeometry args={[1.18, 0.78, 1.18]} />
                <meshStandardMaterial color="#FFFFFF" transparent opacity={0.25} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}
