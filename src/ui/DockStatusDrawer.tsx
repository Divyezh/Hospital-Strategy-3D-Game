'use client';

import React, { useState } from 'react';
import { Layers, Truck, Cpu, Package, ChevronRight } from 'lucide-react';
import { useSimStore } from '@/store/useSimStore';
import { simEngine } from '@/sim/engine';
import { selectSiteSummary, selectSiteBays } from '@/sim/selectors';

type TabKey = 'bays' | 'tugs' | 'fleet' | 'supplies';

export function DockStatusDrawer() {
  const [activeTab, setActiveTab] = useState<TabKey>('bays');
  const activeSite = useSimStore((s) => s.activeSite);
  const flyToLocation = useSimStore((s) => s.flyToLocation);
  const selectElement = useSimStore((s) => s.selectElement);
  const setFollowedAgent = useSimStore((s) => s.setFollowedAgent);

  // Subscribe to sim stats updates
  useSimStore((s) => s.stats);

  const summary = selectSiteSummary(simEngine, activeSite.id);
  const bays = selectSiteBays(simEngine, activeSite.id);

  return (
    <div className="absolute bottom-4 right-4 z-30 pointer-events-auto hidden md:flex flex-col bg-white/90 backdrop-blur-xl rounded-2xl border border-white/80 shadow-2xl shadow-blue-950/10 p-3 min-w-95 max-w-105 select-none animate-in fade-in slide-in-from-bottom-2">
      {/* 4 Interactive Header Tabs */}
      <div className="flex items-center gap-1 pb-2 border-b border-slate-100">
        <button
          onClick={() => setActiveTab('bays')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bays'
              ? 'bg-[#1E60F3] text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Bays ({summary.busyBaysCount}/{summary.totalBaysCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('tugs')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tugs'
              ? 'bg-[#1E60F3] text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Tugs (2)</span>
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'fleet'
              ? 'bg-[#1E60F3] text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Fleet ({simEngine.ambulances.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supplies')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'supplies'
              ? 'bg-[#1E60F3] text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Supplies</span>
        </button>
      </div>

      {/* Tab 1: Bays List */}
      {activeTab === 'bays' && (
        <div className="pt-2 space-y-1.5 max-h-48 overflow-y-auto">
          {bays.map((bay) => {
            const isBusy = bay.status !== 'available';

            return (
              <div
                key={bay.id}
                onClick={() => {
                  selectElement({
                    id: bay.id,
                    type: 'bay',
                    name: `Bay ${bay.slotNumber}`,
                    siteId: activeSite.id,
                    status: bay.status,
                    details: {
                      docked: bay.ambulance?.id || 'None (Vacant)',
                      status: bay.status,
                    },
                  });
                  const bayDef = activeSite.bays.find((b) => b.slotNumber === bay.slotNumber);
                  const bayPos = bayDef ? bayDef.position : activeSite.center;
                  flyToLocation({ x: bayPos[0], y: 0, z: bayPos[2] }, 45);
                }}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-white border border-slate-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      bay.status === 'unloading'
                        ? 'bg-blue-600 animate-pulse'
                        : bay.status === 'docking'
                        ? 'bg-amber-500 animate-pulse'
                        : isBusy
                        ? 'bg-rose-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800">Bay {bay.slotNumber}</span>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {bay.ambulance?.id || 'Available for intake'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      bay.status === 'unloading'
                        ? 'bg-blue-100 text-blue-700'
                        : bay.status === 'docking'
                        ? 'bg-amber-100 text-amber-700'
                        : isBusy
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {bay.status.toUpperCase()}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Medical Logistics Tugs (Forklifts) */}
      {activeTab === 'tugs' && (
        <div className="pt-2 space-y-1.5 max-h-48 overflow-y-auto">
          {[
            { id: 'FL-01', model: 'Toyota 8FBE18', status: 'Unloading Bay 2', state: 'active', bat: '78%', pos: [-8, 0, 8] },
            { id: 'FL-02', model: 'Jungheinrich ETV', status: 'Charging at C1', state: 'charging', bat: '95%', pos: [14, 0, 8] },
          ].map((tug) => (
            <div
              key={tug.id}
              onClick={() => {
                setFollowedAgent({
                  id: tug.id,
                  name: `${tug.id} — ${tug.model}`,
                  type: 'orderly',
                  label: tug.status,
                  status: tug.state,
                  position: { x: tug.pos[0], y: 0, z: tug.pos[2] },
                  details: {
                    model: tug.model,
                    status: tug.status,
                    battery: tug.bat,
                    speed: '4.8 km/h',
                  },
                });
                flyToLocation({ x: tug.pos[0], y: 0, z: tug.pos[2] }, 40);
              }}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-white border border-slate-100 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    tug.state === 'charging' ? 'bg-emerald-500' : 'bg-blue-600 animate-pulse'
                  }`}
                />
                <div>
                  <span className="text-xs font-bold text-slate-800">{tug.id} · {tug.model}</span>
                  <p className="text-[10px] text-slate-400 font-medium">{tug.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                  {tug.bat}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    tug.state === 'charging' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {tug.state.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Fleet (Ambulances) */}
      {activeTab === 'fleet' && (
        <div className="pt-2 space-y-1.5 max-h-48 overflow-y-auto">
          {simEngine.ambulances.map((amb) => (
            <div
              key={amb.id}
              onClick={() => {
                setFollowedAgent({
                  id: amb.id,
                  name: `${amb.fleet} — ${amb.id}`,
                  type: 'ambulance',
                  siteId: amb.targetSiteId,
                  label: amb.label,
                  status: amb.state,
                  position: amb.position,
                  details: {
                    fleet: amb.fleet,
                    speed: `${amb.speed.toFixed(1)} km/h`,
                    targetBay: amb.targetBaySlot ? `Bay ${amb.targetBaySlot}` : 'En Route',
                  },
                });
                flyToLocation({ x: amb.position.x, y: 0, z: amb.position.z }, 42);
              }}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-white border border-slate-100 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    amb.state === 'UNLOADING'
                      ? 'bg-emerald-500'
                      : amb.state === 'DOCKING'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-blue-600'
                  }`}
                />
                <div>
                  <span className="text-xs font-bold text-slate-800">{amb.id}</span>
                  <p className="text-[10px] text-slate-400 font-medium">{amb.fleet} · {amb.state}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {amb.targetBaySlot ? `Bay ${amb.targetBaySlot}` : 'In yard'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Supplies Inventory */}
      {activeTab === 'supplies' && (
        <div className="pt-2 space-y-1.5 max-h-48 overflow-y-auto">
          {[
            { name: 'Nitrile Gloves (box 100)', count: '850 boxes', cat: 'PPE' },
            { name: 'Saline IV Bags 500mL', count: '480 bags', cat: 'Fluids' },
            { name: 'N95 Respirator Masks', count: '620 boxes', cat: 'PPE' },
            { name: 'Oxygen Cylinders (D-type)', count: '68 units', cat: 'Gas' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100"
            >
              <div>
                <span className="text-xs font-bold text-slate-800">{item.name}</span>
                <p className="text-[10px] text-slate-400 font-medium">{item.cat}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
