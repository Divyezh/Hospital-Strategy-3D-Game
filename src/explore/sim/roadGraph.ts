/**
 * MediCity 3D Road Graph & Spline Navigation Network
 * Provides lane centerlines, splines, waypoints, stop lines, and gate trigger zones.
 */
import * as THREE from 'three';

export interface RoadNode {
  id: string;
  pos: [number, number, number];
}

export interface RoadEdge {
  id: string;
  from: string;
  to: string;
  laneType: 'outer_west' | 'outer_east' | 'gate_inbound' | 'gate_outbound' | 'er_bay' | 'parking' | 'loop';
  speedLimit: number;
  curve: THREE.CatmullRomCurve3;
}

export interface StopLine {
  id: string;
  pos: [number, number, number];
  width: number;
  rotationY: number;
  type: 'gate_inbound' | 'zebra_crossing' | 'intersection';
}

export interface GateTriggerZone {
  id: string;
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
}

// Key Waypoint Coordinates on MediCity Campus
export const ROAD_NODES: Record<string, [number, number, number]> = {
  // South Boulevard Outer Road (Z = 68, Y = 0.12)
  OUTER_EAST_START: [110, 0.12, 65.5],
  OUTER_EAST_PREGATE: [18, 0.12, 65.5],
  OUTER_GATE_JUNCTION: [0, 0.12, 68],
  OUTER_WEST_PREGATE: [-18, 0.12, 70.5],
  OUTER_WEST_START: [-110, 0.12, 70.5],

  // Gate Approach & Checkpoint
  GATE_APPROACH_IN: [-2.2, 0.12, 64],
  GATE_STOP_LINE_IN: [-2.2, 0.12, 58],
  GATE_PORTAL_IN: [-2.2, 0.12, 56],
  GATE_INNER_IN: [-2.2, 0.12, 48],

  // Internal Driveway (X: -2.2 inbound, X: +2.2 outbound)
  AVENUE_MID_IN: [-2.2, 0.12, 34],
  AVENUE_FORK_IN: [-2.2, 0.12, 24],

  // ER Bay Route (Dedicated Fast-Lane Branch for Ambulance)
  ER_BRANCH_1: [-12, 0.12, 21],
  ER_BRANCH_2: [-24, 0.12, 18],
  ER_BAY_APPROACH: [-32, 0.12, 14],
  ER_BAY_DOCK: [-32, 0.12, 8],

  // Front Entrance Drop-off Loop
  LOOP_ENTRY: [-2.2, 0.12, 22],
  LOOP_APEX: [0, 0.12, 19],
  LOOP_EXIT: [2.2, 0.12, 22],

  // Parking Lot Route
  PARKING_ENTRY: [16, 0.12, 38],
  PARKING_AISLE_1: [28, 0.12, 38],
  PARKING_AISLE_2: [42, 0.12, 38],
  PARKING_EXIT: [16, 0.12, 44],

  // Exit & Outbound Route (Leaves campus through gate outbound lane X = 2.2)
  AVENUE_FORK_OUT: [2.2, 0.12, 24],
  AVENUE_MID_OUT: [2.2, 0.12, 34],
  GATE_INNER_OUT: [2.2, 0.12, 48],
  GATE_PORTAL_OUT: [2.2, 0.12, 56],
  GATE_STOP_LINE_OUT: [2.2, 0.12, 58],
  GATE_MERGE_OUT: [2.2, 0.12, 64],
  OUTER_MERGE_WEST: [-15, 0.12, 70.5],
  OUTER_MERGE_EAST: [15, 0.12, 65.5],
};

function createCurve(points: [number, number, number][]): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
    false,
    'catmullrom',
    0.3
  );
}

// Defined Road Graph Edges with Smooth Curves
export const ROAD_EDGES: RoadEdge[] = [
  // 1. South outer boulevard passing lanes
  {
    id: 'outer_westbound',
    from: 'OUTER_EAST_START',
    to: 'OUTER_WEST_START',
    laneType: 'outer_west',
    speedLimit: 12.0,
    curve: createCurve([
      ROAD_NODES.OUTER_EAST_START,
      ROAD_NODES.OUTER_EAST_PREGATE,
      [0, 0.12, 65.5],
      [-40, 0.12, 65.5],
      ROAD_NODES.OUTER_WEST_START,
    ]),
  },
  {
    id: 'outer_eastbound',
    from: 'OUTER_WEST_START',
    to: 'OUTER_EAST_START',
    laneType: 'outer_east',
    speedLimit: 12.0,
    curve: createCurve([
      ROAD_NODES.OUTER_WEST_START,
      ROAD_NODES.OUTER_WEST_PREGATE,
      [0, 0.12, 70.5],
      [40, 0.12, 70.5],
      ROAD_NODES.OUTER_EAST_START,
    ]),
  },

  // 2. Turn from outer road into gate inbound lane
  {
    id: 'turn_in_from_west',
    from: 'OUTER_WEST_PREGATE',
    to: 'GATE_STOP_LINE_IN',
    laneType: 'gate_inbound',
    speedLimit: 6.0,
    curve: createCurve([
      ROAD_NODES.OUTER_WEST_PREGATE,
      [-8, 0.12, 68],
      ROAD_NODES.GATE_APPROACH_IN,
      ROAD_NODES.GATE_STOP_LINE_IN,
    ]),
  },

  // 3. Gate inbound through portal to internal avenue
  {
    id: 'gate_in_passage',
    from: 'GATE_STOP_LINE_IN',
    to: 'AVENUE_FORK_IN',
    laneType: 'gate_inbound',
    speedLimit: 5.5,
    curve: createCurve([
      ROAD_NODES.GATE_STOP_LINE_IN,
      ROAD_NODES.GATE_PORTAL_IN,
      ROAD_NODES.GATE_INNER_IN,
      ROAD_NODES.AVENUE_MID_IN,
      ROAD_NODES.AVENUE_FORK_IN,
    ]),
  },

  // 4. Ambulance route: Avenue fork to ER Bay Approach
  {
    id: 'er_bay_inbound',
    from: 'AVENUE_FORK_IN',
    to: 'ER_BAY_APPROACH',
    laneType: 'er_bay',
    speedLimit: 6.0,
    curve: createCurve([
      ROAD_NODES.AVENUE_FORK_IN,
      ROAD_NODES.ER_BRANCH_1,
      ROAD_NODES.ER_BRANCH_2,
      ROAD_NODES.ER_BAY_APPROACH,
    ]),
  },

  // 5. ER Bay reverse docking maneuver: Approach -> Docked
  {
    id: 'er_bay_docking_arc',
    from: 'ER_BAY_APPROACH',
    to: 'ER_BAY_DOCK',
    laneType: 'er_bay',
    speedLimit: 2.0,
    curve: createCurve([
      ROAD_NODES.ER_BAY_APPROACH,
      [-32, 0.12, 11],
      ROAD_NODES.ER_BAY_DOCK,
    ]),
  },

  // 6. ER Bay departure: Dock -> Outbound Avenue
  {
    id: 'er_bay_departure',
    from: 'ER_BAY_DOCK',
    to: 'AVENUE_FORK_OUT',
    laneType: 'er_bay',
    speedLimit: 5.0,
    curve: createCurve([
      ROAD_NODES.ER_BAY_DOCK,
      [-32, 0.12, 14],
      ROAD_NODES.ER_BRANCH_2,
      ROAD_NODES.ER_BRANCH_1,
      ROAD_NODES.AVENUE_FORK_OUT,
    ]),
  },

  // 7. Drop-off loop
  {
    id: 'dropoff_loop',
    from: 'AVENUE_FORK_IN',
    to: 'AVENUE_FORK_OUT',
    laneType: 'loop',
    speedLimit: 4.5,
    curve: createCurve([
      ROAD_NODES.AVENUE_FORK_IN,
      ROAD_NODES.LOOP_ENTRY,
      ROAD_NODES.LOOP_APEX,
      ROAD_NODES.LOOP_EXIT,
      ROAD_NODES.AVENUE_FORK_OUT,
    ]),
  },

  // 8. Gate outbound passage
  {
    id: 'gate_out_passage',
    from: 'AVENUE_FORK_OUT',
    to: 'GATE_MERGE_OUT',
    laneType: 'gate_outbound',
    speedLimit: 5.5,
    curve: createCurve([
      ROAD_NODES.AVENUE_FORK_OUT,
      ROAD_NODES.AVENUE_MID_OUT,
      ROAD_NODES.GATE_INNER_OUT,
      ROAD_NODES.GATE_PORTAL_OUT,
      ROAD_NODES.GATE_STOP_LINE_OUT,
      ROAD_NODES.GATE_MERGE_OUT,
    ]),
  },

  // 9. Merge from gate outbound back to outer road
  {
    id: 'merge_out_to_west',
    from: 'GATE_MERGE_OUT',
    to: 'OUTER_WEST_START',
    laneType: 'outer_west',
    speedLimit: 8.0,
    curve: createCurve([
      ROAD_NODES.GATE_MERGE_OUT,
      ROAD_NODES.OUTER_MERGE_WEST,
      [-40, 0.12, 70.5],
      ROAD_NODES.OUTER_WEST_START,
    ]),
  },
];

// Defined Stop Lines
export const STOP_LINES: StopLine[] = [
  {
    id: 'gate_vehicle_checkpoint',
    pos: [-2.2, 0.14, 58],
    width: 3.6,
    rotationY: 0,
    type: 'gate_inbound',
  },
  {
    id: 'zebra_crossing_south',
    pos: [14, 0.14, 68],
    width: 6.0,
    rotationY: 0,
    type: 'zebra_crossing',
  },
];

// Defined Gate Detection Trigger Zones
export const GATE_TRIGGER_ZONES: GateTriggerZone[] = [
  {
    id: 'gate_approach_vehicle_zone',
    bounds: {
      minX: -4.5,
      maxX: 0.5,
      minZ: 55,
      maxZ: 66,
    },
  },
  {
    id: 'gate_pedestrian_turnstile_zone',
    bounds: {
      minX: -8.5,
      maxX: -5.0,
      minZ: 54,
      maxZ: 62,
    },
  },
];

// Pedestrian Walkways & Zebra Crossing Paths
export interface PedestrianPath {
  id: string;
  name: string;
  points: [number, number, number][];
}

export const PEDESTRIAN_PATHS: PedestrianPath[] = [
  // Outer Bus Stop (X: 18, Z: 62) across Zebra Crossing to Pedestrian Gate Turnstile (X: -6.8, Z: 56)
  {
    id: 'bus_stop_to_turnstile',
    name: 'Bus Stop to Main Gate',
    points: [
      [18, 0.18, 62],     // Bus stop shelter
      [14, 0.18, 62],     // Curb waiting point
      [14, 0.18, 68],     // Zebra crossing entrance
      [14, 0.18, 73],     // Zebra crossing sidewalk
      [2, 0.18, 73],      // Along south outer pavement
      [-6.8, 0.18, 70],   // Approach to pedestrian turnstile
      [-6.8, 0.18, 60],   // Pedestrian queue line
      [-6.8, 0.18, 56],   // Turnstile checkpoint
    ],
  },
  // Pedestrian Gate (X: -6.8, Z: 56) to Hospital Main Lobby (X: 0, Z: 18)
  {
    id: 'turnstile_to_lobby',
    name: 'Gate Turnstile to Main Lobby',
    points: [
      [-6.8, 0.18, 56],   // Inside turnstile
      [-6.8, 0.18, 44],   // Garden sidewalk
      [-6.8, 0.18, 30],   // Central plaza approach
      [-4.0, 0.18, 22],   // Lobby approach ramp
      [0, 0.18, 18],      // Main revolving / sliding entrance doors
    ],
  },
  // Pedestrian Gate to ER Triage Entrance (X: -26, Z: 18)
  {
    id: 'turnstile_to_er',
    name: 'Gate Turnstile to Emergency Dept',
    points: [
      [-6.8, 0.18, 56],
      [-6.8, 0.18, 44],
      [-14, 0.18, 36],
      [-24, 0.18, 26],
      [-26, 0.18, 18],   // ER Walk-in Triage Doors
    ],
  },
  // Return Path: Lobby to Outer Bus Stop
  {
    id: 'lobby_to_bus_stop',
    name: 'Main Lobby to Bus Stop',
    points: [
      [0, 0.18, 18],
      [-4.0, 0.18, 22],
      [-6.8, 0.18, 32],
      [-6.8, 0.18, 46],
      [-6.8, 0.18, 56],
      [-6.8, 0.18, 68],
      [2, 0.18, 73],
      [14, 0.18, 73],
      [14, 0.18, 63],
      [18, 0.18, 62],
    ],
  },
];
