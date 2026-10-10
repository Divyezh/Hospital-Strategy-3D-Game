export const CONFIG = {
  camera: {
    fov: 30,
    elevationAngle: (40 * Math.PI) / 180, // ~40 degrees elevation
    azimuthAngle: (45 * Math.PI) / 180,   // ~45 degrees isometric-ish angle
    distance: 70,
    minDistance: 16,
    maxDistance: 175,
    minPolarAngle: Math.PI / 6,
    maxPolarAngle: (65 * Math.PI) / 180,
    defaultSiteId: 'site-mc-04',
  },

  colors: {
    sky: '#E6EBFA',
    ground: '#E6EBFA',              // Very light lavender-blue per spec
    groundGradient: '#DCE3F7',
    road: '#CBD5E1',                // Slightly darker asphalt
    roadLineWhite: '#FFFFFF',       // White lane dashes
    roadLineYellow: '#FBBF24',      // Yellow dashed ambulance slots
    curb: '#94A3B8',
    fencePost: '#94A3B8',
    fenceRail: '#CBD5E1',

    // Primary Accents
    accentRoyalBlue: '#2F5BEA',     // Accent royal blue per spec
    buildingWall: '#F8FAFC',        // Clean hospital off-white
    buildingWallShade: '#E2E8F0',
    buildingRoof: '#2F5BEA',        // Royal blue roof
    buildingTrim: '#2F5BEA',        // Door frames, trim
    glassWindow: '#93C5FD',         // Soft reflective glass
    glassCanopy: '#60A5FA',

    // Nature
    grass: '#86EFAC',               // Soft pastel green grass
    grassDark: '#4ADE80',
    treeTrunk: '#854D0E',
    treeFoliage: '#10B981',
    treeFoliageAlt: '#059669',
    flowerPink: '#F472B6',
    flowerYellow: '#FBBF24',

    // Helipad & Bay markings
    helipadPad: '#475569',
    helipadLine: '#FBBF24',
    helipadH: '#EF4444',
    beaconRed: '#EF4444',
    beaconGreen: '#10B981',

    // Site Accents
    site01Accent: '#2F5BEA',
    site02Accent: '#DC2626',
    site03Accent: '#0D9488',
    site04Accent: '#2563EB',
  },
};
