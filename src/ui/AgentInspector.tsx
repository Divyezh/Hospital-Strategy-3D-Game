'use client';

import React from 'react';
import { Truck, X, Crosshair, Maximize2 } from 'lucide-react';
import { useSimStore } from '@/store/useSimStore';

export function AgentInspector() {
  const selectedAgent = useSimStore((s) => s.selectedAgent);
  const clearFollowedAgent = useSimStore((s) => s.clearFollowedAgent);

  if (!selectedAgent) return null;

  const isTruck = selectedAgent.type === 'ambulance';

  return (
    <aside className="absolute top-20 right-4 z-40 pointer-events-auto w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 shadow-2xl p-4 select-none animate-in fade-in slide-in-from-right-2">
      {/* Header with Title and Control Buttons */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
            <Truck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              {isTruck ? 'AMBULANCE · MC-01' : 'FORKLIFT / ORDERLY · MC-01'}
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              {selectedAgent.id}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              {isTruck ? 'Mercedes Sprinter Emergency' : 'Sam Haddad · Toyota 8FBE18'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={clearFollowedAgent}
            className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Status Pill & Progress Bar */}
      <div className="py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            {isTruck ? 'Docked at Bay' : 'Active Transport'}
          </span>
          <span className="text-[11px] font-semibold text-slate-600">Battery 75%</span>
        </div>
        <p className="text-xs text-slate-700 font-semibold mb-2">
          {selectedAgent.label}
        </p>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full w-3/4" />
        </div>
      </div>

      {/* Metadata Table Rows (Matching reference photo) */}
      <div className="pt-3 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">Carrying</span>
          <span className="text-slate-800 font-semibold">
            {isTruck ? 'Trauma Patient' : 'Stretcher / Pallet'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">Moves today</span>
          <span className="text-slate-800 font-bold">28</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">Speed</span>
          <span className="text-slate-800 font-semibold">4.5 km/h</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">Charger</span>
          <span className="text-blue-600 font-bold">C1</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">Site</span>
          <span className="text-slate-800 font-semibold">Riverside Hub</span>
        </div>
      </div>
    </aside>
  );
}
