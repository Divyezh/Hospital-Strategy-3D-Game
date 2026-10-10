'use client';

import React, { useState } from 'react';
import { Plus, Minus, RotateCcw, RotateCw, Home, Settings, Gauge, Eye, Sparkles } from 'lucide-react';
import { useSimStore } from '@/store/useSimStore';

export function FloatingCameraControls() {
  const {
    zoomIn,
    zoomOut,
    rotateLeft,
    rotateRight,
    resetHome,
    simSpeed,
    setSimSpeed,
    labelsVisible,
    toggleLabels,
    qualityHigh,
    toggleQuality,
  } = useSimStore();

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center select-none pointer-events-auto">
      {/* Floating Vertical Control Stack */}
      <div className="flex flex-col items-center bg-white/85 backdrop-blur-xl rounded-2xl border border-white/70 shadow-2xl shadow-blue-900/10 p-1.5 gap-1.5 transition-transform">
        {/* Zoom In (+) */}
        <button
          onClick={zoomIn}
          title="Zoom In (or Scroll Up)"
          aria-label="Zoom In"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-[#2F5BEA] hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Zoom Out (-) */}
        <button
          onClick={zoomOut}
          title="Zoom Out (or Scroll Down)"
          aria-label="Zoom Out"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-[#2F5BEA] hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <Minus className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="w-6 h-px bg-slate-200/80 my-0.5" />

        {/* Rotate Left 90° (↶) */}
        <button
          onClick={rotateLeft}
          title="Rotate Left 90°"
          aria-label="Rotate Left 90°"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-[#2F5BEA] hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Rotate Right 90° (↷) */}
        <button
          onClick={rotateRight}
          title="Rotate Right 90°"
          aria-label="Rotate Right 90°"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-[#2F5BEA] hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <RotateCw className="w-4 h-4 stroke-[2.2]" />
        </button>

        <div className="w-6 h-px bg-slate-200/80 my-0.5" />

        {/* Home / Reset View */}
        <button
          onClick={resetHome}
          title="Reset View (Home)"
          aria-label="Home"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-[#2F5BEA] hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <Home className="w-4 h-4 stroke-[2.2]" />
        </button>

        <div className="w-6 h-px bg-slate-200/80 my-0.5" />

        {/* Settings Toggle */}
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          title="Simulation & Visual Settings"
          aria-label="Settings"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm ${
            settingsOpen
              ? 'bg-[#2F5BEA] text-white'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* Settings Flyout Popover */}
      {settingsOpen && (
        <div className="absolute right-14 top-1/2 -translate-y-1/2 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-2xl p-4 flex flex-col gap-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-[#2F5BEA]" /> View Settings
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Control Room</span>
          </div>

          {/* Speed settings */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-600" /> Sim Speed
              </span>
              <span className="text-[11px] font-bold text-[#2F5BEA]">{simSpeed === 0 ? 'Paused' : `${simSpeed}x`}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/80 rounded-xl">
              {([0, 1, 2, 4] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimSpeed(spd)}
                  className={`py-1 text-xs font-bold rounded-lg transition-all ${
                    simSpeed === spd
                      ? 'bg-[#2F5BEA] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {spd === 0 ? '❚❚' : `${spd}x`}
                </button>
              ))}
            </div>
          </div>

          {/* Labels Toggle */}
          <div className="flex items-center justify-between py-1 text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" /> World Labels
            </span>
            <button
              onClick={toggleLabels}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                labelsVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {labelsVisible ? 'Enabled' : 'Hidden'}
            </button>
          </div>

          {/* Quality Toggle */}
          <div className="flex items-center justify-between py-1 text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Graphics Quality
            </span>
            <button
              onClick={toggleQuality}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                qualityHigh ? 'bg-blue-100 text-[#2F5BEA]' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {qualityHigh ? 'High (PCF)' : 'Low'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
