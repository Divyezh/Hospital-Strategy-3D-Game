'use client';

import React, { useEffect } from 'react';
import { useExploreStore } from '@/explore/store';
import { Activity, ShieldAlert, Cpu, Car, Users, Eye } from 'lucide-react';

export function ExploreDebugHud() {
  const debugOverlay = useExploreStore((s) => s.debugOverlay);
  const toggleDebugOverlay = useExploreStore((s) => s.toggleDebugOverlay);
  const metrics = useExploreStore((s) => s.simMetrics);

  // Listen for key 'D' or 'd' to toggle debug overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'd' || e.key === 'D') {
        toggleDebugOverlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDebugOverlay]);

  return (
    <div className="absolute bottom-4 left-4 z-40 flex flex-col gap-2 pointer-events-auto select-none">
      {/* Dev Toggle Button */}
      <button
        onClick={toggleDebugOverlay}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-md transition-all active:scale-95 ${
          debugOverlay
            ? 'bg-amber-500 text-white border-amber-400 shadow-amber-500/20'
            : 'bg-white/85 text-slate-700 border-white/80 hover:bg-white'
        }`}
        title="Toggle Debug Visual Overlay (or press D)"
      >
        <Eye className="w-3.5 h-3.5" />
        <span>Debug Overlay (D)</span>
        <span
          className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-extrabold ${
            debugOverlay ? 'bg-amber-700 text-amber-100' : 'bg-slate-200 text-slate-700'
          }`}
        >
          {debugOverlay ? 'ON' : 'OFF'}
        </span>
      </button>

      {/* Live Debug HUD Card (Visible when Debug Overlay is Active) */}
      {debugOverlay && (
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 shadow-2xl text-slate-200 font-mono text-xs w-72 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-400 font-sans text-[11px] font-bold">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Cpu className="w-3.5 h-3.5" />
              SIMULATION ENGINE
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
              30Hz FIXED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400">FPS:</span>{' '}
              <span
                className={`font-bold ${
                  metrics.fps >= 55
                    ? 'text-emerald-400'
                    : metrics.fps >= 35
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {metrics.fps}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Ticks:</span>{' '}
              <span className="text-slate-100 font-bold">{metrics.ticks}</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-1.5 space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Car className="w-3 h-3 text-cyan-400" /> Vehicles:
              </span>
              <span>
                <strong className="text-cyan-300">{metrics.vehiclesMoving}</strong> moving /{' '}
                <strong className="text-slate-100">{metrics.vehiclesTotal}</strong> total
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Users className="w-3 h-3 text-purple-400" /> Pedestrians:
              </span>
              <span>
                <strong className="text-purple-300">{metrics.pedestriansMoving}</strong> moving /{' '}
                <strong className="text-slate-100">{metrics.pedestriansTotal}</strong> total
              </span>
            </div>
          </div>

          {/* Invariants Health Indicator */}
          <div className="border-t border-slate-800 pt-1.5 flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldAlert className="w-3 h-3 text-emerald-400" /> INVARIANTS:
            </span>
            {metrics.invariantViolations.length === 0 ? (
              <span className="text-emerald-400 font-bold">ALL 5 PASSING (0 errors)</span>
            ) : (
              <span className="text-rose-400 font-bold animate-pulse">
                {metrics.invariantViolations.length} VIOLATION(S)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
