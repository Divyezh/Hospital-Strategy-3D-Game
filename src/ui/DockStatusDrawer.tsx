'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { useSimStore } from '@/store/useSimStore';
import { simEngine } from '@/sim/engine';
import { selectSiteSummary, selectSiteBays, selectSiteStaff } from '@/sim/selectors';

export function DockStatusDrawer() {
  const activeSite = useSimStore((s) => s.activeSite);
  // Re-render trigger from Zustand stats published at ~4 Hz
  useSimStore((s) => s.stats);

  const summary = selectSiteSummary(simEngine, activeSite.id);
  const bays = selectSiteBays(simEngine, activeSite.id);
  const staff = selectSiteStaff(simEngine, activeSite.id);

  // Active or first bay to preview
  const primaryBay = bays.find((b) => b.status !== 'available') || bays[0];

  return (
    <div className="absolute bottom-4 right-4 z-30 pointer-events-auto hidden md:flex flex-col bg-white/85 backdrop-blur-xl rounded-2xl border border-white/70 shadow-2xl p-3 min-w-85 select-none">
      {/* Top Tabs / Real Counters strictly from single source of truth */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2F5BEA]" />
          <span className="text-xs font-bold text-slate-800">Bays</span>
          <span className="text-[11px] font-extrabold text-[#2F5BEA] bg-blue-50 px-1.5 py-0.5 rounded-md">
            {summary.busyBaysCount}/{summary.totalBaysCount}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span>
            Staff on duty{' '}
            <strong className="text-slate-800">
              {summary.staffWorkingCount}/{summary.staffOnDutyCount}
            </strong>
          </span>
          <span>
            Ambulances <strong className="text-slate-800">{summary.ambulancesOnSiteCount}</strong>
          </span>
        </div>
      </div>

      {/* Live Active Bay Status Row from real engine state */}
      {primaryBay && (
        <div className="pt-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                primaryBay.status === 'docking'
                  ? 'bg-amber-500 animate-pulse'
                  : primaryBay.status === 'unloading'
                  ? 'bg-blue-600'
                  : primaryBay.status === 'occupied'
                  ? 'bg-rose-500'
                  : 'bg-emerald-500'
              }`}
            />
            <span className="font-bold text-slate-800">Bay {primaryBay.slotNumber}</span>
            <span className="text-slate-500 font-medium text-[11px]">
              {primaryBay.ambulance?.id || 'Vacant'} · {activeSite.shortName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                primaryBay.status === 'docking'
                  ? 'bg-amber-100 text-amber-800'
                  : primaryBay.status === 'unloading'
                  ? 'bg-blue-100 text-blue-800'
                  : primaryBay.status === 'occupied'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {primaryBay.status.toUpperCase()}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {summary.busyBaysCount}/{summary.totalBaysCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
