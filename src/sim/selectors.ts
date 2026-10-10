import { SimulationEngine } from './engine';
import { SITES, SiteDefinition } from '@/data/sites';
import { SimAmbulance, SimPatient, SimOrderly, SimStaff } from './types';

export interface SiteSummary {
  siteId: string;
  code: string;
  name: string;
  shortName: string;
  address: string;
  totalBeds: number;
  admittedCount: number;
  bedsFree: number;
  occupancyPct: number;
  admittedToday: number;
  dischargedToday: number;
  busyBaysCount: number;
  totalBaysCount: number;
  dockedCount: number;
  arrivingCount: number;
  triagedCount: number;
  staffOnDutyCount: number;
  staffWorkingCount: number;
  ambulancesOnSiteCount: number;
}

export interface SiteKpis {
  bedsFree: {
    value: number;
    total: number;
    siteCode: string;
    deltaStr: string;
  };
  ambulancesOnSite: {
    value: number;
    inbound: number;
    siteCode: string;
    deltaStr: string;
  };
  careWithinTarget: {
    percentage: number;
    deltaStr: string;
    period: string;
  };
}

export interface SupplyItemView {
  id: string;
  name: string;
  category: string;
  count: number;
  reorderThreshold: number;
  unit: string;
  coldChain?: boolean;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  chipColor: 'green' | 'amber' | 'red';
}

export interface PatientJourneyStep {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'pending';
  timestampStr?: string;
}

export interface PatientJourneyView {
  patient: SimPatient;
  steps: PatientJourneyStep[];
  currentStepIndex: number;
  caseNumber: string;
  assignedDestination: string;
  bedLabel: string;
  estMinutesLeft: number;
}

// 1. Selector for Site Summary
export function selectSiteSummary(engine: SimulationEngine, siteId: string): SiteSummary {
  const siteDef = SITES.find((s) => s.id === siteId) || SITES[0];
  const siteState = engine.siteStates[siteId] || {
    id: siteId,
    code: siteDef.code,
    name: siteDef.name,
    totalBeds: siteDef.beds.total,
    admittedPatientsCount: 0,
    admittedToday: 48,
    dischargedToday: 31,
    bays: siteDef.bays.map((b) => ({
      id: b.id,
      slotNumber: b.slotNumber,
      status: 'available' as const,
    })),
    supplies: {},
  };

  const totalBeds = siteDef.beds.total;
  // Invariant: admitted patients is count of patients in 'Admitted' stage for this site
  const admittedPatients = engine.patients.filter(
    (p) => p.siteId === siteId && p.stage === 'Admitted'
  );
  const admittedCount = admittedPatients.length;
  // Invariant: bedsFree = totalBeds - admittedCount
  const bedsFree = Math.max(0, totalBeds - admittedCount);
  const occupancyPct = Math.round((admittedCount / totalBeds) * 100);

  // Invariant: busy bays = count of bays docking, unloading, or occupied
  const busyBays = siteState.bays.filter((b) => b.status !== 'available');
  const busyBaysCount = busyBays.length;
  const totalBaysCount = siteDef.bays.length;

  // Invariant: docked ambulances are those currently in DOCKING or UNLOADING at this site
  const dockedAmbulances = engine.ambulances.filter(
    (a) => a.targetSiteId === siteId && (a.state === 'DOCKING' || a.state === 'UNLOADING')
  );
  const dockedCount = dockedAmbulances.length;

  // Invariant: arriving ambulances are those EN_ROUTE or AT_GATE towards this site
  const arrivingAmbulances = engine.ambulances.filter(
    (a) => a.targetSiteId === siteId && (a.state === 'EN_ROUTE' || a.state === 'AT_GATE')
  );
  const arrivingCount = arrivingAmbulances.length;

  // Invariant: triaged count
  const triagedCount = engine.patients.filter(
    (p) => p.siteId === siteId && p.stage === 'Triaged'
  ).length;

  // Staff counts
  const siteStaff = engine.staff.filter((s) => s.siteId === siteId);
  const siteOrderlies = engine.orderlies.filter((o) => o.siteId === siteId);
  const staffOnDutyCount = siteStaff.length + siteOrderlies.length;

  const staffWorkingCount =
    siteStaff.filter((s) => s.state === 'treating').length +
    siteOrderlies.filter((o) => o.state !== 'REST' && o.state !== 'IDLE').length;

  // Ambulances inside site bounds or docked
  const ambulancesOnSiteCount = engine.ambulances.filter((a) => {
    if (a.targetSiteId !== siteId) return false;
    if (a.state === 'DOCKING' || a.state === 'UNLOADING' || a.state === 'DEPARTING') return true;
    const b = siteDef.bounds;
    return (
      a.position.x >= b.minX - 4 &&
      a.position.x <= b.maxX + 4 &&
      a.position.z >= b.minZ - 4 &&
      a.position.z <= b.maxZ + 4
    );
  }).length;

  return {
    siteId,
    code: siteDef.code,
    name: siteDef.name,
    shortName: siteDef.shortName,
    address: siteDef.address,
    totalBeds,
    admittedCount,
    bedsFree,
    occupancyPct,
    admittedToday: siteState.admittedToday,
    dischargedToday: siteState.dischargedToday,
    busyBaysCount,
    totalBaysCount,
    dockedCount,
    arrivingCount,
    triagedCount,
    staffOnDutyCount,
    staffWorkingCount,
    ambulancesOnSiteCount,
  };
}

// 2. Selector for Site KPIs
export function selectSiteKpis(engine: SimulationEngine, siteId: string): SiteKpis {
  const summary = selectSiteSummary(engine, siteId);

  return {
    bedsFree: {
      value: summary.bedsFree,
      total: summary.totalBeds,
      siteCode: summary.code,
      deltaStr: '+4',
    },
    ambulancesOnSite: {
      value: summary.ambulancesOnSiteCount,
      inbound: summary.arrivingCount,
      siteCode: summary.code,
      deltaStr: '+1',
    },
    careWithinTarget: {
      percentage: 96.2,
      deltaStr: '+0.4%',
      period: 'last 30 days',
    },
  };
}

// 3. Selector for Site Supplies
export function selectSiteSupplies(engine: SimulationEngine, siteId: string): SupplyItemView[] {
  const siteDef = SITES.find((s) => s.id === siteId) || SITES[0];
  const siteState = engine.siteStates[siteId];
  if (!siteState) return [];

  const catalog = engine.suppliesCatalog;

  return catalog.map((item) => {
    const count = siteState.supplies[item.id] ?? 0;
    let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
    let chipColor: 'green' | 'amber' | 'red' = 'green';

    if (count === 0) {
      status = 'Out of Stock';
      chipColor = 'red';
    } else if (count <= item.reorderThreshold) {
      status = 'Low Stock';
      chipColor = 'amber';
    }

    return {
      id: item.id,
      name: item.name,
      category: item.category,
      count,
      reorderThreshold: item.reorderThreshold,
      unit: item.unit,
      coldChain: item.coldChain,
      status,
      chipColor,
    };
  });
}

// 4. Selector for Site Bays
export function selectSiteBays(engine: SimulationEngine, siteId: string) {
  const siteState = engine.siteStates[siteId];
  const siteDef = SITES.find((s) => s.id === siteId) || SITES[0];
  if (!siteState) return siteDef.bays.map((b) => ({ ...b, ambulance: undefined }));

  return siteState.bays.map((bay) => {
    const assignedAmb = bay.ambulanceId
      ? engine.ambulances.find((a) => a.id === bay.ambulanceId)
      : undefined;
    return {
      ...bay,
      ambulance: assignedAmb,
    };
  });
}

// 5. Selector for Site Staff
export function selectSiteStaff(engine: SimulationEngine, siteId: string) {
  const medicalStaff = engine.staff.filter((s) => s.siteId === siteId);
  const orderlies = engine.orderlies.filter((o) => o.siteId === siteId);
  return {
    medicalStaff,
    orderlies,
  };
}

// 6. Selector for Site Ambulances
export function selectSiteAmbulances(engine: SimulationEngine, siteId: string): SimAmbulance[] {
  return engine.ambulances.filter((a) => a.targetSiteId === siteId || a.originSiteId === siteId);
}

// 7. Selector for Patient Journey
export function selectPatientJourney(
  engine: SimulationEngine,
  selectedPatientId?: string | null
): PatientJourneyView | null {
  let pt: SimPatient | undefined;

  if (selectedPatientId) {
    pt = engine.patients.find((p) => p.id === selectedPatientId);
  }

  // If no patient selected or not found, auto-feature the most recent active patient
  if (!pt) {
    pt = engine.patients.slice().reverse().find((p) => p.stage !== 'Discharged') || engine.patients[0];
  }

  if (!pt) return null;

  const stageOrder: SimPatient['stage'][] = [
    'Registered',
    'Triaged',
    'Consultation',
    'Diagnostics',
    'Admitted',
  ];

  const currentIdx = stageOrder.indexOf(pt.stage);
  const effectiveIdx = currentIdx >= 0 ? currentIdx : pt.stage === 'Discharged' ? 4 : 0;

  const steps: PatientJourneyStep[] = [
    {
      id: 'reg',
      name: 'Registered',
      status: effectiveIdx >= 0 ? 'completed' : 'pending',
      timestampStr: formatSimTime(pt.journeyTimestamps.registered),
    },
    {
      id: 'tri',
      name: 'Triaged',
      status: effectiveIdx >= 1 ? 'completed' : effectiveIdx === 0 ? 'current' : 'pending',
      timestampStr: pt.journeyTimestamps.triaged
        ? formatSimTime(pt.journeyTimestamps.triaged)
        : undefined,
    },
    {
      id: 'con',
      name: 'Consultation',
      status: effectiveIdx >= 2 ? 'completed' : effectiveIdx === 1 ? 'current' : 'pending',
      timestampStr: pt.journeyTimestamps.consultation
        ? formatSimTime(pt.journeyTimestamps.consultation)
        : undefined,
    },
    {
      id: 'dia',
      name: 'Diagnostics',
      status: effectiveIdx >= 3 ? 'completed' : effectiveIdx === 2 ? 'current' : 'pending',
      timestampStr: pt.journeyTimestamps.diagnostics
        ? formatSimTime(pt.journeyTimestamps.diagnostics)
        : undefined,
    },
    {
      id: 'adm',
      name: pt.stage === 'Discharged' ? 'Discharged' : 'Admitted',
      status: effectiveIdx >= 4 ? 'completed' : effectiveIdx === 3 ? 'current' : 'pending',
      timestampStr:
        pt.journeyTimestamps.admitted
          ? formatSimTime(pt.journeyTimestamps.admitted)
          : pt.journeyTimestamps.discharged
          ? formatSimTime(pt.journeyTimestamps.discharged)
          : undefined,
    },
  ];

  const caseHash = Math.abs(hashString(pt.id)) % 90000 + 10000;

  return {
    patient: pt,
    steps,
    currentStepIndex: effectiveIdx,
    caseNumber: `#CASE-${caseHash}`,
    assignedDestination: pt.triage === 'Critical' ? 'To: Trauma ICU' : 'To: General Ward B',
    bedLabel: pt.assignedBed ? `Bed ${pt.assignedBed}` : 'Triage Bay 2',
    estMinutesLeft: Math.max(1, Math.round(pt.serviceTimer * 2)),
  };
}

function formatSimTime(seconds?: number): string {
  if (!seconds) return '--:--';
  const hours = Math.floor((seconds / 3600) % 24);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
