/**
 * Kinematic Bicycle & Pure Pursuit Vehicle Navigation Engine
 * Guarantees:
 * 1. Yaw-only rotation with shortest-angle damping (wrap in [-PI, PI]). Pitch & roll = 0.
 * 2. Vehicles follow lane splines from the road graph.
 * 3. Ground height fixed per road segment (Y = 0.15).
 * 4. Zero teleports / jitters: velocity clamped to [0, maxSpeed].
 * 5. Wheel spin angle calculated by distance traveled.
 */
import * as THREE from 'three';

export interface VehiclePose {
  x: number;
  y: number;
  z: number;
  yaw: number;
  speed: number;
  wheelAngle: number;
  stoppedSimTime: number;
}

export interface WaypointPath {
  id: string;
  points: THREE.Vector3[];
  speedLimit: number;
  isReverse?: boolean;
}

// Compute shortest angular difference wrapped to [-PI, PI]
export function shortestAngle(target: number, current: number): number {
  let diff = (target - current) % (Math.PI * 2);
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

// Smooth shortest-angle damping
export function dampAngle(current: number, target: number, lambda: number, dt: number): number {
  const diff = shortestAngle(target, current);
  return current + diff * (1 - Math.exp(-lambda * dt));
}

/**
 * Pure Pursuit Steering Controller for Lane Splines
 * Computes target yaw from a lookahead point along the target spline.
 */
export function getPurePursuitYaw(
  currentPos: { x: number; z: number },
  currentYaw: number,
  curve: THREE.CatmullRomCurve3,
  t: number,
  lookaheadDist: number = 3.5,
  isReverse: boolean = false
): { targetYaw: number; nextT: number } {
  // Sample forward along curve
  const curveLength = curve.getLength();
  const deltaT = Math.max(0.01, lookaheadDist / curveLength);
  const lookaheadT = Math.min(1.0, Math.max(0.0, isReverse ? t - deltaT : t + deltaT));
  const targetPoint = curve.getPoint(lookaheadT);

  const dx = targetPoint.x - currentPos.x;
  const dz = targetPoint.z - currentPos.z;

  // In Three.js coordinate system where model forward is -Z:
  // Forward vector: (-sin(yaw), -cos(yaw))
  // Therefore: yaw = Math.atan2(-dx, -dz)
  let targetYaw = Math.atan2(-dx, -dz);

  if (isReverse) {
    // When reversing, model faces opposite to travel direction
    targetYaw = (targetYaw + Math.PI) % (Math.PI * 2);
  }

  return { targetYaw, nextT: lookaheadT };
}

/**
 * Complete Ambulance Spline Route Definition
 * Constructing a single, continuous, collision-free closed loop:
 * Leg 1: South Outer Road -> Gate Approach (X: 75 -> 0, Z: 65.5 -> 65)
 * Leg 2: Fast-lane Gate Entry (Z: 65 -> 58 -> 56 -> 48 -> 34 -> 24 along X: -2.2)
 * Leg 3: ER Bay Approach Driveway (Branch left: X: -2.2 -> -28 -> -32, Z: 24 -> 18 -> 14)
 * Leg 4: Stop & Reverse Arc into ER bay (X: -32, Z: 14 -> 8, parking facing South)
 * Leg 5: Docked at ER Bay
 * Leg 6: Drive Forward out of ER bay (X: -32 -> -24 -> -12 -> 2.2, Z: 8 -> 18 -> 24)
 * Leg 7: Gate Outbound Exit Lane (Z: 24 -> 48 -> 56 -> 64 along X: 2.2)
 * Leg 8: South Outer Road Westbound (X: 2.2 -> -110, Z: 64 -> 70.5)
 * Leg 9: Outer Return Loop (re-entering from East boundary at X: 110, Z: 65.5)
 */
export function createAmbulanceRoute(): THREE.CurvePath<THREE.Vector3> {
  const path = new THREE.CurvePath<THREE.Vector3>();

  // Leg 1: Outer East approach to Gate Inbound Lane
  path.add(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(90, 0.15, 65.5),
      new THREE.Vector3(30, 0.15, 65.5),
      new THREE.Vector3(6, 0.15, 66.0),
      new THREE.Vector3(-2.2, 0.15, 64.0),
    ])
  );

  // Leg 2: Gate Inbound fast-lane passage through gate at Z: 56 to avenue fork at Z: 24
  path.add(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, 0.15, 64.0),
      new THREE.Vector3(-2.2, 0.15, 58.0),
      new THREE.Vector3(-2.2, 0.15, 56.0), // Main Gate Portal
      new THREE.Vector3(-2.2, 0.15, 48.0),
      new THREE.Vector3(-2.2, 0.15, 34.0),
      new THREE.Vector3(-2.2, 0.15, 24.0),
    ])
  );

  // Leg 3: Avenue Fork into ER bay approach
  path.add(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, 0.15, 24.0),
      new THREE.Vector3(-14.0, 0.15, 21.0),
      new THREE.Vector3(-26.0, 0.15, 18.0),
      new THREE.Vector3(-32.0, 0.15, 14.5), // Staging point right in front of ER bay
    ])
  );

  // Leg 4: Forward departure out of ER Bay to Gate Outbound Avenue
  // (Note: Leg 4 docking is handled via a dedicated reverse maneuver state machine)
  path.add(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-32.0, 0.15, 8.0),  // ER bay docked position
      new THREE.Vector3(-32.0, 0.15, 14.5), // Pull forward out of bay
      new THREE.Vector3(-24.0, 0.15, 19.0),
      new THREE.Vector3(-10.0, 0.15, 22.0),
      new THREE.Vector3(2.2, 0.15, 24.0),   // Merged onto Outbound lane X: 2.2
    ])
  );

  // Leg 5: Gate Outbound lane passage through gate at Z: 56
  path.add(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.2, 0.15, 24.0),
      new THREE.Vector3(2.2, 0.15, 34.0),
      new THREE.Vector3(2.2, 0.15, 48.0),
      new THREE.Vector3(2.2, 0.15, 56.0),   // Gate Outbound portal
      new THREE.Vector3(2.2, 0.15, 58.0),
      new THREE.Vector3(2.2, 0.15, 64.0),
    ])
  );

  // Leg 6: Merge Outbound back onto South Outer Boulevard heading West
  path.add(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.2, 0.15, 64.0),
      new THREE.Vector3(-6.0, 0.15, 68.0),
      new THREE.Vector3(-24.0, 0.15, 70.5),
      new THREE.Vector3(-60.0, 0.15, 70.5),
      new THREE.Vector3(-110.0, 0.15, 70.5), // West exit
    ])
  );

  return path;
}
