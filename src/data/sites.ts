export interface BayDefinition {
  id: string;
  name: string;
  slotNumber: number;
  position: [number, number, number];
  rotation: number;
  status: 'available' | 'reserved' | 'occupied';
  assignedAmbulanceId?: string;
}

export interface RestStationDefinition {
  id: string;
  name: string;
  position: [number, number, number];
  capacity: number;
  currentStaffCount: number;
}

export interface SiteDefinition {
  id: string;
  code: string;
  name: string;
  shortName: string;
  tagline: string;
  address: string;
  center: [number, number, number];
  cameraOffset: [number, number, number];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  bays: BayDefinition[];
  restStations: RestStationDefinition[];
  beds: { total: number; occupied: number };
  supplies: {
    nitrileGloves: { count: number; minThreshold: number };
    surgicalMasks: { count: number; minThreshold: number };
    ivFluids: { count: number; minThreshold: number };
    oxygenCylinders: { count: number; minThreshold: number };
  };
  features: string[];
}

export const SITES: SiteDefinition[] = [
  {
    id: 'site-mc-01',
    code: 'MC-01',
    name: 'City General Hospital',
    shortName: 'City General',
    tagline: 'Acute Care & Multi-Wing Inpatient Campus',
    address: '420 Metro Parkway, Central District',
    center: [-42, 0, -42],
    cameraOffset: [-42, 0, -42],
    bounds: { minX: -68, maxX: -16, minZ: -68, maxZ: -16 },
    bays: [
      { id: 'mc01-bay-1', name: 'Bay 1 (North Acute)', slotNumber: 1, position: [-28, 0, -52], rotation: 0, status: 'occupied', assignedAmbulanceId: 'AMB-1011' },
      { id: 'mc01-bay-2', name: 'Bay 2 (Rapid Triage)', slotNumber: 2, position: [-28, 0, -44], rotation: 0, status: 'available' },
      { id: 'mc01-bay-3', name: 'Bay 3 (General Transfer)', slotNumber: 3, position: [-28, 0, -36], rotation: 0, status: 'reserved', assignedAmbulanceId: 'AMB-1014' },
    ],
    restStations: [
      { id: 'mc01-rest-1', name: 'Staff Hub Alpha', position: [-48, 0, -34], capacity: 4, currentStaffCount: 2 },
      { id: 'mc01-rest-2', name: 'Orderly Quarters East', position: [-36, 0, -28], capacity: 3, currentStaffCount: 1 },
    ],
    beds: { total: 420, occupied: 312 },
    supplies: {
      nitrileGloves: { count: 850, minThreshold: 300 },
      surgicalMasks: { count: 620, minThreshold: 250 },
      ivFluids: { count: 240, minThreshold: 100 },
      oxygenCylinders: { count: 48, minThreshold: 20 },
    },
    features: ['Multi-wing pavilions', 'Healing garden with fountains', 'Visitor parking lot', 'Main canopy entrance'],
  },
  {
    id: 'site-mc-02',
    code: 'MC-02',
    name: 'Riverside Trauma Center',
    shortName: 'Riverside Trauma',
    tagline: 'Level-1 Emergency Trauma & Air Medevac',
    address: '108 Riverfront Drive, South Quay',
    center: [42, 0, -42],
    cameraOffset: [42, 0, -42],
    bounds: { minX: 16, maxX: 68, minZ: -68, maxZ: -16 },
    bays: [
      { id: 'mc02-bay-1', name: 'ER Bay 1 (Resus)', slotNumber: 1, position: [30, 0, -54], rotation: 0, status: 'occupied', assignedAmbulanceId: 'AMB-2201' },
      { id: 'mc02-bay-2', name: 'ER Bay 2 (Cardiac)', slotNumber: 2, position: [30, 0, -46], rotation: 0, status: 'occupied', assignedAmbulanceId: 'AMB-2205' },
      { id: 'mc02-bay-3', name: 'ER Bay 3 (Trauma)', slotNumber: 3, position: [30, 0, -38], rotation: 0, status: 'available' },
      { id: 'mc02-bay-4', name: 'ER Bay 4 (Stroke)', slotNumber: 4, position: [30, 0, -30], rotation: 0, status: 'available' },
    ],
    restStations: [
      { id: 'mc02-rest-1', name: 'Trauma Team Lounge', position: [48, 0, -32], capacity: 6, currentStaffCount: 3 },
      { id: 'mc02-rest-2', name: 'Flight Crew Staging', position: [56, 0, -52], capacity: 4, currentStaffCount: 1 },
    ],
    beds: { total: 280, occupied: 242 },
    supplies: {
      nitrileGloves: { count: 920, minThreshold: 400 },
      surgicalMasks: { count: 710, minThreshold: 300 },
      ivFluids: { count: 380, minThreshold: 150 },
      oxygenCylinders: { count: 72, minThreshold: 30 },
    },
    features: ['Active Helipad with LED beacon ring', '4 High-velocity ER ambulance bays', 'Oxygen tank farm', 'Trauma annex'],
  },
  {
    id: 'site-mc-03',
    code: 'MC-03',
    name: 'Eastport Diagnostics & Imaging',
    shortName: 'Eastport Diagnostics',
    tagline: 'Advanced Radiology, MRI & Automated Pathology Labs',
    address: '88 Harbor Industrial Blvd, Eastport',
    center: [-42, 0, 42],
    cameraOffset: [-42, 0, 42],
    bounds: { minX: -68, maxX: -16, minZ: 16, maxZ: 68 },
    bays: [
      { id: 'mc03-bay-1', name: 'Intake Bay 1 (Diagnostics)', slotNumber: 1, position: [-28, 0, 34], rotation: 0, status: 'occupied', assignedAmbulanceId: 'AMB-3102' },
      { id: 'mc03-bay-2', name: 'Intake Bay 2 (Specimens)', slotNumber: 2, position: [-28, 0, 42], rotation: 0, status: 'available' },
      { id: 'mc03-bay-3', name: 'Supply Intake Bay', slotNumber: 3, position: [-28, 0, 50], rotation: 0, status: 'available' },
    ],
    restStations: [
      { id: 'mc03-rest-1', name: 'Radiology Tech Hub', position: [-46, 0, 54], capacity: 4, currentStaffCount: 2 },
    ],
    beds: { total: 160, occupied: 94 },
    supplies: {
      nitrileGloves: { count: 640, minThreshold: 200 },
      surgicalMasks: { count: 500, minThreshold: 180 },
      ivFluids: { count: 120, minThreshold: 50 },
      oxygenCylinders: { count: 32, minThreshold: 15 },
    },
    features: ['Flat roof with 6 industrial HVAC chillers', 'Mobile MRI trailer unit with umbilical connection', 'Pathology laboratory wing'],
  },
  {
    id: 'site-mc-04',
    code: 'MC-04',
    name: 'Southfield Day-Care Center',
    shortName: 'Southfield Day-Care',
    tagline: 'High-Volume Outpatient Care & Surgical Day-Stay',
    address: '772 Sun Valley Road, Southfield',
    center: [42, 0, 42],
    cameraOffset: [42, 0, 42],
    bounds: { minX: 16, maxX: 68, minZ: 16, maxZ: 68 },
    bays: [
      { id: 'mc04-bay-1', name: 'Day Care Bay 1', slotNumber: 1, position: [26, 0, 26], rotation: 0, status: 'occupied', assignedAmbulanceId: 'AMB-4001' },
      { id: 'mc04-bay-2', name: 'Day Care Bay 2', slotNumber: 2, position: [26, 0, 32], rotation: 0, status: 'occupied', assignedAmbulanceId: 'AMB-4003' },
      { id: 'mc04-bay-3', name: 'Day Care Bay 3', slotNumber: 3, position: [26, 0, 38], rotation: 0, status: 'available' },
      { id: 'mc04-bay-4', name: 'Day Care Bay 4', slotNumber: 4, position: [26, 0, 44], rotation: 0, status: 'available' },
      { id: 'mc04-bay-5', name: 'Day Care Bay 5', slotNumber: 5, position: [26, 0, 50], rotation: 0, status: 'available' },
      { id: 'mc04-bay-6', name: 'Day Care Bay 6', slotNumber: 6, position: [26, 0, 56], rotation: 0, status: 'available' },
    ],
    restStations: [
      { id: 'mc04-rest-1', name: 'Outpatient Nursing Base', position: [52, 0, 32], capacity: 5, currentStaffCount: 2 },
      { id: 'mc04-rest-2', name: 'Transit Crew Lounge', position: [54, 0, 52], capacity: 4, currentStaffCount: 1 },
    ],
    beds: { total: 210, occupied: 126 },
    supplies: {
      nitrileGloves: { count: 780, minThreshold: 250 },
      surgicalMasks: { count: 680, minThreshold: 220 },
      ivFluids: { count: 210, minThreshold: 90 },
      oxygenCylinders: { count: 40, minThreshold: 18 },
    },
    features: ['Sawtooth blue roof profile with skylights', '6-Bay continuous ambulance portico', 'Central courtyard with trees and benches'],
  },
];
