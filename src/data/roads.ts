import { Vector3D } from '@/sim/types';

export interface RoadWaypoint {
  x: number;
  y: number;
  z: number;
}

export interface SiteRoadPaths {
  inbound: Vector3D[];
  dockReverse: Vector3D[];
  outbound: Vector3D[];
  pedestrianPath: Vector3D[];
}

// Global road network waypoints connecting the 4 sites and Pharmacy Depot
export const ROAD_NETWORK = {
  // Central crossroads & highway entrances
  centerJunction: { x: 0, y: 0.05, z: 0 },
  northHighway: { x: 0, y: 0.05, z: -90 },
  southHighway: { x: 0, y: 0.05, z: 90 },
  westHighway: { x: -90, y: 0.05, z: 0 },
  eastHighway: { x: 90, y: 0.05, z: 0 },

  // Central Pharmacy Depot
  depotGate: { x: -18, y: 0.05, z: -6.5 },
  depotDock: { x: -18, y: 0.05, z: -14 },
};

// Generates an ambulance road path from outside highway to specific hospital site bay
export function generateAmbulancePath(
  siteId: string,
  baySlot: number,
  bayPos: [number, number, number]
): {
  approach: Vector3D[];
  dockReverse: Vector3D[];
  depart: Vector3D[];
} {
  const [bx, by, bz] = bayPos;

  if (siteId === 'site-mc-04') {
    // Southfield Day-Care (Center [42, 0, 42])
    // Approach along East-West highway (Z=0) -> turn South onto perimeter ring road (X=22) -> align with bay
    const approach: Vector3D[] = [
      { x: 90, y: 0.05, z: 2.2 },     // Spawn at East highway edge
      { x: 22, y: 0.05, z: 2.2 },     // Approach junction
      { x: 22, y: 0.05, z: 16 },      // Turn South along ring road
      { x: 22, y: 0.05, z: bz },      // Align parallel to bay
      { x: bx - 4, y: 0.05, z: bz },  // Stop in front of bay slot
    ];

    // Reversing into bay
    const dockReverse: Vector3D[] = [
      { x: bx - 4, y: 0.05, z: bz },
      { x: bx, y: 0.05, z: bz },      // Parked in slot
    ];

    // Departure path out through South ring road
    const depart: Vector3D[] = [
      { x: bx, y: 0.05, z: bz },
      { x: bx - 5, y: 0.05, z: bz },
      { x: 22, y: 0.05, z: bz },
      { x: 22, y: 0.05, z: 66 },      // Drive South
      { x: 70, y: 0.05, z: 66 },      // Turn East to highway
      { x: 95, y: 0.05, z: 66 },      // Exit map
    ];

    return { approach, dockReverse, depart };
  } else if (siteId === 'site-mc-02') {
    // Riverside Trauma (Center [42, 0, -42])
    const approach: Vector3D[] = [
      { x: 90, y: 0.05, z: -2.2 },
      { x: 22, y: 0.05, z: -2.2 },
      { x: 22, y: 0.05, z: -20 },
      { x: 22, y: 0.05, z: bz },
      { x: bx - 4, y: 0.05, z: bz },
    ];

    const dockReverse: Vector3D[] = [
      { x: bx - 4, y: 0.05, z: bz },
      { x: bx, y: 0.05, z: bz },
    ];

    const depart: Vector3D[] = [
      { x: bx, y: 0.05, z: bz },
      { x: bx - 5, y: 0.05, z: bz },
      { x: 22, y: 0.05, z: bz },
      { x: 22, y: 0.05, z: -66 },
      { x: 70, y: 0.05, z: -66 },
      { x: 95, y: 0.05, z: -66 },
    ];

    return { approach, dockReverse, depart };
  } else if (siteId === 'site-mc-01') {
    // City General (Center [-42, 0, -42])
    const approach: Vector3D[] = [
      { x: -90, y: 0.05, z: -2.2 },
      { x: -22, y: 0.05, z: -2.2 },
      { x: -22, y: 0.05, z: -20 },
      { x: -22, y: 0.05, z: bz },
      { x: bx + 4, y: 0.05, z: bz },
    ];

    const dockReverse: Vector3D[] = [
      { x: bx + 4, y: 0.05, z: bz },
      { x: bx, y: 0.05, z: bz },
    ];

    const depart: Vector3D[] = [
      { x: bx, y: 0.05, z: bz },
      { x: bx + 5, y: 0.05, z: bz },
      { x: -22, y: 0.05, z: bz },
      { x: -22, y: 0.05, z: -66 },
      { x: -70, y: 0.05, z: -66 },
      { x: -95, y: 0.05, z: -66 },
    ];

    return { approach, dockReverse, depart };
  } else {
    // Eastport Diagnostics (Center [-42, 0, 42])
    const approach: Vector3D[] = [
      { x: -90, y: 0.05, z: 2.2 },
      { x: -22, y: 0.05, z: 2.2 },
      { x: -22, y: 0.05, z: 18 },
      { x: -22, y: 0.05, z: bz },
      { x: bx + 4, y: 0.05, z: bz },
    ];

    const dockReverse: Vector3D[] = [
      { x: bx + 4, y: 0.05, z: bz },
      { x: bx, y: 0.05, z: bz },
    ];

    const depart: Vector3D[] = [
      { x: bx, y: 0.05, z: bz },
      { x: bx + 5, y: 0.05, z: bz },
      { x: -22, y: 0.05, z: bz },
      { x: -22, y: 0.05, z: 66 },
      { x: -70, y: 0.05, z: 66 },
      { x: -95, y: 0.05, z: 66 },
    ];

    return { approach, dockReverse, depart };
  }
}

// Supply van path from Central Pharmacy Depot to hospital supply docks
export function generateSupplyVanPath(targetSiteId: string): {
  outbound: Vector3D[];
  returnTrip: Vector3D[];
} {
  const depotDock = { x: -18, y: 0.05, z: -14 };
  const depotGate = { x: -18, y: 0.05, z: -6.5 };

  if (targetSiteId === 'site-mc-04') {
    // Depot -> Southfield Day-Care supply dock
    const outbound: Vector3D[] = [
      depotDock,
      depotGate,
      { x: 0, y: 0.05, z: -6.5 },
      { x: 0, y: 0.05, z: 22 },
      { x: 22, y: 0.05, z: 22 },
      { x: 26, y: 0.05, z: 26 }, // Bay 1 / Supply dock
    ];

    const returnTrip: Vector3D[] = [
      { x: 26, y: 0.05, z: 26 },
      { x: 22, y: 0.05, z: 22 },
      { x: 0, y: 0.05, z: 22 },
      { x: 0, y: 0.05, z: -6.5 },
      depotGate,
      depotDock,
    ];

    return { outbound, returnTrip };
  } else if (siteIdMatchesTrauma(targetSiteId)) {
    // Riverside Trauma
    const outbound: Vector3D[] = [
      depotDock,
      depotGate,
      { x: 0, y: 0.05, z: -6.5 },
      { x: 0, y: 0.05, z: -42 },
      { x: 22, y: 0.05, z: -42 },
      { x: 30, y: 0.05, z: -38 }, // Bay 3
    ];

    const returnTrip: Vector3D[] = [
      { x: 30, y: 0.05, z: -38 },
      { x: 22, y: 0.05, z: -42 },
      { x: 0, y: 0.05, z: -42 },
      { x: 0, y: 0.05, z: -6.5 },
      depotGate,
      depotDock,
    ];

    return { outbound, returnTrip };
  } else {
    // City General
    const outbound: Vector3D[] = [
      depotDock,
      depotGate,
      { x: -18, y: 0.05, z: -2.2 },
      { x: -22, y: 0.05, z: -2.2 },
      { x: -22, y: 0.05, z: -36 },
      { x: -28, y: 0.05, z: -36 },
    ];

    const returnTrip: Vector3D[] = [
      { x: -28, y: 0.05, z: -36 },
      { x: -22, y: 0.05, z: -36 },
      { x: -22, y: 0.05, z: -2.2 },
      { x: -18, y: 0.05, z: -2.2 },
      depotGate,
      depotDock,
    ];

    return { outbound, returnTrip };
  }
}

function siteIdMatchesTrauma(id: string): boolean {
  return id === 'site-mc-02';
}
