'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { HumanoidMesh } from './HumanoidMesh';
import { AmbulanceMesh } from './AmbulanceMesh';
import { campusAudio } from '@/explore/sound';
import { ExploreDebugOverlay } from './ExploreDebugOverlay';
import { useExploreStore } from '@/explore/store';
import {
  startExploreInvariantsMonitor,
  stopExploreInvariantsMonitor,
  ExploreVehicleState,
  ExplorePedestrianState,
  checkExploreInvariants,
} from '@/sim/invariants';

import { AmbulanceController } from '@/explore/sim/ambulanceController';

interface ExploreCharactersProps {
  onGateTrigger: (open: boolean) => void;
}

export function ExploreCharacters({ onGateTrigger }: ExploreCharactersProps) {
  // Visitor moving reference
  const visitorRef = useRef<THREE.Group>(null);
  const visitorZ = useRef(72);
  const visitorWalkPhaseRef = useRef(0);

  // Dedicated Ambulance controller reference (Step 1)
  const ambulanceController = useRef(new AmbulanceController()).current;
  const ambulanceRef = useRef<THREE.Group>(null);

  // Gate state tracker for audio triggering
  const lastGateOpen = useRef(false);

  // Guard head tracking
  const guardRef = useRef<THREE.Group>(null);

  // Simulation metrics & agent state tracking (Step 0)
  const ticksRef = useRef(0);
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(0);
  const fpsRef = useRef(60);

  const vehiclesRef = useRef<ExploreVehicleState[]>([
    {
      id: 'AMB-01',
      position: [100, 0.15, 65.5],
      rotationY: -Math.PI / 2,
      pitch: 0,
      roll: 0,
      up: [0, 1, 0],
      halfWidth: 1.15,
      halfHeight: 1.25,
      halfLength: 2.6,
      speed: 6.0,
      maxSpeed: 10.0,
      stoppedSimTime: 0,
      isParkedOrDocked: false,
      hasObstacleAhead: false,
    },
  ]);

  const pedestriansRef = useRef<ExplorePedestrianState[]>([
    {
      id: 'VIS-01',
      position: [-6.8, 0.15, 70],
      speed: 3.2,
      maxSpeed: 4.0,
    },
  ]);

  // Start dev invariant monitor running each second
  useEffect(() => {
    startExploreInvariantsMonitor(() => ({
      vehicles: vehiclesRef.current,
      pedestrians: pedestriansRef.current,
      delta: 0.033,
    }));
    return () => {
      stopExploreInvariantsMonitor();
    };
  }, []);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    ticksRef.current++;
    frameCountRef.current++;

    // 1. Visitor Movement Loop:
    visitorZ.current -= delta * 3.2;
    if (visitorZ.current < 16) {
      visitorZ.current = 70; // loop back
    }
    if (visitorRef.current) {
      visitorRef.current.position.z = visitorZ.current;
      visitorRef.current.position.x = -6.8; // on the pedestrian sidewalk
      visitorRef.current.position.y = 0.15;
    }
    visitorWalkPhaseRef.current = time * 8;

    // 2. Ambulance Path Movement Loop (Step 1 Pure Pursuit Kinematics):
    const ambPose = ambulanceController.update(delta);

    if (ambulanceRef.current) {
      ambulanceRef.current.position.set(ambPose.x, ambPose.y, ambPose.z);
      ambulanceRef.current.rotation.order = 'YXZ';
      ambulanceRef.current.rotation.x = 0;
      ambulanceRef.current.rotation.z = 0;
      ambulanceRef.current.rotation.y = ambPose.yaw;
    }

    // Sync vehicle & pedestrian state for invariants checking & debug overlay
    const amb = vehiclesRef.current[0];
    if (amb) {
      amb.prevPosition = amb.position ? [...amb.position] : [ambPose.x, ambPose.y, ambPose.z];
      amb.position = [ambPose.x, ambPose.y, ambPose.z];
      amb.lastDt = delta;
      amb.rotationY = ambPose.yaw;
      amb.pitch = 0;
      amb.roll = 0;
      amb.up = [0, 1, 0];
      amb.isParkedOrDocked = ambPose.state === 'DOCKED_ER' || ambPose.state === 'REVERSE_DOCK';
      amb.speed = ambPose.speed;
      amb.stoppedSimTime = ambPose.stoppedSimTime;
    }

    const ped = pedestriansRef.current[0];
    if (ped) {
      ped.prevPosition = ped.position ? [...ped.position] : [-6.8, 0.15, visitorZ.current];
      ped.position = [-6.8, 0.15, visitorZ.current];
      ped.lastDt = delta;
      ped.speed = 3.2;
    }

    // 3. Automated Gate Proximity Detection:
    const visitorNearGate = visitorZ.current > 48 && visitorZ.current < 64;
    const shouldOpenGate = ambPose.shouldOpenGate || visitorNearGate;

    // Update left panel barrier telemetry
    useExploreStore.getState().updateGuardTelemetry({
      barrierState: shouldOpenGate ? 'OPEN' : 'CLOSED',
    });

    // Trigger audio whenever gate state changes (open / close)
    if (shouldOpenGate !== lastGateOpen.current) {
      lastGateOpen.current = shouldOpenGate;
      campusAudio.playGateSound(shouldOpenGate);
    }

    // Modulate ambulance siren: louder when moving, attenuated when docked in ER bay
    campusAudio.setSirenVolume(ambPose.sirenVolume);

    onGateTrigger(shouldOpenGate);

    // 4. Gate Guard Look-At / Alert Behavior:
    if (guardRef.current) {
      if (shouldOpenGate) {
        guardRef.current.rotation.y = Math.PI * 0.75; // raises hand & looks at vehicle
      } else {
        guardRef.current.rotation.y = Math.PI * 0.5 + Math.sin(time * 0.8) * 0.2;
      }
    }

    // Measure FPS and sync sim metrics every 500ms (no per-frame setState)
    if (time - lastFpsTimeRef.current >= 0.5) {
      fpsRef.current = Math.round(frameCountRef.current / (time - lastFpsTimeRef.current));
      frameCountRef.current = 0;
      lastFpsTimeRef.current = time;

      const invariantCheck = checkExploreInvariants({
        vehicles: vehiclesRef.current,
        pedestrians: pedestriansRef.current,
        delta: Math.max(0.001, delta),
      });

      useExploreStore.getState().updateSimMetrics({
        ticks: ticksRef.current,
        fps: fpsRef.current,
        vehiclesTotal: vehiclesRef.current.length,
        vehiclesMoving: vehiclesRef.current.filter((v) => v.speed > 0.1).length,
        pedestriansTotal: pedestriansRef.current.length + 8,
        pedestriansMoving: pedestriansRef.current.filter((v) => v.speed > 0.1).length,
        invariantViolations: invariantCheck.violations,
      });
    }
  });

  return (
    <group>
      {/* 3D Debug Visual Overlay (Road graph, Stop lines, Trigger zones, Colliders, OBBs) */}
      <ExploreDebugOverlay
        vehicles={vehiclesRef.current}
        pedestrians={pedestriansRef.current}
      />

      {/* 1. Gate Guard 1: On-duty outside Guard Booth (X: 5.5, Z: 54.5) */}
      <group ref={guardRef} position={[5.5, 0.15, 54.5]}>
        <HumanoidMesh role="guard" walkPhase={0} />
      </group>

      {/* 2. Gate Guard 2: Seated inside Guard Booth monitoring CCTV screens (X: 8.2, Z: 55.4) */}
      <group position={[8.2, 0.15, 55.4]} rotation={[0, 0, 0]}>
        <HumanoidMesh role="guard" isSitting={true} />
      </group>

      {/* 3. Visitor walking through the gate and campus */}
      <group ref={visitorRef} position={[-6.8, 0.15, 65]}>
        <HumanoidMesh role="visitor" walkPhase={visitorWalkPhaseRef.current} />
      </group>

      {/* 4. Active Ambulance vehicle */}
      <group ref={ambulanceRef} position={[100, 0.15, 65.5]}>
        <AmbulanceMesh flashing={true} />
      </group>

    </group>
  );
}
