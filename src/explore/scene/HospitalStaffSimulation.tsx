'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { HumanoidMesh, HumanoidRole, HoldingItem, PatientStatus } from './HumanoidMesh';
import { FLOOR_HEIGHT } from '@/data/hospital';
import { useExploreStore } from '@/explore/store';

interface MovingStaffSpec {
  id: string;
  role: HumanoidRole;
  floor: number;
  waypoints: [number, number, number][];
  speed: number;
  holdingItem?: HoldingItem;
  rotationOffset?: number;
}

export function HospitalStaffSimulation() {
  const selectedFloor = useExploreStore((s) => s.selectedFloor);

  // --------------------------------------------------------------------------
  // 10 WARD BOYS (Pushing stretchers, wheelchairs, and carrying supplies)
  // --------------------------------------------------------------------------
  const wardBoysRef = useRef([
    // Ward Boy 1 (Ground Floor): Pushing rolling gurney stretcher from ER to Lobby elevator
    {
      id: 'wb-1',
      role: 'ward_boy' as const,
      floor: 0,
      holdingItem: 'stretcher' as const,
      speed: 1.8,
      waypoints: [
        [-18, 0.22, 12],
        [-10, 0.22, 12],
        [-2, 0.22, 10],
        [2, 0.22, 6],
        [5, 0.22, 2],
        [2, 0.22, 6],
        [-2, 0.22, 10],
        [-10, 0.22, 12],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-18, 0.22, 12),
      yaw: 0,
    },
    // Ward Boy 2 (Ground Floor): Pushing wheelchair with patient from ER to Exit
    {
      id: 'wb-2',
      role: 'ward_boy' as const,
      floor: 0,
      holdingItem: 'wheelchair' as const,
      speed: 1.5,
      waypoints: [
        [-14, 0.22, 3],
        [-14, 0.22, 8],
        [-14, 0.22, 12],
        [-8, 0.22, 12],
        [-14, 0.22, 12],
        [-14, 0.22, 8],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-14, 0.22, 3),
      yaw: 0,
    },
    // Ward Boy 3 (Ground Floor): Transporting medicine supplies from Pharmacy to ER
    {
      id: 'wb-3',
      role: 'ward_boy' as const,
      floor: 0,
      holdingItem: 'none' as const,
      speed: 2.1,
      waypoints: [
        [15, 0.22, 6],
        [11, 0.22, 6],
        [4, 0.22, 6],
        [-4, 0.22, 6],
        [-12, 0.22, 6],
        [-4, 0.22, 6],
        [4, 0.22, 6],
        [11, 0.22, 6],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(15, 0.22, 6),
      yaw: 0,
    },
    // Ward Boy 4 (Ground Floor): Assisting lobby visitors & check-in
    {
      id: 'wb-4',
      role: 'ward_boy' as const,
      floor: 0,
      holdingItem: 'none' as const,
      speed: 1.4,
      waypoints: [
        [0, 0.22, 12],
        [4, 0.22, 12],
        [4, 0.22, 7],
        [0, 0.22, 7],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(0, 0.22, 12),
      yaw: 0,
    },
    // Ward Boy 5 (1st Floor): Pushing critical ICU gurney between Elevator and OT 1
    {
      id: 'wb-5',
      role: 'ward_boy' as const,
      floor: 1,
      holdingItem: 'stretcher' as const,
      speed: 1.6,
      waypoints: [
        [2, 0.22 + FLOOR_HEIGHT, -2],
        [8, 0.22 + FLOOR_HEIGHT, -2],
        [15, 0.22 + FLOOR_HEIGHT, -2],
        [15, 0.22 + FLOOR_HEIGHT, 4],
        [15, 0.22 + FLOOR_HEIGHT, -2],
        [8, 0.22 + FLOOR_HEIGHT, -2],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(2, 0.22 + FLOOR_HEIGHT, -2),
      yaw: 0,
    },
    // Ward Boy 6 (1st Floor): Pushing wheelchair from Radiology MRI suite to OPD clinic
    {
      id: 'wb-6',
      role: 'ward_boy' as const,
      floor: 1,
      holdingItem: 'wheelchair' as const,
      speed: 1.5,
      waypoints: [
        [6, 0.22 + FLOOR_HEIGHT, 10],
        [1, 0.22 + FLOOR_HEIGHT, 10],
        [-6, 0.22 + FLOOR_HEIGHT, 10],
        [-14, 0.22 + FLOOR_HEIGHT, 10],
        [-6, 0.22 + FLOOR_HEIGHT, 10],
        [1, 0.22 + FLOOR_HEIGHT, 10],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(6, 0.22 + FLOOR_HEIGHT, 10),
      yaw: 0,
    },
    // Ward Boy 7 (1st Floor): Transporting surgical linen cart between OT and Central Station
    {
      id: 'wb-7',
      role: 'ward_boy' as const,
      floor: 1,
      holdingItem: 'none' as const,
      speed: 2.0,
      waypoints: [
        [-5, 0.22 + FLOOR_HEIGHT, -8],
        [2, 0.22 + FLOOR_HEIGHT, -8],
        [10, 0.22 + FLOOR_HEIGHT, -8],
        [2, 0.22 + FLOOR_HEIGHT, -8],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-5, 0.22 + FLOOR_HEIGHT, -8),
      yaw: 0,
    },
    // Ward Boy 8 (2nd Floor): Pushing stretcher gurney from Elevator to Inpatient Ward
    {
      id: 'wb-8',
      role: 'ward_boy' as const,
      floor: 2,
      holdingItem: 'stretcher' as const,
      speed: 1.6,
      waypoints: [
        [2, 0.22 + FLOOR_HEIGHT * 2, 2],
        [-4, 0.22 + FLOOR_HEIGHT * 2, 2],
        [-12, 0.22 + FLOOR_HEIGHT * 2, 2],
        [-12, 0.22 + FLOOR_HEIGHT * 2, 7],
        [-12, 0.22 + FLOOR_HEIGHT * 2, 2],
        [-4, 0.22 + FLOOR_HEIGHT * 2, 2],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(2, 0.22 + FLOOR_HEIGHT * 2, 2),
      yaw: 0,
    },
    // Ward Boy 9 (2nd Floor): Pushing wheelchair in Maternity recovery hall
    {
      id: 'wb-9',
      role: 'ward_boy' as const,
      floor: 2,
      holdingItem: 'wheelchair' as const,
      speed: 1.4,
      waypoints: [
        [3, 0.22 + FLOOR_HEIGHT * 2, 10],
        [8, 0.22 + FLOOR_HEIGHT * 2, 10],
        [8, 0.22 + FLOOR_HEIGHT * 2, 4],
        [3, 0.22 + FLOOR_HEIGHT * 2, 4],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(3, 0.22 + FLOOR_HEIGHT * 2, 10),
      yaw: 0,
    },
    // Ward Boy 10 (2nd Floor): Carrying medical archive files along corridor
    {
      id: 'wb-10',
      role: 'ward_boy' as const,
      floor: 2,
      holdingItem: 'none' as const,
      speed: 1.9,
      waypoints: [
        [-14, 0.22 + FLOOR_HEIGHT * 2, -2],
        [-6, 0.22 + FLOOR_HEIGHT * 2, -2],
        [2, 0.22 + FLOOR_HEIGHT * 2, -2],
        [10, 0.22 + FLOOR_HEIGHT * 2, -2],
        [2, 0.22 + FLOOR_HEIGHT * 2, -2],
        [-6, 0.22 + FLOOR_HEIGHT * 2, -2],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-14, 0.22 + FLOOR_HEIGHT * 2, -2),
      yaw: 0,
    },
  ]).current;

  // --------------------------------------------------------------------------
  // 16 ACTIVE NURSES (Walking between beds, checking clipboards, attending)
  // --------------------------------------------------------------------------
  const nursesRef = useRef([
    // Floor 0 - Nurse 1: Checking ER beds 1 to 4 with clipboard
    {
      id: 'nurse-1',
      floor: 0,
      holdingItem: 'clipboard' as const,
      speed: 1.3,
      waypoints: [
        [-17, 0.22, 2.5],
        [-17, 0.22, 5.5],
        [-17, 0.22, 8.5],
        [-17, 0.22, 11.5],
        [-17, 0.22, 8.5],
        [-17, 0.22, 5.5],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-17, 0.22, 2.5),
      yaw: 0,
    },
    // Floor 0 - Nurse 2: Checking ER beds 5 to 8
    {
      id: 'nurse-2',
      floor: 0,
      holdingItem: 'clipboard' as const,
      speed: 1.4,
      waypoints: [
        [-11, 0.22, 11.5],
        [-11, 0.22, 8.5],
        [-11, 0.22, 5.5],
        [-11, 0.22, 2.5],
        [-11, 0.22, 5.5],
        [-11, 0.22, 8.5],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-11, 0.22, 11.5),
      yaw: 0,
    },
    // Floor 0 - Nurse 3: Attending central resuscitation beds
    {
      id: 'nurse-3',
      floor: 0,
      holdingItem: 'none' as const,
      speed: 1.2,
      waypoints: [
        [-13, 0.22, 3.5],
        [-15, 0.22, 3.5],
        [-15, 0.22, 7.5],
        [-13, 0.22, 7.5],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-13, 0.22, 3.5),
      yaw: 0,
    },
    // Floor 0 - Nurse 4: Triage Coordinator walking to Main Lobby Help Desk
    {
      id: 'nurse-4',
      floor: 0,
      holdingItem: 'clipboard' as const,
      speed: 1.6,
      waypoints: [
        [-12, 0.22, 12],
        [-6, 0.22, 12],
        [0, 0.22, 9],
        [-6, 0.22, 12],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-12, 0.22, 12),
      yaw: 0,
    },
    // Floor 0 - Nurse 5: Pharmacy liaison delivering medications to ER
    {
      id: 'nurse-5',
      floor: 0,
      holdingItem: 'none' as const,
      speed: 1.7,
      waypoints: [
        [12, 0.22, 8],
        [6, 0.22, 8],
        [0, 0.22, 8],
        [-8, 0.22, 8],
        [0, 0.22, 8],
        [6, 0.22, 8],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(12, 0.22, 8),
      yaw: 0,
    },
    // Floor 1 - Nurse 6: ICU Bed round checking cardiac monitors
    {
      id: 'nurse-6',
      floor: 1,
      holdingItem: 'clipboard' as const,
      speed: 1.2,
      waypoints: [
        [-16, 0.22 + FLOOR_HEIGHT, -5],
        [-10, 0.22 + FLOOR_HEIGHT, -5],
        [-4, 0.22 + FLOOR_HEIGHT, -5],
        [2, 0.22 + FLOOR_HEIGHT, -5],
        [-4, 0.22 + FLOOR_HEIGHT, -5],
        [-10, 0.22 + FLOOR_HEIGHT, -5],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-16, 0.22 + FLOOR_HEIGHT, -5),
      yaw: 0,
    },
    // Floor 1 - Nurse 7: ICU Second Row bed checks
    {
      id: 'nurse-7',
      floor: 1,
      holdingItem: 'clipboard' as const,
      speed: 1.3,
      waypoints: [
        [4, 0.22 + FLOOR_HEIGHT, -11],
        [-2, 0.22 + FLOOR_HEIGHT, -11],
        [-8, 0.22 + FLOOR_HEIGHT, -11],
        [-14, 0.22 + FLOOR_HEIGHT, -11],
        [-8, 0.22 + FLOOR_HEIGHT, -11],
        [-2, 0.22 + FLOOR_HEIGHT, -11],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(4, 0.22 + FLOOR_HEIGHT, -11),
      yaw: 0,
    },
    // Floor 1 - Nurse 8: ICU Station to OT 1 corridor patrol
    {
      id: 'nurse-8',
      floor: 1,
      holdingItem: 'none' as const,
      speed: 1.6,
      waypoints: [
        [-4, 0.22 + FLOOR_HEIGHT, -13],
        [4, 0.22 + FLOOR_HEIGHT, -13],
        [12, 0.22 + FLOOR_HEIGHT, -10],
        [15, 0.22 + FLOOR_HEIGHT, -6],
        [12, 0.22 + FLOOR_HEIGHT, -10],
        [4, 0.22 + FLOOR_HEIGHT, -13],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-4, 0.22 + FLOOR_HEIGHT, -13),
      yaw: 0,
    },
    // Floor 1 - Nurse 9: Operation Theatre 1 Sterile Nurse
    {
      id: 'nurse-9',
      floor: 1,
      holdingItem: 'none' as const,
      speed: 0.9,
      waypoints: [
        [16, 0.22 + FLOOR_HEIGHT, 8],
        [18, 0.22 + FLOOR_HEIGHT, 8],
        [18, 0.22 + FLOOR_HEIGHT, 6],
        [16, 0.22 + FLOOR_HEIGHT, 6],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(16, 0.22 + FLOOR_HEIGHT, 8),
      yaw: 0,
    },
    // Floor 1 - Nurse 10: Operation Theatre 2 Circulating Nurse
    {
      id: 'nurse-10',
      floor: 1,
      holdingItem: 'none' as const,
      speed: 1.0,
      waypoints: [
        [16, 0.22 + FLOOR_HEIGHT, -9],
        [18, 0.22 + FLOOR_HEIGHT, -9],
        [18, 0.22 + FLOOR_HEIGHT, -7],
        [16, 0.22 + FLOOR_HEIGHT, -7],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(16, 0.22 + FLOOR_HEIGHT, -9),
      yaw: 0,
    },
    // Floor 1 - Nurse 11: Radiology Patient Receptionist
    {
      id: 'nurse-11',
      floor: 1,
      holdingItem: 'clipboard' as const,
      speed: 1.2,
      waypoints: [
        [3, 0.22 + FLOOR_HEIGHT, 3],
        [5, 0.22 + FLOOR_HEIGHT, 3],
        [5, 0.22 + FLOOR_HEIGHT, 6],
        [3, 0.22 + FLOOR_HEIGHT, 6],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(3, 0.22 + FLOOR_HEIGHT, 3),
      yaw: 0,
    },
    // Floor 1 - Nurse 12: OPD Clinic Consultant Nurse
    {
      id: 'nurse-12',
      floor: 1,
      holdingItem: 'clipboard' as const,
      speed: 1.4,
      waypoints: [
        [-16, 0.22 + FLOOR_HEIGHT, 6],
        [-11, 0.22 + FLOOR_HEIGHT, 6],
        [-11, 0.22 + FLOOR_HEIGHT, 11],
        [-16, 0.22 + FLOOR_HEIGHT, 11],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-16, 0.22 + FLOOR_HEIGHT, 6),
      yaw: 0,
    },
    // Floor 2 - Nurse 13: General Ward Bed rounds (North wing)
    {
      id: 'nurse-13',
      floor: 2,
      holdingItem: 'clipboard' as const,
      speed: 1.3,
      waypoints: [
        [-16, 0.22 + FLOOR_HEIGHT * 2, -6],
        [-10, 0.22 + FLOOR_HEIGHT * 2, -6],
        [-4, 0.22 + FLOOR_HEIGHT * 2, -6],
        [-10, 0.22 + FLOOR_HEIGHT * 2, -6],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-16, 0.22 + FLOOR_HEIGHT * 2, -6),
      yaw: 0,
    },
    // Floor 2 - Nurse 14: General Ward Bed rounds (South wing)
    {
      id: 'nurse-14',
      floor: 2,
      holdingItem: 'clipboard' as const,
      speed: 1.3,
      waypoints: [
        [-4, 0.22 + FLOOR_HEIGHT * 2, 7],
        [-10, 0.22 + FLOOR_HEIGHT * 2, 7],
        [-16, 0.22 + FLOOR_HEIGHT * 2, 7],
        [-10, 0.22 + FLOOR_HEIGHT * 2, 7],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-4, 0.22 + FLOOR_HEIGHT * 2, 7),
      yaw: 0,
    },
    // Floor 2 - Nurse 15: Maternity Wing Baby Care Nurse
    {
      id: 'nurse-15',
      floor: 2,
      holdingItem: 'none' as const,
      speed: 1.1,
      waypoints: [
        [5, 0.22 + FLOOR_HEIGHT * 2, 8],
        [9, 0.22 + FLOOR_HEIGHT * 2, 8],
        [9, 0.22 + FLOOR_HEIGHT * 2, 5],
        [5, 0.22 + FLOOR_HEIGHT * 2, 5],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(5, 0.22 + FLOOR_HEIGHT * 2, 8),
      yaw: 0,
    },
    // Floor 2 - Nurse 16: Central Station Senior Charge Nurse
    {
      id: 'nurse-16',
      floor: 2,
      holdingItem: 'clipboard' as const,
      speed: 1.2,
      waypoints: [
        [-9, 0.22 + FLOOR_HEIGHT * 2, 1],
        [-13, 0.22 + FLOOR_HEIGHT * 2, 1],
        [-13, 0.22 + FLOOR_HEIGHT * 2, -1],
        [-9, 0.22 + FLOOR_HEIGHT * 2, -1],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-9, 0.22 + FLOOR_HEIGHT * 2, 1),
      yaw: 0,
    },
  ]).current;

  // --------------------------------------------------------------------------
  // AMBULATORY RECOVERING PATIENTS (Walking with crutches / IV poles)
  // --------------------------------------------------------------------------
  const ambulatoryPatientsRef = useRef([
    {
      id: 'pat-amb-1',
      floor: 0,
      holdingItem: 'crutch' as const,
      speed: 0.9,
      waypoints: [
        [-6, 0.22, 12],
        [-2, 0.22, 12],
        [3, 0.22, 10],
        [-2, 0.22, 12],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-6, 0.22, 12),
      yaw: 0,
    },
    {
      id: 'pat-amb-2',
      floor: 1,
      holdingItem: 'crutch' as const,
      speed: 0.8,
      waypoints: [
        [-14, 0.22 + FLOOR_HEIGHT, 3],
        [-8, 0.22 + FLOOR_HEIGHT, 3],
        [-14, 0.22 + FLOOR_HEIGHT, 3],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-14, 0.22 + FLOOR_HEIGHT, 3),
      yaw: 0,
    },
    {
      id: 'pat-amb-3',
      floor: 2,
      holdingItem: 'none' as const,
      speed: 0.85,
      waypoints: [
        [-8, 0.22 + FLOOR_HEIGHT * 2, 3],
        [-2, 0.22 + FLOOR_HEIGHT * 2, 3],
        [-8, 0.22 + FLOOR_HEIGHT * 2, 3],
      ] as [number, number, number][],
      wpIndex: 0,
      pos: new THREE.Vector3(-8, 0.22 + FLOOR_HEIGHT * 2, 3),
      yaw: 0,
    },
  ]).current;

  // Animation walk phase state
  const timeRef = useRef(0);

  // Update staff and ward boy waypoint navigation
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    timeRef.current += dt;

    const advanceAgent = (agent: {
      waypoints: [number, number, number][];
      wpIndex: number;
      pos: THREE.Vector3;
      speed: number;
      yaw: number;
    }) => {
      const target = agent.waypoints[agent.wpIndex];
      const targetVec = new THREE.Vector3(target[0], target[1], target[2]);
      const dist = agent.pos.distanceTo(targetVec);

      if (dist < 0.2) {
        agent.wpIndex = (agent.wpIndex + 1) % agent.waypoints.length;
      } else {
        const dir = targetVec.clone().sub(agent.pos).normalize();
        agent.pos.add(dir.multiplyScalar(agent.speed * dt));
        agent.yaw = Math.atan2(dir.x, dir.z);
      }
    };

    // Update all 10 Ward Boys
    for (const wb of wardBoysRef) {
      advanceAgent(wb);
    }

    // Update all 16 Nurses
    for (const n of nursesRef) {
      advanceAgent(n);
    }

    // Update Ambulatory Patients
    for (const p of ambulatoryPatientsRef) {
      advanceAgent(p);
    }
  });

  return (
    <group>
      {/* 1. 10 Active Ward Boys */}
      {wardBoysRef.map((wb, idx) => {
        if (selectedFloor !== null && wb.floor > selectedFloor) return null;
        const walkPhase = timeRef.current * 7 + idx * 1.7;

        return (
          <group
            key={`wb-agent-${wb.id}`}
            position={[wb.pos.x, wb.pos.y, wb.pos.z]}
            rotation={[0, wb.yaw, 0]}
          >
            <HumanoidMesh
              role="ward_boy"
              walkPhase={walkPhase}
              holdingItem={wb.holdingItem}
              breathPhase={timeRef.current * 2 + idx}
            />

            {/* Render rolling wheeled gurney stretcher ahead of ward boy if pushing */}
            {wb.holdingItem === 'stretcher' && (
              <group position={[0, 0, 1.3]}>
                {/* Wheeled stainless gurney frame */}
                <mesh position={[0, 0.45, 0]} castShadow>
                  <boxGeometry args={[0.9, 0.35, 1.9]} />
                  <meshStandardMaterial color="#E2E8F0" metalness={0.7} />
                </mesh>
                {/* Wheels */}
                {[-0.45, 0.45].map((wx) =>
                  [-0.8, 0.8].map((wz) => (
                    <mesh key={`st-w-${wx}-${wz}`} position={[wx, 0.12, wz]}>
                      <cylinderGeometry args={[0.1, 0.1, 0.06, 12]} />
                      <meshStandardMaterial color="#334155" />
                    </mesh>
                  ))
                )}
                {/* Patient resting on rolling stretcher being transferred */}
                <group position={[0, 0.42, 0.1]}>
                  <HumanoidMesh
                    role="patient"
                    isLying={true}
                    patientStatus="curing"
                    breathPhase={timeRef.current * 2.5 + idx}
                  />
                </group>
              </group>
            )}

            {/* Render wheelchair ahead of ward boy if pushing */}
            {wb.holdingItem === 'wheelchair' && (
              <group position={[0, 0, 0.95]}>
                {/* Chrome wheelchair frame */}
                <mesh position={[0, 0.4, 0]}>
                  <boxGeometry args={[0.65, 0.1, 0.65]} />
                  <meshStandardMaterial color="#334155" />
                </mesh>
                <mesh position={[0, 0.7, -0.3]}>
                  <boxGeometry args={[0.65, 0.5, 0.08]} />
                  <meshStandardMaterial color="#334155" />
                </mesh>
                {/* Big chrome wheels */}
                {[-0.38, 0.38].map((wx) => (
                  <mesh key={`wc-w-${wx}`} position={[wx, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.38, 0.38, 0.05, 16]} />
                    <meshStandardMaterial color="#94A3B8" metalness={0.9} />
                  </mesh>
                ))}
                {/* Recovering Patient seated in wheelchair */}
                <group position={[0, 0.4, 0]}>
                  <HumanoidMesh
                    role="patient"
                    isSitting={true}
                    patientStatus="recovering"
                    breathPhase={timeRef.current * 2 + idx}
                  />
                </group>
              </group>
            )}
          </group>
        );
      })}

      {/* 2. 16 Active Nurses */}
      {nursesRef.map((n, idx) => {
        if (selectedFloor !== null && n.floor > selectedFloor) return null;
        const walkPhase = timeRef.current * 7.2 + idx * 1.4;

        return (
          <group
            key={`nurse-agent-${n.id}`}
            position={[n.pos.x, n.pos.y, n.pos.z]}
            rotation={[0, n.yaw, 0]}
          >
            <HumanoidMesh
              role="nurse"
              walkPhase={walkPhase}
              holdingItem={n.holdingItem}
              breathPhase={timeRef.current * 2.2 + idx}
            />
          </group>
        );
      })}

      {/* 3. Ambulatory Recovering Patients */}
      {ambulatoryPatientsRef.map((p, idx) => {
        if (selectedFloor !== null && p.floor > selectedFloor) return null;
        const walkPhase = timeRef.current * 4.5 + idx * 2.0;

        return (
          <group
            key={`amb-pat-${p.id}`}
            position={[p.pos.x, p.pos.y, p.pos.z]}
            rotation={[0, p.yaw, 0]}
          >
            <HumanoidMesh
              role="patient"
              walkPhase={walkPhase}
              holdingItem={p.holdingItem}
              patientStatus="recovering"
              breathPhase={timeRef.current * 1.8 + idx}
            />
          </group>
        );
      })}

      {/* 4. Grand Reception Desk Staff (3 Receptionists + Admin Doctor) */}
      {(selectedFloor === null || selectedFloor === 0) && (
        <group>
          {/* Receptionist 1 */}
          <group position={[-1.5, 0.22, 3]} rotation={[0, 0, 0]}>
            <HumanoidMesh role="receptionist" isSitting={true} breathPhase={timeRef.current * 2} />
          </group>
          {/* Receptionist 2 */}
          <group position={[1.5, 0.22, 3]} rotation={[0, 0, 0]}>
            <HumanoidMesh role="receptionist" isSitting={true} breathPhase={timeRef.current * 2 + 1} />
          </group>
          {/* Receptionist 3 */}
          <group position={[4.5, 0.22, 3]} rotation={[0, 0, 0]}>
            <HumanoidMesh role="receptionist" isSitting={true} breathPhase={timeRef.current * 2 + 2} />
          </group>
          {/* Senior Patient Relations Doctor standing at reception greeting */}
          <group position={[-3.5, 0.22, 4.5]} rotation={[0, Math.PI / 4, 0]}>
            <HumanoidMesh role="doctor" walkPhase={0} breathPhase={timeRef.current * 1.8} />
          </group>

          {/* Visitors & Patients in Waiting Lounge Sofas */}
          <group position={[-3.5, 0.22, 9]} rotation={[0, Math.PI / 2, 0]}>
            <HumanoidMesh role="visitor" isSitting={true} breathPhase={timeRef.current * 2 + 0.5} />
          </group>
          <group position={[-3.5, 0.22, 12.5]} rotation={[0, Math.PI / 2, 0]}>
            <HumanoidMesh role="patient" isSitting={true} patientStatus="stable" breathPhase={timeRef.current * 1.9} />
          </group>
          <group position={[7.5, 0.22, 9]} rotation={[0, -Math.PI / 2, 0]}>
            <HumanoidMesh role="visitor" isSitting={true} breathPhase={timeRef.current * 2 + 1.2} />
          </group>
          <group position={[7.5, 0.22, 12.5]} rotation={[0, -Math.PI / 2, 0]}>
            <HumanoidMesh role="visitor" isSitting={true} breathPhase={timeRef.current * 2 + 2.1} />
          </group>

          {/* Visitors sitting on Central Row Chairs */}
          <group position={[0, 0.22, 9]} rotation={[0, 0, 0]}>
            <HumanoidMesh role="patient" isSitting={true} patientStatus="curing" breathPhase={timeRef.current * 2} />
          </group>
          <group position={[1.5, 0.22, 9]} rotation={[0, 0, 0]}>
            <HumanoidMesh role="visitor" isSitting={true} breathPhase={timeRef.current * 1.9 + 1} />
          </group>
          <group position={[3.0, 0.22, 9]} rotation={[0, 0, 0]}>
            <HumanoidMesh role="visitor" isSitting={true} breathPhase={timeRef.current * 2.1 + 2} />
          </group>
        </group>
      )}

      {/* 5. 1st Floor ICU Doctors & Surgical Team */}
      {(selectedFloor === null || selectedFloor >= 1) && (
        <group>
          {/* ICU Lead Intensivist Doctor at central desk */}
          <group position={[-6.5, 0.22 + FLOOR_HEIGHT, -15]} rotation={[0, 0, 0]}>
            <HumanoidMesh role="doctor" isSitting={true} breathPhase={timeRef.current * 1.7} />
          </group>
          {/* ICU Pulmonologist checking ventilator */}
          <group position={[-16, 0.22 + FLOOR_HEIGHT, -11]} rotation={[0, Math.PI / 2, 0]}>
            <HumanoidMesh role="doctor" walkPhase={0} breathPhase={timeRef.current * 2.0} />
          </group>
          {/* Operation Theatre 1 Lead Surgeon */}
          <group position={[16, 0.22 + FLOOR_HEIGHT, 7]} rotation={[0, Math.PI / 2, 0]}>
            <HumanoidMesh role="surgeon" walkPhase={0} breathPhase={timeRef.current * 2.1} />
          </group>
          {/* Operation Theatre 1 Anaesthesiologist */}
          <group position={[18.5, 0.22 + FLOOR_HEIGHT, 7]} rotation={[0, -Math.PI / 2, 0]}>
            <HumanoidMesh role="doctor" walkPhase={0} breathPhase={timeRef.current * 1.9} />
          </group>
        </group>
      )}
    </group>
  );
}
