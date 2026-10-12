'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Vector3D } from '@/sim/types';

interface DockTrajectoryLineProps {
  path: Vector3D[];
  color?: string;
  dotCount?: number;
}

/**
 * Animated glowing dotted ground trajectory line.
 * Recreates the WareTrack navigation path seen in the example video (e.g. 00:20, 00:51).
 */
export function DockTrajectoryLine({
  path,
  color = '#2563EB',
  dotCount = 18,
}: DockTrajectoryLineProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate smooth curve points from path waypoints
  const curvePoints = useMemo(() => {
    if (!path || path.length < 2) return [];
    const vecs = path.map((p) => new THREE.Vector3(p.x, 0.08, p.z));
    const curve = new THREE.CatmullRomCurve3(vecs, false, 'catmullrom', 0.2);
    return curve.getSpacedPoints(dotCount);
  }, [path, dotCount]);

  // Buffer geometry for animated dots
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    if (curvePoints.length === 0) return geo;
    const positions = new Float32Array(curvePoints.length * 3);
    curvePoints.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [curvePoints]);

  // Dotted line connecting geometry
  const lineGeometry = useMemo(() => {
    if (curvePoints.length < 2) return null;
    return new THREE.BufferGeometry().setFromPoints(curvePoints);
  }, [curvePoints]);

  useFrame(({ clock }) => {
    if (pointsRef.current && pointsRef.current.material) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      const t = clock.getElapsedTime();
      // Pulsing glow animation
      mat.size = 0.45 + Math.sin(t * 5) * 0.08;
    }
  });

  if (curvePoints.length < 2) return null;

  return (
    <group name="dock-trajectory-guide">
      {/* Ground Dotted Guide Line */}
      {lineGeometry && (
        <lineLoop geometry={lineGeometry}>
          <lineDashedMaterial
            color={color}
            dashSize={0.8}
            gapSize={0.5}
            linewidth={2}
            transparent
            opacity={0.65}
            depthWrite={false}
          />
        </lineLoop>
      )}

      {/* Animated Glowing Guide Dots */}
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          color={color}
          size={0.45}
          sizeAttenuation={true}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
