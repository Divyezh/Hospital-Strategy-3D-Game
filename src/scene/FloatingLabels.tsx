'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { simEngine } from '@/sim/engine';
import { useSimStore } from '@/store/useSimStore';

export function FloatingLabels() {
  const followedAgentId = useSimStore((s) => s.followedAgentId);
  const events = useSimStore((s) => s.recentEvents);

  return (
    <group name="in-world-floating-labels">
      {/* 1. Floating Pill Tag above Forklifts / Orderlies */}
      {simEngine.orderlies.map((ord) => (
        <group key={`tag-${ord.id}`} position={[ord.position.x, 2.5, ord.position.z]}>
          <Html center distanceFactor={24} style={{ pointerEvents: 'none' }}>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-sm text-white text-[11px] font-bold shadow-lg whitespace-nowrap border border-blue-400/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{ord.id}</span>
              <span className="text-blue-100 font-normal">· {ord.label.split('·')[1] || 'Transport'}</span>
            </div>
          </Html>
        </group>
      ))}

      {/* 2. Floating Pin Marker above Bay Doors */}
      {[
        { name: 'Bay 1', pos: [-6.0, 4.8, 5.0] },
        { name: 'Bay 2', pos: [3.5, 4.8, 5.0] },
        { name: 'Bay 3', pos: [13.0, 4.8, 5.0] },
      ].map((bay, idx) => (
        <group key={`pin-${idx}`} position={bay.pos as [number, number, number]}>
          <Html center distanceFactor={28} style={{ pointerEvents: 'none' }}>
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white text-[10px] font-extrabold animate-bounce">
              ▼
            </div>
          </Html>
        </group>
      ))}

      {/* 3. Speech Bubble Event Popups (+1 PALLET / +1 ADMITTED) matching reference photo */}
      {events.slice(-4).map((evt) => (
        <group
          key={evt.id}
          position={[evt.position.x, 3.2, evt.position.z]}
        >
          <Html center distanceFactor={22} style={{ pointerEvents: 'none' }}>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/95 text-slate-800 text-[11px] font-extrabold rounded-lg shadow-xl border border-slate-200 whitespace-nowrap animate-in fade-in zoom-in-95">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{evt.text.toUpperCase()}</span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
