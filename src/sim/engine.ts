import {
  SimAmbulance,
  SimPatient,
  SimOrderly,
  SimStaff,
  SimSupplyVan,
  SimStats,
  SimEvent,
  SimSiteState,
  SupplyItemState,
  Vector3D,
  AmbulanceFleet,
  Acuity,
} from './types';
import { PRNG } from './rng';
import { SITES } from '@/data/sites';
import { generateAmbulancePath, generateSupplyVanPath } from '@/data/roads';

export const MEDICAL_SUPPLIES_CATALOG: SupplyItemState[] = [
  { id: 'nitrile-gloves', name: 'Nitrile gloves (box of 100)', category: 'PPE', count: 850, reorderThreshold: 300, unit: 'boxes' },
  { id: 'n95-masks', name: 'N95 masks (box of 20)', category: 'PPE', count: 620, reorderThreshold: 250, unit: 'boxes' },
  { id: 'paracetamol', name: 'Paracetamol 500 mg tablets', category: 'Analgesic', count: 1200, reorderThreshold: 400, unit: 'blisters' },
  { id: 'amoxicillin', name: 'Amoxicillin 500 mg capsules', category: 'Antibiotic', count: 540, reorderThreshold: 200, unit: 'packs' },
  { id: 'ibuprofen', name: 'Ibuprofen 400 mg tablets', category: 'NSAID', count: 820, reorderThreshold: 300, unit: 'blisters' },
  { id: 'ondansetron', name: 'Ondansetron 4 mg injection', category: 'Antiemetic', count: 280, reorderThreshold: 100, unit: 'vials' },
  { id: 'adrenaline', name: 'Adrenaline 1 mg/mL ampoules', category: 'Emergency', count: 140, reorderThreshold: 50, unit: 'ampoules' },
  { id: 'atropine', name: 'Atropine 0.6 mg/mL ampoules', category: 'Emergency', count: 110, reorderThreshold: 40, unit: 'ampoules' },
  { id: 'insulin', name: 'Insulin Regular 100 IU/mL vials', category: 'Endocrine', count: 190, reorderThreshold: 60, unit: 'vials', coldChain: true },
  { id: 'salbutamol', name: 'Salbutamol inhaler 100 mcg', category: 'Respiratory', count: 220, reorderThreshold: 75, unit: 'canisters' },
  { id: 'saline-iv', name: '0.9% Sodium Chloride IV 500 mL', category: 'IV Fluids', count: 480, reorderThreshold: 150, unit: 'bags' },
  { id: 'ringers-lactate', name: "Ringer's Lactate IV 500 mL", category: 'IV Fluids', count: 360, reorderThreshold: 120, unit: 'bags' },
  { id: 'oxygen-cylinders', name: 'Medical oxygen cylinders (D-type)', category: 'Respiratory', count: 68, reorderThreshold: 25, unit: 'cylinders' },
  { id: 'disposable-syringes', name: 'Disposable syringes 5 mL', category: 'Consumables', count: 1400, reorderThreshold: 500, unit: 'pieces' },
];

function lerpAngle(from: number, to: number, t: number): number {
  let diff = (to - from) % (Math.PI * 2);
  if (diff < -Math.PI) diff += Math.PI * 2;
  if (diff > Math.PI) diff -= Math.PI * 2;
  return from + diff * t;
}

export class SimulationEngine {
  public tickCount = 0;
  public ambulances: SimAmbulance[] = [];
  public patients: SimPatient[] = [];
  public orderlies: SimOrderly[] = [];
  public staff: SimStaff[] = [];
  public supplyVans: SimSupplyVan[] = [];
  public events: SimEvent[] = [];
  public siteStates: Record<string, SimSiteState> = {};
  public suppliesCatalog: SupplyItemState[] = [...MEDICAL_SUPPLIES_CATALOG];

  public stats: SimStats = {
    bedsOccupied: 312,
    bedsTotal: 420,
    erBaysBusy: 3,
    erBaysTotal: 6,
    admittedToday: 48,
    dischargedToday: 31,
    avgWaitMinutes: 14.2,
    activeAmbulances: 4,
    activePatients: 6,
    activeStaffWorking: 5,
    supplies: {
      gloves: 850,
      masks: 620,
      ivFluids: 480,
      oxygenCylinders: 68,
    },
    simTimeSeconds: 9 * 3600 + 43 * 60,
  };

  private rng: PRNG;
  private patientCounter = 1024;
  private ambulanceCounter = 2201;
  private vanCounter = 1;
  public simClock = 9 * 3600 + 43 * 60;
  public speedMultiplier = 1;

  constructor(seed = 42881) {
    this.rng = new PRNG(seed);
    this.initSites();
    this.initStaff();
    this.initOrderlies();

    // Spawn initial lively vehicles across sites
    for (const site of SITES) {
      this.spawnAmbulance(site.id);
    }
    this.spawnSupplyVan('site-mc-04');
    this.spawnSupplyVan('site-mc-02');

    // Pre-warm the world for ~90 seconds so all vehicles and orderlies are in full motion
    this.prewarm(90);
  }

  private initSites() {
    this.siteStates = {};
    for (const site of SITES) {
      const initialSupplies: Record<string, number> = {};
      for (const item of this.suppliesCatalog) {
        initialSupplies[item.id] = Math.round(item.count * (site.beds.total / 300));
      }

      this.siteStates[site.id] = {
        id: site.id,
        code: site.code,
        name: site.name,
        totalBeds: site.beds.total,
        admittedPatientsCount: 0,
        admittedToday: Math.round(site.beds.occupied * 0.16),
        dischargedToday: Math.round(site.beds.occupied * 0.11),
        bays: site.bays.map((b) => ({
          id: b.id,
          slotNumber: b.slotNumber,
          status: 'available',
          ambulanceId: undefined,
        })),
        supplies: initialSupplies,
      };
    }
  }

  private initStaff() {
    const roles: { role: SimStaff['role']; title: string }[] = [
      { role: 'doctor', title: 'Dr. Vance' },
      { role: 'nurse', title: 'RN Miller' },
      { role: 'nurse', title: 'RN Sarah' },
      { role: 'doctor', title: 'Dr. Patel' },
      { role: 'nurse', title: 'RN David' },
      { role: 'nurse', title: 'RN Emma' },
      { role: 'nurse', title: 'RN Avery' },
      { role: 'radiologist', title: 'Dr. Lawson' },
      { role: 'pharmacist', title: 'Pharm. Marcus' },
    ];

    this.staff = [];
    let idx = 0;
    for (const site of SITES) {
      for (let i = 0; i < 2; i++) {
        const r = roles[idx % roles.length];
        idx++;
        this.staff.push({
          id: `STF-${site.code}-${idx}`,
          name: r.title,
          role: r.role,
          siteId: site.id,
          state: i === 0 ? 'treating' : 'idle',
          energy: this.rng.rangeInt(70, 100),
          position: {
            x: site.center[0] + (i === 0 ? -4 : 4),
            y: 0,
            z: site.center[2] + (i === 0 ? -2 : 2),
          },
          rotationY: 0,
          currentTask: i === 0 ? 'Patient Treatment' : 'Triage Assessment',
          taskProgress: 0.45,
          label: `${r.title} · ${site.code}`,
        });
      }
    }
  }

  private initOrderlies() {
    this.orderlies = [];
    let ordIdx = 10;
    for (const site of SITES) {
      for (let i = 0; i < 2; i++) {
        const restStation = site.restStations[i % site.restStations.length];
        this.orderlies.push({
          id: `STF-${ordIdx++}`,
          name: `Orderly ${ordIdx}`,
          siteId: site.id,
          state: 'IDLE',
          position: {
            x: restStation.position[0] + (i === 0 ? 2 : -2),
            y: 0,
            z: restStation.position[2],
          },
          rotationY: 0,
          speed: 3.4,
          energy: this.rng.rangeInt(65, 95),
          mode: i === 0 ? 'stretcher' : 'wheelchair',
          homeRestStationId: restStation.id,
          path: [],
          pathIndex: 0,
          timer: this.rng.range(2, 5),
          label: `Orderly ${ordIdx} · ${site.code}`,
        });
      }
    }
  }

  // Pre-warm simulation before first render
  private prewarm(seconds: number) {
    const dt = 0.5;
    const steps = Math.floor(seconds / dt);
    for (let i = 0; i < steps; i++) {
      this.step(dt, false);
    }
  }

  public spawnAmbulance(targetSiteId: string, customBayId?: string): SimAmbulance {
    const site = SITES.find((s) => s.id === targetSiteId) || SITES[0];
    const siteState = this.siteStates[site.id];

    // Pick an available bay
    const availableBays = siteState.bays.filter((b) => b.status === 'available');
    const targetBay = customBayId
      ? siteState.bays.find((b) => b.id === customBayId) || availableBays[0]
      : availableBays[0] || siteState.bays[0];

    const bayDef = site.bays.find((b) => b.id === targetBay.id) || site.bays[0];

    const ambId = `AMB-${this.ambulanceCounter++}`;
    const fleets: AmbulanceFleet[] = ['LifeLine', 'CityRescue', 'MediExpress', 'CareFirst'];
    const fleet = this.rng.choice(fleets);

    // Generate real road approach path from edge
    const { approach, dockReverse, depart } = generateAmbulancePath(
      site.id,
      targetBay.slotNumber,
      bayDef.position
    );

    const ambulance: SimAmbulance = {
      id: ambId,
      fleet,
      siteId: site.id,
      targetSiteId: site.id,
      state: 'EN_ROUTE',
      position: { ...approach[0] },
      rotationY: 0,
      speed: 10.5,
      targetBayId: targetBay.id,
      targetBaySlot: targetBay.slotNumber,
      path: approach,
      pathIndex: 0,
      timer: 0,
      flashingLight: true,
      beaconPhase: 0,
      label: `${ambId} · Responding`,
    };

    targetBay.status = 'docking';
    targetBay.ambulanceId = ambId;

    this.ambulances.push(ambulance);
    this.spawnPatient(ambulance, site.id);

    return ambulance;
  }

  public spawnSupplyVan(targetSiteId: string): SimSupplyVan {
    const vanId = `VAN-0${this.vanCounter++}`;
    const { outbound } = generateSupplyVanPath(targetSiteId);

    const van: SimSupplyVan = {
      id: vanId,
      state: 'EN_ROUTE',
      originDepotId: 'depot-central',
      targetSiteId,
      position: { ...outbound[0] },
      rotationY: 0,
      speed: 9.0,
      path: outbound,
      pathIndex: 0,
      timer: 0,
      crates: [
        { itemId: 'oxygen-cylinders', count: 12 },
        { itemId: 'saline-iv', count: 40 },
        { itemId: 'nitrile-gloves', count: 100 },
      ],
      label: `${vanId} · Medical Restock`,
    };

    this.supplyVans.push(van);
    return van;
  }

  private spawnPatient(ambulance: SimAmbulance, siteId: string): SimPatient {
    const ptId = `PT-${this.patientCounter++}`;
    const acuities: Acuity[] = ['Medium', 'Critical', 'Low', 'Scheduled'];
    const acuity = this.rng.choice(acuities);
    const names = ['Elena R.', 'Marcus T.', 'Sophia K.', 'Liam B.', 'Aria N.', 'David M.'];

    const conditions = [
      'Chest Pain',
      'Road Trauma',
      'Fracture',
      'Fever & Infection',
      'Asthma Attack',
      'Diabetic Emergency',
    ];

    const pt: SimPatient = {
      id: ptId,
      name: this.rng.choice(names),
      ageBand: this.rng.choice(['25-35', '45-60', '65+']),
      condition: this.rng.choice(conditions),
      triage: acuity,
      stage: 'Registered',
      siteId,
      position: { ...ambulance.position },
      vitals: {
        hr: this.rng.rangeInt(72, 110),
        spo2: this.rng.rangeInt(94, 99),
        bp: `${this.rng.rangeInt(115, 135)}/${this.rng.rangeInt(75, 88)}`,
      },
      journeyTimestamps: {
        registered: this.simClock - 180,
      },
      ambulanceId: ambulance.id,
      serviceTimer: this.rng.range(6, 12),
      serviceDuration: 12,
      label: `${ptId} · ${acuity}`,
    };

    this.patients.push(pt);
    ambulance.patientId = ptId;
    return pt;
  }

  public addEvent(
    type: SimEvent['type'],
    title: string,
    text: string,
    siteId: string,
    position: Vector3D,
    color = '#2F5BEA'
  ) {
    this.events.unshift({
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      title,
      text,
      siteId,
      position: { ...position },
      timestamp: Date.now(),
      color,
    });
    if (this.events.length > 25) {
      this.events.pop();
    }
  }

  // Pure step function advancing positions, waypoints, and state machines
  public step(deltaSeconds: number, emitEvents = true) {
    const dt = deltaSeconds * this.speedMultiplier;
    this.simClock += dt;
    this.tickCount++;

    // 1. WATCHDOG: Guarantee >= 2 ambulances per site, supply vans active
    for (const site of SITES) {
      const siteAmbs = this.ambulances.filter((a) => a.targetSiteId === site.id);
      if (siteAmbs.length < 2) {
        this.spawnAmbulance(site.id);
      }
    }

    if (this.supplyVans.length < 2) {
      this.spawnSupplyVan(this.rng.choice(['site-mc-04', 'site-mc-02', 'site-mc-01', 'site-mc-03']));
    }

    // 2. ADVANCE AMBULANCES ALONG ROAD NETWORK
    for (let i = this.ambulances.length - 1; i >= 0; i--) {
      const amb = this.ambulances[i];
      amb.beaconPhase = (amb.beaconPhase + dt * 8) % (Math.PI * 2);

      if (amb.state === 'EN_ROUTE') {
        const targetWp = amb.path[amb.pathIndex];
        if (targetWp) {
          const dx = targetWp.x - amb.position.x;
          const dz = targetWp.z - amb.position.z;
          const dist = Math.hypot(dx, dz);
          const targetAngle = Math.atan2(dx, dz);
          amb.rotationY = lerpAngle(amb.rotationY, targetAngle, 0.2);

          const stepDist = amb.speed * dt;
          if (dist <= stepDist || dist < 1.0) {
            amb.position.x = targetWp.x;
            amb.position.z = targetWp.z;
            amb.pathIndex++;
            if (amb.pathIndex >= amb.path.length) {
              // Reached bay entrance -> switch to reversing DOCKING
              amb.state = 'DOCKING';
              const site = SITES.find((s) => s.id === amb.targetSiteId) || SITES[0];
              const bayDef = site.bays.find((b) => b.id === amb.targetBayId) || site.bays[0];
              const { dockReverse } = generateAmbulancePath(site.id, amb.targetBaySlot || 1, bayDef.position);
              amb.path = dockReverse;
              amb.pathIndex = 0;
              amb.speed = 3.5;
            }
          } else {
            amb.position.x += Math.sin(amb.rotationY) * stepDist;
            amb.position.z += Math.cos(amb.rotationY) * stepDist;
          }
        }
      } else if (amb.state === 'DOCKING') {
        const targetWp = amb.path[amb.pathIndex];
        if (targetWp) {
          const dx = targetWp.x - amb.position.x;
          const dz = targetWp.z - amb.position.z;
          const dist = Math.hypot(dx, dz);
          const targetAngle = Math.atan2(dx, dz);
          amb.rotationY = lerpAngle(amb.rotationY, targetAngle + Math.PI, 0.15); // Reverse in

          const stepDist = amb.speed * dt;
          if (dist <= stepDist || dist < 0.6) {
            amb.position.x = targetWp.x;
            amb.position.z = targetWp.z;
            amb.pathIndex++;
            if (amb.pathIndex >= amb.path.length) {
              // Docked in bay slot -> start unloading
              amb.state = 'UNLOADING';
              amb.timer = this.rng.range(8, 14);
              amb.flashingLight = false;
              amb.label = `${amb.id} · Unloading`;
              const siteState = this.siteStates[amb.targetSiteId];
              if (siteState && amb.targetBayId) {
                const bay = siteState.bays.find((b) => b.id === amb.targetBayId);
                if (bay) bay.status = 'unloading';
              }
              // Dispatch an orderly to receive patient
              const siteOrderly = this.orderlies.find(
                (o) => o.siteId === amb.targetSiteId && o.state === 'IDLE'
              );
              if (siteOrderly) {
                siteOrderly.state = 'TO_PATIENT';
                siteOrderly.carryingPatientId = amb.patientId;
                siteOrderly.path = [{ ...amb.position }, { x: amb.position.x, y: 0, z: amb.position.z + 6 }];
                siteOrderly.pathIndex = 0;
              }
            }
          } else {
            amb.position.x -= Math.sin(amb.rotationY) * stepDist;
            amb.position.z -= Math.cos(amb.rotationY) * stepDist;
          }
        }
      } else if (amb.state === 'UNLOADING') {
        amb.timer -= dt;
        if (amb.timer <= 0) {
          amb.state = 'DEPARTING';
          const site = SITES.find((s) => s.id === amb.targetSiteId) || SITES[0];
          const bayDef = site.bays.find((b) => b.id === amb.targetBayId) || site.bays[0];
          const { depart } = generateAmbulancePath(site.id, amb.targetBaySlot || 1, bayDef.position);
          amb.path = depart;
          amb.pathIndex = 0;
          amb.speed = 9.5;
          amb.label = `${amb.id} · Departing`;

          const siteState = this.siteStates[amb.targetSiteId];
          if (siteState && amb.targetBayId) {
            const bay = siteState.bays.find((b) => b.id === amb.targetBayId);
            if (bay) {
              bay.status = 'available';
              bay.ambulanceId = undefined;
            }
          }
          if (emitEvents) {
            this.addEvent(
              'AMBULANCE_ARRIVED',
              'Patient Transferred',
              `${amb.id} cleared Bay ${amb.targetBaySlot || 1}`,
              amb.targetSiteId,
              amb.position,
              '#10B981'
            );
          }
        }
      } else if (amb.state === 'DEPARTING') {
        const targetWp = amb.path[amb.pathIndex];
        if (targetWp) {
          const dx = targetWp.x - amb.position.x;
          const dz = targetWp.z - amb.position.z;
          const dist = Math.hypot(dx, dz);
          const targetAngle = Math.atan2(dx, dz);
          amb.rotationY = lerpAngle(amb.rotationY, targetAngle, 0.2);

          const stepDist = amb.speed * dt;
          if (dist <= stepDist || dist < 1.5) {
            amb.position.x = targetWp.x;
            amb.position.z = targetWp.z;
            amb.pathIndex++;
            if (amb.pathIndex >= amb.path.length) {
              // Despawn departed ambulance
              this.ambulances.splice(i, 1);
            }
          } else {
            amb.position.x += Math.sin(amb.rotationY) * stepDist;
            amb.position.z += Math.cos(amb.rotationY) * stepDist;
          }
        }
      }
    }

    // 3. ADVANCE SUPPLY VANS (Medicine Restock Delivery)
    for (let i = this.supplyVans.length - 1; i >= 0; i--) {
      const van = this.supplyVans[i];
      if (van.state === 'EN_ROUTE') {
        const targetWp = van.path[van.pathIndex];
        if (targetWp) {
          const dx = targetWp.x - van.position.x;
          const dz = targetWp.z - van.position.z;
          const dist = Math.hypot(dx, dz);
          const targetAngle = Math.atan2(dx, dz);
          van.rotationY = lerpAngle(van.rotationY, targetAngle, 0.18);

          const stepDist = van.speed * dt;
          if (dist <= stepDist || dist < 1.0) {
            van.position.x = targetWp.x;
            van.position.z = targetWp.z;
            van.pathIndex++;
            if (van.pathIndex >= van.path.length) {
              van.state = 'UNLOADING';
              van.timer = 8;
              van.label = `${van.id} · Unloading Crates`;
            }
          } else {
            van.position.x += Math.sin(van.rotationY) * stepDist;
            van.position.z += Math.cos(van.rotationY) * stepDist;
          }
        }
      } else if (van.state === 'UNLOADING') {
        van.timer -= dt;
        if (van.timer <= 0) {
          // Deliver medicine crates & increase stock
          const siteState = this.siteStates[van.targetSiteId];
          if (siteState) {
            for (const crate of van.crates) {
              siteState.supplies[crate.itemId] = (siteState.supplies[crate.itemId] || 0) + crate.count;
            }
          }
          if (emitEvents) {
            this.addEvent(
              'SUPPLY_RESTOCKED',
              '+3 Medicine Crates',
              `${van.id} restocked supplies at ${van.targetSiteId}`,
              van.targetSiteId,
              van.position,
              '#0D9488'
            );
          }
          // Return to depot
          const { returnTrip } = generateSupplyVanPath(van.targetSiteId);
          van.state = 'DEPARTING';
          van.path = returnTrip;
          van.pathIndex = 0;
          van.speed = 9.0;
        }
      } else if (van.state === 'DEPARTING') {
        const targetWp = van.path[van.pathIndex];
        if (targetWp) {
          const dx = targetWp.x - van.position.x;
          const dz = targetWp.z - van.position.z;
          const dist = Math.hypot(dx, dz);
          const targetAngle = Math.atan2(dx, dz);
          van.rotationY = lerpAngle(van.rotationY, targetAngle, 0.18);

          const stepDist = van.speed * dt;
          if (dist <= stepDist || dist < 1.0) {
            van.position.x = targetWp.x;
            van.position.z = targetWp.z;
            van.pathIndex++;
            if (van.pathIndex >= van.path.length) {
              this.supplyVans.splice(i, 1);
            }
          } else {
            van.position.x += Math.sin(van.rotationY) * stepDist;
            van.position.z += Math.cos(van.rotationY) * stepDist;
          }
        }
      }
    }

    // 4. ADVANCE ORDERLIES & MOVING PATIENTS
    for (const ord of this.orderlies) {
      if (ord.state === 'TO_PATIENT' || ord.state === 'TRANSPORTING') {
        const targetWp = ord.path[ord.pathIndex];
        if (targetWp) {
          const dx = targetWp.x - ord.position.x;
          const dz = targetWp.z - ord.position.z;
          const dist = Math.hypot(dx, dz);
          const targetAngle = Math.atan2(dx, dz);
          ord.rotationY = lerpAngle(ord.rotationY, targetAngle, 0.25);

          const stepDist = ord.speed * dt;
          if (dist <= stepDist || dist < 0.5) {
            ord.position.x = targetWp.x;
            ord.position.z = targetWp.z;
            ord.pathIndex++;
            if (ord.pathIndex >= ord.path.length) {
              if (ord.state === 'TO_PATIENT') {
                ord.state = 'TRANSPORTING';
                const site = SITES.find((s) => s.id === ord.siteId) || SITES[0];
                ord.path = [{ x: site.center[0], y: 0, z: site.center[2] }];
                ord.pathIndex = 0;
              } else {
                ord.state = 'IDLE';
                ord.carryingPatientId = undefined;
              }
            }
          } else {
            ord.position.x += Math.sin(ord.rotationY) * stepDist;
            ord.position.z += Math.cos(ord.rotationY) * stepDist;
          }
        }

        // Attach carried patient position to orderly
        if (ord.carryingPatientId) {
          const pt = this.patients.find((p) => p.id === ord.carryingPatientId);
          if (pt) {
            pt.position.x = ord.position.x;
            pt.position.z = ord.position.z;
          }
        }
      }
    }

    // 5. UPDATE PATIENT CLINICAL JOURNEYS
    for (const pt of this.patients) {
      pt.serviceTimer -= dt;
      if (pt.serviceTimer <= 0) {
        if (pt.stage === 'Registered') {
          pt.stage = 'Triaged';
          pt.journeyTimestamps.triaged = this.simClock;
          pt.serviceTimer = this.rng.range(6, 12);
        } else if (pt.stage === 'Triaged') {
          pt.stage = 'Consultation';
          pt.journeyTimestamps.consultation = this.simClock;
          pt.serviceTimer = this.rng.range(8, 14);
        } else if (pt.stage === 'Consultation') {
          pt.stage = 'Diagnostics';
          pt.journeyTimestamps.diagnostics = this.simClock;
          pt.serviceTimer = this.rng.range(8, 14);
        } else if (pt.stage === 'Diagnostics') {
          if (pt.triage === 'Low' || this.rng.next() < 0.35) {
            pt.stage = 'Discharged';
            pt.journeyTimestamps.discharged = this.simClock;
            const siteState = this.siteStates[pt.siteId];
            if (siteState) siteState.dischargedToday++;
            if (emitEvents) {
              this.addEvent('PATIENT_DISCHARGED', 'Discharge Complete', `${pt.id} discharged in stable condition`, pt.siteId, pt.position, '#10B981');
            }
          } else {
            pt.stage = 'Admitted';
            pt.assignedBed = this.rng.rangeInt(1, 45);
            pt.journeyTimestamps.admitted = this.simClock;
            const siteState = this.siteStates[pt.siteId];
            if (siteState) siteState.admittedToday++;
            if (emitEvents) {
              this.addEvent('PATIENT_ADMITTED', 'Patient Admitted', `${pt.id} admitted to Ward`, pt.siteId, pt.position, '#2F5BEA');
            }
          }
          pt.serviceTimer = 40;
        }
      }
    }

    // Refresh aggregated stats
    this.stats.erBaysBusy = this.ambulances.filter((a) => a.state === 'DOCKING' || a.state === 'UNLOADING').length;
    this.stats.activeAmbulances = this.ambulances.length;
    this.stats.activePatients = this.patients.length;
    this.stats.simTimeSeconds = this.simClock;
  }

  // Alias tick to step for compatibility
  public tick(deltaSeconds: number, emitEvents = true) {
    this.step(deltaSeconds, emitEvents);
  }
}

// Global single instance across StrictMode & HMR
declare global {
  var __simEngine: SimulationEngine | undefined;
}

export const simEngine = (globalThis.__simEngine ??= new SimulationEngine());
export const engine = simEngine;
