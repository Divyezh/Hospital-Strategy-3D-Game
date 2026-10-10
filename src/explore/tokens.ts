/**
 * MediCity Explore - Design Tokens & Palette
 * Reference: Calm, realistic medical campus aesthetic
 */

export const EXPLORE_TOKENS = {
  colors: {
    // Architectural
    wallWhite: '#F4F1EA',
    concrete: '#D9D6CE',
    glassTeal: '#4FA3A5',
    glassTealDark: '#337173',
    medicalBlue: '#3A6EA5',
    medicalBlueLight: '#5C8EC4',
    medicalBlueDark: '#1E4875',
    woodWarm: '#C9A27A',
    woodDark: '#9C754F',
    metalSteel: '#88929A',
    metalDark: '#2C3238',
    fenceIron: '#202428',
    
    // Medical & Emergency
    emergencyRed: '#D64545',
    crossRed: '#E13B3B',
    alertOrange: '#E58A32',
    scrubsGreen: '#3B7E67',
    scrubsTeal: '#2A7F85',
    doctorWhite: '#FAFAF7',
    securityNavy: '#1E2C44',

    // Terrain & Landscape
    asphalt: '#5B6068',
    asphaltDark: '#444950',
    asphaltMarkingYellow: '#F2C14E',
    asphaltMarkingWhite: '#ECEEEF',
    curbStone: '#C8C5BD',
    pavingLight: '#E2DFD8',
    pavingDark: '#CAC5BA',
    grassSage: '#8DB48E',
    grassDeep: '#3F6B4B',
    grassLawn: '#5E8B56',
    hedgeDark: '#2D4E35',
    waterBlue: '#548C9E',
    flowerPink: '#E87A90',
    flowerYellow: '#F5CE62',
    flowerLavender: '#9F86C0',

    // Sky & Lighting
    skyPeach: '#F7E7D3',
    skySoftBlue: '#BFD9F2',
    skyGolden: '#FFE6C7',
    skyNight: '#0C1524',
    sunGolden: '#FFF1DC',
    sunNoon: '#FFFBF0',
    sunNight: '#263753',

    // Glassmorphism UI
    glassBg: 'rgba(255, 255, 255, 0.78)',
    glassBgSubtle: 'rgba(255, 255, 255, 0.58)',
    glassBorder: 'rgba(255, 255, 255, 0.65)',
    cardShadow: '0 12px 32px -4px rgba(28, 48, 74, 0.08), 0 4px 12px -2px rgba(28, 48, 74, 0.04)',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
  },
  dimensions: {
    groundRadius: 180,
    campusWidth: 120,
    campusDepth: 120,
    buildingWidth: 42,
    buildingDepth: 36,
    floorHeight: 4.2,
    fenceHeight: 2.2,
    gateWidth: 10,
  },
  quality: {
    low: {
      postprocessing: false,
      shadowResolution: 1024,
      peopleCount: 40,
      dpr: 1,
    },
    medium: {
      postprocessing: true,
      shadowResolution: 2048,
      peopleCount: 80,
      dpr: 1.5,
    },
    high: {
      postprocessing: true,
      shadowResolution: 4096,
      peopleCount: 130,
      dpr: 2,
    },
  },
} as const;
