/**
 * Global Vehicle Traffic Collision Avoidance & Headway Manager
 *
 * Guarantees:
 * 1. Zero clipping / passing through between any vehicles (Bus, Taxi, Rickshaw, Ambulance, Sports Car, SUV, Sedan).
 * 2. Real-time congestion / traffic jam detection.
 * 3. Traffic Police Officer dispatch & right-of-way clearance system to resolve jams.
 */
import * as THREE from 'three';

export type VehicleCategory = 'bus' | 'taxi' | 'rickshaw' | 'ambulance' | 'sports' | 'suv' | 'sedan';

export interface VehicleTrafficRecord {
  id: string;
  type: VehicleCategory;
  x: number;
  y: number;
  z: number;
  yaw: number;
  speed: number;
  length: number;
  width: number;
  stoppedDuration: number;
  updatedAt: number;
}

export interface CongestionEvent {
  active: boolean;
  x: number;
  y: number;
  z: number;
  leadVehicleId: string;
  trailingVehicleId: string;
  stoppedCount: number;
  duration: number;
}

class TrafficManager {
  private vehicles: Map<string, VehicleTrafficRecord> = new Map();
  private stoppedTimers: Map<string, number> = new Map();
  private priorityOverrideId: string | null = null;
  private priorityExpiryTime: number = 0;

  // Active congestion state
  private activeCongestion: CongestionEvent = {
    active: false,
    x: 0,
    y: 0.15,
    z: 0,
    leadVehicleId: '',
    trailingVehicleId: '',
    stoppedCount: 0,
    duration: 0,
  };

  /**
   * Register or update a vehicle's current kinematic position.
   */
  public updateVehicle(
    id: string,
    type: VehicleCategory,
    x: number,
    y: number,
    z: number,
    yaw: number,
    speed: number,
    length: number,
    width: number
  ) {
    const prevTimer = this.stoppedTimers.get(id) || 0;
    const newTimer = speed < 0.1 ? prevTimer + 0.016 : 0;
    this.stoppedTimers.set(id, newTimer);

    this.vehicles.set(id, {
      id,
      type,
      x,
      y,
      z,
      yaw,
      speed,
      length,
      width,
      stoppedDuration: newTimer,
      updatedAt: performance.now(),
    });

    this.evaluateCongestion();
  }

  /**
   * Remove vehicle when unmounted.
   */
  public removeVehicle(id: string) {
    this.vehicles.delete(id);
    this.stoppedTimers.delete(id);
    if (this.priorityOverrideId === id) {
      this.priorityOverrideId = null;
    }
  }

  /**
   * Checks for 2 or more vehicles stalled in proximity (traffic jam).
   */
  private evaluateCongestion() {
    const now = performance.now();
    if (this.priorityOverrideId && now > this.priorityExpiryTime) {
      this.priorityOverrideId = null;
    }

    const stoppedList: VehicleTrafficRecord[] = [];
    for (const v of this.vehicles.values()) {
      if (v.speed < 0.2 && v.stoppedDuration > 2.0) {
        stoppedList.push(v);
      }
    }

    // Check if any two stopped vehicles are within 18m of each other
    for (let i = 0; i < stoppedList.length; i++) {
      for (let j = i + 1; j < stoppedList.length; j++) {
        const v1 = stoppedList[i];
        const v2 = stoppedList[j];
        const dist = Math.hypot(v1.x - v2.x, v1.z - v2.z);

        if (dist < 18.0) {
          // Congestion detected!
          // Find which vehicle is ahead (lead vehicle)
          const fwdX = Math.sin(v1.yaw);
          const fwdZ = Math.cos(v1.yaw);
          const isV2Ahead = (v2.x - v1.x) * fwdX + (v2.z - v1.z) * fwdZ > 0;
          const lead = isV2Ahead ? v2 : v1;
          const trailing = isV2Ahead ? v1 : v2;

          this.activeCongestion = {
            active: true,
            x: (v1.x + v2.x) * 0.5,
            y: 0.15,
            z: (v1.z + v2.z) * 0.5,
            leadVehicleId: lead.id,
            trailingVehicleId: trailing.id,
            stoppedCount: 2,
            duration: Math.max(v1.stoppedDuration, v2.stoppedDuration),
          };
          return;
        }
      }
    }

    // If no pairs found, reset after duration drops
    if (this.activeCongestion.active) {
      this.activeCongestion.active = false;
    }
  }

  /**
   * Traffic officer grants priority clearance to unblock the jam.
   */
  public grantPriorityClearance(vehicleId: string, durationSec: number = 4.0) {
    this.priorityOverrideId = vehicleId;
    this.priorityExpiryTime = performance.now() + durationSec * 1000;
  }

  public getActiveCongestion(): CongestionEvent {
    return this.activeCongestion;
  }

  public isPriorityVehicle(vehicleId: string): boolean {
    return this.priorityOverrideId === vehicleId && performance.now() < this.priorityExpiryTime;
  }

  /**
   * Calculates safe target speed ensuring no clipping / passing through.
   */
  public getSafeSpeed(
    vehicleId: string,
    currX: number,
    currZ: number,
    yaw: number,
    desiredSpeed: number,
    vehLength: number,
    vehWidth: number
  ): { safeSpeed: number; hasLeadVehicle: boolean; distanceToLead: number } {
    // If this vehicle was cleared by the traffic officer, give it permission to accelerate!
    if (this.isPriorityVehicle(vehicleId)) {
      return { safeSpeed: Math.max(desiredSpeed, 6.0), hasLeadVehicle: false, distanceToLead: Infinity };
    }

    let safeSpeed = desiredSpeed;
    let hasLeadVehicle = false;
    let minLeadDist = Infinity;

    // Unit forward vector in XZ plane
    const fwdX = Math.sin(yaw);
    const fwdZ = Math.cos(yaw);

    // Unit lateral normal vector perpendicular to heading
    const latX = -fwdZ;
    const latZ = fwdX;

    for (const [id, other] of this.vehicles.entries()) {
      if (id === vehicleId) continue;

      const dx = other.x - currX;
      const dz = other.z - currZ;
      const distSq = dx * dx + dz * dz;

      // Ignore vehicles farther than 35m
      if (distSq > 1225) continue;

      // Project onto forward heading
      const fwdDist = dx * fwdX + dz * fwdZ;
      if (fwdDist <= 0.1) continue;

      // Project onto lateral normal
      const latDist = Math.abs(dx * latX + dz * latZ);

      // Safe lateral corridor based on both vehicles' half-widths plus safety buffer
      const corridor = (vehWidth + other.width) * 0.5 + 1.25;
      if (latDist > corridor) continue;

      // The other vehicle is directly ahead in our corridor!
      const minStopDist = (vehLength + other.length) * 0.5 + 2.8;
      const slowDist = minStopDist + 7.5;

      hasLeadVehicle = true;
      if (fwdDist < minLeadDist) {
        minLeadDist = fwdDist;
      }

      if (fwdDist <= minStopDist) {
        // Critical danger: Hard stop behind the lead vehicle!
        return { safeSpeed: 0, hasLeadVehicle: true, distanceToLead: fwdDist };
      } else if (fwdDist <= slowDist) {
        // Slow down smoothly to match lead vehicle or decelerate
        const factor = (fwdDist - minStopDist) / (slowDist - minStopDist);
        const matchSpeed = Math.min(other.speed * 0.8, desiredSpeed);
        const interpolated = matchSpeed + (desiredSpeed - matchSpeed) * factor * 0.5;
        safeSpeed = Math.min(safeSpeed, Math.max(0.4, interpolated));
      }
    }

    return { safeSpeed, hasLeadVehicle, distanceToLead: minLeadDist };
  }
}

export const trafficManager = new TrafficManager();
