export interface ZoneDefinition {
  id: string;
  name: string;
  shortName: string;
  code: string;
  color: string;
  position: [number, number, number]; // [x, y, z] center
  size: [number, number];             // [width, depth]
  doorWaypoint: [number, number, number];
  stationWaypoint: [number, number, number];
  bedsOrSpots: [number, number, number][];
  capacity: number;
  staffTitle: string;
  description: string;
}

export const ZONES: ZoneDefinition[] = [
  {
    id: 'reception',
    name: 'Reception & Admissions',
    shortName: 'Reception',
    code: 'REC',
    color: '#38bdf8',
    position: [-4, 0, 8.5],
    size: [8.5, 6.5],
    doorWaypoint: [-4, 0, 11.5],
    stationWaypoint: [-4, 0, 8],
    bedsOrSpots: [
      [-6, 0, 8.5],
      [-2, 0, 8.5],
    ],
    capacity: 2,
    staffTitle: 'Admissions Officer',
    description: 'First point of intake for walk-in arrivals and initial paperwork.',
  },
  {
    id: 'triage',
    name: 'Triage Assessment',
    shortName: 'Triage',
    code: 'TRG',
    color: '#fbbf24',
    position: [4, 0, 8.5],
    size: [7.5, 6.5],
    doorWaypoint: [4, 0, 11.5],
    stationWaypoint: [4, 0, 8],
    bedsOrSpots: [
      [2.5, 0, 8.5],
      [5.5, 0, 8.5],
    ],
    capacity: 2,
    staffTitle: 'Triage Nurse',
    description: 'Rapid acuity classification (Low, Medium, or Critical priority).',
  },
  {
    id: 'opd',
    name: 'Outpatient Clinic (OPD)',
    shortName: 'OPD',
    code: 'OPD',
    color: '#818cf8',
    position: [-10.5, 0, 1.5],
    size: [7.5, 7.5],
    doorWaypoint: [-7, 0, 1.5],
    stationWaypoint: [-11, 0, 3],
    bedsOrSpots: [
      [-12, 0, 0.5],
      [-9, 0, 0.5],
      [-10.5, 0, -1.5],
    ],
    capacity: 3,
    staffTitle: 'Consultant Physician',
    description: 'General consultations, medical assessments, and treatment plans.',
  },
  {
    id: 'er',
    name: 'Emergency Trauma (ER)',
    shortName: 'Emergency',
    code: 'ER',
    color: '#f87171',
    position: [11.5, 0, 4],
    size: [8.5, 8.5],
    doorWaypoint: [8, 0, 4],
    stationWaypoint: [11.5, 0, 6.5],
    bedsOrSpots: [
      [9.5, 0, 2],
      [11.5, 0, 2],
      [13.5, 0, 2],
    ],
    capacity: 3,
    staffTitle: 'Emergency Surgeon',
    description: 'Critical trauma resuscitation and acute life-saving interventions.',
  },
  {
    id: 'radiology',
    name: 'Radiology & Imaging',
    shortName: 'Radiology',
    code: 'RAD',
    color: '#a78bfa',
    position: [-3.5, 0, 1.5],
    size: [6.5, 6.5],
    doorWaypoint: [-3.5, 0, 4.5],
    stationWaypoint: [-2, 0, 0.5],
    bedsOrSpots: [
      [-4.5, 0, 1.5],
      [-2.5, 0, 2.5],
    ],
    capacity: 2,
    staffTitle: 'Radiologist',
    description: 'Advanced X-Ray, CT scanner diagnostics, and internal imaging.',
  },
  {
    id: 'lab',
    name: 'Diagnostic Laboratory',
    shortName: 'Pathology Lab',
    code: 'LAB',
    color: '#2dd4bf',
    position: [3.5, 0, 1.5],
    size: [6.5, 6.5],
    doorWaypoint: [3.5, 0, 4.5],
    stationWaypoint: [2, 0, 0.5],
    bedsOrSpots: [
      [4.5, 0, 1.5],
      [2.5, 0, 2.5],
    ],
    capacity: 2,
    staffTitle: 'Lab Technologist',
    description: 'Blood chemistry analysis, biological assays, and pathology reports.',
  },
  {
    id: 'pharmacy',
    name: 'Dispensary & Pharmacy',
    shortName: 'Pharmacy',
    code: 'PHM',
    color: '#34d399',
    position: [-10.5, 0, 8.5],
    size: [6.5, 6.5],
    doorWaypoint: [-7.5, 0, 8.5],
    stationWaypoint: [-10.5, 0, 10],
    bedsOrSpots: [
      [-11.5, 0, 7.5],
      [-9.5, 0, 7.5],
    ],
    capacity: 2,
    staffTitle: 'Clinical Pharmacist',
    description: 'Prescription dispensing, medication guidance, and discharge counter.',
  },
  {
    id: 'icu',
    name: 'Intensive Care Unit (ICU)',
    shortName: 'ICU',
    code: 'ICU',
    color: '#fb7185',
    position: [7, 0, -5.5],
    size: [8.5, 7.5],
    doorWaypoint: [3.5, 0, -5.5],
    stationWaypoint: [7, 0, -3],
    bedsOrSpots: [
      [5.5, 0, -7],
      [8.5, 0, -7],
    ],
    capacity: 2,
    staffTitle: 'Intensivist Nurse',
    description: 'Continuous monitoring, telemetry, and ventilator support.',
  },
  {
    id: 'ward',
    name: 'General Inpatient Ward',
    shortName: 'General Ward',
    code: 'WRD',
    color: '#60a5fa',
    position: [-4.5, 0, -5.5],
    size: [12.5, 7.5],
    doorWaypoint: [-0.5, 0, -5.5],
    stationWaypoint: [-4.5, 0, -3],
    bedsOrSpots: [
      [-8.5, 0, -7],
      [-6, 0, -7],
      [-3.5, 0, -7],
      [-1, 0, -7],
    ],
    capacity: 4,
    staffTitle: 'Ward Nurse',
    description: 'Multi-bed recovery unit for stable admissions under observation.',
  },
];

export const ZONE_MAP = new Map<string, ZoneDefinition>(
  ZONES.map((zone) => [zone.id, zone])
);
