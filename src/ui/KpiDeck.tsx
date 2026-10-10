'use client';

import React from 'react';
import { Bed, Ambulance, Activity, ArrowUp } from 'lucide-react';
import { useSimStore } from '@/store/useSimStore';
import { simEngine } from '@/sim/engine';
import { selectSiteKpis } from '@/sim/selectors';

export function KpiDeck() {
  const activeSite = useSimStore((s) => s.activeSite);
  // Re-render trigger from Zustand stats published at ~4 Hz
  useSimStore((s) => s.stats);

  const kpis = selectSiteKpis(simEngine, activeSite.id);

  return (
    <div className="absolute top-20 left-4 z-30 pointer-events-auto flex items-center gap-3 select-none">
      {/* Card 1: Beds free */}
      <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-white/70 shadow-xl shadow-blue-900/5 p-3.5 min-w-44 hover:bg-white transition-all">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2F5BEA] flex items-center justify-center">
            <Bed className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Beds free</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            {kpis.bedsFree.value}
          </span>
          <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            <ArrowUp className="w-3 h-3 stroke-3" /> {kpis.bedsFree.deltaStr}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
          of {kpis.bedsFree.total} · {kpis.bedsFree.siteCode}
        </p>
      </div>

      {/* Card 2: Ambulances on site */}
      <div className="bg-white/85 backdrop-blur-xl rounded-2xl border border-white/70 shadow-xl shadow-blue-900/5 p-3.5 min-w-44 hover:bg-white transition-all">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2F5BEA] flex items-center justify-center">
            <Ambulance className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Ambulances on site</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            {kpis.ambulancesOnSite.value}
          </span>
          <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            <ArrowUp className="w-3 h-3 stroke-3" /> {kpis.ambulancesOnSite.deltaStr}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
          {kpis.ambulancesOnSite.inbound} inbound · {kpis.ambulancesOnSite.siteCode}
        </p>
      </div>

      {/* Card 3: Care within target */}
      <div className="hidden sm:block bg-white/85 backdrop-blur-xl rounded-2xl border border-white/70 shadow-xl shadow-blue-900/5 p-3.5 min-w-44 hover:bg-white transition-all">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2F5BEA] flex items-center justify-center">
            <Activity className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Care within target</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            {kpis.careWithinTarget.percentage}%
          </span>
          <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            <ArrowUp className="w-3 h-3 stroke-3" /> {kpis.careWithinTarget.deltaStr}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
          {kpis.careWithinTarget.period} · {kpis.bedsFree.siteCode}
        </p>
      </div>
    </div>
  );
}
