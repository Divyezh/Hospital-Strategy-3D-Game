import { create } from 'zustand';

export type QualitySetting = 'low' | 'medium' | 'high';
export type TimeOfDaySetting = 'morning' | 'noon' | 'golden' | 'night';
export type CameraViewPreset = 'grounds' | 'neighbourhood' | 'gate' | 'reception' | 'emergency' | 'tour' | 'transit';

export interface SimMetrics {
  ticks: number;
  fps: number;
  vehiclesTotal: number;
  vehiclesMoving: number;
  pedestriansTotal: number;
  pedestriansMoving: number;
  invariantViolations: string[];
}

export interface GuardTelemetry {
  vehiclesChecked: number;
  pedestriansChecked: number;
  vehicleQueueLength: number;
  pedestrianQueueLength: number;
  barrierState: 'OPEN' | 'CLOSED' | 'OPENING' | 'CLOSING';
}

export interface ParkingTelemetry {
  used: number;
  capacity: number;
}

interface ExploreState {
  quality: QualitySetting;
  timeOfDay: TimeOfDaySetting;
  activeView: CameraViewPreset;
  selectedFloor: number | null; // null = exterior / all, 0 = G, 1 = 1st, 2 = 2nd
  selectedRoomId: string | null;
  labelsVisible: boolean;
  cameraMode: 'orbit' | 'free' | 'follow';
  isTourActive: boolean;
  tourStopIndex: number;
  focusedEntityId: string | null;

  // Dev Debug Tools (Step 0)
  debugOverlay: boolean;
  simMetrics: SimMetrics;
  guardTelemetry: GuardTelemetry;
  parkingTelemetry: ParkingTelemetry;

  setQuality: (quality: QualitySetting) => void;
  setTimeOfDay: (time: TimeOfDaySetting) => void;
  setActiveView: (view: CameraViewPreset) => void;
  setSelectedFloor: (floor: number | null) => void;
  setSelectedRoomId: (id: string | null) => void;
  setLabelsVisible: (visible: boolean) => void;
  setCameraMode: (mode: 'orbit' | 'free' | 'follow') => void;
  setIsTourActive: (active: boolean) => void;
  setTourStopIndex: (index: number) => void;
  setFocusedEntityId: (id: string | null) => void;

  // 360 Joystick & World Move Camera
  cameraOrbitDelta: { x: number; y: number };
  cameraMoveDelta: { x: number; y: number };
  autoRotate360: boolean;
  sidebarOpen: boolean;
  dualSticksEnabled: boolean;
  setCameraOrbitDelta: (delta: { x: number; y: number }) => void;
  setCameraMoveDelta: (delta: { x: number; y: number }) => void;
  setAutoRotate360: (autoRotate: boolean) => void;
  toggleAutoRotate360: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarOpen: () => void;
  setDualSticksEnabled: (enabled: boolean) => void;
  toggleDualSticks: () => void;

  toggleDebugOverlay: () => void;
  setDebugOverlay: (enabled: boolean) => void;
  updateSimMetrics: (metrics: Partial<SimMetrics>) => void;
  updateGuardTelemetry: (telemetry: Partial<GuardTelemetry>) => void;
  updateParkingTelemetry: (telemetry: Partial<ParkingTelemetry>) => void;
}

export const useExploreStore = create<ExploreState>((set) => ({
  quality: 'high',
  timeOfDay: 'golden',
  activeView: 'grounds',
  selectedFloor: null,
  selectedRoomId: null,
  labelsVisible: true,
  cameraMode: 'orbit',
  isTourActive: false,
  tourStopIndex: 0,
  focusedEntityId: null,

  debugOverlay: false,
  simMetrics: {
    ticks: 0,
    fps: 60,
    vehiclesTotal: 0,
    vehiclesMoving: 0,
    pedestriansTotal: 0,
    pedestriansMoving: 0,
    invariantViolations: [],
  },
  guardTelemetry: {
    vehiclesChecked: 14,
    pedestriansChecked: 42,
    vehicleQueueLength: 0,
    pedestrianQueueLength: 1,
    barrierState: 'CLOSED',
  },
  parkingTelemetry: {
    used: 12,
    capacity: 24,
  },

  setQuality: (quality) => set({ quality }),
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  setActiveView: (activeView) => set({ activeView }),
  setSelectedFloor: (selectedFloor) => set({ selectedFloor }),
  setSelectedRoomId: (selectedRoomId) => set({ selectedRoomId }),
  setLabelsVisible: (labelsVisible) => set({ labelsVisible }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setIsTourActive: (isTourActive) => set({ isTourActive }),
  setTourStopIndex: (tourStopIndex) => set({ tourStopIndex }),
  setFocusedEntityId: (focusedEntityId) => set({ focusedEntityId }),

  cameraOrbitDelta: { x: 0, y: 0 },
  cameraMoveDelta: { x: 0, y: 0 },
  autoRotate360: false,
  sidebarOpen: false, // Default closed on mobile, user can easily toggle open
  dualSticksEnabled: false,
  setCameraOrbitDelta: (cameraOrbitDelta) => set({ cameraOrbitDelta }),
  setCameraMoveDelta: (cameraMoveDelta) => set({ cameraMoveDelta }),
  setAutoRotate360: (autoRotate360) => set({ autoRotate360 }),
  toggleAutoRotate360: () => set((state) => ({ autoRotate360: !state.autoRotate360 })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebarOpen: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setDualSticksEnabled: (dualSticksEnabled) => set({ dualSticksEnabled }),
  toggleDualSticks: () => set((state) => ({ dualSticksEnabled: !state.dualSticksEnabled })),

  toggleDebugOverlay: () => set((state) => ({ debugOverlay: !state.debugOverlay })),
  setDebugOverlay: (debugOverlay) => set({ debugOverlay }),
  updateSimMetrics: (metrics) =>
    set((state) => ({ simMetrics: { ...state.simMetrics, ...metrics } })),
  updateGuardTelemetry: (telemetry) =>
    set((state) => ({ guardTelemetry: { ...state.guardTelemetry, ...telemetry } })),
  updateParkingTelemetry: (telemetry) =>
    set((state) => ({ parkingTelemetry: { ...state.parkingTelemetry, ...telemetry } })),
}));
