/**
 * 2D / 3D Oriented Bounding Box (OBB) & Collision Utilities
 * Supports Separating Axis Theorem (SAT) tests between vehicle OBBs and static AABBs / other OBBs.
 */
import { ObstacleBox } from './obstacles';

export interface VehicleOBB {
  centerX: number;
  centerY: number;
  centerZ: number;
  halfWidth: number;   // along lateral axis
  halfHeight: number;  // along vertical Y axis
  halfLength: number;  // along forward heading axis
  yaw: number;         // rotation around Y
}

export interface Point2D {
  x: number;
  z: number;
}

// Get the 4 corner points of an OBB in the X-Z ground plane
export function getOBBVertices2D(obb: VehicleOBB): Point2D[] {
  const cos = Math.cos(obb.yaw);
  const sin = Math.sin(obb.yaw);

  // Forward unit vector in Three.js (facing -Z when yaw=0: dx = -sin, dz = -cos)
  const forwardX = -Math.sin(obb.yaw);
  const forwardZ = -Math.cos(obb.yaw);
  // Right unit vector
  const rightX = Math.cos(obb.yaw);
  const rightZ = -Math.sin(obb.yaw);

  const hw = obb.halfWidth;
  const hl = obb.halfLength;

  return [
    { x: obb.centerX + rightX * hw + forwardX * hl, z: obb.centerZ + rightZ * hw + forwardZ * hl },
    { x: obb.centerX - rightX * hw + forwardX * hl, z: obb.centerZ - rightZ * hw + forwardZ * hl },
    { x: obb.centerX - rightX * hw - forwardX * hl, z: obb.centerZ - rightZ * hw - forwardZ * hl },
    { x: obb.centerX + rightX * hw - forwardX * hl, z: obb.centerZ + rightZ * hw - forwardZ * hl },
  ];
}

// Check polygon projection overlap on an axis
function testAxisOverlap(axis: Point2D, polyA: Point2D[], polyB: Point2D[]): boolean {
  let minA = Infinity, maxA = -Infinity;
  for (const p of polyA) {
    const dot = p.x * axis.x + p.z * axis.z;
    if (dot < minA) minA = dot;
    if (dot > maxA) maxA = dot;
  }

  let minB = Infinity, maxB = -Infinity;
  for (const p of polyB) {
    const dot = p.x * axis.x + p.z * axis.z;
    if (dot < minB) minB = dot;
    if (dot > maxB) maxB = dot;
  }

  return !(maxA < minB || maxB < minA);
}

// Test intersection between two convex 2D polygons using SAT
export function polygonsIntersect2D(polyA: Point2D[], polyB: Point2D[]): boolean {
  const getAxes = (poly: Point2D[]): Point2D[] => {
    const axes: Point2D[] = [];
    for (let i = 0; i < poly.length; i++) {
      const next = (i + 1) % poly.length;
      const edgeX = poly[next].x - poly[i].x;
      const edgeZ = poly[next].z - poly[i].z;
      const len = Math.hypot(edgeX, edgeZ) || 1;
      axes.push({ x: -edgeZ / len, z: edgeX / len });
    }
    return axes;
  };

  const axes = [...getAxes(polyA), ...getAxes(polyB)];
  for (const axis of axes) {
    if (!testAxisOverlap(axis, polyA, polyB)) {
      return false; // Found separating axis
    }
  }
  return true;
}

// Check if a vehicle OBB intersects an obstacle box (AABB)
export function vehicleIntersectsObstacle(obb: VehicleOBB, box: ObstacleBox): boolean {
  // 1. Fast Y-axis height separation check
  const obbMinY = obb.centerY - obb.halfHeight;
  const obbMaxY = obb.centerY + obb.halfHeight;
  if (obbMaxY < box.minY || obbMinY > box.maxY) {
    return false;
  }

  // 2. 2D SAT intersection test in XZ ground plane
  const polyA = getOBBVertices2D(obb);
  const polyB: Point2D[] = [
    { x: box.minX, z: box.minZ },
    { x: box.maxX, z: box.minZ },
    { x: box.maxX, z: box.maxZ },
    { x: box.minX, z: box.maxZ },
  ];

  return polygonsIntersect2D(polyA, polyB);
}

// Check if two vehicle OBBs intersect
export function vehicleOBBsIntersect(a: VehicleOBB, b: VehicleOBB): boolean {
  const aMinY = a.centerY - a.halfHeight;
  const aMaxY = a.centerY + a.halfHeight;
  const bMinY = b.centerY - b.halfHeight;
  const bMaxY = b.centerY + b.halfHeight;
  if (aMaxY < bMinY || aMinY > bMaxY) {
    return false;
  }

  return polygonsIntersect2D(getOBBVertices2D(a), getOBBVertices2D(b));
}

// Check if a point (pedestrian) is inside a vehicle OBB in 2D
export function pointInsideOBB2D(px: number, pz: number, obb: VehicleOBB): boolean {
  const dx = px - obb.centerX;
  const dz = pz - obb.centerZ;

  // Un-rotate by -yaw
  const forwardX = -Math.sin(obb.yaw);
  const forwardZ = -Math.cos(obb.yaw);
  const rightX = Math.cos(obb.yaw);
  const rightZ = -Math.sin(obb.yaw);

  const localX = dx * rightX + dz * rightZ;
  const localZ = dx * forwardX + dz * forwardZ;

  return Math.abs(localX) <= obb.halfWidth && Math.abs(localZ) <= obb.halfLength;
}
