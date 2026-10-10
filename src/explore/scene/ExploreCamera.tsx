'use client';

import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { MapControls } from '@react-three/drei';
import type { MapControls as MapControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useExploreStore, CameraViewPreset } from '@/explore/store';

// Smooth cubic easing for camera transitions
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

const VIEW_TARGETS: Record<CameraViewPreset, { target: [number, number, number]; position: [number, number, number] }> = {
  grounds: {
    target: [0, 4, 14],
    position: [55, 52, 78],
  },
  neighbourhood: {
    target: [0, 6, 35],
    position: [95, 90, 145],
  },
  gate: {
    target: [0, 3, 64],
    position: [26, 18, 92],
  },
  reception: {
    target: [0, 3, 14],
    position: [18, 14, 34],
  },
  emergency: {
    target: [-32, 2.5, 8],
    position: [-22, 12, 28],
  },
  tour: {
    target: [0, 4, 25],
    position: [48, 42, 75],
  },
  transit: {
    target: [12, 3, 68],
    position: [32, 24, 102],
  },
};

export function ExploreCamera() {
  const { camera } = useThree();
  const controlsRef = useRef<MapControlsImpl>(null);

  const activeView = useExploreStore((s) => s.activeView);
  const selectedRoomId = useExploreStore((s) => s.selectedRoomId);
  const cameraMode = useExploreStore((s) => s.cameraMode);

  // Transition state
  const isTransitioning = useRef(false);
  const transTimer = useRef(0);
  const TRANS_DURATION = 1.4;

  const startCamPos = useRef(new THREE.Vector3());
  const targetCamPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const endTarget = useRef(new THREE.Vector3());

  // Initialize camera position
  useEffect(() => {
    const preset = VIEW_TARGETS.grounds;
    camera.position.set(...preset.position);
    camera.lookAt(...preset.target);

    if (controlsRef.current) {
      controlsRef.current.target.set(...preset.target);
      controlsRef.current.update();
    }
  }, [camera]);

  // Trigger smooth transition when activeView or selectedRoomId changes
  useEffect(() => {
    let targetPos: [number, number, number] = VIEW_TARGETS.grounds.position;
    let targetLook: [number, number, number] = VIEW_TARGETS.grounds.target;

    if (selectedRoomId) {
      // Find room in hospital rooms
      import('@/data/hospital').then(({ HOSPITAL_ROOMS }) => {
        const room = HOSPITAL_ROOMS.find((r) => r.id === selectedRoomId);
        if (room) {
          targetPos = room.cameraPreset.position;
          targetLook = room.cameraPreset.target;

          startCamPos.current.copy(camera.position);
          targetCamPos.current.set(...targetPos);
          if (controlsRef.current) {
            startTarget.current.copy(controlsRef.current.target);
          } else {
            startTarget.current.set(0, 0, 0);
          }
          endTarget.current.set(...targetLook);

          transTimer.current = 0;
          isTransitioning.current = true;
        }
      });
      return;
    }

    const preset = VIEW_TARGETS[activeView] || VIEW_TARGETS.grounds;
    startCamPos.current.copy(camera.position);
    targetCamPos.current.set(...preset.position);

    if (controlsRef.current) {
      startTarget.current.copy(controlsRef.current.target);
    } else {
      startTarget.current.set(0, 0, 0);
    }
    endTarget.current.set(...preset.target);

    transTimer.current = 0;
    isTransitioning.current = true;
  }, [activeView, selectedRoomId, camera]);

  // Keyboard navigation (WASD / Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      const speed = 2.2;
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();

      const right = new THREE.Vector3();
      right.crossVectors(camera.up, forward).normalize();

      const deltaPan = new THREE.Vector3();

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        deltaPan.addScaledVector(forward, speed);
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        deltaPan.addScaledVector(forward, -speed);
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        deltaPan.addScaledVector(right, speed);
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        deltaPan.addScaledVector(right, -speed);
      }

      if (deltaPan.lengthSq() > 0 && controlsRef.current) {
        camera.position.add(deltaPan);
        controlsRef.current.target.add(deltaPan);
        controlsRef.current.update();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (isTransitioning.current) {
      transTimer.current += delta;
      const progress = Math.min(1, transTimer.current / TRANS_DURATION);
      const t = easeInOutCubic(progress);

      camera.position.lerpVectors(startCamPos.current, targetCamPos.current, t);
      controls.target.lerpVectors(startTarget.current, endTarget.current, t);
      controls.update();

      if (progress >= 1) {
        isTransitioning.current = false;
      }
    } else {
      // 1. World Move Joystick (Pan / Navigate across the entire expanded campus & city)
      const moveDelta = useExploreStore.getState().cameraMoveDelta;
      if (Math.abs(moveDelta.x) > 0.001 || Math.abs(moveDelta.y) > 0.001) {
        const panSpeed = 38 * delta;

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(camera.up, forward).normalize();

        const moveVec = new THREE.Vector3();
        // Up on joystick (-y) moves forward, Down (+y) moves backward
        moveVec.addScaledVector(forward, -moveDelta.y * panSpeed);
        // Right on joystick (+x) moves right, Left (-x) moves left
        moveVec.addScaledVector(right, -moveDelta.x * panSpeed);

        camera.position.add(moveVec);
        controls.target.add(moveVec);
        controls.update();
      }

      // 2. 360° Joystick Orbit & Auto-Rotate
      const orbitDelta = useExploreStore.getState().cameraOrbitDelta;
      const autoRotate = useExploreStore.getState().autoRotate360;

      if (autoRotate || Math.abs(orbitDelta.x) > 0.001 || Math.abs(orbitDelta.y) > 0.001) {
        const target = controls.target;
        const offset = camera.position.clone().sub(target);
        const radius = offset.length();

        let theta = Math.atan2(offset.x, offset.z);
        let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));

        // Horizontal input rotates 360 degrees
        const rotSpeed = 1.9;
        const autoSpeed = autoRotate ? 0.35 : 0;
        theta += (orbitDelta.x * rotSpeed + autoSpeed) * delta;

        // Vertical input tilts elevation (pitch)
        phi -= orbitDelta.y * rotSpeed * delta;
        phi = Math.max(0.18, Math.min(Math.PI / 2.15, phi));

        offset.x = radius * Math.sin(phi) * Math.sin(theta);
        offset.y = radius * Math.cos(phi);
        offset.z = radius * Math.sin(phi) * Math.cos(theta);

        camera.position.copy(target).add(offset);
        camera.lookAt(target);
        controls.update();
      }
    }
  });

  return (
    <MapControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      screenSpacePanning={false}
      minDistance={10}
      maxDistance={450}
      minPolarAngle={Math.PI / 8}
      maxPolarAngle={Math.PI / 2.15}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      panSpeed={0.9}
    />
  );
}
