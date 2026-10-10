/**
 * MediCity Explore - Campus Layout & Architectural Geometry
 * Pure data structures defining grounds, roads, parking, gates, exclusion zones, and props.
 */

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface TreeSpec {
  x: number;
  z: number;
  scale: number;
  type: 'broadleaf' | 'palm' | 'ornamental' | 'flowering';
  rotation: number;
  tintIndex: number;
}

export interface LampSpec {
  x: number;
  z: number;
  rotation: number;
  height: number;
}

export interface BenchSpec {
  x: number;
  z: number;
  rotation: number;
}

export interface CityBuildingSpec {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  type: 'tower' | 'residential' | 'commercial';
  windowColor?: string;
}

export const CAMPUS_LAYOUT = {
  // Main campus perimeter dimensions
  boundary: {
    minX: -65,
    maxX: 65,
    minZ: -55,
    maxZ: 58,
  },

  // Hospital building footprint (exclusion for trees & general terrain props)
  buildingFootprint: {
    minX: -24,
    maxX: 24,
    minZ: -20,
    maxZ: 18,
  },

  // Main Gate position
  mainGate: {
    x: 0,
    z: 56,
    width: 14,
    archHeight: 6.2,
    booth: {
      x: 8.5,
      z: 56,
      width: 3.2,
      depth: 3.6,
      height: 3.2,
    },
    pedestrianTurnstile: {
      x: -6.5,
      z: 56,
    },
  },

  // Driveway & road networks
  driveways: {
    // Entrance avenue from gate to drop-off loop
    entranceAvenue: {
      minX: -5.5,
      maxX: 5.5,
      minZ: 24,
      maxZ: 58,
    },
    // Front drop-off canopy loop
    dropOffCanopy: {
      x: 0,
      z: 21,
      width: 22,
      depth: 7,
      height: 4.8,
    },
    // ER Ambulance Bay & Canopy
    ambulanceBay: {
      x: -32,
      z: 6,
      width: 12,
      depth: 18,
      canopyHeight: 4.5,
    },
    // Ambulance driveway branching from loop to ER bay
    ambulanceDriveway: {
      minX: -36,
      maxX: -5,
      minZ: 14,
      maxZ: 24,
    },
    // Visitor parking lot with solar canopy
    visitorParking: {
      minX: 18,
      maxX: 54,
      minZ: 26,
      maxZ: 50,
      solarCanopy: true,
      spotsCount: 24,
    },
    // Staff parking lot
    staffParking: {
      minX: 22,
      maxX: 54,
      minZ: -12,
      maxZ: 12,
      spotsCount: 16,
    },
    // Bus stop shelter outside gate
    busStop: {
      x: 14,
      z: 62,
      width: 5,
      depth: 2.4,
    },
  },

  // Courtyard & healing garden
  gardenCourtyard: {
    minX: -54,
    maxX: -24,
    minZ: -48,
    maxZ: -8,
    waterFeature: {
      x: -39,
      z: -28,
      radius: 4.5,
    },
  },

  // Exclusion zones where foliage / decorative clutter cannot spawn
  exclusionZones: [
    // Hospital building
    { minX: -26, maxX: 26, minZ: -22, maxZ: 20 },
    // Main entrance drive
    { minX: -7, maxX: 7, minZ: 22, maxZ: 60 },
    // Drop-off loop area
    { minX: -14, maxX: 14, minZ: 16, maxZ: 26 },
    // ER bay and driveway
    { minX: -40, maxX: -4, minZ: -4, maxZ: 26 },
    // Visitor parking
    { minX: 16, maxX: 56, minZ: 24, maxZ: 52 },
    // Staff parking
    { minX: 20, maxX: 56, minZ: -14, maxZ: 14 },
    // Garden water pool
    { minX: -45, maxX: -33, minZ: -34, maxZ: -22 },
  ] as BoundingBox2D[],

  // Surrounding neighbourhood buildings (backdrop - 3X expanded city boundary)
  neighbourhoodBuildings: [
    // North side (behind hospital, far backdrop)
    { x: -140, z: -185, width: 34, depth: 28, height: 52, color: '#CCD5DC', type: 'tower', windowColor: '#4FA3A5' },
    { x: -80, z: -195, width: 30, depth: 32, height: 68, color: '#D8DEE4', type: 'tower', windowColor: '#3A6EA5' },
    { x: 0, z: -205, width: 38, depth: 30, height: 78, color: '#C4CED8', type: 'tower', windowColor: '#4FA3A5' },
    { x: 80, z: -195, width: 32, depth: 28, height: 62, color: '#CBD4DC', type: 'tower', windowColor: '#4FA3A5' },
    { x: 140, z: -185, width: 36, depth: 32, height: 48, color: '#E2E6EA', type: 'residential' },

    // East side (expanded beyond East Avenue)
    { x: 175, z: -90, width: 32, depth: 34, height: 44, color: '#D3DAE0', type: 'residential' },
    { x: 185, z: 0, width: 34, depth: 30, height: 65, color: '#CAD2D9', type: 'tower', windowColor: '#4FA3A5' },
    { x: 180, z: 90, width: 30, depth: 36, height: 42, color: '#E0E5EA', type: 'residential' },
    { x: 170, z: 140, width: 34, depth: 30, height: 38, color: '#D6DDE2', type: 'commercial' },

    // South side (across perimeter boulevard - pushed back so foreground is wide open)
    { x: -150, z: 165, width: 32, depth: 30, height: 46, color: '#D0D7DE', type: 'residential' },
    { x: -80, z: 175, width: 36, depth: 32, height: 40, color: '#DCE2E6', type: 'commercial' },
    { x: 0, z: 180, width: 30, depth: 28, height: 34, color: '#E4E7EB', type: 'commercial' },
    { x: 80, z: 175, width: 34, depth: 32, height: 42, color: '#CED6DC', type: 'residential' },
    { x: 150, z: 165, width: 32, depth: 30, height: 50, color: '#C8D1D8', type: 'tower', windowColor: '#3A6EA5' },

    // West side (expanded beyond West Avenue)
    { x: -175, z: -90, width: 30, depth: 32, height: 45, color: '#D5DCE2', type: 'residential' },
    { x: -185, z: 0, width: 34, depth: 30, height: 65, color: '#C5CFD7', type: 'tower', windowColor: '#4FA3A5' },
    { x: -180, z: 80, width: 32, depth: 34, height: 42, color: '#DFE4E8', type: 'residential' },
    { x: -170, z: 140, width: 30, depth: 30, height: 36, color: '#E1E5E9', type: 'commercial' },
  ] as CityBuildingSpec[],
};

/**
 * Pre-calculated tree positions distributed strategically across gardens, borders, and lawns,
 * strictly outside exclusion zones.
 */
export function generateCampusTrees(): TreeSpec[] {
  const trees: TreeSpec[] = [];

  // 1. Garden Courtyard clusters (lush green, flowering, ornamental)
  const gardenPositions = [
    { x: -48, z: -16, t: 'broadleaf' },
    { x: -44, z: -20, t: 'ornamental' },
    { x: -50, z: -24, t: 'flowering' },
    { x: -47, z: -36, t: 'broadleaf' },
    { x: -42, z: -42, t: 'flowering' },
    { x: -34, z: -45, t: 'broadleaf' },
    { x: -28, z: -42, t: 'ornamental' },
    { x: -28, z: -36, t: 'broadleaf' },
    { x: -28, z: -24, t: 'flowering' },
    { x: -33, z: -16, t: 'ornamental' },
    { x: -38, z: -14, t: 'broadleaf' },
    { x: -51, z: -32, t: 'broadleaf' },
    { x: -45, z: -46, t: 'broadleaf' },
  ];

  gardenPositions.forEach((p, idx) => {
    trees.push({
      x: p.x,
      z: p.z,
      scale: 0.9 + (idx % 4) * 0.12,
      type: p.t as TreeSpec['type'],
      rotation: (idx * 1.3) % (Math.PI * 2),
      tintIndex: idx % 3,
    });
  });

  // 2. Front Avenue & Gate Palms & Ornamentals
  const avenuePositions = [
    { x: -8.5, z: 50, t: 'palm' },
    { x: 8.5, z: 50, t: 'palm' },
    { x: -8.5, z: 42, t: 'palm' },
    { x: 8.5, z: 42, t: 'palm' },
    { x: -8.5, z: 34, t: 'palm' },
    { x: 8.5, z: 34, t: 'palm' },
    { x: -8.5, z: 26, t: 'palm' },
    { x: 8.5, z: 26, t: 'palm' },
    // Gate perimeter flair
    { x: -16, z: 52, t: 'ornamental' },
    { x: -22, z: 52, t: 'broadleaf' },
    { x: 16, z: 52, t: 'ornamental' },
    { x: 22, z: 52, t: 'broadleaf' },
  ];

  avenuePositions.forEach((p, idx) => {
    trees.push({
      x: p.x,
      z: p.z,
      scale: 0.95 + (idx % 3) * 0.1,
      type: p.t as TreeSpec['type'],
      rotation: (idx * 0.8) % (Math.PI * 2),
      tintIndex: idx % 3,
    });
  });

  // 3. Perimeter Boundary Fence Green Buffer (North, East, West borders)
  // North border (z: -50)
  for (let x = -60; x <= 60; x += 9) {
    if (x >= -22 && x <= 22) continue; // behind building
    trees.push({
      x,
      z: -50,
      scale: 1.0 + ((x + 60) % 5) * 0.08,
      type: (x % 2 === 0 ? 'broadleaf' : 'ornamental'),
      rotation: (x * 0.5) % (Math.PI * 2),
      tintIndex: (Math.abs(x) % 3),
    });
  }

  // East border (x: 58)
  for (let z = -48; z <= 52; z += 10) {
    trees.push({
      x: 58,
      z,
      scale: 0.9 + ((z + 50) % 4) * 0.1,
      type: (z % 3 === 0 ? 'broadleaf' : 'palm'),
      rotation: (z * 0.4) % (Math.PI * 2),
      tintIndex: (Math.abs(z) % 3),
    });
  }

  // West border (x: -58)
  for (let z = -48; z <= 52; z += 10) {
    trees.push({
      x: -58,
      z,
      scale: 0.92 + ((z + 50) % 3) * 0.12,
      type: (z % 2 === 0 ? 'broadleaf' : 'ornamental'),
      rotation: (z * 0.7) % (Math.PI * 2),
      tintIndex: (Math.abs(z) % 3),
    });
  }

  // 4. North building green backdrop lawn (z: -32 to -44)
  for (let x = -18; x <= 18; x += 7) {
    trees.push({
      x,
      z: -36,
      scale: 1.05 + (Math.abs(x) % 3) * 0.1,
      type: (x % 3 === 0 ? 'flowering' : 'broadleaf'),
      rotation: (x * 1.1) % (Math.PI * 2),
      tintIndex: Math.abs(x) % 3,
    });
  }

  return trees;
}

/**
 * Campus streetlights layout along driveways, parking lots, and garden
 */
export function generateCampusStreetlights(): LampSpec[] {
  return [
    // Entrance drive
    { x: -7, z: 52, rotation: Math.PI / 2, height: 4.8 },
    { x: 7, z: 52, rotation: -Math.PI / 2, height: 4.8 },
    { x: -7, z: 40, rotation: Math.PI / 2, height: 4.8 },
    { x: 7, z: 40, rotation: -Math.PI / 2, height: 4.8 },
    { x: -7, z: 28, rotation: Math.PI / 2, height: 4.8 },
    { x: 7, z: 28, rotation: -Math.PI / 2, height: 4.8 },

    // Drop-off loop & Main entrance
    { x: -14, z: 22, rotation: 0, height: 4.8 },
    { x: 14, z: 22, rotation: 0, height: 4.8 },

    // ER Ambulance Bay
    { x: -36, z: 20, rotation: Math.PI / 4, height: 4.8 },
    { x: -25, z: 22, rotation: 0, height: 4.8 },
    { x: -38, z: 4, rotation: Math.PI / 2, height: 4.8 },

    // Visitor Parking Lot
    { x: 20, z: 32, rotation: -Math.PI / 2, height: 5.2 },
    { x: 36, z: 32, rotation: -Math.PI / 2, height: 5.2 },
    { x: 50, z: 32, rotation: -Math.PI / 2, height: 5.2 },
    { x: 20, z: 46, rotation: -Math.PI / 2, height: 5.2 },
    { x: 36, z: 46, rotation: -Math.PI / 2, height: 5.2 },
    { x: 50, z: 46, rotation: -Math.PI / 2, height: 5.2 },

    // Canteen Plaza Perimeter Lighting
    { x: 23.5, z: 12, rotation: 0, height: 5.2 },
    { x: 53.5, z: 12, rotation: 0, height: 5.2 },
    { x: 23.5, z: -12, rotation: Math.PI, height: 5.2 },
    { x: 53.5, z: -12, rotation: Math.PI, height: 5.2 },

    // Courtyard & Garden
    { x: -32, z: -20, rotation: Math.PI / 3, height: 3.8 },
    { x: -46, z: -20, rotation: -Math.PI / 3, height: 3.8 },
    { x: -32, z: -36, rotation: Math.PI * 0.8, height: 3.8 },
    { x: -46, z: -36, rotation: -Math.PI * 0.8, height: 3.8 },
  ];
}

/**
 * Courtyard & pathway wooden benches
 */
export function generateCampusBenches(): BenchSpec[] {
  return [
    { x: -39, z: -21, rotation: 0 },
    { x: -39, z: -35, rotation: Math.PI },
    { x: -32, z: -28, rotation: -Math.PI / 2 },
    { x: -46, z: -28, rotation: Math.PI / 2 },
    { x: -4, z: 23, rotation: Math.PI },
    { x: 4, z: 23, rotation: Math.PI },
    { x: 14, z: 61, rotation: Math.PI }, // Bus stop bench
  ];
}
