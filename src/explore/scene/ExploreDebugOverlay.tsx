'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Billboard, Text, Line } from '@react-three/drei';
import { useExploreStore } from '@/explore/store';
import { ROAD_EDGES, STOP_LINES, GATE_TRIGGER_ZONES, PEDESTRIAN_PATHS } from '@/explore/sim/roadGraph';
import { CAMPUS_OBSTACLES } from '@/explore/sim/obstacles';
import { ExploreVehicleState, ExplorePedestrianState } from '@/sim/invariants';

interface ExploreDebugOverlayProps {
  vehicles?: ExploreVehicleState[];
  pedestrians?: ExplorePedestrianState[];
}

export function ExploreDebugOverlay({ vehicles = [], pedestrians = [] }: ExploreDebugOverlayProps) {
  const debugOverlay = useExploreStore((s) => s.debugOverlay);

  // Generate road lane spline points
  const laneLines = useMemo(() => {
    return ROAD_EDGES.map((edge) => {
      const points = edge.curve.getPoints(50);
      const color =
        edge.laneType === 'er_bay'
          ? '#EF4444'
          : edge.laneType.includes('gate')
          ? '#10B981'
          : edge.laneType === 'loop'
          ? '#F59E0B'
          : '#3B82F6';
      return { id: edge.id, points, color };
    });
  }, []);

  // Generate pedestrian path points
  const pedLines = useMemo(() => {
    return PEDESTRIAN_PATHS.map((p) => {
      const points = p.points.map((pt) => new THREE.Vector3(pt[0], pt[1] + 0.05, pt[2]));
      return { id: p.id, points, color: '#A855F7' };
    });
  }, []);

  if (!debugOverlay) return null;

  return (
    <group>
      {/* 1. Road Graph Lane Centerlines */}
      {laneLines.map((line) => (
        <Line
          key={`lane-${line.id}`}
          points={line.points}
          color={line.color}
          lineWidth={2.5}
        />
      ))}

      {/* 2. Pedestrian Path Polylines */}
      {pedLines.map((line) => (
        <Line
          key={`ped-path-${line.id}`}
          points={line.points}
          color={line.color}
          lineWidth={2}
          dashed
          dashSize={0.6}
          gapSize={0.3}
        />
      ))}

      {/* 3. Stop Lines */}
      {STOP_LINES.map((sl) => (
        <mesh key={`stop-${sl.id}`} position={sl.pos} rotation={[0, sl.rotationY, 0]}>
          <boxGeometry args={[sl.width, 0.08, 0.6]} />
          <meshBasicMaterial color="#EF4444" wireframe={false} />
        </mesh>
      ))}

      {/* 4. Gate Trigger Zones */}
      {GATE_TRIGGER_ZONES.map((zone) => {
        const width = zone.bounds.maxX - zone.bounds.minX;
        const depth = zone.bounds.maxZ - zone.bounds.minZ;
        const cx = (zone.bounds.minX + zone.bounds.maxX) / 2;
        const cz = (zone.bounds.minZ + zone.bounds.maxZ) / 2;
        return (
          <mesh key={`trigger-${zone.id}`} position={[cx, 1.0, cz]}>
            <boxGeometry args={[width, 2.0, depth]} />
            <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.35} />
          </mesh>
        );
      })}

      {/* 5. Wall, Fence & Building Obstacle Collision Boxes (AABBs) */}
      {CAMPUS_OBSTACLES.map((obs) => {
        const width = obs.maxX - obs.minX;
        const height = obs.maxY - obs.minY;
        const depth = obs.maxZ - obs.minZ;
        const cx = (obs.minX + obs.maxX) / 2;
        const cy = (obs.minY + obs.maxY) / 2;
        const cz = (obs.minZ + obs.maxZ) / 2;
        return (
          <group key={`obs-${obs.id}`} position={[cx, cy, cz]}>
            <mesh>
              <boxGeometry args={[width, height, depth]} />
              <meshBasicMaterial color="#DC2626" wireframe />
            </mesh>
          </group>
        );
      })}

      {/* 6. Active Vehicle OBBs and Agent IDs */}
      {vehicles.map((v) => (
        <group key={`debug-veh-${v.id}`} position={v.position} rotation={[0, v.rotationY, 0]}>
          {/* OBB wireframe box */}
          <mesh position={[0, v.halfHeight, 0]}>
            <boxGeometry args={[v.halfWidth * 2, v.halfHeight * 2, v.halfLength * 2]} />
            <meshBasicMaterial color="#06B6D4" wireframe />
          </mesh>
          {/* Agent ID Billboard */}
          <Billboard position={[0, v.halfHeight * 2 + 1.2, 0]}>
            <Text fontSize={0.6} color="#06B6D4" anchorX="center" anchorY="bottom">
              {`${v.id} (${v.speed.toFixed(1)}m/s)`}
            </Text>
          </Billboard>
        </group>
      ))}

      {/* 7. Active Pedestrian Collision & Agent IDs */}
      {pedestrians.map((p) => (
        <group key={`debug-ped-${p.id}`} position={p.position}>
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 1.8, 8]} />
            <meshBasicMaterial color="#A855F7" wireframe />
          </mesh>
          <Billboard position={[0, 2.3, 0]}>
            <Text fontSize={0.4} color="#E9D5FF" anchorX="center" anchorY="bottom">
              {p.id}
            </Text>
          </Billboard>
        </group>
      ))}
    </group>
  );
}
