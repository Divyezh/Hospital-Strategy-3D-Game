/**
 * MediCity Explore - Hospital Layout Data
 * 3-Floor modular hospital building with detailed departments, rooms, props, and cutaway config.
 */

export interface PropItem {
  type:
    | 'desk'
    | 'reception_counter'
    | 'bed'
    | 'curtain'
    | 'monitor'
    | 'iv_stand'
    | 'ct_scanner'
    | 'mri_scanner'
    | 'lab_bench'
    | 'pharmacy_shelf'
    | 'ot_table'
    | 'ot_lamp'
    | 'chair'
    | 'sofa'
    | 'cafeteria_table'
    | 'plant'
    | 'computer'
    | 'stretcher';
  x: number;
  y: number;
  z: number;
  rotation?: number;
  color?: string;
}

export interface RoomSpec {
  id: string;
  name: string;
  floor: number; // 0 = G, 1 = 1st, 2 = 2nd
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  wallColor: string;
  floorColor: string;
  staffRoles: string[];
  capacity: number;
  cameraPreset: {
    target: [number, number, number];
    position: [number, number, number];
  };
  props: PropItem[];
}

export const FLOOR_HEIGHT = 4.2;
export const BUILDING_BOUNDS = {
  minX: -22,
  maxX: 22,
  minZ: -16,
  maxZ: 14,
  height: FLOOR_HEIGHT * 3, // ~12.6m
};

export const HOSPITAL_ROOMS: RoomSpec[] = [
  // ================= GROUND FLOOR (y = 0) =================
  {
    id: 'lobby_reception',
    name: 'Main Lobby & Grand Reception',
    floor: 0,
    bounds: { minX: -6, maxX: 10, minZ: 0, maxZ: 14 },
    wallColor: '#F4F1EA',
    floorColor: '#E8E5DC',
    staffRoles: ['receptionist', 'admin', 'security', 'nurse'],
    capacity: 28,
    cameraPreset: { target: [2, 1.8, 7], position: [2, 10, 20] },
    props: [
      // Grand Double-Wide Reception Counters (spans 9m)
      { type: 'reception_counter', x: -0.5, y: 0, z: 4, rotation: 0 },
      { type: 'reception_counter', x: 4.5, y: 0, z: 4, rotation: 0 },
      { type: 'computer', x: -1.5, y: 1.1, z: 4 },
      { type: 'computer', x: 1.5, y: 1.1, z: 4 },
      { type: 'computer', x: 4.5, y: 1.1, z: 4 },
      { type: 'chair', x: -1.5, y: 0, z: 3 },
      { type: 'chair', x: 1.5, y: 0, z: 3 },
      { type: 'chair', x: 4.5, y: 0, z: 3 },

      // Grand Waiting Lounge: Plush Leather Sofas
      { type: 'sofa', x: -3.5, y: 0, z: 9, rotation: Math.PI / 2 },
      { type: 'sofa', x: -3.5, y: 0, z: 12.5, rotation: Math.PI / 2 },
      { type: 'sofa', x: 7.5, y: 0, z: 9, rotation: -Math.PI / 2 },
      { type: 'sofa', x: 7.5, y: 0, z: 12.5, rotation: -Math.PI / 2 },

      // Waiting Chairs Central Rows
      { type: 'chair', x: 0, y: 0, z: 9, rotation: 0 },
      { type: 'chair', x: 1.5, y: 0, z: 9, rotation: 0 },
      { type: 'chair', x: 3.0, y: 0, z: 9, rotation: 0 },
      { type: 'chair', x: 0, y: 0, z: 11.5, rotation: 0 },
      { type: 'chair', x: 1.5, y: 0, z: 11.5, rotation: 0 },
      { type: 'chair', x: 3.0, y: 0, z: 11.5, rotation: 0 },

      // Decorative Greenery & Directory
      { type: 'plant', x: -4.5, y: 0, z: 1.5 },
      { type: 'plant', x: 8.5, y: 0, z: 1.5 },
      { type: 'plant', x: -4.5, y: 0, z: 6.5 },
      { type: 'plant', x: 8.5, y: 0, z: 6.5 },
    ],
  },
  {
    id: 'emergency_er',
    name: 'Emergency (ER) & Triage Unit',
    floor: 0,
    bounds: { minX: -22, maxX: -6, minZ: 0, maxZ: 14 },
    wallColor: '#F0ECE1',
    floorColor: '#D8DEE4',
    staffRoles: ['doctor', 'nurse', 'paramedic', 'ward_boy'],
    capacity: 26,
    cameraPreset: { target: [-14, 1.8, 7], position: [-14, 10, 20] },
    props: [
      // 10 ER Emergency Beds with Live Cardiac Monitors & IV Drip Stands
      { type: 'bed', x: -19, y: 0, z: 2.5, rotation: Math.PI / 2 },
      { type: 'monitor', x: -20.5, y: 1.1, z: 2.5 },
      { type: 'iv_stand', x: -17.5, y: 0, z: 1.6 },

      { type: 'bed', x: -19, y: 0, z: 5.5, rotation: Math.PI / 2 },
      { type: 'monitor', x: -20.5, y: 1.1, z: 5.5 },
      { type: 'iv_stand', x: -17.5, y: 0, z: 4.6 },

      { type: 'bed', x: -19, y: 0, z: 8.5, rotation: Math.PI / 2 },
      { type: 'monitor', x: -20.5, y: 1.1, z: 8.5 },
      { type: 'iv_stand', x: -17.5, y: 0, z: 7.6 },

      { type: 'bed', x: -19, y: 0, z: 11.5, rotation: Math.PI / 2 },
      { type: 'monitor', x: -20.5, y: 1.1, z: 11.5 },
      { type: 'iv_stand', x: -17.5, y: 0, z: 10.6 },

      { type: 'bed', x: -9, y: 0, z: 2.5, rotation: -Math.PI / 2 },
      { type: 'monitor', x: -7.5, y: 1.1, z: 2.5 },
      { type: 'iv_stand', x: -10.5, y: 0, z: 1.6 },

      { type: 'bed', x: -9, y: 0, z: 5.5, rotation: -Math.PI / 2 },
      { type: 'monitor', x: -7.5, y: 1.1, z: 5.5 },
      { type: 'iv_stand', x: -10.5, y: 0, z: 4.6 },

      { type: 'bed', x: -9, y: 0, z: 8.5, rotation: -Math.PI / 2 },
      { type: 'monitor', x: -7.5, y: 1.1, z: 8.5 },
      { type: 'iv_stand', x: -10.5, y: 0, z: 7.6 },

      { type: 'bed', x: -9, y: 0, z: 11.5, rotation: -Math.PI / 2 },
      { type: 'monitor', x: -7.5, y: 1.1, z: 11.5 },
      { type: 'iv_stand', x: -10.5, y: 0, z: 10.6 },

      // Center Bay Beds (Emergency Resuscitation)
      { type: 'bed', x: -14, y: 0, z: 3.5, rotation: 0 },
      { type: 'monitor', x: -14, y: 1.1, z: 2.0 },
      { type: 'bed', x: -14, y: 0, z: 7.5, rotation: 0 },
      { type: 'monitor', x: -14, y: 1.1, z: 6.0 },

      // Triage Nurse Workstation
      { type: 'desk', x: -14, y: 0, z: 12.5 },
      { type: 'chair', x: -14, y: 0, z: 13.5 },
      { type: 'computer', x: -14, y: 0.85, z: 12.5 },
    ],
  },
  {
    id: 'pharmacy',
    name: 'Hospital Pharmacy',
    floor: 0,
    bounds: { minX: 10, maxX: 22, minZ: 0, maxZ: 14 },
    wallColor: '#F5F2EB',
    floorColor: '#E2DFD6',
    staffRoles: ['pharmacist'],
    capacity: 8,
    cameraPreset: { target: [16, 1.8, 7], position: [16, 10, 20] },
    props: [
      { type: 'pharmacy_shelf', x: 20.5, y: 0, z: 3, rotation: Math.PI / 2 },
      { type: 'pharmacy_shelf', x: 20.5, y: 0, z: 7, rotation: Math.PI / 2 },
      { type: 'pharmacy_shelf', x: 20.5, y: 0, z: 11, rotation: Math.PI / 2 },
      { type: 'desk', x: 14, y: 0, z: 8 },
      { type: 'computer', x: 14, y: 0.85, z: 8 },
      { type: 'chair', x: 14, y: 0, z: 9.5 },
    ],
  },
  {
    id: 'laboratory',
    name: 'Diagnostics & Pathology Lab',
    floor: 0,
    bounds: { minX: 6, maxX: 22, minZ: -16, maxZ: 0 },
    wallColor: '#EEF2F6',
    floorColor: '#DCE4EC',
    staffRoles: ['lab_tech'],
    capacity: 10,
    cameraPreset: { target: [14, 1.8, -8], position: [14, 10, 5] },
    props: [
      { type: 'lab_bench', x: 10, y: 0, z: -8, rotation: 0 },
      { type: 'lab_bench', x: 15, y: 0, z: -8, rotation: 0 },
      { type: 'lab_bench', x: 19, y: 0, z: -8, rotation: 0 },
      { type: 'desk', x: 14, y: 0, z: -3 },
      { type: 'computer', x: 14, y: 0.85, z: -3 },
      { type: 'chair', x: 14, y: 0, z: -1.5 },
    ],
  },
  {
    id: 'cafeteria',
    name: 'Hospital Cafeteria',
    floor: 0,
    bounds: { minX: -22, maxX: -6, minZ: -16, maxZ: 0 },
    wallColor: '#F7F3EC',
    floorColor: '#E6DEC9',
    staffRoles: ['cafeteria_staff'],
    capacity: 20,
    cameraPreset: { target: [-14, 1.8, -8], position: [-14, 10, 5] },
    props: [
      { type: 'cafeteria_table', x: -18, y: 0, z: -5 },
      { type: 'cafeteria_table', x: -11, y: 0, z: -5 },
      { type: 'cafeteria_table', x: -18, y: 0, z: -11 },
      { type: 'cafeteria_table', x: -11, y: 0, z: -11 },
      { type: 'desk', x: -7.5, y: 0, z: -8, rotation: Math.PI / 2 },
    ],
  },

  // ================= 1ST FLOOR (y = 4.2) =================
  {
    id: 'opd_clinic',
    name: 'OPD (Outpatient Department)',
    floor: 1,
    bounds: { minX: -22, maxX: -4, minZ: 0, maxZ: 14 },
    wallColor: '#F5F3ED',
    floorColor: '#E2DFD6',
    staffRoles: ['doctor', 'nurse'],
    capacity: 22,
    cameraPreset: { target: [-13, 1.8 + FLOOR_HEIGHT, 7], position: [-13, 11 + FLOOR_HEIGHT, 20] },
    props: [
      { type: 'desk', x: -18, y: FLOOR_HEIGHT, z: 4 },
      { type: 'chair', x: -18, y: FLOOR_HEIGHT, z: 2.8 },
      { type: 'chair', x: -18, y: FLOOR_HEIGHT, z: 5.2 },
      { type: 'desk', x: -9, y: FLOOR_HEIGHT, z: 4 },
      { type: 'chair', x: -9, y: FLOOR_HEIGHT, z: 2.8 },
      { type: 'desk', x: -18, y: FLOOR_HEIGHT, z: 10 },
      { type: 'chair', x: -18, y: FLOOR_HEIGHT, z: 8.8 },
      { type: 'desk', x: -9, y: FLOOR_HEIGHT, z: 10 },
      { type: 'chair', x: -9, y: FLOOR_HEIGHT, z: 8.8 },
    ],
  },
  {
    id: 'radiology',
    name: 'Radiology (CT & MRI Suites)',
    floor: 1,
    bounds: { minX: -4, maxX: 12, minZ: 0, maxZ: 14 },
    wallColor: '#EAF0F6',
    floorColor: '#CCD7E4',
    staffRoles: ['radiographer', 'doctor'],
    capacity: 10,
    cameraPreset: { target: [4, 1.8 + FLOOR_HEIGHT, 7], position: [4, 11 + FLOOR_HEIGHT, 20] },
    props: [
      { type: 'ct_scanner', x: 0, y: FLOOR_HEIGHT, z: 7 },
      { type: 'mri_scanner', x: 8, y: FLOOR_HEIGHT, z: 7 },
      { type: 'desk', x: 4, y: FLOOR_HEIGHT, z: 2 },
      { type: 'computer', x: 4, y: FLOOR_HEIGHT + 0.85, z: 2 },
      { type: 'chair', x: 4, y: FLOOR_HEIGHT, z: 3.2 },
    ],
  },
  {
    id: 'operation_theatre',
    name: 'Operation Theatres (OT 1 & 2)',
    floor: 1,
    bounds: { minX: 12, maxX: 22, minZ: -16, maxZ: 14 },
    wallColor: '#E6EFF0',
    floorColor: '#C0D8DA',
    staffRoles: ['surgeon', 'nurse'],
    capacity: 14,
    cameraPreset: { target: [17, 1.8 + FLOOR_HEIGHT, -1], position: [17, 11 + FLOOR_HEIGHT, 12] },
    props: [
      // OT 1
      { type: 'ot_table', x: 17, y: FLOOR_HEIGHT, z: 7 },
      { type: 'ot_lamp', x: 17, y: FLOOR_HEIGHT, z: 7 },
      { type: 'monitor', x: 19.5, y: FLOOR_HEIGHT + 1.2, z: 7 },
      // OT 2
      { type: 'ot_table', x: 17, y: FLOOR_HEIGHT, z: -8 },
      { type: 'ot_lamp', x: 17, y: FLOOR_HEIGHT, z: -8 },
      { type: 'monitor', x: 19.5, y: FLOOR_HEIGHT + 1.2, z: -8 },
    ],
  },
  {
    id: 'icu',
    name: 'Intensive Care Unit (ICU)',
    floor: 1,
    bounds: { minX: -22, maxX: 12, minZ: -16, maxZ: 0 },
    wallColor: '#F0F4F8',
    floorColor: '#D3DEE9',
    staffRoles: ['doctor', 'nurse', 'ward_boy'],
    capacity: 22,
    cameraPreset: { target: [-5, 1.8 + FLOOR_HEIGHT, -8], position: [-5, 11 + FLOOR_HEIGHT, 5] },
    props: [
      // 10 ICU Beds with multi-parameter cardiac life support monitors & IV stands
      { type: 'bed', x: -18, y: FLOOR_HEIGHT, z: -5, rotation: Math.PI / 2 },
      { type: 'monitor', x: -19.5, y: FLOOR_HEIGHT + 1.2, z: -5 },
      { type: 'iv_stand', x: -16.5, y: FLOOR_HEIGHT, z: -6 },

      { type: 'bed', x: -12, y: FLOOR_HEIGHT, z: -5, rotation: Math.PI / 2 },
      { type: 'monitor', x: -13.5, y: FLOOR_HEIGHT + 1.2, z: -5 },
      { type: 'iv_stand', x: -10.5, y: FLOOR_HEIGHT, z: -6 },

      { type: 'bed', x: -6, y: FLOOR_HEIGHT, z: -5, rotation: Math.PI / 2 },
      { type: 'monitor', x: -7.5, y: FLOOR_HEIGHT + 1.2, z: -5 },

      { type: 'bed', x: 0, y: FLOOR_HEIGHT, z: -5, rotation: Math.PI / 2 },
      { type: 'monitor', x: -1.5, y: FLOOR_HEIGHT + 1.2, z: -5 },

      { type: 'bed', x: 6, y: FLOOR_HEIGHT, z: -5, rotation: Math.PI / 2 },
      { type: 'monitor', x: 4.5, y: FLOOR_HEIGHT + 1.2, z: -5 },

      // Second Row of ICU Beds
      { type: 'bed', x: -18, y: FLOOR_HEIGHT, z: -11, rotation: -Math.PI / 2 },
      { type: 'monitor', x: -19.5, y: FLOOR_HEIGHT + 1.2, z: -11 },

      { type: 'bed', x: -12, y: FLOOR_HEIGHT, z: -11, rotation: -Math.PI / 2 },
      { type: 'monitor', x: -13.5, y: FLOOR_HEIGHT + 1.2, z: -11 },

      { type: 'bed', x: -6, y: FLOOR_HEIGHT, z: -11, rotation: -Math.PI / 2 },
      { type: 'monitor', x: -7.5, y: FLOOR_HEIGHT + 1.2, z: -11 },

      { type: 'bed', x: 0, y: FLOOR_HEIGHT, z: -11, rotation: -Math.PI / 2 },
      { type: 'monitor', x: -1.5, y: FLOOR_HEIGHT + 1.2, z: -11 },

      { type: 'bed', x: 6, y: FLOOR_HEIGHT, z: -11, rotation: -Math.PI / 2 },
      { type: 'monitor', x: 4.5, y: FLOOR_HEIGHT + 1.2, z: -11 },

      // Central Nurse Station Command Desk
      { type: 'reception_counter', x: -5, y: FLOOR_HEIGHT, z: -14 },
      { type: 'chair', x: -6.5, y: FLOOR_HEIGHT, z: -15 },
      { type: 'chair', x: -3.5, y: FLOOR_HEIGHT, z: -15 },
      { type: 'computer', x: -6.5, y: FLOOR_HEIGHT + 1.1, z: -14 },
      { type: 'computer', x: -3.5, y: FLOOR_HEIGHT + 1.1, z: -14 },
    ],
  },

  // ================= 2ND FLOOR (y = 8.4) =================
  {
    id: 'general_wards',
    name: 'Inpatient General Wards',
    floor: 2,
    bounds: { minX: -22, maxX: 0, minZ: -16, maxZ: 14 },
    wallColor: '#F7F5EE',
    floorColor: '#E6E1D4',
    staffRoles: ['doctor', 'nurse', 'ward_boy'],
    capacity: 28,
    cameraPreset: { target: [-11, 1.8 + FLOOR_HEIGHT * 2, -1], position: [-11, 12 + FLOOR_HEIGHT * 2, 14] },
    props: [
      // 12 Inpatient Ward Beds
      { type: 'bed', x: -18, y: FLOOR_HEIGHT * 2, z: 10, rotation: Math.PI / 2 },
      { type: 'bed', x: -12, y: FLOOR_HEIGHT * 2, z: 10, rotation: Math.PI / 2 },
      { type: 'bed', x: -6, y: FLOOR_HEIGHT * 2, z: 10, rotation: Math.PI / 2 },

      { type: 'bed', x: -18, y: FLOOR_HEIGHT * 2, z: 5, rotation: Math.PI / 2 },
      { type: 'bed', x: -12, y: FLOOR_HEIGHT * 2, z: 5, rotation: Math.PI / 2 },
      { type: 'bed', x: -6, y: FLOOR_HEIGHT * 2, z: 5, rotation: Math.PI / 2 },

      { type: 'bed', x: -18, y: FLOOR_HEIGHT * 2, z: -5, rotation: -Math.PI / 2 },
      { type: 'bed', x: -12, y: FLOOR_HEIGHT * 2, z: -5, rotation: -Math.PI / 2 },
      { type: 'bed', x: -6, y: FLOOR_HEIGHT * 2, z: -5, rotation: -Math.PI / 2 },

      { type: 'bed', x: -18, y: FLOOR_HEIGHT * 2, z: -10, rotation: -Math.PI / 2 },
      { type: 'bed', x: -12, y: FLOOR_HEIGHT * 2, z: -10, rotation: -Math.PI / 2 },
      { type: 'bed', x: -6, y: FLOOR_HEIGHT * 2, z: -10, rotation: -Math.PI / 2 },

      // Central Nurse Station
      { type: 'reception_counter', x: -11, y: FLOOR_HEIGHT * 2, z: 0 },
      { type: 'chair', x: -11, y: FLOOR_HEIGHT * 2, z: -1.5 },
      { type: 'computer', x: -11, y: FLOOR_HEIGHT * 2 + 1.1, z: 0 },
    ],
  },
  {
    id: 'maternity',
    name: 'Maternity & Neonatal Wing',
    floor: 2,
    bounds: { minX: 0, maxX: 12, minZ: 0, maxZ: 14 },
    wallColor: '#FAF4EB',
    floorColor: '#EFE7DA',
    staffRoles: ['doctor', 'nurse'],
    capacity: 12,
    cameraPreset: { target: [6, 1.8 + FLOOR_HEIGHT * 2, 7], position: [6, 11 + FLOOR_HEIGHT * 2, 20] },
    props: [
      { type: 'bed', x: 4, y: FLOOR_HEIGHT * 2, z: 7, rotation: Math.PI / 2 },
      { type: 'bed', x: 8, y: FLOOR_HEIGHT * 2, z: 7, rotation: Math.PI / 2 },
      { type: 'desk', x: 6, y: FLOOR_HEIGHT * 2, z: 2 },
      { type: 'chair', x: 6, y: FLOOR_HEIGHT * 2, z: 3.2 },
    ],
  },
  {
    id: 'directors_cabin',
    name: "Medical Director's Cabin & Admin",
    floor: 2,
    bounds: { minX: 12, maxX: 22, minZ: 0, maxZ: 14 },
    wallColor: '#F5F0E6',
    floorColor: '#D8C7B0',
    staffRoles: ['admin', 'doctor'],
    capacity: 6,
    cameraPreset: { target: [17, 1.8 + FLOOR_HEIGHT * 2, 7], position: [17, 11 + FLOOR_HEIGHT * 2, 20] },
    props: [
      { type: 'desk', x: 17, y: FLOOR_HEIGHT * 2, z: 7, color: '#8A5A36' },
      { type: 'chair', x: 17, y: FLOOR_HEIGHT * 2, z: 5.5 },
      { type: 'chair', x: 15.5, y: FLOOR_HEIGHT * 2, z: 8.5 },
      { type: 'chair', x: 18.5, y: FLOOR_HEIGHT * 2, z: 8.5 },
      { type: 'sofa', x: 15, y: FLOOR_HEIGHT * 2, z: 2 },
      { type: 'plant', x: 20.5, y: FLOOR_HEIGHT * 2, z: 2 },
    ],
  },
  {
    id: 'staff_lounge',
    name: 'Doctor & Staff Lounge',
    floor: 2,
    bounds: { minX: 0, maxX: 22, minZ: -16, maxZ: 0 },
    wallColor: '#F4EFE6',
    floorColor: '#DFD7C7',
    staffRoles: ['doctor', 'nurse', 'surgeon'],
    capacity: 14,
    cameraPreset: { target: [11, 1.8 + FLOOR_HEIGHT * 2, -8], position: [11, 11 + FLOOR_HEIGHT * 2, 5] },
    props: [
      { type: 'sofa', x: 6, y: FLOOR_HEIGHT * 2, z: -8 },
      { type: 'sofa', x: 14, y: FLOOR_HEIGHT * 2, z: -8 },
      { type: 'cafeteria_table', x: 18, y: FLOOR_HEIGHT * 2, z: -4 },
      { type: 'plant', x: 2, y: FLOOR_HEIGHT * 2, z: -14 },
    ],
  },
];
