'use client';

import React from 'react';
import { Truck, X, Crosshair, Cpu, Layers, Battery, MapPin, Gauge, Package, Zap } from 'lucide-react';
import { useSimStore } from '@/store/useSimStore';

export function AgentInspector() {
  const selectedAgent = useSimStore((s) => s.selectedAgent);
  const selectedElement = useSimStore((s) => s.selectedElement);
  const clearFollowedAgent = useSimStore((s) => s.clearFollowedAgent);
  const clearSelection = useSimStore((s) => s.clearSelection);
  const flyToLocation = useSimStore((s) => s.flyToLocation);

  // Check if either an agent or a site element is selected
  const hasSelection = !!selectedAgent || !!selectedElement;
  if (!hasSelection) return null;

  const handleClose = () => {
    clearFollowedAgent();
    clearSelection();
  };

  const handleFocus = () => {
    if (selectedAgent) {
      flyToLocation(selectedAgent.position, 38);
    }
  };

  // 1. If an AGENT is selected (Ambulance, Logistics Tug, Orderly, etc.)
  if (selectedAgent) {
    const isAmbulance = selectedAgent.type === 'ambulance';
    const isTug = selectedAgent.type === 'orderly';
    const details = selectedAgent.details || {};

    return (
      <aside className="absolute top-20 right-4 z-40 pointer-events-auto w-84 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/80 shadow-2xl shadow-blue-950/10 p-4 select-none animate-in fade-in slide-in-from-right-3">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${
                isAmbulance ? 'bg-blue-50 text-[#1E60F3]' : 'bg-amber-50 text-amber-600'
              }`}
            >
              {isAmbulance ? <Truck className="w-5 h-5 stroke-[2.2]" /> : <Cpu className="w-5 h-5 stroke-[2.2]" />}
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-[#1E60F3] uppercase tracking-wider">
                {isAmbulance ? 'AMBULANCE FLEET' : 'LOGISTICS TUG / FORKLIFT'}
              </div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                {selectedAgent.name || selectedAgent.id}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {details.model || (isAmbulance ? 'Mercedes Sprinter High-Roof' : 'Toyota 8FBE18 Electric')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={handleFocus}
              title="Focus camera"
              className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Crosshair className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              title="Close inspector"
              className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Status & Battery Progress */}
        <div className="py-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                selectedAgent.status === 'UNLOADING' || selectedAgent.status === 'Loading truck'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : selectedAgent.status === 'DOCKING'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {selectedAgent.status}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <Battery className="w-3.5 h-3.5 text-emerald-500" />
              <span>{details.battery || '85%'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-700 font-semibold mb-2">
            {selectedAgent.label}
          </p>

          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[85%]" />
          </div>
        </div>

        {/* Telemetry Metrics Table */}
        <div className="pt-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-slate-400" /> Carrying
            </span>
            <span className="text-slate-800 font-semibold">{details.carrying || details.cargo || 'Empty / Staged'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400" /> Speed
            </span>
            <span className="text-slate-800 font-semibold">{details.speed || '4.8 km/h'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Assigned Bay
            </span>
            <span className="text-blue-600 font-bold">{details.assignedBay || details.targetBay || 'Bay 2 (Active)'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-slate-400" /> EV Charger
            </span>
            <span className="text-slate-800 font-semibold">C1 (Fast DC 120kW)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Operations Center</span>
            <span className="text-slate-800 font-semibold">City General Hospital</span>
          </div>
        </div>
      </aside>
    );
  }

  // 2. If a SITE ELEMENT is selected (Dock Bay, EV Charger, Medical Pallet)
  if (!selectedElement) return null;

  const isBay = selectedElement.type === 'bay';
  const isCharger = selectedElement.id?.includes('charger');
  const details = selectedElement.details || {};

  return (
    <aside className="absolute top-20 right-4 z-40 pointer-events-auto w-84 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/80 shadow-2xl shadow-blue-950/10 p-4 select-none animate-in fade-in slide-in-from-right-3">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${
              isBay ? 'bg-blue-50 text-[#1E60F3]' : isCharger ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            {isBay ? <Layers className="w-5 h-5 stroke-[2.2]" /> : isCharger ? <Zap className="w-5 h-5 stroke-[2.2]" /> : <Package className="w-5 h-5 stroke-[2.2]" />}
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-[#1E60F3] uppercase tracking-wider">
              {isBay ? 'DOCK DOOR WITH LEVELER' : isCharger ? 'EV CHARGING STATION' : 'PALLET STAGING YARD'}
            </div>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              {selectedElement.name}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              {details.purpose || details.model || details.category || 'Hospital Campus Facility'}
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-1.5 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Status Pill */}
      <div className="py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            {selectedElement.status || 'Active & Online'}
          </span>
          <span className="text-[11px] font-bold text-slate-500">Live Telemetry</span>
        </div>
      </div>

      {/* Details Table */}
      <div className="pt-3 space-y-2 text-xs">
        {Object.entries(details).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-slate-400 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <span className="text-slate-800 font-semibold">{String(val)}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
