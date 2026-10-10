import { Vector3D } from '@/sim/types';

export interface SearchDestination {
  id: string;
  name: string;
  keywords: string[];
  floor?: string;
  category: 'clinical' | 'emergency' | 'logistics' | 'personnel';
  position: Vector3D;
  zoom: number;
  description: string;
}

export const SEARCH_DESTINATIONS: SearchDestination[] = [
  {
    id: 'reception',
    name: 'Hospital Reception & Admissions Counter',
    keywords: ['reception', 'counter', 'admissions', 'desk', 'lobby', 'check-in', '1f', 'floor 1', 'admit'],
    floor: 'Floor 1',
    category: 'clinical',
    position: { x: 23.5, y: 0.5, z: 0.8 },
    zoom: 64,
    description: 'Front admissions counter, receptionist nurse, computer terminals, and waiting area',
  },
  {
    id: 'operation-theatre',
    name: 'Operation Theatre (OT) & Surgical Suite',
    keywords: ['operation theatre', 'operation', 'theatre', 'surgery', 'ot', 'surgeon', 'operating table', '2f', 'floor 2', 'surgical', 'operating'],
    floor: 'Floor 2',
    category: 'clinical',
    position: { x: 23.5, y: 2.8, z: -1.2 },
    zoom: 66,
    description: 'Sterile surgical suite with operating table, overhead lamps, surgeon, and patient',
  },
  {
    id: 'nurses-walking',
    name: 'Nurses Walking with Patients',
    keywords: ['nurse', 'nurses', 'nurses walking with patient', 'patient', 'patients', 'walking', 'ward boy', 'ward boys', 'stretcher', 'wheelchair', 'iv drip'],
    floor: 'Floor 1 & 2',
    category: 'personnel',
    position: { x: 23.5, y: 0.8, z: 0.2 },
    zoom: 66,
    description: 'Nurses walking alongside patients with rolling IV drip stands, wheelchairs, and stretchers',
  },
  {
    id: 'icu',
    name: 'ICU & Critical Care Unit',
    keywords: ['icu', 'intensive care', 'critical', 'ventilator', 'telemetry', '3f', 'floor 3', 'vital'],
    floor: 'Floor 3',
    category: 'clinical',
    position: { x: 23.5, y: 5.0, z: -1.5 },
    zoom: 62,
    description: 'Intensive care telemetry beds, pulse monitors, and vital sign displays',
  },
  {
    id: 'city-road',
    name: '2-Lane City Road & Ambulance Corridor',
    keywords: ['road', 'roads', 'street', 'lane', 'curb', 'traffic', 'curbs'],
    floor: 'Ground Perimeter',
    category: 'emergency',
    position: { x: 3.0, y: 0, z: 12.0 },
    zoom: 44,
    description: 'Pale slate-blue 2-lane road with pure white dashed centerlines and white concrete curbs',
  },
  {
    id: 'ambulance-bays',
    name: 'Emergency Ambulance Bays',
    keywords: ['ambulance', 'ambulances', 'bay', 'dock', 'bays', 'er', 'emergency', 'staging'],
    floor: 'Ground Staging',
    category: 'emergency',
    position: { x: 3.5, y: 0, z: 6.0 },
    zoom: 48,
    description: '3 numbered ER bays where emergency ambulances park and unload',
  },
  {
    id: 'conveyor-machine',
    name: 'Sorting Conveyor & Logistics Machine',
    keywords: ['conveyor', 'machine', 'worker', 'boxes', 'crates', 'sorting', 'pallet', 'loading'],
    floor: 'Ground Yard',
    category: 'logistics',
    position: { x: -9.5, y: 0, z: 7.5 },
    zoom: 54,
    description: 'Conveyor scanner with worker picking up crates from pallets and loading the machine',
  },
  {
    id: 'helipad',
    name: 'Rooftop Helipad & Air Ambulance',
    keywords: ['helicopter', 'helipad', 'roof', 'air ambulance', 'rotor', 'top', 'flight'],
    floor: 'Tower Rooftop',
    category: 'emergency',
    position: { x: 23.5, y: 13.5, z: -2.0 },
    zoom: 50,
    description: 'Rooftop emergency landing pad with twin-rotor air ambulance helicopter',
  },
];
