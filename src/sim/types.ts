export type Acuity = 'Critical' | 'Medium' | 'Low' | 'Scheduled';

export type AmbulanceFleet = 'LifeLine' | 'CityRescue' | 'MediExpress' | 'CareFirst';

export type AmbulanceState = 'EN_ROUTE' | 'AT_GATE' | 'DOCKING' | 'UNLOADING' | 'DEPARTING';

export type PatientStage = 'Registered' | 'Triaged' | 'Consultation' | 'Diagnostics' | 'Admitted' | 'Discharged';

export type OrderlyState = 'IDLE' | 'TO_PATIENT' | 'TRANSPORTING' | 'HANDOVER' | 'RETURN' | 'REST';

export type VanState = 'EN_ROUTE' | 'AT_GATE' | 'DOCKING' | 'UNLOADING' | 'DEPARTING';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface PatientVitals {
  hr: number;      // heart rate bpm (e.g. 84)
  spo2: number;    // % oxygen (e.g. 98)
  bp: string;      // systolic/diastolic (e.g. "122/78")
}

export interface SimPatient {
  id: string; // "PT-1026"
  name: string; // "Elena R."
  ageBand: string; // "30-45"
  condition: string; // "Chest Pain"
  triage: Acuity;
  stage: PatientStage;
  siteId: string;
  position: Vector3D;
  targetPosition?: Vector3D;
  vitals: PatientVitals;
  journeyTimestamps: {
    registered: number;
    triaged?: number;
    consultation?: number;
    diagnostics?: number;
    admitted?: number;
    discharged?: number;
  };
  assignedBed?: number;
  assignedBayId?: string;
  orderlyId?: string;
  ambulanceId?: string;
  serviceTimer: number;
  serviceDuration: number;
  label: string;
}

export interface SimAmbulance {
  id: string; // "AMB-2205"
  fleet: AmbulanceFleet;
  siteId: string;
  originSiteId?: string;
  targetSiteId: string;
  state: AmbulanceState;
  position: Vector3D;
  rotationY: number;
  speed: number;
  targetBayId?: string;
  targetBaySlot?: number;
  path: Vector3D[];
  pathIndex: number;
  timer: number;
  flashingLight: boolean;
  beaconPhase: number;
  patientId?: string;
  label: string;
}

export interface SimOrderly {
  id: string; // "STF-10"
  name: string;
  siteId: string;
  state: OrderlyState;
  position: Vector3D;
  rotationY: number;
  speed: number;
  energy: number; // 0 to 100
  carryingPatientId?: string;
  mode: 'stretcher' | 'wheelchair';
  homeRestStationId: string;
  targetPosition?: Vector3D;
  path: Vector3D[];
  pathIndex: number;
  timer: number;
  label: string;
}

export interface SimStaff {
  id: string;
  name: string;
  role: 'doctor' | 'nurse' | 'radiologist' | 'pharmacist';
  siteId: string;
  state: 'idle' | 'treating' | 'resting';
  energy: number; // 0 to 100
  position: Vector3D;
  rotationY: number;
  currentTask: string;
  taskProgress: number; // 0 to 1
  label: string;
}

export interface SupplyItemState {
  id: string;
  name: string;
  category: string;
  count: number;
  reorderThreshold: number;
  unit: string;
  coldChain?: boolean;
}

export interface SimSupplyVan {
  id: string; // "VAN-01"
  state: VanState;
  originDepotId: string;
  targetSiteId: string;
  position: Vector3D;
  rotationY: number;
  speed: number;
  path: Vector3D[];
  pathIndex: number;
  timer: number;
  crates: { itemId: string; count: number }[];
  label: string;
}

export interface SimSiteState {
  id: string;
  code: string;
  name: string;
  totalBeds: number;
  admittedPatientsCount: number;
  admittedToday: number;
  dischargedToday: number;
  bays: {
    id: string;
    slotNumber: number;
    status: 'available' | 'docking' | 'unloading' | 'occupied';
    ambulanceId?: string;
  }[];
  supplies: Record<string, number>;
}

export interface SimEvent {
  id: string;
  type:
    | 'PATIENT_ADMITTED'
    | 'PATIENT_DISCHARGED'
    | 'AMBULANCE_ARRIVED'
    | 'SUPPLY_LOW'
    | 'SUPPLY_RESTOCKED'
    | 'CRITICAL_ARRIVAL'
    | 'TRANSFER';
  title: string;
  text: string;
  siteId: string;
  position: Vector3D;
  timestamp: number;
  color: string;
}

export interface SimStats {
  bedsOccupied: number;
  bedsTotal: number;
  erBaysBusy: number;
  erBaysTotal: number;
  admittedToday: number;
  dischargedToday: number;
  avgWaitMinutes: number;
  activeAmbulances: number;
  activePatients: number;
  activeStaffWorking: number;
  supplies: {
    gloves: number;
    masks: number;
    ivFluids: number;
    oxygenCylinders: number;
  };
  simTimeSeconds: number;
}
