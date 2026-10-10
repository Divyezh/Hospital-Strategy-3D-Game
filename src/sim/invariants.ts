
import { SimulationEngine } from './engine';
import { selectSiteSummary, selectSiteSupplies } from './selectors';
import { SITES } from '@/data/sites';

export interface InvariantCheckResult {
  passed: boolean;
  violations: string[];
}

export function checkSimInvariants(engine: SimulationEngine): InvariantCheckResult {
  const violations: string[] = [];

  for (const site of SITES) {
    const summary = selectSiteSummary(engine, site.id);
    const siteState = engine.siteStates[site.id];

    // Invariant 1: beds free = capacity minus admitted patients
    const expectedBedsFree = Math.max(0, summary.totalBeds - summary.admittedCount);
    if (summary.bedsFree !== expectedBedsFree) {
      violations.push(
        `[${site.code}] Invariant failed: bedsFree (${summary.bedsFree}) != totalBeds (${summary.totalBeds}) - admittedCount (${summary.admittedCount})`
      );
    }

    // Invariant 2: occupancy percentage range [0, 100]
    if (summary.occupancyPct < 0 || summary.occupancyPct > 100) {
      violations.push(
        `[${site.code}] Invariant failed: occupancyPct (${summary.occupancyPct}%) out of range [0, 100]`
      );
    }

    // Invariant 3: docks used = ambulances in DOCKING/UNLOADING at that site's bays
    const actualDockedAmbulances = engine.ambulances.filter(
      (a) => a.targetSiteId === site.id && (a.state === 'DOCKING' || a.state === 'UNLOADING')
    ).length;

    if (summary.dockedCount !== actualDockedAmbulances) {
      violations.push(
        `[${site.code}] Invariant failed: dockedCount (${summary.dockedCount}) != actual docking/unloading ambulances (${actualDockedAmbulances})`
      );
    }

    // Invariant 4: bay busy count matches non-available bays
    if (siteState) {
      const nonAvailableBays = siteState.bays.filter((b) => b.status !== 'available').length;
      if (summary.busyBaysCount !== nonAvailableBays) {
        violations.push(
          `[${site.code}] Invariant failed: busyBaysCount (${summary.busyBaysCount}) != non-available bays in siteState (${nonAvailableBays})`
        );
      }
    }

    // Invariant 5: supplies chip = stock vs reorder threshold
    const supplies = selectSiteSupplies(engine, site.id);
    for (const item of supplies) {
      if (item.count < 0) {
        violations.push(
          `[${site.code}] Invariant failed: supply item '${item.name}' has negative count (${item.count})`
        );
      }
      if (item.count > item.reorderThreshold && item.status !== 'In Stock') {
        violations.push(
          `[${site.code}] Invariant failed: supply item '${item.name}' count (${item.count}) > threshold (${item.reorderThreshold}) but status is '${item.status}'`
        );
      }
      if (item.count <= item.reorderThreshold && item.count > 0 && item.status !== 'Low Stock') {
        violations.push(
          `[${site.code}] Invariant failed: supply item '${item.name}' count (${item.count}) <= threshold (${item.reorderThreshold}) but status is '${item.status}'`
        );
      }
      if (item.count === 0 && item.status !== 'Out of Stock') {
        violations.push(
          `[${site.code}] Invariant failed: supply item '${item.name}' count is 0 but status is '${item.status}'`
        );
      }
    }
  }

  // Log to console.error in development if any invariant failed
  if (violations.length > 0) {
    for (const v of violations) {
      console.error(v);
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

let invariantTimer: NodeJS.Timeout | null = null;

// Starts a 1-second interval in dev environment that monitors and reports invariant health
export function startDevInvariantsMonitor(engine: SimulationEngine) {
  if (typeof window === 'undefined') return;
  if (invariantTimer) clearInterval(invariantTimer);

  invariantTimer = setInterval(() => {
    checkSimInvariants(engine);
  }, 1000);
}

export function stopDevInvariantsMonitor() {
  if (invariantTimer) {
    clearInterval(invariantTimer);
    invariantTimer = null;
  }
}

// --------------------------------------------------------------------------------
// EXPLORE 3D SIMULATION INVARIANTS (STEP 0)
// --------------------------------------------------------------------------------
import { CAMPUS_OBSTACLES } from '@/explore/sim/obstacles';
import {
  vehicleIntersectsObstacle,
  vehicleOBBsIntersect,
  pointInsideOBB2D,
  VehicleOBB,
} from '@/explore/sim/geometry';

export interface ExploreVehicleState {
  id: string;
  position: [number, number, number];
  prevPosition?: [number, number, number];
  lastDt?: number;
  rotationY: number;
  pitch?: number;
  roll?: number;
  up?: [number, number, number];
  halfWidth: number;
  halfHeight: number;
  halfLength: number;
  speed: number;
  maxSpeed: number;
  stoppedSimTime: number;
  isParkedOrDocked?: boolean;
  hasObstacleAhead?: boolean;
}

export interface ExplorePedestrianState {
  id: string;
  position: [number, number, number];
  prevPosition?: [number, number, number];
  lastDt?: number;
  speed: number;
  maxSpeed: number;
}

export interface ExploreInvariantsInput {
  vehicles: ExploreVehicleState[];
  pedestrians: ExplorePedestrianState[];
  delta: number;
}

export interface ExploreInvariantResult {
  passed: boolean;
  violations: string[];
}

export function checkExploreInvariants(input: ExploreInvariantsInput): ExploreInvariantResult {
  const violations: string[] = [];
  const ONE_DEG_RAD = 1.0 * (Math.PI / 180);
  const dt = Math.max(0.001, input.delta || 0.033);

  // Convert vehicles to OBB structures
  const vehicleOBBs: Array<{ state: ExploreVehicleState; obb: VehicleOBB }> = input.vehicles.map((v) => ({
    state: v,
    obb: {
      centerX: v.position[0],
      centerY: v.position[1],
      centerZ: v.position[2],
      halfWidth: v.halfWidth,
      halfHeight: v.halfHeight,
      halfLength: v.halfLength,
      yaw: v.rotationY,
    },
  }));

  // Invariant (a): any vehicle OBB intersects a wall/fence/building box
  for (const { state, obb } of vehicleOBBs) {
    for (const obstacle of CAMPUS_OBSTACLES) {
      if (vehicleIntersectsObstacle(obb, obstacle)) {
        violations.push(
          `[Invariant a Violation] Vehicle ${state.id} OBB intersects ${obstacle.name} (${obstacle.id}) at [${state.position.map((n) => n.toFixed(1)).join(', ')}]`
        );
      }
    }
  }

  // Invariant (b): any vehicle's pitch or roll > 1 degree, or up vector deviates from world up
  for (const v of input.vehicles) {
    const pitch = Math.abs(v.pitch || 0);
    const roll = Math.abs(v.roll || 0);
    if (pitch > ONE_DEG_RAD || roll > ONE_DEG_RAD) {
      violations.push(
        `[Invariant b Violation] Vehicle ${v.id} pitch/roll > 1 deg: pitch=${(pitch * 180 / Math.PI).toFixed(2)}°, roll=${(roll * 180 / Math.PI).toFixed(2)}°`
      );
    }
    if (v.up) {
      // Dot product with world up [0, 1, 0]
      const upY = v.up[1];
      if (upY < Math.cos(ONE_DEG_RAD) - 0.001) {
        violations.push(
          `[Invariant b Violation] Vehicle ${v.id} up vector deviates from world up: up=[${v.up.map((n) => n.toFixed(2)).join(', ')}]`
        );
      }
    }
  }

  // Invariant (c): any agent moves faster than 1.5x its max speed in one tick (teleport/jitter)
  for (const v of input.vehicles) {
    if (v.prevPosition) {
      const dist = Math.hypot(
        v.position[0] - v.prevPosition[0],
        v.position[1] - v.prevPosition[1],
        v.position[2] - v.prevPosition[2]
      );
      // Map boundary wrap (despawn at West boundary, respawn at East boundary) is valid
      const isBoundaryWrap =
        (v.prevPosition[0] < -80 && v.position[0] > 80) ||
        (v.prevPosition[0] > 80 && v.position[0] < -80) ||
        dist > 40;

      if (!isBoundaryWrap) {
        const stepDt = Math.max(0.001, v.lastDt || dt);
        const speed = dist / stepDt;
        if (speed > 1.5 * v.maxSpeed + 0.5) {
          violations.push(
            `[Invariant c Violation] Vehicle ${v.id} teleported: instantaneous speed ${speed.toFixed(1)} m/s > 1.5x maxSpeed (${(1.5 * v.maxSpeed).toFixed(1)} m/s)`
          );
        }
      }
    }
  }
  for (const p of input.pedestrians) {
    if (p.prevPosition) {
      const dist = Math.hypot(
        p.position[0] - p.prevPosition[0],
        p.position[1] - p.prevPosition[1],
        p.position[2] - p.prevPosition[2]
      );
      const isPedWrap = dist > 20;
      if (!isPedWrap) {
        const stepDt = Math.max(0.001, p.lastDt || dt);
        const speed = dist / stepDt;
        if (speed > 1.5 * p.maxSpeed + 0.5) {
          violations.push(
            `[Invariant c Violation] Pedestrian ${p.id} teleported: instantaneous speed ${speed.toFixed(1)} m/s > 1.5x maxSpeed (${(1.5 * p.maxSpeed).toFixed(1)} m/s)`
          );
        }
      }
    }
  }

  // Invariant (d): two vehicles overlap, or a pedestrian is inside a vehicle OBB
  for (let i = 0; i < vehicleOBBs.length; i++) {
    for (let j = i + 1; j < vehicleOBBs.length; j++) {
      if (vehicleOBBsIntersect(vehicleOBBs[i].obb, vehicleOBBs[j].obb)) {
        violations.push(
          `[Invariant d Violation] Two vehicles overlapping: ${vehicleOBBs[i].state.id} and ${vehicleOBBs[j].state.id}`
        );
      }
    }
  }
  for (const { state, obb } of vehicleOBBs) {
    for (const ped of input.pedestrians) {
      if (pointInsideOBB2D(ped.position[0], ped.position[2], obb)) {
        violations.push(
          `[Invariant d Violation] Pedestrian ${ped.id} inside vehicle ${state.id} OBB at [${ped.position[0].toFixed(1)}, ${ped.position[2].toFixed(1)}]`
        );
      }
    }
  }

  // Invariant (e): a vehicle is stopped >20 sim seconds with nothing ahead (deadlock)
  for (const v of input.vehicles) {
    if (!v.isParkedOrDocked && !v.hasObstacleAhead && v.stoppedSimTime > 20.0) {
      violations.push(
        `[Invariant e Violation] Vehicle ${v.id} deadlocked: stopped for ${v.stoppedSimTime.toFixed(1)}s with nothing ahead`
      );
    }
  }

  if (violations.length > 0) {
    for (const v of violations) {
      console.error(v);
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

let exploreInvariantTimer: NodeJS.Timeout | null = null;

export function startExploreInvariantsMonitor(getSimInput: () => ExploreInvariantsInput) {
  if (typeof window === 'undefined') return;
  if (exploreInvariantTimer) clearInterval(exploreInvariantTimer);

  exploreInvariantTimer = setInterval(() => {
    try {
      const input = getSimInput();
      checkExploreInvariants(input);
    } catch {
      // Ignore if unmounted during interval
    }
  }, 1000);
}

export function stopExploreInvariantsMonitor() {
  if (exploreInvariantTimer) {
    clearInterval(exploreInvariantTimer);
    exploreInvariantTimer = null;
  }
}

