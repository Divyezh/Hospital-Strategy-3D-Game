'use client';

import React from 'react';
import * as THREE from 'three';
import { CONFIG } from '@/data/config';
import { ToyTree, ToyBench } from './Campus';

// Reusable hospital window grid
function WindowGrid({
  width,
  height,
  rows,
  cols,
  position,
  rotation = [0, 0, 0],
}: {
  width: number;
  height: number;
  rows: number;
  cols: number;
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const cellW = (width * 0.8) / cols;
  const cellH = (height * 0.75) / rows;

  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const x = -width * 0.4 + (c + 0.5) * cellW;
          const y = -height * 0.35 + (r + 0.5) * cellH;
          return (
            <mesh key={`${r}-${c}`} position={[x, y, 0.05]} castShadow>
              <boxGeometry args={[cellW * 0.75, cellH * 0.7, 0.04]} />
              <meshStandardMaterial color={CONFIG.colors.glassWindow} roughness={0.2} metalness={0.8} />
            </mesh>
          );
        })
      )}
    </group>
  );
}

// Low-poly toy parked car
function ParkedCar({
  position,
  rotation = 0,
  color = '#3B82F6',
}: {
  position: [number, number, number];
  rotation?: number;
  color?: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Lower chassis */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.8, 0.5, 3.4]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.85, -0.2]} castShadow>
        <boxGeometry args={[1.5, 0.5, 1.9]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
      </mesh>
      {/* Windshields */}
      <mesh position={[0, 0.85, 0.8]}>
        <boxGeometry args={[1.4, 0.4, 0.1]} />
        <meshStandardMaterial color="#93C5FD" roughness={0.1} />
      </mesh>
      {/* Wheels */}
      {[-0.9, 0.9].map((wx, i) =>
        [-1.0, 1.0].map((wz, j) => (
          <mesh key={`${i}-${j}`} position={[wx, 0.25, wz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.22, 10]} />
            <meshStandardMaterial color="#1E293B" roughness={0.8} />
          </mesh>
        ))
      )}
    </group>
  );
}

// =========================================================================
// SITE MC-01: CITY GENERAL HOSPITAL
// Multi-wing blue-roofed hospital, main entrance, garden, parking
// =========================================================================
export function SiteMC01({ center }: { center: [number, number, number] }) {
  const [cx, , cz] = center;

  return (
    <group position={[cx, 0, cz]} name="site-mc-01-buildings">
      {/* Central 3-Storey Pavilion */}
      <mesh position={[0, 5, -8]} castShadow receiveShadow>
        <boxGeometry args={[14, 10, 12]} />
        <meshStandardMaterial color={CONFIG.colors.buildingWall} roughness={0.85} />
      </mesh>
      {/* Royal blue pitched roof */}
      <mesh position={[0, 11, -8]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 8.5, 12.4, 4]} />
        <meshStandardMaterial color={CONFIG.colors.buildingRoof} roughness={0.4} />
      </mesh>
      {/* Roof trim cap */}
      <mesh position={[0, 10.1, -8]} castShadow>
        <boxGeometry args={[14.6, 0.4, 12.6]} />
        <meshStandardMaterial color={CONFIG.colors.buildingTrim} roughness={0.5} />
      </mesh>
      {/* Windows on front face */}
      <WindowGrid width={12} height={7} rows={3} cols={4} position={[0, 6, -1.95]} />

      {/* Main Entrance Portico & Canopy */}
      <group position={[0, 0, -1.8]}>
        {/* Entrance steps */}
        <mesh position={[0, 0.2, 1.2]} receiveShadow>
          <boxGeometry args={[6.5, 0.4, 2.5]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.6} />
        </mesh>
        {/* Round entrance pillars */}
        {[-2.2, 2.2].map((px, i) => (
          <mesh key={i} position={[px, 1.8, 2.2]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 3.2, 12]} />
            <meshStandardMaterial color={CONFIG.colors.buildingTrim} roughness={0.5} />
          </mesh>
        ))}
        {/* Translucent glass canopy */}
        <mesh position={[0, 3.4, 2]} castShadow>
          <boxGeometry args={[6, 0.25, 3.2]} />
          <meshStandardMaterial color={CONFIG.colors.glassCanopy} roughness={0.2} transparent opacity={0.85} />
        </mesh>
        {/* Sliding double glass doors */}
        <mesh position={[0, 1.4, -0.05]}>
          <boxGeometry args={[3, 2.4, 0.1]} />
          <meshStandardMaterial color="#60A5FA" roughness={0.1} />
        </mesh>
        {/* Blue door frame */}
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[3.4, 2.6, 0.08]} />
          <meshStandardMaterial color={CONFIG.colors.buildingTrim} />
        </mesh>
      </group>

      {/* East Inpatient Wing (2 Storeys) */}
      <group position={[12, 0, -8]}>
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 7, 10]} />
          <meshStandardMaterial color={CONFIG.colors.buildingWall} roughness={0.85} />
        </mesh>
        {/* Pitched blue roof */}
        <mesh position={[0, 7.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <cylinderGeometry args={[0.2, 6.2, 10.4, 4]} />
          <meshStandardMaterial color={CONFIG.colors.buildingRoof} roughness={0.4} />
        </mesh>
        <WindowGrid width={8} height={5} rows={2} cols={3} position={[0, 4, 5.05]} />
      </group>

      {/* West Emergency Wing (2 Storeys with ambulance intake) */}
      <group position={[-12, 0, -8]}>
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 7, 10]} />
          <meshStandardMaterial color={CONFIG.colors.buildingWall} roughness={0.85} />
        </mesh>
        <mesh position={[0, 7.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <cylinderGeometry args={[0.2, 6.2, 10.4, 4]} />
          <meshStandardMaterial color={CONFIG.colors.buildingRoof} roughness={0.4} />
        </mesh>
        <WindowGrid width={8} height={5} rows={2} cols={3} position={[0, 4, 5.05]} />

        {/* 2 Ambulance Bay Arches on West wing */}
        {[-2.5, 2.5].map((bx, i) => (
          <group key={i} position={[bx, 0, 5.1]}>
            <mesh position={[0, 2.1, 0]}>
              <boxGeometry args={[3.2, 3.6, 0.15]} />
              <meshStandardMaterial color={CONFIG.colors.buildingTrim} />
            </mesh>
            {/* Shutter door */}
            <mesh position={[0, 1.8, 0.08]}>
              <boxGeometry args={[2.7, 3.2, 0.05]} />
              <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Main Entrance Garden Plaza (South of main pavilion) */}
      <group position={[0, 0, 10]}>
        {/* Green lawn pad with beveled grass */}
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[22, 14]} />
          <meshStandardMaterial color={CONFIG.colors.grass} roughness={0.9} />
        </mesh>
        {/* Center Fountain / Planter */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[2.6, 2.8, 0.6, 24]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[2.3, 2.3, 0.1, 24]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.1} />
        </mesh>
        {/* Walking paths */}
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.5, 14]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[22, 3.5]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
        </mesh>
        {/* Trees in garden corners */}
        <ToyTree position={[-7.5, 0, -4]} scale={1.1} />
        <ToyTree position={[7.5, 0, -4]} scale={1.1} />
        <ToyTree position={[-7.5, 0, 4]} scale={1.1} />
        <ToyTree position={[7.5, 0, 4]} scale={1.1} />
        {/* Park benches */}
        <ToyBench position={[-4, 0, -1.8]} rotation={Math.PI / 2} />
        <ToyBench position={[4, 0, -1.8]} rotation={-Math.PI / 2} />
        <ToyBench position={[-4, 0, 1.8]} rotation={Math.PI / 2} />
        <ToyBench position={[4, 0, 1.8]} rotation={-Math.PI / 2} />
      </group>

      {/* Visitor / Staff Parking Lot (West area) */}
      <group position={[-16, 0, 12]}>
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 10]} />
          <meshStandardMaterial color="#64748B" roughness={0.8} />
        </mesh>
        {/* Parked toy cars */}
        <ParkedCar position={[-3.5, 0, -2]} rotation={0} color="#2563EB" />
        <ParkedCar position={[0, 0, -2]} rotation={0} color="#EF4444" />
        <ParkedCar position={[3.5, 0, -2]} rotation={0} color="#10B981" />
        <ParkedCar position={[-3.5, 0, 2.5]} rotation={Math.PI} color="#F59E0B" />
        <ParkedCar position={[3.5, 0, 2.5]} rotation={Math.PI} color="#8B5CF6" />
      </group>

      {/* Small Administrative Annex Shed (East area) */}
      <group position={[16, 0, 11]}>
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[7, 4, 6]} />
          <meshStandardMaterial color={CONFIG.colors.buildingWall} roughness={0.85} />
        </mesh>
        <mesh position={[0, 4.2, 0]} castShadow>
          <boxGeometry args={[7.4, 0.4, 6.4]} />
          <meshStandardMaterial color={CONFIG.colors.buildingTrim} roughness={0.4} />
        </mesh>
        <ToyTree position={[4.5, 0, 0]} scale={0.9} />
      </group>
    </group>
  );
}

// =========================================================================
// SITE MC-02: RIVERSIDE TRAUMA CENTER
// ER-heavy, helipad, 4 ambulance bays, lots of ambulances
// =========================================================================
export function SiteMC02({ center }: { center: [number, number, number] }) {
  const [cx, , cz] = center;

  return (
    <group position={[cx, 0, cz]} name="site-mc-02-buildings">
      {/* Main ER / Trauma Core Building */}
      <mesh position={[0, 6, -10]} castShadow receiveShadow>
        <boxGeometry args={[26, 12, 14]} />
        <meshStandardMaterial color={CONFIG.colors.buildingWall} roughness={0.85} />
      </mesh>
      {/* Red & Blue Trauma accent fascia bands */}
      <mesh position={[0, 11.6, -10]} castShadow>
        <boxGeometry args={[26.4, 0.6, 14.4]} />
        <meshStandardMaterial color={CONFIG.colors.buildingTrim} />
      </mesh>
      <mesh position={[0, 12.1, -10]} castShadow>
        <boxGeometry args={[26.6, 0.3, 14.6]} />
        <meshStandardMaterial color="#DC2626" />
      </mesh>
      {/* Window grid along upper floors */}
      <WindowGrid width={24} height={6} rows={2} cols={6} position={[0, 7.5, -2.95]} />

      {/* 4 Ambulance Bays along front wall (Z = -2.9) */}
      <group position={[0, 0, -2.8]}>
        {[-9, -3, 3, 9].map((bx, i) => (
          <group key={i} position={[bx, 0, 0]}>
            {/* Bay portal arch */}
            <mesh position={[0, 2.5, 0.1]} castShadow>
              <boxGeometry args={[4.4, 4.6, 0.4]} />
              <meshStandardMaterial color={CONFIG.colors.buildingTrim} />
            </mesh>
            {/* Shutter door */}
            <mesh position={[0, 2.2, 0.25]}>
              <boxGeometry args={[3.8, 4.0, 0.05]} />
              <meshStandardMaterial color="#334155" roughness={0.5} />
            </mesh>
            {/* Bay ID badge pill above door */}
            <mesh position={[0, 4.7, 0.35]}>
              <boxGeometry args={[1.4, 0.5, 0.1]} />
              <meshStandardMaterial color="#EF4444" />
            </mesh>
            {/* Flashing/status beacon */}
            <mesh position={[0, 5.15, 0.35]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial color="#F59E0B" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Prominent Emergency Resuscitation Canopy */}
      <mesh position={[0, 4.8, 1.5]} castShadow>
        <boxGeometry args={[25, 0.35, 5]} />
        <meshStandardMaterial color={CONFIG.colors.glassCanopy} transparent opacity={0.8} />
      </mesh>
      {/* Support steel struts */}
      {[-12, -4, 4, 12].map((sx, i) => (
        <mesh key={i} position={[sx, 2.4, 3.8]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 4.8, 8]} />
          <meshStandardMaterial color={CONFIG.colors.buildingTrim} />
        </mesh>
      ))}

      {/* ACTIVE HELIPAD at Riverside Trauma Center */}
      <group position={[14, 0, 12]} name="helipad-complex">
        {/* Raised concrete octagonal pad */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[8.5, 8.8, 0.5, 16]} />
          <meshStandardMaterial color={CONFIG.colors.helipadPad} roughness={0.7} />
        </mesh>
        {/* Yellow outer warning ring */}
        <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6.8, 7.4, 32]} />
          <meshBasicMaterial color={CONFIG.colors.helipadLine} />
        </mesh>
        {/* Bold White/Red 'H' Helipad marking */}
        <group position={[0, 0.53, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Left leg of H */}
          <mesh position={[-1.8, 0, 0]}>
            <planeGeometry args={[0.9, 5.0]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          {/* Right leg of H */}
          <mesh position={[1.8, 0, 0]}>
            <planeGeometry args={[0.9, 5.0]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          {/* Crossbar of H */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2.8, 0.9]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
        {/* Helipad corner LED beacon posts */}
        {[
          [-6.5, -6.5],
          [6.5, -6.5],
          [-6.5, 6.5],
          [6.5, 6.5],
        ].map(([bx, bz], i) => (
          <group key={i} position={[bx, 0.3, bz]}>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.8, 6]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[0, 0.85, 0]}>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshBasicMaterial color={i % 2 === 0 ? CONFIG.colors.beaconRed : CONFIG.colors.beaconGreen} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Oxygen Tank Farm & Power Storage Annex (West area) */}
      <group position={[-15, 0, 10]}>
        {/* Safety concrete slab */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[9, 0.2, 8]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.7} />
        </mesh>
        {/* 3 Large Oxygen storage tanks */}
        {[-2.5, 0, 2.5].map((tx, i) => (
          <group key={i} position={[tx, 0.2, 0]}>
            <mesh position={[0, 2.2, 0]} castShadow>
              <cylinderGeometry args={[1.0, 1.0, 4.0, 16]} />
              <meshStandardMaterial color="#E0F2FE" roughness={0.3} metalness={0.4} />
            </mesh>
            {/* Top rounded dome */}
            <mesh position={[0, 4.2, 0]} castShadow>
              <sphereGeometry args={[1.0, 16, 16]} />
              <meshStandardMaterial color={CONFIG.colors.buildingTrim} roughness={0.4} />
            </mesh>
          </group>
        ))}
        {/* Safety perimeter bollards */}
        {[-4.2, 4.2].map((bx, i) =>
          [-3.6, 3.6].map((bz, j) => (
            <mesh key={`${i}-${j}`} position={[bx, 0.5, bz]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.9, 6]} />
              <meshStandardMaterial color="#FBBF24" />
            </mesh>
          ))
        )}
      </group>

      {/* Green patches & landscaping */}
      <ToyTree position={[-18, 0, -4]} scale={1.2} />
      <ToyTree position={[18, 0, -4]} scale={1.2} />
      <ToyTree position={[-18, 0, cz + 6]} scale={1.0} />
    </group>
  );
}

// =========================================================================
// SITE MC-03: EASTPORT DIAGNOSTICS & IMAGING
// Flat roof with rooftop AC units, MRI trailer, lab wing
// =========================================================================
export function SiteMC03({ center }: { center: [number, number, number] }) {
  const [cx, , cz] = center;

  return (
    <group position={[cx, 0, cz]} name="site-mc-03-buildings">
      {/* Main Diagnostic Imaging Building with FLAT ROOF */}
      <mesh position={[0, 4.5, -8]} castShadow receiveShadow>
        <boxGeometry args={[22, 9, 14]} />
        <meshStandardMaterial color={CONFIG.colors.buildingWall} roughness={0.85} />
      </mesh>
      {/* Flat roof parapet surround in royal blue */}
      <mesh position={[0, 9.3, -8]} castShadow>
        <boxGeometry args={[22.5, 0.7, 14.5]} />
        <meshStandardMaterial color={CONFIG.colors.buildingTrim} roughness={0.4} />
      </mesh>
      <mesh position={[0, 9.05, -8]}>
        <boxGeometry args={[21.8, 0.2, 13.8]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>

      {/* ROOFTOP INDUSTRIAL AC UNITS & CHILLERS per spec */}
      <group position={[0, 9.5, -8]}>
        {[
          [-6.5, -3.5],
          [-1.5, -3.5],
          [4.5, -3.5],
          [-4.5, 3.0],
          [2.0, 3.0],
        ].map(([ax, az], i) => (
          <group key={i} position={[ax, 0, az]}>
            {/* Chiller box */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <boxGeometry args={[2.4, 1.4, 1.8]} />
              <meshStandardMaterial color="#94A3B8" roughness={0.5} metalness={0.5} />
            </mesh>
            {/* Top fan grille */}
            <mesh position={[0, 1.42, 0]}>
              <cylinderGeometry args={[0.65, 0.65, 0.06, 16]} />
              <meshStandardMaterial color="#334155" roughness={0.3} />
            </mesh>
            {/* Conduits & pipes */}
            <mesh position={[1.3, 0.5, 0]}>
              <boxGeometry args={[0.2, 0.6, 1.2]} />
              <meshStandardMaterial color="#CBD5E1" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Horizontal ribbon windows */}
      <WindowGrid width={19} height={5.5} rows={2} cols={5} position={[0, 5, -0.95]} />

      {/* Advanced Automated Pathology Lab Wing (East) */}
      <group position={[14, 0, -8]}>
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 7, 10]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.85} />
        </mesh>
        <mesh position={[0, 7.2, 0]} castShadow>
          <boxGeometry args={[8.4, 0.5, 10.4]} />
          <meshStandardMaterial color="#0D9488" roughness={0.4} />
        </mesh>
        <WindowGrid width={6.5} height={4} rows={2} cols={2} position={[0, 4, 5.05]} />
      </group>

      {/* MOBILE MRI TRAILER UNIT parked outside per spec */}
      <group position={[-14, 0, 6]} name="mri-trailer-unit">
        {/* Dedicated concrete pad */}
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <boxGeometry args={[6.5, 0.16, 12]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.7} />
        </mesh>
        {/* Trailer body */}
        <mesh position={[0, 2.1, 0]} castShadow>
          <boxGeometry args={[3.2, 3.2, 8.8]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        {/* Royal blue branding stripe */}
        <mesh position={[0, 2.1, 0]}>
          <boxGeometry args={[3.25, 0.65, 8.85]} />
          <meshStandardMaterial color={CONFIG.colors.buildingTrim} />
        </mesh>
        {/* Rooftop AC on trailer */}
        <mesh position={[0, 3.9, 1.5]} castShadow>
          <boxGeometry args={[1.4, 0.5, 1.4]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        {/* Rear intake door & stairs */}
        <mesh position={[0, 1.8, -4.45]}>
          <boxGeometry args={[1.4, 2.2, 0.1]} />
          <meshStandardMaterial color={CONFIG.colors.buildingTrim} />
        </mesh>
        {/* Trailer wheels */}
        {[-1.6, 1.6].map((wx, i) =>
          [-2.2, -0.8].map((wz, j) => (
            <mesh key={`${i}-${j}`} position={[wx, 0.45, wz]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.42, 0.42, 0.28, 12]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
          ))
        )}
        {/* Heavy yellow utility umbilical power cable leading to hospital wall */}
        <mesh position={[1.8, 0.15, -1.5]} rotation={[0, 0.3, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 3.8, 8]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.5} />
        </mesh>
      </group>

      {/* 2 Diagnostic Intake Bays */}
      <group position={[0, 0, -0.9]}>
        {[-4, 4].map((bx, i) => (
          <group key={i} position={[bx, 0, 0]}>
            <mesh position={[0, 2.1, 0.1]} castShadow>
              <boxGeometry args={[3.6, 4.0, 0.2]} />
              <meshStandardMaterial color={CONFIG.colors.buildingTrim} />
            </mesh>
            <mesh position={[0, 1.8, 0.22]}>
              <boxGeometry args={[3.0, 3.4, 0.05]} />
              <meshStandardMaterial color="#334155" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Landscaping */}
      <ToyTree position={[8, 0, 9]} scale={1.1} />
      <ToyTree position={[13, 0, 9]} scale={1.1} />
      <ToyBench position={[10.5, 0, 6.5]} rotation={0} />
    </group>
  );
}

// =========================================================================
// SITE MC-04: SOUTHFIELD DAY-CARE CENTER
// Sawtooth blue roof, 6 bays along one long wall, courtyard
// =========================================================================
export function SiteMC04({ center }: { center: [number, number, number] }) {
  const [cx, , cz] = center;

  return (
    <group position={[cx, 0, cz]} name="site-mc-04-buildings">
      {/* Main Day-Care Building Core */}
      <mesh position={[0, 4, -4]} castShadow receiveShadow>
        <boxGeometry args={[34, 8, 16]} />
        <meshStandardMaterial color={CONFIG.colors.buildingWall} roughness={0.85} />
      </mesh>

      {/* DISTINCTIVE SAWTOOTH BLUE ROOF (5 triangular sawtooth ridges) per spec */}
      <group position={[0, 8, -4]}>
        {[-13, -6.5, 0, 6.5, 13].map((rx, i) => (
          <group key={i} position={[rx, 0, 0]}>
            {/* Angled royal blue roof face */}
            <mesh position={[1.4, 1.4, 0]} rotation={[0, 0, -Math.PI / 5]} castShadow>
              <boxGeometry args={[5.2, 0.35, 16.2]} />
              <meshStandardMaterial color={CONFIG.colors.buildingRoof} roughness={0.4} />
            </mesh>
            {/* Vertical skylight clerestory facet */}
            <mesh position={[-1.2, 1.3, 0]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.2, 2.5, 15.8]} />
              <meshStandardMaterial color={CONFIG.colors.glassWindow} roughness={0.1} metalness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6 AMBULANCE BAYS ALONG ONE LONG WALL (Z = 4.1) per spec */}
      <group position={[0, 0, 4.1]}>
        {[-13.5, -8.1, -2.7, 2.7, 8.1, 13.5].map((bx, i) => (
          <group key={i} position={[bx, 0, 0]}>
            {/* Bay frame in royal blue */}
            <mesh position={[0, 2.2, 0.15]} castShadow>
              <boxGeometry args={[4.2, 4.2, 0.3]} />
              <meshStandardMaterial color={CONFIG.colors.buildingTrim} />
            </mesh>
            {/* Shutter door */}
            <mesh position={[0, 1.9, 0.3]}>
              <boxGeometry args={[3.6, 3.6, 0.05]} />
              <meshStandardMaterial color="#334155" roughness={0.5} />
            </mesh>
            {/* Bay slot number badge */}
            <mesh position={[0, 4.4, 0.35]}>
              <boxGeometry args={[1.2, 0.45, 0.1]} />
              <meshStandardMaterial color="#2563EB" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Continuous Ambulance Portico Canopy along all 6 bays */}
      <mesh position={[0, 4.6, 7.5]} castShadow>
        <boxGeometry args={[33, 0.3, 5]} />
        <meshStandardMaterial color={CONFIG.colors.glassCanopy} transparent opacity={0.8} />
      </mesh>
      {/* Canopy support columns */}
      {[-15.5, -9.5, -3.5, 3.5, 9.5, 15.5].map((cxCol, i) => (
        <mesh key={i} position={[cxCol, 2.3, 9.8]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 4.6, 8]} />
          <meshStandardMaterial color={CONFIG.colors.buildingTrim} />
        </mesh>
      ))}

      {/* Central Healing Courtyard Garden (North of the main hall) */}
      <group position={[0, 0, -18]}>
        {/* Courtyard lawn pad */}
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 10]} />
          <meshStandardMaterial color={CONFIG.colors.grass} roughness={0.9} />
        </mesh>
        {/* Centerpiece majestic toy tree */}
        <ToyTree position={[0, 0, 0]} scale={1.5} />
        {/* Stepping stone paths & benches */}
        <ToyBench position={[-4.5, 0, 0]} rotation={Math.PI / 2} />
        <ToyBench position={[4.5, 0, 0]} rotation={-Math.PI / 2} />
        <ToyBench position={[0, 0, 3.5]} rotation={0} />
      </group>

      {/* Day-Care Rehabilitation Pavilion */}
      <group position={[0, 0, -26]}>
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[18, 5, 6]} />
          <meshStandardMaterial color={CONFIG.colors.buildingWall} roughness={0.85} />
        </mesh>
        <mesh position={[0, 5.2, 0]} castShadow>
          <boxGeometry args={[18.4, 0.4, 6.4]} />
          <meshStandardMaterial color={CONFIG.colors.buildingTrim} roughness={0.4} />
        </mesh>
        <WindowGrid width={15} height={3.5} rows={1} cols={4} position={[0, 2.8, 3.05]} />
      </group>
    </group>
  );
}

// Central Pharmacy Depot near crossroads
export function PharmacyDepot({ position }: { position: [number, number, number] }) {
  const [px, py, pz] = position;

  return (
    <group position={[px, py, pz]} name="central-pharmacy-depot">
      {/* Concrete foundation pad */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[14, 0.16, 12]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
      </mesh>

      {/* Main Depot Warehouse */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 7, 10]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.8} />
      </mesh>

      {/* Teal fascia trim */}
      <mesh position={[0, 7.2, 0]} castShadow>
        <boxGeometry args={[12.4, 0.5, 10.4]} />
        <meshStandardMaterial color="#0D9488" roughness={0.4} />
      </mesh>

      {/* Loading Bay Shutter & Dock Port */}
      <group position={[0, 0, 5.1]}>
        <mesh position={[0, 2.2, 0]} castShadow>
          <boxGeometry args={[4.4, 4.2, 0.2]} />
          <meshStandardMaterial color="#0D9488" />
        </mesh>
        <mesh position={[0, 1.9, 0.12]}>
          <boxGeometry args={[3.8, 3.6, 0.05]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        {/* "PHARMACY DEPOT" badge */}
        <mesh position={[0, 4.4, 0.2]}>
          <boxGeometry args={[3.2, 0.5, 0.08]} />
          <meshStandardMaterial color="#0D9488" />
        </mesh>
      </group>

      {/* Storage Silos / Nitrogen & Cold tanks */}
      {[-4.5, 4.5].map((sx, i) => (
        <group key={i} position={[sx, 0, -3]}>
          <mesh position={[0, 3.0, 0]} castShadow>
            <cylinderGeometry args={[0.9, 0.9, 6.0, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Master Buildings Assembler for all 4 sites + Central Pharmacy Depot
export function Buildings() {
  return (
    <group name="campus-buildings">
      {/* MC-01: City General */}
      <SiteMC01 center={[-42, 0, -42]} />

      {/* MC-02: Riverside Trauma Center */}
      <SiteMC02 center={[42, 0, -42]} />

      {/* MC-03: Eastport Diagnostics & Imaging */}
      <SiteMC03 center={[-42, 0, 42]} />

      {/* MC-04: Southfield Day-Care Center */}
      <SiteMC04 center={[42, 0, 42]} />

      {/* Central Pharmacy Depot */}
      <PharmacyDepot position={[-18, 0, -14]} />
    </group>
  );
}
