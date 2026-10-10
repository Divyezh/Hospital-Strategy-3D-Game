import { Vector3D } from '@/sim/types';

// 3 Staging Bay Slots in front of the bay doors
export const ER_BAYS: { index: number; name: string; position: Vector3D; pickupPosition: Vector3D }[] = [
  { index: 0, name: 'Bay 1', position: { x: -6.0, y: 0, z: 4.8 }, pickupPosition: { x: -6.0, y: 0, z: 2.2 } },
  { index: 1, name: 'Bay 2', position: { x: 3.5, y: 0, z: 4.8 }, pickupPosition: { x: 3.5, y: 0, z: 2.2 } },
  { index: 2, name: 'Bay 3', position: { x: 13.0, y: 0, z: 4.8 }, pickupPosition: { x: 13.0, y: 0, z: 2.2 } },
];

// Full 4-Corner City Road Loop
// South Road: z = 12.0
// East Road:  x = 34.0
// North Road: z = -18.0
// West Road:  x = -28.0

export function createAmbulanceInboundPath(bayPos: Vector3D): Vector3D[] {
  return [
    { x: 34.0, y: 0, z: -18.0 },    // Corner 1: North-East City
    { x: 34.0, y: 0, z: 12.0 },     // Corner 2: East Road down to South Road intersection
    { x: bayPos.x + 4.0, y: 0, z: 12.0 }, // South Road approaching bay
    { x: bayPos.x, y: 0, z: 8.5 },   // Turn into hospital entrance apron
    { x: bayPos.x, y: 0, z: bayPos.z }, // Dock at ER Bay
  ];
}

export function createAmbulanceOutboundPath(bayPos: Vector3D): Vector3D[] {
  return [
    { x: bayPos.x, y: 0, z: bayPos.z },
    { x: bayPos.x, y: 0, z: 8.5 },   // Pulls forward onto apron
    { x: bayPos.x - 4.0, y: 0, z: 12.0 }, // Merges onto South Road
    { x: -28.0, y: 0, z: 12.0 },    // Corner 3: South-West Intersection
    { x: -28.0, y: 0, z: -18.0 },   // Corner 4: West Road up to North-West
    { x: 0.0, y: 0, z: -18.0 },     // North Road heading East
    { x: 34.0, y: 0, z: -18.0 },    // Complete 4-corner loop
  ];
}

// Orderly / Ward Boy transport path
export function createOrderlyTransportPath(pickup: Vector3D, dest: Vector3D): Vector3D[] {
  return [
    { x: pickup.x, y: 0, z: pickup.z },
    { x: pickup.x, y: 0, z: 0.5 },   // Moves through open bay door
    { x: dest.x, y: 0, z: 0.5 },     // Main interior hallway
    { x: dest.x, y: 0, z: dest.z },  // Target treatment bed
  ];
}

export function createOrderlyReturnPath(start: Vector3D, pickup: Vector3D): Vector3D[] {
  return [
    { x: start.x, y: 0, z: start.z },
    { x: start.x, y: 0, z: 0.5 },
    { x: pickup.x, y: 0, z: 0.5 },
    { x: pickup.x, y: 0, z: pickup.z },
  ];
}
