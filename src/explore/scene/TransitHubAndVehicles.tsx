'use client';

import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { AutoRickshawMesh } from './AutoRickshawMesh';
import { CityBusMesh } from './CityBusMesh';
import { TaxiCabMesh } from './TaxiCabMesh';
import { SportsCarMesh } from './SportsCarMesh';
import { SuvCarMesh } from './SuvCarMesh';
import { SedanCarMesh } from './SedanCarMesh';
import { HumanoidMesh, HumanoidRole, HoldingItem } from './HumanoidMesh';
import { trafficManager, VehicleCategory } from '@/explore/sim/trafficManager';

// Waypoint structure for active transportation routes
interface RoutePoint {
  x: number;
  z: number;
  isStop?: boolean;
  stopName?: string;
  speed?: number; // target speed in m/s
}

// 1. Transit Bus Route (Clockwise/Counter-clockwise loop across 3 stations)
const BUS_ROUTE: RoutePoint[] = [
  // Station 1: Hospital Central Terminal (South Boulevard, Eastbound)
  { x: 14, z: 68.5, speed: 5.5 },
  { x: 22, z: 68.5, isStop: true, stopName: 'Hospital Central Terminal', speed: 0 },
  { x: 32, z: 68.5, speed: 6.5 },
  { x: 75, z: 68.5, speed: 9.0 },
  // Turn North onto East Avenue (East lane X: 118)
  { x: 108, z: 66, speed: 7.0 },
  { x: 118, z: 54, speed: 7.0 },
  // Station 2: East Commercial & Canteen Hub Bus Station
  { x: 118, z: 38, speed: 5.0 },
  { x: 118, z: 30, isStop: true, stopName: 'East Commons Bus Station', speed: 0 },
  { x: 118, z: 20, speed: 6.0 },
  { x: 118, z: -80, speed: 10.0 },
  // Turn West onto North Expressway (Westbound lane Z: -148)
  { x: 108, z: -138, speed: 7.0 },
  { x: 75, z: -148, speed: 9.0 },
  { x: 0, z: -148, speed: 11.0 },
  { x: -75, z: -148, speed: 9.0 },
  // Turn South onto West Avenue (West lane X: -118)
  { x: -108, z: -138, speed: 7.0 },
  { x: -118, z: -80, speed: 10.0 },
  // Station 3: West Metro Transit Exchange Bus Station
  { x: -118, z: 20, speed: 6.0 },
  { x: -118, z: 30, isStop: true, stopName: 'West Metro Bus Station', speed: 0 },
  { x: -118, z: 38, speed: 5.0 },
  // Turn East onto South Boulevard (Eastbound lane Z: 68.5)
  { x: -108, z: 66, speed: 7.0 },
  { x: -75, z: 68.5, speed: 9.0 },
  { x: -20, z: 68.5, speed: 7.0 },
];

// 2. Active Rickshaw Route 1 (South Boulevard & Hospital Stand)
const RICKSHAW_ROUTE_1: RoutePoint[] = [
  { x: -70, z: 70.0, speed: 6.0 },
  { x: -30, z: 70.0, speed: 4.5 },
  { x: -18, z: 66.5, isStop: true, stopName: 'Auto Stand Pickup', speed: 0 }, // Stop at Rickshaw Stand
  { x: -6, z: 70.0, speed: 5.5 },
  { x: 25, z: 70.0, speed: 6.5 },
  { x: 65, z: 70.0, speed: 7.0 },
  // Smooth U-turn across median onto Westbound lane (Z: 78.5)
  { x: 74, z: 74.0, speed: 4.5 },
  { x: 65, z: 78.5, speed: 5.5 },
  { x: 25, z: 78.5, speed: 7.0 },
  { x: -20, z: 78.5, speed: 7.0 },
  { x: -70, z: 78.5, speed: 7.0 },
  // Smooth U-turn across median onto Eastbound lane (Z: 70.0)
  { x: -78, z: 74.0, speed: 4.5 },
  { x: -70, z: 70.0, speed: 5.0 },
];

// 3. Active Rickshaw Route 2 (East Avenue & Canteen Plaza Feeder)
const RICKSHAW_ROUTE_2: RoutePoint[] = [
  { x: 112, z: -10, speed: 6.0 },
  { x: 112, z: 15, speed: 5.0 },
  { x: 112, z: 42, speed: 5.5 },
  // Turn West onto South Boulevard Westbound lane (Z: 78.5)
  { x: 104, z: 78.5, speed: 6.0 },
  { x: 60, z: 78.5, speed: 7.0 },
  { x: 20, z: 78.5, speed: 6.5 },
  // U-turn across median to Eastbound lane (Z: 70.5)
  { x: 10, z: 74.0, speed: 4.5 },
  { x: 20, z: 70.5, speed: 6.5 },
  { x: 60, z: 70.5, speed: 7.0 },
  { x: 104, z: 70.5, speed: 6.0 },
  // Turn North onto East Avenue (East lane X: 118)
  { x: 118, z: 54, speed: 6.0 },
  { x: 118, z: 10, speed: 7.0 },
  { x: 118, z: -10, speed: 6.0 },
  // U-turn to Southbound lane (X: 112)
  { x: 115, z: -20, speed: 4.5 },
];

// 4. Active Rickshaw Route 3 (West Avenue & Metro Station Feeder)
// Separate stopping berth at X: -112 to eliminate stoppage conflict with the bus
const RICKSHAW_ROUTE_3: RoutePoint[] = [
  { x: -118, z: -10, speed: 6.0 },
  { x: -118, z: 20, speed: 5.0 },
  { x: -118, z: 52, speed: 5.5 },
  // Turn East onto South Boulevard Eastbound lane (Z: 70.5)
  { x: -104, z: 70.5, speed: 6.0 },
  { x: -60, z: 70.5, speed: 7.0 },
  { x: -20, z: 70.5, speed: 6.5 },
  // U-turn across median to Westbound lane (Z: 78.5)
  { x: -10, z: 74.0, speed: 4.5 },
  { x: -20, z: 78.5, speed: 6.5 },
  { x: -60, z: 78.5, speed: 7.0 },
  { x: -104, z: 78.5, speed: 6.0 },
  // Turn North onto West Avenue (East lane X: -112)
  { x: -112, z: 54, speed: 6.0 },
  { x: -112, z: 10, speed: 7.0 },
  { x: -112, z: -10, speed: 6.0 },
  // U-turn to Southbound lane (X: -118)
  { x: -115, z: -20, speed: 4.5 },
];

// 5. Active Taxi Route 1 (Airport/City to Hospital Cab Stand)
const TAXI_ROUTE_1: RoutePoint[] = [
  { x: -90, z: 71.5, speed: 9.0 },
  { x: 0, z: 71.5, speed: 8.0 },
  { x: 50, z: 66.5, isStop: true, stopName: 'Taxi Stand Drop-off', speed: 0 },
  { x: 70, z: 71.5, speed: 7.0 },
  { x: 130, z: 71.5, speed: 9.0 },
  // U-turn across median onto Westbound lane (Z: 78.5)
  { x: 138, z: 75.0, speed: 5.5 },
  { x: 130, z: 78.5, speed: 7.0 },
  { x: 70, z: 78.5, speed: 9.0 },
  { x: 0, z: 78.5, speed: 9.0 },
  { x: -90, z: 78.5, speed: 9.0 },
  { x: -98, z: 75.0, speed: 5.5 },
  { x: -90, z: 71.5, speed: 6.0 },
];

// 6. Active Sports Car Route (High-speed outer arterial circuit)
const SPORTS_CAR_ROUTE: RoutePoint[] = [
  { x: -90, z: 71.5, speed: 13.0 },
  { x: 10, z: 71.5, speed: 14.0 },
  { x: 95, z: 71.5, speed: 11.0 },
  // Turn North onto East Avenue outer lane
  { x: 120, z: 50, speed: 12.0 },
  { x: 120, z: -120, speed: 14.0 },
  // Turn West onto North Expressway
  { x: 80, z: -148, speed: 15.0 },
  { x: -70, z: -148, speed: 15.0 },
  // Turn South onto West Avenue
  { x: -118, z: -120, speed: 12.0 },
  { x: -118, z: 50, speed: 12.0 },
  // Turn East onto South Boulevard
  { x: -95, z: 71.5, speed: 11.0 },
];

// 7. Active Luxury SUV Route (South Boulevard & Commercial Corridor)
const SUV_CAR_ROUTE: RoutePoint[] = [
  { x: 120, z: 78.5, speed: 9.5 },
  { x: 20, z: 78.5, speed: 10.0 },
  { x: -110, z: 78.5, speed: 9.5 },
  // U-turn to Eastbound lane
  { x: -120, z: 74.5, speed: 5.5 },
  { x: -110, z: 70.5, speed: 9.5 },
  { x: 20, z: 70.5, speed: 10.0 },
  { x: 120, z: 70.5, speed: 9.5 },
  // U-turn to Westbound lane
  { x: 130, z: 74.5, speed: 5.5 },
];

// 8. Active Executive Sedan Route (Metropolitan East-West Commuter)
const SEDAN_CAR_ROUTE: RoutePoint[] = [
  { x: -100, z: 70.5, speed: 10.0 },
  { x: 0, z: 70.5, speed: 10.5 },
  { x: 100, z: 70.5, speed: 10.0 },
  // U-turn to Westbound lane
  { x: 115, z: 74.5, speed: 5.5 },
  { x: 100, z: 78.5, speed: 10.0 },
  { x: 0, z: 78.5, speed: 10.5 },
  { x: -100, z: 78.5, speed: 10.0 },
  // U-turn to Eastbound lane
  { x: -115, z: 74.5, speed: 5.5 },
];

// =============================================================================
// SUB-COMPONENT: Dynamic Boarding Passenger Actor
// =============================================================================
interface BoardingPassengerProps {
  startPos: [number, number, number];
  doorPos: [number, number, number];
  seatPos: [number, number, number];
  stopTimerRef: React.MutableRefObject<number>;
  stopDuration: number;
  role?: HumanoidRole;
  shirtColor?: string;
  pantsColor?: string;
  holdingItem?: HoldingItem;
}

function BoardingPassenger({
  startPos,
  doorPos,
  seatPos,
  stopTimerRef,
  stopDuration,
  role = 'visitor',
  shirtColor = '#2563EB',
  pantsColor = '#1E293B',
  holdingItem = 'none',
}: BoardingPassengerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [walkPhase, setWalkPhase] = useState(0);
  const [isSitting, setIsSitting] = useState(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const t = stopTimerRef.current;

    // Waiting before vehicle arrives or after departure
    if (t <= 0 || t >= stopDuration) {
      groupRef.current.visible = true;
      groupRef.current.position.set(startPos[0], startPos[1], startPos[2]);
      groupRef.current.rotation.y = Math.atan2(doorPos[0] - startPos[0], doorPos[2] - startPos[2]);
      if (walkPhase !== 0) setWalkPhase(0);
      if (isSitting) setIsSitting(false);
      return;
    }

    // Preparing at stand queue (0s to 0.6s)
    if (t < 0.6) {
      groupRef.current.visible = true;
      groupRef.current.position.set(startPos[0], startPos[1], startPos[2]);
      groupRef.current.rotation.y = Math.atan2(doorPos[0] - startPos[0], doorPos[2] - startPos[2]);
      if (walkPhase !== 0) setWalkPhase(0);
      if (isSitting) setIsSitting(false);
      return;
    }

    // Walking from stand queue to vehicle door (0.6s to 3.2s)
    if (t >= 0.6 && t < 3.2) {
      const u = (t - 0.6) / 2.6;
      const curX = startPos[0] + (doorPos[0] - startPos[0]) * u;
      const curZ = startPos[2] + (doorPos[2] - startPos[2]) * u;
      const curY = startPos[1] + (doorPos[1] - startPos[1]) * u;

      groupRef.current.visible = true;
      groupRef.current.position.set(curX, curY, curZ);
      groupRef.current.rotation.y = Math.atan2(doorPos[0] - startPos[0], doorPos[2] - startPos[2]);

      setWalkPhase((p) => (p + delta * 11) % (Math.PI * 2));
      if (isSitting) setIsSitting(false);
      return;
    }

    // Stepping onto footboard / climbing inside vehicle (3.2s to 4.2s)
    if (t >= 3.2 && t < 4.2) {
      const v = (t - 3.2) / 1.0;
      const curX = doorPos[0] + (seatPos[0] - doorPos[0]) * v;
      const curZ = doorPos[2] + (seatPos[2] - doorPos[2]) * v;
      const stepLift = Math.sin(v * Math.PI) * 0.28;
      const curY = doorPos[1] + (seatPos[1] - doorPos[1]) * v + stepLift;

      groupRef.current.visible = true;
      groupRef.current.position.set(curX, curY, curZ);
      groupRef.current.rotation.y = Math.atan2(seatPos[0] - doorPos[0], seatPos[2] - doorPos[2]);

      setWalkPhase((p) => (p + delta * 6) % (Math.PI * 2));
      if (v > 0.6 && !isSitting) setIsSitting(true);
      return;
    }

    // Fully seated inside vehicle: actor hidden since vehicle's internal passenger mesh is active
    groupRef.current.visible = false;
  });

  return (
    <group ref={groupRef} position={startPos}>
      <HumanoidMesh
        role={role}
        shirtColorOverride={shirtColor}
        pantsColorOverride={pantsColor}
        walkPhase={walkPhase}
        isSitting={isSitting}
        holdingItem={holdingItem}
      />
    </group>
  );
}

// =============================================================================
// SUB-COMPONENT: Traffic Police Officer (Traffic Cop Dispatch & Traffic Resolver)
// When traffic queues or stalls anywhere on the road, officer rushes over,
// blows whistle, waves glowing baton, and directs traffic to fix the issue!
// =============================================================================
function TrafficPoliceOfficer() {
  const officerRef = useRef<THREE.Group>(null);
  const [isDirecting, setIsDirecting] = useState(false);
  const [walkPhase, setWalkPhase] = useState(0);
  const targetPos = useRef<[number, number, number]>([4.5, 0.16, 56.0]);
  const currentPos = useRef<[number, number, number]>([4.5, 0.16, 56.0]);

  useFrame((_, delta) => {
    const cong = trafficManager.getActiveCongestion();

    if (cong.active) {
      // Officer sets destination beside the road at the congestion hotspot
      targetPos.current = [cong.x + 3.2, 0.16, cong.z + 1.8];
      if (!isDirecting) setIsDirecting(true);
    } else {
      // Officer returns to Guard Booth / Police Station post
      targetPos.current = [4.5, 0.16, 56.0];
      if (isDirecting) setIsDirecting(false);
    }

    if (officerRef.current) {
      const dx = targetPos.current[0] - currentPos.current[0];
      const dz = targetPos.current[2] - currentPos.current[2];
      const dist = Math.hypot(dx, dz);

      if (dist > 0.3) {
        // Officer running towards the jam at 7 m/s!
        const step = Math.min(dist, delta * 7.0);
        currentPos.current[0] += (dx / dist) * step;
        currentPos.current[2] += (dz / dist) * step;
        officerRef.current.position.set(currentPos.current[0], 0.16, currentPos.current[2]);
        officerRef.current.rotation.y = Math.atan2(dx, dz);
        setWalkPhase((p) => (p + delta * 14) % (Math.PI * 2));
      } else {
        // Officer has arrived at the scene!
        officerRef.current.position.set(currentPos.current[0], 0.16, currentPos.current[2]);
        setWalkPhase(0);

        if (cong.active) {
          // Face the traffic jam
          officerRef.current.rotation.y = Math.atan2(cong.x - currentPos.current[0], cong.z - currentPos.current[2]);

          // Actively direct the lead vehicle forward and clear the jam!
          trafficManager.grantPriorityClearance(cong.leadVehicleId, 3.5);
        }
      }
    }
  });

  return (
    <group ref={officerRef} position={[4.5, 0.16, 56.0]}>
      {/* Officer Humanoid with Fluorescent Safety Yellow Traffic Vest */}
      <HumanoidMesh
        role="guard"
        shirtColorOverride="#FACC15" // Hi-vis safety yellow vest
        pantsColorOverride="#182438" // Police navy trousers
        walkPhase={walkPhase}
        holdingItem="none"
      />
      {/* Directing Traffic Baton (Glowing Orange) */}
      <mesh position={[0.26, 0.85, 0.35]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
        <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={2.5} />
      </mesh>

      {/* Floating Animated Status Banner above Officer's Head */}
      {isDirecting && (
        <group position={[0, 2.3, 0]}>
          <mesh>
            <boxGeometry args={[4.4, 0.52, 0.08]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <Text
            position={[0, 0, 0.05]}
            fontSize={0.2}
            color="#FACC15"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            👮 TRAFFIC OFFICER DIRECTING CONGESTION
          </Text>
        </group>
      )}
    </group>
  );
}

// =============================================================================
// MAIN COMPONENT: TransitHubAndVehicles
// =============================================================================
export function TransitHubAndVehicles() {
  // Bus simulation references
  const bus1Ref = useRef<THREE.Group>(null);
  const bus2Ref = useRef<THREE.Group>(null);
  const bus1Progress = useRef<number>(0);
  const bus2Progress = useRef<number>(BUS_ROUTE.length * 0.5);
  const bus1StopTimer = useRef<number>(0);
  const bus2StopTimer = useRef<number>(0);
  const bus1WheelAngle = useRef<number>(0);
  const bus2WheelAngle = useRef<number>(0);

  // Rickshaw simulation references
  const rickshaw1Ref = useRef<THREE.Group>(null);
  const rickshaw2Ref = useRef<THREE.Group>(null);
  const rickshaw3Ref = useRef<THREE.Group>(null);
  const rickshaw1Progress = useRef<number>(0);
  const rickshaw2Progress = useRef<number>(2.5);
  const rickshaw3Progress = useRef<number>(0);
  const rickshaw1StopTimer = useRef<number>(0);
  const rickshaw2StopTimer = useRef<number>(0);
  const rickshaw3StopTimer = useRef<number>(0);
  const rickshawWheel1 = useRef<number>(0);
  const rickshawWheel2 = useRef<number>(0);
  const rickshawWheel3 = useRef<number>(0);

  // Taxi simulation references
  const taxi1Ref = useRef<THREE.Group>(null);
  const taxi1Progress = useRef<number>(0);
  const taxi1StopTimer = useRef<number>(0);
  const taxiWheel1 = useRef<number>(0);

  // Active Car simulation references (Sports Car, SUV, Sedan)
  const sports1Ref = useRef<THREE.Group>(null);
  const sports1Progress = useRef<number>(0);
  const sports1Wheel = useRef<number>(0);

  const suv1Ref = useRef<THREE.Group>(null);
  const suv1Progress = useRef<number>(3.0);
  const suv1Wheel = useRef<number>(0);

  const sedan1Ref = useRef<THREE.Group>(null);
  const sedan1Progress = useRef<number>(1.5);
  const sedan1Wheel = useRef<number>(0);

  // Passenger boarded states
  const [rickshaw1HasPassenger, setRickshaw1HasPassenger] = useState(false);
  const [taxi1HasPassenger, setTaxi1HasPassenger] = useState(false);
  const [bus1HasPassengers, setBus1HasPassengers] = useState(false);
  const [bus2HasPassengers, setBus2HasPassengers] = useState(false);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);

    // =========================================================================
    // GENERAL VEHICLE PROGRESSION & TRAFFIC HEADWAY COLLISION AVOIDANCE
    // =========================================================================
    const updateVehicleOnRoute = (
      vehicleId: string,
      vehicleType: VehicleCategory,
      groupRef: THREE.Group | null,
      route: RoutePoint[],
      progRef: React.MutableRefObject<number>,
      timerRef: React.MutableRefObject<number> | null,
      wheelRef: React.MutableRefObject<number>,
      defaultSpeed: number,
      stopDuration: number,
      wheelRadius: number,
      vehLength: number,
      vehWidth: number,
      onBoardingTrigger?: (timer: number) => void
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
      const yaw = Math.atan2(dx, dz);

      // Check if current waypoint is a scheduled stop and still within stop duration
      if (timerRef && pCurr.isStop && timerRef.current < stopDuration) {
        timerRef.current += dt;
        groupRef.position.set(pCurr.x, 0.15, pCurr.z);
        groupRef.rotation.y = yaw;

        // Register in trafficManager with speed 0 so trailing vehicles stop behind
        trafficManager.updateVehicle(
          vehicleId,
          vehicleType,
          pCurr.x,
          0.15,
          pCurr.z,
          yaw,
          0,
          vehLength,
          vehWidth
        );

        if (onBoardingTrigger) {
          onBoardingTrigger(timerRef.current);
        }

        return { isStopped: true };
      }

      // Normal driving mode
      let targetSpeed = pCurr.speed !== undefined && pCurr.speed > 0 ? pCurr.speed : defaultSpeed;
      if (timerRef && timerRef.current >= stopDuration) {
        targetSpeed = Math.min(defaultSpeed, 2.5 + (timerRef.current - stopDuration) * 2.5);
      }

      // Compute current interpolated position
      const segFrac = progRef.current - Math.floor(progRef.current);
      const posX = pCurr.x + dx * segFrac;
      const posZ = pCurr.z + dz * segFrac;

      // Check for lead vehicles to guarantee zero passing through / collision
      const { safeSpeed } = trafficManager.getSafeSpeed(
        vehicleId,
        posX,
        posZ,
        yaw,
        targetSpeed,
        vehLength,
        vehWidth
      );

      // Update position according to safe speed
      const distStep = safeSpeed * dt;
      progRef.current += distStep / segLen;
      wheelRef.current += distStep / wheelRadius;

      // Wrap around whole route
      if (progRef.current >= totalSegments) {
        progRef.current -= totalSegments;
      }

      // If moved to next segment, reset stop timer
      if (timerRef && Math.floor(progRef.current) !== currIdx) {
        timerRef.current = 0;
      }

      const newSegFrac = progRef.current - Math.floor(progRef.current);
      const newPosX = pCurr.x + dx * newSegFrac;
      const newPosZ = pCurr.z + dz * newSegFrac;

      groupRef.position.set(newPosX, 0.15, newPosZ);
      groupRef.rotation.y = yaw;

      // Register updated kinematics in traffic registry
      trafficManager.updateVehicle(
        vehicleId,
        vehicleType,
        newPosX,
        0.15,
        newPosZ,
        yaw,
        safeSpeed,
        vehLength,
        vehWidth
      );

      return { isStopped: false };
    };

    // 1. Update Bus 1 (Teak/White City Bus)
    updateVehicleOnRoute(
      'bus-1',
      'bus',
      bus1Ref.current,
      BUS_ROUTE,
      bus1Progress,
      bus1StopTimer,
      bus1WheelAngle,
      8.0,
      5.5,
      0.48,
      11.5,
      2.8,
      (t) => {
        if (t >= 4.0 && !bus1HasPassengers) {
          setBus1HasPassengers(true);
        }
      }
    );

    // 2. Update Bus 2 (Blue/White City Bus, staggered)
    updateVehicleOnRoute(
      'bus-2',
      'bus',
      bus2Ref.current,
      BUS_ROUTE,
      bus2Progress,
      bus2StopTimer,
      bus2WheelAngle,
      8.0,
      5.5,
      0.48,
      11.5,
      2.8,
      (t) => {
        if (t >= 4.0 && !bus2HasPassengers) {
          setBus2HasPassengers(true);
        }
      }
    );

    // 3. Update Rickshaw 1 (Hospital Stand Route)
    updateVehicleOnRoute(
      'rickshaw-1',
      'rickshaw',
      rickshaw1Ref.current,
      RICKSHAW_ROUTE_1,
      rickshaw1Progress,
      rickshaw1StopTimer,
      rickshawWheel1,
      6.2,
      5.5,
      0.22,
      2.6,
      1.4,
      (t) => {
        if (t >= 4.0 && !rickshaw1HasPassenger) {
          setRickshaw1HasPassenger(true);
        }
      }
    );

    // 4. Update Rickshaw 2 (East Avenue Feeder Route)
    updateVehicleOnRoute(
      'rickshaw-2',
      'rickshaw',
      rickshaw2Ref.current,
      RICKSHAW_ROUTE_2,
      rickshaw2Progress,
      rickshaw2StopTimer,
      rickshawWheel2,
      6.2,
      3.5,
      0.22,
      2.6,
      1.4
    );

    // 5. Update Rickshaw 3 (West Avenue Feeder Route)
    updateVehicleOnRoute(
      'rickshaw-3',
      'rickshaw',
      rickshaw3Ref.current,
      RICKSHAW_ROUTE_3,
      rickshaw3Progress,
      rickshaw3StopTimer,
      rickshawWheel3,
      6.0,
      3.5,
      0.22,
      2.6,
      1.4
    );

    // 6. Update Taxi 1 (Airport/City Drop-off & Pickup)
    updateVehicleOnRoute(
      'taxi-1',
      'taxi',
      taxi1Ref.current,
      TAXI_ROUTE_1,
      taxi1Progress,
      taxi1StopTimer,
      taxiWheel1,
      8.5,
      5.5,
      0.32,
      4.5,
      1.9,
      (t) => {
        if (t >= 4.0 && !taxi1HasPassenger) {
          setTaxi1HasPassenger(true);
        }
      }
    );

    // 7. Update Active Sports Car (Rosso Red Supercar)
    updateVehicleOnRoute(
      'sports-1',
      'sports',
      sports1Ref.current,
      SPORTS_CAR_ROUTE,
      sports1Progress,
      null,
      sports1Wheel,
      13.5,
      0,
      0.33,
      4.5,
      2.0
    );

    // 8. Update Active Luxury SUV (Deep Navy Full-Size SUV)
    updateVehicleOnRoute(
      'suv-1',
      'suv',
      suv1Ref.current,
      SUV_CAR_ROUTE,
      suv1Progress,
      null,
      suv1Wheel,
      9.5,
      0,
      0.42,
      4.8,
      2.1
    );

    // 9. Update Active Executive Sedan (Pearl White Luxury Sedan)
    updateVehicleOnRoute(
      'sedan-1',
      'sedan',
      sedan1Ref.current,
      SEDAN_CAR_ROUTE,
      sedan1Progress,
      null,
      sedan1Wheel,
      10.0,
      0,
      0.34,
      4.65,
      1.95
    );
  });

  return (
    <group position={[0, 0, 0]}>
      {/* =========================================================================
          TRAFFIC POLICE OFFICER (DISPATCHED TO DIRECT & UNBLOCK TRAFFIC JAMS)
         ========================================================================= */}
      <TrafficPoliceOfficer />

      {/* =========================================================================
          1. BUS STATION 1: HOSPITAL CENTRAL TERMINAL (NEAR HOSPITAL ENTRANCE)
             Located at X: 24, Z: 64 to 76
         ========================================================================= */}
      <group position={[24, 0, 64]}>
        <mesh position={[0, 0.16, 0]} receiveShadow>
          <boxGeometry args={[22, 0.16, 4.2]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 2.0]}>
          <boxGeometry args={[22, 0.02, 0.22]} />
          <meshStandardMaterial color="#FBBF24" roughness={0.4} />
        </mesh>

        <group position={[0, 0, 0]}>
          {[-8, -2.5, 2.5, 8].map((cx) => (
            <mesh key={`b1-col-${cx}`} position={[cx, 2.2, -1.2]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 4.4, 12]} />
              <meshStandardMaterial color="#F8FAFC" metalness={0.8} />
            </mesh>
          ))}
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
          <mesh position={[0, 4.32, 2.6]}>
            <boxGeometry args={[23.2, 0.24, 0.08]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>
        </group>

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
            101 MEDICITY EXP: BOARDING | 102 AIRPORT: 4 MIN
          </Text>
        </group>

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

        {/* Waiting Passengers at Terminal 1 */}
        <group position={[-5, 0.25, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#DC2626" isSitting />
        </group>
        <group position={[-4, 0.25, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#2563EB" isSitting />
        </group>
        <group position={[3, 0.25, 0.8]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="nurse" />
        </group>
        <group position={[-1, 0.25, 1.0]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#9333EA" />
        </group>
      </group>

      {/* DYNAMIC BOARDING PASSENGER FOR BUS TERMINAL 1 */}
      <BoardingPassenger
        startPos={[25, 0.25, 65.5]}
        doorPos={[23.4, 0.25, 69.5]}
        seatPos={[22.5, 0.45, 69.5]}
        stopTimerRef={bus1StopTimer}
        stopDuration={5.5}
        role="visitor"
        shirtColor="#15803D"
        pantsColor="#1E293B"
        holdingItem="clipboard"
      />

      {/* =========================================================================
          2. BUS STATION 2: EAST COMMONS & CANTEEN HUB BUS STATION
             Located on East Avenue at X: 125, Z: 30
         ========================================================================= */}
      <group position={[125, 0, 30]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.16, 0]} receiveShadow>
          <boxGeometry args={[18, 0.16, 3.8]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 1.8]}>
          <boxGeometry args={[18, 0.02, 0.22]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>

        <mesh position={[0, 3.8, 0]} castShadow>
          <boxGeometry args={[16, 0.1, 4.4]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        <mesh position={[0, 3.9, 0]}>
          <boxGeometry args={[15, 0.04, 3.8]} />
          <meshStandardMaterial color="#1E3A8A" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 2.0, -1.8]}>
          <boxGeometry args={[15.6, 3.5, 0.06]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.4} />
        </mesh>

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

        <group position={[2, 0.25, 0]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="doctor" />
        </group>
      </group>

      {/* DYNAMIC BOARDING PASSENGER FOR BUS STATION 2 */}
      <BoardingPassenger
        startPos={[124, 0.25, 30]}
        doorPos={[119.5, 0.25, 30]}
        seatPos={[118.2, 0.45, 30]}
        stopTimerRef={bus2StopTimer}
        stopDuration={5.5}
        role="visitor"
        shirtColor="#D97706"
        pantsColor="#1E293B"
      />

      {/* =========================================================================
          3. BUS STATION 3: WEST METRO TRANSIT EXCHANGE BUS STATION
             Located on West Avenue at X: -125, Z: 30
         ========================================================================= */}
      <group position={[-125, 0, 30]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.16, 0]} receiveShadow>
          <boxGeometry args={[18, 0.16, 3.8]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.25, 1.8]}>
          <boxGeometry args={[18, 0.02, 0.22]} />
          <meshStandardMaterial color="#FBBF24" />
        </mesh>

        <mesh position={[0, 3.8, 0]} castShadow>
          <boxGeometry args={[16, 0.1, 4.4]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        <mesh position={[0, 2.0, -1.8]}>
          <boxGeometry args={[15.6, 3.5, 0.06]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.4} />
        </mesh>

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

        <group position={[1.5, 0.25, 0]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#DC2626" />
        </group>
      </group>

      {/* =========================================================================
          4. DEDICATED AUTO-RICKSHAW STAND & STATIONED RICKSHAWS (STAND 1)
             Located at X: -18, Z: 64 to 72
         ========================================================================= */}
      <group position={[-18, 0, 64]}>
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <boxGeometry args={[16, 0.08, 6.2]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>

        {[-5.5, -2.75, 0, 2.75, 5.5].map((bx, i) => (
          <group key={`rick-bay-${i}`} position={[bx, 0.17, 0]}>
            <mesh position={[-1.2, 0, 0]}>
              <boxGeometry args={[0.08, 0.01, 5.2]} />
              <meshStandardMaterial color="#FBBF24" />
            </mesh>
            <mesh position={[1.2, 0, 0]}>
              <boxGeometry args={[0.08, 0.01, 5.2]} />
              <meshStandardMaterial color="#FBBF24" />
            </mesh>
            <mesh position={[0, 0.08, -2.4]} castShadow>
              <boxGeometry args={[1.8, 0.14, 0.2]} />
              <meshStandardMaterial color="#CBD5E1" />
            </mesh>
          </group>
        ))}

        <group position={[0, 0, 2.8]}>
          <mesh position={[-7.5, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4.4, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          <mesh position={[7.5, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 4.4, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
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

        <group position={[-7, 0.16, -1.5]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[1.8, 2.4, 1.8]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.4, 0.92]}>
            <boxGeometry args={[1.2, 0.9, 0.04]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.5} />
          </mesh>
          <group position={[0, 0.5, 0]}>
            <HumanoidMesh role="guard" />
          </group>
        </group>

        {/* Stationed Rickshaws in bays */}
        <group position={[-5.5, 0.16, 0]} rotation={[0, Math.PI, 0]}>
          <AutoRickshawMesh colorScheme="green_yellow" hasDriver={true} />
        </group>
        <group position={[-2.75, 0.16, 0]} rotation={[0, Math.PI, 0]}>
          <AutoRickshawMesh colorScheme="black_yellow" hasDriver={false} />
        </group>

        <group position={[-1.6, 0.16, 0.6]} rotation={[0, -Math.PI / 2, 0]}>
          <HumanoidMesh
            role="visitor"
            shirtColorOverride="#D97706"
            pantsColorOverride="#1E293B"
          />
        </group>

        <group position={[5.2, 0.16, 1.5]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#EC4899" />
        </group>
      </group>

      {/* DYNAMIC BOARDING PASSENGER AT AUTO-RICKSHAW STAND */}
      <BoardingPassenger
        startPos={[-14.5, 0.16, 65.5]}
        doorPos={[-17.3, 0.16, 66.5]}
        seatPos={[-17.8, 0.45, 66.0]}
        stopTimerRef={rickshaw1StopTimer}
        stopDuration={5.5}
        role="visitor"
        shirtColor="#2563EB"
        pantsColor="#1E293B"
        holdingItem="food_tray"
      />

      {/* =========================================================================
          5. DEDICATED TAXI STAND / CAB RANK (STAND 2)
             Located at X: 52, Z: 64 to 72
         ========================================================================= */}
      <group position={[52, 0, 64]}>
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <boxGeometry args={[18, 0.08, 6.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>

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

        <group position={[-6, 0.16, 0]} rotation={[0, Math.PI, 0]}>
          <TaxiCabMesh hasDriver={true} />
        </group>
        <group position={[-2, 0.16, 0]} rotation={[0, Math.PI, 0]}>
          <TaxiCabMesh hasDriver={false} />
        </group>

        <group position={[6, 0.16, 1.2]} rotation={[0, Math.PI, 0]}>
          <HumanoidMesh role="visitor" shirtColorOverride="#1E293B" holdingItem="clipboard" />
        </group>
      </group>

      {/* DYNAMIC BOARDING PASSENGER AT TAXI STAND */}
      <BoardingPassenger
        startPos={[55.5, 0.16, 65.2]}
        doorPos={[50.8, 0.16, 66.2]}
        seatPos={[50.4, 0.42, 66.2]}
        stopTimerRef={taxi1StopTimer}
        stopDuration={5.5}
        role="visitor"
        shirtColor="#0D9488"
        pantsColor="#1E293B"
      />

      {/* =========================================================================
          6. ACTIVE CITY TRANSIT BUSES DRIVING FOR TRANSPORTATION (BUS 1 & BUS 2)
         ========================================================================= */}
      {/* City Bus 1 (Teal & White livery) */}
      <group ref={bus1Ref} position={[22, 0.15, 68.5]}>
        <CityBusMesh
          routeNumber="101"
          destination="MEDICITY EXP"
          wheelRotation={bus1WheelAngle.current}
          doorsOpen={bus1StopTimer.current > 0.4 && bus1StopTimer.current < 4.8}
          colorTheme="teal_white"
          hasPassengers={bus1HasPassengers}
        />
      </group>

      {/* City Bus 2 (Blue & White livery, staggered route) */}
      <group ref={bus2Ref} position={[-115, 0.15, 30]}>
        <CityBusMesh
          routeNumber="102"
          destination="CITY METRO"
          wheelRotation={bus2WheelAngle.current}
          doorsOpen={bus2StopTimer.current > 0.4 && bus2StopTimer.current < 4.8}
          colorTheme="blue_white"
          hasPassengers={bus2HasPassengers}
        />
      </group>

      {/* =========================================================================
          7. ACTIVE AUTO-RICKSHAWS DRIVING FOR TRANSPORTATION (RICKSHAWS 1, 2, 3)
         ========================================================================= */}
      {/* Rickshaw 1: Serving Hospital Stand & South Boulevard */}
      <group ref={rickshaw1Ref} position={[-70, 0.15, 70]}>
        <AutoRickshawMesh
          colorScheme="green_yellow"
          wheelRotation={rickshawWheel1.current}
          hasDriver={true}
          hasPassenger={rickshaw1HasPassenger}
          passengerShirtColor="#2563EB"
        />
      </group>

      {/* Rickshaw 2: Serving East Commons & Commercial Plaza */}
      <group ref={rickshaw2Ref} position={[112, 0.15, 10]}>
        <AutoRickshawMesh
          colorScheme="black_yellow"
          wheelRotation={rickshawWheel2.current}
          hasDriver={true}
          hasPassenger={true}
          passengerShirtColor="#D97706"
        />
      </group>

      {/* Rickshaw 3: Serving West Metro Transit Exchange */}
      <group ref={rickshaw3Ref} position={[-118, 0.15, 10]}>
        <AutoRickshawMesh
          colorScheme="green_yellow"
          wheelRotation={rickshawWheel3.current}
          hasDriver={true}
          hasPassenger={true}
          passengerShirtColor="#16A34A"
        />
      </group>

      {/* =========================================================================
          8. ACTIVE MOVING TAXI CAB DRIVING ON SOUTH BOULEVARD
         ========================================================================= */}
      <group ref={taxi1Ref} position={[-90, 0.15, 71.5]}>
        <TaxiCabMesh
          wheelRotation={taxiWheel1.current}
          hasDriver={true}
          hasPassenger={taxi1HasPassenger}
          passengerShirtColor="#0D9488"
        />
      </group>

      {/* =========================================================================
          9. ACTIVE MOVING SPORTS CAR (HIGH-PERFORMANCE ROSSO RED SUPERCAR)
         ========================================================================= */}
      <group ref={sports1Ref} position={[-90, 0.15, 71.5]}>
        <SportsCarMesh
          color="#DC2626"
          hasSpoiler={true}
          headlightsOn={true}
          wheelRotation={sports1Wheel.current}
        />
      </group>

      {/* =========================================================================
          10. ACTIVE MOVING LUXURY SUV (DEEP NAVY FULL-SIZE LUXURY SUV)
         ========================================================================= */}
      <group ref={suv1Ref} position={[120, 0.15, 78.5]}>
        <SuvCarMesh
          color="#1E3A8A"
          hasRoofRails={true}
          headlightsOn={true}
          wheelRotation={suv1Wheel.current}
        />
      </group>

      {/* =========================================================================
          11. ACTIVE MOVING EXECUTIVE SEDAN (PEARL WHITE LUXURY 4-DOOR SEDAN)
         ========================================================================= */}
      <group ref={sedan1Ref} position={[-100, 0.15, 70.5]}>
        <SedanCarMesh
          color="#F8FAFC"
          headlightsOn={true}
          wheelRotation={sedan1Wheel.current}
        />
      </group>
    </group>
  );
}
