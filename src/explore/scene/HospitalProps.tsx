'use client';

import React from 'react';
import * as THREE from 'three';
import { PropItem } from '@/data/hospital';
import { EXPLORE_TOKENS } from '@/explore/tokens';
import { HumanoidMesh } from './HumanoidMesh';

interface HospitalPropsProps {
  props: PropItem[];
}

export function HospitalProps({ props }: HospitalPropsProps) {
  return (
    <group>
      {props.map((p, idx) => {
        const key = `prop-${p.type}-${idx}`;
        const rot: [number, number, number] = [0, p.rotation || 0, 0];

        switch (p.type) {
          case 'reception_counter':
            return (
              <group key={key} position={[p.x, p.y, p.z]} rotation={rot}>
                {/* Curved / Long counter base */}
                <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
                  <boxGeometry args={[4.8, 1.1, 1.0]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.woodWarm} roughness={0.4} />
                </mesh>
                {/* Countertop slab with white solid finish */}
                <mesh position={[0, 1.12, 0]} castShadow>
                  <boxGeometry args={[5.0, 0.08, 1.15]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
                </mesh>
                {/* Counter modesty / privacy glass panel */}
                <mesh position={[0, 1.35, -0.45]}>
                  <boxGeometry args={[4.6, 0.45, 0.04]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.glassTeal} transparent opacity={0.5} roughness={0.1} />
                </mesh>
                {/* Underglow accent light bar */}
                <mesh position={[0, 0.06, 0.52]}>
                  <boxGeometry args={[4.7, 0.08, 0.04]} />
                  <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1.2} />
                </mesh>
              </group>
            );

          case 'bed':
            return (
              <group key={key} position={[p.x, p.y, p.z]} rotation={rot}>
                {/* Stainless steel bed frame and wheels */}
                <mesh position={[0, 0.15, 0]} castShadow>
                  <boxGeometry args={[1.24, 0.2, 2.24]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalSteel} metalness={0.8} />
                </mesh>
                {/* Mattress */}
                <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.2, 0.4, 2.2]} />
                  <meshStandardMaterial color="#EBF3F5" roughness={0.6} />
                </mesh>
                {/* Hospital bed sheet */}
                <mesh position={[0, 0.66, 0.2]}>
                  <boxGeometry args={[1.22, 0.04, 1.4]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.medicalBlue} roughness={0.5} />
                </mesh>
                {/* Pillow */}
                <mesh position={[0, 0.72, -0.8]}>
                  <boxGeometry args={[0.8, 0.12, 0.45]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
                </mesh>
                {/* Bed headboard frame */}
                <mesh position={[0, 0.82, -1.1]} castShadow>
                  <boxGeometry args={[1.26, 0.9, 0.08]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalSteel} metalness={0.7} />
                </mesh>
                {/* Safety side rails */}
                <mesh position={[-0.62, 0.7, 0]}>
                  <boxGeometry args={[0.04, 0.35, 1.5]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalSteel} metalness={0.8} />
                </mesh>
                <mesh position={[0.62, 0.7, 0]}>
                  <boxGeometry args={[0.04, 0.35, 1.5]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalSteel} metalness={0.8} />
                </mesh>

                {/* Patient actively curing/resting in bed */}
                <group position={[0, 0.48, 0.1]}>
                  <HumanoidMesh
                    role="patient"
                    isLying={true}
                    patientStatus={idx % 3 === 0 ? 'recovering' : 'curing'}
                    breathPhase={idx * 1.4}
                  />
                </group>
              </group>
            );

          case 'monitor':
            return (
              <group key={key} position={[p.x, p.y, p.z]} rotation={rot}>
                {/* Pole stand */}
                <mesh position={[0, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.04, 0.04, 1.6]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} metalness={0.8} />
                </mesh>
                {/* Screen housing */}
                <mesh position={[0, 0.8, 0]} castShadow>
                  <boxGeometry args={[0.5, 0.35, 0.08]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.8} />
                </mesh>
                {/* Glowing vitals screen */}
                <mesh position={[0, 0.8, 0.045]}>
                  <boxGeometry args={[0.44, 0.29, 0.01]} />
                  <meshStandardMaterial
                    color="#0F172A"
                    emissive="#10B981"
                    emissiveIntensity={0.6}
                  />
                </mesh>
              </group>
            );

          case 'iv_stand':
            return (
              <group key={key} position={[p.x, p.y, p.z]}>
                <mesh position={[0, 1.1, 0]} castShadow>
                  <cylinderGeometry args={[0.025, 0.025, 2.2]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalSteel} metalness={0.9} />
                </mesh>
                {/* Saline bag */}
                <mesh position={[0.15, 2.0, 0]}>
                  <boxGeometry args={[0.12, 0.22, 0.06]} />
                  <meshStandardMaterial color="#E0F2FE" transparent opacity={0.8} />
                </mesh>
              </group>
            );

          case 'ct_scanner':
          case 'mri_scanner':
            return (
              <group key={key} position={[p.x, p.y, p.z]} rotation={rot}>
                {/* Donut Gantry */}
                <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[1.8, 1.8, 1.2, 32, 1, false]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.2} />
                </mesh>
                {/* Inner bore tunnel hole */}
                <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.9, 0.9, 1.3, 24]} />
                  <meshStandardMaterial color="#2B3945" roughness={0.6} />
                </mesh>
                {/* Patient motorized couch table */}
                <mesh position={[0, 0.5, 1.6]} castShadow receiveShadow>
                  <boxGeometry args={[0.9, 0.6, 2.6]} />
                  <meshStandardMaterial color="#E8EEF5" roughness={0.4} />
                </mesh>
                {/* Medical Blue accent ring */}
                <mesh position={[0, 1.6, 0.62]}>
                  <ringGeometry args={[1.2, 1.35, 32]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.medicalBlue} roughness={0.3} />
                </mesh>
              </group>
            );

          case 'ot_table':
            return (
              <group key={key} position={[p.x, p.y, p.z]} rotation={rot}>
                {/* Heavy stainless steel base column */}
                <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.25, 0.35, 1.0, 16]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalSteel} metalness={0.9} roughness={0.2} />
                </mesh>
                {/* Surgical mattress bed pad */}
                <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.0, 0.15, 2.4]} />
                  <meshStandardMaterial color="#334155" roughness={0.5} />
                </mesh>
              </group>
            );

          case 'ot_lamp':
            return (
              <group key={key} position={[p.x, p.y + 3.2, p.z]}>
                {/* Ceiling mounting drop rod */}
                <mesh position={[0, 0.4, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.8]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalSteel} metalness={0.8} />
                </mesh>
                {/* Dual surgical cup dome lamps */}
                <mesh position={[-0.4, 0, 0]} castShadow>
                  <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                  <meshStandardMaterial color="#F8FAFC" metalness={0.6} roughness={0.2} />
                </mesh>
                <mesh position={[0.4, 0, 0]} castShadow>
                  <sphereGeometry args={[0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                  <meshStandardMaterial color="#F8FAFC" metalness={0.6} roughness={0.2} />
                </mesh>
                {/* Clean surgical white spotlight downward */}
                <pointLight position={[0, -0.3, 0]} color="#FFFFFF" intensity={1.8} distance={6} decay={2} />
              </group>
            );

          case 'lab_bench':
            return (
              <group key={key} position={[p.x, p.y, p.z]} rotation={rot}>
                <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                  <boxGeometry args={[3.2, 1.0, 1.1]} />
                  <meshStandardMaterial color="#E2E8F0" roughness={0.4} />
                </mesh>
                {/* Chemical resistant black epoxy top */}
                <mesh position={[0, 1.02, 0]} castShadow>
                  <boxGeometry args={[3.3, 0.06, 1.15]} />
                  <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.2} />
                </mesh>
                {/* Microscope shape on bench */}
                <mesh position={[0.6, 1.25, 0]} castShadow>
                  <boxGeometry args={[0.25, 0.4, 0.25]} />
                  <meshStandardMaterial color="#475569" metalness={0.7} />
                </mesh>
              </group>
            );

          case 'pharmacy_shelf':
            return (
              <group key={key} position={[p.x, p.y, p.z]} rotation={rot}>
                {/* Tall metal shelving unit */}
                <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
                  <boxGeometry args={[2.8, 2.8, 0.6]} />
                  <meshStandardMaterial color="#CBD5E1" roughness={0.5} />
                </mesh>
                {/* Medicine box packs on shelves */}
                {[-0.8, -0.2, 0.4, 0.9].map((sy, i) => (
                  <mesh key={`med-row-${i}`} position={[0, 1.4 + sy, 0.2]}>
                    <boxGeometry args={[2.6, 0.18, 0.25]} />
                    <meshStandardMaterial
                      color={i % 2 === 0 ? EXPLORE_TOKENS.colors.medicalBlue : EXPLORE_TOKENS.colors.emergencyRed}
                      roughness={0.4}
                    />
                  </mesh>
                ))}
              </group>
            );

          case 'desk':
            return (
              <group key={key} position={[p.x, p.y, p.z]} rotation={rot}>
                <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                  <boxGeometry args={[1.8, 0.9, 0.9]} />
                  <meshStandardMaterial color={p.color || EXPLORE_TOKENS.colors.woodWarm} roughness={0.6} />
                </mesh>
              </group>
            );

          case 'computer':
            return (
              <group key={key} position={[p.x, p.y, p.z]}>
                <mesh position={[0, 0.18, 0]} castShadow>
                  <boxGeometry args={[0.42, 0.28, 0.04]} />
                  <meshStandardMaterial color="#0F172A" />
                </mesh>
                {/* Screen face */}
                <mesh position={[0, 0.18, 0.022]}>
                  <boxGeometry args={[0.38, 0.24, 0.005]} />
                  <meshStandardMaterial color="#0284C7" emissive="#0284C7" emissiveIntensity={0.5} />
                </mesh>
                {/* Keyboard */}
                <mesh position={[0, 0.02, 0.2]}>
                  <boxGeometry args={[0.36, 0.02, 0.14]} />
                  <meshStandardMaterial color="#475569" />
                </mesh>
              </group>
            );

          case 'chair':
            return (
              <group key={key} position={[p.x, p.y, p.z]} rotation={rot}>
                <mesh position={[0, 0.3, 0]} castShadow>
                  <cylinderGeometry args={[0.04, 0.04, 0.6]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} />
                </mesh>
                <mesh position={[0, 0.55, 0]} castShadow>
                  <boxGeometry args={[0.55, 0.08, 0.55]} />
                  <meshStandardMaterial color="#334155" roughness={0.6} />
                </mesh>
                <mesh position={[0, 0.85, -0.24]} castShadow>
                  <boxGeometry args={[0.55, 0.55, 0.08]} />
                  <meshStandardMaterial color="#334155" roughness={0.6} />
                </mesh>
              </group>
            );

          case 'sofa':
            return (
              <group key={key} position={[p.x, p.y, p.z]} rotation={rot}>
                <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
                  <boxGeometry args={[2.2, 0.6, 0.9]} />
                  <meshStandardMaterial color="#475569" roughness={0.7} />
                </mesh>
                <mesh position={[0, 0.75, -0.35]} castShadow>
                  <boxGeometry args={[2.2, 0.6, 0.3]} />
                  <meshStandardMaterial color="#475569" roughness={0.7} />
                </mesh>
              </group>
            );

          case 'cafeteria_table':
            return (
              <group key={key} position={[p.x, p.y, p.z]} rotation={rot}>
                <mesh position={[0, 0.45, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.08, 0.9]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.metalDark} />
                </mesh>
                <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.9, 0.9, 0.06, 24]} />
                  <meshStandardMaterial color="#F1F5F9" roughness={0.3} />
                </mesh>
              </group>
            );

          case 'plant':
            return (
              <group key={key} position={[p.x, p.y, p.z]}>
                <mesh position={[0, 0.3, 0]} castShadow>
                  <cylinderGeometry args={[0.3, 0.22, 0.6, 12]} />
                  <meshStandardMaterial color="#D9D6CE" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.8, 0]} castShadow>
                  <sphereGeometry args={[0.45, 8, 8]} />
                  <meshStandardMaterial color={EXPLORE_TOKENS.colors.grassDeep} roughness={0.7} />
                </mesh>
              </group>
            );

          default:
            return null;
        }
      })}
    </group>
  );
}
