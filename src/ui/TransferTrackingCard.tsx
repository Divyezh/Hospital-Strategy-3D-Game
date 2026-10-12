'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock, MapPin, Truck, ChevronRight } from 'lucide-react';
import { useSimStore } from '@/store/useSimStore';
import { simEngine } from '@/sim/engine';

/**
 * Emergency & Transfer Tracking Card (Bottom Left)
 * Perfectly recreates the video's signature Shipment Tracking stepper widget.
 */
export function TransferTrackingCard() {
  const activeSite = useSimStore((s) => s.activeSite);
  // Subscribe to sim stats updates
  useSimStore((s) => s.stats);

  // Active incoming ambulance or supply van
  const activeAmb = simEngine.ambulances.find(
    (a) => a.state === 'DOCKING' || a.state === 'EN_ROUTE' || a.state === 'UNLOADING'
  ) || simEngine.ambulances[0];

  const currentStep =
    activeAmb?.state === 'UNLOADING'
      ? 4
      : activeAmb?.state === 'DOCKING'
      ? 3
      : activeAmb?.state === 'EN_ROUTE'
      ? 2
      : 1;

  const steps = [
    { label: 'Triage Call', sub: '09:12' },
    { label: 'Dispatched', sub: '09:18' },
    { label: 'En Route', sub: '09:28' },
    { label: 'Docking 1/4', sub: 'ETA 09:45' },
    { label: 'Admitted', sub: 'Wards' },
  ];

  return (
    <div className="absolute bottom-4 left-4 z-30 pointer-events-auto hidden lg:flex flex-col bg-white/90 backdrop-blur-xl rounded-2xl border border-white/80 shadow-2xl shadow-blue-950/10 p-3.5 min-w-110 max-w-125 select-none animate-in fade-in slide-in-from-bottom-2">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#1E60F3] flex items-center justify-center">
            <Truck className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-extrabold text-slate-800 tracking-tight">
            Emergency Transfer Tracking
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
          <span>#CASE-78450</span>
        </div>
      </div>

      {/* 5-Stage Stepper Progress Line */}
      <div className="py-3 px-1">
        <div className="relative flex items-center justify-between">
          {/* Background Track Line */}
          <div className="absolute left-2 right-2 top-3 h-0.5 bg-slate-200 z-0" />
          {/* Active Filled Line */}
          <div
            className="absolute left-2 top-3 h-0.5 bg-[#1E60F3] transition-all duration-500 z-0"
            style={{ width: `${(currentStep / (steps.length - 1)) * 95}%` }}
          />

          {steps.map((st, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-[#1E60F3] text-white shadow-md shadow-blue-500/25'
                      : isCurrent
                      ? 'bg-white border-2 border-[#1E60F3] text-[#1E60F3] shadow-md'
                      : 'bg-white border-2 border-slate-200 text-slate-300'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-3" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#1E60F3] animate-pulse" />
                  ) : (
                    <Circle className="w-2.5 h-2.5 stroke-2" />
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[10px] font-bold ${
                    isDone || isCurrent ? 'text-slate-800' : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>
                <span className="text-[9px] font-medium text-slate-400">{st.sub}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Transfer Details Card */}
      <div className="mt-1 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
            <MapPin className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
              <span>{activeAmb?.id || 'AMB-2205'} · {activeAmb?.fleet || 'LifeLine'}</span>
              <span className="text-slate-400 font-normal">→</span>
              <span className="text-blue-600">Bay {activeAmb?.targetBaySlot || 2}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>
                {activeAmb?.state === 'UNLOADING'
                  ? 'Unloading Patient · 12 min left'
                  : activeAmb?.state === 'DOCKING'
                  ? 'Reversing into Bay · 2 min left'
                  : 'Arriving in 14 min'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeAmb?.state === 'UNLOADING'
                ? 'bg-emerald-100 text-emerald-700'
                : activeAmb?.state === 'DOCKING'
                ? 'bg-amber-100 text-amber-700 animate-pulse'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {activeAmb?.state || 'EN ROUTE'}
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
