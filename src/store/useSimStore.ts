import { create } from 'zustand';
import { SimStats, SimEvent, Vector3D } from '@/sim/types';
import { SITES, SiteDefinition } from '@/data/sites';

export interface SelectedAgentInfo {
  id: string;
  name: string;
  type: 'ambulance' | 'orderly' | 'patient' | 'staff' | 'van';
  siteId?: string;
  label: string;
  status: string;
  position: Vector3D;
  details?: Record<string, string | number>;
}

export interface SelectedSiteElement {
  id: string;
  type: 'bay' | 'restStation' | 'building' | 'helipad';
  name: string;
  siteId: string;
  status?: string;
  details?: Record<string, string | number>;
}

interface SimStoreState {
  // Sites
  activeSiteId: string;
  activeSite: SiteDefinition;
  selectSite: (siteId: string) => void;

  // Camera & Navigation
  zoomDistance: number; // distance from target
  rotationAngle: number; // in radians, 0, PI/2, PI, 3PI/2
  targetPan: Vector3D;
  followedAgentId: string | null;
  selectedAgent: SelectedAgentInfo | null;
  selectedElement: SelectedSiteElement | null;
  isDragging: boolean;
  isFlying: boolean;
  flyProgress: number; // 0 to 1

  // Simulation speed & aggregates (~4 Hz)
  simSpeed: 1 | 2 | 4 | 0; // 0 = pause
  labelsVisible: boolean;
  qualityHigh: boolean;
  stats: SimStats;
  recentEvents: SimEvent[];

  // Actions
  setSimSpeed: (speed: 1 | 2 | 4 | 0) => void;
  toggleLabels: () => void;
  toggleQuality: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomDistance: (dist: number) => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  resetHome: () => void;
  panBy: (dx: number, dz: number) => void;
  setTargetPan: (pos: Vector3D) => void;
  flyToLocation: (pos: Vector3D, zoomDist?: number) => void;
  setFollowedAgent: (agent: SelectedAgentInfo | null) => void;
  clearFollowedAgent: () => void;
  selectElement: (element: SelectedSiteElement | null) => void;
  clearSelection: () => void;
  setIsDragging: (dragging: boolean) => void;
  setIsFlying: (flying: boolean) => void;
  updateStats: (stats: SimStats, events: SimEvent[]) => void;
}

const DEFAULT_SITE_ID = 'site-mc-04';
const initialSite = SITES.find((s) => s.id === DEFAULT_SITE_ID) || SITES[0];
const DEFAULT_TARGET: Vector3D = { x: initialSite.center[0], y: 0, z: initialSite.center[2] };
const DEFAULT_ZOOM_DIST = 68; // perspective camera distance (~40deg elevation)

export const useSimStore = create<SimStoreState>((set, get) => ({
  activeSiteId: DEFAULT_SITE_ID,
  activeSite: initialSite,

  zoomDistance: DEFAULT_ZOOM_DIST,
  rotationAngle: 0,
  targetPan: { ...DEFAULT_TARGET },
  followedAgentId: null,
  selectedAgent: null,
  selectedElement: null,
  isDragging: false,
  isFlying: false,
  flyProgress: 1,

  simSpeed: 1,
  labelsVisible: true,
  qualityHigh: true,

  stats: {
    bedsOccupied: 312,
    bedsTotal: 420,
    erBaysBusy: 3,
    erBaysTotal: 6,
    admittedToday: 48,
    dischargedToday: 31,
    avgWaitMinutes: 14.0,
    activeAmbulances: 4,
    activePatients: 6,
    activeStaffWorking: 5,
    supplies: {
      gloves: 780,
      masks: 680,
      ivFluids: 210,
      oxygenCylinders: 40,
    },
    simTimeSeconds: 9 * 3600 + 43 * 60,
  },
  recentEvents: [],

  selectSite: (siteId: string) => {
    const site = SITES.find((s) => s.id === siteId);
    if (!site) return;

    set({
      activeSiteId: siteId,
      activeSite: site,
      targetPan: { x: site.center[0], y: 0, z: site.center[2] },
      followedAgentId: null,
      selectedAgent: null,
      selectedElement: null,
      isFlying: true,
      flyProgress: 0,
    });
  },

  setSimSpeed: (speed) => set({ simSpeed: speed }),
  toggleLabels: () => set((s) => ({ labelsVisible: !s.labelsVisible })),
  toggleQuality: () => set((s) => ({ qualityHigh: !s.qualityHigh })),

  zoomIn: () =>
    set((state) => ({
      zoomDistance: Math.max(16, state.zoomDistance - 10),
    })),

  zoomOut: () =>
    set((state) => ({
      zoomDistance: Math.min(140, state.zoomDistance + 10),
    })),

  setZoomDistance: (dist) =>
    set({
      zoomDistance: Math.max(16, Math.min(140, dist)),
    }),

  rotateLeft: () =>
    set((state) => ({
      rotationAngle: state.rotationAngle - Math.PI / 2,
    })),

  rotateRight: () =>
    set((state) => ({
      rotationAngle: state.rotationAngle + Math.PI / 2,
    })),

  resetHome: () => {
    const curSite = get().activeSite;
    set({
      zoomDistance: DEFAULT_ZOOM_DIST,
      rotationAngle: 0,
      targetPan: { x: curSite.center[0], y: 0, z: curSite.center[2] },
      followedAgentId: null,
      selectedAgent: null,
      selectedElement: null,
      isFlying: true,
      flyProgress: 0,
    });
  },

  panBy: (dx, dz) =>
    set((state) => ({
      targetPan: {
        x: Math.max(-100, Math.min(100, state.targetPan.x + dx)),
        y: 0,
        z: Math.max(-100, Math.min(100, state.targetPan.z + dz)),
      },
      followedAgentId: null, // manual pan cancels agent tracking
    })),

  setTargetPan: (pos) =>
    set({
      targetPan: { ...pos },
    }),

  flyToLocation: (pos, zoomDist) =>
    set((state) => ({
      targetPan: { ...pos },
      zoomDistance: zoomDist !== undefined ? zoomDist : state.zoomDistance,
      followedAgentId: null,
      isFlying: true,
      flyProgress: 0,
    })),

  setFollowedAgent: (agent) =>
    set({
      followedAgentId: agent ? agent.id : null,
      selectedAgent: agent,
      selectedElement: null,
    }),

  clearFollowedAgent: () =>
    set({
      followedAgentId: null,
      selectedAgent: null,
    }),

  selectElement: (element) =>
    set({
      selectedElement: element,
      selectedAgent: null,
      followedAgentId: null,
    }),

  clearSelection: () =>
    set({
      selectedAgent: null,
      selectedElement: null,
      followedAgentId: null,
    }),

  setIsDragging: (isDragging) => set({ isDragging }),
  setIsFlying: (isFlying) => set({ isFlying }),

  updateStats: (stats, events) =>
    set({
      stats: { ...stats },
      recentEvents: [...events],
    }),
}));
