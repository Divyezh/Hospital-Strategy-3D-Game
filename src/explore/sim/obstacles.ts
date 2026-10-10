/**
 * Static Obstacle Collision Boxes (AABB) for MediCity Campus
 * Used by invariants checker and pure pursuit path validator to guarantee 0 collisions.
 */

export interface ObstacleBox {
  id: string;
  name: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export const CAMPUS_OBSTACLES: ObstacleBox[] = [
  // 1. South Perimeter Wall - Left Section (from X = -65 to X = -6.5, Z = 56)
  {
    id: 'wall_south_left',
    name: 'South Perimeter Wall (Left)',
    minX: -65.5,
    maxX: -6.5,
    minY: 0,
    maxY: 2.6,
    minZ: 55.6,
    maxZ: 56.4,
  },

  // 2. South Perimeter Wall - Right Section (from X = 6.5 to X = 65, Z = 56)
  {
    id: 'wall_south_right',
    name: 'South Perimeter Wall (Right)',
    minX: 6.5,
    maxX: 65.5,
    minY: 0,
    maxY: 2.6,
    minZ: 55.6,
    maxZ: 56.4,
  },

  // 3. Main Gate Masonry Archway Pillars
  {
    id: 'pillar_gate_left',
    name: 'Main Gate Left Pillar',
    minX: -6.6,
    maxX: -5.4,
    minY: 0,
    maxY: 6.5,
    minZ: 55.4,
    maxZ: 56.6,
  },
  {
    id: 'pillar_gate_right',
    name: 'Main Gate Right Pillar',
    minX: 5.4,
    maxX: 6.6,
    minY: 0,
    maxY: 6.5,
    minZ: 55.4,
    maxZ: 56.6,
  },

  // 4. Guard Booth Structure
  {
    id: 'guard_booth',
    name: 'Security Guard Booth',
    minX: 6.6,
    maxX: 9.8,
    minY: 0,
    maxY: 3.5,
    minZ: 54.3,
    maxZ: 57.7,
  },

  // 5. Barrier Arm Motor Pedestal
  {
    id: 'barrier_pedestal',
    name: 'Barrier Arm Housing Pedestal',
    minX: -5.5,
    maxX: -4.9,
    minY: 0,
    maxY: 1.2,
    minZ: 55.1,
    maxZ: 55.7,
  },

  // 6. North Perimeter Wall
  {
    id: 'wall_north',
    name: 'North Perimeter Wall',
    minX: -65.5,
    maxX: 65.5,
    minY: 0,
    maxY: 2.6,
    minZ: -54.5,
    maxZ: -53.5,
  },

  // 7. East Perimeter Wall
  {
    id: 'wall_east',
    name: 'East Perimeter Wall',
    minX: 64.6,
    maxX: 65.4,
    minY: 0,
    maxY: 2.6,
    minZ: -54.0,
    maxZ: 56.0,
  },

  // 8. West Perimeter Wall
  {
    id: 'wall_west',
    name: 'West Perimeter Wall',
    minX: -65.4,
    maxX: -64.6,
    minY: 0,
    maxY: 2.6,
    minZ: -54.0,
    maxZ: 56.0,
  },

  // 9. Main Hospital Building Solid Core
  {
    id: 'hospital_main_building',
    name: 'Hospital Main Building',
    minX: -22.0,
    maxX: 22.0,
    minY: 0,
    maxY: 13.0,
    minZ: -16.0,
    maxZ: 14.0,
  },

  // 10. Front Entrance Canopy Support Columns
  {
    id: 'canopy_col_front_sw',
    name: 'Front Canopy SW Column',
    minX: -9.3,
    maxX: -8.7,
    minY: 0,
    maxY: 4.8,
    minZ: 16.7,
    maxZ: 17.3,
  },
  {
    id: 'canopy_col_front_se',
    name: 'Front Canopy SE Column',
    minX: 8.7,
    maxX: 9.3,
    minY: 0,
    maxY: 4.8,
    minZ: 16.7,
    maxZ: 17.3,
  },
  {
    id: 'canopy_col_front_nw',
    name: 'Front Canopy NW Column',
    minX: -9.3,
    maxX: -8.7,
    minY: 0,
    maxY: 4.8,
    minZ: 24.7,
    maxZ: 25.3,
  },
  {
    id: 'canopy_col_front_ne',
    name: 'Front Canopy NE Column',
    minX: 8.7,
    maxX: 9.3,
    minY: 0,
    maxY: 4.8,
    minZ: 24.7,
    maxZ: 25.3,
  },

  // 11. ER Bay Canopy Support Columns
  {
    id: 'canopy_col_er_w',
    name: 'ER Canopy West Column',
    minX: -37.8,
    maxX: -37.2,
    minY: 0,
    maxY: 4.4,
    minZ: 10.7,
    maxZ: 11.3,
  },
  {
    id: 'canopy_col_er_e',
    name: 'ER Canopy East Column',
    minX: -37.8,
    maxX: -37.2,
    minY: 0,
    maxY: 4.4,
    minZ: 0.7,
    maxZ: 1.3,
  },
];
