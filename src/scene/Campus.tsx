'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CONFIG } from '@/data/config';
import { SITES } from '@/data/sites';

// Reusable toy-like tree component
export function ToyTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.32, 2.2, 8]} />
        <meshStandardMaterial color={CONFIG.colors.treeTrunk} roughness={0.9} />
      </mesh>
      {/* Foliage: stacked rounded clusters */}
      <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.3, 12, 12]} />
        <meshStandardMaterial color={CONFIG.colors.treeFoliage} roughness={0.6} />
      </mesh>
      <mesh position={[0.4, 3.2, 0.2]} castShadow receiveShadow>
        <sphereGeometry args={[0.9, 10, 10]} />
        <meshStandardMaterial color={CONFIG.colors.treeFoliageAlt} roughness={0.6} />
      </mesh>
    </group>
  );
}

// Park bench component
export function ToyBench({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Seat slat */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.1, 0.45]} />
        <meshStandardMaterial color="#B45309" roughness={0.7} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.65, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.35, 0.08]} />
        <meshStandardMaterial color="#B45309" roughness={0.7} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.55, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.4, 0.4]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      <mesh position={[0.55, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.4, 0.4]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
    </group>
  );
}

// Perimeter fence section
function SitePerimeterFence({
  minX,
  maxX,
  minZ,
  maxZ,
  gateOpenings = [],
}: {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  gateOpenings?: { side: 'N' | 'S' | 'E' | 'W'; start: number; end: number }[];
}) {
  const posts = useMemo(() => {
    const pts: [number, number, number][] = [];
    const spacing = 3.5;

    // North side (minZ)
    for (let x = minX; x <= maxX; x += spacing) {
      const inGate = gateOpenings.some((g) => g.side === 'N' && x >= g.start && x <= g.end);
      if (!inGate) pts.push([x, 0.6, minZ]);
    }
    // South side (maxZ)
    for (let x = minX; x <= maxX; x += spacing) {
      const inGate = gateOpenings.some((g) => g.side === 'S' && x >= g.start && x <= g.end);
      if (!inGate) pts.push([x, 0.6, maxZ]);
    }
    // West side (minX)
    for (let z = minZ + spacing; z < maxZ; z += spacing) {
      const inGate = gateOpenings.some((g) => g.side === 'W' && z >= g.start && z <= g.end);
      if (!inGate) pts.push([minX, 0.6, z]);
    }
    // East side (maxX)
    for (let z = minZ + spacing; z < maxZ; z += spacing) {
      const inGate = gateOpenings.some((g) => g.side === 'E' && z >= g.start && z <= g.end);
      if (!inGate) pts.push([maxX, 0.6, z]);
    }
    return pts;
  }, [minX, maxX, minZ, maxZ, gateOpenings]);

  return (
    <group>
      {posts.map((pt, i) => (
        <group key={i} position={pt}>
          {/* Post */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.1, 0.1, 1.2, 6]} />
            <meshStandardMaterial color={CONFIG.colors.fencePost} roughness={0.6} metalness={0.2} />
          </mesh>
          {/* Post cap */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <sphereGeometry args={[0.14, 6, 6]} />
            <meshStandardMaterial color={CONFIG.colors.fencePost} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Horizontal rail lines along sides */}
      {/* North */}
      <mesh position={[(minX + maxX) / 2, 0.8, minZ]} castShadow>
        <boxGeometry args={[maxX - minX, 0.08, 0.08]} />
        <meshStandardMaterial color={CONFIG.colors.fenceRail} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[(minX + maxX) / 2, 0.4, minZ]} castShadow>
        <boxGeometry args={[maxX - minX, 0.08, 0.08]} />
        <meshStandardMaterial color={CONFIG.colors.fenceRail} roughness={0.5} metalness={0.3} />
      </mesh>

      {/* South */}
      <mesh position={[(minX + maxX) / 2, 0.8, maxZ]} castShadow>
        <boxGeometry args={[maxX - minX, 0.08, 0.08]} />
        <meshStandardMaterial color={CONFIG.colors.fenceRail} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[(minX + maxX) / 2, 0.4, maxZ]} castShadow>
        <boxGeometry args={[maxX - minX, 0.08, 0.08]} />
        <meshStandardMaterial color={CONFIG.colors.fenceRail} roughness={0.5} metalness={0.3} />
      </mesh>

      {/* West */}
      <mesh position={[minX, 0.8, (minZ + maxZ) / 2]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[maxZ - minZ, 0.08, 0.08]} />
        <meshStandardMaterial color={CONFIG.colors.fenceRail} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[minX, 0.4, (minZ + maxZ) / 2]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[maxZ - minZ, 0.08, 0.08]} />
        <meshStandardMaterial color={CONFIG.colors.fenceRail} roughness={0.5} metalness={0.3} />
      </mesh>

      {/* East */}
      <mesh position={[maxX, 0.8, (minZ + maxZ) / 2]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[maxZ - minZ, 0.08, 0.08]} />
        <meshStandardMaterial color={CONFIG.colors.fenceRail} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[maxX, 0.4, (minZ + maxZ) / 2]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[maxZ - minZ, 0.08, 0.08]} />
        <meshStandardMaterial color={CONFIG.colors.fenceRail} roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

// Dashed road lane lines
function DashedLine({
  start,
  end,
  color = '#FFFFFF',
  dashLen = 2.0,
  gapLen = 1.5,
  width = 0.35,
}: {
  start: [number, number];
  end: [number, number];
  color?: string;
  dashLen?: number;
  gapLen?: number;
  width?: number;
}) {
  const dashes = useMemo(() => {
    const dx = end[0] - start[0];
    const dz = end[1] - start[1];
    const totalDist = Math.hypot(dx, dz);
    const angle = Math.atan2(dx, dz);
    const step = dashLen + gapLen;
    const count = Math.floor(totalDist / step);
    const items: { pos: [number, number, number]; len: number }[] = [];

    const normX = dx / totalDist;
    const normZ = dz / totalDist;

    for (let i = 0; i < count; i++) {
      const dist = i * step + dashLen / 2;
      items.push({
        pos: [start[0] + normX * dist, 0.035, start[1] + normZ * dist],
        len: dashLen,
      });
    }
    return { items, angle };
  }, [start, end, dashLen, gapLen]);

  return (
    <group>
      {dashes.items.map((d, i) => (
        <mesh key={i} position={d.pos} rotation={[-Math.PI / 2, 0, dashes.angle]} receiveShadow>
          <planeGeometry args={[width, d.len]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

// Yellow dashed ambulance-slot rectangles in front of bays
export function AmbulanceSlotRectangle({
  position,
  rotation = 0,
  width = 3.6,
  length = 6.4,
  label,
}: {
  position: [number, number, number];
  rotation?: number;
  width?: number;
  length?: number;
  label?: string;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Outer yellow border box */}
      <mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshBasicMaterial color="#FEF08A" opacity={0.12} transparent />
      </mesh>

      {/* Yellow dashed borders */}
      {/* Front */}
      <mesh position={[0, 0.035, length / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, 0.22]} />
        <meshBasicMaterial color={CONFIG.colors.roadLineYellow} />
      </mesh>
      {/* Left */}
      <mesh position={[-width / 2, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.22, length]} />
        <meshBasicMaterial color={CONFIG.colors.roadLineYellow} />
      </mesh>
      {/* Right */}
      <mesh position={[width / 2, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.22, length]} />
        <meshBasicMaterial color={CONFIG.colors.roadLineYellow} />
      </mesh>

      {/* Optional slot number dot */}
      {label && (
        <mesh position={[0, 0.036, length / 2 - 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.35, 16]} />
          <meshBasicMaterial color={CONFIG.colors.accentRoyalBlue} />
        </mesh>
      )}
    </group>
  );
}

export function Campus() {
  return (
    <group name="campus-world">
      {/* Big shared ground plane: very light lavender-blue (#E6EBFA) per spec */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color={CONFIG.colors.ground} roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Subtle darker lavender contour border ring */}
      <mesh position={[0, -0.045, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[115, 128, 64]} />
        <meshStandardMaterial color={CONFIG.colors.groundGradient} roughness={0.95} />
      </mesh>

      {/* ========================================================
          INTER-SITE ARTERIAL HIGHWAY NETWORK
          Connects the 4 sites (~80x80 apart) across the central axes
          ======================================================== */}
      {/* North-South Central Expressway (Z-axis, X=0) */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 210]} />
        <meshStandardMaterial color={CONFIG.colors.road} roughness={0.85} />
      </mesh>
      {/* White dashed centerline */}
      <DashedLine start={[0, -100]} end={[0, 100]} dashLen={2.8} gapLen={1.8} />

      {/* East-West Central Expressway (X-axis, Z=0) */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[210, 9]} />
        <meshStandardMaterial color={CONFIG.colors.road} roughness={0.85} />
      </mesh>
      {/* White dashed centerline */}
      <DashedLine start={[-100, 0]} end={[100, 0]} dashLen={2.8} gapLen={1.8} />

      {/* Central 4-Way Junction (completely clear of trees) */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={CONFIG.colors.road} roughness={0.85} />
      </mesh>

      {/* ========================================================
          SITE BASES, PERIMETER ROADS & FENCING
          ======================================================== */}
      {SITES.map((site) => {
        const cx = site.center[0];
        const cz = site.center[2];
        const b = site.bounds;

        return (
          <group key={site.id} name={`site-base-${site.code}`}>
            {/* Elevated site platform pad */}
            <mesh position={[cx, 0.02, cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[b.maxX - b.minX + 1, b.maxZ - b.minZ + 1]} />
              <meshStandardMaterial color="#F1F5F9" roughness={0.9} />
            </mesh>

            {/* Perimeter ring road around site */}
            {/* North Road */}
            <mesh position={[cx, 0.012, b.minZ - 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[b.maxX - b.minX + 12, 7.5]} />
              <meshStandardMaterial color={CONFIG.colors.road} roughness={0.85} />
            </mesh>
            <DashedLine start={[b.minX - 5, b.minZ - 4]} end={[b.maxX + 5, b.minZ - 4]} />

            {/* South Road */}
            <mesh position={[cx, 0.012, b.maxZ + 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[b.maxX - b.minX + 12, 7.5]} />
              <meshStandardMaterial color={CONFIG.colors.road} roughness={0.85} />
            </mesh>
            <DashedLine start={[b.minX - 5, b.maxZ + 4]} end={[b.maxX + 5, b.maxZ + 4]} />

            {/* West Road */}
            <mesh position={[b.minX - 4, 0.012, cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[7.5, b.maxZ - b.minZ + 12]} />
              <meshStandardMaterial color={CONFIG.colors.road} roughness={0.85} />
            </mesh>
            <DashedLine start={[b.minX - 4, b.minZ - 5]} end={[b.minX - 4, b.maxZ + 5]} />

            {/* East Road */}
            <mesh position={[b.maxX + 4, 0.012, cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[7.5, b.maxZ - b.minZ + 12]} />
              <meshStandardMaterial color={CONFIG.colors.road} roughness={0.85} />
            </mesh>
            <DashedLine start={[b.maxX + 4, b.minZ - 5]} end={[b.maxX + 4, b.maxZ + 5]} />

            {/* Perimeter Fencing with gate opening */}
            <SitePerimeterFence
              minX={b.minX}
              maxX={b.maxX}
              minZ={b.minZ}
              maxZ={b.maxZ}
              gateOpenings={[{ side: 'E', start: cz - 8, end: cz + 8 }]}
            />

            {/* Ambulance-slot rectangles in front of bays for this site */}
            {site.bays.map((bay) => (
              <AmbulanceSlotRectangle
                key={bay.id}
                position={[bay.position[0], bay.position[1], bay.position[2]]}
                rotation={bay.rotation}
                label={`Bay ${bay.slotNumber}`}
              />
            ))}
          </group>
        );
      })}

      {/* Decorative trees along corridors with STRICT 10.5 unit road exclusion margin */}
      {/* Trees along North-South road (pushed back from ±4.5 road edge to ±10.5) */}
      {[-85, -65, -35, -18, 18, 35, 65, 85].map((z, idx) => (
        <React.Fragment key={`ns-tree-${idx}`}>
          <ToyTree position={[-10.5, 0, z]} scale={0.95} />
          <ToyTree position={[10.5, 0, z]} scale={0.95} />
        </React.Fragment>
      ))}

      {/* Trees along East-West road (pushed back to ±10.5) */}
      {[-85, -65, -35, -18, 18, 35, 65, 85].map((x, idx) => (
        <React.Fragment key={`ew-tree-${idx}`}>
          <ToyTree position={[x, 0, -10.5]} scale={0.95} />
          <ToyTree position={[x, 0, 10.5]} scale={0.95} />
        </React.Fragment>
      ))}
    </group>
  );
}
