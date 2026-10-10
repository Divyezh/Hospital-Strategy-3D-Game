'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { AutoRickshawMesh } from './AutoRickshawMesh';
import { CityBusMesh } from './CityBusMesh';
import { TaxiCabMesh } from './TaxiCabMesh';
import { HumanoidMesh } from './HumanoidMesh';
import { EXPLORE_TOKENS } from '@/explore/tokens';

// Waypoint structure for active transportation routes
interface RoutePoint {
  x: number;
  z: number;
  isStop?: boolean;
  stopName?: string;
  speed?: number; // target speed in m/s
}

// Transit Bus Route (Looping across the 3 stations on the expanded road network)
const BUS_ROUTE: RoutePoint[] = [
  // 1. Station 1: Hospital Central Terminal (South Boulevard)
  { x: 14, z: 68.5, speed: 5.0 },
  { x: 22, z: 68.5, isStop: true, stopName: 'Hospital Central Terminal', speed: 0 },
  { x: 30, z: 68.5, speed: 6.0 },
  { x: 75, z: 68.5, speed: 9.0 },
  // Turn North onto East Avenue
  { x: 105, z: 65, speed: 7.0 },
  { x: 115, z: 54, speed: 7.0 },
  // 2. Station 2: East Commercial & Canteen Hub Bus Station
  { x: 115, z: 38, speed: 5.0 },
  { x: 115, z: 30, isStop: true, stopName: 'East Commons Bus Station', speed: 0 },
  { x: 115, z: 20, speed: 6.0 },
  { x: 115, z: -80, speed: 10.0 },
  // Turn West onto North Expressway
  { x: 105, z: -135, speed: 7.0 },
  { x: 75, z: -145, speed: 9.0 },
  { x: 0, z: -145, speed: 11.0 },
  { x: -75, z: -145, speed: 9.0 },
  // Turn South onto West Avenue
  { x: -105, z: -135, speed: 7.0 },
  { x: -115, z: -80, speed: 10.0 },
  // 3. Station 3: West Metro Transit Exchange Bus Station
  { x: -115, z: 20, speed: 6.0 },
  { x: -115, z: 30, isStop: true, stopName: 'West Metro Bus Station', speed: 0 },
  { x: -115, z: 38, speed: 5.0 },
  // Turn East onto South Boulevard
  { x: -105, z: 65, speed: 7.0 },
  { x: -75, z: 68.5, speed: 9.0 },
  { x: -20, z: 68.5, speed: 7.0 },
];

// Active Rickshaw Transportation Route 1 (South Boulevard & Hospital Stand)
const RICKSHAW_ROUTE_1: RoutePoint[] = [
  { x: -70, z: 70.0, speed: 6.0 },
  { x: -30, z: 70.0, speed: 4.5 },
  { x: -18, z: 66.5, isStop: true, stopName: 'Auto Stand Pickup', speed: 0 }, // Stop at Rickshaw Stand
  { x: -6, z: 70.0, speed: 5.5 },
  { x: 25, z: 70.0, speed: 6.5 },
  { x: 65, z: 70.0, speed: 7.0 },
  { x: 65, z: 78.0, speed: 5.0 }, // U-turn on boulevard
  { x: 25, z: 78.0, speed: 7.0 },
  { x: -20, z: 78.0, speed: 7.0 },
  { x: -70, z: 78.0, speed: 7.0 },
  { x: -70, z: 70.0, speed: 5.0 },
];

// Active Rickshaw Transportation Route 2 (East Avenue to Hospital)
const RICKSHAW_ROUTE_2: RoutePoint[] = [
  { x: 115, z: 70, speed: 6.5 },
  { x: 80, z: 70, speed: 7.0 },
  { x: 35, z: 70, speed: 7.0 },
  { x: -10, z: 70, speed: 7.0 },
  { x: -50, z: 70, speed: 7.0 },
  { x: -50, z: 78, speed: 5.0 },
  { x: -10, z: 78, speed: 7.0 },
  { x: 35, z: 78, speed: 7.0 },
  { x: 80, z: 78, speed: 7.0 },
  { x: 115, z: 78, speed: 6.5 },
];

// Active Taxi Transportation Route (Airport / Metro to Hospital Stand)
const TAXI_ROUTE_1: RoutePoint[] = [
  { x: -90, z: 71.5, speed: 9.0 },
  { x: 0, z: 71.5, speed: 8.0 },
  { x: 50, z: 66.5, isStop: true, stopName: 'Taxi Stand Drop-off', speed: 0 }, // Stop at Taxi Stand
  { x: 70, z: 71.5, speed: 7.0 },
  { x: 130, z: 71.5, speed: 9.0 },
  { x: 130, z: 77.0, speed: 6.0 },
  { x: 70, z: 77.0, speed: 9.0 },
  { x: 0, z: 77.0, speed: 9.0 },
  { x: -90, z: 77.0, speed: 9.0 },
  { x: -90, z: 71.5, speed: 6.0 },
];

export function TransitHubAndVehicles() {
  // Bus simulation references
  const bus1Ref = useRef<THREE.Group>(null);
  const bus2Ref = useRef<THREE.Group>(null);
  const bus1Progress = useRef<number>(0);
  const bus2Progress = useRef<number>(BUS_ROUTE.length * 0.5); // Staggered by half route
  const bus1StopTimer = useRef<number>(0);
  const bus2StopTimer = useRef<number>(0);
  const bus1WheelAngle = useRef<number>(0);
  const bus2WheelAngle = useRef<number>(0);

  // Rickshaw simulation references
  const rickshaw1Ref = useRef<THREE.Group>(null);
  const rickshaw2Ref = useRef<THREE.Group>(null);
  const rickshaw3Ref = useRef<THREE.Group>(null);
  const rickshaw1Progress = useRef<number>(0);
  const rickshaw2Progress = useRef<number>(4);
  const rickshaw3Progress = useRef<number>(0);
  const rickshaw1StopTimer = useRef<number>(0);
  const rickshawWheel1 = useRef<number>(0);
  const rickshawWheel2 = useRef<number>(0);
  const rickshawWheel3 = useRef<number>(0);

  // Taxi simulation references
  const taxi1Ref = useRef<THREE.Group>(null);
  const taxi1Progress = useRef<number>(0);
  const taxi1StopTimer = useRef<number>(0);
  const taxiWheel1 = useRef<number>(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    // =========================================================================
    // 1. CITY BUS 1 & 2 ROUTE SIMULATION
    // =========================================================================
    const updateVehicleOnRoute = (
      groupRef: THREE.Group | null,
      route: RoutePoint[],
      progRef: React.MutableRefObject<number>,
      timerRef: React.MutableRefObject<number>,
      wheelRef: React.MutableRefObject<number>,
      defaultSpeed: number,
      stopDuration: number,
      wheelRadius: number
    ) => {
      if (!groupRef) return { isStopped: false };

      const totalSegments = route.length;
      const currIdx = Math.floor(progRef.current) % totalSegments;
      const nextIdx = (currIdx + 1) % totalSegments;

      const pCurr = route[currIdx];
      const pNext = route[nextIdx];

      const dx = pNext.x - pCurr.x;
      const dz = pNext.z - pCurr.z;
      const segLen = Math.sqrt(dx * dx + dz * dz) || 1;

      // Check if current waypoint is a scheduled stop
      if (pCurr.isStop && timerRef.current < stopDuration) {
        timerRef.current += dt;
        groupRef.position.set(pCurr.x, 0.15, pCurr.z);
        groupRef.rotation.y = Math.atan2(dx, dz);
        return { isStopped: true };
      }

      // Driving mode
      let targetSpeed = pCurr.speed !== undefined && pCurr.speed > 0 ? pCurr.speed : defaultSpeed;
      if (timerRef.current >= stopDuration) {
        // Accelerating away from stop
        targetSpeed = Math.min(defaultSpeed, 2.5 + (timerRef.current - stopDuration) * 3);
      }

      const distStep = targetSpeed * dt;
      progRef.current += distStep / segLen;
      wheelRef.current += distStep / wheelRadius;

      // Wrap around whole route
      if (progRef.current >= totalSegments) {
        progRef.current -= totalSegments;
      }

      // If moved to next segment, reset stop timer
      if (Math.floor(progRef.current) !== currIdx) {
        timerRef.current = 0;
      }

      const segFrac = progRef.current - Math.floor(progRef.current);
      const posX = pCurr.x + dx * segFrac;
      const posZ = pCurr.z + dz * segFrac;
      const yaw = Math.atan2(dx, dz);

      groupRef.position.set(posX, 0.15, posZ);
      groupRef.rotation.y = yaw;

      return { isStopped: false };
    };

    // Update Bus 1 (Teak/White City Bus)
    const bus1Status = updateVehicleOnRoute(
      bus1Ref.current,
      BUS_ROUTE,
      bus1Progress,
      bus1StopTimer,
      bus1WheelAngle,
      8.0,
      3.8, // 3.8s stop at station
      0.48
    );

    // Update Bus 2 (Blue/White City Bus, staggered)
    const bus2Status = updateVehicleOnRoute(
      bus2Ref.current,
      BUS_ROUTE,
      bus2Progress,
      bus2StopTimer,
      bus2WheelAngle,
      8.0,
      3.8,
      0.48
    );

    // Update Rickshaw 1 (Hospital Stand Route)
    updateVehicleOnRoute(
      rickshaw1Ref.current,
      RICKSHAW_ROUTE_1,
      rickshaw1Progress,
      rickshaw1StopTimer,
      rickshawWheel1,
      6.2,
      3.0,
      0.22
    );

    // Update Rickshaw 2 (East Avenue Route)
    updateVehicleOnRoute(
      rickshaw2Ref.current,
      RICKSHAW_ROUTE_2,
      rickshaw2Progress,
      rickshaw1StopTimer,
      rickshawWheel2,
      6.5,
      0.5,
      0.22
    );

    // Update Rickshaw 3 (West Avenue Route)
    updateVehicleOnRoute(
      rickshaw3Ref.current,
      RICKSHAW_ROUTE_1,
      rickshaw3Progress,
      rickshaw1StopTimer,
      rickshawWheel3,
      5.8,
      2.0,
      0.22
    );

    // Update Taxi 1 (Airport/City Drop-off)
    updateVehicleOnRoute(
      taxi1Ref.current,
      TAXI_ROUTE_1,
      taxi1Progress,
      taxi1StopTimer,
      taxiWheel1,
      8.5,
      3.5,
      0.32
    );
  });

  return (
    <group position={[0, 0, 0]}>
      {/* =========================================================================
          1. BUS STATION 1: HOSPITAL CENTRAL TERMINAL (NEAR HOSPITAL ENTRANCE)
             Located at X: 24, Z: 64 to 76
         ========================================================================= */}
      <group position={[24, 0, 64]}>
        {/* Raised Passenger Boarding Platform with Tactile Safety Edge */}
        <mesh position={[0, 0.16, 0]} receiveShadow>
          <boxGeometry args={[22, 0.16, 4.2]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
        </mesh>
        {/* Yellow tactile paving curb line along bus bay */}
        <mesh position={[0, 0.25, 2.0]}>
          <boxGeometry args={[22, 0.02, 0.22]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.4} />
        </mesh>

        {/* Modern Sweeping Glass Canopy */}
        <group position={[0, 0, 0]}>
          {/* 4 Tubular White Steel Support Columns */}
          {[-8, -2.5, 2.5, 8].map((cx) => (
            <mesh key={`b1-col-${cx}`} position={[cx, 2.2, -1.2]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 4.4, 12]} />
              <meshStandardMaterial color="#F8FAFC" metalness={0.8} />
            </mesh>
          ))}
          {/* Overhead Curved Glass Roof */}
          <mesh position={[0, 4.3, 0]} rotation={[0.06, 0, 0]} castShadow>
            <boxGeometry args={[23, 0.12, 5.2]} />
            <meshStandardMaterial
              color="#0284C7"
              transparent
              opacity={0.4}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
          {/* Canopy Fascia Trim */}
          <mesh position={[0, 4.32, 2.6]}>
            <boxGeometry args={[23.2, 0.24, 0.08]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
        </group>

        {/* Large Electronic LED Route & Arrival Matrix Display */}
        <group position={[0, 3.6, -1.0]}>
          <mesh castShadow>
            <boxGeometry args={[6.5, 0.8, 0.2]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <Text
            position={[0, 0.16, 0.11]}
            fontSize={0.24}
            color="#38BDF8"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            TERMINAL 1: HOSPITAL CENTRAL
          </Text>
          <Text
            position={[0, -0.16, 0.11]}
            fontSize={0.16}
            color="#FDE047"
            anchorX="center"
            anchorY="middle"
          >
            101 MEDICITY EXP: ARRIVING | 102 AIRPORT: 6 MIN
          </Text>
        </group>

        {/* Modern Wooden Passenger Benches */}
        <group position={[-5, 0.25, -0.8]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[3.2, 0.08, 0.55]} />
            <meshStandardMaterial color="#B45309" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.65, -0.24]} castShadow>
            <boxGeometry args={[3.2, 0.5, 0.06]} />
            <meshStandardMaterial color="#B45309" roughness={0.6} />
          </mesh>
          <mesh position={[-1.2, 0.18, 0]}>
            <boxGeometry args={[0.08, 0.36, 0.5]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[1.2, 0.18, 0]}>
            <boxGeometry args={[0.08, 0.36, 0.5]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
        </group>

        <group position={[5, 0.25, -0.8]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[3.2, 0.08, 0.55]} />
            <meshStandardMaterial color="#B45309" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.65, -0.24]} castShadow>
            <boxGeometry args={[3.2, 0.5, 0.06]} />
            <meshStandardMaterial color="#B45309" roughness={0.6} />
          </mesh>
        </group>

        {/* Timetable Information Totem Kiosk */}
        <group position={[9.5, 0.25, -0.5]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[0.65, 2.4, 0.18]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[0, 1.3, 0.1]}>
            <boxGeometry args={[0.55, 1.4, 0.02]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>

        {/* Waiting Passengers at Terminal 1 */}
        <group position={[-5, 0.25, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#DC2626" isSitting />
        </group>
        <group position={[-4, 0.25, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#2563EB" isSitting />
        </group>
        <group position={[1, 0.25, 0.8]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#15803D" holdingItem="clipboard" />
        </group>
        <group position={[3, 0.25, 0.8]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="nurse" />
        </group>
        <group position={[-1, 0.25, 1.0]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#9333EA" />
        </group>
      </group>

      {/* =========================================================================
          2. BUS STATION 2: EAST COMMONS & CANTEEN HUB BUS STATION
             Located on East Avenue at X: 115, Z: 30
         ========================================================================= */}
      <group position={[125, 0, 30]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Boarding platform */}
        <mesh position={[0, 0.16, 0]} receiveShadow>
          <boxGeometry args={[18, 0.16, 3.8]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 1.8]}>
          <boxGeometry args={[18, 0.02, 0.22]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>

        {/* Dual-Bay Glass Bus Shelter with Solar Roof */}
        <mesh position={[0, 3.8, 0]} castShadow>
          <boxGeometry args={[16, 0.1, 4.4]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        {/* Solar panels on roof */}
        <mesh position={[0, 3.9, 0]}>
          <boxGeometry args={[15, 0.04, 3.8]} />
          <meshStandardMaterial color="#1E3A8A" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glass back wall */}
        <mesh position={[0, 2.0, -1.8]}>
          <boxGeometry args={[15.6, 3.5, 0.06]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.4} />
        </mesh>

        {/* Electronic Arrival Display */}
        <group position={[0, 3.2, -1.5]}>
          <mesh>
            <boxGeometry args={[5.2, 0.65, 0.15]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <Text
            position={[0, 0.1, 0.09]}
            fontSize={0.22}
            color="#34D399"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            STATION 2: EAST COMMONS & PLAZA
          </Text>
          <Text
            position={[0, -0.14, 0.09]}
            fontSize={0.14}
            color="#FEF08A"
            anchorX="center"
            anchorY="middle"
          >
            NEXT BUS: 101 MEDICITY EXP (DOCKING)
          </Text>
        </group>

        {/* Waiting Passengers */}
        <group position={[-2, 0.25, 0]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#D97706" />
        </group>
        <group position={[2, 0.25, 0]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="doctor" />
        </group>
      </group>

      {/* =========================================================================
          3. BUS STATION 3: WEST METRO TRANSIT EXCHANGE BUS STATION
             Located on West Avenue at X: -115, Z: 30
         ========================================================================= */}
      <group position={[-125, 0, 30]} rotation={[0, Math.PI / 2, 0]}>
        {/* Boarding platform */}
        <mesh position={[0, 0.16, 0]} receiveShadow>
          <boxGeometry args={[18, 0.16, 3.8]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 1.8]}>
          <boxGeometry args={[18, 0.02, 0.22]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>

        {/* Glass transit pavilion */}
        <mesh position={[0, 3.8, 0]} castShadow>
          <boxGeometry args={[16, 0.1, 4.4]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        <mesh position={[0, 2.0, -1.8]}>
          <boxGeometry args={[15.6, 3.5, 0.06]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.4} />
        </mesh>

        {/* Electronic Display */}
        <group position={[0, 3.2, -1.5]}>
          <mesh>
            <boxGeometry args={[5.2, 0.65, 0.15]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <Text
            position={[0, 0.1, 0.09]}
            fontSize={0.22}
            color="#38BDF8"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            STATION 3: WEST METRO & EXPRESS
          </Text>
          <Text
            position={[0, -0.14, 0.09]}
            fontSize={0.14}
            color="#FEF08A"
            anchorX="center"
            anchorY="middle"
          >
            NEXT BUS: 101 MEDICITY EXP (ON ROUTE)
          </Text>
        </group>

        {/* Waiting Passengers */}
        <group position={[-1, 0.25, 0]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#4F46E5" />
        </group>
        <group position={[1.5, 0.25, 0]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#DC2626" />
        </group>
      </group>

      {/* =========================================================================
          4. DEDICATED AUTO-RICKSHAW STAND & STATIONED RICKSHAWS (STAND 1)
             Located at X: -18, Z: 64 to 72
         ========================================================================= */}
      <group position={[-18, 0, 64]}>
        {/* Paved Rickshaw Stand Apron */}
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <boxGeometry args={[16, 0.08, 6.2]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {/* Yellow Diagonal Striping for 5 Marked Rickshaw Bays */}
        {[-5.5, -2.75, 0, 2.75, 5.5].map((bx, i) => (
          <group key={`rick-bay-${i}`} position={[bx, 0.17, 0]}>
            {/* Bay boundary lines */}
            <mesh position={[-1.2, 0, 0]}>
              <boxGeometry args={[0.08, 0.01, 5.2]} />
              <meshStandardMaterial color="#FBBF24" />
            </mesh>
            <mesh position={[1.2, 0, 0]}>
              <boxGeometry args={[0.08, 0.01, 5.2]} />
              <meshStandardMaterial color="#FBBF24" />
            </mesh>
            {/* Concrete wheel curb stop */}
            <mesh position={[0, 0.08, -2.4]} castShadow>
              <boxGeometry args={[1.8, 0.14, 0.2]} />
              <meshStandardMaterial color="#CBD5E1" />
            </mesh>
          </group>
        ))}

        {/* Large Prominent Signboard Archway */}
        <group position={[0, 0, 2.8]}>
          <mesh position={[-7.5, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4.4, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          <mesh position={[7.5, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4.4, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          {/* Signboard Header */}
          <mesh position={[0, 4.1, 0]} castShadow>
            <boxGeometry args={[15.5, 0.75, 0.15]} />
            <meshStandardMaterial color="#16A34A" />
          </mesh>
          <Text
            position={[0, 4.22, 0.09]}
            fontSize={0.28}
            color="#FEF08A"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            ★ PREPAID AUTO RICKSHAW STAND (24x7) ★
          </Text>
          <Text
            position={[0, 3.96, 0.09]}
            fontSize={0.16}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            GOVERNMENT APPROVED METERED SERVICE | MIN FARE $1.50
          </Text>
        </group>

        {/* Dispatcher Booth / Fare Card Kiosk */}
        <group position={[-7, 0.16, -1.5]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[1.8, 2.4, 1.8]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.4, 0.92]}>
            <boxGeometry args={[1.2, 0.9, 0.04]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.5} />
          </mesh>
          {/* Dispatcher officer inside */}
          <group position={[0, 0.5, 0]}>
            <HumanoidMesh role="guard" />
          </group>
        </group>

        {/* Rickshaw 1 (Stationed in Bay 1, Green & Yellow) */}
        <group position={[-5.5, 0.16, 0]} rotation={[0, Math.PI, 0]}>
          <AutoRickshawMesh colorScheme="green_yellow" hasDriver={true} />
        </group>

        {/* Rickshaw 2 (Stationed in Bay 2, Black & Yellow) */}
        <group position={[-2.75, 0.16, 0]} rotation={[0, Math.PI, 0]}>
          <AutoRickshawMesh colorScheme="black_yellow" hasDriver={false} />
        </group>

        {/* Rickshaw driver character standing outside Bay 2 chatting */}
        <group position={[-1.6, 0.16, 0.6]} rotation={[0, -Math.PI / 2, 0]}>
          <HumanoidMesh
            role="visitor"
            shirtColorOverride="#D97706" // Khaki driver shirt
            pantsColorOverride="#1E293B"
          />
        </group>

        {/* Passengers waiting at rickshaw stand */}
        <group position={[3.5, 0.16, 1.5]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#2563EB" holdingItem="food_tray" />
        </group>
        <group position={[5.2, 0.16, 1.5]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#EC4899" />
        </group>
      </group>

      {/* =========================================================================
          5. DEDICATED TAXI STAND / CAB RANK (STAND 2)
             Located at X: 52, Z: 64 to 72
         ========================================================================= */}
      <group position={[52, 0, 64]}>
        {/* Paved Taxi Apron */}
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <boxGeometry args={[18, 0.08, 6.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>

        {/* 4 Marked Taxi Cab Bays */}
        {[-6, -2, 2, 6].map((tx, i) => (
          <group key={`taxi-bay-${i}`} position={[tx, 0.17, 0]}>
            <mesh position={[-1.6, 0, 0]}>
              <boxGeometry args={[0.08, 0.01, 5.2]} />
              <meshStandardMaterial color="#F59E0B" />
            </mesh>
            <mesh position={[1.6, 0, 0]}>
              <boxGeometry args={[0.08, 0.01, 5.2]} />
              <meshStandardMaterial color="#F59E0B" />
            </mesh>
            <mesh position={[0, 0.08, -2.4]} castShadow>
              <boxGeometry args={[2.2, 0.14, 0.2]} />
              <meshStandardMaterial color="#CBD5E1" />
            </mesh>
          </group>
        ))}

        {/* Large Taxi Stand Archway */}
        <group position={[0, 0, 2.8]}>
          <mesh position={[-8.5, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4.4, 8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
          <mesh position={[8.5, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4.4, 8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
          <mesh position={[0, 4.1, 0]} castShadow>
            <boxGeometry args={[17.5, 0.75, 0.15]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          <Text
            position={[0, 4.22, 0.09]}
            fontSize={0.28}
            color="#0F172A"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            ★ CITY CAB & TAXI STAND - 24/7 AIRPORT & CITY SERVICE ★
          </Text>
          <Text
            position={[0, 3.96, 0.09]}
            fontSize={0.16}
            color="#1E293B"
            anchorX="center"
            anchorY="middle"
          >
            SEDAN & SUV CABS | PRE-BOOKED & ON-DEMAND PICKUP
          </Text>
        </group>

        {/* Stationed Taxi 1 (Parked in Bay 1) */}
        <group position={[-6, 0.16, 0]} rotation={[0, Math.PI, 0]}>
          <TaxiCabMesh hasDriver={true} />
        </group>

        {/* Stationed Taxi 2 (Parked in Bay 2) */}
        <group position={[-2, 0.16, 0]} rotation={[0, Math.PI, 0]}>
          <TaxiCabMesh hasDriver={false} />
        </group>

        {/* Passenger Queue Stanchions & Waiting Passengers */}
        <group position={[4, 0.16, 1.2]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#1E293B" holdingItem="clipboard" />
        </group>
        <group position={[6, 0.16, 1.2]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#0D9488" />
        </group>
      </group>

      {/* =========================================================================
          6. ACTIVE CITY TRANSIT BUSES DRIVING FOR TRANSPORTATION (BUS 1 & BUS 2)
         ========================================================================= */}
      {/* City Bus 1 (Teal & White livery) */}
      <group ref={bus1Ref} position={[22, 0.15, 68.5]}>
        <CityBusMesh
          routeNumber="101"
          destination="MEDICITY EXP"
          wheelRotation={bus1WheelAngle.current}
          doorsOpen={bus1StopTimer.current > 0.5 && bus1StopTimer.current < 3.2}
          colorTheme="teal_white"
        />
      </group>

      {/* City Bus 2 (Blue & White livery, staggered route) */}
      <group ref={bus2Ref} position={[-115, 0.15, 30]}>
        <CityBusMesh
          routeNumber="102"
          destination="CITY METRO"
          wheelRotation={bus2WheelAngle.current}
          doorsOpen={bus2StopTimer.current > 0.5 && bus2StopTimer.current < 3.2}
          colorTheme="blue_white"
        />
      </group>

      {/* =========================================================================
          7. ACTIVE AUTO-RICKSHAWS DRIVING FOR TRANSPORTATION (RICKSHAWS 3, 4, 5)
         ========================================================================= */}
      {/* Rickshaw 3: Driving on South Boulevard & stopping at stand */}
      <group ref={rickshaw1Ref} position={[-70, 0.15, 70]}>
        <AutoRickshawMesh
          colorScheme="green_yellow"
          wheelRotation={rickshawWheel1.current}
          hasDriver={true}
          hasPassenger={true}
        />
      </group>

      {/* Rickshaw 4: Driving on East Avenue */}
      <group ref={rickshaw2Ref} position={[115, 0.15, 70]}>
        <AutoRickshawMesh
          colorScheme="black_yellow"
          wheelRotation={rickshawWheel2.current}
          hasDriver={true}
          hasPassenger={false}
        />
      </group>

      {/* Rickshaw 5: Driving on West Avenue */}
      <group ref={rickshaw3Ref} position={[-115, 0.15, 70]}>
        <AutoRickshawMesh
          colorScheme="green_yellow"
          wheelRotation={rickshawWheel3.current}
          hasDriver={true}
          hasPassenger={true}
        />
      </group>

      {/* =========================================================================
          8. ACTIVE MOVING TAXI CAB DRIVING ON SOUTH BOULEVARD
         ========================================================================= */}
      <group ref={taxi1Ref} position={[-90, 0.15, 71.5]}>
        <TaxiCabMesh wheelRotation={taxiWheel1.current} hasDriver={true} />
      </group>
    </group>
  );
}
