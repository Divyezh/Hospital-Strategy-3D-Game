'use client';

import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { MapControls } from '@react-three/drei';
import type { MapControls as MapControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useSimStore } from '@/store/useSimStore';
import { CONFIG } from '@/data/config';

// Cubic ease in-out curve for smooth fly-to
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function CameraRig() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<MapControlsImpl>(null);

  const targetPan = useSimStore((s) => s.targetPan);
  const zoomDistance = useSimStore((s) => s.zoomDistance);
  const rotationAngle = useSimStore((s) => s.rotationAngle);
  const isFlying = useSimStore((s) => s.isFlying);
  const setIsFlying = useSimStore((s) => s.setIsFlying);
  const setZoomDistance = useSimStore((s) => s.setZoomDistance);
  const setIsDragging = useSimStore((s) => s.setIsDragging);

  // Animation refs
  const flyStartTarget = useRef(new THREE.Vector3());
  const flyEndTarget = useRef(new THREE.Vector3());
  const flyTimer = useRef(0);
  const FLY_DURATION = 1.2; // 1.2 seconds per spec

  const currentRotation = useRef(rotationAngle);
  const currentDistance = useRef(zoomDistance);
  const currentTarget = useRef(new THREE.Vector3(targetPan.x, targetPan.y, targetPan.z));

  // Initialize camera and controls
  useEffect(() => {
    const elev = (40 * Math.PI) / 180;
    const azim = -Math.PI / 4 + rotationAngle;
    const dist = zoomDistance;

    const groundDist = dist * Math.cos(elev);
    const camY = dist * Math.sin(elev);
    const camX = targetPan.x + groundDist * Math.sin(azim);
    const camZ = targetPan.z + groundDist * Math.cos(azim);

    camera.position.set(camX, camY, camZ);
    camera.lookAt(targetPan.x, 0, targetPan.z);

    if (controlsRef.current) {
      controlsRef.current.target.set(targetPan.x, 0, targetPan.z);
      controlsRef.current.update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When a fly-to is triggered (e.g., site switch or home reset)
  useEffect(() => {
    if (isFlying) {
      flyStartTarget.current.copy(currentTarget.current);
      flyEndTarget.current.set(targetPan.x, 0, targetPan.z);
      flyTimer.current = 0;
    }
  }, [isFlying, targetPan]);

  // Keyboard pan listener (WASD / Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const speed = 2.5;
      const rot = currentRotation.current;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);

      let dx = 0;
      let dz = 0;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        dx -= sinR * speed;
        dz -= cosR * speed;
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        dx += sinR * speed;
        dz += cosR * speed;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        dx -= cosR * speed;
        dz += sinR * speed;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        dx += cosR * speed;
        dz -= sinR * speed;
      }

      if (dx !== 0 || dz !== 0) {
        currentTarget.current.x += dx;
        currentTarget.current.z += dz;
        if (controlsRef.current) {
          controlsRef.current.target.copy(currentTarget.current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track dragging state for UI cursor feedback
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onStart = () => setIsDragging(true);
    const onEnd = () => {
      setIsDragging(false);
      // Synchronize distance after zoom
      if (controls) {
        const dist = camera.position.distanceTo(controls.target);
        setZoomDistance(dist);
      }
    };

    controls.addEventListener('start', onStart);
    controls.addEventListener('end', onEnd);
    return () => {
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('end', onEnd);
    };
  }, [camera, setIsDragging, setZoomDistance]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;

    // Handle fly-to site transition
    if (isFlying) {
      flyTimer.current += delta;
      const progress = Math.min(1, flyTimer.current / FLY_DURATION);
      const t = easeInOutCubic(progress);

      currentTarget.current.lerpVectors(flyStartTarget.current, flyEndTarget.current, t);

      if (progress >= 1) {
        setIsFlying(false);
      }
    } else if (controls) {
      // If user moved controls manually, update our target reference
      currentTarget.current.copy(controls.target);
    }

    // Smooth rotation snap damping (90 deg increments)
    const rotDamping = 1 - Math.exp(-delta * 9);
    currentRotation.current = THREE.MathUtils.lerp(currentRotation.current, rotationAngle, rotDamping);

    // Smooth zoom distance damping
    const zoomDamping = 1 - Math.exp(-delta * 10);
    currentDistance.current = THREE.MathUtils.lerp(currentDistance.current, zoomDistance, zoomDamping);

    // Recompute isometric-ish perspective position (~40deg elevation)
    const elev = (40 * Math.PI) / 180;
    const azim = -Math.PI / 4 + currentRotation.current;
    const dist = currentDistance.current;

    const groundDist = dist * Math.cos(elev);
    const camY = currentTarget.current.y + dist * Math.sin(elev);
    const camX = currentTarget.current.x + groundDist * Math.sin(azim);
    const camZ = currentTarget.current.z + groundDist * Math.cos(azim);

    if (isFlying || Math.abs(currentRotation.current - rotationAngle) > 0.001 || Math.abs(currentDistance.current - zoomDistance) > 0.1) {
      camera.position.set(camX, camY, camZ);
      if (controls) {
        controls.target.copy(currentTarget.current);
        controls.update();
      }
    }
  });

  return (
    <MapControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      screenSpacePanning={false}
      minDistance={CONFIG.camera.minDistance}
      maxDistance={CONFIG.camera.maxDistance}
      minPolarAngle={CONFIG.camera.minPolarAngle}
      maxPolarAngle={CONFIG.camera.maxPolarAngle}
    />
  );
}
