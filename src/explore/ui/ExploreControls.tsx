'use client';

import React from 'react';
import {
  Building,
  Sparkles,
  Sun,
  Moon,
  Sunset,
  Eye,
  SlidersHorizontal,
  ShieldCheck,
  Layers,
  ChevronRight,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useExploreStore, QualitySetting } from '@/explore/store';
import { HOSPITAL_ROOMS } from '@/data/hospital';
import { campusAudio } from '@/explore/sound';
import { ExploreDebugHud } from './ExploreDebugHud';
import { ExploreJoystick } from './ExploreJoystick';

export function ExploreControls() {
  const activeView = useExploreStore((s) => s.activeView);
  const setActiveView = useExploreStore((s) => s.setActiveView);
  const timeOfDay = useExploreStore((s) => s.timeOfDay);
  const setTimeOfDay = useExploreStore((s) => s.setTimeOfDay);
  const quality = useExploreStore((s) => s.quality);
  const setQuality = useExploreStore((s) => s.setQuality);
  const cameraMode = useExploreStore((s) => s.cameraMode);
  const setCameraMode = useExploreStore((s) => s.setCameraMode);

  const selectedFloor = useExploreStore((s) => s.selectedFloor);
  const setSelectedFloor = useExploreStore((s) => s.setSelectedFloor);
  const selectedRoomId = useExploreStore((s) => s.selectedRoomId);
  const setSelectedRoomId = useExploreStore((s) => s.setSelectedRoomId);

  const sidebarOpen = useExploreStore((s) => s.sidebarOpen);
  const setSidebarOpen = useExploreStore((s) => s.setSidebarOpen);

  const guardTelemetry = useExploreStore((s) => s.guardTelemetry);
  const parkingTelemetry = useExploreStore((s) => s.parkingTelemetry);

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(false);

  // Auto-open directory on large desktop screens on initial load
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1200) {
      setSidebarOpen(true);
    }
  }, [setSidebarOpen]);

  const toggleSound = () => {
    campusAudio.init();
    campusAudio.resume();
    const muted = campusAudio.toggleMute();
    setSoundEnabled(!muted);
  };

  return (
    <>
      {/* Top Left Wordmark Card & Return Button (Responsive) */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-40 flex items-center gap-2 sm:gap-3 select-none pointer-events-auto">
        <div className="flex items-center gap-2 sm:gap-2.5 bg-white/92 backdrop-blur-xl px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-white/80 shadow-lg shadow-slate-900/5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-linear-to-tr from-[#3A6EA5] to-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/25 shrink-0">
            <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight leading-tight">
              MediCity
            </span>
            <span className="hidden sm:block text-[10px] text-teal-700 font-semibold tracking-wider uppercase">
              Campus Explore · 3D
            </span>
          </div>
        </div>
      </div>

      {/* Top Right Quick Settings (Sound, Time of Day & Quality - Responsive) */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-40 flex items-center gap-1.5 sm:gap-2 select-none pointer-events-auto">
        {/* Sound Toggle Button */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Campus Audio' : 'Enable Campus Audio (Siren, Engine, Gate, Voices)'}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-2xl border backdrop-blur-xl shadow-md text-xs font-bold transition-all active:scale-95 ${
            soundEnabled
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-emerald-500/10'
              : 'bg-white/85 text-slate-600 border-white/80 hover:bg-white'
          }`}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              <span className="hidden md:inline">Sound ON</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <span className="hidden md:inline">Sound OFF</span>
            </>
          )}
        </button>

        {/* Time of Day Pills */}
        <div className="flex items-center bg-white/85 backdrop-blur-xl p-0.5 sm:p-1 rounded-2xl border border-white/80 shadow-md">
          <button
            onClick={() => setTimeOfDay('morning')}
            title="Morning"
            className={`p-1.5 sm:p-2 rounded-xl transition-all ${
              timeOfDay === 'morning' ? 'bg-amber-100 text-amber-800 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => setTimeOfDay('noon')}
            title="Noon"
            className={`p-1.5 sm:p-2 rounded-xl transition-all ${
              timeOfDay === 'noon' ? 'bg-sky-100 text-sky-800 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
          </button>
          <button
            onClick={() => setTimeOfDay('golden')}
            title="Golden Hour"
            className={`p-1.5 sm:p-2 rounded-xl transition-all ${
              timeOfDay === 'golden' ? 'bg-orange-100 text-orange-800 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sunset className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            title="Night"
            className={`p-1.5 sm:p-2 rounded-xl transition-all ${
              timeOfDay === 'night' ? 'bg-indigo-900 text-indigo-100 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Quality Menu Toggle */}
        <div className="relative">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center gap-1 sm:gap-1.5 bg-white/85 hover:bg-white backdrop-blur-xl px-2 sm:px-3 py-2 rounded-2xl border border-white/80 shadow-md text-xs font-semibold text-slate-700 transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
            <span className="capitalize hidden sm:inline">{quality}</span>
          </button>

          {settingsOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-xl p-2 z-50">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Graphics Quality</div>
              {(['low', 'medium', 'high'] as QualitySetting[]).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuality(q);
                    setSettingsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold capitalize flex items-center justify-between ${
                    quality === q ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{q}</span>
                  {quality === q && <span className="w-2 h-2 rounded-full bg-teal-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Button to Open List when closed (Available for PC, Mobile, Tablet) */}
      {!sidebarOpen && (
        <div className="absolute top-16 sm:top-20 left-3 sm:left-4 z-30 select-none pointer-events-auto animate-in fade-in duration-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 bg-white/92 hover:bg-white backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-white/85 shadow-xl text-xs font-bold text-slate-800 transition-all active:scale-95 hover:shadow-2xl hover:border-teal-300"
          >
            <Building className="w-4 h-4 text-teal-600" />
            <span>Departments ({HOSPITAL_ROOMS.length})</span>
            <span className="px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-extrabold">
              Floor G-2
            </span>
          </button>
        </div>
      )}

      {/* Left Reference Floating Drawer Card: Explore & Department Directory */}
      <div
        className={`absolute top-16 sm:top-20 left-3 sm:left-4 z-30 w-[calc(100vw-24px)] xs:w-[calc(100vw-32px)] sm:w-84 max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-160px)] flex flex-col bg-white/95 backdrop-blur-2xl p-4 rounded-3xl border border-white/85 shadow-2xl pointer-events-auto overflow-hidden transition-all duration-300 ease-out transform ${
          sidebarOpen
            ? 'translate-x-0 opacity-100 scale-100'
            : '-translate-x-[120%] opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Card Header with Close Button */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
              Explore the hospital.
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Select a department to look around, or take a tour.
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            title="Close list (press anytime to reopen)"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all active:scale-90 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Floor Cutaway Controls */}
        <div className="mt-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-teal-600" /> Floor Cutaway
          </div>
          <div className="grid grid-cols-4 gap-1 bg-slate-100/90 p-1 rounded-2xl">
            <button
              onClick={() => {
                setSelectedFloor(null);
                setSelectedRoomId(null);
              }}
              className={`py-1 rounded-xl text-[11px] font-bold transition-all ${
                selectedFloor === null ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setSelectedFloor(0);
                setSelectedRoomId(null);
              }}
              className={`py-1 rounded-xl text-[11px] font-bold transition-all ${
                selectedFloor === 0 ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              G Floor
            </button>
            <button
              onClick={() => {
                setSelectedFloor(1);
                setSelectedRoomId(null);
              }}
              className={`py-1 rounded-xl text-[11px] font-bold transition-all ${
                selectedFloor === 1 ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              1st Fl
            </button>
            <button
              onClick={() => {
                setSelectedFloor(2);
                setSelectedRoomId(null);
              }}
              className={`py-1 rounded-xl text-[11px] font-bold transition-all ${
                selectedFloor === 2 ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              2nd Fl
            </button>
          </div>
        </div>

        {/* Live Gate & Guard Status Badge (Real-time telemetry) */}
        <div className="mt-3 p-3 rounded-2xl bg-teal-50/90 border border-teal-200/80 text-xs text-teal-900 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <div>
                <div className="font-bold text-[11px] leading-tight">Gate Guards & Checkpoints</div>
                <div className="text-[10px] text-teal-700">Active inspections</div>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                guardTelemetry.barrierState === 'OPEN'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              Barrier: {guardTelemetry.barrierState}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-teal-200/70 text-[10px]">
            <div className="bg-white/80 p-1.5 rounded-xl border border-teal-100">
              <div className="text-slate-500 font-medium">Vehicles Today</div>
              <div className="font-extrabold text-teal-950 text-xs">
                {guardTelemetry.vehiclesChecked}{' '}
                <span className="text-[9px] font-normal text-slate-500">
                  (Q: {guardTelemetry.vehicleQueueLength})
                </span>
              </div>
            </div>
            <div className="bg-white/80 p-1.5 rounded-xl border border-teal-100">
              <div className="text-slate-500 font-medium">Visitors Checked</div>
              <div className="font-extrabold text-teal-950 text-xs">
                {guardTelemetry.pedestriansChecked}{' '}
                <span className="text-[9px] font-normal text-slate-500">
                  (Q: {guardTelemetry.pedestrianQueueLength})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-teal-200/60 text-[10px] text-teal-800">
            <span>Parking Occupancy:</span>
            <span className="font-bold text-teal-950">
              {parkingTelemetry.used} / {parkingTelemetry.capacity} bays used
            </span>
          </div>
        </div>

        {/* Department List with live click-to-fly */}
        <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Hospital Departments ({HOSPITAL_ROOMS.length})
          </div>
          {HOSPITAL_ROOMS.map((room) => {
            const isSelected = selectedRoomId === room.id;
            return (
              <button
                key={room.id}
                onClick={() => {
                  setSelectedRoomId(room.id);
                  setSelectedFloor(room.floor);
                  // On mobile screens, auto collapse list after selection so user sees the view!
                  if (typeof window !== 'undefined' && window.innerWidth < 640) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full text-left p-2 rounded-2xl flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-teal-50 border border-teal-200 text-teal-900 font-bold'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold leading-tight">{room.name}</div>
                  <div className="text-[10px] text-slate-400">
                    Floor {room.floor === 0 ? 'G' : room.floor} · {room.capacity} cap · {room.staffRoles.join(', ')}
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-700' : 'text-slate-300'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar: Presets & Navigation (Fully Responsive & Touch-Scrollable) */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none select-none max-w-full px-2 sm:px-4">
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 bg-white/92 backdrop-blur-2xl p-1 sm:p-1.5 rounded-2xl border border-white/85 shadow-2xl overflow-x-auto max-w-[94vw] sm:max-w-2xl no-scrollbar scroll-smooth">
          {/* Hospital grounds overview */}
          <button
            onClick={() => {
              setActiveView('grounds');
              setSelectedRoomId(null);
            }}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
              activeView === 'grounds' && !selectedRoomId
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Hospital grounds
          </button>

          {/* Main gate preset */}
          <button
            onClick={() => {
              setActiveView('gate');
              setSelectedRoomId(null);
            }}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
              activeView === 'gate' && !selectedRoomId
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Main gate
          </button>

          {/* Transit Hub & Stands preset */}
          <button
            onClick={() => {
              setActiveView('transit');
              setSelectedRoomId(null);
            }}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
              activeView === 'transit' && !selectedRoomId
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            Transit Hub & Stands
          </button>

          {/* Emergency bay preset */}
          <button
            onClick={() => {
              setActiveView('emergency');
              setSelectedRoomId(null);
            }}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
              activeView === 'emergency' && !selectedRoomId
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            ER Bay
          </button>

          {/* Reception preset */}
          <button
            onClick={() => {
              setActiveView('reception');
              setSelectedRoomId(null);
            }}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
              activeView === 'reception' && !selectedRoomId
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Lobby
          </button>

          {/* Neighbourhood wide view */}
          <button
            onClick={() => {
              setActiveView('neighbourhood');
              setSelectedRoomId(null);
            }}
            className={`shrink-0 whitespace-nowrap px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
              activeView === 'neighbourhood' && !selectedRoomId
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Neighbourhood
          </button>

          {/* Move view toggle */}
          <button
            onClick={() => setCameraMode(cameraMode === 'orbit' ? 'free' : 'orbit')}
            className={`shrink-0 whitespace-nowrap px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 ${
              cameraMode === 'free'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Move view</span>
          </button>

          {/* Take a tour (dark primary button) */}
          <button
            onClick={() => {
              setActiveView('grounds');
              setSelectedRoomId(null);
            }}
            className="shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-[#1E293B] hover:bg-black text-white shadow-md flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Tour</span>
          </button>
        </div>

        {/* Reference Hint text */}
        <div className="hidden xs:block text-[10px] sm:text-[11px] font-medium text-slate-600 bg-white/75 backdrop-blur-md px-3 py-0.5 sm:py-1 rounded-full border border-white/60 shadow-xs">
          Swipe presets · Use joystick or drag to move & 360° rotate
        </div>
      </div>

      {/* 360° Camera View & World Move Virtual Joystick for PC, Mobile & Tablet */}
      <ExploreJoystick />

      {/* Dev Debug HUD Overlay Component */}
      <ExploreDebugHud />
    </>
  );
}
